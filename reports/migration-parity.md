# Jekyll → Astro コンテンツ移行レポート

- 変換元の記事数: 51
- 移行済みの記事数: 51
- Astroの記事総数: 51
- 不一致: 0

## 意図した変換

- Kramdownの目次マーカーを削除し、Astroの見出し情報から生成
- `asset_path` と `post_url` を静的URLへ変換
- LiquidのrevisionをMDXコンポーネントへ変換
- コメントブロックを削除し、iframeを静的リンクカードへ変換
- 表示に使わないcoverとJekyll専用layoutをfrontmatterから削除

## 要確認

- なし
