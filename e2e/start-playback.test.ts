import { test, expect } from "@playwright/test";

test("start playback", async ({ page }) => {
  await page.goto("/");
  const playButton = page.getByTestId("play_button");
  expect(playButton).toBeVisible();
  expect(playButton).toContainText("Play");

  await playButton.click();

  await page.waitForFunction(() => {
    const btn = document.querySelector("[data-testid=play_button]");
    return btn?.textContent === "Pause";
  });
});
