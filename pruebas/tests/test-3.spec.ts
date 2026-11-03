import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('about:blank');
  await page.goto('http://localhost:3000/');
  await expect(page.getByRole('textbox', { name: 'Correo' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Correo' }).click({
    clickCount: 4
  });
  await page.getByRole('textbox', { name: 'Correo' }).fill('');
  await expect(page.getByRole('textbox', { name: 'Correo' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Correo' }).click();
  await page.getByRole('textbox', { name: 'Correo' }).fill('estudiante1');
  await page.getByRole('textbox', { name: 'Correo' }).press('Alt+ControlOrMeta+@');
  await page.getByRole('textbox', { name: 'Correo' }).fill('estudiante1@cafe.test');
  await page.getByRole('textbox', { name: 'Correo' }).press('Tab');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('C');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('Cafe2026');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page.getByRole('heading')).toMatchAriaSnapshot(`- heading "Catálogo" [level=2]`);
  await page.getByRole('textbox', { name: 'Texto' }).click();
  await page.getByLabel('Categoría Todas bebidas').selectOption('bebidas');
  await page.getByRole('spinbutton', { name: 'Precio máximo' }).click();
  await page.getByText('Espresso (bebidas): $').click();
});