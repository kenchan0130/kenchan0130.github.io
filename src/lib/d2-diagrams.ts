import { readFileSync } from "node:fs";
import type { Diagram, Point, Shape } from "@d2lang/d2";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { CONTINUE, SKIP, visit } from "unist-util-visit";

type HastRoot = ReturnType<typeof fromHtml>;
type Element = Extract<HastRoot["children"][number], { type: "element" }>;

// D2図の既定スタイルを補い、astro-d2がインライン出力したSVGをサイト向けに加工する。
// - mdastプラグイン: titleを集め、図のソースに既定スタイルを追記する（astro-d2より前に実行）
// - hastプラグイン: アイコンをSVG内に展開し、線のラベルや配色をCSSで切り替えられるようにする
// astro-d2 0.14.0のインライン出力ではtitleがSVGに反映されないため、ここで付与する。

interface CodeNode {
  type: "code";
  lang?: string | null;
  meta?: string | null;
  value: string;
}

interface JsxAttribute {
  type: string;
  name?: string;
  value?: unknown;
}

interface JsxFlowElement {
  type: "mdxJsxFlowElement";
  name: string | null;
  attributes: JsxAttribute[];
  children: unknown[];
}

interface RawNode {
  type: "raw";
  value: string;
}

interface PluginContext {
  readonly fileURL: URL | undefined;
  readonly data: Record<string, unknown>;
  replaceNode(node: unknown, newNode: unknown): void;
}

const titlesKey = "d2DiagramTitles";
const iconDirectory = new URL("../assets/d2-icons/", import.meta.url);
// 線のラベルの背景を識別するための色。出力時にCSSクラスへ置き換える。
const edgeLabelFill = "#d2d2d1";

// 記事側で個別に指定した値は、この既定値より優先される。
const defaultStyle = `
**: {
  &leaf: false
  !&shape: sql_table
  !&shape: class
  label.near: top-left
  style.font-size: 14
  style.bold: true
  style.stroke-width: 0
  style.border-radius: 16
}
**: {
  &shape: image
  width: 40
  height: 40
  style.font-size: 14
}
**: {
  &shape: sql_table
  style.font-size: 14
}
(** -> **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 2
  style.font-size: 12
  style.fill: "${edgeLabelFill}"
}
(** <- **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 2
  style.font-size: 12
  style.fill: "${edgeLabelFill}"
}
(** <-> **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 2
  style.font-size: 12
  style.fill: "${edgeLabelFill}"
}
(** -- **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 2
  style.font-size: 12
  style.fill: "${edgeLabelFill}"
}
`;

const directionPattern = /^direction:/m;
const titlePattern = /(?:^|\s)title=(?:"([^"]*)"|'([^']*)'|(\S+))/;
const sequenceDiagramPattern = /^shape:\s*sequence_diagram\s*$/m;
const iconHrefPattern = /^\/d2-icons\/([a-z0-9-]+)\.svg$/;

const icons = new Map<string, Element>();

function icon(name: string) {
  let svg = icons.get(name);
  if (svg === undefined) {
    const tree = fromHtml(readFileSync(new URL(`${name}.svg`, iconDirectory), "utf8"), {
      fragment: true,
    });
    svg = tree.children.find(
      (child): child is Element => child.type === "element" && child.tagName === "svg",
    );
    if (!svg) {
      throw new Error(`D2図のアイコンを読み込めません: ${name}`);
    }
    icons.set(name, svg);
  }
  return svg;
}

function filePath(ctx: PluginContext) {
  return ctx.fileURL?.pathname ?? "unknown file";
}

function titles(ctx: PluginContext): string[] {
  ctx.data[titlesKey] ??= [];
  return ctx.data[titlesKey] as string[];
}

