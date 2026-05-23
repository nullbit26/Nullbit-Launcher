/**
 * NULLBIT GUI Launcher — Electron Main Process
 */

const { app, BrowserWindow, ipcMain, shell, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const https = require('https');
const { autoUpdater } = require('electron-updater');

// Configure auto-updater for NSIS builds
autoUpdater.autoDownload = false; // Manual download via UI
autoUpdater.autoInstallOnAppQuit = true;

const UPDATE_URL = 'https://api.github.com/repos/nullbit26/Nullbit-Client/releases/latest';

// In portable/packed mode __dirname points inside the asar, so we use
// the directory of the actual .exe for user files (config, bot exe)
const IS_PACKED    = app.isPackaged;
// PORTABLE_EXECUTABLE_DIR is set by electron-builder portable wrapper
// and points to the actual folder where NULLBIT-Launcher.exe lives
const EXE_DIR      = IS_PACKED
  ? (process.env.PORTABLE_EXECUTABLE_DIR || path.dirname(process.execPath))
  : path.join(__dirname, '..');
const RENDERER_DIR = IS_PACKED ? path.join(process.resourcesPath, 'app', 'renderer') : path.join(__dirname, '..', 'renderer');
const CORE_DIR     = IS_PACKED ? path.join(process.resourcesPath, 'app')              : __dirname;
const CONFIG_FILE  = path.join(EXE_DIR, 'config.json');
const BOT_EXE      = path.join(EXE_DIR, 'AIBot.exe');

let mainWindow = null;
let splashWindow = null;
let botProcess = null;
let tray = null;
let isQuitting = false;

// ────────────────────────────────────────────
//  Splash screen
// ────────────────────────────────────────────
function createSplash() {
  splashWindow = new BrowserWindow({
    width: 420,
    height: 420,
    frame: false,
    transparent: true,
    resizable: false,
    center: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(CORE_DIR, 'preload-splash.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  splashWindow.loadFile(path.join(RENDERER_DIR, 'splash.html'));
}

// ────────────────────────────────────────────
//  Main window
// ────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 640,
    minWidth: 800,
    minHeight: 560,
    frame: false,
    transparent: false,
    backgroundColor: '#1c1c1e',
    show: false,
    webPreferences: {
      preload: path.join(CORE_DIR, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: path.join(RENDERER_DIR, 'splash-logo.png'),
  });

  mainWindow.loadFile(path.join(RENDERER_DIR, 'index.html'));

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      tray?.displayBalloon({
        iconType: 'info',
        title: 'NULLBIT',
        content: 'Launcher minimized to tray. Bot keeps running.'
      });
    }
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

function createTray() {
  // Try multiple paths for tray icon (dev vs portable)
  const possiblePaths = [
    path.join(RENDERER_DIR, 'splash-logo.png'),
    path.join(EXE_DIR, 'resources', 'app', 'renderer', 'splash-logo.png'),
    path.join(process.resourcesPath, 'app', 'renderer', 'splash-logo.png'),
    path.join(__dirname, '..', 'renderer', 'splash-logo.png'),
  ];
  
  let iconPath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      iconPath = p;
      break;
    }
  }
  
  console.log('[TRAY] Icon path:', iconPath);
  
  let icon;
  if (iconPath) {
    try {
      icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
    } catch (e) {
      console.error('[TRAY] Failed to load icon:', e);
      icon = nativeImage.createEmpty();
    }
  } else {
    console.warn('[TRAY] Icon not found, using empty');
    icon = nativeImage.createEmpty();
  }
  
  tray = new Tray(icon);
  tray.setToolTip('NULLBIT Launcher');
  updateTrayMenu();
  tray.on('double-click', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });
}

function updateTrayMenu() {
  if (!tray) return;
  const running = !!(botProcess && !botProcess.killed);
  const menu = Menu.buildFromTemplate([
    { label: 'NULLBIT LAUNCHER', enabled: false },
    { type: 'separator' },
    { label: running ? '● BOT ONLINE' : '○ BOT OFFLINE', enabled: false },
    { type: 'separator' },
    { label: 'Show Window', click: () => { mainWindow?.show(); mainWindow?.focus(); } },
    { label: running ? 'Stop Bot' : 'Start Bot', click: () => {
      if (running) { botProcess?.kill(); }
      else { mainWindow?.show(); mainWindow?.webContents.send('tray-launch-bot'); }
    }},
    { type: 'separator' },
    { label: 'Quit', click: () => {
      isQuitting = true;
      if (botProcess && !botProcess.killed) botProcess.kill();
      app.quit();
    }}
  ]);
  tray.setContextMenu(menu);
}

