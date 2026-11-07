// Servidor de desarrollo: sirve /public y ejecuta las funciones de /api como lo hace Vercel.
// Uso: DATABASE_URL=postgres://... ADMIN_PASSWORD=... node scripts/servidor-local.js
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const RAIZ = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PUBLICO = join(RAIZ, 'public');
const PUERTO = Number(process.env.PORT || 3000);
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.ics': 'text/calendar; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
};

async function api(req, res, ruta) {
  const archivo = join(RAIZ, normalize(ruta).replace(/^(\.\.[/\\])+/, '') + '.js');
  let mod;
  try { mod = await import(pathToFileURL(archivo).href); } catch { res.writeHead(404).end('{"ok":false}'); return; }
  const fn = mod[req.method];
  if (!fn) { res.writeHead(405).end('{"ok":false,"error":"Método no permitido."}'); return; }
  const trozos = [];
  for await (const t of req) trozos.push(t);
  const cuerpo = Buffer.concat(trozos);
  const url = `http://${req.headers.host}${req.url}`;
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) headers.set(k, Array.isArray(v) ? v.join(', ') : v);
  headers.set('x-real-ip', req.socket.remoteAddress || '');
  const request = new Request(url, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : cuerpo });
  const r = await fn(request);
  const cab = {};
  r.headers.forEach((v, k) => { cab[k] = v; });
  res.writeHead(r.status, cab);
  res.end(Buffer.from(await r.arrayBuffer()));
}

async function estatico(req, res, ruta) {
  let p = join(PUBLICO, normalize(decodeURIComponent(ruta)).replace(/^(\.\.[/\\])+/, ''));
  if (!p.startsWith(PUBLICO)) { res.writeHead(403).end(); return; }
  try {
    const s = await stat(p).catch(() => null);
    if (s && s.isDirectory()) p = join(p, 'index.html');
    else if (!s && !extname(p)) p += '.html';
    const datos = await readFile(p);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(p)] || 'application/octet-stream' });
    res.end(datos);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No encontrado');
  }
}

// Aplica las mismas cabeceras de vercel.json (CSP, caché, etc.) para detectar problemas en local.
const config = JSON.parse(await readFile(join(RAIZ, 'vercel.json'), 'utf8'));
const reglas = (config.headers || []).map((h) => ({ re: new RegExp('^' + h.source + '$'), headers: h.headers }));

http.createServer(async (req, res) => {
  const ruta = new URL(req.url, 'http://x').pathname;
  for (const r of reglas) if (r.re.test(ruta)) for (const h of r.headers) res.setHeader(h.key, h.value);
  try {
    if (ruta.startsWith('/api/')) await api(req, res, ruta.slice(1));
    else await estatico(req, res, ruta);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500);
    res.end();
  }
}).listen(PUERTO, () => console.log(`XV Victoria en http://localhost:${PUERTO}`));