function decorate(source: string, ctx: PluginContext) {
  const title = titles(ctx).shift();
  if (!title) {
    throw new Error(`D2図のtitleを対応付けられません: ${filePath(ctx)}`);
  }
  const tree = fromHtml(source, { fragment: true });
  let diagram: Element | undefined;

  visit(tree, "element", (node, index, parent) => {
    if (node.tagName === "svg" && "dataD2Version" in node.properties) {
      const width = String(node.properties.viewBox ?? "").split(/\s+/)[2];
      node.properties.role = "img";
      node.properties.ariaLabel = title;
      if (width) node.properties.style = `--d2-width: ${width}px`;
      diagram = node;
      return CONTINUE;
    }
    if (node.tagName === "image" && parent && index !== undefined) {
      const name = iconHrefPattern.exec(String(node.properties.href ?? ""))?.[1];
      if (!name) {
        throw new Error(`D2図のアイコンは/d2-icons/のSVGだけを使用できます: ${filePath(ctx)}`);
      }
      const source = icon(name);
      const { x, y, width, height } = node.properties;
      parent.children[index] = {
        ...structuredClone(source),
        properties: {
          ...source.properties,
          className: ["d2-icon"],
          x,
          y,
          width,
          height,
          strokeWidth: 1.6,
          ariaHidden: "true",
        },
      };
      return SKIP;
    }
    if (node.tagName === "rect" && node.properties.fill === edgeLabelFill) {
      delete node.properties.fill;
      node.properties.className = ["d2-edge-label"];
    }
    return CONTINUE;
  });

  if (!diagram) {
    throw new Error(`D2図のSVGが見つかりません: ${filePath(ctx)}`);
  }
  // 横長の図は狭い画面で縮小しすぎないよう、figureを横スクロールさせる。
  const figure: Element = {
    type: "element",
    tagName: "figure",
    properties: { className: ["d2-diagram"], tabIndex: 0 },
    children: [diagram],
  };
  return toHtml(figure);
}

// astro-d2より前に実行し、titleを集めて既定スタイルを追記する。
export const d2DiagramSources = () => ({
  name: "d2-diagram-sources",
  code(node: CodeNode, ctx: PluginContext) {
    if (node.lang !== "d2") return;
    const match = titlePattern.exec(node.meta ?? "");
    const title = match?.[1] ?? match?.[2] ?? match?.[3];
    if (!title) {
      throw new Error(`D2図にtitleがありません: ${filePath(ctx)}`);
    }
    titles(ctx).push(title);
    if (sequenceDiagramPattern.test(node.value)) return;
    // 線がコンテナの見出しを横切らないよう、向きの指定がなければ横向きにする。
    const direction = directionPattern.test(node.value) ? "" : "direction: right\n";
    ctx.replaceNode(node, { ...node, value: `${node.value}\n${direction}${defaultStyle}` });
  },
});

// astro-d2が出力したSVG（MDXでは`<Fragment set:html>`、Markdownでは生のHTML）を加工する。
export const d2DiagramMarkup = () => ({
  name: "d2-diagram-markup",
  mdxJsxFlowElement: {
    filter: ["Fragment"],
    visit(node: JsxFlowElement, ctx: PluginContext) {
      const attribute = node.attributes.find((item) => item.name === "set:html");
      if (typeof attribute?.value !== "string" || !attribute.value.includes("data-d2-version"))
        return;
      ctx.replaceNode(node, {
        ...node,
        attributes: [{ ...attribute, value: decorate(attribute.value, ctx) }],
      });
    },
  },
  raw(node: RawNode, ctx: PluginContext) {
    if (!node.value.includes("data-d2-version")) return;
    ctx.replaceNode(node, { type: "raw", value: decorate(node.value, ctx) });
  },
});

// レイアウト後の図（D2.jsのJSON）を描画前に補正し、各コンテナの直下の要素（外側のラベルを含む）をコンテナの中央に寄せる。
// D2のgridはセルを行・列の最大サイズに広げるが中身は左上のままで、ELKは画像の下のラベルを右側にだけ見込むため、
// そのままでは中身が左上に偏る。
const LABEL_PAD = 5;
function labelSize(s: Shape) {
  return "labelWidth" in s
    ? { width: s.labelWidth, height: s.labelHeight }
    : { width: 0, height: 0 };
}