// Splash done → show main
ipcMain.on('splash-done', () => {
  if (splashWindow) { splashWindow.close(); splashWindow = null; }
  if (mainWindow)   { mainWindow.show(); }
});

app.whenReady().then(() => {
  // Debug logging for paths
  console.log('[STARTUP] ========== PATHS ==========');
  console.log('[STARTUP] isPackaged:', app.isPackaged);
  console.log('[STARTUP] app.getVersion():', app.getVersion());
  console.log('[STARTUP] execPath:', process.execPath);
  console.log('[STARTUP] PORTABLE_EXECUTABLE_DIR:', process.env.PORTABLE_EXECUTABLE_DIR);
  console.log('[STARTUP] EXE_DIR:', EXE_DIR);
  console.log('[STARTUP] RENDERER_DIR:', RENDERER_DIR);
  console.log('[STARTUP] resourcesPath:', process.resourcesPath);
  console.log('[STARTUP] __dirname:', __dirname);
  console.log('[STARTUP] ================================');
  
  // Configure auto-updater feed (for NSIS)
  const feedURL = 'https://github.com/nullbit26/Nullbit-Launcher/releases/latest';
  autoUpdater.setFeedURL({
    provider: 'github',
    owner: 'nullbit26',
    repo: 'Nullbit-Launcher',
    releaseType: 'release'
  });
  console.log('[AUTO-UPDATE] Feed URL configured:', autoUpdater.getFeedURL());
  
  // Auto-updater events (for NSIS builds)
  autoUpdater.on('checking-for-update', () => {
    console.log('[AUTO-UPDATE] Checking for update...');
  });
  autoUpdater.on('update-available', (info) => {
    console.log('[AUTO-UPDATE] Update available:', info.version);
    console.log('[AUTO-UPDATE] Update info:', JSON.stringify(info));
    mainWindow?.webContents.send('auto-update-available', info);
  });
  autoUpdater.on('update-not-available', () => {
    console.log('[AUTO-UPDATE] No update available');
    console.log('[AUTO-UPDATE] Current version:', app.getVersion());
  });
  autoUpdater.on('download-progress', (progress) => {
    console.log('[AUTO-UPDATE] Download progress:', progress.percent.toFixed(1) + '%');
    mainWindow?.webContents.send('auto-update-progress', progress.percent);
  });
  autoUpdater.on('update-downloaded', (info) => {
    console.log('[AUTO-UPDATE] Downloaded, ready to install');
    console.log('[AUTO-UPDATE] Downloaded version:', info?.version);
    console.log('[AUTO-UPDATE] Current app version:', app.getVersion());
    console.log('[AUTO-UPDATE] Install path:', process.execPath);
    mainWindow?.webContents.send('auto-update-ready', info);
  });
  autoUpdater.on('error', (err) => {
    console.error('[AUTO-UPDATE] Error:', err);
    console.error('[AUTO-UPDATE] Error stack:', err.stack);
  });
  
  createSplash();
  createWindow();
  createTray();
});
app.on('window-all-closed', () => { /* keep alive in tray */ });
app.on('before-quit', () => { isQuitting = true; });

// ────────────────────────────────────────────
//  Window controls
// ────────────────────────────────────────────
ipcMain.on('window-minimize', () => mainWindow?.minimize());
ipcMain.on('window-close', () => {
  isQuitting = true;
  if (botProcess && !botProcess.killed) botProcess.kill();
  app.quit();
});
ipcMain.on('window-relaunch', () => {
  if (botProcess && !botProcess.killed) botProcess.kill();
  app.relaunch();
  app.exit(0);
});

