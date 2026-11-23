'use strict';
// Built by scripts/build.mjs — zero-dependency ClaudeWeb Plugin Host v2 backend bundle.

const __modules = {
  '../shared/presets.json': (module) => {
    module.exports = {
  "presets": [
    {
      "id": "warm-sand",
      "nameEn": "Warm Sand",
      "nameZh": "暖沙纸韵",
      "recommendedTheme": "warm",
      "tone": "light",
      "cssGradient": "radial-gradient(circle at 18% 18%, #f6e7cf 0%, transparent 55%), radial-gradient(circle at 82% 80%, #e7d5bc 0%, transparent 58%), linear-gradient(135deg, #fbf7ee 0%, #f1e7d5 52%, #e8dcc7 100%)"
    },
    {
      "id": "warm-apricot",
      "nameEn": "Apricot Dusk",
      "nameZh": "杏色微光",
      "recommendedTheme": "warm",
      "tone": "light",
      "cssGradient": "radial-gradient(circle at 80% 15%, #f4c8a6 0%, transparent 48%), radial-gradient(circle at 15% 85%, #e5d8c8 0%, transparent 54%), linear-gradient(145deg, #fcf4ea 0%, #f5e2d0 55%, #ead6c3 100%)"
    },
    {
      "id": "light-mist",
      "nameEn": "Morning Mist",
      "nameZh": "晨雾浅蓝",
      "recommendedTheme": "light",
      "tone": "light",
      "cssGradient": "radial-gradient(circle at 20% 20%, #dbeafe 0%, transparent 50%), radial-gradient(circle at 85% 75%, #e0e7ff 0%, transparent 52%), linear-gradient(135deg, #f8fafc 0%, #eff6ff 55%, #f1f5f9 100%)"
    },
    {
      "id": "light-sage",
      "nameEn": "Soft Sage",
      "nameZh": "淡青苔雾",
      "recommendedTheme": "light",
      "tone": "light",
      "cssGradient": "radial-gradient(circle at 75% 20%, #d1fae5 0%, transparent 50%), radial-gradient(circle at 20% 80%, #e0f2fe 0%, transparent 55%), linear-gradient(135deg, #f7faf8 0%, #ecfdf5 50%, #f0f9ff 100%)"
    },
    {
      "id": "dark-aurora",
      "nameEn": "Northern Aurora",
      "nameZh": "极夜极光",
      "recommendedTheme": "dark",
      "tone": "dark",
      "cssGradient": "radial-gradient(circle at 22% 20%, rgba(56, 189, 248, 0.34) 0%, transparent 48%), radial-gradient(circle at 78% 72%, rgba(99, 102, 241, 0.32) 0%, transparent 52%), linear-gradient(145deg, #090f1d 0%, #101726 52%, #151b28 100%)"
    },
    {
      "id": "dark-ember",
      "nameEn": "Obsidian Ember",
      "nameZh": "曜石余烬",
      "recommendedTheme": "dark",
      "tone": "dark",
      "cssGradient": "radial-gradient(circle at 76% 24%, rgba(220, 38, 38, 0.30) 0%, transparent 46%), radial-gradient(circle at 20% 80%, rgba(234, 88, 12, 0.22) 0%, transparent 50%), linear-gradient(140deg, #0f1014 0%, #1a1416 54%, #12141a 100%)"
    },
    {
      "id": "dark-forest",
      "nameEn": "Midnight Pine",
      "nameZh": "松林深夜",
      "recommendedTheme": "dark",
      "tone": "dark",
      "cssGradient": "radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.28) 0%, transparent 50%), radial-gradient(circle at 75% 80%, rgba(20, 184, 166, 0.24) 0%, transparent 52%), linear-gradient(150deg, #0b1411 0%, #111c18 55%, #151a19 100%)"
    },
    {
      "id": "studio-lavender",
      "nameEn": "Velvet Twilight",
      "nameZh": "暮紫绒影",
      "recommendedTheme": "dark",
      "tone": "dark",
      "cssGradient": "radial-gradient(circle at 72% 25%, rgba(192, 132, 252, 0.30) 0%, transparent 50%), radial-gradient(circle at 20% 75%, rgba(244, 114, 182, 0.22) 0%, transparent 52%), linear-gradient(135deg, #13101d 0%, #1c162b 50%, #131622 100%)"
    }
  ],
  "wallpaperEngine": {
    "adapterVersion": 1,
    "status": "planned-phase-3",
    "supportedTypes": [
      "video (MP4/WebM with project.json + preview poster)",
      "web (best-effort pure static HTML/CSS/JS inside sandboxed iframe with no external network requests)"
    ],
    "unsupportedTypes": [
      "scene (.pkg proprietary DirectX/OpenGL shader scenes)",
      "application (native executables)",
      "Wallpaper Engine proprietary JS APIs (window.wallpaperRegisterAudioListener, window.wallpaperPropertyListener custom bindings, iCUE/Chroma LED sync)"
    ]
  }
};
  },
  './storage.cjs': (module, exports, require) => {
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCHEMA_VERSION = 1;
const GLASS_ENGINE_VERSION = 2;
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MiB
const MAX_ITEMS = 64;
const THEME_KEYS = ['warm', 'light', 'dark'];
const VALID_SCOPES = new Set(['none', 'chat', 'workspace']);
const VALID_FITS = new Set(['cover', 'contain', 'center']);
const VALID_SCRIM_MODES = new Set(['auto', 'light', 'dark']);
const VALID_GLASS_TONES = new Set(['auto', 'light', 'dark']);
const VALID_MEDIA_TYPES = new Set(['none', 'preset', 'image', 'video']);
const ITEM_ID_PATTERN = /^[a-f0-9]{16,40}$/;

const MIME_TO_EXT = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/avif': '.avif',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
};

function detectSafeMediaMime(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 12) return null;
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47
    && buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a
  ) return 'image/png';
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.subarray(0, 6).toString('ascii') === 'GIF87a' || buf.subarray(0, 6).toString('ascii') === 'GIF89a') {
    return 'image/gif';
  }
  if (buf.subarray(0, 4).toString('ascii') === 'RIFF' && buf.subarray(8, 12).toString('ascii') === 'WEBP') {
    return 'image/webp';
  }
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
    return 'video/webm';
  }
  if (buf.subarray(4, 8).toString('ascii') === 'ftyp') {
    const brand = buf.subarray(8, 12).toString('ascii');
    if (brand === 'avif' || brand === 'avis') return 'image/avif';
    if (['isom', 'iso2', 'mp41', 'mp42', 'avc1', 'M4V ', 'qt  ', 'dash', 'msnv'].includes(brand)) {
      return 'video/mp4';
    }
  }
  return null;
}

