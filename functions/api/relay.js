const ALLOWED_PATHS = new Set(['/models', '/chat/completions']);
const MAX_BODY = 64 * 1024;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer'
    }
  });
}

function validTarget(value) {
  let url;
  try { url = new URL(value); } catch { return false; }
  if (url.protocol !== 'https:' || url.username || url.password || (url.port && url.port !== '443')) return false;
  const host = url.hostname.toLowerCase();
  return !(
    host === 'localhost' || host.endsWith('.localhost') || host === '0.0.0.0' || host === '::1' ||
    /^127\./.test(host) || /^10\./.test(host) || /^192\.168\./.test(host) || /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host)
  );
}

export async function onRequestPost({ request }) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY) return json({ error: 'Payload terlalu besar' }, 413);

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'API key tidak tersedia' }, 401);

  let input;
  try { input = await request.json(); } catch { return json({ error: 'JSON tidak valid' }, 400); }
  if (!validTarget(input.baseUrl) || !ALLOWED_PATHS.has(input.path)) return json({ error: 'Target tidak diizinkan' }, 400);

  const target = `${input.baseUrl.replace(/\/$/, '')}${input.path}`;
  const init = {
    method: input.path === '/models' ? 'GET' : 'POST',
    headers: { Authorization: authorization, Accept: 'application/json' },
    redirect: 'manual'
  };
  if (init.method === 'POST') {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(input.payload || {});
  }

  try {
    const upstream = await fetch(target, init);
    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') || 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer'
      }
    });
  } catch (error) {
    console.error('relay_fetch_failed', { host: new URL(target).hostname, name: error?.name, message: error?.message });
    return json({ error: 'Provider tidak dapat dijangkau' }, 502);
  }
}

export function onRequest() {
  return json({ error: 'Method tidak diizinkan' }, 405);
}
