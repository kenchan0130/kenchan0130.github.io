// ビルド結果を再利用するためのキャッシュの置き場所。プロジェクトのルートからの相対パスで、
// astro.config.tsのcacheDirとOGP画像のキャッシュ（src/lib/og.ts）で共有する。
// 変更するときは、.github/workflows/ci.ymlのactions/cacheのpathも合わせる。
export const CACHE_DIR = "node_modules/.astro";
