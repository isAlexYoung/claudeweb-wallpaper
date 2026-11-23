#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
fs.mkdirSync(distDir, { recursive: true });

function readLf(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8').replace(/\r\n/g, '\n');
}

function sha256(text) {
  return `sha256-${crypto.createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex')}`;
}

// 1. Build single-file browser ESM bundle (dist/index.js)
function stripInternalImportsAndExports(source, keepExports = false) {
  const withoutImports = source.replace(/^import\s+[^;\n]+from\s+['"]\.\/[^'"]+['"];?\n?/gm, '');
  if (keepExports) return withoutImports.trim();
  return withoutImports.replace(/^export\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/gm, '').trim();
}

const clientBundle = [
  '// Built by scripts/build.mjs — zero-dependency ClaudeWeb Plugin Host v2 frontend bundle.',
  stripInternalImportsAndExports(readLf('src/client/i18n.mjs')),
  stripInternalImportsAndExports(readLf('src/client/store.mjs')),
  stripInternalImportsAndExports(readLf('src/client/background.mjs')),
  stripInternalImportsAndExports(readLf('src/client/settings.mjs')),
  stripInternalImportsAndExports(readLf('src/client/index.mjs'), true),
  '',
].join('\n\n');

const clientDistPath = path.join(distDir, 'index.js');
fs.writeFileSync(clientDistPath, clientBundle, 'utf8');

// 2. Build single-file Node CJS backend bundle (dist/server.cjs)
const presetsJson = readLf('src/shared/presets.json').trim();
const storageSrc = readLf('src/server/storage.cjs');
const wsSrc = readLf('src/server/ws.cjs');
const indexSrc = readLf('src/server/index.cjs');

const serverBundle = `'use strict';
// Built by scripts/build.mjs — zero-dependency ClaudeWeb Plugin Host v2 backend bundle.

const __modules = {
  '../shared/presets.json': (module) => {
    module.exports = ${presetsJson};
  },
  './storage.cjs': (module, exports, require) => {
${storageSrc}
  },
  './ws.cjs': (module, exports, require) => {
${wsSrc}
  },
  './index.cjs': (module, exports, require) => {
${indexSrc}
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
`;

const serverDistPath = path.join(distDir, 'server.cjs');
fs.writeFileSync(serverDistPath, serverBundle.replace(/\r\n/g, '\n'), 'utf8');

// 3. Stamp SHA-256 build.integrity hashes into manifest.json
const manifestPath = path.join(root, 'manifest.json');
const manifest = JSON.parse(readLf('manifest.json'));
manifest.build = {
  mode: 'prebuilt',
  integrity: {
    'dist/index.js': sha256(fs.readFileSync(clientDistPath, 'utf8')),
    'dist/server.cjs': sha256(fs.readFileSync(serverDistPath, 'utf8')),
  },
};
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log('Built dist/index.js & dist/server.cjs and updated manifest.json integrity hashes.');
