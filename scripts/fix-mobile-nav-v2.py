from pathlib import Path
import re

pages_root = Path('website/src/pages')

mobile_script = '''(() => {
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
'''
Path('website/public/mobile-nav.js').write_text(mobile_script)

button_markup = '''      <button class="mobile-nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>\n'''

for path in pages_root.rglob('*.astro'):
    text = path.read_text()
    original = text
    if '<nav class="main-nav"' in text and 'mobile-nav-toggle' not in text:
        text = text.replace('      <nav class="main-nav"', button_markup + '      <nav class="main-nav"', 1)
    if '<nav class="main-nav"' in text and '/mobile-nav.js' not in text:
        text = text.replace('</body>', '    <script src="/mobile-nav.js" is:inline></script>\n  </body>', 1)
    text = re.sub(r'\s*<a href="/journeys#feels-like-home"[^>]*>Feels Like Home</a>', '', text)
    text = re.sub(r'\s*<a href="/journeys#way-of-the-yaks"[^>]*>Way of the Yaks</a>', '', text)
    if '/about/life-on-sikkim-time' not in text and '<a href="/about/visa-and-permits"' in text:
        text = re.sub(r'(<a href="/about/visa-and-permits"[^>]*>Visa and permits</a>)', r'\1\n            <a href="/about/life-on-sikkim-time">Life on Sikkim time</a>', text, count=1)
    if text != original:
        path.write_text(text)
        print('Updated', path)

css_path = Path('website/public/type-system.css')
css = css_path.read_text()
css = re.sub(r'/\* FLO MOBILE MENU 2026 \*/.*?/\* END FLO MOBILE MENU 2026 \*/\s*', '', css, flags=re.S)
css = re.sub(r'/\* FLO MOBILE NAV V2 \*/.*?/\* END FLO MOBILE NAV V2 \*/\s*', '', css, flags=re.S)
css += '''

/* FLO MOBILE NAV V2 */
.mobile-nav-toggle { display:none; }
@media (max-width:760px) {
  html,body { width:100%!important; max-width:100%!important; overflow-x:hidden!important; }
  .site-header { position:relative; z-index:9998!important; }
  .mobile-nav-toggle { display:flex!important; position:absolute!important; top:1rem!important; right:1rem!important; z-index:10001!important; width:48px!important; height:48px!important; margin:0!important; padding:0!important; border:1px solid rgba(24,48,31,.18)!important; border-radius:50%!important; background:rgba(244,239,229,.96)!important; color:#18301f!important; align-items:center!important; justify-content:center!important; flex-direction:column!important; gap:5px!important; box-shadow:0 4px 18px rgba(8,20,12,.1)!important; cursor:pointer!important; }
  .mobile-nav-toggle span { display:block!important; width:21px!important; height:2px!important; background:currentColor!important; border-radius:999px!important; transition:transform 180ms ease,opacity 180ms ease!important; }
  .site-header.nav-open .mobile-nav-toggle span:nth-child(1) { transform:translateY(7px) rotate(45deg)!important; }
  .site-header.nav-open .mobile-nav-toggle span:nth-child(2) { opacity:0!important; }
  .site-header.nav-open .mobile-nav-toggle span:nth-child(3) { transform:translateY(-7px) rotate(-45deg)!important; }
  .site-header .main-nav { display:none!important; }
  .site-header.nav-open .main-nav { display:block!important; position:fixed!important; top:max(1rem,env(safe-area-inset-top))!important; right:1rem!important; left:1rem!important; z-index:10000!important; width:auto!important; max-width:none!important; max-height:calc(100dvh - 2rem)!important; margin:0!important; padding:4.8rem 1.25rem 1.25rem!important; overflow-x:hidden!important; overflow-y:auto!important; background:#f4efe5!important; color:#18301f!important; border:1px solid rgba(24,48,31,.14)!important; border-radius:1rem!important; box-shadow:0 18px 48px rgba(8,20,12,.22)!important; letter-spacing:0!important; }
  .site-header.nav-open .main-nav>.nav-dropdown,.site-header.nav-open .main-nav>a { display:block!important; width:100%!important; margin:0!important; padding:0!important; border-top:1px solid rgba(24,48,31,.13)!important; }
  .site-header.nav-open .main-nav>.nav-dropdown:first-child { border-top:0!important; }
  .site-header.nav-open .main-nav>a,.site-header.nav-open .main-nav>.nav-dropdown>summary { display:flex!important; align-items:center!important; justify-content:space-between!important; width:100%!important; min-height:58px!important; padding:.95rem .35rem!important; color:#18301f!important; font-family:var(--font-body)!important; font-size:1rem!important; line-height:1.25!important; letter-spacing:.08em!important; text-decoration:none!important; text-transform:uppercase!important; border:0!important; background:transparent!important; cursor:pointer!important; }
  .site-header.nav-open .main-nav>.nav-dropdown>summary::after { content:'⌄'!important; display:block!important; margin-left:1rem!important; font-size:1.1rem!important; line-height:1!important; transform:rotate(0)!important; transition:transform 180ms ease!important; }
  .site-header.nav-open .main-nav>.nav-dropdown[open]>summary::after { transform:rotate(180deg)!important; }
  .site-header.nav-open .main-nav .submenu { position:static!important; top:auto!important; right:auto!important; left:auto!important; display:none!important; width:100%!important; min-width:0!important; max-width:none!important; margin:0!important; padding:0 0 .75rem!important; background:transparent!important; border:0!important; border-radius:0!important; box-shadow:none!important; opacity:1!important; visibility:visible!important; transform:none!important; pointer-events:auto!important; }
  .site-header.nav-open .main-nav .nav-dropdown[open]>.submenu { display:block!important; }
  .site-header.nav-open .main-nav .submenu::before { display:none!important; }
  .site-header.nav-open .main-nav .submenu a { display:block!important; width:100%!important; padding:.72rem 1rem!important; color:#18301f!important; font-family:var(--font-body)!important; font-size:.96rem!important; line-height:1.35!important; letter-spacing:0!important; text-transform:none!important; text-decoration:none!important; white-space:normal!important; }
  .site-header.nav-open .main-nav .active,.site-header.nav-open .main-nav [aria-current='page'] { border-bottom:0!important; font-weight:600!important; }
}
/* END FLO MOBILE NAV V2 */
'''
css_path.write_text(css)
