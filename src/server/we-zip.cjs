'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const MAX_ZIP_ENTRIES = 512;
const MAX_PROJECT_JSON_BYTES = 2 * 1024 * 1024; // 2 MiB
const MAX_POSTER_BYTES = 16 * 1024 * 1024; // 16 MiB
const DEFAULT_MAX_EXTRACT_BYTES = 256 * 1024 * 1024; // 256 MiB
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
