(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var header   = document.querySelector('header');
  var toggle   = document.querySelector('.menu-toggle');
  var backdrop = document.querySelector('.sidebar-backdrop');
  var navLinks = document.querySelectorAll('#site-nav a[data-section]');

  /* ---------- mobile menu ---------- */
  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  /* touchend fires before the synthetic click; preventDefault stops a double toggle */
  function onToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!header.classList.contains('nav-open'));
  }
  toggle.addEventListener('click', onToggle);
  toggle.addEventListener('touchend', onToggle, { passive: false });

  function onClose(e) {
    e.preventDefault();
    setOpen(false);
  }
  backdrop.addEventListener('click', onClose);
  backdrop.addEventListener('touchend', onClose, { passive: false });

  document.querySelectorAll('#site-nav a').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  /* close the drawer if the screen is resized to desktop */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) setOpen(false);
  });

  /* ---------- header shadow on scroll ---------- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- active section highlight ---------- */
  var sections = Array.prototype.map.call(navLinks, function (l) {
    return document.getElementById(l.dataset.section);
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = document.querySelector('#site-nav a[data-section="' + entry.target.id + '"]');
        if (!link) return;
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------- fade-in on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }
})();
