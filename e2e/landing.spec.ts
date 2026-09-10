import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with main sections', async ({ page }) => {
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('text=Sanket')).toBeVisible();
    await expect(page.locator('text=Beyond Words')).toBeVisible();
  });

  test('navbar displays navigation links', async ({ page }) => {
    const navLinks = page.locator('nav[aria-label="Primary"] a');
    await expect(navLinks.filter({ hasText: 'Problem' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'Solution' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'How It Works' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'Ecosystem' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'Impact' })).toBeVisible();
    await expect(navLinks.filter({ hasText: 'Team' })).toBeVisible();
  });

  test('navigation links scroll to sections', async ({ page }) => {
    await page.locator('a[href="/#problem"]').first().click();
    await page.waitForTimeout(500);
    const problemSection = page.locator('#problem');
    await expect(problemSection).toBeVisible();
  });

  test('login button navigates to /login', async ({ page }) => {
    const loginBtn = page.locator('a[href="/login"]').first();
    await loginBtn.click();
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/\/login/);
  });

  test('skip to main content link works', async ({ page }) => {
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main');
  });

  test('scroll progress bar is visible', async ({ page }) => {
    const progressBar = page.locator('.fixed.inset-x-0.top-0.z-\\[70\\]');
    await expect(progressBar).toBeVisible();
  });
});