function clampNumber(val, fallback, min, max) {
  const n = typeof val === 'number' ? val : Number(val);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function defaultSlot(presetId) {
  return {
    mediaType: presetId ? 'preset' : 'none',
    presetId: presetId || null,
    itemId: null,
    fit: 'cover',
    positionX: 50,
    positionY: 50,
    blurPx: 0,
    scrimOpacity: 0.22,
    scrimMode: 'auto',
    glassTone: 'auto',
    surfaceOpacity: 0.36,
    glassBlurPx: 20,
    videoPlaybackRate: 1,
    loginCardOpacity: 0.88,
  };
}

function defaultConfig() {
  return {
    schema: SCHEMA_VERSION,
    glassEngine: GLASS_ENGINE_VERSION,
    revision: 1,
    updatedAt: new Date().toISOString(),
    scope: 'workspace',
    perTheme: true,
    shared: defaultSlot('dark-aurora'),
    themes: {
      warm: defaultSlot('warm-sand'),
      light: defaultSlot('light-mist'),
      dark: defaultSlot('dark-aurora'),
    },
    login: {
      enabled: false,
      mode: 'per-theme',
    },
  };
}

function atomicWriteJson(filePath, data) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const tempPath = `${filePath}.${crypto.randomBytes(6).toString('hex')}.tmp`;
  try {
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    fs.renameSync(tempPath, filePath);
  } finally {
    try { fs.unlinkSync(tempPath); } catch { /* ignore */ }
  }
}

