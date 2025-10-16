import { test, expect } from "@playwright/test";

test.describe("Tabs generator", () => {
  test("adds content and generates HTML output", async ({ page }) => {
    await page.goto("/tabs");

    const textarea = page.getByPlaceholder("Enter tab content here...");
    await textarea.fill("Playwright automation content");

    await page.getByRole("button", { name: "Output" }).click();

    const output = page.locator(".tab-output");
    await expect(output).toContainText("Playwright automation content");
    await expect(output).toContainText("<!DOCTYPE html>");
  });
});
