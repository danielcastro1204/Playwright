export class PaginaReserva {
  constructor(page) {
    this.page = page;
    this.menuReserva = page.getByRole('button', { name: 'Reserva de mesa' });
    this.fecha = page.getByLabel('Fecha');
    this.hora = page.getByLabel('Hora');
    this.personas = page.getByRole('spinbutton', { name: 'Personas' });
    this.nombre = page.getByRole('textbox', { name: 'Nombre' });
    this.botonConsultar = page.getByRole('button', { name: 'Consultar disponibilidad' });
    this.botonReservar = page.getByRole('button', { name: 'Reservar', exact: true });
    this.botonCancelar = page.getByRole('button', { name: 'Cancelar reserva' });
    this.disponibles = page.getByTestId('disponibles');
    this.estado = page.getByTestId('estado-reserva');
    this.mensaje = page.getByRole('status');
  }

  async ir() {
    await this.menuReserva.click();
  }

  async elegirHorario(fecha, hora) {
    await this.fecha.fill(fecha);
    await this.hora.selectOption(hora);
  }

  // Hace clic y espera la respuesta del servidor, para que dos acciones
  // seguidas que muestran el mismo mensaje no se confundan.
  async clicYEsperar(boton, ruta) {
    const respuesta = this.page.waitForResponse((r) => r.url().includes(ruta));
    await boton.click();
    await respuesta;
  }

  async consultarDisponibilidad(fecha, hora) {
    await this.elegirHorario(fecha, hora);
    await this.clicYEsperar(this.botonConsultar, '/api/reservas/disponibilidad');
  }

  async reservar({ fecha, hora, personas, nombre }) {
    await this.elegirHorario(fecha, hora);
    await this.personas.fill(String(personas));
    await this.nombre.fill(nombre);
    await this.clicYEsperar(this.botonReservar, '/api/reservas');
  }

  async cancelar() {
    await this.clicYEsperar(this.botonCancelar, '/cancelar');
  }
}
