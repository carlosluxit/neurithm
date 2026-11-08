// GET /api/admin/exportar — descarga invitados y confirmaciones en CSV (Excel o Google Sheets).
import { manejar } from '../../lib/http.js';
import { exigirSesion } from '../../lib/sesion.js';
import { resumenInvitados } from '../../lib/resumen.js';

function celda(v) {
  let s = v === null || v === undefined ? '' : String(v);
  // Evita que Excel interprete el contenido como fórmula.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d ()-]+$/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function fecha(d) {
  if (!d) return '';
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'short',
  }).format(new Date(d));
}

const ESTADO = { si: 'Asiste', no: 'No asiste', pendiente: 'Sin responder' };

export const GET = manejar(async (request) => {
  await exigirSesion(request);
  const { filas } = await resumenInvitados();
  const encabezado = ['Nombre', 'Estado', 'Cupos', 'Personas confirmadas', 'Celular', 'Mensaje', 'Veces enviado', 'Última actualización', 'En la lista'];
  const lineas = [encabezado.map(celda).join(';')];
  for (const f of filas) {
    lineas.push([
      f.nombre, ESTADO[f.estado], f.cupos ?? '', f.estado === 'si' ? f.personas : 0, f.telefono, f.mensaje,
      f.veces || '', fecha(f.actualizado), f.enLista === null ? '' : (f.enLista ? 'Sí' : 'No'),
    ].map(celda).join(';'));
  }
  const hoy = new Date().toISOString().slice(0, 10);
  return new Response('﻿' + lineas.join('\r\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="invitados-xv-victoria-${hoy}.csv"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
});
