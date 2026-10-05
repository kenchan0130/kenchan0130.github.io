interface TableNode {
  type: "element";
  tagName: "table";
}

interface PluginContext {
  wrapNode(node: unknown, parentNode: unknown): void;
}

// 狭い画面では表を横にスクロールさせる。table要素そのものをスクロール領域にすると
// キーボードで操作できないため、D2図やコードブロックと同じくtabindexを付けたラッパーで包む。
export const scrollableTables = () => ({
  name: "scrollable-tables",
  element: {
    filter: ["table"],
    visit(node: TableNode, ctx: PluginContext) {
      ctx.wrapNode(node, {
        type: "element",
        tagName: "div",
        properties: { className: ["table-scroll"], tabindex: "0" },
        children: [],
      });
    },
  },
});
