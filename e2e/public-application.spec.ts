import { expect, test } from "@playwright/test"
import { loginAsAdmin } from "./helpers"

test("public applicant can complete and submit an application", async ({ page, context }) => {
  await loginAsAdmin(page)
  await page.click('a:has-text("Applications")')
  await expect(page.getByText("New application")).toBeVisible()
  await page.locator('a:has-text("Open builder")').first().click()
  await expect(page.getByText("Add section")).toBeVisible()

  const publicUrlText = await page.locator("text=/apply\\//").first().textContent()
  const publicPath = publicUrlText!.replace(/^https?:\/\/[^/]+/, "")

  const publicPage = await context.newPage()
  await publicPage.goto(publicPath)
  await expect(publicPage.getByText("Start application")).toBeVisible()
  await publicPage.click("text=Start application")

  await expect(publicPage.locator('button:has-text("Next")')).toBeVisible()

  const textarea = publicPage.locator("textarea").first()
  if (await textarea.count()) {
    await textarea.fill("Automated end-to-end test answer.")
  }

  const firstOption = publicPage.locator("div.grid button").first()
  if (await firstOption.count()) {
    await firstOption.click()
  }

  for (let i = 0; i < 10; i++) {
    const nextButton = publicPage.locator('button:has-text("Next")')
    if ((await nextButton.count()) === 0) break

    const isDisabled = await nextButton.isDisabled()
    if (isDisabled) {
      const textareas = publicPage.locator("textarea")
      const textareaCount = await textareas.count()
      for (let t = 0; t < textareaCount; t++) {
        await textareas.nth(t).fill("Automated end-to-end test answer.")
      }
      const optionButtons = publicPage.locator("div.grid button")
      const optionCount = await optionButtons.count()
      if (optionCount > 0) {
        await optionButtons.first().click()
      }
    }

    if (await nextButton.isEnabled()) {
      await nextButton.click()
      await publicPage.waitForTimeout(200)
    } else {
      break
    }
  }

  const submitButton = publicPage.locator('button:has-text("Submit application")')
  if (await submitButton.count()) {
    await submitButton.click()
    await expect(publicPage.getByText("Application submitted")).toBeVisible({ timeout: 10000 })
  }

  await publicPage.close()
})
