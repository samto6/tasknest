import { test, expect } from "@playwright/test";

interface AuthCookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  expires?: number;
}

const cookiesEnv = process.env.PLAYWRIGHT_AUTH_COOKIES;
let authCookies: AuthCookie[] = [];

if (cookiesEnv) {
  try {
    const parsed = JSON.parse(cookiesEnv);
    if (Array.isArray(parsed)) {
      authCookies = parsed as AuthCookie[];
    } else {
      throw new Error("PLAYWRIGHT_AUTH_COOKIES must be a JSON array");
    }
  } catch (err) {
    throw new Error(`Failed to parse PLAYWRIGHT_AUTH_COOKIES: ${(err as Error).message}`);
  }
}

test.skip(
  authCookies.length === 0,
  "Set PLAYWRIGHT_AUTH_COOKIES to a JSON array with authenticated Supabase cookies to run the smoke test"
);

test.beforeEach(async ({ context, baseURL }) => {
  if (!authCookies.length) return;
  const origin = new URL(baseURL ?? "http://127.0.0.1:3000");
  await context.addCookies(
    authCookies.map((cookie) => ({
      domain: cookie.domain ?? origin.hostname,
      path: cookie.path ?? "/",
      secure: cookie.secure ?? origin.protocol === "https:",
      httpOnly: cookie.httpOnly ?? true,
      sameSite: cookie.sameSite ?? "Lax",
      ...cookie,
    }))
  );
});

test("signup → create team → create project → add task", async ({ page }) => {
  const now = Date.now();
  const teamName = `Playwright Team ${now}`;

  await test.step("visit dashboard", async () => {
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  await test.step("create team", async () => {
    await page.getByPlaceholder("Team name").first().fill(teamName);
    await page.getByRole("button", { name: /Create team/i }).first().click();
    await expect(page).toHaveURL(/\/teams\//);
    await expect(page.getByRole("heading", { name: teamName })).toBeVisible();
  });

  await test.step("create project", async () => {
    await page.getByRole("link", { name: "Create project from template" }).click();
    await expect(page).toHaveURL(/\/teams\/.*\/new-project/);

    const projectName = `Playwright Project ${now}`;
    await page.getByPlaceholder("Project name").fill(projectName);
    const start = new Date();
    const iso = start.toISOString().slice(0, 10);
    await page.getByLabel("Semester start date").fill(iso);
    await page.getByRole("button", { name: /Create from template/i }).click();
    await expect(page).toHaveURL(/\/projects\/.*\/tasks/);
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  });

  test.info().annotations.push({
    type: "todo",
    description: "Extend flow to add a task and comment once UI flow is available",
  });
});
