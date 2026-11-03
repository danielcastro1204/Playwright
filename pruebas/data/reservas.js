// Datos de prueba para HU-06 · Reserva de mesa.
// Los datos de la app viven en memoria y se comparten entre pruebas,
// así que cada prueba reserva en una fecha distinta para no pisarse.

export const cupoPorHorario = 8;

export const horarios = {
  temprano: '18:00',
  medio: '19:00',
  tarde: '20:00',
};

export const cliente = 'Ana Pérez';

// Devuelve una fecha futura aleatoria (AAAA-MM-DD) entre los años 2100 y 2999.
export function fechaUnica() {
  const anio = 2100 + Math.floor(Math.random() * 900);
  const mes = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  const dia = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