// ────────────────────────────────────────────
//  Config
// ────────────────────────────────────────────
const DEFAULT_CONFIG = {
  bot_version: '1.0.0',
  license_key: '',
  minecraft: {
    host: '',
    port: 25565,
    version: '1.20.1',
    auth: 'offline',
    username: 'Nullbit',
    password: ''
  },
  bot: {
    allowed_user: '',
    server_password: ''
  }
};

ipcMain.handle('config-load', async () => {
  try {
    if (!fs.existsSync(CONFIG_FILE)) {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
      return { data: DEFAULT_CONFIG };
    }
    return { data: JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8')) };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle('config-save', async (_event, newConfig) => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(newConfig, null, 2), 'utf8');
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

// ────────────────────────────────────────────
//  Bot lifecycle
// ────────────────────────────────────────────
let isManualStop = false; // Flag to distinguish manual stop from crash

ipcMain.handle('bot-launch', async () => {
  if (botProcess && !botProcess.killed) return { error: 'ALREADY_RUNNING' };
  if (!fs.existsSync(BOT_EXE)) return { error: 'EXE_NOT_FOUND', path: BOT_EXE, exeDir: EXE_DIR, execPath: process.execPath, appExe: app.getPath('exe') };

  botProcess = spawn(BOT_EXE, ['--nullbit'], {
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe'],
    cwd: EXE_DIR,
  });

  botProcess.stdout.on('data', (d) => {
    mainWindow?.webContents.send('bot-log', { level: 'stdout', text: d.toString() });
  });
  botProcess.stderr.on('data', (d) => {
    mainWindow?.webContents.send('bot-log', { level: 'stderr', text: d.toString() });
  });
  botProcess.on('exit', (code) => {
    const wasManual = isManualStop;
    botProcess = null;
    isManualStop = false; // Reset flag
    // If manual stop, treat as normal exit (code 0)
    const effectiveCode = wasManual ? 0 : code;
    mainWindow?.webContents.send('bot-status', { running: false, exitCode: effectiveCode });
    updateTrayMenu();
  });

  mainWindow?.webContents.send('bot-status', { running: true });
  updateTrayMenu();
  return { ok: true };
});

ipcMain.handle('bot-stop', async () => {
  if (!botProcess || botProcess.killed) return { error: 'NOT_RUNNING' };
  isManualStop = true; // Set flag before killing
  botProcess.kill();
  return { ok: true };
});

ipcMain.handle('bot-status', async () => {
  return { running: !!(botProcess && !botProcess.killed) };
});

// ────────────────────────────────────────────
//  Auto-update
// Helper: simple HTTPS JSON fetch
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Nullbit-Launcher-GUI' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject).setTimeout(10000, () => reject(new Error('Timeout')));
  });
}

ipcMain.handle('update-check', async () => {
  try {
    const d = await fetchJson(UPDATE_URL);
    if (!d?.tag_name) return { error: 'INVALID_RESPONSE' };
    const version = d.tag_name.replace(/^v/, '');
    const asset = d.assets?.find((a) => a.name === 'AIBot.exe');
    return {
      version,
      tagName: d.tag_name,
      notes: d.body || '',
      downloadUrl: asset?.browser_download_url || null,
      fileSize: asset?.size || 0,
    };
  } catch (e) {
    return { error: e.message };
  }
});

// Helper: download file with redirect support
function downloadFile(url, destPath, onProgress) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : require('http');
    const file = fs.createWriteStream(destPath);
    
    protocol.get(url, { headers: { 'User-Agent': 'Nullbit-Launcher-GUI' } }, (res) => {
      // Handle redirects
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          file.close();
          try { fs.unlinkSync(destPath); } catch (e) {}
          downloadFile(redirectUrl, destPath, onProgress).then(resolve).catch(reject);
          return;
        }
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      
      const totalSize = parseInt(res.headers['content-length'] || '0');
      let downloaded = 0;
      
      res.on('data', (chunk) => {
        downloaded += chunk.length;
        if (onProgress && totalSize > 0) {
          onProgress(Math.min(100, Math.round((downloaded / totalSize) * 100)), downloaded, totalSize);
        }
      });
      
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
      file.on('error', reject);
    }).on('error', (err) => { file.close(); reject(err); }).setTimeout(300000, () => { file.close(); reject(new Error('Timeout')); });
  });
}

