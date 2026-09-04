import { test, expect } from '@playwright/test';

const adminLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
};

test.describe('National Dashboard', () => {
  test('national dashboard loads with overview', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=National Overview')).toBeVisible();
    await expect(page.locator('text=Nationwide accessibility infrastructure')).toBeVisible();
  });

  test('stat cards show national metrics', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=Total States')).toBeVisible();
    await expect(page.locator('text=Total Clerks')).toBeVisible();
    await expect(page.locator('text=Total Sessions')).toBeVisible();
    await expect(page.locator('text=National Score')).toBeVisible();
  });

  test('sugamya score circle is displayed', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=Sugamya Score')).toBeVisible();
  });

  test('growth chart is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=National Growth')).toBeVisible();
  });

  test('top states table is shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=Top States')).toBeVisible();
  });

  test('national alerts section is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=National Alerts')).toBeVisible();
  });

  test('deployment phases are shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national');
    await expect(page.locator('text=Phase 1')).toBeVisible();
    await expect(page.locator('text=Phase 2')).toBeVisible();
    await expect(page.locator('text=Phase 3')).toBeVisible();
  });
});

test.describe('National States Page', () => {
  test('states page loads with state list', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/states');
    await expect(page.locator('text=State Dashboard')).toBeVisible();
    await expect(page.locator('text=State-wise accessibility metrics')).toBeVisible();
  });

  test('region filter buttons are visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/states');
    await expect(page.locator('button:has-text("All")')).toBeVisible();
    await expect(page.locator('button:has-text("North")')).toBeVisible();
    await expect(page.locator('button:has-text("South")')).toBeVisible();
    await expect(page.locator('button:has-text("West")')).toBeVisible();
  });

  test('state cards show scores', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/states');
    await expect(page.locator('text=Gujarat')).toBeVisible();
    await expect(page.locator('text=Maharashtra')).toBeVisible();
  });

  test('sort buttons work', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/states');
    await page.click('button:has-text("Sort: clerks")');
    await page.waitForTimeout(300);
  });

  test('region filter changes displayed states', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/states');
    await page.click('button:has-text("North")');
    await page.waitForTimeout(300);
  });
});

test.describe('National Impact Page', () => {
  test('impact page loads with metrics', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=Impact Metrics')).toBeVisible();
    await expect(page.locator('text=National accessibility impact')).toBeVisible();
  });

  test('big number cards are shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=Citizens Served')).toBeVisible();
    await expect(page.locator('text=Clerks Trained')).toBeVisible();
    await expect(page.locator('text=Sessions Completed')).toBeVisible();
    await expect(page.locator('text=Sign Types Used')).toBeVisible();
  });

  test('monthly impact chart is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=Monthly Impact Growth')).toBeVisible();
  });

  test('accessibility score metrics shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=Accessibility Score')).toBeVisible();
  });

  test('before and after section is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=Before & After Sanket')).toBeVisible();
  });

  test('success stories section shown', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=Success Stories')).toBeVisible();
  });

  test('national improvement summary is visible', async ({ page }) => {
    await adminLogin(page);
    await page.goto('/national/impact');
    await expect(page.locator('text=National Accessibility Improvement')).toBeVisible();
    await expect(page.locator('text=73%')).toBeVisible();
  });
});
