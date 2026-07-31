import { readFile } from "node:fs/promises";
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

interface OgOptions {
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
