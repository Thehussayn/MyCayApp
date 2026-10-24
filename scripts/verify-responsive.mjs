// Optional Playwright check. Set PLAYWRIGHT_MODULE when using an external test-tool installation.
import assert from "node:assert/strict";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_EXECUTABLE
    ? { executablePath: process.env.CHROME_EXECUTABLE }
    : {}),
});
const base = process.env.TEST_URL || "http://127.0.0.1:3000";
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
try {
  await page.goto(base + "/preview");
  await page.getByRole("button", { name: "Open preview workspace" }).click();
  await page.waitForURL("**/portal/dashboard");
  await page.goto(base + "/portal/biodata");
  await page.getByLabel("Jump to onboarding step").selectOption("7");
  await page.getByText("Digital signature", { exact: true }).waitFor();
  await page.goto(base + "/portal/dashboard", {waitUntil:"domcontentloaded", timeout:90000});
  await page.getByRole("heading", {name: "Welcome, Alex."}).waitFor();
  await page.getByLabel("Open navigation", { exact: true }).click();
  await page.getByRole("dialog").waitFor();
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page.goto(base + "/portal/investments/new");
  await page
    .getByRole("button", { name: "WealthStream", exact: false })
    .click();
  await page
    .getByRole("button", { name: "Review investment", exact: true })
    .click();
  await page
    .getByLabel("I have reviewed and accept these investment terms.")
    .check();
  await page
    .getByRole("button", { name: "Continue to payment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Prepare preview payment", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Confirm preview payment", exact: true })
    .click();
  await page.waitForURL(/\/portal\/investments\/wst_/);
  await page
    .getByRole("heading", { name: "Payout schedule", exact: true })
    .waitFor();
  const detail = new URL(page.url()).pathname;
  await page
    .getByRole("button", { name: "Withdraw principal", exact: true })
    .click();
  await page.getByLabel("I understand the withdrawal terms.").check();
  await page
    .getByRole("button", { name: "Submit request", exact: true })
    .click();
  await page
    .getByText("Finance is reviewing your withdrawal request.", { exact: true })
    .waitFor();
  for (const width of [360, 390, 768, 1280, 1680]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/register",
      "/login",
      "/portal/onboarding-complete",
      "/forgot-password",
      "/reset-password",
      "/portal/status",
      "/portal/dashboard",
      "/portal/investments",
      "/portal/investments/new",
      "/portal/biodata",
      "/portal/documents",
      "/portal/transactions",
      "/portal/notifications",
      "/portal/profile",
      "/portal/settings",
      detail,
    ]) {
      await page.goto(base + route, {waitUntil:"domcontentloaded", timeout:90000});
      await page.waitForTimeout(250);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} overflows at ${width}px`,
      );
    }
  }
  await context.request.post(base + "/api/preview", {
    data: { role: "SUPER_ADMIN" },
  });
  await page.goto(base + "/admin/investors");
  await page.getByRole("table").waitFor();
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Investor table overflows viewport at ${width}px`);
  }
  assert.equal(await page.getByRole("link", { name: "Onboarding", exact: true }).count(), 0);
  await page.locator('a[aria-label="View Alex Morgan"]:visible').click();
  await page.waitForURL(/\/admin\/investors\/preview_INVESTOR/);
  await page.reload();
  await page.getByRole("heading", { name: "Alex Morgan", exact: true }).waitFor();
  await page
    .getByRole("button", {
      name: "Complete profile on behalf of investor",
      exact: true,
    })
    .click();
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      `Staff-assisted form overflows at ${width}px`,
    );
  }
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/admin", "/admin/investors", "/admin/finance", "/admin/content", "/admin/users", "/admin/audit", "/admin/settings"]) {
      await page.goto(base + route, {waitUntil:"domcontentloaded", timeout:90000});
      await page.waitForTimeout(250);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${route} overflows at ${width}px`);
      assert.equal(await page.getByText("Application error:", { exact: false }).count(), 0);
    }
  }
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all investor portal pages and admin modules at mobile/desktop widths, KYC step skipping, navigation dismissal, WealthStream creation, withdrawal submission, investor detail URLs and refresh, and staff-assisted forms.",
  );
} finally {
  await browser.close();
}
