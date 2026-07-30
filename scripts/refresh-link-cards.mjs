import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ogs from "open-graph-scraper";

const root = process.cwd();
const contentDirectory = path.join(root, "src", "content", "posts");
const cachePath = path.join(root, "src", "data", "link-cards.json");
const cache = JSON.parse(await readFile(cachePath, "utf8"));
const files = await import("node:fs/promises").then(({ readdir }) => readdir(contentDirectory));
const urls = new Set();

for (const file of files.filter((name) => name.endsWith(".mdx"))) {
  const source = await readFile(path.join(contentDirectory, file), "utf8");
  for (const match of source.matchAll(/<LinkCard\s+href="([^"]+)"/g)) urls.add(match[1]);
}

for (const url of urls) {
  try {
    const { result } = await ogs({ url, timeout: 8000 });
    cache[url] = {
      title: result.ogTitle ?? new URL(url).hostname,
      description: result.ogDescription ?? "",
      siteName: result.ogSiteName ?? new URL(url).hostname,
      image: "",
    };
    console.log(`Updated ${url}`);
  } catch (error) {
    console.warn(`Skipped ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
