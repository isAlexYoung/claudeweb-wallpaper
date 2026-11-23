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
    "status": "video-supported",
    "maxPackageBytes": 536870912,
    "supportedTypes": [
      "video (MP4/WebM with project.json + optional preview poster — import a single workshop folder, the entire Steam 431960 folder with remembered directory refresh, or a .zip package, up to 512 MB)"
    ],
    "unsupportedTypes": [
      "scene (.pkg proprietary DirectX/OpenGL shader scenes)",
      "web (HTML/JS/WebGL packages — not enabled in video-only mode)",
      "application (native executables)",
      "non-browser video containers (.mkv, .avi, .wmv)"
    ]
  }
};
  },
  './we-zip.cjs': (module, exports, require) => {
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const MAX_ZIP_ENTRIES = 512;
const MAX_PROJECT_JSON_BYTES = 2 * 1024 * 1024; // 2 MiB
const MAX_POSTER_BYTES = 16 * 1024 * 1024; // 16 MiB
const DEFAULT_MAX_EXTRACT_BYTES = 512 * 1024 * 1024; // 512 MiB
const EOCD_SIG = 0x06054b50;
const ZIP64_LOCATOR_SIG = 0x07064b50;
const ZIP64_EOCD_SIG = 0x06064b50;
const CD_SIG = 0x02014b50;
const LFH_SIG = 0x04034b50;

function makeError(message, statusCode = 400, code = 'INVALID_WE_PACKAGE') {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.code = code;
  return err;
}

/**
 * Validates and normalizes an archive entry path, blocking absolute paths,
 * drive letters, null bytes, and `..` traversal segments.
 */
function normalizeZipEntryPath(rawName) {
  if (typeof rawName !== 'string' || rawName.length === 0) return null;
  if (rawName.includes('\0')) throw makeError('Archive contains invalid null-byte entry path', 400, 'UNSAFE_ZIP_PATH');
  const slashNorm = rawName.replace(/\\/g, '/');
  if (slashNorm.startsWith('/') || /^[a-zA-Z]:/.test(slashNorm)) {
    throw makeError(`Archive entry uses an absolute path: ${rawName}`, 400, 'UNSAFE_ZIP_PATH');
  }
  const segments = slashNorm.split('/').filter((s) => s.length > 0 && s !== '.');
  if (segments.some((s) => s === '..')) {
    throw makeError(`Archive entry attempts path traversal: ${rawName}`, 400, 'UNSAFE_ZIP_PATH');
  }
  return segments.join('/');
}

function readUInt64LEAsSafeNumber(buf, offset) {
  const lo = buf.readUInt32LE(offset);
  const hi = buf.readUInt32LE(offset + 4);
  const value = hi * 0x100000000 + lo;
  if (!Number.isSafeInteger(value)) {
    throw makeError('Archive entry exceeds safe integer bounds', 400, 'INVALID_ZIP');
  }
  return value;
}

/**
 * Parses a ZIP archive's Central Directory directly from disk (constant small memory),
 * rejecting symlinks, path traversal, encrypted entries, and excessive entry counts.
 */
function readZipDirectory(zipPath) {
  const fd = fs.openSync(zipPath, 'r');
  try {
    const stat = fs.fstatSync(fd);
    const fileSize = stat.size;
    if (fileSize < 22) {
      throw makeError('File is not a valid ZIP archive', 400, 'INVALID_ZIP');
    }

    // Locate End of Central Directory (EOCD) within the last 64 KiB + 22 bytes.
    const tailLen = Math.min(fileSize, 65557);
    const tailStart = fileSize - tailLen;
    const tail = Buffer.allocUnsafe(tailLen);
    fs.readSync(fd, tail, 0, tailLen, tailStart);

    let eocdOffsetInTail = -1;
    for (let i = tailLen - 22; i >= 0; i -= 1) {
      if (tail.readUInt32LE(i) === EOCD_SIG) {
        const commentLen = tail.readUInt16LE(i + 20);
        if (i + 22 + commentLen === tailLen) {
          eocdOffsetInTail = i;
          break;
        }
      }
    }
    if (eocdOffsetInTail === -1) {
      throw makeError('Could not locate ZIP central directory', 400, 'INVALID_ZIP');
    }

    const eocdAbsOffset = tailStart + eocdOffsetInTail;
    let totalEntries = tail.readUInt16LE(eocdOffsetInTail + 10);
    let cdSize = tail.readUInt32LE(eocdOffsetInTail + 12);
    let cdOffset = tail.readUInt32LE(eocdOffsetInTail + 16);

    // Handle ZIP64 EOCD when standard fields are 0xFFFF / 0xFFFFFFFF.
    if (totalEntries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
      if (eocdAbsOffset < 20) {
        throw makeError('Corrupt ZIP64 locator', 400, 'INVALID_ZIP');
      }
      const locBuf = Buffer.allocUnsafe(20);
      fs.readSync(fd, locBuf, 0, 20, eocdAbsOffset - 20);
      if (locBuf.readUInt32LE(0) !== ZIP64_LOCATOR_SIG) {
        throw makeError('Missing ZIP64 locator', 400, 'INVALID_ZIP');
      }
      const zip64EocdOffset = readUInt64LEAsSafeNumber(locBuf, 8);
      if (zip64EocdOffset + 56 > fileSize) {
        throw makeError('Corrupt ZIP64 EOCD offset', 400, 'INVALID_ZIP');
      }
      const z64 = Buffer.allocUnsafe(56);
      fs.readSync(fd, z64, 0, 56, zip64EocdOffset);
      if (z64.readUInt32LE(0) !== ZIP64_EOCD_SIG) {
        throw makeError('Invalid ZIP64 EOCD signature', 400, 'INVALID_ZIP');
      }
      totalEntries = readUInt64LEAsSafeNumber(z64, 32);
      cdSize = readUInt64LEAsSafeNumber(z64, 40);
      cdOffset = readUInt64LEAsSafeNumber(z64, 48);
    }

    if (totalEntries > MAX_ZIP_ENTRIES) {
      throw makeError(`ZIP archive has too many entries (max ${MAX_ZIP_ENTRIES})`, 400, 'ZIP_TOO_MANY_ENTRIES');
    }
    if (cdSize > 16 * 1024 * 1024 || cdOffset + cdSize > fileSize) {
      throw makeError('ZIP central directory bounds are invalid', 400, 'INVALID_ZIP');
    }

    const cdBuf = Buffer.allocUnsafe(cdSize);
    fs.readSync(fd, cdBuf, 0, cdSize, cdOffset);

    const entries = [];
    let pos = 0;
    for (let idx = 0; idx < totalEntries; idx += 1) {
      if (pos + 46 > cdBuf.length || cdBuf.readUInt32LE(pos) !== CD_SIG) {
        throw makeError('Corrupt ZIP central directory entry', 400, 'INVALID_ZIP');
      }
      const versionMadeBy = cdBuf.readUInt16LE(pos + 4);
      const flags = cdBuf.readUInt16LE(pos + 8);
      const compressionMethod = cdBuf.readUInt16LE(pos + 10);
      let compressedSize = cdBuf.readUInt32LE(pos + 20);
      let uncompressedSize = cdBuf.readUInt32LE(pos + 24);
      const fileNameLen = cdBuf.readUInt16LE(pos + 28);
      const extraLen = cdBuf.readUInt16LE(pos + 30);
      const commentLen = cdBuf.readUInt16LE(pos + 32);
      const externalAttrs = cdBuf.readUInt32LE(pos + 38);
      let localHeaderOffset = cdBuf.readUInt32LE(pos + 42);

      const entryEnd = pos + 46 + fileNameLen + extraLen + commentLen;
      if (entryEnd > cdBuf.length) {
        throw makeError('Truncated ZIP central directory entry', 400, 'INVALID_ZIP');
      }

      const nameBuf = cdBuf.subarray(pos + 46, pos + 46 + fileNameLen);
      const rawName = nameBuf.toString('utf8');
      const extraBuf = cdBuf.subarray(pos + 46 + fileNameLen, pos + 46 + fileNameLen + extraLen);

      // Parse ZIP64 extra field (header ID 0x0001) if needed.
      if (compressedSize === 0xffffffff || uncompressedSize === 0xffffffff || localHeaderOffset === 0xffffffff) {
        let ep = 0;
        while (ep + 4 <= extraBuf.length) {
          const headerId = extraBuf.readUInt16LE(ep);
          const dataSize = extraBuf.readUInt16LE(ep + 2);
          ep += 4;
          if (headerId === 0x0001 && ep + dataSize <= extraBuf.length) {
            let z = ep;
            if (uncompressedSize === 0xffffffff && z + 8 <= ep + dataSize) {
              uncompressedSize = readUInt64LEAsSafeNumber(extraBuf, z);
              z += 8;
            }
            if (compressedSize === 0xffffffff && z + 8 <= ep + dataSize) {
              compressedSize = readUInt64LEAsSafeNumber(extraBuf, z);
              z += 8;
            }
            if (localHeaderOffset === 0xffffffff && z + 8 <= ep + dataSize) {
              localHeaderOffset = readUInt64LEAsSafeNumber(extraBuf, z);
            }
            break;
          }
          ep += dataSize;
        }
      }

      const isDirectory = rawName.endsWith('/') || rawName.endsWith('\\');
      const normalized = normalizeZipEntryPath(rawName);

      // Detect Unix symlinks (host OS === 3 Unix, mode bits 0o120000).
      const hostOs = (versionMadeBy >>> 8) & 0xff;
      const unixMode = (externalAttrs >>> 16) & 0xffff;
      if (hostOs === 3 && (unixMode & 0o170000) === 0o120000) {
        throw makeError(`Archive contains a disallowed symbolic link: ${rawName}`, 400, 'UNSAFE_ZIP_SYMLINK');
      }

      if (!isDirectory && normalized) {
        entries.push({
          path: normalized,
          flags,
          compressionMethod,
          compressedSize,
          uncompressedSize,
          localHeaderOffset,
        });
      }

      pos = entryEnd;
    }

    return entries;
  } finally {
    fs.closeSync(fd);
  }
}

function getLocalEntryDataStart(zipPath, entry) {
  const fd = fs.openSync(zipPath, 'r');
  try {
    const header = Buffer.allocUnsafe(30);
    const bytesRead = fs.readSync(fd, header, 0, 30, entry.localHeaderOffset);
    if (bytesRead < 30 || header.readUInt32LE(0) !== LFH_SIG) {
      throw makeError('Invalid ZIP local file header', 400, 'INVALID_ZIP');
    }
    const nameLen = header.readUInt16LE(26);
    const extraLen = header.readUInt16LE(28);
    return entry.localHeaderOffset + 30 + nameLen + extraLen;
  } finally {
    fs.closeSync(fd);
  }
}

/**
 * Streams a single ZIP entry to a destination file while strictly enforcing
 * the decompressed byte limit (zip-bomb protection).
 */
function extractZipEntryToFile(zipPath, entry, destPath, maxBytes) {
  if ((entry.flags & 0x01) !== 0) {
    throw makeError('Encrypted ZIP archives are not supported', 400, 'ENCRYPTED_ZIP');
  }
  if (entry.compressionMethod !== 0 && entry.compressionMethod !== 8) {
    throw makeError(`Unsupported ZIP compression method (${entry.compressionMethod})`, 400, 'UNSUPPORTED_ZIP_METHOD');
  }
  if (entry.uncompressedSize > maxBytes) {
    throw makeError(
      `Archive entry "${entry.path}" exceeds the ${Math.round(maxBytes / (1024 * 1024))} MiB limit`,
      413,
      'ZIP_ENTRY_TOO_LARGE',
    );
  }

  const dataStart = getLocalEntryDataStart(zipPath, entry);
  const dataEnd = dataStart + entry.compressedSize - 1;

  if (entry.compressedSize === 0) {
    fs.writeFileSync(destPath, Buffer.alloc(0));
    return Promise.resolve({ bytes: 0 });
  }

  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(zipPath, { start: dataStart, end: dataEnd });
    const writeStream = fs.createWriteStream(destPath);
    const sourceStream = entry.compressionMethod === 8 ? readStream.pipe(zlib.createInflateRaw()) : readStream;

    let written = 0;
    let settled = false;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      readStream.destroy();
      if (sourceStream !== readStream) sourceStream.destroy();
      writeStream.destroy();
      try { fs.unlinkSync(destPath); } catch { /* ignore */ }
      reject(err);
    };

    readStream.on('error', (err) => fail(makeError(`Failed to read ZIP stream: ${err.message}`, 400, 'INVALID_ZIP')));
    if (sourceStream !== readStream) {
      sourceStream.on('error', (err) => fail(makeError(`Failed to decompress ZIP entry: ${err.message}`, 400, 'INVALID_ZIP')));
    }
    writeStream.on('error', (err) => fail(err));

    sourceStream.on('data', (chunk) => {
      written += chunk.length;
      if (written > maxBytes) {
        fail(makeError(
          `Decompressed file "${entry.path}" exceeds the ${Math.round(maxBytes / (1024 * 1024))} MiB limit (zip bomb guard)`,
          413,
          'ZIP_BOMB_GUARD',
        ));
        return;
      }
      if (!writeStream.write(chunk)) {
        sourceStream.pause();
        writeStream.once('drain', () => sourceStream.resume());
      }
    });

    sourceStream.on('end', () => {
      if (!settled) writeStream.end();
    });

    writeStream.on('finish', () => {
      if (settled) return;
      settled = true;
      resolve({ bytes: written });
    });
  });
}