function sanitizeSlot(raw, fallback, presetIds, validItemIds, migrateV1Glass = false) {
  const src = raw && typeof raw === 'object' ? raw : {};
  let mediaType = VALID_MEDIA_TYPES.has(src.mediaType) ? src.mediaType : fallback.mediaType;
  let presetId = typeof src.presetId === 'string' && presetIds.has(src.presetId) ? src.presetId : null;
  let itemId = typeof src.itemId === 'string' && validItemIds.has(src.itemId) ? src.itemId : null;

  if (mediaType === 'preset' && !presetId) {
    presetId = fallback.presetId;
    if (!presetId) mediaType = 'none';
  }
  if ((mediaType === 'image' || mediaType === 'video') && !itemId) {
    mediaType = fallback.presetId ? 'preset' : 'none';
    presetId = fallback.presetId || null;
  }

  // Smoothly upgrade v1.0.0 untouched opaque glass defaults (0.84 / 16px) to DSH-style translucent glass (0.36 / 20px)
  // while preserving any user-customized opacity below 0.80.
  let rawSurfaceOpacity = src.surfaceOpacity;
  let rawGlassBlurPx = src.glassBlurPx;
  if (migrateV1Glass && !src.glassTone && typeof rawSurfaceOpacity === 'number' && rawSurfaceOpacity >= 0.8) {
    rawSurfaceOpacity = fallback.surfaceOpacity;
    if (rawGlassBlurPx === 16) rawGlassBlurPx = fallback.glassBlurPx;
  }

  return {
    mediaType,
    presetId: mediaType === 'preset' ? presetId : null,
    itemId: mediaType === 'image' || mediaType === 'video' ? itemId : null,
    fit: VALID_FITS.has(src.fit) ? src.fit : fallback.fit,
    positionX: Math.round(clampNumber(src.positionX, fallback.positionX, 0, 100)),
    positionY: Math.round(clampNumber(src.positionY, fallback.positionY, 0, 100)),
    blurPx: Math.round(clampNumber(src.blurPx, fallback.blurPx, 0, 32)),
    scrimOpacity: Number(clampNumber(src.scrimOpacity, fallback.scrimOpacity, 0, 0.85).toFixed(2)),
    scrimMode: VALID_SCRIM_MODES.has(src.scrimMode) ? src.scrimMode : fallback.scrimMode,
    glassTone: VALID_GLASS_TONES.has(src.glassTone) ? src.glassTone : fallback.glassTone,
    surfaceOpacity: Number(clampNumber(rawSurfaceOpacity, fallback.surfaceOpacity, 0.08, 0.90).toFixed(2)),
    glassBlurPx: Math.round(clampNumber(rawGlassBlurPx, fallback.glassBlurPx, 0, 32)),
    videoPlaybackRate: Number(clampNumber(src.videoPlaybackRate, fallback.videoPlaybackRate, 0.25, 2).toFixed(2)),
    loginCardOpacity: Number(clampNumber(src.loginCardOpacity, fallback.loginCardOpacity, 0.55, 1).toFixed(2)),
  };
}