ipcMain.handle('update-download', async (_event, { url, fileSize }) => {
  const tmp = path.join(process.cwd(), 'AIBot.exe.tmp');
  try {
    await downloadFile(url, tmp, (pct, downloaded, total) => {
      mainWindow?.webContents.send('update-progress', { pct, downloaded, total });
    });

    const backup = BOT_EXE + '.backup';
    if (fs.existsSync(BOT_EXE)) {
      if (fs.existsSync(backup)) fs.removeSync(backup);
      fs.copyFileSync(BOT_EXE, backup);
    }
    if (fs.existsSync(BOT_EXE)) fs.removeSync(BOT_EXE);
    fs.renameSync(tmp, BOT_EXE);
    return { ok: true };
  } catch (e) {
    if (fs.existsSync(tmp)) fs.removeSync(tmp);
    return { error: e.message };
  }
});

// ────────────────────────────────────────────
//  Launcher Update Check
// ────────────────────────────────────────────

// Simple semver gt: returns true if a > b
function semverGt(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x > y) return true;
    if (x < y) return false;
  }
  return false;
}

const LAUNCHER_UPDATE_URL = 'https://api.github.com/repos/nullbit26/Nullbit-Launcher/releases/latest';
let _launcherUpdateInfo = null; // Store for auto-install

ipcMain.handle('launcher-update-check', async () => {
  try {
    const d = await fetchJson(LAUNCHER_UPDATE_URL);
    if (!d?.tag_name) return { error: 'INVALID_RESPONSE' };
    const latestVersion = d.tag_name.replace(/^v/, '');
    const currentVersion = app.getVersion();
    
    console.log('[UPDATER] Current version:', currentVersion);
    console.log('[UPDATER] Latest version from GitHub:', latestVersion);

    // Check if update needed
    const hasUpdate = semverGt(latestVersion, currentVersion);
    console.log('[UPDATER] Has update:', hasUpdate);

    // Find the .exe asset URL for auto-download
    const exeAsset = d.assets?.find(a => a.name.endsWith('.exe'));
    _launcherUpdateInfo = {
      version: latestVersion,
      tagName: d.tag_name,
      htmlUrl: d.html_url,
      downloadUrl: exeAsset?.browser_download_url || null,
      body: d.body,
    };

    if (!hasUpdate) {
      return { upToDate: true, currentVersion, latestVersion };
    }

    return {
      version: latestVersion,
      tagName: d.tag_name,
      htmlUrl: d.html_url,
      body: d.body,
      hasUpdate: true,
    };
  } catch (e) {
    console.error('[UPDATER] Check failed:', e.message);
    // 404 = repo not found or private, don't show error to user
    if (e.response?.status === 404) {
      return { upToDate: true };
    }
    return { error: e.message };
  }
});

// Helper to download with redirect following
function downloadFile(url, destPath, onProgress, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) {
      reject(new Error('Too many redirects'));
      return;
    }

    const protocol = url.startsWith('https:') ? https : require('http');
    const file = fs.createWriteStream(destPath);

    protocol.get(url, { headers: { 'User-Agent': 'Nullbit-Launcher-GUI' } }, (res) => {
      // Handle redirects (301, 302, 307, 308)
      if ([301, 302, 307, 308].includes(res.statusCode)) {
        const redirectUrl = res.headers.location;
        if (!redirectUrl) {
          reject(new Error('Redirect without Location header'));
          return;
        }
        // Resolve relative URLs
        const resolvedUrl = new URL(redirectUrl, url).toString();
        file.close();
        fs.unlink(destPath, () => {});
        downloadFile(resolvedUrl, destPath, onProgress, maxRedirects - 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }

      const totalSize = parseInt(res.headers['content-length'] || '0');
      let downloaded = 0;

      res.on('data', (chunk) => {
        downloaded += chunk.length;
        if (totalSize > 0 && onProgress) {
          // Cap at 100% to handle any size mismatches
          const percent = Math.min(100, Math.round((downloaded / totalSize) * 100));
          onProgress(percent);
        }
      });

      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(destPath);
      });
    }).on('error', (e) => {
      fs.unlink(destPath, () => {});
      reject(e);
    });
  });
}

