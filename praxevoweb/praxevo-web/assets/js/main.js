(function () {
  'use strict';

  // ─── Menú móvil ───
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ─── Banner de cookies (consentimiento real vía localStorage) ───
  var CONSENT_KEY = 'praxevo_cookie_consent';
  var banner = document.querySelector('.cookie-banner');
  if (banner) {
    var stored = null;
    try { stored = localStorage.getItem(CONSENT_KEY); } catch (e) { /* localStorage no disponible */ }

    if (!stored) {
      banner.classList.add('show');
    }

    var acceptBtn = banner.querySelector('.accept');
    var rejectBtn = banner.querySelector('.reject');

    function setConsent(value) {
      try { localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* no-op */ }
      banner.classList.remove('show');
      document.dispatchEvent(new CustomEvent('praxevo:cookie-consent', { detail: { consent: value } }));
    }

    if (acceptBtn) acceptBtn.addEventListener('click', function () { setConsent('accepted'); });
    if (rejectBtn) rejectBtn.addEventListener('click', function () { setConsent('rejected'); });
  }

  // Solo cargar scripts de analítica/terceros si el usuario aceptó.
  // Ejemplo de uso en el futuro:
  // document.addEventListener('praxevo:cookie-consent', function (e) {
  //   if (e.detail.consent === 'accepted') { /* inyectar Google Analytics aquí */ }
  // });

  // ─── Formulario de contacto ───
  var form = document.querySelector('#contact-form');
  if (form) {
    var status = form.querySelector('.form-status');

    function showStatus(message, kind) {
      if (!status) return;
      status.textContent = message;
      status.className = 'form-status show ' + kind;
    }

    form.addEventListener('submit', function (e) {
      // Honeypot anti-spam: si el campo oculto viene lleno, es un bot.
      var honeypot = form.querySelector('input[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        e.preventDefault();
        return;
      }

      var consent = form.querySelector('#consent');
      if (consent && !consent.checked) {
        e.preventDefault();
        showStatus('Debes aceptar el Aviso de Privacidad para enviar el formulario.', 'err');
        consent.focus();
        return;
      }

      var email = form.querySelector('input[type="email"]');
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailPattern.test(email.value)) {
        e.preventDefault();
        showStatus('Ingresa un correo electrónico válido.', 'err');
        email.focus();
        return;
      }

      // Si el formulario no tiene un endpoint de envío configurado (ver README),
      // evitamos que se rompa silenciosamente y avisamos en pantalla.
      var action = form.getAttribute('action') || '';
      if (action.indexOf('REEMPLAZAR') !== -1 || action === '') {
        e.preventDefault();
        showStatus('El formulario aún no está conectado a un backend de envío. Ver README.md.', 'err');
        return;
      }

      showStatus('Enviando…', 'ok');
    });
  }
})();
