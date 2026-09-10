import { test, expect } from '@playwright/test';

const adminLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
};

test.describe('Admin Feedback Page', () => {
  test('feedback page loads with management view', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await expect(page.locator('text=Feedback Management')).toBeVisible();
    await expect(page.locator('text=Citizen feedback collected via QR codes')).toBeVisible();
  });

  test('stat cards are visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await expect(page.locator('text=Total Feedback')).toBeVisible();
    await expect(page.locator('text=Avg Rating')).toBeVisible();
    await expect(page.locator('text=ISL Attempted')).toBeVisible();
    await expect(page.locator('text=Positive')).toBeVisible();
  });

  test('feedback summary shows rating distribution', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await expect(page.locator('text=Feedback Summary')).toBeVisible();
  });

  test('ISL attempt rate chart is shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await expect(page.locator('text=ISL Attempt Rate')).toBeVisible();
  });

  test('department filter is available', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await expect(page.locator('select')).toBeVisible();
  });

  test('feedback list shows clerk names', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await page.waitForTimeout(1000);
    const feedbackCards = page.locator('.space-y-3 > div');
    const count = await feedbackCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('star ratings are displayed', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/feedback');
    await page.waitForTimeout(1000);
    const stars = page.locator('text=★');
    const count = await stars.count();
    expect(count).toBeGreaterThan(0);
  });
});
