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

  const icon = (name) => {
    const icons = {
      heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
      comment: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9 9 0 0 1-4-.9L3 21l1.6-4.5A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
      repost: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></svg>',
      share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
      save: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4Z"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>'
    };
    return icons[name] || '';
  };

  const replaceHomepageReflections = () => {
    const current = document.querySelector('main .reflections');
    if (!current || document.querySelector('.home-instagram')) return;

    const posts = [
      {
        image: '/instagram-post-1.jpg',
        href: 'https://www.instagram.com/p/DLzP-uTRRES/?img_index=1',
        date: '9 March',
        alt: 'Feels Like Om Instagram post featuring Sikkimese women',
        caption: `This was so fun to make — IG bios for 7.5 Sikkimese women!!\n\nThese women (and many more yet to be featured) are absolutely amazing and stronger than they know. They form the backbone of their families and communities. What would we do without women 🙏😌\n\n✨ LAST feeeeeew spaces for April before we conclude the Spring season.\n\n💗 DM me if you’re thinking of joining in April or if you want first dibs on our Winter dates.`
      },
      {
        image: '/instagram-post-2.jpg',
        href: 'https://www.instagram.com/p/DaaQbrCjL_u/?img_index=1',
        date: '5 July',
        alt: 'Feels Like Om Instagram post about learning from Hawaiʻi and Sikkim',
        caption: `A little update: I’m here in beautiful Hawai’i, learning so much from the land and @east.west.center. Been talking to so many people about Sikkim and this lovely community we’ve built ever since Feels Like Om started.\n\nOne of the most common questions was “what’s your why?”. Showing up here authentically, sharing raw unedited footage from my phone gallery, some videos taken by me, some videos taken by the lovely people who’ve been to Sikkim with us.\n\nYou know those ‘aha’ moments? These words were flowing through me like River Teesta, the moment I wrote them out, I knew I had to share them. This is my why.\n\nSomeone told me that what she felt through Feels Like Om’s social media is the same as what she was feeling when she was in Sikkim. I’m really glad that is the case.\n\nWinter 2026 dates are ready. We have four different programs this time, including a hybrid silent retreat.\n\nLet me know when you’re ready to come.`
      },
      {
        image: '/instagram-post-3.jpg',
        href: 'https://www.instagram.com/p/DVppispE29-/?img_index=1',
        date: '7 July 2025',
        alt: 'Feels Like Om Instagram post featuring a CNA story about living like a local in Sikkim',
        caption: `When Ee Ming called me for the interview, I just finished my lunch while en route to Sikkim. My right hand was covered with the rice and dal from lunch. I told her to give me a minute to wash my hands and foot the bill.\n\nShe heard my conversation with the cashier. “You speak Nepali?” “Yeah, a little. I’ve been learning for two years, nowhere near conversational, but enough for casual chitchat.”\n\nOnce I was back in the car, we continued with the interview. Midway through describing what Sikkim means to me, I asked Ee Ming if she’s ok with switching to video call. She readily agreed and seconds later, the two of us, who never met before, were connecting through the view of light rays pouring across the lush hills of Sikkim. An image I’ll never forget. A feeling I’ll always remember. An opportunity I’m eternally grateful for.\n\nThank you @emtoh for lending your beautiful voice to our community 💚\n\nCNA article link in bio 🥺`
      }
    ];

    const section = document.createElement('section');
    section.className = 'home-instagram';
    section.setAttribute('aria-labelledby', 'home-instagram-heading');
    section.innerHTML = `
      <div class="home-instagram-inner">
        <div class="home-instagram-head reveal">
          <h2 id="home-instagram-heading">From Instagram</h2>
          <a class="home-instagram-follow" href="https://www.instagram.com/feelslikeom/" target="_blank" rel="noreferrer">
            ${icon('instagram')}<span>Follow on Instagram</span><span aria-hidden="true">→</span>
          </a>
        </div>
        <div class="home-instagram-grid">
          ${posts.map((post) => `
            <article class="ig-card reveal">
              <div class="ig-card-top">
                <span class="ig-avatar"><img src="/Logo-Circle.png" alt="Feels Like Om" /></span>
                <span class="ig-more" aria-hidden="true">•••</span>
              </div>
              <a class="ig-media" href="${post.href}" target="_blank" rel="noreferrer" aria-label="View post on Instagram">
                <img src="${post.image}" alt="${post.alt}" />
              </a>
              <div class="ig-actions" aria-hidden="true">
                <span class="ig-action">${icon('heart')}</span>
                <span class="ig-action">${icon('comment')}</span>
                <span class="ig-action">${icon('repost')}</span>
                <span class="ig-action">${icon('share')}</span>
                <span class="ig-action ig-action--save">${icon('save')}</span>
              </div>
              <div class="ig-copy">
                <p class="ig-caption">${post.caption}</p>
                <p class="ig-date">${post.date}</p>
                <a class="ig-view" href="${post.href}" target="_blank" rel="noreferrer">View Post <span aria-hidden="true">→</span></a>
              </div>
            </article>
          `).join('')}
        </div>
      </div>`;

    current.replaceWith(section);
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
