import { test, expect } from '@playwright/test';

const adminLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
};

test.describe('Admin Dashboard', () => {
  test('admin page loads with dashboard stats', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    await expect(page.locator('text=Department accessibility overview')).toBeVisible();
  });

  test('stat cards are visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await expect(page.locator('text=Total Staff')).toBeVisible();
    await expect(page.locator('text=Active Sessions')).toBeVisible();
    await expect(page.locator('text=Feedback Count')).toBeVisible();
    await expect(page.locator('text=Sugamya Score')).toBeVisible();
  });

  test('sugamya score ring is displayed', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await expect(page.locator('text=Score Breakdown')).toBeVisible();
  });

  test('score breakdown pillars shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await expect(page.locator('text=Communication Readiness')).toBeVisible();
    await expect(page.locator('text=Clerk Learning')).toBeVisible();
    await expect(page.locator('text=Citizen Feedback')).toBeVisible();
  });

  test('recent sessions table is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await expect(page.locator('text=Recent Sessions')).toBeVisible();
  });

  test('departments section is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await expect(page.locator('text=Departments')).toBeVisible();
  });

  test('navigation to staff page works', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await page.click('text=Staff');
    await page.waitForURL('**/admin/staff', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/staff/);
  });

  test('navigation to signs page works', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await page.click('text=Signs');
    await page.waitForURL('**/admin/signs', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/signs/);
  });

  test('navigation to reports page works', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await page.click('text=Reports');
    await page.waitForURL('**/admin/reports', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/reports/);
  });

  test('navigation to analytics page works', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin');
    await page.click('text=Analytics');
    await page.waitForURL('**/admin/analytics', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin\/analytics/);
  });
});
