from pathlib import Path
import re

targets = [
    Path('website/src/pages/index.astro'),
    Path('website/src/pages/about/our-stories.astro'),
    Path('website/src/pages/about/getting-to-sikkim.astro'),
    Path('website/src/pages/about/visa-and-permits.astro'),
    Path('website/src/pages/about/life-on-sikkim-time.astro'),
    Path('website/src/pages/journeys/the-flagship.astro'),
    Path('website/src/pages/journeys/to-be-free.astro'),
    Path('website/src/pages/reflections.astro'),
    Path('website/src/pages/contact.astro'),
]

def nav_markup(path: Path) -> str:
    s = str(path)
    about = '/about/' in s
    journeys = '/journeys/' in s
    reflections = s.endswith('/reflections.astro')
    contact = s.endswith('/contact.astro')

    about_summary = '<summary class="active">ABOUT</summary>' if about else '<summary>ABOUT</summary>'
    journeys_summary = '<summary class="active">JOURNEYS</summary>' if journeys else '<summary>JOURNEYS</summary>'
    refl_attrs = ' class="active" aria-current="page"' if reflections else ''
    contact_attrs = ' class="active" aria-current="page"' if contact else ''

    return f'''<nav class="main-nav" aria-label="Main navigation">
        <details class="nav-dropdown">
          {about_summary}
          <div class="submenu">
            <a href="/about/our-stories">Our stories</a>
            <a href="/about/getting-to-sikkim">Getting to Sikkim</a>
            <a href="/about/visa-and-permits">Visa and permits</a>
            <a href="/about/life-on-sikkim-time">Life on Sikkim time</a>
          </div>
        </details>
        <details class="nav-dropdown">
          {journeys_summary}
          <div class="submenu">
            <a href="/journeys/the-flagship">The Flagship</a>
            <a href="/journeys/how-to-embrace-suffering">To Be Free</a>
          </div>
        </details>
        <a href="/reflections"{refl_attrs}>REFLECTIONS</a>
        <a href="/contact"{contact_attrs}>CONTACT</a>
      </nav>'''

nav_re = re.compile(r'<nav class="main-nav" aria-label="Main navigation">.*?</nav>', re.S)

for path in targets:
    if not path.exists():
        raise RuntimeError(f'Missing expected page: {path}')
    text = path.read_text()
    if not nav_re.search(text):
        raise RuntimeError(f'Main navigation not found in {path}')
    text = nav_re.sub(nav_markup(path), text, count=1)

    if 'class="mobile-nav-toggle"' not in text:
        raise RuntimeError(f'Mobile nav button missing in {path}')
    if '/mobile-nav.js' not in text:
        text = text.replace('</body>', '  <script src="/mobile-nav.js" is:inline></script>\n  </body>', 1)
    path.write_text(text)

css_path = Path('website/public/type-system.css')
css = css_path.read_text()
css = css.replace('.main-nav .submenu a[href="/about/our-story"] { font-size:0!important; }\n', '')
css = css.replace('.main-nav .submenu a[href="/about/our-story"]::after { content:"Our stories"; font-family:var(--font-body); font-size:var(--type-small); }\n', '')
css_path.write_text(css)

required = [
    '/about/our-stories',
    '/about/getting-to-sikkim',
    '/about/visa-and-permits',
    '/about/life-on-sikkim-time',
    '/journeys/the-flagship',
    '/journeys/how-to-embrace-suffering',
    '/reflections',
    '/contact',
    '/mobile-nav.js',
]
forbidden = ['/journeys#feels-like-home', '/journeys#way-of-the-yaks', '>Our story<']

for path in targets:
    text = path.read_text()
    for item in required:
        if item not in text:
            raise RuntimeError(f'{item} missing from {path}')
    for item in forbidden:
        if item in text:
            raise RuntimeError(f'{item} still present in {path}')

print('Verified standard mobile navigation on all 9 public pages.')
