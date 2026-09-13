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
    if (document.querySelector('main .reflections') && !document.querySelector('link[data-home-instagram]')) {
      const instagramLink = document.createElement('link');
      instagramLink.rel = 'stylesheet';
      instagramLink.href = '/home-instagram.css';
      instagramLink.dataset.homeInstagram = 'true';
      document.head.appendChild(instagramLink);
    }
  };

  const loadInstagramEmbedScript = () => {
    const processEmbeds = () => window.instgrm?.Embeds?.process?.();
    const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (existing) {
      processEmbeds();
      return;
    }
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.instagram.com/embed.js';
    script.onload = processEmbeds;
    document.body.appendChild(script);
  };

  const replaceHomepageReflections = () => {
    const current = document.querySelector('main .reflections');
    if (!current || document.querySelector('.home-instagram')) return;

    const posts = [
      'https://www.instagram.com/p/DLzP-uTRRES/',
      'https://www.instagram.com/p/DaaQbrCjL_u/',
      'https://www.instagram.com/p/DVppispE29-/'
    ];

    const section = document.createElement('section');
    section.className = 'home-instagram';
    section.setAttribute('aria-labelledby', 'home-instagram-heading');
    section.innerHTML = `
      <div class="home-instagram-inner">
        <h2 id="home-instagram-heading" class="reveal">Stories Spotlight</h2>
        <div class="home-instagram-grid">
          ${posts.map((url) => `
            <div class="home-instagram-embed reveal">
              <blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
            </div>
          `).join('')}
        </div>
      </div>`;

    current.replaceWith(section);
    loadInstagramEmbedScript();
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

    replaceHomepageReflections();
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