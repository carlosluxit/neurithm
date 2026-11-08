// GET    /api/admin/rsvps        — invitados de la lista + confirmaciones y totales.
// DELETE /api/admin/rsvps?id=123 — elimina una confirmación (p. ej. una prueba o un duplicado).
import { consulta } from '../../lib/db.js';
import { json, error, manejar, exigirMismoOrigen } from '../../lib/http.js';
import { exigirSesion } from '../../lib/sesion.js';
import { resumenInvitados } from '../../lib/resumen.js';

export const GET = manejar(async (request) => {
  await exigirSesion(request);
  return json({ ok: true, ...(await resumenInvitados()) });
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
