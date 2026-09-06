(() => {
  const sectionNav = document.querySelector('.section-nav');
  const intentions = document.querySelector('#intentions');
  if (!sectionNav || !intentions) return;

  const isFlagship = window.location.pathname.includes('/journeys/the-flagship');
  const isToBeFree = window.location.pathname.includes('/journeys/how-to-embrace-suffering') || window.location.pathname.includes('/journeys/to-be-free');

  if (isFlagship) {
    document.body.classList.add('flagship-page');

    const flagshipLabels = {
      '#intentions': 'Intentions',
      '#itinerary': 'Itinerary',
      '#accommodation': 'Stay',
      '#food': 'Food',
      '#trek': 'Trek',
      '#reflections': 'Reflections',
      '#faq': 'FAQ',
    };

    sectionNav.querySelectorAll('a').forEach((link) => {
      const label = link.querySelector('.section-nav-label');
      const href = link.getAttribute('href');
      if (label && href && flagshipLabels[href]) label.textContent = flagshipLabels[href];
    });

    const accommodationSection = document.querySelector('.accommodation-section');
    const accommodationGallerySection = document.querySelector('.accommodation-gallery-section');
    const accommodationPortrait = document.querySelector('.accommodation-portrait');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    if (accommodationSection) revealObserver.observe(accommodationSection);
    if (accommodationGallerySection) revealObserver.observe(accommodationGallerySection);

    const updateAccommodationDrift = () => {
      if (!accommodationSection || !accommodationPortrait || reducedMotion.matches || window.innerWidth <= 900) {
        accommodationPortrait?.style.setProperty('--accommodation-drift', '0px');
        return;
      }

      const rect = accommodationSection.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = Math.max(0, Math.min(1, (viewport - rect.top) / (viewport + rect.height)));
      const drift = (0.5 - progress) * 28;
      accommodationPortrait.style.setProperty('--accommodation-drift', `${drift.toFixed(1)}px`);
    };

    updateAccommodationDrift();
    window.addEventListener('scroll', updateAccommodationDrift, { passive: true });
    window.addEventListener('resize', updateAccommodationDrift);
    reducedMotion.addEventListener?.('change', updateAccommodationDrift);
  }

  if (isToBeFree) {
    sectionNav.querySelectorAll('a').forEach((link) => {
      if (link.getAttribute('href') === '#journey') {
        const label = link.querySelector('.section-nav-label');
        if (label) label.textContent = 'Schedule';
      }
    });
  }

  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Scroll to top');
  backToTop.innerHTML = '↑';
  document.body.appendChild(backToTop);

  const firstOpaqueBackground = (element) => {
    let current = element;
    while (current && current !== document.documentElement) {
      const background = getComputedStyle(current).backgroundColor;
      const match = background.match(/rgba?\(([^)]+)\)/);
      if (match) {
        const values = match[1].split(',').map((value) => Number.parseFloat(value.trim()));
        const alpha = values.length > 3 ? values[3] : 1;
        if (alpha > 0.08) return values.slice(0, 3);
      }
      current = current.parentElement;
    }
    return [244, 239, 229];
  };

  const isDarkBackground = (rgb) => {
    const [r, g, b] = rgb.map((value) => value / 255);
    const linear = [r, g, b].map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    return luminance < 0.34;
  };

  const updateTheme = () => {
    const sampleX = Math.max(20, window.innerWidth - 240);
    const sampleY = Math.round(window.innerHeight / 2);
    const target = document.elementFromPoint(sampleX, sampleY);
    const dark = isDarkBackground(firstOpaqueBackground(target));
    sectionNav.classList.toggle('is-dark', dark);
    backToTop.classList.toggle('is-dark', dark);
  };

  const updateSectionNavVisibility = () => {
    const rect = intentions.getBoundingClientRect();
    const hasReachedIntentions = rect.top <= window.innerHeight * 0.72;
    sectionNav.classList.toggle('has-entered-intentions', hasReachedIntentions);
  };

  const updateBackToTop = () => {
    const show = intentions.getBoundingClientRect().bottom <= 0;
    backToTop.classList.toggle('is-visible', show);
  };

  const update = () => {
    updateSectionNavVisibility();
    updateBackToTop();
    updateTheme();
  };

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();
