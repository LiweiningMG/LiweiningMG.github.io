(function () {
  'use strict';
  var nav = document.getElementById('site-nav');
  if (nav) {
    var button = nav.querySelector('[data-menu-toggle]');
    var menu = document.getElementById('site-menu');
    function setOpen(open, returnFocus) {
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      if (returnFocus) button.focus();
    }
    button.addEventListener('click', function () { setOpen(button.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', function (event) { if (!nav.contains(event.target)) setOpen(false); });
    nav.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') { event.preventDefault(); setOpen(false, true); }
    });
    menu.addEventListener('click', function (event) { if (event.target.closest('a')) setOpen(false); });
    window.addEventListener('resize', function () { if (window.innerWidth >= 1040) setOpen(false); });
  }

  document.querySelectorAll('.author__urls-wrapper').forEach(function (root, index) {
    var button = root.querySelector('button');
    var list = root.querySelector('.author__urls');
    if (!button || !list) return;
    list.id = 'profile-links-' + index;
    button.setAttribute('aria-controls', list.id);
    button.addEventListener('click', function () {
      var expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      root.classList.toggle('is-open', expanded);
    });
    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') { button.setAttribute('aria-expanded', 'false'); root.classList.remove('is-open'); button.focus(); }
    });
  });

  document.querySelectorAll('.cv-page table').forEach(function (table) {
    table.classList.add('cv-responsive-table');
    var headings = Array.from(table.querySelectorAll('thead th')).map(function (th) { return th.textContent.trim(); });
    table.querySelectorAll('tbody tr').forEach(function (row) {
      row.querySelectorAll('td').forEach(function (cell, i) { cell.setAttribute('data-label', headings[i] || ''); });
    });
  });

  var cv = document.querySelector('.cv-page');
  if (cv) {
    var english = document.documentElement.lang === 'en';
    var links = document.createElement('nav');
    links.className = 'cv-section-nav';
    links.setAttribute('aria-label', english ? 'CV sections' : '简历章节');
    cv.querySelectorAll('h2').forEach(function (heading, index) {
      if (!heading.id) heading.id = 'cv-section-' + index;
      var link = document.createElement('a'); link.href = '#' + heading.id; link.textContent = heading.textContent.trim(); links.appendChild(link);
    });
    cv.querySelector('center')?.insertAdjacentElement('afterend', links);
    // Wrapped desktop rows and the mobile strip have different heights. Keep native
    // anchor scrolling clear of both this toolbar and the persistent site masthead.
    function measureSectionNav() {
      document.documentElement.style.setProperty('--cv-nav-height', Math.ceil(links.getBoundingClientRect().height) + 'px');
    }
    measureSectionNav();
    if (window.ResizeObserver) new ResizeObserver(measureSectionNav).observe(links);
    else window.addEventListener('resize', measureSectionNav);
  }
})();
