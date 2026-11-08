// GET /api/invitados?q=mar — sugerencias para el campo de nombre del formulario.
// Devuelve como máximo 6 nombres de la lista con sus cupos, y solo a partir de 3 letras.
import { json, error, manejar, ipCliente, hashIp } from '../lib/http.js';
import { obtenerInvitados, buscar } from '../lib/invitados.js';
import { claveNombre } from '../lib/validar.js';
import { contar, registrar } from '../lib/limites.js';

const MAX_BUSQUEDAS = 150; // por conexión cada 10 minutos

export const GET = manejar(async (request) => {
  const q = (new URL(request.url).searchParams.get('q') || '').slice(0, 60);
  const lista = await obtenerInvitados();
  if (!lista) return json({ ok: true, lista: false, resultados: [] });
  if (claveNombre(q).replace(/ /g, '').length < 3) return json({ ok: true, lista: true, resultados: [] });

  const clave = 'buscar:' + hashIp(ipCliente(request));
  if ((await contar(clave, 10)) >= MAX_BUSQUEDAS) {
    return error(429, 'Demasiadas búsquedas seguidas. Espera un momento e inténtalo de nuevo.', { 'Retry-After': '120' });
  }
  await registrar(clave);

  const resultados = buscar(lista, q).map((i) => ({ id: i.id, nombre: i.nombre, cupos: i.cupos }));
  return json({ ok: true, lista: true, resultados });
});
