import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const directory = path.join(root, "src", "content", "posts");
const baseline = {};

for (const file of (await readdir(directory)).filter((name) => name.endsWith(".mdx")).sort()) {
  const relative = path.posix.join("src/content/posts", file);
  baseline[relative] = createHash("sha256")
    .update(await readFile(path.join(directory, file)))
    .digest("hex");
}

await writeFile(
  path.join(root, ".textlint-baseline.json"),
  `${JSON.stringify(baseline, null, 2)}\n`,
);
console.log(`Recorded ${Object.keys(baseline).length} migrated articles.`);
