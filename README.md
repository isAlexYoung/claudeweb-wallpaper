# ClaudeWeb Wallpaper (`claudeweb-wallpaper`)

Static, animated/video, per-theme, and login-screen wallpaper plugin for **ClaudeWeb** (Plugin Host v2), built with **zero runtime dependencies** and prebuilt SHA-256 integrity verification.

> 为 **ClaudeWeb**（Plugin Host v2）打造的独立壁纸插件：覆盖对话区、全局毛玻璃工作区与登录页，支持静态/动图/视频壁纸、三主题独立绑定、实时预览、多端同步与配置备份。

## Features / 核心功能

- **Flexible Coverage / 覆盖范围可选**
  - **Off (关闭)** — restores ClaudeWeb's exact default theme.
  - **Chat Only (仅对话区)** — wallpapers behind the conversation area while keeping sidebars solid.
  - **Full Workspace (全局工作区)** — full-bleed edge-to-edge wallpaper with seamless smoked dark / frosted light glassmorphism (`backdrop-filter`), floating transparent header, frosted composer capsule, and adaptive typography contrast (`tone: 'auto' | 'dark' | 'light'`) while keeping CodeMirror editors, xterm terminals, and approval dialogs crisp and solid.
- **Per-Theme Wallpapers & Auto Luminance / 暖白 · 浅色 · 深色独立绑定与明暗自适应**
  - Bind different wallpapers and glass settings to `warm`, `light`, and `dark`, switching automatically with ClaudeWeb's theme.
  - Uploaded photos and videos automatically sample image brightness so dark wallpapers get crisp white text + smoked dark glass even on Warm/Light themes, with one-click manual override (`Auto` / `Dark Glass` / `Light Glass`).
- **Static, Animated & Video Wallpapers / 静态、动图与视频壁纸**
  - Built-in curated theme gradients + local uploads (`PNG`, `JPEG`, `WebP`, `AVIF`, `GIF`, `MP4`, `WebM`, up to 50 MB).
  - Streams via **Scoped Media Tickets** with full HTTP `Range` / `206` seeking, automatic background-tab pause (`visibilitychange`), automatic video poster capture, and `prefers-reduced-motion` static fallback.
- **Login Screen Sync / 登录页与加载页壁纸**
  - Optional `Single` or `Per-Theme` login appearance snapshot verified by the ClaudeWeb host (`/api/public/appearance`). Disabling clears it immediately.
- **Live Drawer Preview & Multi-Device Safety / 抽屉实时预览与多端防冲突**
  - Open directly from **Settings → Plugins → Open Panel**. Sliders preview live over the workspace; unsaved changes prompt before discarding.
  - Uses optimistic revision locking (`409 REVISION_CONFLICT`) + WebSocket broadcast for multi-device sync, with JSON config export/import.
- **Zero Runtime Dependencies & Prebuilt Integrity / 零依赖快速安装**
  - Ships prebuilt `dist/index.js` + `dist/server.cjs` with `manifest.json` SHA-256 `build.integrity` digests — installs in seconds without running `npm install`.

## Installation / 安装方式

Requires ClaudeWeb with **Plugin Host v2** (`apiVersion >= 2`).

1. Open ClaudeWeb → **Settings → Plugins (设置 → 插件)**.
2. Paste this repository URL and click **Install (安装)**:
   ```text
   https://github.com/isAlexYoung/claudeweb-wallpaper
   ```
3. Enable **Wallpaper** and click **Open Panel (打开面板)** to customize.

## Wallpaper Engine Compatibility Roadmap (Phase 3)

This plugin reserves a source adapter layer for future Wallpaper Engine package imports with realistic web-platform boundaries:

- **Planned support**:
  - `video` packages (`MP4` / `WebM` + `project.json` + preview image).
  - Best-effort pure static `web` packages inside a sandboxed `iframe` without external network access.
- **Explicitly not supported**:
  - `scene` (`.pkg` proprietary DirectX/OpenGL shader scenes) and `application` native executables.
  - Wallpaper Engine proprietary browser APIs (`window.wallpaperRegisterAudioListener`, `window.wallpaperPropertyListener` custom bindings, iCUE/Chroma LED sync).

## Development / 开发与构建

Requires Node.js >= 20 (no `npm install` needed):

```bash
# Build dist/index.js & dist/server.cjs and stamp SHA-256 integrity hashes into manifest.json
npm run build

# Run backend unit tests
npm test
```

## Security & Trust Model

Like all ClaudeWeb custom plugins, this plugin runs under ClaudeWeb's **Trusted Plugin Model** (frontend inside the authenticated app origin; backend as the `claudeweb` service user with data stored in `PLUGIN_DATA_DIR`). Uploaded media is validated via binary magic-byte sniffing (SVG/HTML/scripts are rejected), and login-screen assets are published solely through ClaudeWeb's host-verified public appearance API.

## License

MIT
