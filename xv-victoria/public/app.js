/* 15 Años de Victoria — interacción de la invitación */
(function () {
  'use strict';

  /* ---------- Configuración: edite aquí ---------- */
  var CONFIG = {
    // Fecha y hora del evento (hora de Colombia, UTC-5)
    inicio: '2026-12-26T19:00:00-05:00',
    fin: '2026-12-27T00:00:00-05:00',
    titulo: '15 Años de Victoria',
    lugar: 'Salón Social, Doral Cartagena',
    // Las confirmaciones se guardan en la base de datos y se ven en /admin.
    // Opcional: número de WhatsApp de la familia (código de país + número, sin "+" ni espacios,
    // ej. '573001234567'). Si se llena, tras confirmar aparece el botón "Avisar también por WhatsApp".
    whatsapp: '',
    // Enlace de Google Maps. Puede reemplazarlo por el enlace exacto de "Compartir" del lugar.
    mapa: 'https://www.google.com/maps/search/?api=1&query=Sal%C3%B3n%20Social%20Doral%20Cartagena'
  };

  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Mariposas ---------- */
  var MARIPOSA =
    '<svg viewBox="0 0 100 80" aria-hidden="true">' +
    '<g class="ala"><path d="M50 38C44 18 26 4 12 8 2 11 4 26 14 33c8 6 22 7 36 5z"/>' +
    '<path d="M50 42C38 44 22 50 20 62c-2 10 8 14 16 10 8-4 12-16 14-30z"/>' +
    '<path d="M50 38C56 18 74 4 88 8c10 3 8 18-2 25-8 6-22 7-36 5z"/>' +
    '<path d="M50 42c12 2 28 8 30 20 2 10-8 14-16 10-8-4-12-16-14-30z"/></g>' +
    '<ellipse cx="50" cy="42" rx="2.2" ry="13" fill="#b49a6a"/>' +
    '<path d="M49 30c-2-6-5-9-8-11M51 30c2-6 5-9 8-11" fill="none" stroke="#b49a6a" stroke-width="1"/></svg>';
  $$('.mariposa').forEach(function (m) { m.innerHTML = MARIPOSA; });

  /* ---------- Destellos ---------- */
  $$('[data-destellos]').forEach(function (box) {
    var n = parseInt(box.getAttribute('data-destellos'), 10) || 6;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.className = 'destello';
      s.style.setProperty('--x', rand(4, 94).toFixed(1) + '%');
      s.style.setProperty('--y', rand(4, 92).toFixed(1) + '%');
      s.style.setProperty('--s', rand(9, 20).toFixed(0) + 'px');
      s.style.setProperty('--t', rand(2.4, 4.6).toFixed(2) + 's');
      s.style.setProperty('--d', rand(0, 5).toFixed(2) + 's');
      box.appendChild(s);
    }
  });

  /* ---------- Trazos SVG que se dibujan solos ---------- */
  $$('.tarjeta .arco, .linea > *').forEach(function (el) {
    try {
      var len = Math.ceil(el.getTotalLength()) + 2;
      el.style.setProperty('--len', len);
    } catch (e) { /* sin animación de trazo */ }
  });

  /* ---------- Música ---------- */
  var audio = $('#musica');
  var btnMusica = $('#musica-btn');
  var queriaMusica = false;

  function marcar(sonando) {
    btnMusica.setAttribute('aria-pressed', sonando ? 'true' : 'false');
    btnMusica.setAttribute('aria-label', sonando ? 'Pausar música' : 'Reproducir música');
  }
  function tocar() {
    if (!audio) return;
    queriaMusica = true;
    try { audio.volume = 0; } catch (e) {}
    var p = audio.play();
    var subir = function () {
      var v = 0;
      var id = setInterval(function () {
        v = Math.min(0.85, v + 0.05);
        try { audio.volume = v; } catch (e) {}
        if (v >= 0.85) clearInterval(id);
      }, 90);
    };
    if (p && p.then) p.then(subir).catch(function () { marcar(false); });
    else subir();
  }
  if (audio) {
    audio.addEventListener('play', function () { marcar(true); });
    audio.addEventListener('pause', function () { marcar(false); });
  }
  btnMusica.addEventListener('click', function () {
    if (audio.paused) { tocar(); } else { queriaMusica = false; audio.pause(); }
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (!audio.paused) { audio.pause(); queriaMusica = true; } }
    else if (queriaMusica && audio.paused && root.classList.contains('abierta')) { audio.play().catch(function () {}); }
  });

  /* ---------- Apertura de las puertas ---------- */
  var portada = $('#portada');
  var abierta = false;

  function abrir(directo) {
    if (abierta) return;
    abierta = true;
    btnMusica.hidden = false;
    var terminar = function () {
      portada.hidden = true;
      root.classList.remove('bloqueado');
      if (directo && location.hash) {
        var destino = document.getElementById(location.hash.slice(1));
        if (destino) destino.scrollIntoView();
      }
    };
    if (directo || reduce) {
      root.classList.add('abierta');
      portada.classList.add('desvanecer');
      setTimeout(terminar, directo ? 0 : 480);
      return;
    }
    root.classList.add('abriendo');
    setTimeout(function () { root.classList.add('abierta'); }, 650);
    setTimeout(terminar, 2950);
  }

  // Un toque en el sello (o en cualquier parte de las puertas) abre la invitación.
  portada.addEventListener('click', function () {
    if (abierta) return;
    tocar();
    abrir(false);
  });

  // Si llegan con un enlace directo (p. ej. .../#confirmar), se abre sin animación.
  if (location.hash && location.hash.length > 1 && location.hash !== '#inicio' && document.getElementById(location.hash.slice(1))) {
    abrir(true);
  }

  /* ---------- Cuenta regresiva ---------- */
  var inicio = new Date(CONFIG.inicio).getTime();
  var fin = new Date(CONFIG.fin).getTime();
  var celdas = {};
  $$('#contador [data-u]').forEach(function (el) { celdas[el.getAttribute('data-u')] = el; });
  var finTxt = $('#contador-fin');
  function dos(n) { return n < 10 ? '0' + n : String(n); }
  function tic() {
    var ahora = Date.now();
    var diff = inicio - ahora;
    if (diff <= 0) {
      $('#contador').hidden = true;
      finTxt.hidden = false;
      finTxt.textContent = ahora < fin + 6 * 3600e3 ? '¡Hoy es el gran día!' : '¡Gracias por acompañarme!';
      return false;
    }
    var s = Math.floor(diff / 1000);
    celdas.d.textContent = Math.floor(s / 86400);
    celdas.h.textContent = dos(Math.floor(s % 86400 / 3600));
    celdas.m.textContent = dos(Math.floor(s % 3600 / 60));
    celdas.s.textContent = dos(s % 60);
    return true;
  }
  if (tic()) {
    var reloj = setInterval(function () { if (!tic()) clearInterval(reloj); }, 1000);
  }
  // Evita que el lector de pantalla anuncie cada segundo
  $('#contador').removeAttribute('aria-live');

  /* ---------- Calendario y mapa ---------- */
  function utc(ms) { return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  var detalles = 'Vamos a celebrar mis 15 años. Lluvia de sobres.\n' +
    'Código de vestimenta — Mujeres: vestido largo. Hombres: pantalón y camisa manga larga en tonos claros.';
  var gcal = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
    '&text=' + encodeURIComponent(CONFIG.titulo) +
    '&dates=' + utc(inicio) + '/' + utc(fin) +
    '&details=' + encodeURIComponent(detalles) +
    '&location=' + encodeURIComponent(CONFIG.lugar) +
    '&ctz=America/Bogota';
  $('#btn-google').href = gcal;
  $('#btn-mapa').href = CONFIG.mapa;

  /* ---------- Aparición al hacer scroll ---------- */
  var revelables = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    revelables.forEach(function (el) { io.observe(el); });
  } else {
    revelables.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- Lluvia de sobres ---------- */
  var lluvia = $('.lluvia');
  if (lluvia && !reduce) {
    for (var i = 0; i < 14; i++) {
      var e = document.createElement('span');
      e.style.setProperty('--x', rand(2, 94).toFixed(1) + '%');
      e.style.setProperty('--w', rand(18, 30).toFixed(0) + 'px');
      e.style.setProperty('--t', rand(7, 12).toFixed(2) + 's');
      e.style.setProperty('--d', (-rand(0, 12)).toFixed(2) + 's');
      e.style.setProperty('--dx', rand(-40, 40).toFixed(0) + 'px');
      e.style.setProperty('--r0', rand(-30, 30).toFixed(0) + 'deg');
      e.style.setProperty('--r1', rand(-200, 200).toFixed(0) + 'deg');
      lluvia.appendChild(e);
    }
    var medir = function () { lluvia.style.setProperty('--h', (lluvia.offsetHeight + 40) + 'px'); };
    medir();
    if ('ResizeObserver' in window) new ResizeObserver(medir).observe(lluvia);
    else window.addEventListener('resize', medir);
  }

  /* ---------- Confirmación de asistencia (se guarda en el servidor) ---------- */
  var form = $('#rsvp');
  var campoPersonas = $('#campo-personas');
  var errorGeneral = $('#rsvp-error');
  var boton = $('#rsvp-enviar');
  var panelOk = $('#rsvp-ok');
  var previo = $('#rsvp-previo');
  var abiertoEn = Date.now();
  var GUARDADO = 'xv-victoria-rsvp';

  function leerGuardado() { try { return JSON.parse(localStorage.getItem(GUARDADO) || 'null'); } catch (e) { return null; } }
  function guardar(v) { try { localStorage.setItem(GUARDADO, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }

  /* --- Nombre con sugerencias de la lista de invitados (y cupos automáticos) --- */
  var inNombre = $('#rsvp-nombre');
  var listaSug = $('#sugerencias');
  var inInvitado = $('#rsvp-invitado');
  var infoCupos = $('#cupos-info');
  var ayudaNombre = $('#ayuda-nombre');
  var selPersonas = $('#rsvp-personas');
  var modoLista = false;     // se activa si el servidor tiene lista de invitados
  var seleccionado = null;   // { id, nombre, cupos }
  var opciones = [];
  var activo = -1;
  var temporizador = null;
  var consultaN = 0;
  var AYUDA = 'Escribe al menos 3 letras y elige tu nombre de la lista.';

  function clave(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function opcionesPersonas(max, valor) {
    selPersonas.textContent = '';
    for (var i = 1; i <= max; i++) {
      var o = document.createElement('option');
      o.value = String(i); o.textContent = String(i);
      selPersonas.appendChild(o);
    }
    selPersonas.value = String(valor || 1);
  }
  function sinNombreElegido() {
    selPersonas.textContent = '';
    var o = document.createElement('option');
    o.value = ''; o.textContent = 'Primero elige tu nombre';
    selPersonas.appendChild(o);
    selPersonas.disabled = true;
  }
  function cerrarSug() {
    listaSug.hidden = true;
    listaSug.textContent = '';
    inNombre.setAttribute('aria-expanded', 'false');
    inNombre.removeAttribute('aria-activedescendant');
    opciones = [];
    activo = -1;
  }
  function marcarActivo(i) {
    var items = $$('[role="option"]', listaSug);
    items.forEach(function (li, k) { li.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
    activo = i;
    if (items[i]) { inNombre.setAttribute('aria-activedescendant', items[i].id); items[i].scrollIntoView({ block: 'nearest' }); }
  }
  function elegir(inv) {
    seleccionado = inv;
    inNombre.value = inv.nombre;
    inInvitado.value = inv.id;
    cerrarSug();
    selPersonas.disabled = false;
    opcionesPersonas(inv.cupos, inv.cupos);
    infoCupos.textContent = inv.cupos === 1 ? 'Tu invitación es para 1 persona.' : 'Tu invitación es para ' + inv.cupos + ' personas.';
    infoCupos.hidden = false;
    ayudaNombre.hidden = true;
    var err = $('#err-nombre'); err.hidden = true; inNombre.removeAttribute('aria-invalid');
  }
  function quitarSeleccion() {
    seleccionado = null;
    inInvitado.value = '';
    infoCupos.hidden = true;
    ayudaNombre.hidden = false;
    if (modoLista) sinNombreElegido();
  }
  function pintarSug(resultados, q) {
    listaSug.textContent = '';
    opciones = resultados;
    activo = -1;
    if (!resultados.length) {
      cerrarSug();
      ayudaNombre.textContent = 'No encontramos «' + q + '» en la lista. Revisa cómo lo escribiste (solo nombre o apellido también sirve).';
      return;
    }
    ayudaNombre.textContent = AYUDA;
    resultados.forEach(function (inv, k) {
      var li = document.createElement('li');
      li.id = 'sug-' + k;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      var n = document.createElement('span'); n.className = 'sug-nombre'; n.textContent = inv.nombre;
      var c = document.createElement('span'); c.className = 'sug-cupos'; c.textContent = inv.cupos === 1 ? '1 cupo' : inv.cupos + ' cupos';
      li.appendChild(n); li.appendChild(c);
      li.addEventListener('mousedown', function (e) { e.preventDefault(); });
      li.addEventListener('click', function () { elegir(inv); });
      listaSug.appendChild(li);
    });
    listaSug.hidden = false;
    inNombre.setAttribute('aria-expanded', 'true');
  }
  function buscarInvitados() {
    var q = inNombre.value.trim();
    if (clave(q).replace(/ /g, '').length < 3) { cerrarSug(); ayudaNombre.textContent = AYUDA; return; }
    var n = ++consultaN;
    fetch('/api/invitados?q=' + encodeURIComponent(q), { credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (n !== consultaN) return; // llegó una respuesta vieja
        if (d.ok === false) { ayudaNombre.textContent = d.error || AYUDA; return; }
        pintarSug(d.resultados || [], q);
      })
      .catch(function () { if (n === consultaN) ayudaNombre.textContent = 'Sin conexión. Revisa tu internet e inténtalo de nuevo.'; });
  }

  // ¿Hay lista de invitados? (si no, el nombre es libre como antes)
  fetch('/api/invitados', { credentials: 'same-origin' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      modoLista = Boolean(d && d.lista);
      if (!modoLista) { ayudaNombre.hidden = true; inNombre.removeAttribute('role'); inNombre.placeholder = 'Nombre y apellido'; return; }
      if (seleccionado) elegir(seleccionado); else sinNombreElegido();
    })
    .catch(function () { /* se resolverá al enviar */ });

  inNombre.addEventListener('input', function () {
    if (seleccionado && inNombre.value !== seleccionado.nombre) quitarSeleccion();
    if (!modoLista) return;
    clearTimeout(temporizador);
    temporizador = setTimeout(buscarInvitados, 220);
  });
  inNombre.addEventListener('keydown', function (e) {
    if (listaSug.hidden || !opciones.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); marcarActivo((activo + 1) % opciones.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); marcarActivo(activo <= 0 ? opciones.length - 1 : activo - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); elegir(opciones[activo > -1 ? activo : 0]); }
    else if (e.key === 'Escape') { cerrarSug(); }
  });
  inNombre.addEventListener('blur', function () {
    setTimeout(function () {
      // Si escribió el nombre completo exacto, lo elegimos por él.
      if (!seleccionado && opciones.length) {
        var exacto = opciones.filter(function (o) { return o.id === clave(inNombre.value); })[0];
        if (exacto) { elegir(exacto); return; }
      }
      cerrarSug();
    }, 160);
  });

  function textoWhatsApp(r) {
    var txt = '¡Hola! Soy ' + r.nombre + '.\n';
    if (r.asiste) {
      txt += 'Confirmo mi asistencia a los 15 años de Victoria 🌸\n' +
        'Sábado 26 de diciembre · 7:00 p. m. · ' + CONFIG.lugar + '\n' +
        (r.personas === 1 ? 'Asistiré 1 persona.' : 'Asistiremos ' + r.personas + ' personas.');
    } else {
      txt += 'Con cariño te cuento que no podré asistir a los 15 años de Victoria. ¡Le deseo una noche maravillosa! 🌸';
    }
    return txt;
  }

  function mostrarConfirmado(r, nuevo) {
    var primerNombre = r.nombre.split(' ')[0];
    $('#rsvp-ok-titulo').textContent = '¡Gracias, ' + primerNombre + '!';
    $('#rsvp-ok-texto').textContent = r.asiste
      ? (nuevo === false ? 'Actualizamos tu confirmación: ' : 'Tu confirmación quedó registrada: ') +
        (r.personas === 1 ? '1 persona' : r.personas + ' personas') +
        (r.cupos ? ' de ' + r.cupos + (r.cupos === 1 ? ' cupo' : ' cupos') : '') + '. ¡Nos vemos el sábado 26 de diciembre!'
      : (nuevo === false ? 'Actualizamos tu respuesta. ' : 'Recibimos tu respuesta. ') + 'Te vamos a extrañar; gracias por avisarnos con cariño.';
    var wa = $('#rsvp-whatsapp');
    if (CONFIG.whatsapp) {
      wa.href = 'https://wa.me/' + CONFIG.whatsapp.replace(/\D/g, '') + '?text=' + encodeURIComponent(textoWhatsApp(r));
      wa.hidden = false;
    }
    form.hidden = true;
    panelOk.hidden = false;
    panelOk.focus({ preventScroll: true });
  }

  function limpiarErrores() {
    errorGeneral.hidden = true;
    $$('.err', form).forEach(function (e) { e.hidden = true; e.textContent = ''; });
    $$('[aria-invalid]', form).forEach(function (e) { e.removeAttribute('aria-invalid'); });
  }
  function errorCampo(nombre, texto) {
    var el = $('#err-' + nombre);
    var campo = form.elements[nombre];
    if (el) { el.textContent = texto; el.hidden = false; }
    if (campo && campo.setAttribute) campo.setAttribute('aria-invalid', 'true');
  }
  function errorTexto(texto) { errorGeneral.textContent = texto; errorGeneral.hidden = false; }

  // Si ya confirmó desde este dispositivo, se lo recordamos.
  var anterior = leerGuardado();
  if (anterior && anterior.nombre) {
    previo.textContent = 'Ya enviaste tu confirmación como «' + anterior.nombre + '». Si quieres cambiarla, envía el formulario de nuevo con el mismo nombre.';
    previo.hidden = false;
    form.nombre.value = anterior.nombre;
    if (anterior.id && anterior.cupos) seleccionado = { id: anterior.id, nombre: anterior.nombre, cupos: anterior.cupos };
  }

  $$('input[name="asiste"]', form).forEach(function (r) {
    r.addEventListener('change', function () { campoPersonas.hidden = form.asiste.value === 'no'; });
  });
  $('#rsvp-cambiar').addEventListener('click', function () {
    panelOk.hidden = true;
    form.hidden = false;
    form.nombre.focus();
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    limpiarErrores();
    var nombre = form.nombre.value.trim().replace(/\s+/g, ' ');
    if (nombre.length < 2) { errorCampo('nombre', 'Escribe tu nombre completo.'); form.nombre.focus(); return; }
    if (modoLista && !seleccionado) {
      errorCampo('nombre', 'Elige tu nombre de la lista de sugerencias (escribe al menos 3 letras).');
      form.nombre.focus();
      return;
    }

    var datos = {
      invitado: seleccionado ? seleccionado.id : '',
      nombre: nombre,
      asiste: form.asiste.value,
      personas: parseInt(form.personas.value, 10) || 1,
      telefono: form.telefono.value.trim(),
      mensaje: form.mensaje.value.trim(),
      sitio_web: form.sitio_web.value,
      ms: Date.now() - abiertoEn
    };

    boton.disabled = true;
    boton.classList.add('enviando');
    boton.querySelector('span').textContent = 'Enviando…';

    fetch('/api/rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
      credentials: 'same-origin'
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (cuerpo) { return { res: res, cuerpo: cuerpo }; });
      })
      .then(function (r) {
        if (r.res.ok && r.cuerpo.ok) {
          var resumen = {
            nombre: r.cuerpo.nombre || nombre,
            asiste: datos.asiste === 'si',
            personas: datos.asiste === 'si' ? datos.personas : 0,
            cupos: r.cuerpo.cupos || null,
            id: seleccionado ? seleccionado.id : null
          };
          guardar(resumen);
          previo.hidden = true;
          mostrarConfirmado(resumen, r.cuerpo.nuevo);
          return;
        }
        if (r.res.status === 400 && r.cuerpo.errores) {
          Object.keys(r.cuerpo.errores).forEach(function (k) { errorCampo(k, r.cuerpo.errores[k]); });
          var primero = $('[aria-invalid="true"]', form);
          if (primero) primero.focus();
          return;
        }
        errorTexto(r.cuerpo.error || 'No pudimos guardar tu confirmación. Intenta de nuevo en unos minutos.');
      })
      .catch(function () {
        errorTexto('No pudimos enviar tu confirmación. Revisa tu conexión a internet e inténtalo de nuevo.');
      })
      .then(function () {
        boton.disabled = false;
        boton.classList.remove('enviando');
        boton.querySelector('span').textContent = 'Enviar confirmación';
      });
  });
})();
