import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { isPublicPost } from "../src/lib/publication.ts";

const root = process.cwd();
const contentDirectory = path.join(root, "src", "content", "posts");
const distDirectory = path.join(root, "dist");
const postDirectory = path.join(distDirectory, "post");

const publishedSlugs = [];
const unpublishedSlugs = [];
for (const file of (await readdir(contentDirectory))
  .filter((name) => name.endsWith(".mdx"))
  .sort()) {
  const slug = path.basename(file, ".mdx");
  const { data } = matter(await readFile(path.join(contentDirectory, file), "utf8"));
  (isPublicPost(data) ? publishedSlugs : unpublishedSlugs).push(slug);
}

const generatedSlugs = (await readdir(postDirectory))
  .filter((name) => name.endsWith(".html"))
  .map((name) => path.basename(name, ".html"))
  .sort();
const missing = publishedSlugs.filter((slug) => !generatedSlugs.includes(slug));
const unexpected = generatedSlugs.filter((slug) => !publishedSlugs.includes(slug));
const errors = [
  ...missing.map((slug) => `公開記事が生成されていません: ${slug}`),
  ...unexpected.map((slug) => `未公開の記事ページが生成されています: ${slug}`),
];

async function collectHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectHtmlFiles(target)));
    } else if (entry.name.endsWith(".html")) {
      files.push(target);
    }
  }
  return files;
}

for (const file of await collectHtmlFiles(distDirectory)) {
  const html = await readFile(file, "utf8");
  if (/href="\/post\/[^"]*\.html"/.test(html)) {
    errors.push(`記事へのリンクに.htmlが含まれています: ${path.relative(root, file)}`);
  }
  if (/<p\b[^>]*>\s*<figure\b/.test(html)) {
    errors.push(`p要素内にfigure要素が生成されています: ${path.relative(root, file)}`);
  }
}

for (const slug of unpublishedSlugs) {
  try {
    await access(path.join(distDirectory, "og", `${slug}.png`));
    errors.push(`未公開記事のOGPが生成されています: ${slug}`);
  } catch {
    // 下書きの公開ファイルが存在しないことを確認している。
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Verified ${publishedSlugs.length} generated article pages.`);
}
