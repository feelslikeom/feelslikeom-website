import { defineMiddleware } from 'astro:middleware';

const footerMarkup = `
  <footer class="site-community-footer" data-site-community-footer>
    <div class="site-community-footer-inner">
      <p class="site-community-footer-eyebrow">Stay connected</p>
      <h2>Join the community</h2>
      <p class="site-community-footer-copy">Stay in touch to hear about community updates and future journeys.</p>

      <form class="site-community-footer-form" data-community-signup-form>
        <input id="community-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="Your email address" aria-label="Your email address" required />
        <button type="submit">Stay in the loop <span class="site-community-footer-arrow" aria-hidden="true">→</span></button>
      </form>
      <p class="site-community-footer-note" data-community-signup-note aria-live="polite"></p>

      <a class="site-community-footer-instagram" href="https://www.instagram.com/feelslikeom/" target="_blank" rel="noopener noreferrer" aria-label="Feels Like Om on Instagram">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5"></rect>
          <circle cx="12" cy="12" r="4.2"></circle>
          <circle cx="17.4" cy="6.7" r=".7" fill="currentColor" stroke="none"></circle>
        </svg>
      </a>
    </div>
  </footer>
  <script>
    (() => {
      const form = document.querySelector('[data-community-signup-form]');
      if (!form || form.dataset.ready === 'true') return;
      form.dataset.ready = 'true';
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = form.querySelector('input[type="email"]');
        const button = form.querySelector('button[type="submit"]');
        const note = document.querySelector('[data-community-signup-note]');
        if (!email?.checkValidity()) {
          email?.reportValidity();
          return;
        }

        const originalButton = button?.innerHTML;
        if (button) {
          button.disabled = true;
          button.textContent = 'Joining...';
        }
        if (note) note.textContent = '';

        try {
          const response = await fetch('/.netlify/functions/community-signup', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              email: email.value.trim(),
              source: window.location.pathname || '/',
            }),
          });

          if (!response.ok) throw new Error('Signup failed');

          email.value = '';
          if (note) note.textContent = 'Welcome to the Feels Like Om community. We will be in touch soon.';
        } catch (error) {
          console.error(error);
          if (note) note.textContent = 'We could not save your email just now. Please try again.';
        } finally {
          if (button) {
            button.disabled = false;
            button.innerHTML = originalButton;
          }
        }
      });
    })();
  </script>`;

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();
  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('text/html')) return response;

  let html = await response.text();
  if (!html.includes('data-site-community-footer')) {
    html = html.replace(
      '</head>',
      '  <link rel="stylesheet" href="/site-footer.css" />\n</head>'
    );
    html = html.replace('</body>', `${footerMarkup}\n</body>`);
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
});