function createWallpaperStorage(options) {
  const dataDir = options.dataDir
    || process.env.PLUGIN_DATA_DIR
    || path.join(os.homedir(), '.claude-code-ui', 'plugin-data', 'claudeweb-wallpaper');
  const presets = Array.isArray(options.presets) ? options.presets : [];
  const presetIds = new Set(presets.map((p) => p.id));

  const configPath = path.join(dataDir, 'config.json');
  const catalogPath = path.join(dataDir, 'catalog.json');
  const mediaDir = path.join(dataDir, 'media');

  fs.mkdirSync(mediaDir, { recursive: true });

  function readCatalog() {
    try {
      if (!fs.existsSync(catalogPath)) return [];
      const parsed = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item) => {
        if (!item || typeof item !== 'object' || !ITEM_ID_PATTERN.test(String(item.id || ''))) return false;
        const filePath = path.join(mediaDir, item.fileName || '');
        return fs.existsSync(filePath);
      });
    } catch {
      return [];
    }
  }

  function saveCatalog(items) {
    atomicWriteJson(catalogPath, items);
  }

  function sanitizeConfig(raw, items, nextRevision, migrateV1Glass = false) {
    const base = defaultConfig();
    const validItemIds = new Set(items.map((i) => i.id));
    const src = raw && typeof raw === 'object' ? raw : {};

    const themes = {};
    for (const key of THEME_KEYS) {
      themes[key] = sanitizeSlot(src.themes?.[key], base.themes[key], presetIds, validItemIds, migrateV1Glass);
    }

    return {
      schema: SCHEMA_VERSION,
      glassEngine: GLASS_ENGINE_VERSION,
      revision: nextRevision,
      updatedAt: new Date().toISOString(),
      scope: VALID_SCOPES.has(src.scope) ? src.scope : base.scope,
      perTheme: typeof src.perTheme === 'boolean' ? src.perTheme : base.perTheme,
      shared: sanitizeSlot(src.shared, base.shared, presetIds, validItemIds, migrateV1Glass),
      themes,
      login: {
        enabled: Boolean(src.login?.enabled),
        mode: src.login?.mode === 'single' ? 'single' : 'per-theme',
      },
    };
  }

  function readConfig() {
    const items = readCatalog();
    if (!fs.existsSync(configPath)) {
      const fresh = defaultConfig();
      atomicWriteJson(configPath, fresh);
      return fresh;
    }
    try {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (parsed && typeof parsed === 'object' && parsed.schema && parsed.schema !== SCHEMA_VERSION) {
        // Backup config before schema migration so rollback remains possible.
        const backupPath = path.join(dataDir, `config.schema-${parsed.schema}.bak.json`);
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(configPath, backupPath);
        }
      }
      const needsV1GlassMigration = Boolean(
        parsed
        && typeof parsed === 'object'
        && (!parsed.glassEngine || Number(parsed.glassEngine) < GLASS_ENGINE_VERSION),
      );
      const rev = typeof parsed?.revision === 'number' && parsed.revision >= 1 ? Math.floor(parsed.revision) : 1;
      const sanitized = sanitizeConfig(parsed, items, rev, needsV1GlassMigration);
      if (needsV1GlassMigration) {
        const backupPath = path.join(dataDir, 'config.v1-glass.bak.json');
        if (!fs.existsSync(backupPath)) {
          try { fs.copyFileSync(configPath, backupPath); } catch { /* ignore */ }
        }
        atomicWriteJson(configPath, sanitized);
      }
      return sanitized;
    } catch {
      // Corrupted JSON: preserve original for manual recovery and boot cleanly with defaults.
      try {
        fs.copyFileSync(configPath, path.join(dataDir, `config.corrupt-${Date.now()}.bak.json`));
      } catch { /* ignore */ }
      const fresh = defaultConfig();
      atomicWriteJson(configPath, fresh);
      return fresh;
    }
  }

  function updateConfig(payload, optionsArg = {}) {
    const current = readConfig();
    const expected = optionsArg.expectedRevision;
    const force = optionsArg.force === true;
    if (!force && typeof expected === 'number' && expected !== current.revision) {
      const err = new Error('Wallpaper configuration was modified on another tab or device.');
      err.statusCode = 409;
      err.code = 'REVISION_CONFLICT';
      err.current = current;
      throw err;
    }
    const items = readCatalog();
    const next = sanitizeConfig(payload, items, current.revision + 1);
    atomicWriteJson(configPath, next);
    return next;
  }

  function storeUpload(buffer, meta = {}) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      const err = new Error('Uploaded file is empty');
      err.statusCode = 400;
      throw err;
    }
    if (buffer.length > MAX_UPLOAD_BYTES) {
      const err = new Error(`File exceeds the ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MiB size limit`);
      err.statusCode = 413;
      throw err;
    }
    const mimeType = detectSafeMediaMime(buffer);
    if (!mimeType) {
      const err = new Error('Unsupported or unsafe file format. Supported: PNG, JPEG, WebP, AVIF, GIF, MP4, WebM.');
      err.statusCode = 415;
      throw err;
    }

    const items = readCatalog();
    const posterOf = typeof meta.posterOf === 'string' && ITEM_ID_PATTERN.test(meta.posterOf) ? meta.posterOf : null;
    const detectedTone = meta.tone === 'light' || meta.tone === 'dark' ? meta.tone : null;

    if (posterOf) {
      if (!mimeType.startsWith('image/')) {
        const err = new Error('Video poster must be an image');
        err.statusCode = 400;
        throw err;
      }
      const parent = items.find((i) => i.id === posterOf);
      if (!parent || parent.kind !== 'video') {
        const err = new Error('Target video item not found');
        err.statusCode = 404;
        throw err;
      }
      const ext = MIME_TO_EXT[mimeType];
      const posterFileName = `${parent.id}-poster${ext}`;
      const posterPath = path.join(mediaDir, posterFileName);
      fs.writeFileSync(posterPath, buffer);
      parent.posterFileName = posterFileName;
      parent.posterMime = mimeType;
      if (detectedTone) parent.tone = detectedTone;
      saveCatalog(items);
      return parent;
    }

    if (items.length >= MAX_ITEMS) {
      const err = new Error(`Gallery limit reached (${MAX_ITEMS} items). Delete an unused wallpaper first.`);
      err.statusCode = 400;
      throw err;
    }

    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const existing = items.find((item) => item.sha256 === sha256);
    if (existing) {
      if (detectedTone && existing.tone !== detectedTone) {
        existing.tone = detectedTone;
        saveCatalog(items);
      }
      return existing;
    }

    const id = sha256.slice(0, 24);
    const ext = MIME_TO_EXT[mimeType];
    const fileName = `${id}${ext}`;
    const targetPath = path.join(mediaDir, fileName);
    const tempPath = `${targetPath}.${crypto.randomBytes(4).toString('hex')}.tmp`;
    try {
      fs.writeFileSync(tempPath, buffer);
      fs.renameSync(tempPath, targetPath);
    } finally {
      try { fs.unlinkSync(tempPath); } catch { /* ignore */ }
    }

    const rawName = typeof meta.originalName === 'string' ? path.basename(meta.originalName).trim() : '';
    const safeName = rawName.replace(/[\x00-\x1f\x7f<>:"/\\|?*]+/g, '').slice(0, 80) || `wallpaper${ext}`;

    const item = {
      id,
      name: safeName,
      kind: mimeType.startsWith('video/') ? 'video' : 'image',
      mimeType,
      bytes: buffer.length,
      sha256,
      fileName,
      posterFileName: null,
      posterMime: null,
      tone: detectedTone,
      source: 'local',
      createdAt: new Date().toISOString(),
    };

    items.unshift(item);
    saveCatalog(items);
    return item;
  }

  function deleteItem(id) {
    if (!ITEM_ID_PATTERN.test(String(id || ''))) {
      const err = new Error('Invalid wallpaper ID');
      err.statusCode = 400;
      throw err;
    }
    const items = readCatalog();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      const err = new Error('Wallpaper item not found');
      err.statusCode = 404;
      throw err;
    }
    const [removed] = items.splice(index, 1);
    try { fs.unlinkSync(path.join(mediaDir, removed.fileName)); } catch { /* ignore */ }
    if (removed.posterFileName) {
      try { fs.unlinkSync(path.join(mediaDir, removed.posterFileName)); } catch { /* ignore */ }
    }
    saveCatalog(items);

    // Automatically re-sanitize saved config so no slot points at the deleted item.
    const current = readConfig();
    const next = sanitizeConfig(current, items, current.revision + 1);
    atomicWriteJson(configPath, next);
    return { removed, config: next };
  }

  function resolveMediaFile(id, wantPoster = false) {
    if (!ITEM_ID_PATTERN.test(String(id || ''))) return null;
    const items = readCatalog();
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    const fileName = wantPoster ? item.posterFileName : item.fileName;
    const mimeType = wantPoster ? item.posterMime : item.mimeType;
    if (!fileName || !mimeType) return null;
    const filePath = path.resolve(mediaDir, fileName);
    if (!filePath.startsWith(path.resolve(mediaDir) + path.sep)) return null;
    try {
      const stat = fs.lstatSync(filePath);
      if (!stat.isFile() || stat.isSymbolicLink()) return null;
      return {
        filePath,
        mimeType,
        size: stat.size,
        etag: `"${item.sha256}${wantPoster ? '-p' : ''}"`,
      };
    } catch {
      return null;
    }
  }

  function getStats() {
    const items = readCatalog();
    const totalBytes = items.reduce((sum, item) => sum + (item.bytes || 0), 0);
    return { itemCount: items.length, totalBytes, maxUploadBytes: MAX_UPLOAD_BYTES, maxItems: MAX_ITEMS };
  }

  return {
    dataDir,
    readConfig,
    readCatalog,
    updateConfig,
    storeUpload,
    deleteItem,
    resolveMediaFile,
    getStats,
  };
}

