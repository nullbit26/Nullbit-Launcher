# NULLBIT Launcher — Changelog

## v3.0.23
- **feat**: Cyberpunk glitch banner animation on show (`bannerGlitchIn`) — clip-path reveal, scaleY bounce, hue-rotate flash (0.45s steps)
- **feat**: Cyberpunk glitch banner animation on dismiss (`bannerGlitchOut`) — X-split, scaleY collapse, brightness flash (0.35s)
- **feat**: Chromatic aberration `::after` edge overlay on banner (red/cyan)
- **feat**: Animated progress bar — dark shimmer body (`cyberBarShift`) + gold spark sweep (`cyberSpark`)
- **fix**: Removed duplicate `downloadFile` — bot update now installs reliably on first attempt

## v3.0.22
- **fix**: `installBotUpdateInline` — replaced `launcher.on('update-progress')` with `launcher.onUpdateProgress` — progress bar now updates during bot download

## v3.0.21
- **fix**: Hide launcher update row in banner when only a bot update is available
- **fix**: Version string — remove redundant `v` prefix in bot version display
- **fix**: Reset banner row visibility on dismiss so next show works correctly

## v3.0.7
- Added **NEURAL** tab — live parameter panel for bot behavior tuning
  - Sub-item under CORE ACCESS in sidebar
  - 5 sections: COMBAT FLEE (7 params), PVP (4), NAVIGATION (4), MINING (4), AI (3)
  - SAVE writes to `config.json → neural` section
  - Values load from `config.json` on launcher start with defaults shown inline
- Added hot-reload of neural params in bot (`ConfigManager.watchNeural`)
  - `fs.watch` on `config.json`, debounced 300ms
  - Patches live `config` object in-place — no bot restart needed for COMBAT/PVP/NAV/AI params
- Fixed `BranchMineJob` constants — `BRANCH_LENGTH`, `MAX_BRANCHES`, `ORE_SCAN_RADIUS`, `TORCH_INTERVAL` now read from `process.env` (was hardcoded)
- `ConfigManager` — added `applyNeuralOverrides()` and `watchNeural()` exports

## v3.0.6
- Fixed duplicate `nsis-install-update` IPC handler crash on startup
- Removed portable build target (NSIS only)
- Switched launcher auto-update to native NSIS `electron-updater` flow
- Added bot update row in launcher update banner with GitHub link
- Fixed bot version badge showing "vinstalled" instead of actual version
- Fixed hardcoded `LAUNCHER_VERSION` constant

## v3.0.5
- Added cyberpunk full-screen restart modal after bot download
- Added `RESTART LAUNCHER` button with auto-relaunch via IPC
- Added bot update notification row in launcher update banner
- Fixed NaN/NaN MB display during downloads
- Fixed telemetry OFFLINE status (added heartbeat in ResourceSystem and GlobalWatchdog)
- Updated launcher version badge to v3.0.5

## v3.0.3
- Initial public release
