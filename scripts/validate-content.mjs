import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const directory = path.join(process.cwd(), "src", "content", "posts");
const files = (await readdir(directory)).filter((file) => file.endsWith(".mdx")).sort();
const failures = [];

for (const file of files) {
  const source = await readFile(path.join(directory, file), "utf8");
  const { content } = matter(source);
  const withoutCode = content.replace(/```[\s\S]*?```/g, "");
  if (/^\s*(?:import|export)\s/m.test(withoutCode)) {
    failures.push(`${file}: import/exportは記事内で使用できません`);
  }
  if (/\{%\s|\{\{\s/.test(withoutCode)) {
    failures.push(`${file}: Liquid記法が残っています`);
  }
  if (/<iframe\b/i.test(withoutCode)) {
    failures.push(`${file}: iframeは使用できません`);
  }
  for (const match of withoutCode.matchAll(/!\[([^\]]*)]\(([^)]+)\)/g)) {
    if (match[1].trim() === "") failures.push(`${file}: 画像altが空です (${match[2]})`);
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} MDX posts.`);
}