module.exports = {
  SCHEMA_VERSION,
  MAX_UPLOAD_BYTES,
  detectSafeMediaMime,
  defaultConfig,
  createWallpaperStorage,
};

  },
  './ws.cjs': (module, exports, require) => {
'use strict';

const crypto = require('node:crypto');

const WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

function encodeTextFrame(text) {
  const payload = Buffer.from(text, 'utf8');
  const len = payload.length;
  let header;
  if (len < 126) {
    header = Buffer.from([0x81, len]);
  } else if (len < 65536) {
    header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(len, 2);
  } else {
    header = Buffer.alloc(10);
    header[0] = 0x81;
    header[1] = 127;
    header.writeBigUInt64BE(BigInt(len), 2);
  }
  return Buffer.concat([header, payload]);
}

function encodePongFrame(payload) {
  const len = Math.min(payload.length, 125);
  return Buffer.concat([Buffer.from([0x8a, len]), payload.subarray(0, len)]);
}

/**
 * Minimal zero-dependency RFC 6455 WebSocket broadcaster for syncing saved
 * wallpaper updates across multiple open browser tabs/devices.
 */
function createWsBroadcaster() {
  const clients = new Set();

  function attach(server) {
    server.on('upgrade', (req, socket) => {
      const key = req.headers['sec-websocket-key'];
      if (typeof key !== 'string' || !key) {
        socket.write('HTTP/1.1 400 Bad Request\r\n\r\n');
        socket.destroy();
        return;
      }

      const accept = crypto.createHash('sha1').update(key + WS_GUID).digest('base64');
      socket.write([
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${accept}`,
        '',
        '',
      ].join('\r\n'));

      clients.add(socket);

      const cleanup = () => {
        clients.delete(socket);
      };
      socket.on('close', cleanup);
      socket.on('error', cleanup);
      socket.on('end', cleanup);

      // Handle ping/close frames cleanly so proxies keep the connection alive.
      socket.on('data', (chunk) => {
        if (!Buffer.isBuffer(chunk) || chunk.length < 2) return;
        const opcode = chunk[0] & 0x0f;
        if (opcode === 0x08) {
          try { socket.end(Buffer.from([0x88, 0x00])); } catch { /* ignore */ }
          cleanup();
        } else if (opcode === 0x09) {
          try { socket.write(encodePongFrame(Buffer.alloc(0))); } catch { /* ignore */ }
        }
      });
    });
  }

  function broadcast(payload) {
    const frame = encodeTextFrame(JSON.stringify(payload));
    for (const socket of clients) {
      if (socket.destroyed || !socket.writable) {
        clients.delete(socket);
        continue;
      }
      try {
        socket.write(frame);
      } catch {
        clients.delete(socket);
      }
    }
  }

  function closeAll() {
    for (const socket of clients) {
      try { socket.destroy(); } catch { /* ignore */ }
    }
    clients.clear();
  }

  return { attach, broadcast, closeAll };
}

module.exports = { createWsBroadcaster };

  },
  './index.cjs': (module, exports, require) => {
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

  },
};

const __cache = {};
function __require(id) {
  if (__modules[id]) {
    if (!__cache[id]) {
      const m = { exports: {} };
      __cache[id] = m;
      __modules[id](m, m.exports, __require);
    }
    return __cache[id].exports;
  }
  return require(id);
}

const __entry = __require('./index.cjs');
module.exports = __entry;

if (require.main === module) {
  const instance = __entry.createWallpaperServer();
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
