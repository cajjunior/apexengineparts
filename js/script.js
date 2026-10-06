// APEX ENGINE PARTS — comportamento do site

/* ==========================================================================
   Google Analytics + consentimento de cookies (LGPD)
   Para ativar: preencha o ID de medição do GA4 abaixo (formato G-XXXXXXXXXX).
   Enquanto estiver vazio, o site não carrega nada do Google Analytics, não
   mostra o banner de cookies e a Política de Privacidade continua dizendo
   que o site não usa cookies de análise.
   ========================================================================== */
var APEX_GA_ID = '';
var APEX_CONSENT_MONTHS = 6;   // depois deste prazo o banner volta a perguntar

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Menu mobile ---- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // fecha o menu ao clicar num link (mobile)
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Carrossel do banner (Home) ---- */
  var slides = document.querySelectorAll('.hero-slide');
  var dotsWrap = document.querySelector('.hero-dots');
  if (slides.length > 1 && dotsWrap) {
    var current = 0;
    var dots = [];
    var intervalId;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ir para o slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goTo(i);
        resetInterval();
      });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('active');
      slides[current].setAttribute('aria-hidden', 'true');
      dots[current].classList.remove('active');
      current = index;
      slides[current].classList.add('active');
      slides[current].removeAttribute('aria-hidden');
      dots[current].classList.add('active');
    }
    slides.forEach(function (s, i) { if (i !== 0) s.setAttribute('aria-hidden', 'true'); });

    function next() {
      goTo((current + 1) % slides.length);
    }

    function resetInterval() {
      clearInterval(intervalId);
      intervalId = setInterval(next, 6000);
    }

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      resetInterval();
    }
  }

  /* ---- Consentimento de cookies e Google Analytics ---- */
  (function () {
    if (!APEX_GA_ID) return;

    var KEY = 'apex_cookie_consent';
    var gaLoaded = false;

    // a política passa a descrever o uso de cookies de análise
    var noCookies = document.getElementById('policy-no-cookies');
    var analytics = document.getElementById('policy-analytics');
    if (noCookies) noCookies.hidden = true;
    if (analytics) analytics.hidden = false;
    document.querySelectorAll('[data-cookie-prefs]').forEach(function (el) { el.hidden = false; });

    function readConsent() {
      try {
        var saved = JSON.parse(localStorage.getItem(KEY));
        if (!saved || (saved.choice !== 'accepted' && saved.choice !== 'rejected')) return null;
        var limit = new Date(saved.date);
        limit.setMonth(limit.getMonth() + APEX_CONSENT_MONTHS);
        return new Date() < limit ? saved.choice : null;
      } catch (e) { return null; }
    }
    function saveConsent(choice) {
      try { localStorage.setItem(KEY, JSON.stringify({ choice: choice, date: new Date().toISOString() })); } catch (e) {}
    }

    function loadAnalytics() {
      if (gaLoaded) return;
      gaLoaded = true;
      window['ga-disable-' + APEX_GA_ID] = false;
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', APEX_GA_ID);
      var tag = document.createElement('script');
      tag.async = true;
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(APEX_GA_ID);
      document.head.appendChild(tag);
    }
    function removeAnalytics() {
      window['ga-disable-' + APEX_GA_ID] = true;
      var host = location.hostname.split('.');
      document.cookie.split(';').forEach(function (c) {
        var name = c.split('=')[0].trim();
        if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid') {
          // tenta apagar no domínio atual e no domínio-pai
          for (var i = 0; i < host.length - 1; i++) {
            var domain = host.slice(i).join('.');
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + domain;
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.' + domain;
          }
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        }
      });
    }

    var banner = null;
    function closeBanner() { if (banner) { banner.remove(); banner = null; } }
    function choose(choice) {
      saveConsent(choice);
      if (choice === 'accepted') loadAnalytics(); else removeAnalytics();
      closeBanner();
    }
    function openBanner() {
      if (banner) return;
      banner = document.createElement('div');
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'dialog');
      banner.setAttribute('aria-label', 'Preferências de cookies');
      banner.innerHTML =
        '<p class="cookie-title">Cookies e privacidade</p>' +
        '<p>Usamos cookies de análise (Google Analytics) para entender como o site é usado e melhorá-lo. ' +
        'Eles só são ativados se você aceitar. Saiba mais na ' +
        '<a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
        '<div class="cookie-actions">' +
        '<button type="button" class="btn btn-outline" data-choice="rejected">Recusar</button>' +
        '<button type="button" class="btn btn-outline" data-choice="accepted">Aceitar</button>' +
        '</div>';
      banner.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-choice]');
        if (btn) choose(btn.getAttribute('data-choice'));
      });
      document.body.appendChild(banner);
    }

    document.querySelectorAll('[data-cookie-prefs]').forEach(function (el) {
      el.addEventListener('click', function (e) { e.preventDefault(); openBanner(); });
    });

    var current = readConsent();
    if (current === 'accepted') loadAnalytics();
    else if (current === null) openBanner();
  })();

  /* ---- Ano dinâmico no rodapé ---- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
