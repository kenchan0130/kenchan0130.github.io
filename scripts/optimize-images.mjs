import { access, rm } from "node:fs/promises";
import sharp from "sharp";
import { collectResponsiveImages } from "./lib/responsive-images.mjs";

// 記事画像のレスポンシブ用WebPを生成する。生成したWebPはコミットし、ビルドでは生成しない。
// 既存のWebPは作り直さないため、同じファイル名で画像を差し替えた場合は--forceを付けて実行する。
const force = process.argv.includes("--force");
const { expected, existing } = await collectResponsiveImages();
const outputs = new Set(expected.map(({ output }) => output));
let generated = 0;
let removed = 0;

for (const { source, width, output } of expected) {
  if (!force) {
    try {
      await access(output);
      continue;
    } catch {
      // 未生成のWebPだけを作る。
    }
  }
  await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(output);
  generated += 1;
}

for (const file of existing.filter((file) => !outputs.has(file))) {
  await rm(file);
  removed += 1;
}

console.log(`Generated ${generated} and removed ${removed} responsive WebP images.`);
