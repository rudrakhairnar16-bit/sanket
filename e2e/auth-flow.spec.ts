import { test, expect } from "@playwright/test";

test.describe("Authentication flow", () => {
  test("login page loads and shows form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("tab", { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholder(/username/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
  });

  test("login with valid demo credentials redirects to dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/username/i).fill("admin");
    await page.getByPlaceholder(/password/i).fill("admin123");
    await page.getByRole("button", { name: /submit|sign in|login/i }).click();
    await page.waitForURL(/\/admin|\/dashboard/, { timeout: 10000 });
    expect(page.url()).toMatch(/\/admin|\/dashboard/);
  });

  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/username/i).fill("admin");
    await page.getByPlaceholder(/password/i).fill("wrongpassword");
    await page.getByRole("button", { name: /submit|sign in|login/i }).click();
    await expect(page.getByText(/invalid|error|failed/i)).toBeVisible({ timeout: 10000 });
  });

  test("unauthenticated access to dashboard redirects to login", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });

  test("unauthenticated access to admin redirects to login", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/login/, { timeout: 10000 });
    expect(page.url()).toContain("/login");
  });
});

test.describe("ISL Quest (public access)", () => {
  test("learn page loads without authentication", async ({ page }) => {
    await page.goto("/learn");
    await expect(page.getByRole("heading", { name: /learn indian sign language/i })).toBeVisible({ timeout: 10000 });
  });

  test("leaderboard tab is accessible", async ({ page }) => {
    await page.goto("/learn");
    await page.getByRole("button", { name: /leaderboard/i }).click();
    await expect(page.getByRole("heading", { name: "Leaderboard" })).toBeVisible({ timeout: 10000 });
  });

  test("assist page loads publicly with Sahayak welcome", async ({ page }) => {
    await page.goto("/assist");
    await expect(page.getByRole("heading", { name: /sanket sahayak/i })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/namaste|नमस्ते|नमस्कार/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("button", { name: /finish session|सत्र/i })).toBeVisible({ timeout: 10000 });
  });

  test("assist demo sign adds a citizen chat message", async ({ page }) => {
    await page.goto("/assist");
    await page.getByRole("button", { name: /simulate sign: namaste/i }).click();
    const chatLog = page.locator('[aria-live="polite"]');
    await expect(chatLog.getByText("Namaste", { exact: true })).toBeVisible({ timeout: 10000 });
    await expect(chatLog.getByText("Citizen", { exact: true })).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Dashboard (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/username/i).fill("ramesh");
    await page.getByPlaceholder(/password/i).fill("admin123");
    await page.getByRole("button", { name: /submit|sign in|login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test("dashboard shows streak and lesson", async ({ page }) => {
    await expect(page.getByText("Streak", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test("dashboard shows ISL Quest card with link to /learn", async ({ page }) => {
    const questLink = page.getByRole("link", { name: /isl quest|learn/i });
    await expect(questLink).toBeVisible({ timeout: 5000 });
  });

  test("dashboard shows Sanket Sahayak counter card", async ({ page }) => {
    const assistLink = page.getByRole("link", { name: /open counter/i });
    await expect(assistLink).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Citizens assisted")).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Admin dashboard (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByPlaceholder(/username/i).fill("admin");
    await page.getByPlaceholder(/password/i).fill("admin123");
    await page.getByRole("button", { name: /submit|sign in|login/i }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.goto("/admin");
  });

  test("admin dashboard shows Sugamya Score", async ({ page }) => {
    await expect(page.getByText("Sugamya Score")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Grade [A-D]/)).toBeVisible({ timeout: 10000 });
  });
});
