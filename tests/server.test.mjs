import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import zlib from 'node:zlib';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createWallpaperServer } = require('../dist/server.cjs');

/** Minimal pure-Node ZIP builder for testing STORE/DEFLATE, symlinks, and traversal payloads. */
function buildTestZip(entries) {
  const localChunks = [];
  const cdChunks = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, 'utf8');
    const rawBuf = Buffer.isBuffer(entry.data) ? entry.data : Buffer.from(entry.data, 'utf8');
    const method = entry.deflate ? 8 : 0;
    const compBuf = method === 8 ? zlib.deflateRawSync(rawBuf) : rawBuf;

    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4);
    lfh.writeUInt16LE(0, 6);
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt32LE(0, 14); // crc32 ignored by reader
    lfh.writeUInt32LE(compBuf.length, 18);
    lfh.writeUInt32LE(rawBuf.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);

    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(entry.symlink ? (3 << 8) | 20 : 20, 4);
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0, 8);
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt32LE(0, 16);
    cdh.writeUInt32LE(compBuf.length, 20);
    cdh.writeUInt32LE(rawBuf.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30);
    cdh.writeUInt16LE(0, 32);
    cdh.writeUInt32LE(entry.symlink ? ((0o120777 << 16) >>> 0) : 0, 38);
    cdh.writeUInt32LE(offset, 42);

    localChunks.push(lfh, nameBuf, compBuf);
    cdChunks.push(cdh, nameBuf);
    offset += lfh.length + nameBuf.length + compBuf.length;
  }

  const cdBuf = Buffer.concat(cdChunks);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cdBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localChunks, cdBuf, eocd]);
}

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
    assert.equal(initial.config.glassEngine, 2);
    assert.equal(initial.config.revision, 1);
    assert.equal(initial.config.themes.dark.surfaceOpacity, 0.36);
    assert.equal(initial.config.themes.dark.glassBlurPx, 20);
    assert.equal(initial.config.themes.dark.glassTone, 'auto');
    assert.ok(initial.presets.length >= 6);
    assert.ok(initial.presets.every((p) => p.tone === 'dark' || p.tone === 'light'));

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

    // Attach PNG poster to video with detected luminance tone
    const posterRes = await fetch(`${srv.baseUrl}/wallpapers/upload?posterOf=${videoData.item.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/png', 'X-Media-Tone': 'dark' },
      body: PNG_SAMPLE,
    });
    assert.equal(posterRes.status, 201);
    const posterData = await posterRes.json();
    assert.equal(posterData.item.tone, 'dark');

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

test('migrates v1.0.0 untouched opaque defaults (0.84/16) to v1.1.0 translucent glass while preserving custom opacity', async () => {
  const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cw-wp-migrate-'));
  try {
    fs.writeFileSync(
      path.join(dataDir, 'config.json'),
      JSON.stringify({
        schema: 1,
        revision: 4,
        scope: 'workspace',
        perTheme: true,
        shared: { mediaType: 'preset', presetId: 'warm-sand', surfaceOpacity: 0.84, glassBlurPx: 16 },
        themes: {
          warm: { mediaType: 'preset', presetId: 'dark-aurora', surfaceOpacity: 0.84, glassBlurPx: 16 },
          light: { mediaType: 'preset', presetId: 'light-mist', surfaceOpacity: 0.52, glassBlurPx: 12 },
          dark: { mediaType: 'preset', presetId: 'dark-ember', surfaceOpacity: 0.84, glassBlurPx: 16 },
        },
      }),
    );

    const instance = createWallpaperServer({ dataDir });
    await new Promise((resolve) => instance.server.listen(0, '127.0.0.1', resolve));
    const { port } = instance.server.address();
    try {
      const res = await fetch(`http://127.0.0.1:${port}/config`);
      assert.equal(res.status, 200);
      const body = await res.json();
      assert.equal(body.config.glassEngine, 2);
      assert.equal(body.config.themes.warm.surfaceOpacity, 0.36);
      assert.equal(body.config.themes.warm.glassBlurPx, 20);
      // User-customized opacity below 0.80 stays untouched
      assert.equal(body.config.themes.light.surfaceOpacity, 0.52);
      assert.equal(body.config.themes.light.glassBlurPx, 12);
      assert.equal(fs.existsSync(path.join(dataDir, 'config.v1-glass.bak.json')), true);
    } finally {
      await instance.close();
    }
  } finally {
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
});

