import { expect, test } from "@playwright/test"

test.describe("Authentication", () => {
  test("shows an error for invalid credentials", async ({ page }) => {
    await page.goto("/login")
    await page.fill("#email", "admin@applicationreview.dev")
    await page.fill("#password", "wrong-password")
    await page.click('button[type="submit"]')

    await expect(page.getByText(/invalid email or password/i)).toBeVisible()
  })

  test("logs in and redirects to the dashboard", async ({ page }) => {
    await page.goto("/login")
    await page.fill("#email", "admin@applicationreview.dev")
    await page.fill("#password", "Admin@12345")
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL("/")
    await expect(page.getByText("Total applications")).toBeVisible()
  })

  test("redirects unauthenticated visitors away from the portal", async ({ page }) => {
    await page.goto("/applications")

    await expect(page).toHaveURL(/\/login/)
  })

  test("opens the account menu and signs out", async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto("/login")
    await page.fill("#email", "admin@applicationreview.dev")
    await page.fill("#password", "Admin@12345")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")

    await page.click('button:has-text("Alex Morgan")')
    await expect(page.getByText("Sign out")).toBeVisible()

    await page.click("text=Sign out")
    await expect(page).toHaveURL(/\/login/)

    expect(errors, `Unexpected page errors: ${errors.join("\n")}`).toHaveLength(0)
  })
})
