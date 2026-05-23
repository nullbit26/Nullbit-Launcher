# NULLBIT Launcher — Changelog

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
