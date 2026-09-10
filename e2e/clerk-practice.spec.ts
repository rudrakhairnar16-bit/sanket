import { test, expect } from '@playwright/test';

const clerkLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'ramesh');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
};

test.describe('Clerk Practice Page', () => {
  test('practice page loads with heading', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await expect(page.locator('text=Sign Practice')).toBeVisible();
    await expect(page.locator('text=Practice ISL signs with real recognition')).toBeVisible();
  });

  test('practice page shows mode toggles', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await expect(page.locator('text=Demo Mode')).toBeVisible();
    await expect(page.locator('text=Camera Mode')).toBeVisible();
  });

  test('practice page shows stat cards', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await expect(page.locator('text=Total Attempts')).toBeVisible();
    await expect(page.locator('text=Correct')).toBeVisible();
    await expect(page.locator('text=Accuracy')).toBeVisible();
    await expect(page.locator('text=Signs Practiced')).toBeVisible();
  });

  test('begin practice button starts session', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await expect(page.locator('text=Start a Practice Session')).toBeVisible();
    await page.click('text=Begin Practice');
    await expect(page.locator('text=End Session')).toBeVisible({ timeout: 5000 });
  });

  test('practice signs grid is visible', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await expect(page.locator('text=Practice Signs')).toBeVisible();
  });

  test('end session shows summary', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await page.click('text=Begin Practice');
    await page.waitForTimeout(500);
    await page.click('text=End Session');
    await expect(page.locator('text=Practice Session Summary')).toBeVisible({ timeout: 5000 });
  });

  test('demo mode is active by default', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    const demoButton = page.locator('button:has-text("Demo Mode")');
    await expect(demoButton).toHaveClass(/bg-gold-400/);
  });

  test('back button navigates back', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/practice');
    await page.click('button:has-text("←")');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
