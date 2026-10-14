import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { html } from "satori-html";
import sharp from "sharp";

let fontPromise: Promise<ArrayBuffer> | undefined;
let logoPromise: Promise<string> | undefined;

async function getFont(): Promise<ArrayBuffer> {
  fontPromise ??= readFile(
    path.join(process.cwd(), "scripts", "assets", "NotoSansCJKjp-Regular.otf"),
  ).then((buffer) => buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  return fontPromise;
}

async function getLogo(): Promise<string> {
  logoPromise ??= readFile(path.join(process.cwd(), "public", "assets", "icons", "logo.png")).then(
    (buffer) => `data:image/png;base64,${buffer.toString("base64")}`,
  );
  return logoPromise;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export interface OgOptions {
  title: string;
  category?: string;
  date?: string;
}

export async function createOgImage({ title, category = "Blog", date = "" }: OgOptions) {
  const fontData = await getFont();
  const fonts = [
    { name: "Noto Sans JP", data: fontData, weight: 400 as const, style: "normal" as const },
  ];
  const logo = await getLogo();
  const markup = html(`
    <div style="height:100%;width:100%;display:flex;flex-direction:column;justify-content:space-between;background:#0d1117;color:#f0f6fc;padding:64px 72px;font-family:Noto Sans JP">
      <div style="display:flex;align-items:center;gap:16px;color:#79c0ff;font-size:26px">
        <span style="display:flex;border:1px solid #3d444d;border-radius:999px;padding:7px 18px">${escapeHtml(category)}</span>
        <span style="display:flex;color:#9198a1">${escapeHtml(date)}</span>
      </div>
      <div style="display:flex;font-size:58px;font-weight:400;line-height:1.35;letter-spacing:-2px;max-width:1040px">${escapeHtml(title)}</div>
      <div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid #3d444d;padding-top:28px">
        <span style="display:flex;font-size:27px;color:#c9d1d9">kenchan0130 blog</span>
        <img src="${logo}" style="width:72px;height:72px" />
      </div>
    </div>
  `);
  const svg = await satori(markup as never, {
    width: 1200,
    height: 630,
    fonts,
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}

// OGP画像の生成はsatoriがCJKフォントを解析するため1枚0.5秒以上かかる。ビルドのたびに作り直さないよう、
// 記事ごとの入力と素材のハッシュが同じ画像をcacheDir（node_modules/.astro）に残して再利用する。
// CIではactions/cacheでこのディレクトリを持ち越す。
const cacheDirectory = path.join(process.cwd(), "node_modules", ".astro", "og");
const cacheVersion = 1;
let assetsHashPromise: Promise<string> | undefined;

async function getAssetsHash(): Promise<string> {
  assetsHashPromise ??= Promise.all(
    [
      path.join("scripts", "assets", "NotoSansCJKjp-Regular.otf"),
      path.join("public", "assets", "icons", "logo.png"),
      path.join("src", "lib", "og.ts"),
    ].map((file) => readFile(path.join(process.cwd(), file))),
  ).then((buffers) => {
    const hash = createHash("sha256");
    for (const buffer of buffers) hash.update(buffer);
    return hash.digest("hex");
  });
  return assetsHashPromise;
}

export async function getOgImage(slug: string, options: OgOptions): Promise<Buffer> {
  const hash = createHash("sha256")
    .update(JSON.stringify({ version: cacheVersion, assets: await getAssetsHash(), ...options }))
    .digest("hex")
    .slice(0, 16);
  const cachePath = path.join(cacheDirectory, `${slug}.${hash}.png`);
  try {
    return await readFile(cachePath);
  } catch {
    // キャッシュがなければ生成する。
  }
  const image = await createOgImage(options);
  await mkdir(cacheDirectory, { recursive: true });
  // 同じ記事の古い画像を消し、キャッシュが記事の数より増えないようにする。
  for (const file of await readdir(cacheDirectory)) {
    if (file.startsWith(`${slug}.`) && file !== path.basename(cachePath)) {
      await rm(path.join(cacheDirectory, file));
    }
  }
  await writeFile(cachePath, image);
  return image;
}
