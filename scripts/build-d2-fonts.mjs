// D2図の文字幅計算と埋め込みに使うNoto Sans JPを取得する。
// D2はHarfBuzzでサブセット化したフォントを読み込めず、警告なしで標準フォントで計算してしまうため、
// Google Fontsが配布するウェイト固定済みのTTFを加工せずに使う。
// ライセンスはgoogle/fontsの固定したコミットから取得する。いずれもチェックサムを確認する。

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { D2 } from "@d2lang/d2";

const sources = [
  {
    file: "NotoSansJP-Regular.ttf",
    url: "https://fonts.gstatic.com/s/notosansjp/v57/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75s.ttf",
    sha256: "f037d714109f22d57ce75fd9a6b9d23439c903061fb11106c070b2dcc03f2021",
  },
  {
    file: "NotoSansJP-Bold.ttf",
    url: "https://fonts.gstatic.com/s/notosansjp/v57/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75s.ttf",
    sha256: "59bb5d2915bba3a256950116e7a48a810bd8cde63793d5111b9e5726eec1e799",
  },
  {
    file: "OFL.txt",
    url: "https://raw.githubusercontent.com/google/fonts/66a36c8c94b1a5d992ee4e7f392fccfe4945767c/ofl/notosansjp/OFL.txt",
    sha256: "1c05c68c34f9708415aada51f17e1b0092d2cea709bf4a94cd38114f9e73d7d9",
  },
];
const outputDirectory = path.join(process.cwd(), "src", "assets", "fonts", "d2");

await mkdir(outputDirectory, { recursive: true });
for (const { file, url, sha256 } of sources) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ダウンロードに失敗しました: ${url} (${response.status})`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const actual = createHash("sha256").update(buffer).digest("hex");
  if (actual !== sha256) {
    throw new Error(`チェックサムが一致しません: ${url} (${actual})`);
  }
  await writeFile(path.join(outputDirectory, file), buffer);
  console.log(`${file}: ${buffer.byteLength} bytes`);
}

// D2がフォントを読み込めない場合は標準フォントで文字幅を計算するため、結果が変わることを確認する。
async function measureLabel(d2, options = {}) {
  const source = 'a -> b: 設定値を保存 {style.fill: "#000001"}';
  const result = await d2.compile({ fs: { "a.d2": source }, inputPath: "a.d2", options });
  const svg = await d2.render(result.diagram, result.renderOptions);
  const [width, height] = /<rect[^>]*width="([\d.]+)" height="([\d.]+)"[^>]*fill="#000001"/
    .exec(svg)
    .slice(1)
    .map(Number);
  return { width, height };
}

const d2 = new D2();
try {
  const fallback = await measureLabel(d2);
  for (const file of ["NotoSansJP-Regular.ttf", "NotoSansJP-Bold.ttf"]) {
    const font = [...(await readFile(path.join(outputDirectory, file)))];
    const custom = await measureLabel(d2, { fontRegular: font, fontItalic: font });
    const result = `${custom.width}x${custom.height} (標準フォント: ${fallback.width}x${fallback.height})`;
    // 読み込めない場合は、幅が標準フォントと同じになるか、日本語の高さを計算できず低くなる。
    if (custom.width === fallback.width || custom.height < fallback.height) {
      throw new Error(`D2が${file}を読み込めていません: ${result}`);
    }
    console.log(`${file}のD2での計測結果: ${result}`);
  }
} finally {
  await d2.dispose();
}
