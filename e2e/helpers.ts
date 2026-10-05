import type { Page } from "@playwright/test"

export async function loginAsAdmin(page: Page) {
  await page.goto("/login")
  await page.fill("#email", "admin@applicationreview.dev")
  await page.fill("#password", "Admin@12345")
  await page.click('button[type="submit"]')
  await page.waitForURL("/")
}
