# XV Años de Victoria — invitación web

Invitación de los XV años de Victoria basada en el video original, con confirmación de asistencia
guardada en una base de datos y un panel privado para la familia.

## Qué incluye

- **Invitación** (`/`): portada con puertas de acuarela y sello de lacre, la tarjeta animada,
  mensaje, cuenta regresiva, la celebración (mapa y calendario), código de vestimenta con fotos
  de inspiración, lluvia de sobres y el formulario de confirmación.
- **Confirmación de asistencia**: cada respuesta se guarda en Postgres. Si alguien vuelve a enviar
  el formulario con el mismo nombre (aunque cambie mayúsculas o tildes), se actualiza su respuesta
  en vez de duplicarla.
- **Panel** (`/admin`): totales (personas que asistirán, sí, no), lista con búsqueda y filtros,
  exportar a CSV (Excel / Google Sheets) y eliminar respuestas de prueba o duplicadas.

## Estructura

```
public/          sitio estático (invitación + panel en public/admin)
api/             funciones de Vercel
  rsvp.js          POST: guarda o actualiza una confirmación
  admin/           login, logout, sesion, rsvps (lista/eliminar), exportar (CSV)
lib/             código compartido (base de datos, validación, sesiones, límites)
tests/           pruebas de la API contra un Postgres real
scripts/         servidor local y plantilla de la imagen para compartir
vercel.json      cabeceras de seguridad, caché y configuración
```

Las tablas (`rsvps`, `admin_sesiones`, `limites`) se crean solas la primera vez que la API se usa.

## Seguridad

- La contraseña del panel vive solo en la variable `ADMIN_PASSWORD` de Vercel (mínimo 10 caracteres).
- La sesión usa una cookie `HttpOnly`, `Secure`, `SameSite=Strict` de 12 horas; en la base de datos
  solo se guarda el hash del token, y "Cerrar sesión" la invalida.
- Tras 5 contraseñas incorrectas en 15 minutos, el acceso se bloquea temporalmente desde esa conexión.
- El formulario valida todo en el servidor, limita los envíos por conexión, ignora bots (campo trampa
  y envíos instantáneos) y rechaza solicitudes de otros sitios.
- De las IP solo se guarda un hash. Content-Security-Policy estricta y `noindex` en el panel y la API.

## En línea

- Invitación: https://xv-victoria-kappa.vercel.app
- Panel: https://xv-victoria-kappa.vercel.app/admin
- Proyecto de Vercel `xv-victoria` (equipo carlos-luxitio's projects) con base de datos Neon `xv-victoria-db` (plan gratis).
- Para cambiar la contraseña del panel: Vercel → xv-victoria → Settings → Environment Variables →
  `ADMIN_PASSWORD` → Edit, y luego Deployments → Redeploy.

## Publicar en Vercel

1. Crear el proyecto con **Root Directory = `xv-victoria`** (o `vercel deploy` desde esta carpeta).
2. En el proyecto: **Storage → Create Database → Neon (Postgres, plan gratis) → Connect**.
   Esto agrega `DATABASE_URL` automáticamente.
3. En **Settings → Environment Variables** agregar `ADMIN_PASSWORD` (marcarla como *Sensitive*).
4. Volver a desplegar. El panel queda en `https://<su-dominio>/admin`.

## Cómo editar

- Datos del evento, WhatsApp opcional y enlace de Google Maps: al inicio de `public/app.js` (`CONFIG`).
- Textos: `public/index.html`.
- Fotos del código de vestimenta: `public/assets/vestimenta/` (mismo nombre de archivo, formato vertical 4:5).
- Música: `public/assets/musica.mp3`.
- Vista previa al compartir: tras publicar, poner la URL completa de `assets/og.jpg` en las etiquetas `og:image`.

## Desarrollo local

```bash
cd xv-victoria
npm install
DATABASE_URL=postgres://usuario:clave@localhost:5432/xv ADMIN_PASSWORD='una-clave-larga' npm run dev
# http://localhost:3000  y  http://localhost:3000/admin

TEST_DATABASE_URL=postgres://usuario:clave@localhost:5432/xv_test npm test
```

Fuentes: Great Vibes y Lora (SIL Open Font License, ver `public/assets/fonts/`).
