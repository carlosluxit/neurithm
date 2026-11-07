// POST /api/rsvp — guarda o actualiza la confirmación de un invitado.
import { consulta } from '../lib/db.js';
import { json, error, manejar, leerJson, exigirMismoOrigen, ipCliente, hashIp } from '../lib/http.js';
import { validarRsvp, pareceBot } from '../lib/validar.js';
import { contar, registrar } from '../lib/limites.js';

const MAX_POR_HORA = 8;

export const POST = manejar(async (request) => {
  exigirMismoOrigen(request);
  const datos = await leerJson(request);

  // A los bots les respondemos "ok" sin guardar nada.
  if (pareceBot(datos)) return json({ ok: true, nuevo: true }, 201);

  const v = validarRsvp(datos);
  if (!v.ok) return json({ ok: false, error: 'Revisa los datos del formulario.', errores: v.errores }, 400);

  const ipHash = hashIp(ipCliente(request));
  const clave = 'rsvp:' + ipHash;
  if ((await contar(clave, 60)) >= MAX_POR_HORA) {
    return error(429, 'Recibimos demasiadas confirmaciones desde esta conexión. Intenta de nuevo más tarde.', { 'Retry-After': '900' });
  }
  await registrar(clave);

  const r = v.valor;
  const { rows } = await consulta(
    `insert into rsvps (nombre, nombre_clave, asiste, personas, telefono, mensaje, ip_hash)
     values ($1, $2, $3, $4, $5, $6, $7)
     on conflict (nombre_clave) do update set
       nombre = excluded.nombre,
       asiste = excluded.asiste,
       personas = excluded.personas,
       telefono = coalesce(excluded.telefono, rsvps.telefono),
       mensaje = coalesce(excluded.mensaje, rsvps.mensaje),
       ip_hash = excluded.ip_hash,
       veces = least(rsvps.veces + 1, 999),
       actualizado = now()
     returning (xmax = 0) as nuevo`,
    [r.nombre, r.nombre_clave, r.asiste, r.personas, r.telefono, r.mensaje, ipHash],
  );

  const nuevo = rows[0].nuevo;
  return json({ ok: true, nuevo, nombre: r.nombre, asiste: r.asiste, personas: r.personas }, nuevo ? 201 : 200);
});

export function GET() {
  return error(405, 'Método no permitido.', { Allow: 'POST' });
}
