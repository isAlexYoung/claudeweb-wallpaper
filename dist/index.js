// Built by scripts/build.mjs — zero-dependency ClaudeWeb Plugin Host v2 frontend bundle.

const MESSAGES = {
  en: {
    scopeTitle: 'Coverage Scope',
    scopeNone: 'Off',
    scopeChat: 'Chat Only',
    scopeWorkspace: 'Full Workspace',
    scopeHint: 'Full Workspace renders the wallpaper edge-to-edge behind a frosted translucent sidebar, floating header, and composer while keeping editors and terminals solid.',
    themeBinding: 'Per-Theme Wallpapers',
    themeBindingHint: 'Bind separate wallpapers and glass effects for Warm, Light, and Dark themes.',
    themeWarm: 'Warm',
    themeLight: 'Light',
    themeDark: 'Dark',
    presetsTitle: 'Built-in Presets',
    uploadsTitle: 'My Wallpapers',
    uploadBtn: 'Upload Image / Video',
    uploading: 'Uploading…',
    uploadingProgress: 'Uploading {{percent}}% ({{loaded}} / {{total}})',
    uploadHint: 'PNG, JPG, WebP, AVIF, GIF, MP4, WebM, or Wallpaper Engine .zip (max 256 MB)',
    noUploads: 'No uploaded wallpapers yet.',
    deleteItem: 'Delete',
    weSectionTitle: 'Wallpaper Engine (Video)',
    weSelectFolder: 'Select Folder / 431960',
    weImportZip: 'Import .zip Package',
    weFolderHint: 'Pick a single Wallpaper Engine video folder or your entire Steam steamapps/workshop/content/431960 folder — scanned locally in your browser before uploading.',
    weScanning: 'Scanning folder…',
    weFoundCount: 'Found {{count}} Video wallpaper(s)',
    weSkippedSummary: 'Skipped {{details}} (Video MP4/WebM only)',
    weImportBtn: 'Import',
    weImportedBtn: 'Imported',
    weClearList: 'Clear',
    weNoVideosInFolder: 'No Wallpaper Engine Video (MP4/WebM) folders found in the selected directory.',
    weUnsupportedTypeErr: '“{{title}}” is a {{type}} wallpaper. Currently only Video (MP4/WebM) Wallpaper Engine packages are supported.',
    weUnsupportedContainerErr: '“{{title}}” uses an unsupported video format ({{file}}). Browsers natively support MP4 and WebM.',
    weImportedToast: 'Imported Wallpaper Engine video: {{title}}',
    weBadge: 'WE · VIDEO',
    effectsTitle: 'Appearance & Glass Effects',
    resetEffects: 'Reset Glass',
    glassTone: 'Glass & Text Style',
    glassToneAuto: 'Auto',
    glassToneDark: 'Dark Glass',
    glassToneLight: 'Light Glass',
    fit: 'Image / Video Fit',
    fitCover: 'Cover',
    fitContain: 'Contain',
    fitCenter: 'Center',
    positionX: 'Horizontal Focus',
    positionY: 'Vertical Focus',
    blur: 'Wallpaper Blur',
    scrimOpacity: 'Dimming Scrim',
    scrimMode: 'Scrim Tint',
    scrimAuto: 'Auto',
    scrimLight: 'Light',
    scrimDark: 'Dark',
    surfaceOpacity: 'Glass Surface Opacity',
    glassBlur: 'Glass Blur',
    videoSpeed: 'Video Playback Speed',
    loginTitle: 'Login Screen Wallpaper',
    loginEnable: 'Apply to Login Screen',
    loginHint: 'Publishes a host-verified, non-sensitive media snapshot to the login and loading screens. Turning this off clears it immediately.',
    loginMode: 'Login Theme Mode',
    loginSingle: 'Single (Fixed)',
    loginPerTheme: 'Match Theme (Warm/Light/Dark)',
    loginCardOpacity: 'Login Card Opacity',
    weTitle: 'Wallpaper Engine Support (Video)',
    weSupported: 'Supported:',
    weUnsupported: 'Not supported:',
    backupTitle: 'Backup & Restore',
    exportConfig: 'Export Config',
    importConfig: 'Import Config',
    resetDefaults: 'Reset',
    discard: 'Discard',
    save: 'Save & Apply',
    saving: 'Saving…',
    savedToast: 'Wallpaper settings saved.',
    loginSyncedToast: 'Wallpaper & login screen updated.',
    conflictMsg: 'Settings were updated in another tab or device.',
    reloadLatest: 'Reload Latest',
    overwrite: 'Overwrite',
    unsavedBadge: 'Previewing unsaved changes',
    videoBadge: 'VIDEO',
    imageBadge: 'IMAGE',
    storageUsage: '{{count}} files · {{size}}',
  },
  zh: {
    scopeTitle: '壁纸覆盖范围',
    scopeNone: '关闭',
    scopeChat: '仅对话区',
    scopeWorkspace: '全局工作区',
    scopeHint: '全局工作区会让壁纸铺满整窗，侧边栏、浮空顶栏与输入框自动呈现通透毛玻璃效果，同时保持代码编辑器与终端完全清晰不透明。',
    themeBinding: '按主题独立设置壁纸',
    themeBindingHint: '为暖白、浅色、深色三套主题分别绑定不同的壁纸与毛玻璃参数。',
    themeWarm: '暖白',
    themeLight: '浅色',
    themeDark: '深色',
    presetsTitle: '内置主题预设',
    uploadsTitle: '我的壁纸库',
    uploadBtn: '上传图片 / 视频',
    uploading: '上传中…',
    uploadingProgress: '上传中 {{percent}}%（{{loaded}} / {{total}}）',
    uploadHint: '支持 PNG、JPG、WebP、AVIF、GIF、MP4、WebM 或 Wallpaper Engine .zip 包（最大 256 MB）',
    noUploads: '尚未上传自定义壁纸。',
    deleteItem: '删除',
    weSectionTitle: 'Wallpaper Engine（视频壁纸）',
    weSelectFolder: '选择壁纸文件夹 / 431960',
    weImportZip: '导入 .zip 工程包',
    weFolderHint: '可直接选择单个壁纸目录，或直接选整个 Steam steamapps/workshop/content/431960 目录；浏览器先本地扫描预览，点击导入才上传。',
    weScanning: '正在扫描文件夹…',
    weFoundCount: '发现 {{count}} 个视频壁纸',
    weSkippedSummary: '已跳过 {{details}}（当前仅支持 MP4/WebM 视频壁纸）',
    weImportBtn: '导入',
    weImportedBtn: '已导入',
    weClearList: '清空',
    weNoVideosInFolder: '所选目录中未发现 Wallpaper Engine 视频壁纸（需含 project.json 且为 MP4/WebM）。',
    weUnsupportedTypeErr: '「{{title}}」为 {{type}} 类型壁纸，当前仅支持视频类（Video，MP4/WebM）工程包。',
    weUnsupportedContainerErr: '「{{title}}」的视频封装格式不受浏览器支持（{{file}}），目前仅支持 MP4 与 WebM。',
    weImportedToast: '已导入 Wallpaper Engine 视频壁纸：{{title}}',
    weBadge: 'WE · 视频',
    effectsTitle: '显示与毛玻璃调节',
    resetEffects: '恢复毛玻璃默认',
    glassTone: '毛玻璃与文字风格',
    glassToneAuto: '自动匹配',
    glassToneDark: '深色毛玻璃',
    glassToneLight: '浅色毛玻璃',
    fit: '填充方式',
    fitCover: '铺满裁剪 (Cover)',
    fitContain: '完整适应 (Contain)',
    fitCenter: '居中 (Center)',
    positionX: '水平焦点',
    positionY: '垂直焦点',
    blur: '背景模糊度',
    scrimOpacity: '护眼遮罩浓度',
    scrimMode: '遮罩色调',
    scrimAuto: '跟随主题',
    scrimLight: '浅色',
    scrimDark: '深色',
    surfaceOpacity: '毛玻璃不透明度',
    glassBlur: '毛玻璃模糊度',
    videoSpeed: '视频倍速',
    loginTitle: '登录页壁纸',
    loginEnable: '同步到登录页与加载页',
    loginHint: '仅发布经过宿主校验的无敏感信息快照，关闭后会立即清除登录页壁纸。',
    loginMode: '登录页主题模式',
    loginSingle: '固定单张',
    loginPerTheme: '按暖白/浅色/深色匹配',
    loginCardOpacity: '登录卡片不透明度',
    weTitle: 'Wallpaper Engine 支持说明（视频类）',
    weSupported: '已支持：',
    weUnsupported: '暂不支持：',
    backupTitle: '配置备份与恢复',
    exportConfig: '导出配置',
    importConfig: '导入配置',
    resetDefaults: '恢复默认',
    discard: '撤销预览',
    save: '保存并生效',
    saving: '保存中…',
    savedToast: '壁纸配置已保存。',
    loginSyncedToast: '壁纸与登录页快照已同步更新。',
    conflictMsg: '检测到其他标签页或设备修改了壁纸配置。',
    reloadLatest: '加载最新配置',
    overwrite: '覆盖保存',
    unsavedBadge: '正在实时预览未保存的修改',
    videoBadge: '视频',
    imageBadge: '图片',
    storageUsage: '{{count}} 个文件 · {{size}}',
  },
};

function createTranslator(getLocale) {
  return function t(key, vars) {
    const locale = String(getLocale() || 'en').toLowerCase();
    const dict = locale.startsWith('zh') ? MESSAGES.zh : MESSAGES.en;
    let text = dict[key] ?? MESSAGES.en[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replaceAll(`{{${k}}}`, String(v));
      }
    }
    return text;
  };
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function resolveSlotForTheme(config, themeMode) {
  if (!config || config.scope === 'none') return null;
  if (!config.perTheme) return config.shared || null;
  const key = themeMode === 'dark' || themeMode === 'light' || themeMode === 'warm' ? themeMode : 'warm';
  return config.themes?.[key] || config.shared || null;
}

