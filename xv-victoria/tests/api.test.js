// Pruebas de la API contra un Postgres real.
// Ejecutar: TEST_DATABASE_URL=postgres://usuario:clave@localhost:5432/xv npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

const URL_BD = process.env.TEST_DATABASE_URL;
const omitir = !URL_BD && 'Defina TEST_DATABASE_URL para ejecutar las pruebas de la API';
const BASE = 'https://xv.test';
const CLAVE = 'una-clave-de-prueba-segura';

let rsvp, login, logout, sesion, lista, exportar, db;

before(async () => {
  if (omitir) return;
  process.env.DATABASE_URL = URL_BD;
  process.env.ADMIN_PASSWORD = CLAVE;
  const c = new pg.Client({ connectionString: URL_BD });
  await c.connect();
  await c.query('drop table if exists rsvps, admin_sesiones, limites');
  await c.end();
  rsvp = await import('../api/rsvp.js');
  login = await import('../api/admin/login.js');
  logout = await import('../api/admin/logout.js');
  sesion = await import('../api/admin/sesion.js');
  lista = await import('../api/admin/rsvps.js');
  exportar = await import('../api/admin/exportar.js');
  db = await import('../lib/db.js');
});

after(async () => { if (db) await db.cerrarPool(); });

let ipSeq = 0;
function req(ruta, { method = 'POST', body, ip, origin = BASE, cookie, tipo = 'application/json' } = {}) {
  const headers = { host: 'xv.test', 'x-real-ip': ip || `10.0.0.${++ipSeq}` };
  if (origin) headers.origin = origin;
  if (cookie) headers.cookie = cookie;
  if (body !== undefined) headers['content-type'] = tipo;
  return new Request(BASE + ruta, { method, headers, body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)) });
}

const invitado = (extra = {}) => ({ nombre: 'Ana María Pérez', asiste: 'si', personas: 3, telefono: '+57 300 123 4567', mensaje: '¡Felices XV!', ms: 9000, sitio_web: '', ...extra });

test('guarda una confirmación nueva', { skip: omitir }, async () => {
  const r = await rsvp.POST(req('/api/rsvp', { body: invitado() }));
  assert.equal(r.status, 201);
  const d = await r.json();
  assert.equal(d.ok, true);
  assert.equal(d.nuevo, true);
  assert.equal(d.personas, 3);
});

test('el mismo nombre (sin tildes ni mayúsculas) actualiza en vez de duplicar', { skip: omitir }, async () => {
  const r = await rsvp.POST(req('/api/rsvp', { body: invitado({ nombre: '  ana maria   PEREZ ', personas: 2, mensaje: '' }) }));
  assert.equal(r.status, 200);
  const d = await r.json();
  assert.equal(d.nuevo, false);
  const { rows } = await db.consulta('select count(*)::int n, max(veces) v, max(personas) p, max(mensaje) m from rsvps');
  assert.deepEqual([rows[0].n, rows[0].v, rows[0].p, rows[0].m], [1, 2, 2, '¡Felices XV!']);
});

test('quien no asiste queda con 0 personas', { skip: omitir }, async () => {
  const r = await rsvp.POST(req('/api/rsvp', { body: invitado({ nombre: 'Carlos Gómez', asiste: 'no', personas: 4, telefono: '' }) }));
  assert.equal(r.status, 201);
  const { rows } = await db.consulta(`select personas, telefono from rsvps where nombre = 'Carlos Gómez'`);
  assert.deepEqual(rows[0], { personas: 0, telefono: null });
});

test('valida los datos y responde en español', { skip: omitir }, async () => {
  const r = await rsvp.POST(req('/api/rsvp', { body: { nombre: 'A', asiste: 'si', personas: 9, telefono: 'abc', ms: 9000 } }));
  assert.equal(r.status, 400);
  const d = await r.json();
  assert.ok(d.errores.nombre && d.errores.personas && d.errores.telefono);
});

test('ignora bots (campo trampa o envío instantáneo) sin guardar', { skip: omitir }, async () => {
  const antes = (await db.consulta('select count(*)::int n from rsvps')).rows[0].n;
  const r1 = await rsvp.POST(req('/api/rsvp', { body: invitado({ nombre: 'Bot Uno', sitio_web: 'http://spam' }) }));
  const r2 = await rsvp.POST(req('/api/rsvp', { body: invitado({ nombre: 'Bot Dos', ms: 300 }) }));
  assert.equal(r1.status, 201);
  assert.equal(r2.status, 201);
  assert.equal((await db.consulta('select count(*)::int n from rsvps')).rows[0].n, antes);
});