function visualBox(s: Shape) {
  let x1 = s.pos.x,
    y1 = s.pos.y,
    x2 = s.pos.x + s.width,
    y2 = s.pos.y + s.height;
  const { width: lw, height: lh } = labelSize(s);
  const lp = s.labelPosition ?? "";
  if (lw > 0 && lp.startsWith("OUTSIDE_BOTTOM")) {
    const cx = s.pos.x + s.width / 2;
    x1 = Math.min(x1, cx - lw / 2);
    x2 = Math.max(x2, cx + lw / 2);
    y2 = Math.max(y2, s.pos.y + s.height + LABEL_PAD + lh);
  } else if (lw > 0 && lp.startsWith("OUTSIDE_TOP")) {
    const cx = s.pos.x + s.width / 2;
    x1 = Math.min(x1, cx - lw / 2);
    x2 = Math.max(x2, cx + lw / 2);
    y1 = Math.min(y1, s.pos.y - LABEL_PAD - lh);
  }
  return { x1, y1, x2, y2 };
}
export function centerD2Containers(diagram: Diagram) {
  const shapes = diagram.shapes;
  const byId = new Map(shapes.map((s) => [s.id, s]));
  const parentOf = (id: string) => (id.includes(".") ? id.slice(0, id.lastIndexOf(".")) : null);
  const children = new Map<string, Shape[]>();
  for (const s of shapes) {
    const p = parentOf(s.id);
    if (p && byId.has(p)) (children.get(p) ?? children.set(p, []).get(p)!).push(s);
  }
  for (const [cid, kids] of children) {
    const c = byId.get(cid)!;
    if (c.type === "sql_table" || c.type === "class") continue;
    const box = kids.map(visualBox).reduce((a, b) => ({
      x1: Math.min(a.x1, b.x1),
      y1: Math.min(a.y1, b.y1),
      x2: Math.max(a.x2, b.x2),
      y2: Math.max(a.y2, b.y2),
    }));
    const lp = c.labelPosition ?? "";
    let top = c.pos.y,
      bottom = c.pos.y + c.height,
      left = c.pos.x,
      right = c.pos.x + c.width;
    const dx = Math.round((left + right) / 2 - (box.x1 + box.x2) / 2);
    let dy = Math.round((top + bottom) / 2 - (box.y1 + box.y2) / 2);
    // Never move content up into the container label; only recenter when there is slack.
    const labelHeight = labelSize(c).height;
    if (labelHeight > 0 && lp.startsWith("INSIDE_TOP")) {
      const minTop = c.pos.y + labelHeight + 2 * LABEL_PAD;
      if (box.y1 + dy < minTop) dy = Math.max(0, Math.round(minTop - box.y1));
    }
    if (dx === 0 && dy === 0) continue;
    const inside = new Set(shapes.filter((s) => s.id.startsWith(cid + ".")).map((s) => s.id));
    for (const id of inside) {
      const s = byId.get(id)!;
      s.pos.x += dx;
      s.pos.y += dy;
    }
    const within = (p: Point) =>
      p.x >= c.pos.x && p.x <= c.pos.x + c.width && p.y >= c.pos.y && p.y <= c.pos.y + c.height;
    for (const e of diagram.connections ?? []) {
      const srcIn = inside.has(e.src),
        dstIn = inside.has(e.dst);
      if (!srcIn && !dstIn) continue;
      const r = e.route;
      if (srcIn && dstIn) {
        for (const p of r) {
          p.x += dx;
          p.y += dy;
        }
        continue;
      }
      // Partially inside: shift points inside the container box, then keep adjacent segments orthogonal.
      const moved = r.map((p) => within(p));
      for (const [i, p] of r.entries()) {
        if (moved[i]) {
          p.x += dx;
          p.y += dy;
        }
      }
      for (let i = 0; i < r.length - 1; i++) {
        const a = r[i],
          b = r[i + 1];
        if (moved[i] === moved[i + 1] || r.length === 2) continue;
        const [m, f, fi] = moved[i] ? ([a, b, i + 1] as const) : ([b, a, i] as const);
        const endpoint = fi === 0 || fi === r.length - 1;
        if (endpoint) continue;
        if (Math.abs(a.x - b.x) <= Math.abs(dx)) f.x = m.x;
        else f.y = m.y;
      }
    }
  }
}
