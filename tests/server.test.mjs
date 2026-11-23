import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createWallpaperServer } = require('../dist/server.cjs');

const PNG_SAMPLE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
  0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
]);

const MP4_SAMPLE = Buffer.concat([
  Buffer.from([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x6d, 0x70, 0x34, 0x32, 0x00, 0x00, 0x00, 0x00]),
  Buffer.from('0123456789abcdef0123456789abcdef'),
]);

async function startTempServer() {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cw-wp-test-'));
  const instance = createWallpaperServer({ dataDir });
  await new Promise((resolve) => instance.server.listen(0, '127.0.0.1', resolve));
  const { port } = instance.server.address();
  return {
    dataDir,
    baseUrl: `http://127.0.0.1:${port}`,
    async stop() {
      await instance.close();
      fs.rmSync(dataDir, { recursive: true, force: true });
    },
  };
}

test('serves default config, updates with optimistic revision locking, and rejects stale revisions with 409', async () => {
  const srv = await startTempServer();
  try {
    const initialRes = await fetch(`${srv.baseUrl}/config`);
    assert.equal(initialRes.status, 200);
    const initial = await initialRes.json();
    assert.equal(initial.config.schema, 1);
    assert.equal(initial.config.revision, 1);
    assert.ok(initial.presets.length >= 6);

    // Save revision 1 -> 2
    const save1 = await fetch(`${srv.baseUrl}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedRevision: 1,
        config: { ...initial.config, scope: 'chat' },
      }),
    });
    assert.equal(save1.status, 200);
    const saved1 = await save1.json();
    assert.equal(saved1.config.revision, 2);
    assert.equal(saved1.config.scope, 'chat');

    // Stale client still sending expectedRevision: 1 gets 409 REVISION_CONFLICT
    const stale = await fetch(`${srv.baseUrl}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedRevision: 1,
        config: { ...initial.config, scope: 'none' },
      }),
    });
    assert.equal(stale.status, 409);
    const staleBody = await stale.json();
    assert.equal(staleBody.code, 'REVISION_CONFLICT');
    assert.equal(staleBody.current.revision, 2);

    // Force overwrite succeeds
    const forced = await fetch(`${srv.baseUrl}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        expectedRevision: 1,
        force: true,
        config: { ...initial.config, scope: 'workspace' },
      }),
    });
    assert.equal(forced.status, 200);
    assert.equal((await forced.json()).config.revision, 3);
  } finally {
    await srv.stop();
  }
});

test('uploads image/video with magic-byte sniffing, rejects SVG, streams Range/206 + ETag/304, and cleans up on delete', async () => {
  const srv = await startTempServer();
  try {
    // Rejects SVG
    const svgRes = await fetch(`${srv.baseUrl}/wallpapers/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/svg+xml', 'X-File-Name': 'evil.svg' },
      body: '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
    });
    assert.equal(svgRes.status, 415);

    // Uploads MP4 video
    const videoRes = await fetch(`${srv.baseUrl}/wallpapers/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'video/mp4', 'X-File-Name': 'loop.mp4' },
      body: MP4_SAMPLE,
    });
    assert.equal(videoRes.status, 201);
    const videoData = await videoRes.json();
    assert.equal(videoData.item.kind, 'video');
    assert.equal(videoData.item.mimeType, 'video/mp4');

    // Attach PNG poster to video
    const posterRes = await fetch(`${srv.baseUrl}/wallpapers/upload?posterOf=${videoData.item.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/png' },
      body: PNG_SAMPLE,
    });
    assert.equal(posterRes.status, 201);

    // Stream video with Range/206
    const rangeRes = await fetch(`${srv.baseUrl}/media/${videoData.item.id}`, {
      headers: { Range: 'bytes=0-15' },
    });
    assert.equal(rangeRes.status, 206);
    assert.equal(rangeRes.headers.get('content-type'), 'video/mp4');
    assert.equal(rangeRes.headers.get('x-content-type-options'), 'nosniff');
    assert.equal((await rangeRes.arrayBuffer()).byteLength, 16);

    // Stream poster with ETag/304
    const p1 = await fetch(`${srv.baseUrl}/media/${videoData.item.id}/poster`);
    assert.equal(p1.status, 200);
    assert.equal(p1.headers.get('content-type'), 'image/png');
    const etag = p1.headers.get('etag');
    const p2 = await fetch(`${srv.baseUrl}/media/${videoData.item.id}/poster`, {
      headers: { 'If-None-Match': etag },
    });
    assert.equal(p2.status, 304);

    // Delete item removes media & poster cleanly
    const delRes = await fetch(`${srv.baseUrl}/wallpapers/${videoData.item.id}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);
    const afterDel = await fetch(`${srv.baseUrl}/media/${videoData.item.id}`);
    assert.equal(afterDel.status, 404);
  } finally {
    await srv.stop();
  }
});

test('exposes Wallpaper Engine Phase 3 support contract and config export/import', async () => {
  const srv = await startTempServer();
  try {
    const weRes = await fetch(`${srv.baseUrl}/sources/wallpaper-engine/status`);
    assert.equal(weRes.status, 200);
    const we = await weRes.json();
    assert.equal(we.adapterVersion, 1);
    assert.ok(Array.isArray(we.supportedTypes) && we.supportedTypes.length > 0);
    assert.ok(Array.isArray(we.unsupportedTypes) && we.unsupportedTypes.length > 0);

    const expRes = await fetch(`${srv.baseUrl}/config/export`, { method: 'POST' });
    assert.equal(expRes.status, 200);
    const exported = await expRes.json();
    exported.config.scope = 'chat';

    const impRes = await fetch(`${srv.baseUrl}/config/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exported),
    });
    assert.equal(impRes.status, 200);
    assert.equal((await impRes.json()).config.scope, 'chat');
  } finally {
    await srv.stop();
  }
});
