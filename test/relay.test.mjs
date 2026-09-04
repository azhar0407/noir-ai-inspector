import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequestPost } from '../functions/api/relay.js';

function request(body, key = 'official-test-key') {
  return new Request('https://noir.example/api/relay', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
}

test('mode anthropic hanya meneruskan ke API resmi dengan header resmi', async () => {
  const originalFetch = globalThis.fetch;
  let captured;
  globalThis.fetch = async (url, init) => {
    captured = { url, init };
    return new Response(JSON.stringify({ data: [{ id: 'claude-test' }] }), { status: 200 });
  };
  try {
    const response = await onRequestPost({ request: request({ mode: 'anthropic', path: '/models' }) });
    assert.equal(response.status, 200);
    assert.equal(captured.url, 'https://api.anthropic.com/v1/models');
    assert.equal(captured.init.headers['x-api-key'], 'official-test-key');
    assert.equal(captured.init.headers['anthropic-version'], '2023-06-01');
    assert.equal(captured.init.headers.Authorization, undefined);
  } finally { globalThis.fetch = originalFetch; }
});

test('mode anthropic menolak path selain models dan messages', async () => {
  const response = await onRequestPost({ request: request({ mode: 'anthropic', path: '/admin' }) });
  assert.equal(response.status, 400);
});

test('relay menolak mode arbitrer yang dapat membypass validasi target', async () => {
  const response = await onRequestPost({ request: request({ mode: 'arbitrer', path: '/models' }) });
  assert.equal(response.status, 400);
});