async function extractZipEntryToBuffer(zipPath, entry, maxBytes) {
  const tempFile = `${zipPath}.${crypto.randomBytes(6).toString('hex')}.buf`;
  try {
    await extractZipEntryToFile(zipPath, entry, tempFile, maxBytes);
    return fs.readFileSync(tempFile);
  } finally {
    try { fs.unlinkSync(tempFile); } catch { /* ignore */ }
  }
}

function resolveRelativeArchivePath(baseDir, relPath) {
  if (typeof relPath !== 'string' || !relPath.trim()) return null;
  const cleaned = relPath.trim().replace(/\\/g, '/');
  if (cleaned.startsWith('/') || /^[a-zA-Z]:/.test(cleaned) || cleaned.includes('\0')) {
    throw makeError(`Unsafe path in project.json: ${relPath}`, 400, 'UNSAFE_WE_PROJECT_PATH');
  }
  const combined = baseDir ? `${baseDir}/${cleaned}` : cleaned;
  const segments = [];
  for (const seg of combined.split('/')) {
    if (!seg || seg === '.') continue;
    if (seg === '..') {
      throw makeError(`Path traversal in project.json is not allowed: ${relPath}`, 400, 'UNSAFE_WE_PROJECT_PATH');
    }
    segments.push(seg);
  }
  return segments.join('/');
}

