// Lista de invitados leída de la hoja de Google Sheets ("cualquiera con el enlace puede ver").
// Columnas esperadas (en cualquier orden): Nombre, Apellido, Cupos.
// La hoja se lee desde el servidor; su dirección vive en la variable INVITADOS_SHEET_ID
// (o INVITADOS_CSV_URL) y nunca se envía al navegador de los invitados.
import { consulta } from './db.js';
import { claveNombre } from './validar.js';

const TTL_MS = 60_000;          // los cambios en la hoja se ven en ~1 minuto
const MAX_CUPOS = 20;
let cache = null;               // { invitados, porClave, leido }
let enCurso = null;

export function listaConfigurada() {
  return Boolean(process.env.INVITADOS_CSV_URL || process.env.INVITADOS_SHEET_ID);
}

export function urlEdicion() {
  const id = process.env.INVITADOS_SHEET_ID;
  return id ? `https://docs.google.com/spreadsheets/d/${encodeURIComponent(id)}/edit` : null;
}

function urlCsv() {
  if (process.env.INVITADOS_CSV_URL) return process.env.INVITADOS_CSV_URL;
  const gid = process.env.INVITADOS_SHEET_GID || '0';
  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(process.env.INVITADOS_SHEET_ID)}/export?format=csv&gid=${encodeURIComponent(gid)}`;
}

// CSV con comillas, comas y saltos de línea dentro de campos.
export function parsearCsv(texto) {
  const filas = [];
  let fila = [], campo = '', comillas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"') {
        if (texto[i + 1] === '"') { campo += '"'; i++; } else comillas = false;
      } else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); filas.push(fila); fila = []; campo = '';
    } else campo += c;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }
  return filas;
}

function encabezado(t) { return claveNombre(String(t || '')); }

export function construirLista(filas) {
  if (!filas.length) return [];
  const cab = filas[0].map(encabezado);
  const col = (...nombres) => cab.findIndex((h) => nombres.includes(h));
  const iNombre = col('nombre', 'nombres', 'nombre completo', 'invitado', 'invitados');
  const iApellido = col('apellido', 'apellidos');
  const iCupos = col('cupos', 'cupo', 'personas', 'pases', 'puestos');
  if (iNombre === -1) throw new Error('La hoja no tiene una columna "Nombre".');

  const vistos = new Set();
  const lista = [];
  for (const f of filas.slice(1)) {
    const partes = [f[iNombre], iApellido > -1 ? f[iApellido] : '']
      .map((x) => String(x || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    const nombre = partes.join(' ');
    if (nombre.length < 2) continue;
    const clave = claveNombre(nombre);
    if (!clave || vistos.has(clave)) continue;
    vistos.add(clave);
    let cupos = parseInt(String(iCupos > -1 ? f[iCupos] : '').replace(/[^\d]/g, ''), 10);
    if (!Number.isInteger(cupos) || cupos < 1) cupos = 1;
    lista.push({ id: clave, nombre, cupos: Math.min(cupos, MAX_CUPOS) });
  }
  return lista;
}

function indexar(invitados) {
  return {
    invitados,
    porClave: new Map(invitados.map((i) => [i.id, i])),
    tokens: invitados.map((i) => i.id.split(' ')),
    leido: Date.now(),
  };
}

async function descargar() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const res = await fetch(urlCsv(), { signal: ctrl.signal, redirect: 'follow', headers: { Accept: 'text/csv' } });
    if (!res.ok) throw new Error('La hoja respondió ' + res.status);
    const texto = await res.text();
    if (/^\s*<(!doctype|html)/i.test(texto)) throw new Error('La hoja no es pública (respondió una página de inicio de sesión).');
    return construirLista(parsearCsv(texto));
  } finally {
    clearTimeout(t);
  }
}

// Devuelve la lista (en caché ~1 min). Si Google no responde, usa la última copia guardada.
export async function obtenerInvitados() {
  if (!listaConfigurada()) return null;
  if (cache && Date.now() - cache.leido < TTL_MS) return cache;
  if (!enCurso) {
    enCurso = (async () => {
      try {
        const invitados = await descargar();
        cache = indexar(invitados);
        consulta(
          `insert into invitados_copia (id, datos, leido) values (1, $1, now())
           on conflict (id) do update set datos = excluded.datos, leido = now()`,
          [JSON.stringify(invitados)],
        ).catch(() => {});
      } catch (e) {
        console.error('[invitados]', e.message);
        if (!cache) {
          const { rows } = await consulta('select datos from invitados_copia where id = 1').catch(() => ({ rows: [] }));
          if (rows.length) cache = indexar(rows[0].datos);
        }
        if (!cache) {
          const err = new Error('No pudimos consultar la lista de invitados. Intenta de nuevo en unos minutos.');
          err.status = 503;
          throw err;
        }
        cache.leido = Date.now() - TTL_MS + 15_000; // reintenta en 15 s
      } finally {
        enCurso = null;
      }
    })();
  }
  await enCurso;
  return cache;
}

// Búsqueda: cada palabra escrita debe ser el inicio de alguna palabra del nombre.
export function buscar(lista, q, max = 6) {
  const palabras = claveNombre(q).split(' ').filter(Boolean);
  if (!palabras.length) return [];
  const res = [];
  lista.invitados.forEach((inv, i) => {
    const tokens = lista.tokens[i];
    if (palabras.every((p) => tokens.some((t) => t.startsWith(p)))) res.push(inv);
  });
  return res.slice(0, max);
}

// Solo para pruebas
export function _reiniciarCache() { cache = null; enCurso = null; }
