/**
 * Electron Preload Script
 * Runs in the renderer process before the page loads
 */

const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the APIs we want to expose
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron
});

