import { createHash } from "node:crypto";
import { access, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const directory = path.join(root, "public", "assets", "posts");
const cachePath = path.join(root, "reports", "responsive-image-cache.json");
const widths = [480, 720, 1440];
let generated = 0;
let cache = {};
try {
  cache = JSON.parse(await readFile(cachePath, "utf8"));
} catch {
  cache = {};
}
const nextCache = {};

async function walk(current) {
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const file = path.join(current, entry.name);
    if (entry.isDirectory()) {
      await walk(file);
      continue;
    }
    if (!/\.(?:png|jpe?g)$/i.test(entry.name) || /\.w\d+\.webp$/i.test(entry.name)) continue;
    const image = sharp(file);
    const metadata = await image.metadata();
    const sourceHash = createHash("sha256")
      .update(await readFile(file))
      .digest("hex");
    const relativePath = path.relative(directory, file).split(path.sep).join("/");
    for (const width of widths) {
      const output = `${file}.w${width}.webp`;
      const key = `${relativePath}@${width}`;
      if (width > (metadata.width ?? 0)) {
        await rm(output, { force: true });
        continue;
      }
      const hash = createHash("sha256")
        .update(
          JSON.stringify({
            sourceHash,
            width,
            format: "webp",
            quality: 82,
            sharp: sharp.versions.sharp,
          }),
        )
        .digest("hex");
      nextCache[key] = hash;
      let exists = true;
      try {
        await access(output);
      } catch {
        exists = false;
      }
      if (!exists || cache[key] !== hash) {
        await sharp(file)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 82 })
          .toFile(output);
        generated += 1;
      }
    }
  }
}

await walk(directory);
await mkdir(path.dirname(cachePath), { recursive: true });
await writeFile(cachePath, `${JSON.stringify(nextCache, null, 2)}\n`);
console.log(`Generated ${generated} responsive WebP images.`);
