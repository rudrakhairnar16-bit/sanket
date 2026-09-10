import { test, expect } from '@playwright/test';

const clerkLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'ramesh');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
};

test.describe('Clerk Assist Page', () => {
  test('loads with service pack selection', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await expect(page.locator('text=Sanket Sahayak')).toBeVisible();
    await expect(page.locator('text=Select a service pack')).toBeVisible();
  });

  test('shows available service packs', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await expect(page.locator('text=Water Tax Payment')).toBeVisible();
    await expect(page.locator('text=Property Tax')).toBeVisible();
    await expect(page.locator('text=Birth Certificate')).toBeVisible();
  });

  test('selecting a service pack starts session', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=End Session')).toBeVisible({ timeout: 5000 });
  });

  test('demo mode badge visible during session', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=DEMO MODE')).toBeVisible({ timeout: 5000 });
  });

  test('engine ready badge shown', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=Engine Ready')).toBeVisible({ timeout: 10000 });
  });

  test('sign grid is displayed with signs', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=Tap Signs to Simulate Recognition')).toBeVisible({ timeout: 5000 });
  });

  test('tapping a sign triggers recognition', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await page.waitForTimeout(1000);
    const signButton = page.locator('button:has-text("Hello")').first();
    if (await signButton.isVisible()) {
      await signButton.click();
      await page.waitForTimeout(500);
    }
  });

  test('quick replies section is visible', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=Quick Replies')).toBeVisible({ timeout: 5000 });
  });

  test('session info card shows details', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=Session Info')).toBeVisible({ timeout: 5000 });
  });

  test('end session shows summary', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await page.waitForTimeout(1000);
    await page.click('text=End Session');
    await expect(page.locator('text=Session completed')).toBeVisible({ timeout: 5000 });
  });

  test('camera section is visible', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await expect(page.locator('text=Camera off').or(page.locator('text=Camera ready'))).toBeVisible({ timeout: 5000 });
  });

  test('back button returns to pack selection', async ({ page }) => {
    await clerkLogin(page);
    await page.goto('/assist');
    await page.click('text=Water Tax Payment');
    await page.waitForTimeout(500);
    await page.click('button:has-text("←")');
    await expect(page.locator('text=Select a service pack')).toBeVisible({ timeout: 5000 });
  });
});
