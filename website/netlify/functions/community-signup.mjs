const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }

  const email = String(payload?.email || '').trim().toLowerCase();
  const source = String(payload?.source || '/').trim().slice(0, 200);

  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return Response.json({ ok: false, error: 'Please enter a valid email address' }, { status: 400 });
  }

  const notionToken = Netlify.env.get('NOTION_API_KEY');
  const databaseId = Netlify.env.get('NOTION_SIGNUPS_DATABASE_ID');

  if (!notionToken || !databaseId) {
    console.error('Community signup is missing Notion configuration');
    return Response.json({ ok: false, error: 'Signup service unavailable' }, { status: 503 });
  }

  const joined = new Date().toISOString();

  const notionResponse = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${notionToken}`,
      'content-type': 'application/json',
      'notion-version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Email: {
          title: [{ type: 'text', text: { content: email } }],
        },
        Joined: {
          date: { start: joined },
        },
        Source: {
          rich_text: [{ type: 'text', text: { content: source } }],
        },
      },
    }),
  });

  if (!notionResponse.ok) {
    const errorText = await notionResponse.text();
    console.error('Notion signup error', notionResponse.status, errorText);
    return Response.json({ ok: false, error: 'Could not save signup' }, { status: 502 });
  }

  return Response.json({ ok: true }, { status: 201 });
};
