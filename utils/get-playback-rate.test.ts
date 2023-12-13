import { test, expect } from "@playwright/test";
import { getPlaybackRate } from "./get-playback-rate";

test("compute playback rate", async ({ page }) => {
  await expect(getPlaybackRate(100, 100)).toBe(1);

  await expect(getPlaybackRate(50, 100)).toBe(2);

  await expect(getPlaybackRate(100, 50)).toBe(0.5);
});
