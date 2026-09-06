(() => {
  const sectionNav = document.querySelector('.section-nav');
  const intentions = document.querySelector('#intentions');
  if (!sectionNav || !intentions) return;

  if (window.location.pathname.includes('/journeys/the-flagship')) {
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

  const updateBackToTop = () => {
    const show = intentions.getBoundingClientRect().bottom <= 0;
    backToTop.classList.toggle('is-visible', show);
  };

  const update = () => {
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