test('rechaza otros orígenes y formatos', { skip: omitir }, async () => {
  assert.equal((await rsvp.POST(req('/api/rsvp', { body: invitado(), origin: 'https://malo.example' }))).status, 403);
  assert.equal((await rsvp.POST(req('/api/rsvp', { body: 'nombre=x', tipo: 'application/x-www-form-urlencoded' }))).status, 415);
  assert.equal((await rsvp.POST(req('/api/rsvp', { body: '{roto' }))).status, 400);
});

test('limita las confirmaciones por conexión', { skip: omitir }, async () => {
  const ip = '10.9.9.9';
  let ultimo;
  for (let i = 0; i < 9; i++) {
    ultimo = await rsvp.POST(req('/api/rsvp', { ip, body: invitado({ nombre: `Persona Limite ${String.fromCharCode(65 + i)}` }) }));
  }
  assert.equal(ultimo.status, 429);
});

test('el panel exige sesión', { skip: omitir }, async () => {
  assert.equal((await lista.GET(req('/api/admin/rsvps', { method: 'GET' }))).status, 401);
  assert.equal((await exportar.GET(req('/api/admin/exportar', { method: 'GET' }))).status, 401);
  const s = await (await sesion.GET(req('/api/admin/sesion', { method: 'GET' }))).json();
  assert.equal(s.activa, false);
});

test('contraseña incorrecta y bloqueo tras 5 intentos', { skip: omitir }, async () => {
  const ip = '10.7.7.7';
  for (let i = 0; i < 5; i++) {
    const r = await login.POST(req('/api/admin/login', { ip, body: { contrasena: 'mala' } }));
    assert.equal(r.status, 401);
  }
  const bloqueado = await login.POST(req('/api/admin/login', { ip, body: { contrasena: CLAVE } }));
  assert.equal(bloqueado.status, 429);
});

test('flujo completo del administrador', { skip: omitir }, async () => {
  const r = await login.POST(req('/api/admin/login', { body: { contrasena: CLAVE } }));
  assert.equal(r.status, 200);
  const setCookie = r.headers.get('set-cookie');
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Strict/);
  assert.match(setCookie, /Secure/);
  const cookie = setCookie.split(';')[0];

  const s = await (await sesion.GET(req('/api/admin/sesion', { method: 'GET', cookie }))).json();
  assert.equal(s.activa, true);

  const l = await lista.GET(req('/api/admin/rsvps', { method: 'GET', cookie }));
  assert.equal(l.status, 200);
  const d = await l.json();
  assert.ok(d.totales.respuestas >= 2);
  assert.equal(d.totales.noAsisten, 1);
  const ana = d.filas.find((x) => x.nombre === 'ana maria PEREZ');
  assert.ok(ana, 'debe mostrar el nombre más reciente');

  const csv = await exportar.GET(req('/api/admin/exportar', { method: 'GET', cookie }));
  assert.equal(csv.status, 200);
  assert.match(csv.headers.get('content-disposition'), /attachment/);
  const bytes = Buffer.from(await csv.arrayBuffer());
  assert.deepEqual([...bytes.subarray(0, 3)], [0xef, 0xbb, 0xbf], 'CSV con BOM para que Excel lea las tildes');
  const texto = bytes.subarray(3).toString('utf8');
  assert.ok(texto.startsWith('"Nombre";"Estado";"Cupos"'));
  assert.ok(texto.includes('"+57 300 123 4567"'), 'el celular no debe llevar apóstrofo');

  const carlos = d.filas.find((x) => x.nombre === 'Carlos Gómez');
  assert.equal((await lista.DELETE(req(`/api/admin/rsvps?id=${carlos.id}`, { method: 'DELETE', cookie, origin: 'https://malo.example' }))).status, 403);
  assert.equal((await lista.DELETE(req(`/api/admin/rsvps?id=${carlos.id}`, { method: 'DELETE', cookie }))).status, 200);
  assert.equal((await lista.DELETE(req(`/api/admin/rsvps?id=${carlos.id}`, { method: 'DELETE', cookie }))).status, 404);

  const o = await logout.POST(req('/api/admin/logout', { cookie }));
  assert.match(o.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await lista.GET(req('/api/admin/rsvps', { method: 'GET', cookie }))).status, 401);
});

test('sin ADMIN_PASSWORD el acceso queda cerrado', { skip: omitir }, async () => {
  const guardada = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = 'corta';
  const r = await login.POST(req('/api/admin/login', { body: { contrasena: 'corta' } }));
  process.env.ADMIN_PASSWORD = guardada;
  assert.equal(r.status, 503);
});
