import { createBackgroundController } from './background.mjs';
import { createSettingsController } from './settings.mjs';
import { createWallpaperStore } from './store.mjs';

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
