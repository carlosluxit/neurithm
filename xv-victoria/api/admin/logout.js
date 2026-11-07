// POST /api/admin/logout — cierra la sesión actual.
import { json, manejar, exigirMismoOrigen } from '../../lib/http.js';
import { cerrarSesion, cookieBorrada } from '../../lib/sesion.js';

export const POST = manejar(async (request) => {
  exigirMismoOrigen(request);
  await cerrarSesion(request);
  return json({ ok: true }, 200, { 'Set-Cookie': cookieBorrada(request) });
});
