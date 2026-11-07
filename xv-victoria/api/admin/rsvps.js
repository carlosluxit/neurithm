// GET    /api/admin/rsvps        — lista de confirmaciones y totales.
// DELETE /api/admin/rsvps?id=123 — elimina una confirmación (p. ej. una prueba o un duplicado).
import { consulta } from '../../lib/db.js';
import { json, error, manejar, exigirMismoOrigen } from '../../lib/http.js';
import { exigirSesion } from '../../lib/sesion.js';

export const GET = manejar(async (request) => {
  await exigirSesion(request);
  const { rows } = await consulta(
    `select id, nombre, asiste, personas, telefono, mensaje, veces, creado, actualizado
       from rsvps order by actualizado desc limit 2000`,
  );
  const totales = rows.reduce(
    (t, r) => {
      t.respuestas += 1;
      if (r.asiste) { t.asisten += 1; t.personas += r.personas; } else { t.noAsisten += 1; }
      return t;
    },
    { respuestas: 0, asisten: 0, noAsisten: 0, personas: 0 },
  );
  return json({ ok: true, totales, rsvps: rows });
});

export const DELETE = manejar(async (request) => {
  exigirMismoOrigen(request);
  await exigirSesion(request);
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isSafeInteger(id) || id <= 0) return error(400, 'Identificador inválido.');
  const { rowCount } = await consulta('delete from rsvps where id = $1', [id]);
  if (!rowCount) return error(404, 'Esa confirmación ya no existe.');
  return json({ ok: true });
});
