/* Panel de confirmaciones — XV años de Victoria */
(function () {
  'use strict';

  var vistaAcceso = document.getElementById('vista-acceso');
  var vistaPanel = document.getElementById('vista-panel');
  var formAcceso = document.getElementById('form-acceso');
  var errorAcceso = document.getElementById('acceso-error');
  var botonAcceso = document.getElementById('acceso-boton');
  var filas = document.getElementById('filas');
  var vacio = document.getElementById('vacio');
  var aviso = document.getElementById('panel-aviso');
  var buscar = document.getElementById('buscar');

  var datos = [];
  var filtro = 'todos';

  var fmtFecha = new Intl.DateTimeFormat('es-CO', {
    timeZone: 'America/Bogota', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'
  });

  function api(ruta, opciones) {
    opciones = opciones || {};
    opciones.credentials = 'same-origin';
    opciones.headers = Object.assign({ Accept: 'application/json' }, opciones.headers || {});
    return fetch(ruta, opciones).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (cuerpo) {
        return { status: res.status, ok: res.ok && cuerpo.ok !== false, cuerpo: cuerpo };
      });
    });
  }

  function mostrarAcceso(mensaje) {
    vistaPanel.hidden = true;
    vistaAcceso.hidden = false;
    if (mensaje) { errorAcceso.textContent = mensaje; errorAcceso.hidden = false; }
    document.getElementById('contrasena').focus();
  }

  function mostrarAviso(texto, esError) {
    aviso.textContent = texto;
    aviso.className = 'aviso' + (esError ? ' error' : '');
    aviso.hidden = !texto;
  }

  function normalizar(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function celda(clase, contenido) {
    var td = document.createElement('td');
    if (clase) td.className = clase;
    if (contenido instanceof Node) td.appendChild(contenido); else if (contenido !== undefined && contenido !== null) td.textContent = contenido;
    return td;
  }

  function pintar() {
    var q = normalizar(buscar.value.trim());
    var visibles = datos.filter(function (r) {
      if (filtro === 'si' && !r.asiste) return false;
      if (filtro === 'no' && r.asiste) return false;
      if (!q) return true;
      return normalizar(r.nombre + ' ' + (r.telefono || '') + ' ' + (r.mensaje || '')).indexOf(q) > -1;
    });

    filas.textContent = '';
    visibles.forEach(function (r) {
      var tr = document.createElement('tr');

      var nombre = document.createElement('span');
      nombre.className = 'nombre';
      nombre.textContent = r.nombre;
      if (r.veces > 1) {
        var veces = document.createElement('span');
        veces.className = 'veces';
        veces.textContent = 'Actualizó su respuesta ' + (r.veces - 1) + (r.veces === 2 ? ' vez' : ' veces');
        nombre.appendChild(veces);
      }
      tr.appendChild(celda('c-nombre', nombre));

      var pill = document.createElement('span');
      pill.className = 'pill ' + (r.asiste ? 'si' : 'no');
      pill.textContent = r.asiste ? 'Asiste' : 'No asiste';
      tr.appendChild(celda('c-resp', pill));

      tr.appendChild(celda('c-personas num', r.asiste ? String(r.personas) : ''));

      var tel = '';
      if (r.telefono) {
        tel = document.createElement('a');
        tel.href = 'tel:' + r.telefono.replace(/[^\d+]/g, '');
        tel.textContent = r.telefono;
      }
      tr.appendChild(celda('c-tel tel', tel));

      var msg = document.createElement('div');
      msg.className = 'mensaje';
      msg.textContent = r.mensaje || '';
      tr.appendChild(celda('c-msg', r.mensaje ? msg : ''));

      tr.appendChild(celda('c-fecha fecha', fmtFecha.format(new Date(r.actualizado))));

      var acc = celda('acciones', null);
      var borrar = document.createElement('button');
      borrar.type = 'button';
      borrar.className = 'borrar';
      borrar.textContent = 'Eliminar';
      borrar.setAttribute('aria-label', 'Eliminar la respuesta de ' + r.nombre);
      borrar.addEventListener('click', function () { pedirConfirmacion(acc, r); });
      acc.appendChild(borrar);
      tr.appendChild(acc);

      filas.appendChild(tr);
    });

    vacio.hidden = visibles.length > 0;
    if (!visibles.length) {
      vacio.textContent = datos.length ? 'Ningún invitado coincide con la búsqueda.' : 'Aún no hay confirmaciones. Cuando los invitados respondan, aparecerán aquí.';
    }
  }

  function pedirConfirmacion(contenedor, r) {
    contenedor.textContent = '';
    var caja = document.createElement('span');
    caja.className = 'confirmar-borrar';
    caja.appendChild(document.createTextNode('¿Eliminar?'));
    var si = document.createElement('button');
    si.type = 'button'; si.className = 'si-borrar'; si.textContent = 'Sí, eliminar';
    var no = document.createElement('button');
    no.type = 'button'; no.textContent = 'Cancelar';
    caja.appendChild(si); caja.appendChild(no);
    contenedor.appendChild(caja);
    no.focus();
    no.addEventListener('click', pintar);
    si.addEventListener('click', function () {
      si.disabled = true;
      api('/api/admin/rsvps?id=' + encodeURIComponent(r.id), { method: 'DELETE' }).then(function (res) {
        if (res.status === 401) return mostrarAcceso('Tu sesión terminó. Vuelve a entrar.');
        if (!res.ok && res.status !== 404) { mostrarAviso(res.cuerpo.error || 'No se pudo eliminar.', true); pintar(); return; }
        mostrarAviso('Se eliminó la respuesta de ' + r.nombre + '.');
        cargar();
      });
    });
  }

  function cargar() {
    return api('/api/admin/rsvps').then(function (res) {
      if (res.status === 401) return mostrarAcceso();
      if (!res.ok) { mostrarAviso(res.cuerpo.error || 'No se pudieron cargar las confirmaciones.', true); return; }
      vistaAcceso.hidden = true;
      vistaPanel.hidden = false;
      datos = res.cuerpo.rsvps || [];
      var t = res.cuerpo.totales;
      document.getElementById('t-personas').textContent = t.personas;
      document.getElementById('t-personas-detalle').textContent =
        t.asisten ? 'en ' + t.asisten + (t.asisten === 1 ? ' confirmación' : ' confirmaciones') : 'Todavía nadie ha confirmado';
      document.getElementById('t-asisten').textContent = t.asisten;
      document.getElementById('t-no').textContent = t.noAsisten;
      document.getElementById('t-total').textContent = t.respuestas;
      pintar();
    }).catch(function () {
      mostrarAviso('No hay conexión con el servidor. Revisa tu internet y presiona Actualizar.', true);
    });
  }

  formAcceso.addEventListener('submit', function (ev) {
    ev.preventDefault();
    errorAcceso.hidden = true;
    var contrasena = formAcceso.contrasena.value;
    if (!contrasena) { errorAcceso.textContent = 'Escribe la contraseña.'; errorAcceso.hidden = false; return; }
    botonAcceso.disabled = true;
    botonAcceso.textContent = 'Entrando…';
    api('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contrasena: contrasena })
    }).then(function (res) {
      if (res.ok) { formAcceso.reset(); mostrarAviso(''); return cargar(); }
      errorAcceso.textContent = res.cuerpo.error || 'No se pudo entrar.';
      errorAcceso.hidden = false;
      formAcceso.contrasena.select();
    }).catch(function () {
      errorAcceso.textContent = 'No hay conexión con el servidor.';
      errorAcceso.hidden = false;
    }).then(function () {
      botonAcceso.disabled = false;
      botonAcceso.textContent = 'Entrar';
    });
  });

  document.getElementById('btn-actualizar').addEventListener('click', function () { mostrarAviso(''); cargar(); });
  document.getElementById('btn-salir').addEventListener('click', function () {
    api('/api/admin/logout', { method: 'POST' }).then(function () { datos = []; filas.textContent = ''; mostrarAcceso(); });
  });
  buscar.addEventListener('input', pintar);
  Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (chip) {
    chip.addEventListener('click', function () {
      filtro = chip.getAttribute('data-filtro');
      Array.prototype.forEach.call(document.querySelectorAll('.chip'), function (c) {
        var activo = c === chip;
        c.classList.toggle('activo', activo);
        c.setAttribute('aria-pressed', activo ? 'true' : 'false');
      });
      pintar();
    });
  });

  // Al abrir: si ya hay sesión, va directo al panel.
  api('/api/admin/sesion').then(function (res) {
    if (res.ok && res.cuerpo.activa) return cargar();
    if (!res.ok) return mostrarAcceso(res.cuerpo.error || 'No se pudo conectar con el servidor.');
    mostrarAcceso(res.cuerpo.configurado === false ? 'Falta configurar la contraseña (ADMIN_PASSWORD) en Vercel.' : '');
  }).catch(function () { mostrarAcceso('No hay conexión con el servidor.'); });
})();
