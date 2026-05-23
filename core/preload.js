/**
 * NULLBIT Launcher — Preload (secure IPC bridge)
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('launcher', {
  // Window
  minimize: () => ipcRenderer.send('window-minimize'),
  close:    () => ipcRenderer.send('window-close'),
  relaunch: () => ipcRenderer.send('window-relaunch'),

  // Config
  loadConfig: ()       => ipcRenderer.invoke('config-load'),
  saveConfig: (cfg)    => ipcRenderer.invoke('config-save', cfg),

  // Bot
  launchBot:  ()       => ipcRenderer.invoke('bot-launch'),
  stopBot:    ()       => ipcRenderer.invoke('bot-stop'),
  botStatus:  ()       => ipcRenderer.invoke('bot-status'),

  // Update (bot)
  checkUpdate:    ()        => ipcRenderer.invoke('update-check'),
  downloadUpdate: (info)    => ipcRenderer.invoke('update-download', info),

  // Launcher update (NSIS electron-updater only)
  nsisCheckUpdate:    () => ipcRenderer.invoke('nsis-check-update'),
  nsisDownloadUpdate: () => ipcRenderer.invoke('nsis-download-update'),
  nsisInstallUpdate:  () => ipcRenderer.invoke('nsis-install-update'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onAutoUpdateAvailable: (cb) => ipcRenderer.on('auto-update-available', (_e, d) => cb(d)),
  onAutoUpdateProgress:  (cb) => ipcRenderer.on('auto-update-progress',  (_e, d) => cb(d)),
  onAutoUpdateReady:     (cb) => ipcRenderer.on('auto-update-ready',     (_e, d) => cb(d)),
  onAutoUpdateReadyOnce: (cb) => ipcRenderer.once('auto-update-ready',   (_e, d) => cb(d)),
  onAutoUpdateError:     (cb) => ipcRenderer.once('auto-update-error',   (_e, d) => cb(d)),
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('auto-update-progress');
    ipcRenderer.removeAllListeners('auto-update-ready');
    ipcRenderer.removeAllListeners('auto-update-error');
  },

  // Manual install helpers
  openLauncherDir: () => ipcRenderer.invoke('open-launcher-dir'),

  // Bot
  botExists: () => ipcRenderer.invoke('bot-exists'),
  downloadBot: () => ipcRenderer.invoke('download-bot'),
  onBotDownloadProgress: (cb) => ipcRenderer.on('bot-download-progress', (_e, d) => cb(d)),

  // Events (renderer subscriptions)
  onBotLog:         (cb) => ipcRenderer.on('bot-log',         (_e, d) => cb(d)),
  onBotStatus:      (cb) => ipcRenderer.on('bot-status',      (_e, d) => cb(d)),
  onUpdateProgress: (cb) => ipcRenderer.on('update-progress', (_e, d) => cb(d)),

  // Cleanup
  removeAllListeners: (ch) => ipcRenderer.removeAllListeners(ch),
});
