// GET /api/admin/exportar — descarga las confirmaciones en CSV (se abre en Excel o Google Sheets).
import { consulta } from '../../lib/db.js';
import { manejar } from '../../lib/http.js';
import { exigirSesion } from '../../lib/sesion.js';

function celda(v) {
  let s = v === null || v === undefined ? '' : String(v);
  // Evita que Excel interprete el contenido como fórmula.
  if (/^[=+\-@\t\r]/.test(s) && !/^\+?[\d ()-]+$/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

function fecha(d) {
  return new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'short',
  }).format(new Date(d));
}

export const GET = manejar(async (request) => {
  await exigirSesion(request);
  const { rows } = await consulta(
    `select nombre, asiste, personas, telefono, mensaje, veces, creado, actualizado
       from rsvps order by nombre_clave`,
  );
  const encabezado = ['Nombre', 'Asiste', 'Personas', 'Celular', 'Mensaje', 'Veces enviado', 'Primera respuesta', 'Última actualización'];
  const lineas = [encabezado.map(celda).join(';')];
  for (const r of rows) {
    lineas.push([
      r.nombre, r.asiste ? 'Sí' : 'No', r.personas, r.telefono, r.mensaje, r.veces, fecha(r.creado), fecha(r.actualizado),
    ].map(celda).join(';'));
  }
  const hoy = new Date().toISOString().slice(0, 10);
  return new Response('﻿' + lineas.join('\r\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="confirmaciones-xv-victoria-${hoy}.csv"`,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
});