/**
 * Inspects and extracts a Wallpaper Engine Video `.zip` package into temporary files.
 * Caller is responsible for cleaning up `result.cleanup()`.
 */
async function extractWallpaperEngineVideoZip(zipPath, workDir, options = {}) {
  const maxBytes = options.maxExtractBytes || DEFAULT_MAX_EXTRACT_BYTES;
  const entries = readZipDirectory(zipPath);

  // Locate project.json (either at root or one level deep inside a wrapper directory).
  const projectEntries = entries
    .filter((e) => {
      const lower = e.path.toLowerCase();
      return lower === 'project.json' || (lower.endsWith('/project.json') && e.path.split('/').length === 2);
    })
    .sort((a, b) => a.path.split('/').length - b.path.split('/').length);

  if (projectEntries.length === 0) {
    throw makeError(
      'Missing project.json in ZIP archive. Export or zip a Wallpaper Engine wallpaper folder containing project.json.',
      400,
      'WE_MISSING_PROJECT_JSON',
    );
  }

  const projectEntry = projectEntries[0];
  const baseDir = projectEntry.path.includes('/') ? projectEntry.path.slice(0, projectEntry.path.lastIndexOf('/')) : '';

  const projectBuf = await extractZipEntryToBuffer(zipPath, projectEntry, MAX_PROJECT_JSON_BYTES);
  let project;
  try {
    // Strip optional UTF-8 BOM commonly written by Windows editors.
    const text = projectBuf.toString('utf8').replace(/^\uFEFF/, '');
    project = JSON.parse(text);
  } catch {
    throw makeError('project.json is not valid JSON', 400, 'WE_INVALID_PROJECT_JSON');
  }

  if (!project || typeof project !== 'object') {
    throw makeError('project.json must be a JSON object', 400, 'WE_INVALID_PROJECT_JSON');
  }

  const rawType = typeof project.type === 'string' ? project.type.trim().toLowerCase() : '';
  if (rawType !== 'video') {
    const label = rawType || 'unknown';
    throw makeError(
      `Unsupported Wallpaper Engine type "${label}". Only Video (MP4/WebM) Wallpaper Engine packages are supported.`,
      415,
      'WE_UNSUPPORTED_TYPE',
    );
  }

  const videoRelPath = resolveRelativeArchivePath(baseDir, project.file);
  if (!videoRelPath) {
    throw makeError('project.json is missing the "file" field pointing to the video file', 400, 'WE_MISSING_VIDEO_FILE');
  }

  const entryMap = new Map();
  const entryMapLower = new Map();
  for (const e of entries) {
    entryMap.set(e.path, e);
    entryMapLower.set(e.path.toLowerCase(), e);
  }

  const videoEntry = entryMap.get(videoRelPath) || entryMapLower.get(videoRelPath.toLowerCase());
  if (!videoEntry) {
    throw makeError(
      `Video file "${project.file}" declared in project.json was not found inside the ZIP archive`,
      400,
      'WE_VIDEO_NOT_FOUND',
    );
  }

  let previewEntry = null;
  if (typeof project.preview === 'string' && project.preview.trim()) {
    try {
      const previewRelPath = resolveRelativeArchivePath(baseDir, project.preview);
      if (previewRelPath) {
        previewEntry = entryMap.get(previewRelPath) || entryMapLower.get(previewRelPath.toLowerCase()) || null;
      }
    } catch {
      previewEntry = null;
    }
  }

  const extractDir = path.join(workDir, `we-extract-${crypto.randomBytes(6).toString('hex')}`);
  fs.mkdirSync(extractDir, { recursive: true });

  const cleanup = () => {
    try { fs.rmSync(extractDir, { recursive: true, force: true }); } catch { /* ignore */ }
  };

  try {
    const videoTempPath = path.join(extractDir, 'video.bin');
    await extractZipEntryToFile(zipPath, videoEntry, videoTempPath, maxBytes);

    let posterTempPath = null;
    if (previewEntry && previewEntry.uncompressedSize <= MAX_POSTER_BYTES) {
      const candidatePoster = path.join(extractDir, 'poster.bin');
      try {
        await extractZipEntryToFile(zipPath, previewEntry, candidatePoster, MAX_POSTER_BYTES);
        posterTempPath = candidatePoster;
      } catch {
        posterTempPath = null;
      }
    }

    const title = typeof project.title === 'string' && project.title.trim()
      ? project.title.trim().slice(0, 80)
      : path.basename(videoEntry.path);
    const workshopId = project.workshopid !== undefined && project.workshopid !== null
      ? String(project.workshopid).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || null
      : null;
    const tags = Array.isArray(project.tags)
      ? project.tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim().slice(0, 24)).slice(0, 8)
      : [];

    return {
      title,
      workshopId,
      tags,
      videoFileName: path.basename(videoEntry.path),
      videoTempPath,
      posterTempPath,
      cleanup,
    };
  } catch (err) {
    cleanup();
    throw err;
  }
}