test('supports chunked streaming uploads, query-param metadata, offset checks, and abort cleanup', async () => {
  const srv = await startTempServer();
  try {
    const bigMp4 = Buffer.concat([MP4_SAMPLE, Buffer.alloc(1024, 0x42)]);

    // 1. Query-param upload (matching ClaudeWeb RPC proxy which forwards query string)
    const qRes = await fetch(
      `${srv.baseUrl}/wallpapers/upload?name=${encodeURIComponent('Neon Drift')}&tone=dark&source=wallpaper-engine&workshopId=2987654321`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'video/mp4' },
        body: MP4_SAMPLE,
      },
    );
    assert.equal(qRes.status, 201);
    const qData = await qRes.json();
    assert.equal(qData.item.name, 'Neon Drift');
    assert.equal(qData.item.tone, 'dark');
    assert.equal(qData.item.source, 'wallpaper-engine');
    assert.equal(qData.item.workshopId, '2987654321');

    // 2. Multi-chunk upload init -> chunk 1 -> bad offset 409 -> chunk 2 -> complete
    const initRes = await fetch(`${srv.baseUrl}/wallpapers/upload/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode: 'media',
        fileName: '4K Skyline',
        totalBytes: bigMp4.length,
        tone: 'dark',
        source: 'wallpaper-engine',
        workshopId: '1122334455',
      }),
    });
    assert.equal(initRes.status, 201);
    const { uploadId } = await initRes.json();

    const mid = Math.floor(bigMp4.length / 2);
    const c1 = await fetch(`${srv.baseUrl}/wallpapers/upload/${uploadId}/chunk?offset=0`, {
      method: 'PUT',
      body: bigMp4.subarray(0, mid),
    });
    assert.equal(c1.status, 200);

    const badOffset = await fetch(`${srv.baseUrl}/wallpapers/upload/${uploadId}/chunk?offset=0`, {
      method: 'PUT',
      body: bigMp4.subarray(mid),
    });
    assert.equal(badOffset.status, 409);

    const c2 = await fetch(`${srv.baseUrl}/wallpapers/upload/${uploadId}/chunk?offset=${mid}`, {
      method: 'PUT',
      body: bigMp4.subarray(mid),
    });
    assert.equal(c2.status, 200);

    const doneRes = await fetch(`${srv.baseUrl}/wallpapers/upload/${uploadId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(doneRes.status, 201);
    const doneData = await doneRes.json();
    assert.equal(doneData.item.name, '4K Skyline');
    assert.equal(doneData.item.bytes, bigMp4.length);
    assert.equal(doneData.item.source, 'wallpaper-engine');

    // 3. Aborted upload deletes its temporary .part file cleanly & supports up to 512 MiB
    const bigInit = await fetch(`${srv.baseUrl}/wallpapers/upload/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'media', fileName: '4k60-350mb.mp4', totalBytes: 350 * 1024 * 1024 }),
    });
    assert.equal(bigInit.status, 201);
    const { uploadId: cancelId, maxUploadBytes } = await bigInit.json();
    assert.equal(maxUploadBytes, 512 * 1024 * 1024);

    const tooBigInit = await fetch(`${srv.baseUrl}/wallpapers/upload/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'media', fileName: 'huge-600mb.mp4', totalBytes: 600 * 1024 * 1024 }),
    });
    assert.equal(tooBigInit.status, 413);

    const delRes = await fetch(`${srv.baseUrl}/wallpapers/upload/${cancelId}`, { method: 'DELETE' });
    assert.equal(delRes.status, 200);
    const tmpFiles = fs.readdirSync(path.join(srv.dataDir, 'tmp-uploads'));
    assert.equal(tmpFiles.length, 0);
  } finally {
    await srv.stop();
  }
});

