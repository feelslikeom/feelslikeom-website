(() => {
  const setup = () => {
    document.querySelectorAll('.site-header').forEach((header) => {
      const button = header.querySelector('.mobile-nav-toggle');
      const nav = header.querySelector('.main-nav');
      if (!button || !nav) return;

      const closeMenu = () => {
        header.classList.remove('nav-open');
        button.setAttribute('aria-expanded', 'false');
        nav.querySelectorAll('details').forEach((item) => item.removeAttribute('open'));
      };

      button.addEventListener('click', (event) => {
        event.preventDefault();
        const willOpen = !header.classList.contains('nav-open');
        if (willOpen) {
          header.classList.add('nav-open');
          button.setAttribute('aria-expanded', 'true');
          nav.querySelectorAll('details').forEach((item) => item.removeAttribute('open'));
        } else {
          closeMenu();
        }
      });

      nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('nav-open')) closeMenu();
      });
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();
})();
