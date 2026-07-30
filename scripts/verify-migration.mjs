import { access, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { transformBody } from "./lib/content-migration.mjs";

const root = process.cwd();
const oldDirectory = path.join(root, "_posts", "post");
const newDirectory = path.join(root, "src", "content", "posts");
const reportPath = path.join(root, "reports", "migration-parity.md");

const oldFiles = (await readdir(oldDirectory)).filter((file) => file.endsWith(".md")).sort();
const newFiles = (await readdir(newDirectory)).filter((file) => file.endsWith(".mdx")).sort();
const discrepancies = [];

for (const oldFile of oldFiles) {
  const slug = path.basename(oldFile, ".md");
  const newFile = `${slug}.mdx`;
  try {
    await access(path.join(newDirectory, newFile));
  } catch {
    discrepancies.push(`${slug}: 変換後の記事がありません`);
    continue;
  }
  const before = matter(await readFile(path.join(oldDirectory, oldFile), "utf8"));
  const after = matter(await readFile(path.join(newDirectory, newFile), "utf8"));
  if (before.data.title !== after.data.title) {
    discrepancies.push(`${slug}: タイトルが一致しません`);
  }
  const published =
    after.data.published instanceof Date
      ? after.data.published.toISOString().slice(0, 10)
      : String(after.data.published);
  if (slug.slice(0, 10) !== published) {
    discrepancies.push(`${slug}: 公開日がファイル名と一致しません`);
  }
  if (
    JSON.stringify(before.data.categories ?? []) !== JSON.stringify(after.data.categories ?? [])
  ) {
    discrepancies.push(`${slug}: カテゴリが一致しません`);
  }
  if (JSON.stringify(before.data.tags ?? []) !== JSON.stringify(after.data.tags ?? [])) {
    discrepancies.push(`${slug}: タグが一致しません`);
  }
  const expectedBody = transformBody(before.content, slug);
  const migratedBody = after.content.replace(/^\r?\n/, "");
  if (migratedBody !== expectedBody) {
    discrepancies.push(`${slug}: 本文が移行処理の結果と一致しません`);
  }
  if (/\{%|\{\{/.test(after.content.replace(/```[\s\S]*?```/g, ""))) {
    discrepancies.push(`${slug}: コードブロック外にLiquidが残っています`);
  }
}

const migratedFiles = newFiles.filter((newFile) =>
  oldFiles.includes(`${path.basename(newFile, ".mdx")}.md`),
);

const report = `# Jekyll → Astro コンテンツ移行レポート

- 変換元の記事数: ${oldFiles.length}
- 移行済みの記事数: ${migratedFiles.length}
- Astroの記事総数: ${newFiles.length}
- 不一致: ${discrepancies.length}

## 意図した変換

- Kramdownの目次マーカーを削除し、Astroの見出し情報から生成
- \`asset_path\` と \`post_url\` を静的URLへ変換
- LiquidのrevisionをMDXコンポーネントへ変換
- コメントブロックを削除し、iframeを静的リンクカードへ変換
- 表示に使わないcoverとJekyll専用layoutをfrontmatterから削除

## 要確認

${discrepancies.length === 0 ? "- なし" : discrepancies.map((item) => `- ${item}`).join("\n")}
`;
await writeFile(reportPath, report);
console.log(
  `Checked ${oldFiles.length} → ${migratedFiles.length} migrated posts (${newFiles.length} total); ${discrepancies.length} discrepancies.`,
);
if (oldFiles.length !== migratedFiles.length || discrepancies.length > 0) process.exitCode = 1;
