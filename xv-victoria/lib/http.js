// Utilidades HTTP compartidas por las funciones de /api.
import { createHash } from 'node:crypto';

const CABECERAS_BASE = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Robots-Tag': 'noindex, nofollow',
};

export function json(datos, estado = 200, extra = {}) {
  return new Response(JSON.stringify(datos), { status: estado, headers: { ...CABECERAS_BASE, ...extra } });
}

export function error(estado, mensaje, extra = {}) {
  return json({ ok: false, error: mensaje }, estado, extra);
}

// Envuelve un manejador para devolver errores en JSON sin filtrar detalles internos.
export function manejar(fn) {
  return async (request) => {
    try {
      return await fn(request);
    } catch (e) {
      if (e && e.status) return error(e.status, e.publico || e.message);
      console.error('[api]', e);
      return error(500, 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.');
    }
  };
}

export class ErrorHttp extends Error {
  constructor(status, mensaje) { super(mensaje); this.status = status; this.publico = mensaje; }
}

// Lee un cuerpo JSON pequeño (máx. 8 KB).
export async function leerJson(request, maxBytes = 8192) {
  const tipo = request.headers.get('content-type') || '';
  if (!tipo.toLowerCase().includes('application/json')) throw new ErrorHttp(415, 'Formato no soportado.');
  const largo = Number(request.headers.get('content-length') || 0);
  if (largo > maxBytes) throw new ErrorHttp(413, 'La solicitud es demasiado grande.');
  const texto = await request.text();
  if (Buffer.byteLength(texto) > maxBytes) throw new ErrorHttp(413, 'La solicitud es demasiado grande.');
  try {
    const datos = JSON.parse(texto);
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) throw new Error();
    return datos;
  } catch {
    throw new ErrorHttp(400, 'No pudimos leer los datos enviados.');
  }
}

// Bloquea solicitudes que cambian datos y vienen de otro sitio (protección CSRF).
export function exigirMismoOrigen(request) {
  const origen = request.headers.get('origin');
  if (!origen) {
    // Sin Origin: se acepta solo si la cabecera de navegación indica mismo sitio o no es un navegador.
    const sitio = request.headers.get('sec-fetch-site');
    if (sitio && sitio !== 'same-origin' && sitio !== 'none') throw new ErrorHttp(403, 'Solicitud no permitida.');
    return;
  }
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  let hostOrigen;
  try { hostOrigen = new URL(origen).host; } catch { throw new ErrorHttp(403, 'Solicitud no permitida.'); }
  if (!host || hostOrigen !== host) throw new ErrorHttp(403, 'Solicitud no permitida.');
}

export function ipCliente(request) {
  const fwd = request.headers.get('x-forwarded-for') || '';
  return (request.headers.get('x-real-ip') || fwd.split(',')[0] || '').trim() || 'desconocida';
}

// Guardamos solo un hash de la IP (no la IP), para limitar abusos respetando la privacidad.
export function hashIp(ip) {
  const sal = process.env.IP_SALT || 'xv-victoria';
  return createHash('sha256').update(sal + '|' + ip).digest('base64url').slice(0, 22);
}

export function sha256(texto) {
  return createHash('sha256').update(texto).digest('base64url');
}

export function leerCookie(request, nombre) {
  const cab = request.headers.get('cookie') || '';
  for (const parte of cab.split(';')) {
    const i = parte.indexOf('=');
    if (i > -1 && parte.slice(0, i).trim() === nombre) return decodeURIComponent(parte.slice(i + 1).trim());
  }
  return null;
}
