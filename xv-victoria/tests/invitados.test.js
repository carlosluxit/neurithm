// Pruebas de la lista de invitados (Google Sheets) y los cupos, contra un Postgres real.
// Ejecutar: TEST_DATABASE_URL=postgres://usuario:clave@localhost:5432/xv npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import pg from 'pg';

const URL_BD = process.env.TEST_DATABASE_URL;
const omitir = !URL_BD && 'Defina TEST_DATABASE_URL para ejecutar estas pruebas';
const BASE = 'https://xv.test';
const CSV = 'Nombre ,Apellido,Cupos\r\n' +
  'Maria Alejandra,Romero,1\r\n' +
  'Familia,Castillo Herrera,4\r\n' +
  '"José ""Pepe""",Pérez,\r\n' +
  ',,\r\n' +
  'maria alejandra,ROMERO,3\r\n';

let rsvp, buscarApi, lista, login, inv, db;

before(async () => {
  if (omitir) return;
  process.env.DATABASE_URL = URL_BD;
  process.env.ADMIN_PASSWORD = 'una-clave-de-prueba-segura';
  process.env.INVITADOS_CSV_URL = 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSV);
  const c = new pg.Client({ connectionString: URL_BD });
  await c.connect();
  await c.query('drop table if exists rsvps, admin_sesiones, limites, invitados_copia');
  await c.end();
  rsvp = await import('../api/rsvp.js');
  buscarApi = await import('../api/invitados.js');
  lista = await import('../api/admin/rsvps.js');
  login = await import('../api/admin/login.js');
  inv = await import('../lib/invitados.js');
  db = await import('../lib/db.js');
});
after(async () => { if (db) await db.cerrarPool(); });

let ip = 0;
const req = (ruta, { method = 'GET', body, cookie } = {}) => new Request(BASE + ruta, {
  method,
  headers: { host: 'xv.test', origin: BASE, 'x-real-ip': `10.1.0.${++ip}`, ...(body ? { 'content-type': 'application/json' } : {}), ...(cookie ? { cookie } : {}) },
  body: body ? JSON.stringify(body) : undefined,
});
const enviar = (extra) => rsvp.POST(req('/api/rsvp', { method: 'POST', body: { asiste: 'si', personas: 1, ms: 9000, ...extra } }));

test('lee la hoja: columnas con espacios, tildes, comillas, filas vacías y duplicados', { skip: omitir }, async () => {
  const l = await inv.obtenerInvitados();
  assert.deepEqual(l.invitados, [
    { id: 'maria alejandra romero', nombre: 'Maria Alejandra Romero', cupos: 1 },
    { id: 'familia castillo herrera', nombre: 'Familia Castillo Herrera', cupos: 4 },
    { id: 'jose pepe perez', nombre: 'José "Pepe" Pérez', cupos: 1 },
  ]);
});

test('sugerencias: desde 3 letras, sin tildes, por partes del nombre', { skip: omitir }, async () => {
  const q = async (t) => (await (await buscarApi.GET(req('/api/invitados?q=' + encodeURIComponent(t)))).json());
  assert.equal((await q('ma')).resultados.length, 0);
  assert.deepEqual((await q('ale rom')).resultados.map((r) => r.nombre), ['Maria Alejandra Romero']);
  assert.deepEqual((await q('JOSE')).resultados, [{ id: 'jose pepe perez', nombre: 'José "Pepe" Pérez', cupos: 1 }]);
  assert.deepEqual((await q('castillo')).resultados.map((r) => r.cupos), [4]);
  assert.equal((await q('zzz')).resultados.length, 0);
  const sinQ = await (await buscarApi.GET(req('/api/invitados'))).json();
  assert.equal(sinQ.lista, true);
});

test('quien no está en la lista no puede confirmar', { skip: omitir }, async () => {
  const r = await enviar({ nombre: 'Persona Desconocida' });
  assert.equal(r.status, 400);
  assert.match((await r.json()).errores.nombre, /lista de invitados/);
});

test('no se puede confirmar por más personas que los cupos', { skip: omitir }, async () => {
  const r = await enviar({ invitado: 'familia castillo herrera', nombre: 'x', personas: 5 });
  assert.equal(r.status, 400);
  assert.equal((await r.json()).errores.personas, 'Tu invitación es para 4 personas.');
  const ok = await enviar({ invitado: 'familia castillo herrera', nombre: 'x', personas: 4 });
  assert.equal(ok.status, 201);
  const d = await ok.json();
  assert.equal(d.nombre, 'Familia Castillo Herrera', 'se guarda el nombre de la lista');
  assert.equal(d.cupos, 4);
});

test('también acepta el nombre completo escrito sin elegir la sugerencia', { skip: omitir }, async () => {
  const r = await enviar({ nombre: 'maría alejandra romero', asiste: 'no' });
  assert.equal(r.status, 201);
});

test('el panel muestra pendientes y cupos', { skip: omitir }, async () => {
  const cookie = (await login.POST(req('/api/admin/login', { method: 'POST', body: { contrasena: 'una-clave-de-prueba-segura' } })))
    .headers.get('set-cookie').split(';')[0];
  const d = await (await lista.GET(req('/api/admin/rsvps', { cookie }))).json();
  assert.equal(d.conLista, true);
  assert.deepEqual(d.totales, { invitaciones: 3, cupos: 6, respuestas: 2, asisten: 1, noAsisten: 1, personas: 4, pendientes: 1, cuposPendientes: 1 });
  assert.equal(d.filas.at(-1).estado, 'pendiente');
  assert.equal(d.filas.at(-1).nombre, 'José "Pepe" Pérez');
});

test('si Google no responde, usa la última copia guardada', { skip: omitir }, async () => {
  await new Promise((r) => setTimeout(r, 300)); // deja terminar el guardado de la copia
  inv._reiniciarCache();
  process.env.INVITADOS_CSV_URL = 'http://127.0.0.1:9/no-existe.csv';
  const l = await inv.obtenerInvitados();
  assert.equal(l.invitados.length, 3);
});
