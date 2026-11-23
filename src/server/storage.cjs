'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const SCHEMA_VERSION = 1;
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MiB
const MAX_ITEMS = 64;
const THEME_KEYS = ['warm', 'light', 'dark'];
const VALID_SCOPES = new Set(['none', 'chat', 'workspace']);
const VALID_FITS = new Set(['cover', 'contain', 'center']);
const VALID_SCRIM_MODES = new Set(['auto', 'light', 'dark']);
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
    scrimOpacity: 0.16,
    scrimMode: 'auto',
    surfaceOpacity: 0.84,
    glassBlurPx: 16,
    videoPlaybackRate: 1,
    loginCardOpacity: 0.9,
  };
}

function defaultConfig() {
  return {
    schema: SCHEMA_VERSION,
    revision: 1,
    updatedAt: new Date().toISOString(),
    scope: 'workspace',
    perTheme: true,
    shared: defaultSlot('warm-sand'),
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

function sanitizeSlot(raw, fallback, presetIds, validItemIds) {
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
    surfaceOpacity: Number(clampNumber(src.surfaceOpacity, fallback.surfaceOpacity, 0.35, 0.98).toFixed(2)),
    glassBlurPx: Math.round(clampNumber(src.glassBlurPx, fallback.glassBlurPx, 0, 32)),
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

  function sanitizeConfig(raw, items, nextRevision) {
    const base = defaultConfig();
    const validItemIds = new Set(items.map((i) => i.id));
    const src = raw && typeof raw === 'object' ? raw : {};

    const themes = {};
    for (const key of THEME_KEYS) {
      themes[key] = sanitizeSlot(src.themes?.[key], base.themes[key], presetIds, validItemIds);
    }

    return {
      schema: SCHEMA_VERSION,
      revision: nextRevision,
      updatedAt: new Date().toISOString(),
      scope: VALID_SCOPES.has(src.scope) ? src.scope : base.scope,
      perTheme: typeof src.perTheme === 'boolean' ? src.perTheme : base.perTheme,
      shared: sanitizeSlot(src.shared, base.shared, presetIds, validItemIds),
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
      const rev = typeof parsed?.revision === 'number' && parsed.revision >= 1 ? Math.floor(parsed.revision) : 1;
      return sanitizeConfig(parsed, items, rev);
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
