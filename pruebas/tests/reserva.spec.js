// HU-06 · Reserva de mesa
// Como cliente, quiero reservar una mesa solo si hay lugares para no reservar de más.
import { test, expect } from '../fixtures/login.js';
import { cupoPorHorario, horarios, cliente, fechaUnica } from '../data/reservas.js';

test.describe('HU-06 · Bug inyectado: sobrecupo', () => {
  test('@bug no reserva más personas que los lugares de un horario vacío', async ({ paginaReserva }) => {
    const fecha = fechaUnica();

    await paginaReserva.reservar({ fecha, hora: horarios.temprano, personas: cupoPorHorario + 1, nombre: cliente });

    await expect(paginaReserva.mensaje).toHaveText(`Solo quedan ${cupoPorHorario} lugares`);
    await expect(paginaReserva.estado).toHaveText('-');
    await paginaReserva.consultarDisponibilidad(fecha, horarios.temprano);
    await expect(paginaReserva.disponibles).toHaveText(String(cupoPorHorario));
  });
});

test.describe('HU-06 · Criterio 1: disponibles = 8 - personas ya reservadas', () => {
  test('un horario sin reservas tiene 8 lugares disponibles @acceptanceTest @Issue-1', async ({ paginaReserva }) => {
    await paginaReserva.consultarDisponibilidad(fechaUnica(), horarios.temprano);

    await expect(paginaReserva.disponibles).toHaveText('8');
  });

  test('una reserva descuenta sus personas de los lugares disponibles @acceptanceTest @Issue-2', async ({ paginaReserva }) => {
    const fecha = fechaUnica();

    await paginaReserva.reservar({ fecha, hora: horarios.medio, personas: 3, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');
    await expect(paginaReserva.estado).toHaveText('reservada');

    await paginaReserva.consultarDisponibilidad(fecha, horarios.medio);
    await expect(paginaReserva.disponibles).toHaveText('5');
  });

  test('varias reservas en el mismo horario se suman @acceptanceTest @Issue-3', async ({ paginaReserva }) => {
    const fecha = fechaUnica();

    await paginaReserva.reservar({ fecha, hora: horarios.tarde, personas: 3, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');
    await paginaReserva.reservar({ fecha, hora: horarios.tarde, personas: 2, nombre: 'Luis Gómez' });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');

    await paginaReserva.consultarDisponibilidad(fecha, horarios.tarde);
    await expect(paginaReserva.disponibles).toHaveText('3');
  });

  test('una reserva solo afecta su horario, no los demás @acceptanceTest @Issue-4', async ({ paginaReserva }) => {
    const fecha = fechaUnica();

    await paginaReserva.reservar({ fecha, hora: horarios.temprano, personas: 4, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');

    await paginaReserva.consultarDisponibilidad(fecha, horarios.medio);
    await expect(paginaReserva.disponibles).toHaveText('8');
  });

  test('reservar exactamente los lugares disponibles deja el horario en 0 @acceptanceTest @Issue-5', async ({ paginaReserva }) => {
    const fecha = fechaUnica();

    await paginaReserva.reservar({ fecha, hora: horarios.medio, personas: cupoPorHorario, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');

    await paginaReserva.consultarDisponibilidad(fecha, horarios.medio);
    await expect(paginaReserva.disponibles).toHaveText('0');
  });
});

test.describe('HU-06 · Criterio 2: si las personas superan los lugares, muestra "Solo quedan X lugares" y no reserva', () => {
  test('@bug rechaza una reserva que supera los lugares que quedan', async ({ paginaReserva }) => {
    const fecha = fechaUnica();
    await paginaReserva.reservar({ fecha, hora: horarios.tarde, personas: 6, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');

    await paginaReserva.reservar({ fecha, hora: horarios.tarde, personas: 3, nombre: 'Luis Gómez' });

    await expect(paginaReserva.mensaje).toHaveText('Solo quedan 2 lugares');
    await paginaReserva.consultarDisponibilidad(fecha, horarios.tarde);
    await expect(paginaReserva.disponibles).toHaveText('2');
  });

  test('@bug rechaza cualquier reserva en un horario lleno', async ({ paginaReserva }) => {
    const fecha = fechaUnica();
    await paginaReserva.reservar({ fecha, hora: horarios.temprano, personas: cupoPorHorario, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');

    await paginaReserva.reservar({ fecha, hora: horarios.temprano, personas: 1, nombre: 'Luis Gómez' });

    await expect(paginaReserva.mensaje).toHaveText('Solo quedan 0 lugares');
    await paginaReserva.consultarDisponibilidad(fecha, horarios.temprano);
    await expect(paginaReserva.disponibles).toHaveText('0');
  });

  test('pide todos los campos antes de reservar @acceptanceTest @Issue-6', async ({ paginaReserva }) => {
    await paginaReserva.reservar({ fecha: '', hora: horarios.temprano, personas: 2, nombre: cliente });

    await expect(paginaReserva.mensaje).toHaveText('Todos los campos son obligatorios');
    await expect(paginaReserva.estado).toHaveText('-');
  });
});

test.describe('HU-06 · Criterio 3: al cancelar, los lugares vuelven a estar disponibles', () => {
  test('cancelar una reserva devuelve sus lugares @acceptanceTest @Issue-7', async ({ paginaReserva }) => {
    const fecha = fechaUnica();
    await paginaReserva.reservar({ fecha, hora: horarios.medio, personas: 5, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');
    await paginaReserva.consultarDisponibilidad(fecha, horarios.medio);
    await expect(paginaReserva.disponibles).toHaveText('3');

    await paginaReserva.cancelar();

    await expect(paginaReserva.mensaje).toHaveText('Reserva cancelada');
    await expect(paginaReserva.estado).toHaveText('cancelada');
    await paginaReserva.consultarDisponibilidad(fecha, horarios.medio);
    await expect(paginaReserva.disponibles).toHaveText('8');
  });

  test('después de cancelar se puede volver a reservar el horario completo @acceptanceTest @Issue-8', async ({ paginaReserva }) => {
    const fecha = fechaUnica();
    await paginaReserva.reservar({ fecha, hora: horarios.tarde, personas: cupoPorHorario, nombre: cliente });
    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');
    await paginaReserva.cancelar();
    await expect(paginaReserva.mensaje).toHaveText('Reserva cancelada');

    await paginaReserva.reservar({ fecha, hora: horarios.tarde, personas: cupoPorHorario, nombre: 'Luis Gómez' });

    await expect(paginaReserva.mensaje).toHaveText('Reserva creada');
    await expect(paginaReserva.estado).toHaveText('reservada');
  });
});