function createWallpaperStore() {
  const state = {
    loaded: false,
    savedConfig: null,
    previewConfig: null,
    items: [],
    presets: [],
    stats: null,
    wallpaperEngine: null,
  };
  const listeners = new Set();

  function emit() {
    for (const cb of listeners) {
      try { cb(state); } catch { /* isolate subscriber errors */ }
    }
  }

  return {
    getState() {
      return state;
    },

    getEffectiveConfig() {
      return state.previewConfig || state.savedConfig;
    },

    setServerSnapshot(data) {
      if (data.config) state.savedConfig = deepClone(data.config);
      if (Array.isArray(data.items)) state.items = data.items;
      if (Array.isArray(data.presets)) state.presets = data.presets;
      if (data.stats) state.stats = data.stats;
      if (data.wallpaperEngine) state.wallpaperEngine = data.wallpaperEngine;
      state.loaded = true;
      emit();
    },

    setSavedConfig(config) {
      state.savedConfig = deepClone(config);
      emit();
    },

    setCatalog(items, stats) {
      if (Array.isArray(items)) state.items = items;
      if (stats) state.stats = stats;
      emit();
    },

    setPreviewConfig(draft) {
      state.previewConfig = draft ? deepClone(draft) : null;
      emit();
    },

    findPreset(presetId) {
      return state.presets.find((p) => p.id === presetId) || null;
    },

    findItem(itemId) {
      return state.items.find((i) => i.id === itemId) || null;
    },

    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    reset() {
      state.previewConfig = null;
      listeners.clear();
    },
  };
}

function mapObjectFit(fit) {
  if (fit === 'contain') return 'contain';
  if (fit === 'center') return 'none';
  return 'cover';
}

function resolveGlassTone(slot, store, themeMode) {
  if (slot.glassTone === 'dark' || slot.glassTone === 'light') {
    return slot.glassTone;
  }
  if (slot.mediaType === 'preset') {
    const preset = store.findPreset(slot.presetId);
    if (preset?.tone === 'dark' || preset?.tone === 'light') return preset.tone;
    return preset?.recommendedTheme === 'dark' ? 'dark' : 'light';
  }
  if (slot.mediaType === 'image' || slot.mediaType === 'video') {
    const item = store.findItem(slot.itemId);
    if (item?.tone === 'dark' || item?.tone === 'light') return item.tone;
    // Vivid photos and videos default to DSH smoked dark glass for crisp white text contrast.
    return 'dark';
  }
  return themeMode === 'dark' ? 'dark' : 'light';
}

function createBackgroundController(store) {
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

    const glassTone = resolveGlassTone(slot, store, themeMode);
    hostRef.surface?.setWallpaperVars({
      scope: config.scope,
      surfaceOpacity: slot.surfaceOpacity ?? 0.36,
      glassBlurPx: slot.glassBlurPx ?? 20,
      tone: glassTone,
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
        : glassTone === 'dark';
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

const PANEL_CSS = `
.cwwp-root { display:flex; flex-direction:column; height:100%; font-size:13px; color:hsl(var(--foreground)); }
.cwwp-scroll { flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:18px; }
.cwwp-sec { display:flex; flex-direction:column; gap:10px; }
.cwwp-sec-head { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.cwwp-sec-title { font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; color:hsl(var(--muted-foreground)); margin:0; }
.cwwp-hint { font-size:12px; color:hsl(var(--muted-foreground)); line-height:1.45; margin:0; }
.cwwp-seg { display:grid; grid-auto-flow:column; grid-auto-columns:1fr; gap:4px; padding:3px; border-radius:9px; background:hsl(var(--muted)); }
.cwwp-seg button { border:0; background:transparent; color:hsl(var(--muted-foreground)); padding:6px 8px; border-radius:7px; font-size:12px; font-weight:500; cursor:pointer; transition:all 120ms ease; }
.cwwp-seg button[aria-pressed="true"] { background:hsl(var(--background)); color:hsl(var(--foreground)); box-shadow:0 1px 3px rgba(0,0,0,0.1); }
.cwwp-row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
.cwwp-switch { display:inline-flex; align-items:center; gap:8px; cursor:pointer; user-select:none; }
.cwwp-switch input { width:15px; height:15px; accent-color:hsl(var(--primary)); cursor:pointer; }
.cwwp-presets { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:8px; }
.cwwp-preset { position:relative; border:1px solid hsl(var(--border)); border-radius:10px; overflow:hidden; padding:0; cursor:pointer; background:transparent; text-align:left; transition:transform 120ms ease, border-color 120ms ease; }
.cwwp-preset:hover { transform:translateY(-1px); }
.cwwp-preset[data-selected="true"] { border-color:hsl(var(--primary)); box-shadow:0 0 0 2px hsl(var(--primary) / 0.28); }
.cwwp-preset-swatch { height:46px; width:100%; display:block; }
.cwwp-preset-name { display:block; padding:4px 6px; font-size:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:hsl(var(--foreground)); background:hsl(var(--background)); }
.cwwp-drop { border:1px dashed hsl(var(--border)); border-radius:10px; padding:12px; text-align:center; background:hsl(var(--muted) / 0.35); transition:border-color 120ms ease, background 120ms ease; }
.cwwp-drop[data-over="true"] { border-color:hsl(var(--primary)); background:hsl(var(--primary) / 0.08); }
.cwwp-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:6px 12px; border-radius:8px; border:1px solid hsl(var(--border)); background:hsl(var(--background)); color:hsl(var(--foreground)); font-size:12px; font-weight:500; cursor:pointer; transition:background 120ms ease, opacity 120ms ease; }
.cwwp-btn:hover:not(:disabled) { background:hsl(var(--muted)); }
.cwwp-btn:disabled { opacity:0.45; cursor:not-allowed; }
.cwwp-btn-primary { background:hsl(var(--foreground)); color:hsl(var(--background)); border-color:transparent; }
.cwwp-btn-primary:hover:not(:disabled) { opacity:0.9; background:hsl(var(--foreground)); }
.cwwp-btn-danger { color:#dc2626; border-color:rgba(220,38,38,0.3); }
.cwwp-gallery { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:8px; }
.cwwp-item { position:relative; border:1px solid hsl(var(--border)); border-radius:10px; overflow:hidden; background:hsl(var(--muted) / 0.4); display:flex; flex-direction:column; }
.cwwp-item[data-selected="true"] { border-color:hsl(var(--primary)); box-shadow:0 0 0 2px hsl(var(--primary) / 0.28); }
.cwwp-item-thumb { position:relative; height:76px; width:100%; background:hsl(var(--muted)); overflow:hidden; cursor:pointer; border:0; padding:0; }
.cwwp-item-thumb img, .cwwp-item-thumb video { width:100%; height:100%; object-fit:cover; display:block; }
.cwwp-badge { position:absolute; top:5px; left:5px; font-size:10px; font-weight:600; padding:1px 5px; border-radius:4px; background:rgba(0,0,0,0.62); color:#fff; letter-spacing:0.03em; }
.cwwp-item-meta { display:flex; align-items:center; justify-content:space-between; gap:6px; padding:5px 7px; font-size:11px; }
.cwwp-item-name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:hsl(var(--foreground)); }
.cwwp-item-del { border:0; background:transparent; color:hsl(var(--muted-foreground)); font-size:11px; cursor:pointer; padding:2px 4px; border-radius:4px; flex-shrink:0; }
.cwwp-item-del:hover { color:#dc2626; background:rgba(220,38,38,0.1); }
.cwwp-sliders { display:flex; flex-direction:column; gap:10px; padding:12px; border:1px solid hsl(var(--border)); border-radius:10px; background:hsl(var(--muted) / 0.2); }
.cwwp-slider { display:flex; flex-direction:column; gap:4px; }
.cwwp-slider-head { display:flex; justify-content:space-between; font-size:12px; }
.cwwp-slider-val { font-variant-numeric:tabular-nums; color:hsl(var(--muted-foreground)); }
.cwwp-slider input[type="range"] { width:100%; accent-color:hsl(var(--primary)); cursor:pointer; }
.cwwp-card { border:1px solid hsl(var(--border)); border-radius:10px; padding:12px; display:flex; flex-direction:column; gap:10px; background:hsl(var(--muted) / 0.2); }
.cwwp-details summary { cursor:pointer; font-size:12px; font-weight:500; color:hsl(var(--muted-foreground)); }
.cwwp-details ul { margin:6px 0 0; padding-left:18px; font-size:11.5px; color:hsl(var(--muted-foreground)); line-height:1.5; }
.cwwp-banner { padding:9px 12px; border-radius:8px; border:1px solid rgba(245,158,11,0.4); background:rgba(245,158,11,0.12); font-size:12px; display:flex; flex-direction:column; gap:8px; }
.cwwp-error { padding:8px 10px; border-radius:8px; border:1px solid rgba(239,68,68,0.35); background:rgba(239,68,68,0.1); color:#ef4444; font-size:12px; }
.cwwp-footer { flex-shrink:0; border-top:1px solid hsl(var(--border)); padding:12px 16px; display:flex; flex-direction:column; gap:8px; background:hsl(var(--background)); }
.cwwp-footer-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.cwwp-dirty-pill { font-size:11px; color:#d97706; font-weight:500; }
.cwwp-progress-wrap { display:flex; flex-direction:column; gap:5px; padding:8px 10px; border-radius:8px; border:1px solid hsl(var(--border)); background:hsl(var(--muted) / 0.35); }
.cwwp-progress-text { font-size:11.5px; color:hsl(var(--foreground)); font-variant-numeric:tabular-nums; }
.cwwp-progress-track { height:5px; width:100%; border-radius:999px; background:hsl(var(--border)); overflow:hidden; }
.cwwp-progress-bar { height:100%; background:hsl(var(--primary)); border-radius:inherit; transition:width 120ms ease; }
.cwwp-we-actions { display:flex; flex-wrap:wrap; gap:8px; }
.cwwp-we-list { display:flex; flex-direction:column; gap:8px; max-height:240px; overflow-y:auto; padding-right:2px; }
.cwwp-we-row { display:flex; align-items:center; gap:10px; padding:6px; border:1px solid hsl(var(--border)); border-radius:8px; background:hsl(var(--background)); }
.cwwp-we-thumb { width:58px; height:38px; border-radius:6px; overflow:hidden; flex-shrink:0; background:hsl(var(--muted)); display:grid; place-items:center; font-size:10px; color:hsl(var(--muted-foreground)); }
.cwwp-we-thumb img { width:100%; height:100%; object-fit:cover; display:block; }
.cwwp-we-info { min-width:0; flex:1; display:flex; flex-direction:column; gap:2px; }
.cwwp-we-name { font-size:12px; font-weight:500; color:hsl(var(--foreground)); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cwwp-we-sub { font-size:11px; color:hsl(var(--muted-foreground)); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cwwp-badge-we { background:rgba(37,99,235,0.82); }
`;

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectImageBlobTone(blob) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      let done = false;
      const finish = (tone) => {
        if (done) return;
        done = true;
        URL.revokeObjectURL(url);
        resolve(tone);
      };
      const timer = setTimeout(() => finish(null), 3000);
      img.onload = () => {
        try {
          const size = 32;
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) { clearTimeout(timer); finish(null); return; }
          ctx.drawImage(img, 0, 0, size, size);
          const data = ctx.getImageData(0, 0, size, size).data;
          let sum = 0;
          let count = 0;
          for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3] / 255;
            if (alpha < 0.1) continue;
            sum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
            count += 1;
          }
          clearTimeout(timer);
          if (count === 0) { finish(null); return; }
          finish((sum / count) > 168 ? 'light' : 'dark');
        } catch {
          clearTimeout(timer);
          finish(null);
        }
      };
      img.onerror = () => { clearTimeout(timer); finish(null); };
      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

