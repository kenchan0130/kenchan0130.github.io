import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// 記事画像ごとに、src/components/PostImage.astroが参照するWebPの一覧を求める。
export const imageDirectory = path.join(process.cwd(), "public", "assets", "posts");
const widths = [480, 720, 1440];
const sourcePattern = /\.(?:png|jpe?g)$/i;
const variantPattern = /\.w\d+\.webp$/i;

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(file)));
    } else {
      files.push(file);
    }
  }
  return files;
}

// 元画像より大きい幅のWebPは作らない。
export async function collectResponsiveImages() {
  const files = await listFiles(imageDirectory);
  const expected = [];
  for (const source of files.filter((file) => sourcePattern.test(file))) {
    const { width: sourceWidth = 0 } = await sharp(source).metadata();
    for (const width of widths.filter((width) => width <= sourceWidth)) {
      expected.push({ source, width, output: `${source}.w${width}.webp` });
    }
  }
  const existing = files.filter((file) => variantPattern.test(file));
  return { expected, existing };
}
