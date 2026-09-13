(() => {
  const ensureStyles = () => {
    if (!document.querySelector('link[data-mobile-nav-v3]')) {
      const navLink = document.createElement('link');
      navLink.rel = 'stylesheet';
      navLink.href = '/mobile-nav-v3.css';
      navLink.dataset.mobileNavV3 = 'true';
      document.head.appendChild(navLink);
    }
    if (!document.querySelector('link[data-desktop-nav-dropdown]')) {
      const desktopNavLink = document.createElement('link');
      desktopNavLink.rel = 'stylesheet';
      desktopNavLink.href = '/desktop-nav-dropdown.css';
      desktopNavLink.dataset.desktopNavDropdown = 'true';
      document.head.appendChild(desktopNavLink);
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

  const updateNavigation = () => {
    document.querySelectorAll('.main-nav').forEach((nav) => {
      const about = Array.from(nav.querySelectorAll('.nav-dropdown')).find((item) => item.querySelector(':scope > summary')?.textContent.trim().toUpperCase() === 'ABOUT');
      if (about) {
        const submenu = about.querySelector('.submenu');
        if (submenu) {
          submenu.innerHTML = `
            <a href="/about/our-stories">Our stories</a>
            <a href="/about/getting-to-sikkim">Getting to Sikkim</a>
            <a href="/about/visa-and-permits">Visa and permits</a>
            <a href="/about/media">Media</a>`;
        }
      }

      const existingReflectionDropdown = Array.from(nav.querySelectorAll('.nav-dropdown')).find((item) => item.querySelector(':scope > summary')?.textContent.trim().toUpperCase() === 'REFLECTIONS');
      if (!existingReflectionDropdown) {
        const reflectionLink = Array.from(nav.children).find((item) => item.tagName === 'A' && item.textContent.trim().toUpperCase() === 'REFLECTIONS');
        if (reflectionLink) {
          const details = document.createElement('details');
          details.className = 'nav-dropdown reflections-dropdown';
          details.innerHTML = `
            <summary>REFLECTIONS</summary>
            <div class="submenu">
              <a href="/reflections">Guest Book</a>
              <a href="/reflections/google-reviews">Google Reviews</a>
              <a href="/reflections/life-on-sikkim-time">Life on Sikkim time</a>
            </div>`;
          reflectionLink.replaceWith(details);
        }
      }
    });
  };

  const applyContentUpdates = () => {
    const fieldImmersionLink = document.querySelector('#stay-longer a.text-link');
    if (fieldImmersionLink) fieldImmersionLink.href = '/journeys/the-flagship#itinerary';

    document.querySelectorAll('#enquire.enquire, .other-journeys').forEach((section) => {
      const heading = section.querySelector('h2');
      if (heading?.textContent?.trim().toLowerCase() === 'other journeys') section.remove();
    });

    const reflectionsIntro = document.querySelector('.reflection-intro');
    if (reflectionsIntro) {
      const eyebrow = reflectionsIntro.querySelector('.eyebrow');
      const intro = reflectionsIntro.querySelector('.intro');
      if (eyebrow) eyebrow.textContent = 'GUEST BOOK';
      if (intro) intro.textContent = 'At the end of every journey, we invite participants to share their reflections in our guest book. Each circle holds one person’s reflection, and is a testament to what happens when we approach life with gratitude, reciprocity and enoughness.';
    }

    const routeSteps = document.querySelectorAll('.route-section .route-step p');
    routeSteps.forEach((step) => {
      if (step.textContent.trim() === 'Continue your journey to the village' && !step.querySelector('.route-duration-note')) {
        const note = document.createElement('span');
        note.className = 'route-duration-note';
        note.style.display = 'block';
        note.style.marginTop = '.55rem';
        note.style.fontSize = '.82em';
        note.style.opacity = '.72';
        note.textContent = '(Entire journey from airport to village takes around 6 hours, including lunch break)';
        step.appendChild(note);
      }
    });

    updateNavigation();
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