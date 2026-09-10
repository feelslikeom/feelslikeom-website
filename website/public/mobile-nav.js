(() => {
  const ensureStyles = () => {
    if (!document.querySelector('link[data-mobile-nav-v3]')) {
      const navLink = document.createElement('link');
      navLink.rel = 'stylesheet';
      navLink.href = '/mobile-nav-v3.css';
      navLink.dataset.mobileNavV3 = 'true';
      document.head.appendChild(navLink);
    }
    if (!document.querySelector('link[data-mobile-content-polish]')) {
      const polishLink = document.createElement('link');
      polishLink.rel = 'stylesheet';
      polishLink.href = '/mobile-content-polish.css';
      polishLink.dataset.mobileContentPolish = 'true';
      document.head.appendChild(polishLink);
    }
  };

  const applyContentUpdates = () => {
    const fieldImmersionLink = document.querySelector('#stay-longer a.text-link');
    if (fieldImmersionLink) fieldImmersionLink.href = '/journeys/the-flagship#itinerary';

    document.querySelectorAll('#enquire.enquire, .other-journeys').forEach((section) => {
      const heading = section.querySelector('h2');
      if (heading?.textContent?.trim().toLowerCase() === 'other journeys') section.remove();
    });

    const reflectionsIntro = document.querySelector('.reflection-intro .intro');
    if (reflectionsIntro) {
      reflectionsIntro.textContent = 'Each circle holds one person’s reflection. Follow the threads, click into a story, and move from one reflection to the next. Sikkim voices coming soon.';
    }
  };

  const setup = () => {
    ensureStyles();
    applyContentUpdates();

    document.querySelectorAll('.site-header').forEach((header) => {
      const button = header.querySelector('.mobile-nav-toggle');
      const nav = header.querySelector('.main-nav');
      if (!button || !nav || button.dataset.mobileNavReady === 'true') return;
      button.dataset.mobileNavReady = 'true';

      const closeMenu = () => {
        header.classList.remove('nav-open');
        document.documentElement.classList.remove('nav-locked');
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-label', 'Open navigation');
        nav.querySelectorAll('details').forEach((item) => item.removeAttribute('open'));
      };

      const openMenu = () => {
        header.classList.add('nav-open');
        document.documentElement.classList.add('nav-locked');
        button.setAttribute('aria-expanded', 'true');
        button.setAttribute('aria-label', 'Close navigation');
        nav.querySelectorAll('details').forEach((item) => item.removeAttribute('open'));
      };

      button.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (header.classList.contains('nav-open')) closeMenu();
        else openMenu();
      });

      nav.querySelectorAll('.nav-dropdown > summary').forEach((summary) => {
        summary.addEventListener('click', (event) => event.stopPropagation());
      });
      nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('nav-open')) closeMenu();
      });
    });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup, { once: true });
  else setup();
})();
