# XV Años de Victoria — invitación web

Sitio estático (HTML + CSS + JS, sin dependencias) basado en el video de la invitación.

## Qué incluye

1. **Portada animada**: las dos puertas de acuarela con el sello de lacre. Al tocar el sello, el sello cae, las puertas se abren y empieza la música (igual que en el video).
2. **La invitación**: réplica del diseño del video (arco, flores, mariposas y destellos animados).
3. Mensaje de Victoria, **cuenta regresiva**, **la celebración** (botón de Google Maps y para agendar la fecha), **código de vestimenta**, **lluvia de sobres**, **confirmación por WhatsApp** y cierre.

## Cómo editarlo

Los datos que cambian están al inicio de `app.js`:

```js
var CONFIG = {
  inicio: '2026-12-26T19:00:00-05:00',
  fin: '2026-12-27T00:00:00-05:00',
  whatsapp: '',   // ← número que recibe las confirmaciones, ej. '573001234567'
  mapa: '...'     // ← enlace exacto de Google Maps del salón (opcional)
};
```

- **WhatsApp**: si `whatsapp` queda vacío, el invitado elige a quién enviar el mensaje.
- **Música**: reemplace `assets/musica.m4a` (es el audio del video, en bucle).
- **Textos**: están en `index.html`.
- **Vista previa al compartir**: tras publicar, cambie `assets/og.jpg` en las etiquetas `og:image` por la URL completa (ej. `https://su-dominio.com/assets/og.jpg`). `og-plantilla.html` es la plantilla con la que se generó esa imagen.

## Ver en local

```bash
cd xv-victoria
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Publicar

Es una carpeta estática: puede subirse tal cual a Vercel (Root Directory = `xv-victoria`), Netlify (arrastrar la carpeta), GitHub Pages o cualquier hosting.

Fuentes: Great Vibes y Lora (SIL Open Font License, ver `assets/fonts/`).
