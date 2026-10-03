// D2図の文字幅計算と埋め込みに使うNoto Sans JPのサブセットを生成する。
// google/fontsの可変フォントを固定したコミットから取得し、チェックサムを確認してから、
// 400と700のウェイトを切り出して、英数字、記号、かな、JIS X 0208の文字に絞る。
// HarfBuzzはウェイトを固定してもname tableを更新しないため、フォント名は元の既定値のままになる。

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const commit = "66a36c8c94b1a5d992ee4e7f392fccfe4945767c";
const baseUrl = `https://raw.githubusercontent.com/google/fonts/${commit}/ofl/notosansjp`;
const sources = {
  font: {
    url: `${baseUrl}/NotoSansJP%5Bwght%5D.ttf`,
    sha256: "c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f",
  },
  license: {
    url: `${baseUrl}/OFL.txt`,
    sha256: "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
  },
};
const outputDirectory = path.join(process.cwd(), "src", "assets", "fonts", "d2");

const ranges = [
  [0x0020, 0x007e], // ASCII
  [0x00a0, 0x00ff], // Latin-1 Supplement
  [0x2000, 0x206f], // General Punctuation
  [0x2190, 0x21ff], // Arrows
  [0x2200, 0x22ff], // Mathematical Operators
  [0x2460, 0x24ff], // Enclosed Alphanumerics
  [0x2500, 0x25ff], // Box Drawing, Block Elements, Geometric Shapes
  [0x3000, 0x30ff], // CJK Symbols and Punctuation, Hiragana, Katakana
  [0xff00, 0xffef], // Halfwidth and Fullwidth Forms
];

async function download({ url, sha256 }) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ダウンロードに失敗しました: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const actual = createHash("sha256").update(buffer).digest("hex");
  if (actual !== sha256) {
    throw new Error(`チェックサムが一致しません: ${url} (${actual})`);
  }
  return buffer;
}

function jisX0208Characters() {
  const decoder = new TextDecoder("euc-jp", { fatal: true });
  const characters = new Set();
  for (let first = 0xa1; first <= 0xfe; first++) {
    for (let second = 0xa1; second <= 0xfe; second++) {
      try {
        characters.add(decoder.decode(Uint8Array.of(first, second)));
      } catch {
        // JIS X 0208で未定義の区点は対象外にする。
      }
    }
  }
  return characters;
}

const characters = jisX0208Characters();
for (const [start, end] of ranges) {
  for (let codePoint = start; codePoint <= end; codePoint++) {
    characters.add(String.fromCodePoint(codePoint));
  }
}
const text = [...characters].join("");

const [font, license] = await Promise.all([download(sources.font), download(sources.license)]);
await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, "OFL.txt"), license);
for (const [weight, name] of [
  [400, "Regular"],
  [700, "Bold"],
]) {
  const subset = await subsetFont(font, text, {
    targetFormat: "truetype",
    variationAxes: { wght: weight },
  });
  await writeFile(path.join(outputDirectory, `NotoSansJP-${name}.ttf`), subset);
  console.log(`NotoSansJP-${name}.ttf: ${subset.byteLength} bytes`);
}
