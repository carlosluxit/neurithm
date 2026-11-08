// Une la lista de invitados (Google Sheets) con las confirmaciones guardadas, para el panel.
import { consulta } from './db.js';
import { obtenerInvitados, listaConfigurada, urlEdicion } from './invitados.js';

export async function resumenInvitados() {
  const { rows: rsvps } = await consulta(
    `select id, nombre, nombre_clave, asiste, personas, cupos, telefono, mensaje, veces, creado, actualizado
       from rsvps order by actualizado desc limit 5000`,
  );

  let lista = null;
  let avisoLista = null;
  if (listaConfigurada()) {
    try { lista = await obtenerInvitados(); } catch (e) { avisoLista = e.publico || e.message; }
  }

  const porClave = new Map(rsvps.map((r) => [r.nombre_clave, r]));
  const filas = [];
  const usados = new Set();

  if (lista) {
    for (const inv of lista.invitados) {
      const r = porClave.get(inv.id);
      if (r) usados.add(r.nombre_clave);
      filas.push({
        id: r ? r.id : null,
        nombre: inv.nombre,
        cupos: inv.cupos,
        estado: r ? (r.asiste ? 'si' : 'no') : 'pendiente',
        personas: r && r.asiste ? r.personas : 0,
        telefono: r ? r.telefono : null,
        mensaje: r ? r.mensaje : null,
        veces: r ? r.veces : 0,
        creado: r ? r.creado : null,
        actualizado: r ? r.actualizado : null,
        enLista: true,
      });
    }
  }
  for (const r of rsvps) {
    if (usados.has(r.nombre_clave)) continue;
    filas.push({
      id: r.id, nombre: r.nombre, cupos: r.cupos, estado: r.asiste ? 'si' : 'no',
      personas: r.asiste ? r.personas : 0, telefono: r.telefono, mensaje: r.mensaje, veces: r.veces,
      creado: r.creado, actualizado: r.actualizado, enLista: lista ? false : null,
    });
  }

  const t = { invitaciones: 0, cupos: 0, respuestas: 0, asisten: 0, noAsisten: 0, personas: 0, pendientes: 0, cuposPendientes: 0 };
  for (const f of filas) {
    if (f.enLista) { t.invitaciones += 1; t.cupos += f.cupos || 0; }
    if (f.estado === 'pendiente') { t.pendientes += 1; t.cuposPendientes += f.cupos || 0; continue; }
    t.respuestas += 1;
    if (f.estado === 'si') { t.asisten += 1; t.personas += f.personas; } else t.noAsisten += 1;
  }

  // Respondidos primero (más recientes arriba), luego pendientes en orden alfabético.
  filas.sort((a, b) => {
    if ((a.estado === 'pendiente') !== (b.estado === 'pendiente')) return a.estado === 'pendiente' ? 1 : -1;
    if (a.estado === 'pendiente') return a.nombre.localeCompare(b.nombre, 'es');
    return new Date(b.actualizado) - new Date(a.actualizado);
  });

  return { totales: t, filas, conLista: Boolean(lista), avisoLista, hojaUrl: lista ? urlEdicion() : null };
}
