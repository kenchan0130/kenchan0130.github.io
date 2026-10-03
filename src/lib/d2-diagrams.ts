import { readFileSync } from "node:fs";
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
  style.font-size: 16
  style.bold: true
  style.stroke-width: 0
  style.border-radius: 16
}
**: {
  &shape: image
  width: 56
  height: 56
}
(** -> **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 3
  style.font-size: 14
  style.fill: "${edgeLabelFill}"
}
(** <- **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 3
  style.font-size: 14
  style.fill: "${edgeLabelFill}"
}
(** <-> **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 3
  style.font-size: 14
  style.fill: "${edgeLabelFill}"
}
(** -- **)[*]: {
  style.stroke-dash: 3
  style.stroke-width: 3
  style.font-size: 14
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
