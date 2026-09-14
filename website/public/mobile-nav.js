(() => {
  if (!document.querySelector('style[data-nav-marker-guard]')) {
    const markerGuard = document.createElement('style');
    markerGuard.dataset.navMarkerGuard = 'true';
    markerGuard.textContent = `
      .main-nav .nav-dropdown > summary { list-style: none !important; }
      .main-nav .nav-dropdown > summary::-webkit-details-marker { display: none !important; }
      .main-nav .nav-dropdown > summary::marker { content: "" !important; font-size: 0 !important; }
      .main-nav .nav-dropdown > summary::before,
      .main-nav .nav-dropdown > summary::after { content: none !important; display: none !important; }
    `;
    document.head.appendChild(markerGuard);
  }

  const isHomepage = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/' || path === '/index.html';
  };

  const isToBeFreePage = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/journeys/to-be-free' || path === '/journeys/how-to-embrace-suffering';
  };

  const isOurStoriesPage = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/about/our-stories';
  };

  const isFlagshipPage = () => {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return path === '/journeys/the-flagship';
  };

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
    if (isToBeFreePage() && !document.querySelector('link[data-to-be-free-faq]')) {
      const faqLink = document.createElement('link');
      faqLink.rel = 'stylesheet';
      faqLink.href = '/to-be-free-faq.css';
      faqLink.dataset.toBeFreeFaq = 'true';
      document.head.appendChild(faqLink);
    }
    if (isOurStoriesPage() && !document.querySelector('link[data-our-stories-header]')) {
      const storiesLink = document.createElement('link');
      storiesLink.rel = 'stylesheet';
      storiesLink.href = '/our-stories-header.css';
      storiesLink.dataset.ourStoriesHeader = 'true';
      document.head.appendChild(storiesLink);
    }
    if (isFlagshipPage() && !document.querySelector('link[data-flagship-contribution]')) {
      const contributionLink = document.createElement('link');
      contributionLink.rel = 'stylesheet';
      contributionLink.href = '/flagship-contribution.css';
      contributionLink.dataset.flagshipContribution = 'true';
      document.head.appendChild(contributionLink);
    }
    if (isHomepage() && document.querySelector('main .reflections') && !document.querySelector('link[data-home-instagram]')) {
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
    if (!isHomepage()) return;

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
          ${posts.map((url, index) => `
            <div class="home-instagram-item reveal">
              <div class="home-instagram-embed">
                <blockquote class="instagram-media" data-instgrm-permalink="${url}?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14"></blockquote>
              </div>
              ${index === 0 ? '<a class="home-instagram-article-link" href="https://cnalifestyle.channelnewsasia.com/women/female-led-boutique-travel-destinations-467331" target="_blank" rel="noopener noreferrer">Read the full CNA article →</a>' : ''}
            </div>
          `).join('')}
        </div>
      </div>`;

    current.replaceWith(section);
    loadInstagramEmbedScript();
  };

  const updateFlagshipDetails = () => {
    if (!isFlagshipPage()) return;

    const sideNavLink = Array.from(document.querySelectorAll('.section-nav a')).find((link) => {
      const labelText = link.querySelector('.section-nav-label')?.textContent.trim();
      return labelText === 'Reflections' || labelText === 'Details';
    });
    if (sideNavLink) {
      sideNavLink.setAttribute('href', '#details');
      const label = sideNavLink.querySelector('.section-nav-label');
      if (label) label.textContent = 'Details';
    }

    const itineraryHeading = document.querySelector('#itinerary .itinerary-heading');
    if (itineraryHeading && !document.querySelector('#itinerary .itinerary-living-note')) {
      const note = document.createElement('p');
      note.className = 'itinerary-living-note';
      note.style.margin = '-2rem 0 3rem';
      note.style.maxWidth = '820px';
      note.style.fontSize = 'clamp(.9rem,1.2vw,1rem)';
      note.style.lineHeight = '1.7';
      note.style.opacity = '.82';
      note.textContent = "This is a living itinerary. Activities may shift with weather, community availability, and what's happening in the village, sometimes it's a wedding. Reflection and collective sense-making will happen throughout the journey.";
      itineraryHeading.insertAdjacentElement('afterend', note);
    }

    const reflectionsSection = document.querySelector('main #reflections.reflections');
    if (reflectionsSection && !document.querySelector('#details.flagship-contribution')) {
      const contributionSection = document.createElement('section');
      contributionSection.id = 'details';
      contributionSection.className = 'section flagship-contribution';
      contributionSection.setAttribute('aria-labelledby', 'flagship-contribution-title');
      contributionSection.innerHTML = `
        <div class="flagship-contribution-inner">
          <h2 id="flagship-contribution-title">Your Contribution</h2>
          <div class="flagship-contribution-grid">
            <div class="flagship-contribution-pricing" aria-label="Journey contribution options">
              <p class="flagship-contribution-price">SGD 2,480 <span>per person · double room</span></p>
              <p class="flagship-contribution-price">SGD 2,680 <span>per person · private room</span></p>
            </div>
            <div class="flagship-contribution-copy">
              <p>It is our honour to host you, even if it’s just one of you. We keep each group intentionally small, with a maximum of six people. Exceptions may be possible, just speak with us :-)</p>
              <p>A <strong>non-refundable 50% deposit</strong> is required to secure your place. The remaining balance can be made one month before the journey begins. Payment can be made via PayNow or Wise transfer.</p>
              <p>The journey begins and ends at <strong>Bagdogra Airport</strong>. You navigate the flights; once you arrive at Bagdogra, we’ll help coordinate the rest of your journey into Sikkim.</p>
              <p>Your contribution does not include airfare, travel insurance, alcohol, personal expenses, or airport transfers.</p>
              <p>Airport transfers can be arranged for you. Payment is made directly to your driver.</p>
            </div>
          </div>
          <div class="flagship-contribution-sustain">
            <h3>What your participation helps sustain</h3>
            <p>Your contribution makes this journey possible, while also supporting the people, practices and relationships that make it meaningful.</p>
            <ul class="flagship-contribution-list">
              <li><strong>Next-generation agripreneurs</strong> who have chosen to stay rather than migrate to cities, and who are working to revitalise ancestral practices and values</li>
              <li><strong>Village women entrepreneurs</strong>, including the family team who hosts you and takes care of you throughout your stay</li>
              <li><strong>Traditional organic farming practices</strong> and the knowledge held within them</li>
              <li><strong>Leave No Trace trekking practices</strong> that care for the mountains we move through</li>
              <li><strong>Cultural identity and heritage among younger generations</strong>, empowering them with a sense of ownership and responsibility to continue Indigenous visual literacies</li>
              <li><strong>Multigenerational third space</strong>, where people can just be, and a container for futures to be imagined and co-created</li>
            </ul>
          </div>
        </div>`;

      reflectionsSection.replaceWith(contributionSection);
      document.querySelector('#reflection-lightbox')?.remove();
    }

    document.querySelectorAll('#faq .faq-list details').forEach((item) => {
      const summary = item.querySelector('summary');
      if (summary?.textContent.trim().toLowerCase() === 'how big is the group?') item.remove();
    });
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

      let reflectionsDropdown = Array.from(nav.querySelectorAll('.nav-dropdown')).find((item) => item.querySelector(':scope > summary')?.textContent.trim().toUpperCase() === 'REFLECTIONS');
      if (!reflectionsDropdown) {
        const reflectionLink = Array.from(nav.children).find((item) => item.tagName === 'A' && item.textContent.trim().toUpperCase() === 'REFLECTIONS');
        if (reflectionLink) {
          reflectionsDropdown = document.createElement('details');
          reflectionsDropdown.className = 'nav-dropdown reflections-dropdown';
          reflectionsDropdown.innerHTML = `<summary>REFLECTIONS</summary><div class="submenu"></div>`;
          reflectionLink.replaceWith(reflectionsDropdown);
        }
      }

      if (reflectionsDropdown) {
        const submenu = reflectionsDropdown.querySelector('.submenu');
        if (submenu) {
          submenu.innerHTML = `
            <a href="/reflections">Guest Book</a>
            <a href="/reflections/life-on-sikkim-time">Life on Sikkim time</a>`;
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
      if (intro) {
        intro.textContent = 'At the end of every journey, we invite participants to share their reflections in our guest book. Each circle holds one person’s reflection, and is a testament to what happens when we approach life with gratitude, reciprocity and enoughness.';
        if (!reflectionsIntro.querySelector('.google-reviews-inline')) {
          const googleLink = document.createElement('p');
          googleLink.className = 'intro google-reviews-inline';
          googleLink.style.marginTop = '1rem';
          googleLink.innerHTML = '<a href="https://maps.app.goo.gl/tQHmVowypBeZXmkc9" target="_blank" rel="noopener noreferrer" style="color:inherit;">Read Google reviews here.</a>';
          intro.insertAdjacentElement('afterend', googleLink);
        }
      }
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
    updateFlagshipDetails();
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