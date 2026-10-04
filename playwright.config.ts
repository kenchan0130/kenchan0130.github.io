import { defineConfig, devices } from "@playwright/test";

const fullBrowsers = process.env.FULL_BROWSERS === "true";
// CIではランナーにプリインストールされたGoogle Chrome（channel: "chrome"）を使い、ブラウザのダウンロードを省く。
// 指定がない場合は、Playwrightのバージョンに対応するブラウザを使う。
const chromiumChannel = process.env.PLAYWRIGHT_CHROMIUM_CHANNEL || undefined;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: fullBrowsers
    ? [
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
      ]
    : [
        { name: "chromium", use: { ...devices["Desktop Chrome"], channel: chromiumChannel } },
        { name: "mobile-chromium", use: { ...devices["Pixel 7"], channel: chromiumChannel } },
      ],
  webServer: {
    command: "pnpm preview --host 127.0.0.1 --port 4321",
    // Astro 7はAIエージェントからの実行を検出するとプレビューをバックグラウンドで起動し、
    // コマンドがすぐ終了してしまうため、公式の方法で無効にしてフォアグラウンドで起動する。
    // https://docs.astro.build/en/guides/build-with-ai/
    env: { ASTRO_PREVIEW_BACKGROUND: "0" },
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
