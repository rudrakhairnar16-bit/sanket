import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('login page loads with role selection', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Government Clerk Login')).toBeVisible();
    await expect(page.locator('text=Quick Demo Access')).toBeVisible();
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('login page shows demo users', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Ramesh Patel')).toBeVisible();
    await expect(page.locator('text=Sita Sharma')).toBeVisible();
    await expect(page.locator('text=Super Admin')).toBeVisible();
  });

  test('login as clerk redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'ramesh');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('login as admin redirects to admin', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin/);
  });

  test('demo user click fills credentials', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Ramesh Patel');
    const usernameInput = page.locator('#username');
    await expect(usernameInput).toHaveValue('ramesh');
    const passwordInput = page.locator('#password');
    await expect(passwordInput).toHaveValue('demo123');
  });

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'wronguser');
    await page.fill('#password', 'wrongpass');
    await page.click('button[type="submit"]');
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  });

  test('toggle to register mode', async ({ page }) => {
    await page.goto('/login');
    await page.click("text=Don't have an account? Create one");
    await expect(page.locator('text=Create Account')).toBeVisible();
    await expect(page.locator('#name')).toBeVisible();
  });

  test('back to home link works', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=← Back to Home');
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
