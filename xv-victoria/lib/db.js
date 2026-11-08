// Conexión a Postgres (Neon en Vercel, Postgres local en desarrollo).
import pg from 'pg';

let pool;
let esquemaListo;

function cadenaConexion() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) {
    const err = new Error('Falta DATABASE_URL: conecte una base de datos Postgres al proyecto.');
    err.status = 503;
    throw err;
  }
  return url;
}

export function obtenerPool() {
  if (pool) return pool;
  const url = cadenaConexion();
  const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
  pool = new pg.Pool({
    connectionString: url,
    ssl: local ? false : { rejectUnauthorized: true },
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 8_000,
  });
  pool.on('error', () => { /* conexión inactiva cerrada por el servidor; el pool la reemplaza */ });
  // En Vercel (Fluid compute) cierra las conexiones inactivas antes de suspender la función.
  if (process.env.VERCEL) {
    import('@vercel/functions')
      .then((m) => m.attachDatabasePool && m.attachDatabasePool(pool))
      .catch(() => {});
  }
  return pool;
}

const ESQUEMA = `
create table if not exists rsvps (
  id            bigint generated always as identity primary key,
  nombre        text        not null check (char_length(nombre) between 2 and 80),
  nombre_clave  text        not null unique,
  asiste        boolean     not null,
  personas      smallint    not null check (personas between 0 and 10),
  telefono      text        check (telefono is null or char_length(telefono) <= 25),
  mensaje       text        check (mensaje is null or char_length(mensaje) <= 500),
  veces         smallint    not null default 1,
  ip_hash       text,
  creado        timestamptz not null default now(),
  actualizado   timestamptz not null default now()
);
create index if not exists rsvps_actualizado_idx on rsvps (actualizado desc);

create table if not exists admin_sesiones (
  token_hash  text        primary key,
  creada      timestamptz not null default now(),
  expira      timestamptz not null
);

create table if not exists limites (
  clave   text        not null,
  creado  timestamptz not null default now()
);
create index if not exists limites_clave_creado_idx on limites (clave, creado);

-- Cupos de la invitación al momento de confirmar
alter table rsvps add column if not exists cupos smallint;

-- Última copia de la lista de invitados (por si Google Sheets no responde)
create table if not exists invitados_copia (
  id     smallint    primary key check (id = 1),
  datos  jsonb       not null,
  leido  timestamptz not null default now()
);
`;

// Crea las tablas la primera vez (idempotente). Se ejecuta una sola vez por instancia.
export function asegurarEsquema() {
  if (!esquemaListo) {
    esquemaListo = obtenerPool()
      .query(ESQUEMA)
      .catch((e) => { esquemaListo = undefined; throw e; });
  }
  return esquemaListo;
}

export async function consulta(texto, valores) {
  await asegurarEsquema();
  return obtenerPool().query(texto, valores);
}

// Solo para pruebas
export async function cerrarPool() {
  if (pool) { const p = pool; pool = undefined; esquemaListo = undefined; await p.end(); }
}
