// GET /api/admin/sesion — indica si hay una sesión activa (para mostrar el panel o el acceso).
import { json, manejar } from '../../lib/http.js';
import { sesionValida, contrasenaConfigurada } from '../../lib/sesion.js';

export const GET = manejar(async (request) => {
  return json({ ok: true, activa: await sesionValida(request), configurado: contrasenaConfigurada() });
});
