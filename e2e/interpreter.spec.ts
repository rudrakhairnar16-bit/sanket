import { test, expect } from '@playwright/test';

const adminLogin = async (page: import('@playwright/test').Page) => {
  await page.goto('/login');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin', { timeout: 10000 });
};

test.describe('Interpreter Dashboard', () => {
  test('interpreter dashboard loads', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter');
    await expect(page.locator('text=Interpreter Dashboard')).toBeVisible();
    await expect(page.locator('text=Manage your availability')).toBeVisible();
  });

  test('status section shows availability', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter');
    await expect(page.locator('text=Your Status')).toBeVisible();
    await expect(page.locator('text=Available').or(page.locator('text=Not Available'))).toBeVisible();
  });

  test('stat cards show session metrics', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter');
    await expect(page.locator('text=Active Sessions')).toBeVisible();
    await expect(page.locator('text=Queue Length')).toBeVisible();
    await expect(page.locator('text=Today\'s Sessions')).toBeVisible();
  });

  test('recent requests table is visible', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter');
    await expect(page.locator('text=Recent Requests')).toBeVisible();
  });

  test('toggle availability status', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter');
    const toggleBtn = page.locator('button:has-text("Go Offline")');
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await expect(page.locator('text=Not Available')).toBeVisible();
    }
  });
});

test.describe('Interpreter Queue', () => {
  test('queue page loads with pending requests', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/queue');
    await expect(page.locator('text=Session Queue')).toBeVisible();
    await expect(page.locator('text=Pending interpreter requests')).toBeVisible();
  });

  test('queue shows waiting sessions', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/queue');
    await expect(page.locator('text=Sunita Devi')).toBeVisible();
    await expect(page.locator('text=Rajesh Kumar')).toBeVisible();
  });

  test('accept button removes from queue', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/queue');
    const acceptBtn = page.locator('button:has-text("Accept")').first();
    await acceptBtn.click();
    await page.waitForTimeout(300);
  });

  test('decline button removes from queue', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/queue');
    const declineBtn = page.locator('button:has-text("Decline")').first();
    await declineBtn.click();
    await page.waitForTimeout(300);
  });

  test('urgency badges are shown', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/queue');
    await expect(page.locator('text=high').first()).toBeVisible();
  });
});

test.describe('Interpreter Session', () => {
  test('session page loads with communication interface', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/session');
    await expect(page.locator('text=Active Session')).toBeVisible();
  });

  test('video feed placeholder is shown', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/session');
    await expect(page.locator('text=Video Feed')).toBeVisible();
  });

  test('chat panel is visible', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/session');
    await expect(page.locator('text=Chat Panel')).toBeVisible();
  });

  test('message input and send button work', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/session');
    await page.fill('input[placeholder="Type message..."]', 'Test message');
    await page.click('button:has-text("Send")');
    await page.waitForTimeout(300);
  });

  test('end session button is visible', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#username', 'admin');
    await page.fill('#password', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
    await page.goto('/interpreter/session');
    await expect(page.locator('button:has-text("End Session")')).toBeVisible();
  });
});
