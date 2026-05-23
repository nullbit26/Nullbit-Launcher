# NULLBIT Launcher — Changelog

## v3.0.24 (2026-05-24)

### Status Bar — Inline Launch Status
- **feat**: INV/HP/FOOD/STATE now inline in `launch-row` next to LAUNCH BOT button — separate panel removed
- **feat**: INV display — ASCII segments `▰▰▰▱▱▱▱▱▱▱▱▱` (12 blocks, 3 slots each), turns red >75%, pulses >90%
- **feat**: HP color-coded: green (>60%) / amber (30–60%) / red critical with pulse (<30%)
- **feat**: STATE badge on second row with per-state glow animations (IDLE/GATHERING/COMBAT/FLEE/FOLLOWING)
- **feat**: Status bar **hidden** when bot is OFFLINE — no empty fields shown
- **feat**: Boot sequence — bar appears **2s after bot process confirmed** (after main glitch flash settles)
- **feat**: Appear animation — blur→brightness→clear fade-in (0.6s)
- **feat**: Shutdown animation — brightness→blur fade-out (0.6s), synced with other stop effects
- **feat**: Animated dots `·` → `··` → `···` (amber) appear 1s after panel, persist until real telemetry arrives
- **fix**: `btn-launch` fixed width — status row doesn't shift on button text change
- **fix**: HP/FOOD `min-width` — layout stable during dots animation

### Window
- **feat**: Default size `1240×800`, `minWidth: 1240` / `minHeight: 800` — cannot resize below default
- **feat**: Maximize/Restore button `□` in titlebar with blue hover
- **fix**: All titlebar buttons equal `28×28px` with flex-centered icons

---

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
