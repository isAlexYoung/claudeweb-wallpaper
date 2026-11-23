/**
 * ClaudeWeb Plugin Host v2 — Standalone TypeScript SDK Declarations
 *
 * Copy this file directly into your independent plugin repository (e.g. `types/claudeweb-plugin.d.ts`)
 * or reference it from your tsconfig.json. Zero runtime dependencies.
 *
 * Host contract version: apiVersion = 2 (ClaudeWeb >= 2.2.0)
 */

export type PluginSlot = 'tab' | 'background' | 'overlay' | 'settings';

export type PluginPanelMode = 'drawer' | 'modal';

export type PluginPanelConfig = {
  title?: string;
  mode?: PluginPanelMode;
  width?: number;
};

export type PluginBuildMode = 'auto' | 'prebuilt';

export type PluginBuildConfig = {
  /**
   * - `"auto"` (default): runs `npm ci --ignore-scripts` (or `npm install --ignore-scripts`)
   *   and `npm run build` when `package.json` is present.
   * - `"prebuilt"`: skips install & build when declared artifacts exist and pass `integrity`.
   */
  mode?: PluginBuildMode;
  /** Map of relative artifact paths (e.g. `"dist/index.js"`) to `"sha256-<hex|base64>"` digests. */
  integrity?: Record<string, string>;
};

export type PluginManifestV2 = {
  $schema?: string;
  manifestVersion: 2;
  minPluginApi?: number;
  requiredCapabilities?: string[];
  name: string;
  displayName: string;
  version: string;
  description?: string;
  author?: string;
  icon?: string;
  type?: 'module' | 'react';
  slot?: PluginSlot;
  slots?: PluginSlot[];
  panel?: PluginPanelConfig;
  publicAppearance?: boolean;
  entry: string;
  server?: string | null;
  build?: PluginBuildConfig;
  permissions?: string[];
  [unknownFutureField: string]: unknown;
};

export type PluginAgentRunState =
  | 'idle'
  | 'thinking'
  | 'streaming'
  | 'tool_use'
  | 'waiting_approval'
  | 'completed'
  | 'cancelled'
  | 'error';

export type PluginAgentRunSnapshot = {
  sessionId: string;
  turnId: string;
  runId: string;
  state: PluginAgentRunState;
  toolName?: string;
  isFocusedSession: boolean;
  updatedAt: number;
};

export type PluginHostEvent =
  | {
      type: 'agent:state';
      seq: number;
      timestamp: number;
      sessionId: string;
      turnId: string;
      runId: string;
      state: PluginAgentRunState;
      toolName?: string;
      isFocusedSession: boolean;
    }
  | {
      type: 'chat:user-sent';
      seq: number;
      timestamp: number;
      sessionId: string;
      turnId: string;
    }
  | {
      type: 'chat:turn-finished';
      seq: number;
      timestamp: number;
      sessionId: string;
      turnId: string;
      runId: string;
      outcome: 'completed' | 'cancelled' | 'error';
    }
  | {
      type: 'sudo:requested';
      seq: number;
      timestamp: number;
      active: boolean;
      requestId?: string;
    }
  | {
      type: 'connection:status';
      seq: number;
      timestamp: number;
      status: 'connecting' | 'connected' | 'disconnected';
      reconnected?: boolean;
    };

export type PluginHostContext = {
  theme: 'dark' | 'light';
  themeMode: 'warm' | 'light' | 'dark';
  locale: string;
  route: 'workspace' | 'scheduled-tasks' | 'settings';
  project: { name: string; path: string } | null;
  session: { id: string; title: string } | null;
  reducedMotion: boolean;
  isMobile: boolean;
};

export type PluginWallpaperSurfaceVars = {
  scope: 'none' | 'chat' | 'workspace';
  /** Glass opacity in [0.06, 0.95]. Recommended DSH-style range: 0.25–0.45. */
  surfaceOpacity: number;
  /** Frosted glass blur radius in px [0, 40]. Recommended: 18–24. */
  glassBlurPx: number;
  /**
   * Adaptive glass & text ink tone:
   * - `'dark'`: luminous light text + smoked dark glass (ideal for dark/vivid photo & video wallpapers)
   * - `'light'`: crisp dark text + bright frosted glass (ideal for pastel/warm light wallpapers)
   * - `'auto'` (default): follows ClaudeWeb's current theme
   */
  tone?: 'auto' | 'dark' | 'light';
};

