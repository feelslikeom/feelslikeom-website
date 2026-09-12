import { promises as fs } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const site = 'https://feelslikeomtravel.com';
const defaultImage = '/hero-river.JPG';

const pages = {
  '/': {
    title: 'Feels Like Om',
    description: 'Community-led, place-based immersions in Sikkim for people seeking slowness, connection, reflection and a deeper relationship with land.',
    image: defaultImage,
  },
  '/about/our-stories': {
    title: 'Our Stories | Feels Like Om',
    description: 'The people, experiences and relationships that shaped Feels Like Om and our way of learning from Sikkim, its communities and its land.',
    image: '/zi-hui.JPG',
  },
  '/about/getting-to-sikkim': {
    title: 'Getting to Sikkim | Feels Like Om',
    description: 'Practical guidance for travelling to Sikkim, including arrival routes, transfers and what to expect before beginning your journey with Feels Like Om.',
    image: defaultImage,
  },
  '/about/visa-and-permits': {
    title: 'Visa and Permits | Feels Like Om',
    description: 'A simple guide to the visas and permits you may need when travelling to Sikkim, with key information for international visitors.',
    image: defaultImage,
  },
  '/about/life-on-sikkim-time': {
    title: 'Life on Sikkim time | Feels Like Om',
    description: 'What it means to slow down, adapt to the rhythms of Sikkim and experience daily life with more patience, presence and openness.',
    image: defaultImage,
  },
  '/journeys': {
    title: 'Journeys | Feels Like Om',
    description: 'Explore Feels Like Om journeys in Sikkim, including field immersions, silent retreats and place-based experiences rooted in community and land.',
    image: defaultImage,
  },
  '/journeys/the-flagship': {
    title: 'The Flagship | Feels Like Om',
    description: 'The Flagship — a small-group field immersion in West Sikkim with community learning, reflection and a 4D3N mountain trek.',
    image: '/flagship-hero.jpg',
  },
  '/journeys/to-be-free': {
    title: 'To Be Free | Feels Like Om',
    description: 'A small-group silent meditation retreat in West Sikkim for people seeking stillness, reflection and a deeper relationship with themselves.',
    image: '/to-be-free-hero.jpg',
  },
  '/reflections': {
    title: 'Reflections | Feels Like Om',
    description: 'Reflections from past Feels Like Om participants on Sikkim, community, stillness, relationships and what they discovered along the way.',
    image: defaultImage,
  },
  '/contact': {
    title: 'Contact | Feels Like Om',
    description: 'Get in touch with Feels Like Om to ask about upcoming journeys, retreats, availability, collaborations or travelling with us in Sikkim.',
    image: defaultImage,
  },
};

const escapeAttr = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function htmlPathForRoute(route) {
  if (route === '/') return new URL('index.html', dist);
  return new URL(`${route.slice(1)}/index.html`, dist);
}

function stripManagedSeo(html) {
  return html
    .replace(/\s*<link\s+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/\s*<link\s+rel=["']icon["'][^>]*>/gi, '')
    .replace(/\s*<link\s+rel=["']apple-touch-icon["'][^>]*>/gi, '')
    .replace(/\s*<meta\s+(?:property|name)=["'](?:og:[^"']+|twitter:[^"']+)["'][^>]*>/gi, '');
}

function replaceMetaDescription(html, description) {
  const tag = `<meta name="description" content="${escapeAttr(description)}" />`;
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']description["'][^>]*>/i, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function rewriteInternalLinks(html) {
  return html
    .replaceAll('href="/about/our-story"', 'href="/about/our-stories"')
    .replaceAll("href='/about/our-story'", "href='/about/our-stories'")
    .replaceAll('href="/journeys/how-to-embrace-suffering"', 'href="/journeys/to-be-free"')
    .replaceAll("href='/journeys/how-to-embrace-suffering'", "href='/journeys/to-be-free'");
}

for (const [route, meta] of Object.entries(pages)) {
  const file = htmlPathForRoute(route);
  let html = await fs.readFile(file, 'utf8');
  html = stripManagedSeo(html);
  html = replaceMetaDescription(html, meta.description);
  html = rewriteInternalLinks(html);

  const canonical = `${site}${route === '/' ? '/' : route}`;
  const image = `${site}${meta.image}`;
  const tags = [
    `<link rel="canonical" href="${canonical}" />`,
    '<link rel="icon" type="image/png" href="/Logo-Circle.png" />',
    '<link rel="apple-touch-icon" href="/Logo-Circle.png" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Feels Like Om" />',
    `<meta property="og:title" content="${escapeAttr(meta.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ].map((tag) => `    ${tag}`).join('\n');

  html = html.replace('</head>', `${tags}\n  </head>`);
  await fs.writeFile(file, html);
}

// Internal-only preview route: remove it from the production build entirely.
await fs.rm(new URL('journeys/the-flagship-hero-preview/', dist), { recursive: true, force: true });

// Redirect-only source routes are handled by Netlify's _redirects file; remove any built HTML copies.
await fs.rm(new URL('about/our-story/', dist), { recursive: true, force: true });
await fs.rm(new URL('journeys/how-to-embrace-suffering/', dist), { recursive: true, force: true });

console.log('SEO postbuild complete: canonical, social metadata, favicon links, clean internal URLs, and preview cleanup applied.');
