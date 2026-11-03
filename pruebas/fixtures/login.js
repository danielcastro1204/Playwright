import { test as base, expect } from '@playwright/test';
import { PaginaLogin } from '../pages/PaginaLogin.js';
import { PaginaReserva } from '../pages/PaginaReserva.js';
import { usuarioDePrueba } from '../data/usuarios.js';

export const test = base.extend({
  paginaLogin: async ({ page }, use) => {
    await use(new PaginaLogin(page));
  },

  paginaLogueada: async ({ page }, use) => {
    const login = new PaginaLogin(page);
    await login.ir();
    await login.iniciarSesion(usuarioDePrueba.correo, usuarioDePrueba.clave);
    await expect(page.getByRole('button', { name: 'Carrito', exact: true })).toBeVisible();
    await use(page);
  },

  paginaReserva: async ({ paginaLogueada: page }, use) => {
    const reserva = new PaginaReserva(page);
    await reserva.ir();
    await expect(page.getByRole('heading', { name: 'Reserva de mesa' })).toBeVisible();
    await use(reserva);
  },
});

export { expect };
