import { test, expect } from '../fixtures/login.js';
import { usuarioDePrueba } from '../data/usuarios.js';

test('el usuario inicia sesión y ve el campo de búsqueda', async ({ paginaLogin }) => {
  await paginaLogin.ir();
  await paginaLogin.iniciarSesion(usuarioDePrueba.correo, usuarioDePrueba.clave);

  await expect(paginaLogin.campoTexto).toBeVisible();
});
