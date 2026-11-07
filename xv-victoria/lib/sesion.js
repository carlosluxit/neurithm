// Sesiones del panel de administración.
// El token viaja solo en una cookie HttpOnly; en la base de datos se guarda su hash.
import { randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { consulta } from './db.js';
import { leerCookie, sha256, ErrorHttp } from './http.js';

export const COOKIE = 'xv_admin';
const DURACION_HORAS = 12;

export function contrasenaConfigurada() {
  const c = process.env.ADMIN_PASSWORD || '';
  return c.length >= 10;
}

// Comparación en tiempo constante (sobre los hashes, para igualar longitudes).
export function contrasenaCorrecta(intento) {
  const real = process.env.ADMIN_PASSWORD || '';
  if (typeof intento !== 'string' || !real) return false;
  const a = createHash('sha256').update(intento).digest();
  const b = createHash('sha256').update(real).digest();
  return timingSafeEqual(a, b);
}

function atributosCookie(request) {
  const url = new URL(request.url);
  const seguro = url.protocol === 'https:' || url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  return `Path=/; HttpOnly; SameSite=Strict${seguro ? '; Secure' : ''}`;
}

export async function crearSesion(request) {
  const token = randomBytes(32).toString('base64url');
  await consulta(
    `insert into admin_sesiones (token_hash, expira) values ($1, now() + make_interval(hours => $2))`,
    [sha256(token), DURACION_HORAS],
  );
  if (Math.random() < 0.2) await consulta('delete from admin_sesiones where expira < now()');
  return `${COOKIE}=${token}; Max-Age=${DURACION_HORAS * 3600}; ${atributosCookie(request)}`;
}

export function cookieBorrada(request) {
  return `${COOKIE}=; Max-Age=0; ${atributosCookie(request)}`;
}

export async function sesionValida(request) {
  const token = leerCookie(request, COOKIE);
  if (!token || token.length > 100) return false;
  const { rows } = await consulta(
    'select 1 from admin_sesiones where token_hash = $1 and expira > now()',
    [sha256(token)],
  );
  return rows.length === 1;
}

export async function exigirSesion(request) {
  if (!(await sesionValida(request))) throw new ErrorHttp(401, 'Tu sesión terminó. Vuelve a entrar.');
}

export async function cerrarSesion(request) {
  const token = leerCookie(request, COOKIE);
  if (token) await consulta('delete from admin_sesiones where token_hash = $1', [sha256(token)]);
}
