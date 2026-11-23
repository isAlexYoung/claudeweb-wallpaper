import { resolveSlotForTheme } from './store.mjs';

function mapObjectFit(fit) {
  if (fit === 'contain') return 'contain';
  if (fit === 'center') return 'none';
  return 'cover';
}

export function createBackgroundController(store) {
  let rootContainer = null;
  let hostRef = null;
  let unsubStore = null;
  let unsubContext = null;
  let visibilityHandler = null;
  let wsSocket = null;
  let wsReconnectTimer = null;
  let wsClosed = false;
  let renderSeq = 0;

  // Cache minted tickets by backend media path so slider drags never re-mint unnecessarily.
  const ticketCache = new Map();
  let renewalTimer = null;
  let activeVideoEl = null;
  let activeMediaKey = '';

  async function resolveTicketUrl(mediaPath, forceRefresh = false) {
    if (!hostRef) return null;
    const now = Date.now();
    const cached = ticketCache.get(mediaPath);
    if (!forceRefresh && cached && cached.expiresAt - now > 90_000) {
      return cached;
    }
    const ticket = await hostRef.media.createUrl(mediaPath, 10 * 60_000);
    ticketCache.set(mediaPath, ticket);
    return ticket;
  }

  function scheduleRenewal(mediaPath, expiresAt, onRenew) {
    if (renewalTimer) {
      clearTimeout(renewalTimer);
      renewalTimer = null;
    }
    const delay = Math.max(15_000, expiresAt - Date.now() - 90_000);
    renewalTimer = setTimeout(async () => {
      if (!hostRef || hostRef.signal.aborted) return;
      try {
        const fresh = await resolveTicketUrl(mediaPath, true);
        if (fresh) onRenew(fresh);
      } catch { /* ignore until next visibility or render */ }
    }, delay);
  }

  async function renderBackground() {
    if (!rootContainer || !hostRef) return;
    const seq = ++renderSeq;
    const config = store.getEffectiveConfig();
    const ctx = hostRef.context;
    const themeMode = ctx.themeMode || (ctx.theme === 'dark' ? 'dark' : 'warm');
    const slot = resolveSlotForTheme(config, themeMode);

    if (!config || config.scope === 'none' || !slot || slot.mediaType === 'none') {
      hostRef.surface?.clear();
      activeVideoEl = null;
      activeMediaKey = '';
      if (renewalTimer) {
        clearTimeout(renewalTimer);
        renewalTimer = null;
      }
      rootContainer.replaceChildren();
      return;
    }

    hostRef.surface?.setWallpaperVars({
      scope: config.scope,
      surfaceOpacity: slot.surfaceOpacity ?? 0.84,
      glassBlurPx: slot.glassBlurPx ?? 16,
    });

    const blurPx = Math.max(0, Math.min(32, Number(slot.blurPx) || 0));
    const filterCss = blurPx > 0 ? `blur(${blurPx}px)` : '';
    const transformCss = blurPx > 0 ? 'scale(1.06)' : '';
    const objectFit = mapObjectFit(slot.fit);
    const objectPos = `${slot.positionX ?? 50}% ${slot.positionY ?? 50}%`;
    const scrimIsDark = slot.scrimMode === 'dark'
      ? true
      : slot.scrimMode === 'light'
        ? false
        : themeMode === 'dark';
    const scrimOpacity = Math.max(0, Math.min(0.85, Number(slot.scrimOpacity) || 0));
    const scrimBg = scrimIsDark
      ? `rgba(10, 12, 16, ${scrimOpacity})`
      : `rgba(255, 255, 255, ${scrimOpacity})`;

    const nextMediaKey = `${slot.mediaType}:${slot.presetId || ''}:${slot.itemId || ''}:${ctx.reducedMotion ? 'rm' : 'anim'}`;

    // Fast path: if the same media element is already mounted, update visual styles in place without reloading video!
    if (nextMediaKey === activeMediaKey && rootContainer.firstElementChild) {
      const stage = rootContainer.firstElementChild;
      const mediaEl = stage.querySelector('[data-cw-wp-media]');
      const scrimEl = stage.querySelector('[data-cw-wp-scrim]');
      if (mediaEl) {
        mediaEl.style.objectFit = objectFit;
        mediaEl.style.objectPosition = objectPos;
        mediaEl.style.filter = filterCss;
        mediaEl.style.transform = transformCss;
        if (mediaEl.tagName === 'VIDEO') {
          mediaEl.playbackRate = Math.max(0.25, Math.min(2, Number(slot.videoPlaybackRate) || 1));
        }
      }
      if (scrimEl) {
        scrimEl.style.backgroundColor = scrimBg;
      }
      return;
    }

    const stage = document.createElement('div');
    stage.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;';

    let mediaEl = null;

    if (slot.mediaType === 'preset') {
      const preset = store.findPreset(slot.presetId);
      if (!preset) {
        hostRef.surface?.clear();
        rootContainer.replaceChildren();
        return;
      }
      mediaEl = document.createElement('div');
      mediaEl.dataset.cwWpMedia = 'preset';
      mediaEl.style.cssText = 'position:absolute;inset:0;transition:opacity 240ms ease;';
      mediaEl.style.background = preset.cssGradient;
      mediaEl.style.filter = filterCss;
      mediaEl.style.transform = transformCss;
    } else if (slot.mediaType === 'image' && slot.itemId) {
      const mediaPath = `/media/${slot.itemId}`;
      const ticket = await resolveTicketUrl(mediaPath);
      if (seq !== renderSeq || !hostRef || hostRef.signal.aborted || !ticket) return;
      const img = document.createElement('img');
      img.dataset.cwWpMedia = 'image';
      img.alt = '';
      img.decoding = 'async';
      img.src = ticket.url;
      img.style.cssText = 'width:100%;height:100%;display:block;transition:filter 160ms ease;';
      img.style.objectFit = objectFit;
      img.style.objectPosition = objectPos;
      img.style.filter = filterCss;
      img.style.transform = transformCss;
      img.addEventListener('error', async () => {
        if (seq !== renderSeq || !hostRef || hostRef.signal.aborted) return;
        try {
          const fresh = await resolveTicketUrl(mediaPath, true);
          if (fresh && img.isConnected) img.src = fresh.url;
        } catch { /* ignore */ }
      }, { once: true });
      mediaEl = img;
    } else if (slot.mediaType === 'video' && slot.itemId) {
      const item = store.findItem(slot.itemId);
      const mediaPath = `/media/${slot.itemId}`;
      const posterPath = item?.posterFileName ? `/media/${slot.itemId}/poster` : null;

      if (ctx.reducedMotion) {
        if (posterPath) {
          const posterTicket = await resolveTicketUrl(posterPath);
          if (seq !== renderSeq || !hostRef || hostRef.signal.aborted || !posterTicket) return;
          const img = document.createElement('img');
          img.dataset.cwWpMedia = 'video-poster';
          img.alt = '';
          img.src = posterTicket.url;
          img.style.cssText = 'width:100%;height:100%;display:block;';
          img.style.objectFit = objectFit;
          img.style.objectPosition = objectPos;
          img.style.filter = filterCss;
          img.style.transform = transformCss;
          mediaEl = img;
        } else {
          mediaEl = document.createElement('div');
          mediaEl.dataset.cwWpMedia = 'video-fallback';
          mediaEl.style.cssText = 'position:absolute;inset:0;background:hsl(var(--background));';
        }
      } else {
        const [videoTicket, posterTicket] = await Promise.all([
          resolveTicketUrl(mediaPath),
          posterPath ? resolveTicketUrl(posterPath).catch(() => null) : Promise.resolve(null),
        ]);
        if (seq !== renderSeq || !hostRef || hostRef.signal.aborted || !videoTicket) return;

        const video = document.createElement('video');
        video.dataset.cwWpMedia = 'video';
        video.src = videoTicket.url;
        if (posterTicket?.url) video.poster = posterTicket.url;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.playbackRate = Math.max(0.25, Math.min(2, Number(slot.videoPlaybackRate) || 1));
        video.style.cssText = 'width:100%;height:100%;display:block;';
        video.style.objectFit = objectFit;
        video.style.objectPosition = objectPos;
        video.style.filter = filterCss;
        video.style.transform = transformCss;

        let retried = false;
        video.addEventListener('error', async () => {
          if (retried || seq !== renderSeq || !hostRef || hostRef.signal.aborted) return;
          retried = true;
          try {
            const fresh = await resolveTicketUrl(mediaPath, true);
            if (fresh && video.isConnected) {
              const t = video.currentTime || 0;
              video.src = fresh.url;
              video.currentTime = t;
              void video.play().catch(() => {});
            }
          } catch { /* ignore */ }
        });

        scheduleRenewal(mediaPath, videoTicket.expiresAt, (fresh) => {
          ticketCache.set(mediaPath, fresh);
        });

        activeVideoEl = video;
        mediaEl = video;
      }
    }

    if (!mediaEl) {
      hostRef.surface?.clear();
      rootContainer.replaceChildren();
      return;
    }

    const scrimEl = document.createElement('div');
    scrimEl.dataset.cwWpScrim = '1';
    scrimEl.style.cssText = 'position:absolute;inset:0;transition:background-color 200ms ease;';
    scrimEl.style.backgroundColor = scrimBg;

    stage.appendChild(mediaEl);
    stage.appendChild(scrimEl);
    activeMediaKey = nextMediaKey;
    rootContainer.replaceChildren(stage);

    if (activeVideoEl && !document.hidden) {
      void activeVideoEl.play().catch(() => {});
    }
  }

  async function syncFromServer() {
    if (!hostRef || hostRef.signal.aborted) return;
    try {
      const data = await hostRef.rpc('GET', '/config');
      if (hostRef.signal.aborted) return;
      store.setServerSnapshot(data);
    } catch {
      /* backend may still be warming up */
    }
  }

  function connectSyncSocket(attempt = 0) {
    if (wsClosed || !hostRef || hostRef.signal.aborted) return;
    try {
      const sock = hostRef.ws.connect();
      wsSocket = sock;
      sock.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'config_updated' && msg.config) {
            store.setSavedConfig(msg.config);
          } else if (msg.type === 'catalog_updated') {
            void syncFromServer();
          }
        } catch { /* ignore malformed frame */ }
      };
      sock.onclose = () => {
        if (wsClosed || !hostRef || hostRef.signal.aborted) return;
        const delay = Math.min(15_000, 1500 * Math.pow(1.6, Math.min(attempt, 6)));
        wsReconnectTimer = setTimeout(() => connectSyncSocket(attempt + 1), delay);
      };
    } catch { /* ignore if ws unavailable */ }
  }

  return {
    async mount(container, host) {
      rootContainer = container;
      hostRef = host;
      wsClosed = false;
      activeMediaKey = '';

      unsubStore = store.subscribe(() => {
        void renderBackground();
      });
      unsubContext = host.onContextChange(() => {
        void renderBackground();
      });

      visibilityHandler = () => {
        if (!activeVideoEl) return;
        if (document.hidden) activeVideoEl.pause();
        else void activeVideoEl.play().catch(() => {});
      };
      document.addEventListener('visibilitychange', visibilityHandler);

      await syncFromServer();
      void renderBackground();
      connectSyncSocket();
    },

    unmount(container) {
      wsClosed = true;
      renderSeq += 1;
      if (wsReconnectTimer) {
        clearTimeout(wsReconnectTimer);
        wsReconnectTimer = null;
      }
      if (renewalTimer) {
        clearTimeout(renewalTimer);
        renewalTimer = null;
      }
      if (wsSocket) {
        try { wsSocket.close(); } catch { /* ignore */ }
        wsSocket = null;
      }
      if (visibilityHandler) {
        document.removeEventListener('visibilitychange', visibilityHandler);
        visibilityHandler = null;
      }
      unsubStore?.();
      unsubStore = null;
      unsubContext?.();
      unsubContext = null;
      activeVideoEl = null;
      activeMediaKey = '';
      ticketCache.clear();
      hostRef?.surface?.clear();
      if (container) container.replaceChildren();
      rootContainer = null;
      hostRef = null;
    },
  };
}
