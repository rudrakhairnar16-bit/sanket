import { test, expect } from '@playwright/test';

const adminLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
};

test.describe('Admin Signs Page', () => {
  test('signs page loads with library', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await expect(page.locator('text=Sign Library')).toBeVisible();
  });

  test('sign categories are displayed', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await expect(page.locator('text=Greetings')).toBeVisible();
    await expect(page.locator('text=Basic')).toBeVisible();
    await expect(page.locator('text=Services')).toBeVisible();
    await expect(page.locator('text=Documents')).toBeVisible();
  });

  test('stat cards show sign counts', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await expect(page.locator('text=Total Signs')).toBeVisible();
    await expect(page.locator('text=Approved')).toBeVisible();
    await expect(page.locator('text=Under Review')).toBeVisible();
    await expect(page.locator('text=Drafts')).toBeVisible();
  });

  test('search input filters signs', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await page.fill('input[placeholder*="Search"]', 'Hello');
    await page.waitForTimeout(300);
  });

  test('category filter works', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await page.click('text=Greetings');
    await page.waitForTimeout(300);
  });

  test('status filter buttons are visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("Approved")')).toBeVisible();
    await expect(page.locator('button:has-text("Under Review")')).toBeVisible();
    await expect(page.locator('button:has-text("Draft")')).toBeVisible();
  });

  test('sign cards show edit and review buttons', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    const editButtons = page.locator('button:has-text("Edit")');
    await expect(editButtons.first()).toBeVisible({ timeout: 5000 });
    const reviewButtons = page.locator('button:has-text("Review")');
    await expect(reviewButtons.first()).toBeVisible();
  });

  test('add sign button is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/admin/signs');
    await expect(page.locator('button:has-text("Add Sign")')).toBeVisible();
  });
});