test('imports Wallpaper Engine Video .zip packages securely and rejects scene/web/traversal/symlink/invalid containers', async () => {
  const srv = await startTempServer();
  try {
    // Valid WE Video zip (wrapped in a workshop ID folder, deflated project.json + stored MP4 + preview PNG)
    const validZip = buildTestZip([
      {
        name: '2849123456/project.json',
        deflate: true,
        data: JSON.stringify({
          title: 'Crimson Roadster 4K',
          type: 'Video',
          file: 'videos\\roadster.mp4',
          preview: 'preview.png',
          workshopid: '2849123456',
          tags: ['Car', 'Dark'],
        }),
      },
      {
        name: '2849123456/videos/roadster.mp4',
        deflate: false,
        data: MP4_SAMPLE,
      },
      {
        name: '2849123456/preview.png',
        deflate: true,
        data: PNG_SAMPLE,
      },
    ]);

    // Upload via chunked we-zip flow
    const initRes = await fetch(`${srv.baseUrl}/wallpapers/upload/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'we-zip', fileName: 'roadster.zip', totalBytes: validZip.length }),
    });
    assert.equal(initRes.status, 201);
    const { uploadId } = await initRes.json();

    const putChunk = await fetch(`${srv.baseUrl}/wallpapers/upload/${uploadId}/chunk?offset=0`, {
      method: 'PUT',
      body: validZip,
    });
    assert.equal(putChunk.status, 200);

    const compRes = await fetch(`${srv.baseUrl}/wallpapers/upload/${uploadId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.equal(compRes.status, 201);
    const compData = await compRes.json();
    assert.equal(compData.item.name, 'Crimson Roadster 4K');
    assert.equal(compData.item.source, 'wallpaper-engine');
    assert.equal(compData.item.workshopId, '2849123456');
    assert.equal(compData.item.kind, 'video');
    assert.ok(compData.item.posterFileName, 'preview.png should be attached as poster');
    assert.deepEqual(compData.item.tags, ['Car', 'Dark']);

    // Rejects Scene package with 415 WE_UNSUPPORTED_TYPE
    const sceneZip = buildTestZip([
      { name: 'project.json', data: JSON.stringify({ title: 'My Scene', type: 'scene', file: 'scene.json' }) },
      { name: 'scene.json', data: '{}' },
    ]);
    const sceneRes = await fetch(`${srv.baseUrl}/sources/wallpaper-engine/import-zip`, {
      method: 'POST',
      body: sceneZip,
    });
    assert.equal(sceneRes.status, 415);
    assert.equal((await sceneRes.json()).code, 'WE_UNSUPPORTED_TYPE');

    // Rejects Web package with 415 WE_UNSUPPORTED_TYPE
    const webZip = buildTestZip([
      { name: 'project.json', data: JSON.stringify({ title: 'Web Clock', type: 'web', file: 'index.html' }) },
      { name: 'index.html', data: '<html></html>' },
    ]);
    const webRes = await fetch(`${srv.baseUrl}/sources/wallpaper-engine/import-zip`, {
      method: 'POST',
      body: webZip,
    });
    assert.equal(webRes.status, 415);
    assert.equal((await webRes.json()).code, 'WE_UNSUPPORTED_TYPE');

    // Rejects path traversal inside ZIP
    const traversalZip = buildTestZip([
      { name: '../escape.mp4', data: MP4_SAMPLE },
      { name: 'project.json', data: JSON.stringify({ title: 'Evil', type: 'video', file: '../escape.mp4' }) },
    ]);
    const travRes = await fetch(`${srv.baseUrl}/sources/wallpaper-engine/import-zip`, {
      method: 'POST',
      body: traversalZip,
    });
    assert.equal(travRes.status, 400);
    assert.equal((await travRes.json()).code, 'UNSAFE_ZIP_PATH');

    // Rejects Unix symlink inside ZIP
    const symlinkZip = buildTestZip([
      { name: 'project.json', data: JSON.stringify({ title: 'Sym', type: 'video', file: 'link.mp4' }) },
      { name: 'link.mp4', data: '/etc/passwd', symlink: true },
    ]);
    const symRes = await fetch(`${srv.baseUrl}/sources/wallpaper-engine/import-zip`, {
      method: 'POST',
      body: symlinkZip,
    });
    assert.equal(symRes.status, 400);
    assert.equal((await symRes.json()).code, 'UNSAFE_ZIP_SYMLINK');

    // Rejects unsupported video container (fake MKV/text)
    const fakeMkvZip = buildTestZip([
      { name: 'project.json', data: JSON.stringify({ title: 'Bad Codec', type: 'video', file: 'movie.mkv' }) },
      { name: 'movie.mkv', data: 'not a real mp4 or webm container payload' },
    ]);
    const mkvRes = await fetch(`${srv.baseUrl}/sources/wallpaper-engine/import-zip`, {
      method: 'POST',
      body: fakeMkvZip,
    });
    assert.equal(mkvRes.status, 415);

    // Ensure no leftover temporary extraction directories or zip parts remain
    const leftover = fs.readdirSync(path.join(srv.dataDir, 'tmp-uploads'));
    assert.equal(leftover.length, 0);
  } finally {
    await srv.stop();
  }
});
