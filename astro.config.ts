import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import astroD2 from "astro-d2";
import expressiveCode from "astro-expressive-code";
import type { ExpressiveCodePlugin } from "astro-expressive-code";
import { centerD2Containers, d2DiagramMarkup, d2DiagramSources } from "./src/lib/d2-diagrams";
import { scrollableTables } from "./src/lib/scrollable-tables";

const focusableCodeBlocks: ExpressiveCodePlugin = {
  name: "Focusable code blocks",
  hooks: {
    postprocessRenderedBlock({ renderData }) {
      const elements = [renderData.blockAst];
      while (elements.length > 0) {
        const element = elements.pop();
        if (!element) continue;
        if (element.tagName === "pre") element.properties.tabIndex = 0;
        for (const child of element.children) {
          if (child.type === "element") elements.push(child);
        }
      }
    },
  },
};

export default defineConfig({
  site: "https://kenchan0130.github.io",
  trailingSlash: "never",
  build: {
    format: "file",
  },
  integrations: [
    astroD2({
      experimental: { useD2js: true, transformDiagram: centerD2Containers },
      fonts: {
        regular: "src/assets/fonts/d2/NotoSansJP-Regular.ttf",
        italic: "src/assets/fonts/d2/NotoSansJP-Regular.ttf",
        bold: "src/assets/fonts/d2/NotoSansJP-Bold.ttf",
      },
      inline: true,
      layout: "elk",
      pad: 16,
      theme: { default: "0", dark: false },
    }),
    expressiveCode({
      themes: ["github-light", "github-dark"],
      plugins: [focusableCodeBlocks],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => `[data-theme="${theme.type}"]`,
      defaultProps: {
        overridesByLang: {
          "ansi,bash,bat,batch,cmd,console,fish,nu,nushell,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,zsh":
            { frame: "none" },
        },
      },
      styleOverrides: {
        borderColor: ({ theme }) => (theme.type === "dark" ? "#30363d" : "#d0d7de"),
        borderRadius: "0.5rem",
        codeBackground: ({ theme }) => (theme.type === "dark" ? "#161b22" : "#f6f8fa"),
        codeFontFamily: "var(--font-mono)",
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith("/search"),
    }),
  ],
  markdown: {
    processor: satteri({
      mdastPlugins: [d2DiagramSources],
      hastPlugins: [d2DiagramMarkup, scrollableTables],
    }),
    shikiConfig: {
      wrap: false,
    },
  },
  vite: {
    build: {
      rolldownOptions: {},
    },
  },
});