module.exports = {
  MAX_ZIP_ENTRIES,
  DEFAULT_MAX_EXTRACT_BYTES,
  normalizeZipEntryPath,
  readZipDirectory,
  extractWallpaperEngineVideoZip,
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
const MAX_UPLOAD_BYTES = 512 * 1024 * 1024; // 512 MiB (supports 4K60 Wallpaper Engine MP4/WebM via chunked upload)
const MAX_SINGLE_REQUEST_BYTES = 96 * 1024 * 1024; // 96 MiB single-request stream (inside ClaudeWeb 100 MiB proxy limit)
const MAX_CHUNK_BYTES = 16 * 1024 * 1024; // 16 MiB max chunk
const UPLOAD_SESSION_TTL_MS = 15 * 60 * 1000;
const MAX_ITEMS = 64;
const THEME_KEYS = ['warm', 'light', 'dark'];
const VALID_SCOPES = new Set(['none', 'chat', 'workspace']);
const VALID_FITS = new Set(['cover', 'contain', 'center']);
const VALID_SCRIM_MODES = new Set(['auto', 'light', 'dark']);
const VALID_GLASS_TONES = new Set(['auto', 'light', 'dark']);
const VALID_MEDIA_TYPES = new Set(['none', 'preset', 'image', 'video']);
const VALID_UPLOAD_MODES = new Set(['media', 'poster', 'we-zip']);
const ITEM_ID_PATTERN = /^[a-f0-9]{16,40}$/;
const UPLOAD_ID_PATTERN = /^[a-f0-9]{16,40}$/;

const { extractWallpaperEngineVideoZip } = require('./we-zip.cjs');

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
    if (['isom', 'iso2', 'iso5', 'iso6', 'mp41', 'mp42', 'avc1', 'hev1', 'hvc1', 'av01', 'M4V ', 'qt  ', 'dash', 'msnv'].includes(brand)) {
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
  const tmpUploadsDir = path.join(dataDir, 'tmp-uploads');
  const uploadSessions = new Map();

  fs.mkdirSync(mediaDir, { recursive: true });
  fs.mkdirSync(tmpUploadsDir, { recursive: true });

  // Wipe any leftover temp files from a prior interrupted process on startup.
  try {
    for (const entry of fs.readdirSync(tmpUploadsDir)) {
      try { fs.rmSync(path.join(tmpUploadsDir, entry), { recursive: true, force: true }); } catch { /* ignore */ }
    }
  } catch { /* ignore */ }

  function moveFileSafe(src, dest) {
    try {
      fs.renameSync(src, dest);
    } catch (err) {
      if (err && err.code === 'EXDEV') {
        fs.copyFileSync(src, dest);
        fs.unlinkSync(src);
      } else {
        throw err;
      }
    }
  }

  function readFileHead(filePath, byteCount = 32) {
    const fd = fs.openSync(filePath, 'r');
    try {
      const buf = Buffer.allocUnsafe(byteCount);
      const read = fs.readSync(fd, buf, 0, byteCount, 0);
      return buf.subarray(0, read);
    } finally {
      fs.closeSync(fd);
    }
  }

  function hashFileSha256(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      stream.on('data', (chunk) => hash.update(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(hash.digest('hex')));
    });
  }

  function sanitizeDisplayName(rawName, fallbackExt) {
    const base = typeof rawName === 'string' ? rawName.trim() : '';
    const safe = base.replace(/[\x00-\x1f\x7f<>:"/\\|?*]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
    return safe || `wallpaper${fallbackExt}`;
  }

  function sanitizeWorkshopId(raw) {
    if (raw === undefined || raw === null) return null;
    const s = String(raw).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
    return s || null;
  }

  function sanitizeTags(raw) {
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((t) => typeof t === 'string' && t.trim())
      .map((t) => t.trim().slice(0, 24))
      .slice(0, 8);
  }

  function cleanupStaleUploads() {
    const now = Date.now();
    for (const [id, session] of uploadSessions.entries()) {
      if (now - session.updatedAt > UPLOAD_SESSION_TTL_MS) {
        uploadSessions.delete(id);
        try { fs.unlinkSync(session.partPath); } catch { /* ignore */ }
      }
    }
  }

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

  async function storeMediaFile(tempFilePath, meta = {}) {
    const stat = fs.statSync(tempFilePath);
    if (!stat.isFile() || stat.size === 0) {
      const err = new Error('Uploaded file is empty');
      err.statusCode = 400;
      throw err;
    }
    if (stat.size > MAX_UPLOAD_BYTES) {
      const err = new Error(`File exceeds the ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MiB size limit`);
      err.statusCode = 413;
      throw err;
    }

    const head = readFileHead(tempFilePath, 32);
    const mimeType = detectSafeMediaMime(head);
    if (!mimeType) {
      const err = new Error(
        meta.requireVideo
          ? 'Unsupported video container. Only browser-native MP4 and WebM videos are supported.'
          : 'Unsupported or unsafe file format. Supported: PNG, JPEG, WebP, AVIF, GIF, MP4, WebM.',
      );
      err.statusCode = 415;
      throw err;
    }
    if (meta.requireVideo && !mimeType.startsWith('video/')) {
      const err = new Error('Wallpaper Engine Video package must reference a valid MP4 or WebM video file.');
      err.statusCode = 415;
      throw err;
    }

    const items = readCatalog();
    const posterOf = typeof meta.posterOf === 'string' && ITEM_ID_PATTERN.test(meta.posterOf) ? meta.posterOf : null;
    const detectedTone = meta.tone === 'light' || meta.tone === 'dark' ? meta.tone : null;
    const source = meta.source === 'wallpaper-engine' ? 'wallpaper-engine' : 'local';
    const workshopId = sanitizeWorkshopId(meta.workshopId);
    const tags = sanitizeTags(meta.tags);

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
      moveFileSafe(tempFilePath, posterPath);
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

    const sha256 = await hashFileSha256(tempFilePath);
    const existing = items.find((item) => item.sha256 === sha256);
    if (existing) {
      try { fs.unlinkSync(tempFilePath); } catch { /* ignore */ }
      let changed = false;
      if (detectedTone && existing.tone !== detectedTone) {
        existing.tone = detectedTone;
        changed = true;
      }
      if (source === 'wallpaper-engine' && existing.source !== 'wallpaper-engine') {
        existing.source = 'wallpaper-engine';
        changed = true;
      }
      if (workshopId && !existing.workshopId) {
        existing.workshopId = workshopId;
        changed = true;
      }
      if (typeof meta.originalName === 'string' && meta.originalName.trim() && source === 'wallpaper-engine') {
        const nextName = sanitizeDisplayName(meta.originalName, MIME_TO_EXT[mimeType]);
        if (existing.name !== nextName) {
          existing.name = nextName;
          changed = true;
        }
      }
      if (tags.length > 0 && (!Array.isArray(existing.tags) || existing.tags.length === 0)) {
        existing.tags = tags;
        changed = true;
      }
      if (changed) saveCatalog(items);
      return existing;
    }

    const id = sha256.slice(0, 24);
    const ext = MIME_TO_EXT[mimeType];
    const fileName = `${id}${ext}`;
    const targetPath = path.join(mediaDir, fileName);
    moveFileSafe(tempFilePath, targetPath);

    const safeName = sanitizeDisplayName(
      source === 'wallpaper-engine' ? meta.originalName : path.basename(String(meta.originalName || '')),
      ext,
    );

    const item = {
      id,
      name: safeName,
      kind: mimeType.startsWith('video/') ? 'video' : 'image',
      mimeType,
      bytes: stat.size,
      sha256,
      fileName,
      posterFileName: null,
      posterMime: null,
      tone: detectedTone,
      source,
      ...(workshopId ? { workshopId } : {}),
      ...(tags.length > 0 ? { tags } : {}),
      createdAt: new Date().toISOString(),
    };

    items.unshift(item);
    saveCatalog(items);
    return item;
  }

  async function storeUpload(buffer, meta = {}) {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      const err = new Error('Uploaded file is empty');
      err.statusCode = 400;
      throw err;
    }
    const tempPath = path.join(tmpUploadsDir, `single-${crypto.randomBytes(6).toString('hex')}.tmp`);
    try {
      fs.writeFileSync(tempPath, buffer);
      return await storeMediaFile(tempPath, meta);
    } finally {
      try { fs.unlinkSync(tempPath); } catch { /* ignore */ }
    }
  }

  async function importWallpaperEngineZipFile(zipFilePath, meta = {}) {
    const extracted = await extractWallpaperEngineVideoZip(zipFilePath, tmpUploadsDir, {
      maxExtractBytes: MAX_UPLOAD_BYTES,
    });
    try {
      let item = await storeMediaFile(extracted.videoTempPath, {
        originalName: extracted.title || extracted.videoFileName,
        tone: meta.tone,
        source: 'wallpaper-engine',
        workshopId: extracted.workshopId,
        tags: extracted.tags,
        requireVideo: true,
      });
      if (extracted.posterTempPath && fs.existsSync(extracted.posterTempPath)) {
        try {
          item = await storeMediaFile(extracted.posterTempPath, {
            posterOf: item.id,
            tone: meta.tone,
          });
        } catch {
          // Optional preview poster may be an unsupported format — keep imported video intact.
        }
      }
      return item;
    } finally {
      extracted.cleanup();
    }
  }

  function initChunkUpload(params = {}) {
    cleanupStaleUploads();
    const mode = VALID_UPLOAD_MODES.has(params.mode) ? params.mode : 'media';
    const totalBytes = Number(params.totalBytes);
    if (!Number.isFinite(totalBytes) || totalBytes <= 0) {
      const err = new Error('totalBytes must be a positive number');
      err.statusCode = 400;
      throw err;
    }
    if (totalBytes > MAX_UPLOAD_BYTES) {
      const err = new Error(`File exceeds the ${Math.round(MAX_UPLOAD_BYTES / (1024 * 1024))} MiB size limit`);
      err.statusCode = 413;
      throw err;
    }
    const uploadId = crypto.randomBytes(12).toString('hex');
    const partPath = path.join(tmpUploadsDir, `chunk-${uploadId}.part`);
    fs.writeFileSync(partPath, Buffer.alloc(0));

    const session = {
      uploadId,
      mode,
      totalBytes,
      receivedBytes: 0,
      partPath,
      meta: {
        originalName: typeof params.fileName === 'string' ? params.fileName : '',
        posterOf: typeof params.posterOf === 'string' ? params.posterOf : undefined,
        tone: params.tone === 'light' || params.tone === 'dark' ? params.tone : undefined,
        source: params.source === 'wallpaper-engine' ? 'wallpaper-engine' : 'local',
        workshopId: sanitizeWorkshopId(params.workshopId),
        tags: sanitizeTags(params.tags),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    uploadSessions.set(uploadId, session);
    return {
      uploadId,
      chunkSize: 8 * 1024 * 1024,
      maxUploadBytes: MAX_UPLOAD_BYTES,
    };
  }

  function getChunkSession(uploadId) {
    cleanupStaleUploads();
    if (!UPLOAD_ID_PATTERN.test(String(uploadId || ''))) {
      const err = new Error('Invalid upload ID');
      err.statusCode = 400;
      throw err;
    }
    const session = uploadSessions.get(uploadId);
    if (!session) {
      const err = new Error('Upload session not found or expired');
      err.statusCode = 404;
      throw err;
    }
    return session;
  }

  function appendUploadChunk(uploadId, reqStream, expectedOffset) {
    const session = getChunkSession(uploadId);
    if (Number.isFinite(expectedOffset) && expectedOffset !== session.receivedBytes) {
      const err = new Error(`Chunk offset mismatch (expected ${session.receivedBytes}, got ${expectedOffset})`);
      err.statusCode = 409;
      throw err;
    }

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(session.partPath, { flags: 'a' });
      let chunkBytes = 0;
      let settled = false;

      const fail = (err) => {
        if (settled) return;
        settled = true;
        reqStream.resume();
        writeStream.destroy();
        reject(err);
      };

      reqStream.on('data', (chunk) => {
        if (settled) return;
        chunkBytes += chunk.length;
        if (chunkBytes > MAX_CHUNK_BYTES) {
          fail(Object.assign(new Error(`Chunk exceeds ${Math.round(MAX_CHUNK_BYTES / (1024 * 1024))} MiB limit`), { statusCode: 413 }));
          return;
        }
        if (session.receivedBytes + chunkBytes > session.totalBytes || session.receivedBytes + chunkBytes > MAX_UPLOAD_BYTES) {
          fail(Object.assign(new Error('Upload exceeded declared size limit'), { statusCode: 413 }));
          return;
        }
        if (!writeStream.write(chunk)) {
          reqStream.pause();
          writeStream.once('drain', () => reqStream.resume());
        }
      });

      reqStream.on('error', fail);
      writeStream.on('error', fail);
      reqStream.on('end', () => {
        if (!settled) writeStream.end();
      });
      writeStream.on('finish', () => {
        if (settled) return;
        settled = true;
        session.receivedBytes += chunkBytes;
        session.updatedAt = Date.now();
        resolve({
          uploadId: session.uploadId,
          receivedBytes: session.receivedBytes,
          totalBytes: session.totalBytes,
        });
      });
    });
  }

  async function completeChunkUpload(uploadId, overrideMeta = {}) {
    const session = getChunkSession(uploadId);
    uploadSessions.delete(uploadId);
    try {
      if (session.receivedBytes !== session.totalBytes) {
        const err = new Error(`Incomplete upload (${session.receivedBytes}/${session.totalBytes} bytes received)`);
        err.statusCode = 400;
        throw err;
      }
      const mergedMeta = {
        ...session.meta,
        ...(overrideMeta.tone === 'light' || overrideMeta.tone === 'dark' ? { tone: overrideMeta.tone } : {}),
      };
      if (session.mode === 'we-zip') {
        return await importWallpaperEngineZipFile(session.partPath, mergedMeta);
      }
      return await storeMediaFile(session.partPath, mergedMeta);
    } finally {
      try { fs.unlinkSync(session.partPath); } catch { /* ignore */ }
    }
  }

  function abortChunkUpload(uploadId) {
    if (!UPLOAD_ID_PATTERN.test(String(uploadId || ''))) return false;
    const session = uploadSessions.get(uploadId);
    if (!session) return false;
    uploadSessions.delete(uploadId);
    try { fs.unlinkSync(session.partPath); } catch { /* ignore */ }
    return true;
  }

  function clearAllPendingUploads() {
    for (const [id, session] of uploadSessions.entries()) {
      uploadSessions.delete(id);
      try { fs.unlinkSync(session.partPath); } catch { /* ignore */ }
    }
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
    tmpUploadsDir,
    readConfig,
    readCatalog,
    updateConfig,
    storeUpload,
    storeMediaFile,
    importWallpaperEngineZipFile,
    initChunkUpload,
    appendUploadChunk,
    completeChunkUpload,
    abortChunkUpload,
    clearAllPendingUploads,
    deleteItem,
    resolveMediaFile,
    getStats,
  };
}

module.exports = {
  SCHEMA_VERSION,
  MAX_UPLOAD_BYTES,
  MAX_SINGLE_REQUEST_BYTES,
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

const crypto = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const presetsBundle = require('../shared/presets.json');
const { MAX_SINGLE_REQUEST_BYTES, createWallpaperStorage } = require('./storage.cjs');
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

function streamBodyToTempFile(req, tempPath, maxBytes) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(tempPath);
    let total = 0;
    let settled = false;

    const fail = (err) => {
      if (settled) return;
      settled = true;
      req.resume();
      writeStream.destroy();
      try { fs.unlinkSync(tempPath); } catch { /* ignore */ }
      reject(err);
    };

    req.on('data', (chunk) => {
      if (settled) return;
      total += chunk.length;
      if (total > maxBytes) {
        const err = new Error(`Request payload exceeds ${Math.round(maxBytes / (1024 * 1024))} MiB limit`);
        err.statusCode = 413;
        fail(err);
        return;
      }
      if (!writeStream.write(chunk)) {
        req.pause();
        writeStream.once('drain', () => req.resume());
      }
    });
    req.on('end', () => {
      if (!settled) writeStream.end();
    });
    req.on('error', fail);
    writeStream.on('error', fail);
    writeStream.on('finish', () => {
      if (settled) return;
      settled = true;
      resolve(total);
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

      if (method === 'POST' && pathname === '/wallpapers/upload/init') {
        const raw = await readBodyBuffer(req, 256 * 1024);
        const body = raw.length ? JSON.parse(raw.toString('utf8')) : {};
        const session = storage.initChunkUpload(body);
        sendJson(res, 201, session);
        return;
      }

      const chunkMatch = pathname.match(/^\/wallpapers\/upload\/([a-f0-9]{16,40})\/chunk$/);
      if (method === 'PUT' && chunkMatch) {
        const offsetParam = parsedUrl.searchParams.get('offset');
        const expectedOffset = offsetParam !== null ? Number.parseInt(offsetParam, 10) : NaN;
        const progress = await storage.appendUploadChunk(chunkMatch[1], req, expectedOffset);
        sendJson(res, 200, progress);
        return;
      }

      const completeMatch = pathname.match(/^\/wallpapers\/upload\/([a-f0-9]{16,40})\/complete$/);
      if (method === 'POST' && completeMatch) {
        const raw = await readBodyBuffer(req, 64 * 1024);
        const body = raw.length ? JSON.parse(raw.toString('utf8')) : {};
        const item = await storage.completeChunkUpload(completeMatch[1], body);
        ws.broadcast({ type: 'catalog_updated', itemId: item.id });
        sendJson(res, 201, { item, items: storage.readCatalog(), stats: storage.getStats() });
        return;
      }

      const abortMatch = pathname.match(/^\/wallpapers\/upload\/([a-f0-9]{16,40})$/);
      if (method === 'DELETE' && abortMatch) {
        storage.abortChunkUpload(abortMatch[1]);
        sendJson(res, 200, { aborted: true });
        return;
      }

      if (method === 'POST' && pathname === '/wallpapers/upload') {
        const tempPath = path.join(storage.tmpUploadsDir, `upload-${crypto.randomBytes(6).toString('hex')}.tmp`);
        try {
          await streamBodyToTempFile(req, tempPath, MAX_SINGLE_REQUEST_BYTES);
          const queryName = parsedUrl.searchParams.get('name');
          const rawHeaderName = req.headers['x-file-name'];
          let originalName = '';
          if (typeof queryName === 'string' && queryName) {
            originalName = queryName;
          } else if (typeof rawHeaderName === 'string' && rawHeaderName) {
            try { originalName = decodeURIComponent(rawHeaderName); } catch { originalName = rawHeaderName; }
          }
          const posterOf = parsedUrl.searchParams.get('posterOf') || undefined;
          const queryTone = parsedUrl.searchParams.get('tone');
          const rawTone = typeof queryTone === 'string' && queryTone
            ? queryTone.trim().toLowerCase()
            : typeof req.headers['x-media-tone'] === 'string'
              ? req.headers['x-media-tone'].trim().toLowerCase()
              : '';
          const tone = rawTone === 'light' || rawTone === 'dark' ? rawTone : undefined;
          const source = parsedUrl.searchParams.get('source') === 'wallpaper-engine' ? 'wallpaper-engine' : 'local';
          const workshopId = parsedUrl.searchParams.get('workshopId') || undefined;
          const rawTags = parsedUrl.searchParams.get('tags');
          const tags = rawTags ? rawTags.split(',').map((t) => t.trim()).filter(Boolean) : undefined;
          const item = await storage.storeMediaFile(tempPath, { originalName, posterOf, tone, source, workshopId, tags });
          ws.broadcast({ type: 'catalog_updated', itemId: item.id });
          sendJson(res, 201, { item, items: storage.readCatalog(), stats: storage.getStats() });
        } finally {
          try { fs.unlinkSync(tempPath); } catch { /* ignore */ }
        }
        return;
      }

      if (method === 'POST' && pathname === '/sources/wallpaper-engine/import-zip') {
        const tempPath = path.join(storage.tmpUploadsDir, `we-zip-${crypto.randomBytes(6).toString('hex')}.zip`);
        try {
          await streamBodyToTempFile(req, tempPath, MAX_SINGLE_REQUEST_BYTES);
          const rawTone = (parsedUrl.searchParams.get('tone') || '').trim().toLowerCase();
          const tone = rawTone === 'light' || rawTone === 'dark' ? rawTone : undefined;
          const item = await storage.importWallpaperEngineZipFile(tempPath, { tone });
          ws.broadcast({ type: 'catalog_updated', itemId: item.id });
          sendJson(res, 201, { item, items: storage.readCatalog(), stats: storage.getStats() });
        } finally {
          try { fs.unlinkSync(tempPath); } catch { /* ignore */ }
        }
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
      storage.clearAllPendingUploads();
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
