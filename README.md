# kenchan0130 blog

[kenchan0130.github.io](https://kenchan0130.github.io) のソースです。Astroで静的生成し、
GitHub Pagesへデプロイします。

## Stack

- Astro 7 / MDX
- Go製TypeScript 7 CLI + Astro互換TypeScript 6 API / Vite with Rolldown
- pnpm 10 / Node.js 24 LTS
- Expressive Code + Shiki
- Pagefind
- Biome / textlint / Playwright + axe

## Development

Node.js 24とpnpm 10.34.5を用意します。Corepackは使用しません。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

記事は `src/content/posts/<YYYY-MM-DD-N>.mdx` に置きます。URLは
`/post/YYYY-MM-DD-N` です。画像は
`public/assets/posts/post/<YYYY-MM-DD-N>/` に置き、次を実行します。

```sh
pnpm optimize:images
pnpm og
```

共通のMDXコンポーネントとして `Revision` と `LinkCard` を利用できます。
記事内の任意のimport、export、iframe、Liquid記法はCIで拒否されます。

## Verification

```sh
pnpm format:check
pnpm lint
pnpm check
pnpm build
pnpm test:e2e
```

`main` ブランチへのpushで、GitHub Pagesの公式artifact/deployフローを使って
公開します。リポジトリのPages sourceは「GitHub Actions」に設定してください。

## License

文章と自作画像は [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja)、
サイト実装と記事内のコード例は [MIT License](LICENSE.md) です。
第三者の著作物には各権利者の条件が適用されます。
