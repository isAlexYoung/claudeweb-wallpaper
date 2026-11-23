'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const presetsBundle = require('../shared/presets.json');
const { MAX_UPLOAD_BYTES, createWallpaperStorage } = require('./storage.cjs');
const { createWsBroadcaster } = require('./ws.cjs');

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function readBodyBuffer(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let total = 0;
    let settled = false;

    req.on('data', (chunk) => {
      if (settled) return;
      total += chunk.length;
      if (total > maxBytes) {
        settled = true;
        const err = new Error(`Request payload exceeds ${Math.round(maxBytes / (1024 * 1024))} MiB limit`);
        err.statusCode = 413;
        req.resume();
        reject(err);
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (settled) return;
      settled = true;
      resolve(Buffer.concat(chunks));
    });
    req.on('error', (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });
  });
}

function serveMediaWithRange(req, res, file) {
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('ETag', file.etag);
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.headers['if-none-match'] === file.etag) {
    res.writeHead(304);
    res.end();
    return;
  }

  const rangeHeader = req.headers.range;
  if (typeof rangeHeader === 'string' && rangeHeader.startsWith('bytes=')) {
    const [startRaw, endRaw] = rangeHeader.slice('bytes='.length).split('-');
    let start = startRaw ? Number.parseInt(startRaw, 10) : NaN;
    let end = endRaw ? Number.parseInt(endRaw, 10) : file.size - 1;

    if (Number.isNaN(start) && !Number.isNaN(end)) {
      start = Math.max(0, file.size - end);
      end = file.size - 1;
    } else {
      if (Number.isNaN(start)) start = 0;
      if (Number.isNaN(end) || end >= file.size) end = file.size - 1;
    }

    if (start < 0 || start >= file.size || end < start) {
      res.writeHead(416, { 'Content-Range': `bytes */${file.size}` });
      res.end();
      return;
    }

    const chunkLength = end - start + 1;
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${file.size}`,
      'Content-Length': String(chunkLength),
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(file.filePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, { 'Content-Length': String(file.size) });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(file.filePath).pipe(res);
}

function createWallpaperServer(options = {}) {
  const storage = createWallpaperStorage({
    dataDir: options.dataDir,
    presets: presetsBundle.presets,
  });
  const ws = createWsBroadcaster();

  const server = http.createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url || '/', 'http://127.0.0.1');
      const pathname = parsedUrl.pathname.replace(/\/+$/, '') || '/';
      const method = (req.method || 'GET').toUpperCase();

      if (method === 'GET' && pathname === '/health') {
        sendJson(res, 200, { ok: true, plugin: 'claudeweb-wallpaper', schema: 1 });
        return;
      }

      if (method === 'GET' && pathname === '/config') {
        sendJson(res, 200, {
          config: storage.readConfig(),
          items: storage.readCatalog(),
          presets: presetsBundle.presets,
          stats: storage.getStats(),
          wallpaperEngine: presetsBundle.wallpaperEngine,
        });
        return;
      }

      if (method === 'PUT' && pathname === '/config') {
        const raw = await readBodyBuffer(req, 1024 * 1024);
        const body = raw.length ? JSON.parse(raw.toString('utf8')) : {};
        const payload = body.config && typeof body.config === 'object' ? body.config : body;
        const expectedRevision = typeof body.expectedRevision === 'number' ? body.expectedRevision : undefined;
        const force = body.force === true;
        const saved = storage.updateConfig(payload, { expectedRevision, force });
        ws.broadcast({ type: 'config_updated', revision: saved.revision, config: saved });
        sendJson(res, 200, { config: saved });
        return;
      }

      if (method === 'POST' && pathname === '/config/export') {
        sendJson(res, 200, {
          exportedAt: new Date().toISOString(),
          plugin: 'claudeweb-wallpaper',
          config: storage.readConfig(),
        });
        return;
      }

      if (method === 'POST' && pathname === '/config/import') {
        const raw = await readBodyBuffer(req, 1024 * 1024);
        const body = raw.length ? JSON.parse(raw.toString('utf8')) : {};
        const incoming = body.config && typeof body.config === 'object' ? body.config : body;
        const saved = storage.updateConfig(incoming, { force: true });
        ws.broadcast({ type: 'config_updated', revision: saved.revision, config: saved });
        sendJson(res, 200, { config: saved });
        return;
      }

      if (method === 'POST' && pathname === '/wallpapers/upload') {
        const buf = await readBodyBuffer(req, MAX_UPLOAD_BYTES);
        const rawHeaderName = req.headers['x-file-name'];
        let originalName = '';
        if (typeof rawHeaderName === 'string' && rawHeaderName) {
          try { originalName = decodeURIComponent(rawHeaderName); } catch { originalName = rawHeaderName; }
        }
        const posterOf = parsedUrl.searchParams.get('posterOf') || undefined;
        const rawTone = typeof req.headers['x-media-tone'] === 'string' ? req.headers['x-media-tone'].trim().toLowerCase() : '';
        const tone = rawTone === 'light' || rawTone === 'dark' ? rawTone : undefined;
        const item = storage.storeUpload(buf, { originalName, posterOf, tone });
        ws.broadcast({ type: 'catalog_updated', itemId: item.id });
        sendJson(res, 201, { item, items: storage.readCatalog(), stats: storage.getStats() });
        return;
      }

      const deleteMatch = pathname.match(/^\/wallpapers\/([a-f0-9]{16,40})$/);
      if (method === 'DELETE' && deleteMatch) {
        const result = storage.deleteItem(deleteMatch[1]);
        ws.broadcast({ type: 'config_updated', revision: result.config.revision, config: result.config });
        ws.broadcast({ type: 'catalog_updated', removedId: result.removed.id });
        sendJson(res, 200, {
          removed: result.removed,
          config: result.config,
          items: storage.readCatalog(),
          stats: storage.getStats(),
        });
        return;
      }

      const mediaMatch = pathname.match(/^\/media\/([a-f0-9]{16,40})(\/poster)?$/);
      if ((method === 'GET' || method === 'HEAD') && mediaMatch) {
        const file = storage.resolveMediaFile(mediaMatch[1], Boolean(mediaMatch[2]));
        if (!file) {
          sendJson(res, 404, { error: 'Wallpaper media not found' });
          return;
        }
        serveMediaWithRange(req, res, file);
        return;
      }

      if (method === 'GET' && pathname === '/sources/wallpaper-engine/status') {
        sendJson(res, 200, presetsBundle.wallpaperEngine);
        return;
      }

      sendJson(res, 404, { error: 'Not found' });
    } catch (err) {
      const status = typeof err?.statusCode === 'number' ? err.statusCode : 500;
      const body = {
        error: err instanceof Error ? err.message : 'Internal plugin error',
        ...(err?.code ? { code: err.code } : {}),
        ...(err?.current ? { current: err.current } : {}),
      };
      sendJson(res, status, body);
    }
  });

  ws.attach(server);

  return {
    server,
    storage,
    close() {
      ws.closeAll();
      server.closeAllConnections?.();
      return new Promise((resolve) => server.close(() => resolve()));
    },
  };
}

if (require.main === module) {
  const instance = createWallpaperServer();
  instance.server.listen(0, '127.0.0.1', () => {
    const addr = instance.server.address();
    console.log(JSON.stringify({ ready: true, port: addr.port }));
  });
  const shutdown = () => {
    void instance.close().finally(() => process.exit(0));
  };
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

module.exports = { createWallpaperServer };
