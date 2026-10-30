(function () {
  'use strict';

  var header     = document.querySelector('header');
  var toggle     = document.querySelector('.menu-toggle');
  var backdrop   = document.querySelector('.sidebar-backdrop');
  var navLinks   = document.querySelectorAll('#site-nav a[data-section]');

  function setOpen(open) {
    header.classList.toggle('nav-open', open);
    document.body.classList.toggle('nav-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  }

  /* FIX: touchend fires before the 300ms synthetic click on iOS/Android
          e.preventDefault() stops the ghost click from toggling twice
          e.stopPropagation() stops the tap reaching the document and immediately closing */
  function onToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!header.classList.contains('nav-open'));
  }

  toggle.addEventListener('click',    onToggle);
  toggle.addEventListener('touchend', onToggle, { passive: false });

  function onClose(e) {
    e.preventDefault();
    setOpen(false);
  }

  backdrop.addEventListener('click',    onClose);
  backdrop.addEventListener('touchend', onClose, { passive: false });

  document.querySelectorAll('#site-nav a').forEach(function (link) {
    link.addEventListener('click',    function () { setOpen(false); });
    link.addEventListener('touchend', function () { setOpen(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });

  /* Active section highlight */
  var sections = Array.from(navLinks)
    .map(function (l) { return document.getElementById(l.dataset.section); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = document.querySelector(
          '#site-nav a[data-section="' + entry.target.id + '"]'
        );
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* Header shadow once the page is scrolled */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
