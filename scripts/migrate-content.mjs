import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import { collectStats, transformBody } from "./lib/content-migration.mjs";

const root = process.cwd();
const sourceDirectory = path.join(root, "_posts", "post");
const targetDirectory = path.join(root, "src", "content", "posts");
const reportDirectory = path.join(root, "reports");

await mkdir(targetDirectory, { recursive: true });
await mkdir(reportDirectory, { recursive: true });

const files = (await readdir(sourceDirectory)).filter((file) => file.endsWith(".md")).sort();
const report = [];

for (const file of files) {
  const slug = path.basename(file, ".md");
  const source = await readFile(path.join(sourceDirectory, file), "utf8");
  const parsed = matter(source);
  const body = transformBody(parsed.content, slug);
  const data = {
    title: parsed.data.title,
    description: String(parsed.data.outline ?? "").trim(),
    published: slug.slice(0, 10),
    ...(parsed.data.updated ? { updated: parsed.data.updated } : {}),
    categories: parsed.data.categories ?? [],
    tags: parsed.data.tags ?? [],
    references: [],
    draft: false,
  };
  const output = `---\n${YAML.stringify(data, { lineWidth: 0 }).trim()} \n---\n\n${body}`;
  await writeFile(path.join(targetDirectory, `${slug}.mdx`), output);
  report.push({
    slug,
    metadata: {
      title: data.title,
      published: data.published,
      categories: data.categories,
      tags: data.tags,
    },
    before: collectStats(parsed.content),
    after: collectStats(body),
  });
}

await writeFile(
  path.join(reportDirectory, "content-migration.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), posts: report }, null, 2)}\n`,
);
console.log(`Converted ${files.length} posts to MDX.`);
