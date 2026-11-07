// Límite de solicitudes por clave (p. ej. "rsvp:<hash-ip>") usando la base de datos,
// porque las funciones serverless no comparten memoria entre instancias.
import { consulta } from './db.js';

export async function contar(clave, minutos) {
  const { rows } = await consulta(
    `select count(*)::int as n from limites where clave = $1 and creado > now() - make_interval(mins => $2)`,
    [clave, minutos],
  );
  return rows[0].n;
}

export async function registrar(clave) {
  await consulta('insert into limites (clave) values ($1)', [clave]);
  // Limpieza ocasional de registros viejos
  if (Math.random() < 0.05) {
    await consulta(`delete from limites where creado < now() - interval '1 day'`);
  }
}

export async function limpiar(clave) {
  await consulta('delete from limites where clave = $1', [clave]);
}