function captureVideoPosterBlob(file) {
  return new Promise((resolve) => {
    try {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';
      let done = false;
      const finish = (blob) => {
        if (done) return;
        done = true;
        URL.revokeObjectURL(url);
        resolve(blob);
      };
      const timer = setTimeout(() => finish(null), 5000);
      video.onloadeddata = () => {
        try {
          const width = Math.min(1280, video.videoWidth || 640);
          const height = Math.max(1, Math.round(width * ((video.videoHeight || 360) / Math.max(1, video.videoWidth || 640))));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) { clearTimeout(timer); finish(null); return; }
          ctx.drawImage(video, 0, 0, width, height);
          canvas.toBlob((blob) => {
            clearTimeout(timer);
            finish(blob);
          }, 'image/jpeg', 0.82);
        } catch {
          clearTimeout(timer);
          finish(null);
        }
      };
      video.onerror = () => { clearTimeout(timer); finish(null); };
      video.src = url;
    } catch {
      resolve(null);
    }
  });
}

async function sniffBrowserVideoMime(file) {
  try {
    const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
    if (head.length < 12) return null;
    if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) {
      return 'video/webm';
    }
    const ftyp = String.fromCharCode(head[4], head[5], head[6], head[7]);
    if (ftyp === 'ftyp') {
      const brand = String.fromCharCode(head[8], head[9], head[10], head[11]);
      if (brand !== 'avif' && brand !== 'avis') {
        return 'video/mp4';
      }
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeRelPath(p) {
  return String(p || '').replace(/\\/g, '/').replace(/^\/+/, '');
}

async function scanWallpaperEngineFolderFiles(fileList) {
  const files = Array.from(fileList || []);
  const folderMap = new Map();
  const projectJsonDirs = [];

  for (const file of files) {
    const rel = normalizeRelPath(file.webkitRelativePath || file.name);
    const parts = rel.split('/');
    const baseName = parts[parts.length - 1] || '';
    const dir = parts.slice(0, -1).join('/');
    if (!folderMap.has(dir)) folderMap.set(dir, []);
    folderMap.get(dir).push({ file, rel, baseName });
    if (baseName.toLowerCase() === 'project.json') {
      projectJsonDirs.push({ dir, file });
    }
  }

  const candidates = [];
  const skippedByType = {};
  const unsupportedContainers = [];

  // Map every file by full normalized path (exact & lower) for nested relative lookups inside each workshop folder.
  const allByRelLower = new Map();
  for (const file of files) {
    allByRelLower.set(normalizeRelPath(file.webkitRelativePath || file.name).toLowerCase(), file);
  }

  for (const projEntry of projectJsonDirs) {
    let project;
    try {
      const rawText = (await projEntry.file.text()).replace(/^\uFEFF/, '');
      project = JSON.parse(rawText);
    } catch {
      continue;
    }
    if (!project || typeof project !== 'object') continue;

    const rawType = typeof project.type === 'string' ? project.type.trim().toLowerCase() : 'unknown';
    const dirSegments = projEntry.dir.split('/').filter(Boolean);
    const folderName = dirSegments[dirSegments.length - 1] || '';
    const title = typeof project.title === 'string' && project.title.trim()
      ? project.title.trim().slice(0, 80)
      : folderName || 'Wallpaper';

    if (rawType !== 'video') {
      skippedByType[rawType] = (skippedByType[rawType] || 0) + 1;
      if (projectJsonDirs.length === 1) {
        candidates.push({ rejected: 'type', type: rawType, title });
      }
      continue;
    }

    const declaredFile = typeof project.file === 'string' ? normalizeRelPath(project.file.trim()) : '';
    if (!declaredFile) continue;
    const videoRel = projEntry.dir ? `${projEntry.dir}/${declaredFile}` : declaredFile;
    const videoFile = allByRelLower.get(videoRel.toLowerCase());
    if (!videoFile) continue;

    const sniffedMime = await sniffBrowserVideoMime(videoFile);
    if (!sniffedMime) {
      unsupportedContainers.push({ title, file: declaredFile });
      if (projectJsonDirs.length === 1) {
        candidates.push({ rejected: 'container', file: declaredFile, title });
      }
      continue;
    }

    let previewFile = null;
    if (typeof project.preview === 'string' && project.preview.trim()) {
      const previewRel = projEntry.dir
        ? `${projEntry.dir}/${normalizeRelPath(project.preview.trim())}`
        : normalizeRelPath(project.preview.trim());
      previewFile = allByRelLower.get(previewRel.toLowerCase()) || null;
    }

    const workshopId = project.workshopid !== undefined && project.workshopid !== null
      ? String(project.workshopid).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32)
      : (/^\d{6,16}$/.test(folderName) ? folderName : null);
    const tags = Array.isArray(project.tags)
      ? project.tags.filter((x) => typeof x === 'string' && x.trim()).map((x) => x.trim().slice(0, 24)).slice(0, 8)
      : [];

    candidates.push({
      id: `${projEntry.dir || title}::${videoFile.size}`,
      title,
      workshopId: workshopId || null,
      tags,
      videoFile,
      videoMime: sniffedMime,
      previewFile,
      previewUrl: previewFile ? URL.createObjectURL(previewFile) : null,
      bytes: videoFile.size,
      importedItemId: null,
    });
  }

  return {
    totalFolders: projectJsonDirs.length,
    candidates,
    skippedByType,
    unsupportedContainers,
  };
}

function createSettingsController(store) {
  let rootContainer = null;
  let hostRef = null;
  let draft = null;
  let activeThemeTab = 'warm';
  let dirty = false;
  let saving = false;
  let uploading = false;
  let scanningWe = false;
  let uploadProgress = null; // { label, percent, loaded, total }
  let activeUploadId = null;
  let weDiscovered = []; // Array of discovered local WE video candidates
  let weSkippedNote = '';
  let errorMsg = null;
  let conflictServerConfig = null;
  let unsubContext = null;
  let unsubStore = null;
  let discardBtnRef = null;
  let dirtyPillRef = null;
  let progressTextRef = null;
  let progressBarRef = null;
  const thumbUrls = new Map();

  function revokeWePreviewUrls() {
    for (const c of weDiscovered) {
      if (c.previewUrl) {
        try { URL.revokeObjectURL(c.previewUrl); } catch { /* ignore */ }
      }
    }
    weDiscovered = [];
    weSkippedNote = '';
  }

  function updateProgressUi(loaded, total) {
    const percent = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
    uploadProgress = { percent, loaded, total };
    if (progressTextRef && progressBarRef) {
      progressTextRef.textContent = t('uploadingProgress', {
        percent,
        loaded: formatBytes(loaded),
        total: formatBytes(total),
      });
      progressBarRef.style.width = `${percent}%`;
    }
  }

  function markSliderDirty() {
    dirty = true;
    hostRef?.ui?.setPanelDirty?.(true);
    if (discardBtnRef) discardBtnRef.disabled = saving;
    if (dirtyPillRef) dirtyPillRef.style.display = 'block';
    store.setPreviewConfig(draft);
  }

  function getLocale() {
    return hostRef?.context?.locale || 'en';
  }

  const t = createTranslator(getLocale);

  function getActiveSlot(cfg) {
    if (!cfg) return null;
    return cfg.perTheme ? cfg.themes[activeThemeTab] : cfg.shared;
  }

  function updateDraft(mutator) {
    if (!draft) return;
    mutator(draft);
    dirty = true;
    errorMsg = null;
    hostRef?.ui?.setPanelDirty?.(true);
    store.setPreviewConfig(draft);
    render();
  }

  function discardPreview() {
    const saved = store.getState().savedConfig;
    draft = saved ? deepClone(saved) : null;
    dirty = false;
    errorMsg = null;
    conflictServerConfig = null;
    hostRef?.ui?.setPanelDirty?.(false);
    store.setPreviewConfig(null);
    render();
  }

  async function syncLoginAppearance(savedConfig) {
    if (!hostRef?.publicAppearance) return false;
    if (!savedConfig.login?.enabled || savedConfig.scope === 'none') {
      await hostRef.publicAppearance.clear();
      return true;
    }

    const uploadedMediaCache = new Map();
    async function uploadPluginMedia(mediaPath, fallbackMime) {
      if (uploadedMediaCache.has(mediaPath)) return uploadedMediaCache.get(mediaPath);
      const res = await hostRef.rpcRaw('GET', mediaPath);
      if (!res.ok) throw new Error(`Failed to read wallpaper media (${res.status})`);
      const blob = await res.blob();
      const uploaded = await hostRef.publicAppearance.uploadMedia(blob, blob.type || fallbackMime);
      uploadedMediaCache.set(mediaPath, uploaded);
      return uploaded;
    }

    async function buildPublicSlot(slot) {
      if (!slot || slot.mediaType === 'none') {
        return {
          mediaType: 'none',
          fit: 'cover',
          positionX: 50,
          positionY: 50,
          blurPx: 0,
          scrimOpacity: 0.16,
          scrimMode: 'auto',
          cardOpacity: 0.9,
        };
      }
      const base = {
        fit: slot.fit || 'cover',
        positionX: slot.positionX ?? 50,
        positionY: slot.positionY ?? 50,
        blurPx: slot.blurPx ?? 0,
        scrimOpacity: slot.scrimOpacity ?? 0.16,
        scrimMode: slot.scrimMode || 'auto',
        cardOpacity: slot.loginCardOpacity ?? 0.9,
      };
      if (slot.mediaType === 'preset') {
        const preset = store.findPreset(slot.presetId);
        if (!preset) return { ...base, mediaType: 'none' };
        return { ...base, mediaType: 'gradient', cssGradient: preset.cssGradient };
      }
      const item = store.findItem(slot.itemId);
      if (!item) return { ...base, mediaType: 'none' };
      // ClaudeWeb public login appearance caps media at 50 MiB: for oversized 4K videos,
      // gracefully publish the crisp video poster image to the login screen while keeping full video in workspace.
      if (item.kind === 'video' && item.bytes > 48 * 1024 * 1024) {
        if (item.posterFileName) {
          const poster = await uploadPluginMedia(`/media/${item.id}/poster`, item.posterMime || 'image/jpeg');
          return {
            ...base,
            mediaType: 'image',
            mediaHash: poster.hash,
            mediaMime: poster.mimeType,
          };
        }
        return { ...base, mediaType: 'none' };
      }
      const uploaded = await uploadPluginMedia(`/media/${item.id}`, item.mimeType);
      const out = {
        ...base,
        mediaType: item.kind === 'video' ? 'video' : 'image',
        mediaHash: uploaded.hash,
        mediaMime: uploaded.mimeType,
        ...(item.kind === 'video' ? { videoPlaybackRate: slot.videoPlaybackRate ?? 1 } : {}),
      };
      if (item.kind === 'video' && item.posterFileName) {
        try {
          const poster = await uploadPluginMedia(`/media/${item.id}/poster`, item.posterMime || 'image/jpeg');
          out.posterHash = poster.hash;
          out.posterMime = poster.mimeType;
        } catch { /* poster is optional */ }
      }
      return out;
    }

    const mode = savedConfig.login.mode === 'single' ? 'single' : 'per-theme';
    const slots = {};
    if (mode === 'single') {
      const currentTheme = hostRef.context.themeMode || 'warm';
      slots.default = await buildPublicSlot(resolveSlotForTheme(savedConfig, currentTheme));
    } else {
      for (const key of ['warm', 'light', 'dark']) {
        const srcSlot = savedConfig.perTheme ? savedConfig.themes?.[key] : savedConfig.shared;
        slots[key] = await buildPublicSlot(srcSlot);
      }
    }

    await hostRef.publicAppearance.publish({ enabled: true, mode, slots });
    return true;
  }

  async function saveConfig(force = false) {
    if (!draft || !hostRef || saving) return;
    saving = true;
    errorMsg = null;
    conflictServerConfig = null;
    render();
    try {
      const expectedRevision = store.getState().savedConfig?.revision;
      const res = await hostRef.rpcRaw('PUT', '/config', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: draft, expectedRevision, force }),
      });
      const data = await res.json();
      if (res.status === 409 && data?.code === 'REVISION_CONFLICT' && data?.current) {
        conflictServerConfig = data.current;
        saving = false;
        render();
        return;
      }
      if (!res.ok) {
        throw new Error(data?.error || `Save failed (${res.status})`);
      }
      store.setSavedConfig(data.config);
      draft = deepClone(data.config);
      dirty = false;
      hostRef.ui?.setPanelDirty?.(false);
      store.setPreviewConfig(null);

      let loginSynced = false;
      try {
        loginSynced = await syncLoginAppearance(data.config);
      } catch (loginErr) {
        errorMsg = loginErr instanceof Error ? loginErr.message : String(loginErr);
      }

      if (!errorMsg) {
        hostRef.ui?.notify?.(
          loginSynced && data.config.login?.enabled ? t('loginSyncedToast') : t('savedToast'),
          'success',
        );
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : String(err);
    } finally {
      saving = false;
      render();
    }
  }

  async function uploadBlobSmart(blob, options = {}) {
    const mode = options.mode || 'media';
    const fileName = options.fileName || blob.name || 'wallpaper';
    const totalBytes = blob.size;
    const CHUNK_THRESHOLD = 8 * 1024 * 1024;

    if (mode !== 'we-zip' && totalBytes <= CHUNK_THRESHOLD) {
      const params = new URLSearchParams();
      if (fileName) params.set('name', fileName);
      if (options.posterOf) params.set('posterOf', options.posterOf);
      if (options.tone) params.set('tone', options.tone);
      if (options.source) params.set('source', options.source);
      if (options.workshopId) params.set('workshopId', options.workshopId);
      if (Array.isArray(options.tags) && options.tags.length > 0) params.set('tags', options.tags.join(','));
      const query = params.toString() ? `?${params.toString()}` : '';
      const res = await hostRef.rpcRaw('POST', `/wallpapers/upload${query}`, {
        headers: {
          'Content-Type': options.contentType || blob.type || 'application/octet-stream',
        },
        body: blob,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Upload failed (${res.status})`);
      return data;
    }

    // Chunked streaming upload (8 MiB slices) for large videos and Wallpaper Engine .zip packages.
    const initRes = await hostRef.rpcRaw('POST', '/wallpapers/upload/init', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mode,
        fileName,
        totalBytes,
        contentType: options.contentType || blob.type || 'application/octet-stream',
        posterOf: options.posterOf,
        tone: options.tone,
        source: options.source,
        workshopId: options.workshopId,
        tags: options.tags,
      }),
    });
    const initData = await initRes.json();
    if (!initRes.ok) {
      throw new Error(initData?.error || `Upload init failed (${initRes.status})`);
    }
    const uploadId = initData.uploadId;
    const chunkSize = Math.max(1024 * 1024, Number(initData.chunkSize) || CHUNK_THRESHOLD);
    activeUploadId = uploadId;
    updateProgressUi(0, totalBytes);
    render();

    try {
      let offset = 0;
      while (offset < totalBytes) {
        if (!hostRef || hostRef.signal.aborted) {
          throw new Error('Upload cancelled');
        }
        const slice = blob.slice(offset, Math.min(totalBytes, offset + chunkSize));
        const chunkRes = await hostRef.rpcRaw('PUT', `/wallpapers/upload/${encodeURIComponent(uploadId)}/chunk?offset=${offset}`, {
          headers: { 'Content-Type': 'application/octet-stream' },
          body: slice,
        });
        if (!chunkRes.ok) {
          let msg = `Chunk upload failed (${chunkRes.status})`;
          try {
            const errJson = await chunkRes.json();
            if (errJson?.error) msg = errJson.error;
          } catch { /* ignore */ }
          throw new Error(msg);
        }
        offset += slice.size;
        updateProgressUi(offset, totalBytes);
      }

      const completeRes = await hostRef.rpcRaw('POST', `/wallpapers/upload/${encodeURIComponent(uploadId)}/complete`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tone: options.tone }),
      });
      const completeData = await completeRes.json();
      if (!completeRes.ok) {
        throw new Error(completeData?.error || `Finalize failed (${completeRes.status})`);
      }
      activeUploadId = null;
      return completeData;
    } catch (err) {
      activeUploadId = null;
      try {
        await hostRef?.rpcRaw?.('DELETE', `/wallpapers/upload/${encodeURIComponent(uploadId)}`);
      } catch { /* ignore cleanup failure */ }
      throw err;
    }
  }

  function applyUploadedItemToDraft(uploadedItem) {
    if (!uploadedItem || !draft) return;
    updateDraft((d) => {
      if (d.scope === 'none') d.scope = 'workspace';
      const slot = getActiveSlot(d);
      if (slot) {
        slot.mediaType = uploadedItem.kind === 'video' ? 'video' : 'image';
        slot.itemId = uploadedItem.id;
        slot.presetId = null;
      }
    });
  }

  async function handleWallpaperEngineZipUpload(file) {
    if (!file || !hostRef || uploading) return;
    uploading = true;
    errorMsg = null;
    uploadProgress = { percent: 0, loaded: 0, total: file.size };
    render();
    try {
      const data = await uploadBlobSmart(file, {
        mode: 'we-zip',
        fileName: file.name || 'wallpaper.zip',
        contentType: 'application/zip',
        source: 'wallpaper-engine',
      });
      if (data.items) store.setCatalog(data.items, data.stats);
      if (data.item) {
        applyUploadedItemToDraft(data.item);
        hostRef.ui?.notify?.(t('weImportedToast', { title: data.item.name }), 'success');
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : String(err);
    } finally {
      uploading = false;
      uploadProgress = null;
      render();
    }
  }

  async function importWeVideoCandidate(candidate) {
    if (!candidate || !hostRef || uploading) return;
    uploading = true;
    errorMsg = null;
    uploadProgress = { percent: 0, loaded: 0, total: candidate.videoFile.size };
    render();
    try {
      let posterBlob = candidate.previewFile || null;
      if (!posterBlob) {
        posterBlob = await captureVideoPosterBlob(candidate.videoFile);
      }
      const detectedTone = posterBlob ? await detectImageBlobTone(posterBlob) : null;

      const data = await uploadBlobSmart(candidate.videoFile, {
        mode: 'media',
        fileName: candidate.title || candidate.videoFile.name,
        contentType: candidate.videoMime || candidate.videoFile.type || 'video/mp4',
        tone: detectedTone,
        source: 'wallpaper-engine',
        workshopId: candidate.workshopId,
        tags: candidate.tags,
      });

      let uploadedItem = data.item;
      if (data.items) store.setCatalog(data.items, data.stats);

      if (uploadedItem?.kind === 'video' && posterBlob) {
        try {
          const posterData = await uploadBlobSmart(posterBlob, {
            mode: 'poster',
            fileName: posterBlob.name || 'preview.jpg',
            contentType: posterBlob.type || 'image/jpeg',
            posterOf: uploadedItem.id,
            tone: detectedTone,
          });
          if (posterData.item) uploadedItem = posterData.item;
          if (posterData.items) store.setCatalog(posterData.items, posterData.stats);
        } catch { /* optional preview poster */ }
      }

      if (uploadedItem) {
        candidate.importedItemId = uploadedItem.id;
        applyUploadedItemToDraft(uploadedItem);
        hostRef.ui?.notify?.(t('weImportedToast', { title: uploadedItem.name }), 'success');
      }
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : String(err);
    } finally {
      uploading = false;
      uploadProgress = null;
      render();
    }
  }

  async function handleWallpaperEngineFolderSelect(fileList) {
    if (!fileList || fileList.length === 0 || !hostRef || uploading || scanningWe) return;
    scanningWe = true;
    errorMsg = null;
    revokeWePreviewUrls();
    render();
    try {
      const scan = await scanWallpaperEngineFolderFiles(fileList);
      scanningWe = false;

      if (scan.candidates.length === 1 && scan.candidates[0].rejected === 'type') {
        errorMsg = t('weUnsupportedTypeErr', {
          title: scan.candidates[0].title,
          type: scan.candidates[0].type,
        });
        render();
        return;
      }
      if (scan.candidates.length === 1 && scan.candidates[0].rejected === 'container') {
        errorMsg = t('weUnsupportedContainerErr', {
          title: scan.candidates[0].title,
          file: scan.candidates[0].file,
        });
        render();
        return;
      }

      const valid = scan.candidates.filter((c) => !c.rejected);
      const skippedParts = Object.entries(scan.skippedByType)
        .map(([kind, count]) => `${count} ${kind}`);
      if (scan.unsupportedContainers.length > 0) {
        skippedParts.push(`${scan.unsupportedContainers.length} non-MP4/WebM`);
      }
      weSkippedNote = skippedParts.length > 0 ? t('weSkippedSummary', { details: skippedParts.join(', ') }) : '';

      if (valid.length === 0) {
        errorMsg = weSkippedNote || t('weNoVideosInFolder');
        weSkippedNote = '';
        render();
        return;
      }

      // Single workshop folder containing one Video wallpaper -> import immediately!
      if (scan.totalFolders === 1 && valid.length === 1) {
        const single = valid[0];
        try {
          await importWeVideoCandidate(single);
        } finally {
          if (single.previewUrl) {
            try { URL.revokeObjectURL(single.previewUrl); } catch { /* ignore */ }
          }
        }
        return;
      }

      // Multiple workshop folders (e.g. Steam 431960 root) -> show local preview picker before uploading!
      const existingByWorkshop = new Set(
        (store.getState().items || []).map((it) => it.workshopId).filter(Boolean),
      );
      for (const c of valid) {
        if (c.workshopId && existingByWorkshop.has(c.workshopId)) {
          const match = store.getState().items.find((it) => it.workshopId === c.workshopId);
          if (match) c.importedItemId = match.id;
        }
      }
      weDiscovered = valid;
      render();
    } catch (err) {
      scanningWe = false;
      errorMsg = err instanceof Error ? err.message : String(err);
      render();
    }
  }

  async function handleFileUpload(file) {
    if (!file || !hostRef || uploading) return;
    if (String(file.name || '').toLowerCase().endsWith('.zip') || file.type === 'application/zip' || file.type === 'application/x-zip-compressed') {
      await handleWallpaperEngineZipUpload(file);
      return;
    }
    uploading = true;
    errorMsg = null;
    uploadProgress = file.size > 8 * 1024 * 1024 ? { percent: 0, loaded: 0, total: file.size } : null;
    render();
    try {
      const detectedImageTone = file.type?.startsWith('image/')
        ? await detectImageBlobTone(file)
        : null;
      const data = await uploadBlobSmart(file, {
        mode: 'media',
        fileName: file.name || 'wallpaper',
        contentType: file.type || 'application/octet-stream',
        tone: detectedImageTone,
        source: 'local',
      });
      let uploadedItem = data.item;
      if (data.items) store.setCatalog(data.items, data.stats);

      if (uploadedItem?.kind === 'video') {
        const posterBlob = await captureVideoPosterBlob(file);
        if (posterBlob) {
          const posterTone = await detectImageBlobTone(posterBlob);
          try {
            const posterData = await uploadBlobSmart(posterBlob, {
              mode: 'poster',
              fileName: 'poster.jpg',
              contentType: posterBlob.type || 'image/jpeg',
              posterOf: uploadedItem.id,
              tone: posterTone,
            });
            if (posterData.item) uploadedItem = posterData.item;
            if (posterData.items) store.setCatalog(posterData.items, posterData.stats);
          } catch { /* optional poster */ }
        }
      }

      // Auto-select the freshly uploaded wallpaper into the active slot for immediate live preview!
      applyUploadedItemToDraft(uploadedItem);
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : String(err);
    } finally {
      uploading = false;
      uploadProgress = null;
      render();
    }
  }

  async function handleDeleteItem(itemId) {
    if (!hostRef) return;
    errorMsg = null;
    try {
      const data = await hostRef.rpc('DELETE', `/wallpapers/${encodeURIComponent(itemId)}`);
      thumbUrls.delete(itemId);
      if (data.items) store.setCatalog(data.items, data.stats);
      if (data.config) {
        store.setSavedConfig(data.config);
        if (!dirty) {
          draft = deepClone(data.config);
        } else if (draft) {
          // Clear references to deleted item in current draft
          const slots = [draft.shared, draft.themes?.warm, draft.themes?.light, draft.themes?.dark];
          for (const s of slots) {
            if (s && s.itemId === itemId) {
              s.mediaType = 'preset';
              s.itemId = null;
              s.presetId = 'warm-sand';
            }
          }
          store.setPreviewConfig(draft);
        }
      }
      render();
    } catch (err) {
      errorMsg = err instanceof Error ? err.message : String(err);
      render();
    }
  }

  async function ensureThumbUrl(item) {
    if (!hostRef || thumbUrls.has(item.id)) return thumbUrls.get(item.id);
    const mediaPath = item.kind === 'video' && item.posterFileName
      ? `/media/${item.id}/poster`
      : `/media/${item.id}`;
    try {
      const ticket = await hostRef.media.createUrl(mediaPath, 10 * 60_000);
      thumbUrls.set(item.id, ticket.url);
      return ticket.url;
    } catch {
      return null;
    }
  }

  function buildSlider({ label, value, min, max, step, display, onChange }) {
    const wrap = document.createElement('label');
    wrap.className = 'cwwp-slider';
    const head = document.createElement('div');
    head.className = 'cwwp-slider-head';
    const spanL = document.createElement('span');
    spanL.textContent = label;
    const spanV = document.createElement('span');
    spanV.className = 'cwwp-slider-val';
    spanV.textContent = display;
    head.append(spanL, spanV);

    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(value);
    input.addEventListener('input', () => {
      const nextVal = Number(input.value);
      spanV.textContent = onChange(nextVal);
    });

    wrap.append(head, input);
    return wrap;
  }

  function render() {
    if (!rootContainer || !draft) return;
    const state = store.getState();
    const slot = getActiveSlot(draft);
    const isZh = getLocale().toLowerCase().startsWith('zh');

    const root = document.createElement('div');
    root.className = 'cwwp-root';

    const scroll = document.createElement('div');
    scroll.className = 'cwwp-scroll';

    if (errorMsg) {
      const errBox = document.createElement('div');
      errBox.className = 'cwwp-error';
      errBox.textContent = errorMsg;
      scroll.appendChild(errBox);
    }

    if (conflictServerConfig) {
      const banner = document.createElement('div');
      banner.className = 'cwwp-banner';
      const msg = document.createElement('span');
      msg.textContent = t('conflictMsg');
      const actions = document.createElement('div');
      actions.className = 'cwwp-row';
      const reloadBtn = document.createElement('button');
      reloadBtn.type = 'button';
      reloadBtn.className = 'cwwp-btn';
      reloadBtn.textContent = t('reloadLatest');
      reloadBtn.onclick = () => {
        store.setSavedConfig(conflictServerConfig);
        discardPreview();
      };
      const overwriteBtn = document.createElement('button');
      overwriteBtn.type = 'button';
      overwriteBtn.className = 'cwwp-btn cwwp-btn-primary';
      overwriteBtn.textContent = t('overwrite');
      overwriteBtn.onclick = () => void saveConfig(true);
      actions.append(reloadBtn, overwriteBtn);
      banner.append(msg, actions);
      scroll.appendChild(banner);
    }

    // 1. Coverage Scope
    const scopeSec = document.createElement('section');
    scopeSec.className = 'cwwp-sec';
    const scopeTitle = document.createElement('h3');
    scopeTitle.className = 'cwwp-sec-title';
    scopeTitle.textContent = t('scopeTitle');
    const scopeSeg = document.createElement('div');
    scopeSeg.className = 'cwwp-seg';
    for (const [val, labelKey] of [['none', 'scopeNone'], ['chat', 'scopeChat'], ['workspace', 'scopeWorkspace']]) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(draft.scope === val));
      btn.textContent = t(labelKey);
      btn.onclick = () => updateDraft((d) => { d.scope = val; });
      scopeSeg.appendChild(btn);
    }
    const scopeHint = document.createElement('p');
    scopeHint.className = 'cwwp-hint';
    scopeHint.textContent = t('scopeHint');
    scopeSec.append(scopeTitle, scopeSeg, scopeHint);
    scroll.appendChild(scopeSec);

    // 2. Per-Theme Binding
    const themeSec = document.createElement('section');
    themeSec.className = 'cwwp-sec';
    const themeRow = document.createElement('div');
    themeRow.className = 'cwwp-row';
    const themeLabel = document.createElement('label');
    themeLabel.className = 'cwwp-switch';
    const themeCb = document.createElement('input');
    themeCb.type = 'checkbox';
    themeCb.checked = Boolean(draft.perTheme);
    themeCb.onchange = () => updateDraft((d) => { d.perTheme = themeCb.checked; });
    const themeTxt = document.createElement('span');
    themeTxt.textContent = t('themeBinding');
    themeLabel.append(themeCb, themeTxt);
    themeRow.appendChild(themeLabel);
    themeSec.appendChild(themeRow);

    if (draft.perTheme) {
      const themeSeg = document.createElement('div');
      themeSeg.className = 'cwwp-seg';
      for (const [key, labelKey] of [['warm', 'themeWarm'], ['light', 'themeLight'], ['dark', 'themeDark']]) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-pressed', String(activeThemeTab === key));
        btn.textContent = t(labelKey);
        btn.onclick = () => {
          activeThemeTab = key;
          render();
        };
        themeSeg.appendChild(btn);
      }
      themeSec.appendChild(themeSeg);
    } else {
      const hint = document.createElement('p');
      hint.className = 'cwwp-hint';
      hint.textContent = t('themeBindingHint');
      themeSec.appendChild(hint);
    }
    scroll.appendChild(themeSec);

    // 3. Built-in Presets
    const presetsSec = document.createElement('section');
    presetsSec.className = 'cwwp-sec';
    const presetsTitle = document.createElement('h3');
    presetsTitle.className = 'cwwp-sec-title';
    presetsTitle.textContent = t('presetsTitle');
    const presetsGrid = document.createElement('div');
    presetsGrid.className = 'cwwp-presets';
    for (const preset of state.presets) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cwwp-preset';
      const selected = slot?.mediaType === 'preset' && slot?.presetId === preset.id;
      btn.dataset.selected = String(selected);
      const swatch = document.createElement('span');
      swatch.className = 'cwwp-preset-swatch';
      swatch.style.background = preset.cssGradient;
      const name = document.createElement('span');
      name.className = 'cwwp-preset-name';
      name.textContent = isZh ? preset.nameZh : preset.nameEn;
      btn.append(swatch, name);
      btn.onclick = () => updateDraft((d) => {
        if (d.scope === 'none') d.scope = 'workspace';
        const target = getActiveSlot(d);
        if (target) {
          target.mediaType = 'preset';
          target.presetId = preset.id;
          target.itemId = null;
        }
      });
      presetsGrid.appendChild(btn);
    }
    presetsSec.append(presetsTitle, presetsGrid);
    scroll.appendChild(presetsSec);

    // 4. Custom Media Library & Upload
    const uploadsSec = document.createElement('section');
    uploadsSec.className = 'cwwp-sec';
    const uploadsHead = document.createElement('div');
    uploadsHead.className = 'cwwp-sec-head';
    const uploadsTitle = document.createElement('h3');
    uploadsTitle.className = 'cwwp-sec-title';
    uploadsTitle.textContent = t('uploadsTitle');
    uploadsHead.appendChild(uploadsTitle);
    if (state.stats) {
      const statsEl = document.createElement('span');
      statsEl.className = 'cwwp-hint';
      statsEl.textContent = t('storageUsage', {
        count: state.stats.itemCount,
        size: formatBytes(state.stats.totalBytes),
      });
      uploadsHead.appendChild(statsEl);
    }

    const dropZone = document.createElement('div');
    dropZone.className = 'cwwp-drop';
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/png,image/jpeg,image/webp,image/avif,image/gif,video/mp4,video/webm,.zip,application/zip';
    fileInput.style.display = 'none';
    fileInput.onchange = () => {
      const f = fileInput.files?.[0];
      fileInput.value = '';
      if (f) void handleFileUpload(f);
    };
    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'cwwp-btn';
    uploadBtn.disabled = uploading || scanningWe;
    uploadBtn.textContent = uploading ? t('uploading') : t('uploadBtn');
    uploadBtn.onclick = () => fileInput.click();

    const uploadHint = document.createElement('p');
    uploadHint.className = 'cwwp-hint';
    uploadHint.style.marginTop = '6px';
    uploadHint.textContent = t('uploadHint');

    dropZone.ondragover = (e) => { e.preventDefault(); dropZone.dataset.over = 'true'; };
    dropZone.ondragleave = () => { dropZone.dataset.over = 'false'; };
    dropZone.ondrop = (e) => {
      e.preventDefault();
      dropZone.dataset.over = 'false';
      const f = e.dataTransfer?.files?.[0];
      if (f) void handleFileUpload(f);
    };
    dropZone.append(fileInput, uploadBtn, uploadHint);
    uploadsSec.append(uploadsHead, dropZone);

    // Chunked Upload Progress Bar
    progressTextRef = null;
    progressBarRef = null;
    if (uploading && uploadProgress) {
      const pWrap = document.createElement('div');
      pWrap.className = 'cwwp-progress-wrap';
      const pText = document.createElement('span');
      pText.className = 'cwwp-progress-text';
      pText.textContent = t('uploadingProgress', {
        percent: uploadProgress.percent,
        loaded: formatBytes(uploadProgress.loaded),
        total: formatBytes(uploadProgress.total),
      });
      const pTrack = document.createElement('div');
      pTrack.className = 'cwwp-progress-track';
      const pBar = document.createElement('div');
      pBar.className = 'cwwp-progress-bar';
      pBar.style.width = `${uploadProgress.percent}%`;
      pTrack.appendChild(pBar);
      pWrap.append(pText, pTrack);
      progressTextRef = pText;
      progressBarRef = pBar;
      uploadsSec.appendChild(pWrap);
    }

    // 4b. Wallpaper Engine (Video) Importer
    const weCard = document.createElement('div');
    weCard.className = 'cwwp-card';
    const weHead = document.createElement('div');
    weHead.className = 'cwwp-sec-head';
    const weTitle = document.createElement('h3');
    weTitle.className = 'cwwp-sec-title';
    weTitle.textContent = t('weSectionTitle');
    weHead.appendChild(weTitle);

    if (weDiscovered.length > 0) {
      const clearWeBtn = document.createElement('button');
      clearWeBtn.type = 'button';
      clearWeBtn.className = 'cwwp-btn';
      clearWeBtn.style.padding = '2px 8px';
      clearWeBtn.style.fontSize = '11px';
      clearWeBtn.textContent = t('weClearList');
      clearWeBtn.onclick = () => {
        revokeWePreviewUrls();
        render();
      };
      weHead.appendChild(clearWeBtn);
    }

    const weFolderInput = document.createElement('input');
    weFolderInput.type = 'file';
    weFolderInput.multiple = true;
    weFolderInput.setAttribute('webkitdirectory', '');
    weFolderInput.setAttribute('directory', '');
    weFolderInput.style.display = 'none';
    weFolderInput.onchange = () => {
      const files = weFolderInput.files;
      if (files && files.length > 0) {
        void handleWallpaperEngineFolderSelect(files);
      }
      weFolderInput.value = '';
    };

    const weZipInput = document.createElement('input');
    weZipInput.type = 'file';
    weZipInput.accept = '.zip,application/zip,application/x-zip-compressed';
    weZipInput.style.display = 'none';
    weZipInput.onchange = () => {
      const f = weZipInput.files?.[0];
      weZipInput.value = '';
      if (f) void handleWallpaperEngineZipUpload(f);
    };

    const weActions = document.createElement('div');
    weActions.className = 'cwwp-we-actions';
    const weFolderBtn = document.createElement('button');
    weFolderBtn.type = 'button';
    weFolderBtn.className = 'cwwp-btn';
    weFolderBtn.disabled = uploading || scanningWe;
    weFolderBtn.textContent = scanningWe ? t('weScanning') : t('weSelectFolder');
    weFolderBtn.onclick = () => weFolderInput.click();

    const weZipBtn = document.createElement('button');
    weZipBtn.type = 'button';
    weZipBtn.className = 'cwwp-btn';
    weZipBtn.disabled = uploading || scanningWe;
    weZipBtn.textContent = t('weImportZip');
    weZipBtn.onclick = () => weZipInput.click();

    weActions.append(weFolderInput, weZipInput, weFolderBtn, weZipBtn);
    const weHint = document.createElement('p');
    weHint.className = 'cwwp-hint';
    weHint.textContent = t('weFolderHint');
    weCard.append(weHead, weActions, weHint);

    if (weDiscovered.length > 0) {
      const foundLbl = document.createElement('span');
      foundLbl.className = 'cwwp-hint';
      foundLbl.style.fontWeight = '600';
      foundLbl.textContent = t('weFoundCount', { count: weDiscovered.length });
      weCard.appendChild(foundLbl);

      const listEl = document.createElement('div');
      listEl.className = 'cwwp-we-list';
      for (const candidate of weDiscovered) {
        const row = document.createElement('div');
        row.className = 'cwwp-we-row';

        const thumb = document.createElement('div');
        thumb.className = 'cwwp-we-thumb';
        if (candidate.previewUrl) {
          const img = document.createElement('img');
          img.src = candidate.previewUrl;
          img.alt = candidate.title;
          thumb.appendChild(img);
        } else {
          thumb.textContent = 'MP4';
        }

        const info = document.createElement('div');
        info.className = 'cwwp-we-info';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'cwwp-we-name';
        nameSpan.title = candidate.title;
        nameSpan.textContent = candidate.title;
        const subSpan = document.createElement('span');
        subSpan.className = 'cwwp-we-sub';
        subSpan.textContent = candidate.workshopId
          ? `${formatBytes(candidate.bytes)} · ID ${candidate.workshopId}`
          : formatBytes(candidate.bytes);
        info.append(nameSpan, subSpan);

        const impBtn = document.createElement('button');
        impBtn.type = 'button';
        impBtn.className = candidate.importedItemId ? 'cwwp-btn' : 'cwwp-btn cwwp-btn-primary';
        impBtn.style.padding = '4px 10px';
        impBtn.disabled = uploading;
        impBtn.textContent = candidate.importedItemId ? t('weImportedBtn') : t('weImportBtn');
        impBtn.onclick = () => {
          if (candidate.importedItemId) {
            const existing = store.findItem(candidate.importedItemId);
            if (existing) {
              applyUploadedItemToDraft(existing);
              return;
            }
          }
          void importWeVideoCandidate(candidate);
        };

        row.append(thumb, info, impBtn);
        listEl.appendChild(row);
      }
      weCard.appendChild(listEl);

      if (weSkippedNote) {
        const skipEl = document.createElement('p');
        skipEl.className = 'cwwp-hint';
        skipEl.textContent = weSkippedNote;
        weCard.appendChild(skipEl);
      }
    }
    uploadsSec.appendChild(weCard);

    if (state.items.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'cwwp-hint';
      empty.textContent = t('noUploads');
      uploadsSec.appendChild(empty);
    } else {
      const gallery = document.createElement('div');
      gallery.className = 'cwwp-gallery';
      for (const item of state.items) {
        const card = document.createElement('div');
        card.className = 'cwwp-item';
        const isSelected = (slot?.mediaType === 'image' || slot?.mediaType === 'video') && slot?.itemId === item.id;
        card.dataset.selected = String(isSelected);

        const thumbBtn = document.createElement('button');
        thumbBtn.type = 'button';
        thumbBtn.className = 'cwwp-item-thumb';
        thumbBtn.onclick = () => updateDraft((d) => {
          if (d.scope === 'none') d.scope = 'workspace';
          const target = getActiveSlot(d);
          if (target) {
            target.mediaType = item.kind === 'video' ? 'video' : 'image';
            target.itemId = item.id;
            target.presetId = null;
          }
        });

        const badge = document.createElement('span');
        badge.className = item.source === 'wallpaper-engine' ? 'cwwp-badge cwwp-badge-we' : 'cwwp-badge';
        badge.textContent = item.source === 'wallpaper-engine'
          ? t('weBadge')
          : item.kind === 'video'
            ? t('videoBadge')
            : t('imageBadge');
        thumbBtn.appendChild(badge);

        void ensureThumbUrl(item).then((url) => {
          if (!url || !thumbBtn.isConnected) return;
          if (item.kind === 'video' && !item.posterFileName) {
            const v = document.createElement('video');
            v.src = url;
            v.muted = true;
            v.preload = 'metadata';
            thumbBtn.insertBefore(v, badge);
          } else {
            const img = document.createElement('img');
            img.src = url;
            img.alt = item.name;
            thumbBtn.insertBefore(img, badge);
          }
        });

        const meta = document.createElement('div');
        meta.className = 'cwwp-item-meta';
        const nameEl = document.createElement('span');
        nameEl.className = 'cwwp-item-name';
        nameEl.title = item.workshopId
          ? `${item.name} (${formatBytes(item.bytes)} · Workshop ${item.workshopId})`
          : `${item.name} (${formatBytes(item.bytes)})`;
        nameEl.textContent = item.name;
        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'cwwp-item-del';
        delBtn.textContent = t('deleteItem');
        delBtn.onclick = () => void handleDeleteItem(item.id);
        meta.append(nameEl, delBtn);

        card.append(thumbBtn, meta);
        gallery.appendChild(card);
      }
      uploadsSec.appendChild(gallery);
    }
    scroll.appendChild(uploadsSec);

    // 5. Appearance & Glass Sliders
    if (slot) {
      const fxSec = document.createElement('section');
      fxSec.className = 'cwwp-sec';
      const fxHead = document.createElement('div');
      fxHead.className = 'cwwp-sec-head';
      const fxTitle = document.createElement('h3');
      fxTitle.className = 'cwwp-sec-title';
      fxTitle.textContent = t('effectsTitle');
      const resetFxBtn = document.createElement('button');
      resetFxBtn.type = 'button';
      resetFxBtn.className = 'cwwp-btn';
      resetFxBtn.style.padding = '3px 8px';
      resetFxBtn.style.fontSize = '11px';
      resetFxBtn.textContent = t('resetEffects');
      resetFxBtn.onclick = () => updateDraft((d) => {
        const target = getActiveSlot(d);
        if (!target) return;
        target.blurPx = 0;
        target.scrimOpacity = 0.22;
        target.scrimMode = 'auto';
        target.glassTone = 'auto';
        target.surfaceOpacity = 0.36;
        target.glassBlurPx = 20;
        target.fit = 'cover';
        target.positionX = 50;
        target.positionY = 50;
      });
      fxHead.append(fxTitle, resetFxBtn);

      const sliders = document.createElement('div');
      sliders.className = 'cwwp-sliders';

      const glassToneLabel = document.createElement('span');
      glassToneLabel.textContent = t('glassTone');
      const glassToneSeg = document.createElement('div');
      glassToneSeg.className = 'cwwp-seg';
      for (const [val, labelKey] of [['auto', 'glassToneAuto'], ['dark', 'glassToneDark'], ['light', 'glassToneLight']]) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', String((slot.glassTone || 'auto') === val));
        b.textContent = t(labelKey);
        b.onclick = () => updateDraft((d) => { const s = getActiveSlot(d); if (s) s.glassTone = val; });
        glassToneSeg.appendChild(b);
      }
      sliders.append(glassToneLabel, glassToneSeg);

      if (slot.mediaType === 'image' || slot.mediaType === 'video') {
        const fitLabel = document.createElement('span');
        fitLabel.textContent = t('fit');
        const fitSeg = document.createElement('div');
        fitSeg.className = 'cwwp-seg';
        for (const [val, labelKey] of [['cover', 'fitCover'], ['contain', 'fitContain'], ['center', 'fitCenter']]) {
          const b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-pressed', String(slot.fit === val));
          b.textContent = t(labelKey);
          b.onclick = () => updateDraft((d) => { const s = getActiveSlot(d); if (s) s.fit = val; });
          fitSeg.appendChild(b);
        }
        sliders.append(fitLabel, fitSeg);

        sliders.appendChild(buildSlider({
          label: t('positionX'),
          value: slot.positionX,
          min: 0,
          max: 100,
          step: 1,
          display: `${slot.positionX}%`,
          onChange: (v) => {
            slot.positionX = v;
            markSliderDirty();
            return `${v}%`;
          },
        }));
        sliders.appendChild(buildSlider({
          label: t('positionY'),
          value: slot.positionY,
          min: 0,
          max: 100,
          step: 1,
          display: `${slot.positionY}%`,
          onChange: (v) => {
            slot.positionY = v;
            markSliderDirty();
            return `${v}%`;
          },
        }));
      }

      sliders.appendChild(buildSlider({
        label: t('blur'),
        value: slot.blurPx,
        min: 0,
        max: 32,
        step: 1,
        display: `${slot.blurPx}px`,
        onChange: (v) => {
          slot.blurPx = v;
          markSliderDirty();
          return `${v}px`;
        },
      }));

      sliders.appendChild(buildSlider({
        label: t('scrimOpacity'),
        value: Math.round(slot.scrimOpacity * 100),
        min: 0,
        max: 85,
        step: 1,
        display: `${Math.round(slot.scrimOpacity * 100)}%`,
        onChange: (v) => {
          slot.scrimOpacity = Number((v / 100).toFixed(2));
          markSliderDirty();
          return `${v}%`;
        },
      }));

      const scrimTintLabel = document.createElement('span');
      scrimTintLabel.textContent = t('scrimMode');
      const scrimSeg = document.createElement('div');
      scrimSeg.className = 'cwwp-seg';
      for (const [val, labelKey] of [['auto', 'scrimAuto'], ['light', 'scrimLight'], ['dark', 'scrimDark']]) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', String(slot.scrimMode === val));
        b.textContent = t(labelKey);
        b.onclick = () => updateDraft((d) => { const s = getActiveSlot(d); if (s) s.scrimMode = val; });
        scrimSeg.appendChild(b);
      }
      sliders.append(scrimTintLabel, scrimSeg);

      sliders.appendChild(buildSlider({
        label: t('surfaceOpacity'),
        value: Math.round(slot.surfaceOpacity * 100),
        min: 8,
        max: 90,
        step: 1,
        display: `${Math.round(slot.surfaceOpacity * 100)}%`,
        onChange: (v) => {
          slot.surfaceOpacity = Number((v / 100).toFixed(2));
          markSliderDirty();
          return `${v}%`;
        },
      }));

      sliders.appendChild(buildSlider({
        label: t('glassBlur'),
        value: slot.glassBlurPx,
        min: 0,
        max: 32,
        step: 1,
        display: `${slot.glassBlurPx}px`,
        onChange: (v) => {
          slot.glassBlurPx = v;
          markSliderDirty();
          return `${v}px`;
        },
      }));

      if (slot.mediaType === 'video') {
        sliders.appendChild(buildSlider({
          label: t('videoSpeed'),
          value: slot.videoPlaybackRate,
          min: 0.25,
          max: 2,
          step: 0.05,
          display: `${slot.videoPlaybackRate.toFixed(2)}x`,
          onChange: (v) => {
            slot.videoPlaybackRate = Number(v.toFixed(2));
            markSliderDirty();
            return `${v.toFixed(2)}x`;
          },
        }));
      }

      fxSec.append(fxHead, sliders);
      scroll.appendChild(fxSec);
    }

    // 6. Login Screen Sync
    const loginSec = document.createElement('section');
    loginSec.className = 'cwwp-sec';
    const loginTitle = document.createElement('h3');
    loginTitle.className = 'cwwp-sec-title';
    loginTitle.textContent = t('loginTitle');
    const loginCard = document.createElement('div');
    loginCard.className = 'cwwp-card';

    const loginSwitch = document.createElement('label');
    loginSwitch.className = 'cwwp-switch';
    const loginCb = document.createElement('input');
    loginCb.type = 'checkbox';
    loginCb.checked = Boolean(draft.login?.enabled);
    loginCb.onchange = () => updateDraft((d) => { d.login.enabled = loginCb.checked; });
    const loginTxt = document.createElement('span');
    loginTxt.textContent = t('loginEnable');
    loginSwitch.append(loginCb, loginTxt);
    const loginHint = document.createElement('p');
    loginHint.className = 'cwwp-hint';
    loginHint.textContent = t('loginHint');
    loginCard.append(loginSwitch, loginHint);

    if (draft.login?.enabled) {
      const modeLbl = document.createElement('span');
      modeLbl.textContent = t('loginMode');
      const modeSeg = document.createElement('div');
      modeSeg.className = 'cwwp-seg';
      for (const [val, labelKey] of [['single', 'loginSingle'], ['per-theme', 'loginPerTheme']]) {
        const b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-pressed', String(draft.login.mode === val));
        b.textContent = t(labelKey);
        b.onclick = () => updateDraft((d) => { d.login.mode = val; });
        modeSeg.appendChild(b);
      }
      loginCard.append(modeLbl, modeSeg);

      if (slot) {
        loginCard.appendChild(buildSlider({
          label: t('loginCardOpacity'),
          value: Math.round((slot.loginCardOpacity ?? 0.9) * 100),
          min: 55,
          max: 100,
          step: 1,
          display: `${Math.round((slot.loginCardOpacity ?? 0.9) * 100)}%`,
          onChange: (v) => {
            slot.loginCardOpacity = Number((v / 100).toFixed(2));
            markSliderDirty();
            return `${v}%`;
          },
        }));
      }
    }

    loginSec.append(loginTitle, loginCard);
    scroll.appendChild(loginSec);

    // 7. Backup & Restore + Wallpaper Engine Roadmap
    const toolsSec = document.createElement('section');
    toolsSec.className = 'cwwp-sec';
    const toolsTitle = document.createElement('h3');
    toolsTitle.className = 'cwwp-sec-title';
    toolsTitle.textContent = t('backupTitle');
    const toolsRow = document.createElement('div');
    toolsRow.className = 'cwwp-row';
    toolsRow.style.justifyContent = 'flex-start';

    const exportBtn = document.createElement('button');
    exportBtn.type = 'button';
    exportBtn.className = 'cwwp-btn';
    exportBtn.textContent = t('exportConfig');
    exportBtn.onclick = async () => {
      try {
        const data = await hostRef.rpc('POST', '/config/export');
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `claudeweb-wallpaper-config-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        errorMsg = err instanceof Error ? err.message : String(err);
        render();
      }
    };

    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = 'application/json,.json';
    importInput.style.display = 'none';
    importInput.onchange = async () => {
      const f = importInput.files?.[0];
      importInput.value = '';
      if (!f) return;
      try {
        const parsed = JSON.parse(await f.text());
        const data = await hostRef.rpc('POST', '/config/import', parsed);
        if (data?.config) {
          store.setSavedConfig(data.config);
          discardPreview();
          hostRef.ui?.notify?.(t('savedToast'), 'success');
        }
      } catch (err) {
        errorMsg = err instanceof Error ? err.message : String(err);
        render();
      }
    };
    const importBtn = document.createElement('button');
    importBtn.type = 'button';
    importBtn.className = 'cwwp-btn';
    importBtn.textContent = t('importConfig');
    importBtn.onclick = () => importInput.click();

    toolsRow.append(exportBtn, importInput, importBtn);
    toolsSec.append(toolsTitle, toolsRow);

    if (state.wallpaperEngine) {
      const details = document.createElement('details');
      details.className = 'cwwp-details';
      const summary = document.createElement('summary');
      summary.textContent = t('weTitle');
      const supTitle = document.createElement('p');
      supTitle.className = 'cwwp-hint';
      supTitle.style.marginTop = '8px';
      supTitle.textContent = t('weSupported');
      const supList = document.createElement('ul');
      for (const s of state.wallpaperEngine.supportedTypes || []) {
        const li = document.createElement('li');
        li.textContent = s;
        supList.appendChild(li);
      }
      const unsupTitle = document.createElement('p');
      unsupTitle.className = 'cwwp-hint';
      unsupTitle.style.marginTop = '8px';
      unsupTitle.textContent = t('weUnsupported');
      const unsupList = document.createElement('ul');
      for (const s of state.wallpaperEngine.unsupportedTypes || []) {
        const li = document.createElement('li');
        li.textContent = s;
        unsupList.appendChild(li);
      }
      details.append(summary, supTitle, supList, unsupTitle, unsupList);
      toolsSec.appendChild(details);
    }

    scroll.appendChild(toolsSec);

    // Sticky Footer
    const footer = document.createElement('div');
    footer.className = 'cwwp-footer';
    const dirtyPill = document.createElement('div');
    dirtyPill.className = 'cwwp-dirty-pill';
    dirtyPill.textContent = t('unsavedBadge');
    dirtyPill.style.display = dirty ? 'block' : 'none';
    dirtyPillRef = dirtyPill;
    footer.appendChild(dirtyPill);

    const footerRow = document.createElement('div');
    footerRow.className = 'cwwp-footer-row';

    const leftBtns = document.createElement('div');
    leftBtns.style.display = 'flex';
    leftBtns.style.gap = '6px';

    const discardBtn = document.createElement('button');
    discardBtn.type = 'button';
    discardBtn.className = 'cwwp-btn';
    discardBtn.disabled = !dirty || saving;
    discardBtn.textContent = t('discard');
    discardBtn.onclick = discardPreview;
    discardBtnRef = discardBtn;
    leftBtns.appendChild(discardBtn);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'cwwp-btn cwwp-btn-primary';
    saveBtn.disabled = saving;
    saveBtn.textContent = saving ? t('saving') : t('save');
    saveBtn.onclick = () => void saveConfig(false);

    footerRow.append(leftBtns, saveBtn);
    footer.appendChild(footerRow);

    root.append(scroll, footer);
    rootContainer.replaceChildren(root);
  }

  return {
    async mount(container, host) {
      rootContainer = container;
      hostRef = host;
      host.style.set('cw-wallpaper-ui', PANEL_CSS);
      activeThemeTab = host.context.themeMode || 'warm';
      dirty = false;
      errorMsg = null;
      conflictServerConfig = null;

      try {
        const data = await host.rpc('GET', '/config');
        if (host.signal.aborted) return;
        store.setServerSnapshot(data);
        draft = deepClone(data.config);
      } catch (err) {
        errorMsg = err instanceof Error ? err.message : String(err);
      }

      unsubContext = host.onContextChange(() => {
        render();
      });
      unsubStore = store.subscribe(() => {
        if (!dirty && store.getState().savedConfig) {
          draft = deepClone(store.getState().savedConfig);
          render();
        }
      });

      render();
    },

    unmount(container) {
      unsubContext?.();
      unsubContext = null;
      unsubStore?.();
      unsubStore = null;
      // Closing the drawer without saving reverts any unsaved live preview immediately!
      if (dirty) {
        store.setPreviewConfig(null);
      }
      dirty = false;
      hostRef?.ui?.setPanelDirty?.(false);
      hostRef?.style?.remove('cw-wallpaper-ui');
      if (activeUploadId) {
        const abortId = activeUploadId;
        activeUploadId = null;
        void hostRef?.rpcRaw?.('DELETE', `/wallpapers/upload/${encodeURIComponent(abortId)}`).catch(() => {});
      }
      revokeWePreviewUrls();
      uploadProgress = null;
      uploading = false;
      scanningWe = false;
      thumbUrls.clear();
      if (container) container.replaceChildren();
      rootContainer = null;
      hostRef = null;
      draft = null;
    },
  };
}

const store = createWallpaperStore();
const backgroundController = createBackgroundController(store);
const settingsController = createSettingsController(store);

export async function activate() {
  // Store and controllers initialize lazily per mounted slot so disabling/enabling stays clean.
}

export async function mountLayer(slot, container, host) {
  if (slot !== 'background') return;
  await backgroundController.mount(container, host);
}

export function unmountLayer(slot, container) {
  if (slot !== 'background') return;
  backgroundController.unmount(container);
}

export async function mountSettings(container, host) {
  await settingsController.mount(container, host);
}

export function unmountSettings(container) {
  settingsController.unmount(container);
}

export function deactivate() {
  store.reset();
}

