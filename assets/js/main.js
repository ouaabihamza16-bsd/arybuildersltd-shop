/* ARY BUILDERS LTD - site scripts: mobile menu, smooth scroll, legal modals. No forms, cookies or tracking. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile menu */
  var toggle = document.getElementById('menu-toggle');
  var menu = document.getElementById('mobile-menu');
  var label = document.getElementById('menu-toggle-label');

  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('hidden', !open);
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
    var iconOpen = toggle.querySelector('.icon-open');
    var iconClose = toggle.querySelector('.icon-close');
    if (iconOpen) iconOpen.classList.toggle('hidden', open);
    if (iconClose) iconClose.classList.toggle('hidden', !open);
  }

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setMenu(false);
    });
  }

  /* Smooth scroll for in-page links, with focus moved to the target */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    if (!id) return;
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* Legal modals (<dialog>, closable with Esc, close button or backdrop click) */
  var lastOpener = null;

  function closeDialog(dialog) {
    if (dialog && dialog.open) dialog.close();
  }

  document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var dialog = document.getElementById(btn.getAttribute('data-open-modal'));
      if (!dialog) return;
      lastOpener = btn;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
      document.documentElement.classList.add('modal-open');
      var body = dialog.querySelector('.legal-body');
      if (body) body.scrollTop = 0;
    });
  });

  document.querySelectorAll('dialog.legal-modal').forEach(function (dialog) {
    dialog.querySelectorAll('[data-close-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (typeof dialog.close === 'function') {
          closeDialog(dialog);
        } else {
          dialog.removeAttribute('open');
          dialog.dispatchEvent(new Event('close'));
        }
      });
    });
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeDialog(dialog);
    });
    dialog.addEventListener('close', function () {
      document.documentElement.classList.remove('modal-open');
      if (lastOpener) lastOpener.focus();
    });
  });

  /* Footer year */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
