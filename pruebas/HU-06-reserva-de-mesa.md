# Taller: HU-06 · Reserva de mesa

**Como** cliente, **quiero** reservar una mesa solo si hay lugares **para** no reservar de más.

## 1. Bug encontrado

**La app permite reservar aunque no haya lugares (sobrecupo).**

Pasos para reproducirlo:
1. Iniciar sesión e ir a **Reserva de mesa**.
2. Elegir una fecha y hora sin reservas (8 lugares disponibles).
3. Reservar para **9 personas**.

| | Esperado (criterio 2) | Obtenido |
|---|---|---|
| Mensaje | `Solo quedan 8 lugares` | `Reserva creada` |
| Reserva | No se crea | Se crea con estado `reservada` |
| Lugares disponibles | 8 | **-1** |

Lo mismo ocurre si el horario ya tiene reservas: con 6 personas reservadas, una reserva de 3 se acepta en lugar de mostrar `Solo quedan 2 lugares`.

Causa en el código: en `cafeteria_v3_local/server.js` (ruta `POST /api/reservas`) la validación `n > disponibles` existe pero está desactivada por el interruptor `reserva_sobrecupo` de `lib/bugs.js`, así que el servidor nunca rechaza la reserva.

## 2. Prueba que detecta el bug

`tests/reserva.spec.js` → **`@bug no reserva más personas que los lugares de un horario vacío`**

Reserva 9 personas en un horario vacío y verifica que:
- el mensaje sea `Solo quedan 8 lugares`,
- el estado siga en `-` (no se creó reserva),
- los lugares disponibles sigan en 8.

Las otras dos pruebas marcadas `@bug` (criterio 2) también lo detectan, desde un horario con reservas previas y desde un horario lleno.

## 3. Todos los casos de prueba

| # | Criterio | Caso | Resultado con bug |
|---|---|---|---|
| 1 | Bug | No reserva más personas que los lugares de un horario vacío (9 de 8) | ❌ Falla |
| 2 | 1 | Un horario sin reservas tiene 8 lugares disponibles | ✅ |
| 3 | 1 | Una reserva de 3 deja 5 lugares | ✅ |
| 4 | 1 | Varias reservas se suman (3 + 2 → quedan 3) | ✅ |
| 5 | 1 | Una reserva en 18:00 no afecta 19:00 | ✅ |
| 6 | 1 | Límite: reservar exactamente 8 deja 0 lugares | ✅ |
| 7 | 2 | Con 6 reservadas, una reserva de 3 muestra `Solo quedan 2 lugares` | ❌ Falla |
| 8 | 2 | Con el horario lleno, una reserva de 1 muestra `Solo quedan 0 lugares` | ❌ Falla |
| 9 | 2 | Sin fecha, muestra `Todos los campos son obligatorios` | ✅ |
| 10 | 3 | Cancelar una reserva de 5 devuelve los lugares (3 → 8) | ✅ |
| 11 | 3 | Tras cancelar una reserva de 8, se puede reservar el horario completo otra vez | ✅ |

Resultados (Chromium, Firefox y WebKit):
- **App con bug:** 24 pasan, 9 fallan (los 3 casos `@bug` × 3 navegadores).
- **App en modo referencia** (`MODO_REFERENCIA=true`, sin bugs): 33 de 33 pasan, lo que muestra que las pruebas que fallan lo hacen por el bug y no por un error en la prueba.

## 4. Organización (modelo en capas)

| Capa | Archivo | Qué contiene |
|---|---|---|
| tests | `tests/reserva.spec.js` | Los casos y sus `expect`, agrupados por criterio. Sin localizadores ni URLs. |
| fixtures | `fixtures/login.js` | `paginaLogueada` (inicia sesión) y `paginaReserva` (abre la pantalla de reserva). |
| pages | `pages/PaginaReserva.js` | Localizadores (`getByRole`, `getByLabel`, `getByTestId`) y acciones: `reservar`, `consultarDisponibilidad`, `cancelar`. |
| data | `data/reservas.js` | Cupo (8), horarios, nombre del cliente y `fechaUnica()`. |

Decisiones que vale la pena explicar:
- **`fechaUnica()`**: la app guarda las reservas en memoria y todas las pruebas comparten el mismo servidor y corren en paralelo. Cada prueba usa una fecha aleatoria distinta para que sus reservas no cambien los lugares disponibles de otra prueba.
- **`clicYEsperar()`** en el page object: después de dos reservas seguidas, el mensaje ya dice `Reserva creada` desde la primera. Por eso cada acción espera la respuesta del servidor antes de seguir, en lugar de confiar solo en el texto de la pantalla.

## 5. Cómo ejecutar

En una terminal, levantar la app:

```bash
cd cafeteria_v3_local
npm install
npm start
```

En otra terminal, correr las pruebas:

```bash
cd pruebas
npx playwright test tests/reserva.spec.js
```

Solo las pruebas que detectan el bug: `npx playwright test --grep @bug`.
Ver el reporte: `npx playwright show-report`.
