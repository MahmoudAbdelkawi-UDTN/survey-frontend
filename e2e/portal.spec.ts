import { expect, test } from "@playwright/test"
import { loginAsAdmin } from "./helpers"

test.describe("Portal navigation", () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page)
  })

  test("dashboard shows KPI cards and charts without errors", async ({ page }) => {
    const consoleErrors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text())
    })

    await expect(page.getByText("Total applications")).toBeVisible()
    await expect(page.getByText("Submission activity")).toBeVisible()
    await page.waitForTimeout(1000)

    expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join("\n")}`).toHaveLength(0)
  })

  test("applications list renders seeded applications and opens the builder", async ({ page }) => {
    await page.click('a:has-text("Applications")')
    await expect(page.getByText("New application")).toBeVisible()

    const firstCard = page.locator('a:has-text("Open builder")').first()
    await firstCard.click()

    await expect(page.getByText("Sections")).toBeVisible()
    await expect(page.getByText("Add section")).toBeVisible()
  })

  test("submissions table loads with filters and opens a review", async ({ page }) => {
    await page.click('a:has-text("Submissions")')
    await expect(page.getByText("Rows per page")).toBeVisible()

    const rows = page.locator("table tbody tr")
    await expect(rows.first()).toBeVisible()

    await rows.first().click()
    await expect(page).toHaveURL(/\/submissions\/.+\/review/)
  })
})
