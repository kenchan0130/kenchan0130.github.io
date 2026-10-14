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
    // PNG・JPEGはビルド時にWebPへ変換するため、public/ではなくsrc/assets/posts/から参照する。
    if (/^\/assets\/posts\/\S+\.(?:png|jpe?g)(?:\s|$)/i.test(match[2])) {
      failures.push(
        `${file}: 記事の画像はsrc/assets/posts/記事ID/に置き、相対パスで参照してください (${match[2]})`,
      );
    }
  }
}

async function listFiles(target) {
  const entries = await readdir(target, { withFileTypes: true }).catch(() => []);
  const result = [];
  for (const entry of entries) {
    const file = path.join(target, entry.name);
    result.push(...(entry.isDirectory() ? await listFiles(file) : [file]));
  }
  return result;
}

for (const file of await listFiles(path.join(process.cwd(), "public", "assets", "posts"))) {
  if (/\.(?:png|jpe?g|webp)$/i.test(file)) {
    failures.push(
      `${path.relative(process.cwd(), file)}: 記事の画像はpublic/ではなくsrc/assets/posts/に置いてください`,
    );
  }
}

if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`Validated ${files.length} MDX posts.`);
}
