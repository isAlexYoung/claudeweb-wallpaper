export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function resolveSlotForTheme(config, themeMode) {
  if (!config || config.scope === 'none') return null;
  if (!config.perTheme) return config.shared || null;
  const key = themeMode === 'dark' || themeMode === 'light' || themeMode === 'warm' ? themeMode : 'warm';
  return config.themes?.[key] || config.shared || null;
}

export function createWallpaperStore() {
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