ipcMain.handle('launcher-update-download', async () => {
  try {
    if (!_launcherUpdateInfo?.downloadUrl) {
      return { error: 'NO_DOWNLOAD_URL' };
    }

    const tempPath = path.join(app.getPath('temp'), 'NULLBIT-Launcher-new.exe');
    const url = _launcherUpdateInfo.downloadUrl;

    await downloadFile(url, tempPath, (percent) => {
      if (mainWindow) {
        mainWindow.webContents.send('launcher-download-progress', percent);
      }
    });

    _launcherUpdateInfo.tempPath = tempPath;
    return { ok: true, path: tempPath };
  } catch (e) {
    return { error: e.message };
  }
});

ipcMain.handle('launcher-update-install', async () => {
  try {
    if (!_launcherUpdateInfo?.tempPath) {
      return { error: 'NO_DOWNLOADED_FILE' };
    }

    // IMPORTANT: In portable mode, process.execPath points to the exe itself
    // But we need to be explicit about which file to replace
    const exeName = path.basename(process.execPath);
    const currentExe = path.join(EXE_DIR, exeName);
    const newExe = _launcherUpdateInfo.tempPath;
    
    console.log('[UPDATER] EXE_DIR:', EXE_DIR);
    console.log('[UPDATER] process.execPath:', process.execPath);
    console.log('[UPDATER] Current exe (calculated):', currentExe);
    console.log('[UPDATER] New exe:', newExe);
    console.log('[UPDATER] Is packaged:', app.isPackaged);
    console.log('[UPDATER] PORTABLE_EXECUTABLE_DIR:', process.env.PORTABLE_EXECUTABLE_DIR);

    // Verify downloaded file exists
    if (!fs.existsSync(newExe)) {
      console.error('[UPDATER] New exe not found:', newExe);
      return { error: 'DOWNLOADED_FILE_MISSING' };
    }
    console.log('[UPDATER] Verified new exe exists, size:', fs.statSync(newExe).size);

    // Use standalone updater.js - the professional approach
    // Try multiple locations for portable mode
    let standaloneUpdater = path.join(CORE_DIR, 'updater.js');
    
    // Fallback locations
    const possiblePaths = [
      standaloneUpdater,
      path.join(__dirname, 'updater.js'),  // Same dir as main.js
      path.join(__dirname, '..', 'updater.js'),  // Parent of core (app root)
      path.join(path.dirname(process.argv[0]), 'resources', 'app', 'updater.js'),
      path.join(path.dirname(process.argv[0]), 'resources', 'app', 'core', 'updater.js'),
      path.join(path.dirname(process.execPath), 'resources', 'app', 'updater.js'),
    ];
    
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        standaloneUpdater = p;
        console.log('[UPDATER] Found updater.js at:', p);
        break;
      }
    }
    
    // Verify updater.js exists
    if (!fs.existsSync(standaloneUpdater)) {
      console.error('[UPDATER] updater.js not found. Tried:', possiblePaths);
      return { error: 'UPDATER_SCRIPT_MISSING' };
    }
    
    const parentPid = process.pid;
    // CRITICAL: In portable mode, process.argv[0] is the actual exe path
    // process.execPath may point to electron internals
    const nodePath = process.argv[0];
    
    console.log('[UPDATER] Spawning standalone updater...');
    console.log('[UPDATER] Parent PID:', parentPid);
    console.log('[UPDATER] Node (argv[0]):', nodePath);
    console.log('[UPDATER] Updater:', standaloneUpdater);
    console.log('[UPDATER] Arguments:', [parentPid.toString(), currentExe, newExe]);
    
    // Write debug info before spawn
    const debugInfo = {
      nodePath, standaloneUpdater, parentPid, currentExe, newExe,
      cwd: process.cwd(), argv: process.argv, execPath: process.execPath
    };
    fs.writeFileSync(
      path.join(app.getPath('temp'), 'nullbit-spawn-debug.json'),
      JSON.stringify(debugInfo, null, 2)
    );
    
    // Spawn updater as completely detached process
    const updaterProc = require('child_process').spawn(
      nodePath,
      [standaloneUpdater, parentPid.toString(), currentExe, newExe],
      {
        detached: true,
        stdio: ['ignore', 'ignore', 'ignore'],
        windowsHide: false  // Show window for debugging
      }
    );
    
    if (!updaterProc.pid) {
      console.error('[UPDATER] Failed to spawn updater!');
      return { error: 'UPDATER_SPAWN_FAILED' };
    }
    
    console.log('[UPDATER] Updater spawned with PID:', updaterProc.pid);
    
    // Completely detach
    updaterProc.unref();
    
    // CRITICAL: Exit immediately so updater can do its job
    console.log('[UPDATER] EXITING NOW - updater will handle the rest');
    
    // Hard exit - no delays, no cleanup that might hang
    process.exit(0);
    
    return { ok: true };
  } catch (e) {
    console.error('[UPDATER] Install error:', e);
    return { error: e.message };
  }
});

