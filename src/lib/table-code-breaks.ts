// hastの型パッケージは直接の依存関係ではないため、このプラグインで使う範囲だけを定義する。
interface Text {
  type: "text";
  value: string;
}

interface Element {
  type: "element";
  tagName: string;
  properties: Record<string, unknown>;
  children: ElementContent[];
}

type ElementContent = Element | Text | { type: "comment"; value: string };

type Parents = Element | { type: "root"; children: ElementContent[] };

interface PluginContext {
  parent(node: Readonly<Element>): Readonly<Parents> | undefined;
  replaceNode(node: Readonly<Element>, newNode: Element): void;
}

// パスやOMA-URIのように長いインラインコードは、区切り文字の直後でだけ折り返せるようにする。
// 表のセルでは、`/`、`\`、`~`、`.`の直後と`<`の直前にwbr要素を入れ、CSS側で`white-space: nowrap`を外す。
// 区切り文字のない識別子（`REG_DWORD`など）は折り返し位置が増えないため、途中で切れない。
// 空要素のwbrはコピーした文字列に含まれないため、ゼロ幅スペースと違って貼り付け時に残らない。
const separators = /(?<=[/\\~])(?![/\\~>])|(?<=[A-Za-z]\.)(?=[A-Za-z])|(?<=.)(?=<)/;

const cellTagNames = new Set(["td", "th"]);

const isInTableCell = (node: Readonly<Element>, ctx: PluginContext): boolean => {
  let current: Readonly<Parents> | undefined = ctx.parent(node);
  while (current && current.type === "element") {
    if (cellTagNames.has(current.tagName)) return true;
    if (current.tagName === "pre" || current.tagName === "table") return false;
    current = ctx.parent(current);
  }
  return false;
};

const splitText = (text: Text): ElementContent[] => {
  const parts = text.value.split(separators).filter((part: string) => part !== "");
  const children: ElementContent[] = [];
  for (const part of parts) {
    if (children.length > 0) {
      children.push({ type: "element", tagName: "wbr", properties: {}, children: [] });
    }
    children.push({ type: "text", value: part });
  }
  return children;
};

export const tableCodeBreaks = () => ({
  name: "table-code-breaks",
  element: {
    filter: ["code"],
    visit(node: Readonly<Element>, ctx: PluginContext) {
      if (!isInTableCell(node, ctx)) return;
      const children = node.children.flatMap((child: ElementContent) =>
        child.type === "text" ? splitText(child) : [child],
      );
      if (children.length === node.children.length) return;
      ctx.replaceNode(node, {
        type: "element",
        tagName: "code",
        properties: node.properties,
        children,
      });
    },
  },
});
