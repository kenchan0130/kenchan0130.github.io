import path from "node:path";
import sharp from "sharp";
import { collectResponsiveImages } from "./lib/responsive-images.mjs";

// コミットされたWebPが記事画像と対応しているかを確認する。WebPの生成はしない。
const root = process.cwd();
const { expected, existing } = await collectResponsiveImages();
const outputs = new Set(expected.map(({ output }) => output));
const existingFiles = new Set(existing);
const errors = [];

for (const { width, output } of expected) {
  const relativePath = path.relative(root, output);
  if (!existingFiles.has(output)) {
    errors.push(`WebPがありません: ${relativePath}`);
    continue;
  }
  const metadata = await sharp(output).metadata();
  if (metadata.format !== "webp" || metadata.width !== width) {
    errors.push(`WebPの形式または幅が異なります: ${relativePath}`);
  }
}

for (const file of existing.filter((file) => !outputs.has(file))) {
  errors.push(`対応する記事画像がないWebPがあります: ${path.relative(root, file)}`);
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  console.error(
    "`pnpm optimize:images`を実行し、生成されたWebPをコミットしてください。同じファイル名で画像を差し替えた場合は`--force`を付けます。",
  );
  process.exitCode = 1;
} else {
  console.log(`Verified ${expected.length} responsive WebP images.`);
}
