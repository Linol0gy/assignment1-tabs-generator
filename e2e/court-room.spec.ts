import { test, expect } from "@playwright/test";

const altDescription =
  "Judge addressing students in the moot court theatre with the LTU crest behind.";

test.describe("Court Room scenario", () => {
  test("completes compliance stages and saves a snapshot", async ({ page }) => {
    await page.goto("/court-room");

    await expect(
      page.getByRole("heading", { name: "Court Room: Ship Code Under Pressure" }),
    ).toBeVisible();

    await page.fill("#altDescription", altDescription);
    await page.getByRole("button", { name: "Apply Alt Text" }).click();

    await expect(
      page.locator('section[aria-live="polite"] h3').first(),
    ).toHaveText("Stage 2 - Agile Change Requests");

    await page.getByRole("radio", { name: /Apply inline style/i }).check();
    await page.getByRole("button", { name: "Confirm Colour Update" }).click();

    await expect(
      page.locator('section[aria-live="polite"] h3').first(),
    ).toHaveText("Stage 3 - Security Hardening");

    await page
      .getByLabel("Require email and password inputs before submission.")
      .check();
    await page.getByLabel("Sanitise input values before hitting the API.").check();
    await page.getByRole("button", { name: "Apply Validation Rules" }).click();

    await expect(page.getByRole("status")).toContainText("Court adjourned!");

    await page.getByRole("button", { name: "Save Session Snapshot" }).click();
    await expect(page.getByText("Snapshot saved", { exact: false })).toBeVisible();
  });
});