// ────────────────────────────────────────────
//  NSIS Auto-Updater (for installed version)
// ────────────────────────────────────────────

// Check for updates using electron-updater (NSIS builds only)
ipcMain.handle('nsis-check-update', async () => {
  if (process.env.PORTABLE_EXECUTABLE_DIR) {
    return { portable: true, message: 'Portable mode uses manual update' };
  }
  try {
    const result = await autoUpdater.checkForUpdates();
    return { 
      available: !!result?.updateInfo,
      version: result?.updateInfo?.version,
      releaseDate: result?.updateInfo?.releaseDate
    };
  } catch (e) {
    return { error: e.message };
  }
});

// Download update
ipcMain.handle('nsis-download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { ok: true };
  } catch (e) {
    return { error: e.message };
  }
});

// Install downloaded update and relaunch
ipcMain.handle('nsis-install-update', async () => {
  try {
    console.log('[AUTO-UPDATE] quitAndInstall called');
    autoUpdater.quitAndInstall(false, true);
    return { ok: true };
  } catch (e) {
    console.error('[AUTO-UPDATE] Install error:', e);
    return { error: e.message };
  }
});

// Get actual app version (from package.json)
ipcMain.handle('get-app-version', async () => {
  return { version: app.getVersion() };
});

// Open launcher directory for manual bot install
ipcMain.handle('open-launcher-dir', async () => {
  try {
    console.log('[IPC] Opening launcher directory:', EXE_DIR);
    const result = await shell.openPath(EXE_DIR);
    console.log('[IPC] openPath result:', result);
    if (result) {
      return { error: result }; // result is error string if failed
    }
    return { ok: true, path: EXE_DIR };
  } catch (e) {
    console.error('[IPC] Failed to open directory:', e);
    return { error: e.message };
  }
});

// Check if bot executable exists
ipcMain.handle('bot-exists', async () => {
  const botPath = path.join(EXE_DIR, 'AIBot.exe');
  return { exists: fs.existsSync(botPath), path: botPath };
});

// Download bot from GitHub releases or Dropbox link
ipcMain.handle('download-bot', async (event) => {
  const BOT_REPO = 'nullbit26/Nullbit-Client';
  const botPath = path.join(EXE_DIR, 'AIBot.exe');
  
  try {
    // Get latest release
    const releaseUrl = `https://api.github.com/repos/${BOT_REPO}/releases/latest`;
    const release = await fetchJson(releaseUrl);
    
    if (!release) {
      return { error: 'Could not fetch release info' };
    }
    
    // Check for Dropbox link in release body
    const dropboxMatch = release.body?.match(/https:\/\/www\.dropbox\.com\/[^\s)]+/);
    const downloadUrl = dropboxMatch ? dropboxMatch[0].replace('?dl=0', '?dl=1') : null;
    
    if (!downloadUrl) {
      // Fallback: try to find .exe in assets
      const asset = release.assets?.find(a => a.name.endsWith('.exe'));
      if (!asset) {
        return { error: 'No download link found. Add Dropbox link to release notes.' };
      }
      await downloadFile(asset.browser_download_url, botPath, (percent) => {
        event.sender.send('bot-download-progress', percent);
      });
    } else {
      // Download from Dropbox
      console.log('[BOT-DL] Downloading from Dropbox:', downloadUrl);
      await downloadFile(downloadUrl, botPath, (percent) => {
        event.sender.send('bot-download-progress', percent);
      });
    }
    
    return { ok: true, version: release.tag_name };
  } catch (e) {
    return { error: e.message };
  }
});

