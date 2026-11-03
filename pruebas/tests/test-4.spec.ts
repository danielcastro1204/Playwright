import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByText('Correo').click();
  await page.getByText('Correo').click();
  await expect(page.locator('#f-login')).toContainText('Correo');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await expect(page.getByRole('textbox', { name: 'Contraseña' })).toBeVisible();
});