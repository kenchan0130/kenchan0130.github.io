import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import expressiveCode from "astro-expressive-code";
import mermaid from "astro-mermaid";
import type { ExpressiveCodePlugin } from "astro-expressive-code";

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
    mermaid({
      autoTheme: true,
      enableLog: false,
      mermaidConfig: {
        fontFamily: '"Noto Sans JP Variable", "Noto Sans JP", sans-serif',
        securityLevel: "strict",
      },
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
        borderRadius: "0.5rem",
        codeBackground: "var(--surface, #f6f8fa)",
        codeFontFamily: "var(--font-mono)",
      },
    }),
    mdx(),
    sitemap({
      filter: (page) => !page.endsWith("/search"),
    }),
  ],
  markdown: {
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
