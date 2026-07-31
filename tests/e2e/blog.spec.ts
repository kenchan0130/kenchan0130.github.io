import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const articlePath = "/post/2025-12-14-1";

test("主要ページと拡張子なしの記事URLを表示できる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("kenchan0130 blog");
  await page.goto(articlePath);
  await expect(page).toHaveURL(new RegExp(`${articlePath}$`));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("intunewin");
  await expect(page.locator("article iframe")).toHaveCount(0);
  await expect(page.locator('.toc-desktop a[aria-current="location"]')).toHaveText(
    "intunewinファイルとは",
  );
  await page.goto("/archives");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Archives");
  await expect(page.getByText(`© 2017–${new Date().getFullYear()} Tadayuki Onishi`)).toBeVisible();
  await page.getByRole("link", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search$/);
  const searchInput = page.getByRole("searchbox");
  await searchInput.fill("intunewin");
  await expect(
    page.getByRole("link", { name: /クロスプラットフォームで動作するintunewin/ }),
  ).toBeVisible();
  await expect(page.getByText("2025年12月14日").last()).toBeVisible();
});

test("URLコピーとテーマ切り替えをキーボードで利用できる", async ({ page }) => {
  await page.goto(articlePath);
  await page.getByRole("button", { name: "URLをコピー" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("コピーしました")).toBeVisible();
  const theme = page.locator("[data-theme-toggle]");
  await theme.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", /dark|light/);
});

test("プロフィール画像をマウスとキーボードで切り替えられる", async ({ page }) => {
  await page.goto("/profile");
  const avatar = page.getByRole("button", {
    name: "Tadayuki Onishiのプロフィール画像。押すと表情が変わります",
  });
  const standard = avatar.locator('img[src="/assets/profile_standard.png"]');
  const greeting = avatar.locator('img[src="/assets/profile_hi.png"]');
  const criticalPass = avatar.locator('img[src="/assets/profile_critical_pass.png"]');

  await expect(standard).toHaveClass(/is-visible/);
  await avatar.hover();
  await expect(greeting).toHaveClass(/is-visible/);
  await page.mouse.move(0, 0);
  await expect(standard).toHaveClass(/is-visible/);

  await avatar.focus();
  await expect(greeting).toHaveClass(/is-visible/);
  await page.keyboard.press("Enter");
  await expect(greeting).toHaveClass(/is-visible/);
  await page.keyboard.press("Enter");
  await expect(criticalPass).toHaveClass(/is-visible/);
  await page.keyboard.press("Enter");
  await expect(standard).toHaveClass(/is-visible/);
});

test("ダークテーマのコードブロックに十分なコントラストがある", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "dark"));
  await page.goto(articlePath);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

  const results = await new AxeBuilder({ page })
    .include(".expressive-code")
    .withRules(["color-contrast"])
    .analyze();
  expect(results.violations).toEqual([]);
});

for (const path of ["/", articlePath]) {
  test(`axeで重大なアクセシビリティ違反がない: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
