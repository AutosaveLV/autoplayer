import { test, expect } from "@playwright/test";

test("start playback", async ({ page }) => {
  await page.goto("/");
  const playButton = page.getByTestId("play_button");
  await expect(playButton).toBeVisible();
  expect(await playButton.getAttribute("aria-label")).toBe("Play");

  await playButton.click();

  expect(await playButton.getAttribute("aria-label")).toBe("Pause");
});
