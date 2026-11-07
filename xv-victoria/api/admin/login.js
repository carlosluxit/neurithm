// POST /api/admin/login — inicia sesión en el panel con la contraseña de administración.
import { json, error, manejar, leerJson, exigirMismoOrigen, ipCliente, hashIp } from '../../lib/http.js';
import { contrasenaConfigurada, contrasenaCorrecta, crearSesion } from '../../lib/sesion.js';
import { contar, registrar, limpiar } from '../../lib/limites.js';

const MAX_FALLOS = 5;
const VENTANA_MIN = 15;

export const POST = manejar(async (request) => {
  exigirMismoOrigen(request);
  if (!contrasenaConfigurada()) {
    return error(503, 'El panel aún no tiene contraseña. Configura ADMIN_PASSWORD (mínimo 10 caracteres) en Vercel.');
  }
  const clave = 'login:' + hashIp(ipCliente(request));
  if ((await contar(clave, VENTANA_MIN)) >= MAX_FALLOS) {
    return error(429, `Demasiados intentos fallidos. Espera ${VENTANA_MIN} minutos e inténtalo de nuevo.`, { 'Retry-After': String(VENTANA_MIN * 60) });
  }

  const { contrasena } = await leerJson(request, 1024);
  if (!contrasenaCorrecta(contrasena)) {
    await registrar(clave);
    // Pequeña espera para frenar ataques de fuerza bruta.
    await new Promise((r) => setTimeout(r, 600));
    return error(401, 'Contraseña incorrecta.');
  }

  await limpiar(clave);
  const cookie = await crearSesion(request);
  return json({ ok: true }, 200, { 'Set-Cookie': cookie });
});
