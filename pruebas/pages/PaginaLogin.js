export class PaginaLogin {
  constructor(page) {
    this.page = page;
    this.correo = page.getByRole('textbox', { name: 'Correo' });
    this.contrasena = page.getByRole('textbox', { name: 'Contraseña' });
    this.botonIniciarSesion = page.getByRole('button', { name: 'Iniciar sesión' });
    this.campoTexto = page.getByRole('textbox', { name: 'Texto' });
  }

  async ir() {
    await this.page.goto('/');
  }

  async iniciarSesion(correo, contrasena) {
    await this.correo.fill(correo);
    await this.contrasena.fill(contrasena);
    await this.botonIniciarSesion.click();
  }
}
