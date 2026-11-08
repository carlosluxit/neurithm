// Validación y normalización de la confirmación de asistencia.

export const MAX_PERSONAS = 6;

function texto(v) {
  return typeof v === 'string' ? v.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').trim() : '';
}

// Clave para detectar a la misma persona: sin tildes, minúsculas y espacios simples.
export function claveNombre(nombre) {
  return nombre
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

export function validarRsvp(datos, { maxPersonas = MAX_PERSONAS, mensajePersonas } = {}) {
  const errores = {};

  const nombre = texto(datos.nombre).replace(/\s+/g, ' ');
  if (nombre.length < 2) errores.nombre = 'Escribe tu nombre completo.';
  else if (nombre.length > 80) errores.nombre = 'El nombre es demasiado largo (máximo 80 caracteres).';
  else if (!/\p{L}/u.test(nombre)) errores.nombre = 'Escribe un nombre válido.';

  let asiste;
  if (datos.asiste === true || datos.asiste === 'si') asiste = true;
  else if (datos.asiste === false || datos.asiste === 'no') asiste = false;
  else errores.asiste = 'Cuéntanos si nos acompañas.';

  let personas = 0;
  if (asiste) {
    personas = Number(datos.personas);
    if (!Number.isInteger(personas) || personas < 1 || personas > maxPersonas) {
      errores.personas = mensajePersonas || `Elige entre 1 y ${maxPersonas} personas.`;
    }
  }

  let telefono = texto(datos.telefono).replace(/\s+/g, ' ');
  if (telefono) {
    const digitos = telefono.replace(/\D/g, '');
    if (!/^[+\d][\d ()-]*$/.test(telefono) || digitos.length < 7 || digitos.length > 15) {
      errores.telefono = 'Escribe un número de celular válido.';
    }
  } else {
    telefono = null;
  }

  let mensaje = texto(datos.mensaje);
  if (mensaje.length > 500) errores.mensaje = 'El mensaje es demasiado largo (máximo 500 caracteres).';
  if (!mensaje) mensaje = null;

  if (Object.keys(errores).length) return { ok: false, errores };
  return { ok: true, valor: { nombre, nombre_clave: claveNombre(nombre), asiste, personas, telefono, mensaje } };
}

// Señales de bot: campo trampa lleno o formulario enviado en menos de 2 segundos.
export function pareceBot(datos) {
  if (typeof datos.sitio_web === 'string' && datos.sitio_web.trim() !== '') return true;
  const ms = Number(datos.ms);
  return Number.isFinite(ms) && ms >= 0 && ms < 2000;
}
