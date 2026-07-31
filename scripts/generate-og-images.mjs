import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import matter from "gray-matter";
import { isPublicPost } from "../src/lib/publication.ts";
import { createOgImage } from "../src/lib/og.ts";

const root = process.cwd();
const contentDirectory = path.join(root, "src", "content", "posts");
const outputDirectory = path.join(root, "public", "og");
const cachePath = path.join(root, "reports", "og-cache.json");
const fontPath = path.join(root, "scripts", "assets", "NotoSansCJKjp-Regular.otf");
const logoPath = path.join(root, "public", "assets", "icons", "logo.png");

await mkdir(outputDirectory, { recursive: true });
await mkdir(path.dirname(cachePath), { recursive: true });

let cache = {};
try {
  cache = JSON.parse(await readFile(cachePath, "utf8"));
} catch {
  cache = {};
}

const assetsHash = createHash("sha256")
  .update(await readFile(fontPath))
  .update(await readFile(logoPath))
  .update(await readFile(path.join(root, "src", "lib", "og.ts")))
  .digest("hex");
const jobs = [{ slug: "default", title: "実装と運用の記録", category: "Blog", date: "" }];

for (const file of (await readdir(contentDirectory))
  .filter((name) => name.endsWith(".mdx"))
  .sort()) {
  const { data } = matter(await readFile(path.join(contentDirectory, file), "utf8"));
  if (!isPublicPost(data)) continue;
  jobs.push({
    slug: path.basename(file, ".mdx"),
    title: data.title,
    category: data.categories?.[0] ?? "Blog",
    date:
      data.published instanceof Date
        ? data.published.toISOString().slice(0, 10)
        : String(data.published),
  });
}

const expectedSlugs = new Set(jobs.map(({ slug }) => slug));
for (const file of await readdir(outputDirectory)) {
  if (!file.endsWith(".png")) continue;
  const slug = path.basename(file, ".png");
  if (expectedSlugs.has(slug)) continue;
  await rm(path.join(outputDirectory, file));
}
for (const slug of Object.keys(cache)) {
  if (!expectedSlugs.has(slug)) delete cache[slug];
}

let generated = 0;
const queue = [...jobs];
async function worker() {
  while (queue.length > 0) {
    const job = queue.shift();
    if (!job) return;
    const output = path.join(outputDirectory, `${job.slug}.png`);
    const hash = createHash("sha256")
      .update(JSON.stringify({ version: 3, assetsHash, ...job }))
      .digest("hex");
    let exists = true;
    try {
      await access(output);
    } catch {
      exists = false;
    }
    if (exists && cache[job.slug] === hash) continue;
    await writeFile(output, await createOgImage(job));
    cache[job.slug] = hash;
    generated += 1;
  }
}

await Promise.all(Array.from({ length: 4 }, () => worker()));
await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
console.log(`Generated ${generated} OGP images; reused ${jobs.length - generated}.`);