export type PublicAppearanceSlot = {
  mediaType: 'none' | 'gradient' | 'image' | 'video';
  cssGradient?: string;
  mediaHash?: string;
  mediaMime?: string;
  posterHash?: string;
  posterMime?: string;
  fit: 'cover' | 'contain' | 'center';
  positionX: number;
  positionY: number;
  blurPx: number;
  scrimOpacity: number;
  scrimMode: 'auto' | 'light' | 'dark';
  cardOpacity: number;
  videoPlaybackRate?: number;
};

export type PublicAppearanceState = {
  schema: 1;
  enabled: boolean;
  revision: string;
  mode: 'single' | 'per-theme';
  slots: Partial<Record<'default' | 'warm' | 'light' | 'dark', PublicAppearanceSlot>>;
};

export type PluginHostApi = {
  readonly pluginName: string;
  readonly hostVersion: string;
  readonly apiVersion: number;
  readonly capabilities: ReadonlySet<string>;
  readonly signal: AbortSignal;
  readonly context: PluginHostContext;
  onContextChange: (cb: (ctx: PluginHostContext) => void) => () => void;
  events: {
    on: <T extends PluginHostEvent['type']>(
      type: T,
      cb: (event: Extract<PluginHostEvent, { type: T }>) => void,
    ) => () => void;
    getSnapshot: () => {
      connection: 'connecting' | 'connected' | 'disconnected';
      activeRuns: PluginAgentRunSnapshot[];
    };
  };
  rpc: <T = unknown>(method: string, path: string, body?: unknown) => Promise<T>;
  rpcRaw: (
    method: string,
    path: string,
    init?: { body?: BodyInit | null; headers?: Record<string, string>; signal?: AbortSignal },
  ) => Promise<Response>;
  media: {
    createUrl: (path: string, ttlMs?: number) => Promise<{ url: string; expiresAt: number }>;
  };
  assets: {
    fetch: (relativePath: string) => Promise<Response>;
  };
  ws: {
    connect: () => WebSocket;
  };
  style: {
    set: (id: string, cssText: string) => void;
    remove: (id: string) => void;
    clearAll: () => void;
  };
  /** Provided ONLY to the single currently active `background` plugin. */
  surface?: {
    setWallpaperVars: (vars: PluginWallpaperSurfaceVars) => void;
    clear: () => void;
  };
  storage: {
    get: <T = unknown>(key: string) => T | null;
    set: (key: string, value: unknown) => void;
    remove: (key: string) => void;
  };
  /** Provided ONLY when the plugin declares `"publicAppearance": true`. */
  publicAppearance?: {
    uploadMedia: (
      data: Blob | ArrayBuffer | Uint8Array,
      contentType?: string,
    ) => Promise<{ hash: string; mimeType: string; bytes: number }>;
    publish: (payload: {
      enabled: boolean;
      mode: 'single' | 'per-theme';
      slots: Partial<Record<'default' | 'warm' | 'light' | 'dark', PublicAppearanceSlot>>;
    }) => Promise<{ appearance: PublicAppearanceState }>;
    clear: () => Promise<void>;
  };
  ui: {
    closePanel: () => void;
    notify: (message: string, tone?: 'info' | 'success' | 'error') => void;
    setPanelDirty?: (dirty: boolean) => void;
  };
};

export type ClaudeWebPluginModule = {
  /** Called once per live plugin instance before its first slot mounts. */
  activate?: (host: PluginHostApi) => void | Promise<void>;
  /** Called once when the final slot unmounts or the plugin is disabled/updated/uninstalled/logged out. */
  deactivate?: () => void;
  /** Called for `background` and `overlay` slots. */
  mountLayer?: (slot: 'background' | 'overlay', container: HTMLElement, host: PluginHostApi) => void | Promise<void>;
  unmountLayer?: (slot: 'background' | 'overlay', container: HTMLElement) => void;
  /** Called when the user clicks "Open Panel" in Settings -> Plugins (for `settings` slot). */
  mountSettings?: (container: HTMLElement, host: PluginHostApi) => void | Promise<void>;
  unmountSettings?: (container: HTMLElement) => void;
  /** Called for `tab` slots and v1 plugin compatibility. */
  mount?: (container: HTMLElement, host: PluginHostApi) => void | Promise<void>;
  unmount?: (container: HTMLElement) => void;
};
