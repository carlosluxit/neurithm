// POST /api/rsvp — guarda o actualiza la confirmación de un invitado.
// Si hay lista de invitados (Google Sheets), solo pueden confirmar quienes están en ella
// y nunca por más personas que sus cupos.
import { consulta } from '../lib/db.js';
import { json, error, manejar, leerJson, exigirMismoOrigen, ipCliente, hashIp } from '../lib/http.js';
import { validarRsvp, pareceBot, claveNombre } from '../lib/validar.js';
import { contar, registrar } from '../lib/limites.js';
import { obtenerInvitados } from '../lib/invitados.js';

const MAX_POR_HORA = 8;

function textoCupos(n) { return n === 1 ? 'Tu invitación es para 1 persona.' : `Tu invitación es para ${n} personas.`; }

export const POST = manejar(async (request) => {
  exigirMismoOrigen(request);
  let datos = await leerJson(request);

  // A los bots les respondemos "ok" sin guardar nada.
  if (pareceBot(datos)) return json({ ok: true, nuevo: true }, 201);

  // Buscar al invitado en la lista (por el id elegido en las sugerencias o por el nombre exacto).
  const lista = await obtenerInvitados();
  let invitado = null;
  if (lista) {
    const id = typeof datos.invitado === 'string' ? datos.invitado.slice(0, 120) : '';
    invitado = lista.porClave.get(id) || lista.porClave.get(claveNombre(String(datos.nombre || '').slice(0, 120)));
    if (!invitado) {
      return json({
        ok: false,
        error: 'Revisa los datos del formulario.',
        errores: { nombre: 'No encontramos ese nombre en la lista de invitados. Escribe tu nombre y elígelo de las sugerencias.' },
      }, 400);
    }
    datos = { ...datos, nombre: invitado.nombre };
  }

  const v = validarRsvp(datos, invitado ? { maxPersonas: invitado.cupos, mensajePersonas: textoCupos(invitado.cupos) } : {});
  if (!v.ok) return json({ ok: false, error: 'Revisa los datos del formulario.', errores: v.errores }, 400);

  const ipHash = hashIp(ipCliente(request));
  const clave = 'rsvp:' + ipHash;
  if ((await contar(clave, 60)) >= MAX_POR_HORA) {
    return error(429, 'Recibimos demasiadas confirmaciones desde esta conexión. Intenta de nuevo más tarde.', { 'Retry-After': '900' });
  }
  await registrar(clave);

  const r = v.valor;
  const { rows } = await consulta(
    `insert into rsvps (nombre, nombre_clave, asiste, personas, cupos, telefono, mensaje, ip_hash)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (nombre_clave) do update set
       nombre = excluded.nombre,
       asiste = excluded.asiste,
       personas = excluded.personas,
       cupos = excluded.cupos,
       telefono = coalesce(excluded.telefono, rsvps.telefono),
       mensaje = coalesce(excluded.mensaje, rsvps.mensaje),
       ip_hash = excluded.ip_hash,
       veces = least(rsvps.veces + 1, 999),
       actualizado = now()
     returning (xmax = 0) as nuevo`,
    [r.nombre, invitado ? invitado.id : r.nombre_clave, r.asiste, r.personas, invitado ? invitado.cupos : null,
      r.telefono, r.mensaje, ipHash],
  );

  const nuevo = rows[0].nuevo;
  return json({ ok: true, nuevo, nombre: r.nombre, asiste: r.asiste, personas: r.personas, cupos: invitado ? invitado.cupos : null }, nuevo ? 201 : 200);
});

export function GET() {
  return error(405, 'Método no permitido.', { Allow: 'POST' });
}
