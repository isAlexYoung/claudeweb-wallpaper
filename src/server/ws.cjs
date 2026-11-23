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
