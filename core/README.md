# NULLBIT GUI Launcher v3.0.4

Electron-based cyberpunk launcher for NULLBIT AI Bot.

## What's New in v3.0.4

- **DIAGNOSTICS Tab** — Neural Diagnostics panel with 6 telemetry sections:
  - **Tactical Weights**: threatScore, survivalScore, resourceScore (LIVE indicator)
  - **Combat Telemetry**: mode (PVP/PVE/FLEE/IDLE), target distance, weapon, last action
  - **System Watchdog**: last check time, lock holder, path status (ok/stuck/deadlock)
  - **Critical Events**: Glitch-log for errors with timestamps
  - **Expedition Telemetry**: trees chopped, ores mined, tunnel fallbacks, danger stops
  - **User Override**: Shows when AI is blocked by user command
- **Real Terminal Logic**: Animated dots only on active process; removed from completed lines
- **STOP BOT Fix**: Correctly distinguishes manual stop from crash

## Structure

```
NULLBIT/
├── core/
│   ├── main.js            — Electron main process (IPC, bot spawn, config, auto-update, system tray)
│   ├── preload.js         — Secure IPC bridge (contextBridge)
│   ├── preload-splash.js  — Splash screen IPC bridge
│   └── package.json
├── renderer/
│   ├── index.html         — UI layout (tabs, overlays, SVG)
│   ├── style.css          — Cyberpunk warm-dark theme + all animations
│   └── app.js             — Renderer logic
├── assets/
│   └── icon.ico
└── config.json            — Bot configuration (auto-created on first run)
```

## Setup

```bash
cd core
npm install
npm start
```

## Tabs

| Tab | Tag | Description |
|-----|-----|-------------|
| DASHBOARD | `[ SYS ]` | Launch/stop bot, tactical scores, realtime chart, log console |
| CORE ACCESS | `[ CFG ]` | Visual editor for config.json |
| SYSTEM | `[ SYS ]` | Launcher system settings |
| DIAGNOSTICS | `[ DIAG ]` | Neural Diagnostics: telemetry, watchdog, combat, resources |
| SQUAD | `[ SQD ]` | Multi-bot management (placeholder, coming soon) |
| UPDATE | `[ UPD ]` | GitHub Releases auto-update with progress bar |

## Visual Features

- **Boot sequence** — Animated typewriter on startup, 5 lines printed to log with dots that disappear on completion
- **Cyberpunk glitch** — Log lines animate with RGB-shift glitch effects (`log-err` aggressive, `log-sys` subtle)
- **Crack effect** — On bot start (yellow) / stop (red): glowing line with scrolling code text flashes across screen
- **Scanlines** — Full-window CRT scanline overlay
- **Vignette** — Subtle edge darkening for depth
- **Tickers** — 20 red scrolling binary/hex lines behind log (appear after first real bot log)
- **Animated dots** — Any log line ending with `...` shows animated dots; dots removed when `[ OK ]`/`[ ERR ]` arrives
- **Boot sequence dots** — First boot line animates dots, removed when sequence completes
- **Custom cursor** — Yellow cyberpunk arrow cursor globally, pointer cursor on buttons
- **Uptime timer** — Shows `HH:MM:SS` in sidebar while bot is running
- **Launch button pulse** — Soft yellow glow pulse when bot is offline; stops when running
- **Realtime chart** — Canvas oscilloscope for threat/survival/resource scores (last 80 points)

## Log Console Features

- **Autoscroll toggle** — `⇣ AUTO` button freezes log position for reading; turns red when off
- **Copy log** — `⎘ COPY` copies all log lines to clipboard; shows `✓ COPIED` feedback
- **Line counter** — Shows total lines, resets on CLR
- **Text selection** — Log text is selectable; selection highlighted with yellow glow
- **Clear** — `CLR` resets log and counter, restores idle overlay

## System Tray

- Closing window hides to tray (bot keeps running)
- Double-click tray icon → restore window
- Right-click menu: bot status, Show Window, Start/Stop Bot, Quit
- Tray menu updates dynamically when bot starts/stops

## Telemetry JSON Schemas

Bot must print JSON to stdout for DIAGNOSTICS panel:

### Tactical Scores (every 2s, throttled)
```js
{ type: 'scores', threatScore: 0.3, survivalScore: 0.1, resourceScore: 0.8, status: 'LIVE' }
```

### Combat Telemetry (on state change)
```js
{ type: 'combat', mode: 'PVP', targetDist: 5.2, weapon: 'diamond_sword', lastAction: 'engage:zombie', status: 'ENGAGED' }
```

### Watchdog Status (every 5s + on deadlock)
```js
{ type: 'watchdog', lastCheck: '16:25:09', lockHolder: 'TreeJob', pathStatus: 'ok', status: 'ACTIVE' }
```

### Resource Telemetry (on progress)
```js
{ type: 'resource', trees: 12, ores: 3, fallbacks: 2, dangerStops: 1, status: 'GATHERING' }
```

## Log Line Classes

| Class | Color | Usage |
|-------|-------|-------|
| `log-sys` | Yellow | `[ SYS ]` system messages |
| `log-ok` | Green | `[ OK ]` success messages |
| `log-err` | Red | `[ ERR ]` errors |
| `log-warn` | Orange | `[ WARN ]` warnings |
| `log-raw` | Dark red | Raw bot stdout |
| `log-auth` | Blue | Authorization lines |
| `log-license-fail` | Bright red | License failure (glitch loop) |

## Build (optional)

```bash
npm run build
# → dist/NULLBIT Launcher Setup.exe
```

Requires `electron-builder`. Place `icon.ico` in `assets/` before building.
