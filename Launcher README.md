# NULLBIT LAUNCHER v3.0.7 - Cyberpunk Edition

**Professional AI Bot Management Interface for Minecraft**

🎮 **What's New in v3.0.7:**
- **NEURAL Tab**: Live parameter panel for real-time bot behavior tuning
  - Sub-item under CORE ACCESS in sidebar
  - 5 sections: COMBAT FLEE, PVP, NAVIGATION, MINING, AI (22 parameters total)
  - SAVE applies changes to running bot in ~300ms — no restart needed
  - Mining params (BRANCH_LENGTH etc.) take effect on next bot start

🎮 **Previous v3.0.6:**
- Fixed duplicate `nsis-install-update` IPC handler crash on startup
- Switched launcher auto-update to native NSIS `electron-updater` flow

🎮 **Previous v3.0.5:**
- Added cyberpunk full-screen restart modal after bot download
- Fixed telemetry OFFLINE status

🎮 **Previous v3.0.4:**
- **DIAGNOSTICS Tab**: Neural Diagnostics with real-time telemetry
  - Tactical Weights, Combat Telemetry, System Watchdog
  - Expedition stats, Critical Events log, User Override status
- **Real Terminal Logic**: Animated dots only on active process
- **STOP BOT Fix**: Correctly handles manual stop vs crash

🎮 **Previous v3.0.3:**
- Cyberpunk 2077 style UI with glitch effects
- Auto bot download from GitHub/Dropbox
- First-time setup wizard
- Improved update system

---

## Quick Start

### First Launch (New Users)
1. Download and install `NULLBIT Launcher Setup 3.0.4.exe`
2. Run launcher - it will show **WELCOME** screen with cyberpunk effects
3. Click **AUTO INSTALL BOT** to download latest AIBot.exe automatically
4. Or click **MANUAL INSTALL** and place AIBot.exe in the opened folder
5. Restart launcher after bot installation

### Regular Launch
1. Run `NULLBIT-Launcher.exe`
2. Enter license key in **CORE ACCESS** tab
3. Configure server connection (host, port, username)
4. Click **LAUNCH BOT** on **DASHBOARD**

---

## Visual Features

- **Cyberpunk UI**: Red theme with gold accents, glitch effects, scanlines
- **Animated WELCOME**: Text scramble effect (hacking/decoding style)
- **Red NULLBIT Logo**: Pulsing animation on first-time setup
- **Download Progress**: Real-time speed (MB/s) and progress bar
- **Smooth Transitions**: Professional fade effects, no screen shake

---

## System Requirements

- Windows 10/11 (64-bit)
- 4GB RAM minimum
- Internet connection for AI features
- Minecraft Java Edition server (1.16.5 - 1.20.4)

---

## Configuration Guide

### CORE ACCESS Tab Settings

| Section | Field | Description |
|---------|-------|-------------|
| **LICENSE** | License Key | Your purchased license (XXXX-XXXX-XXXX-XXXX) |
| **SERVER** | Host | Server IP or domain (e.g., `play.server.com`) |
| | Port | Server port (default: 25565) |
| | Version | Minecraft version (e.g., `1.20.1`) |
| | Auth | `offline` (no auth) or `microsoft` (premium) |
| **BOT IDENTITY** | Username | Bot name in-game |
| | Login Password | For online-mode servers |
| | Allowed User | Your nickname (bot obeys only you) |
| **AI CONFIG** | OpenAI API Key | Your `sk-...` key for GPT features |
| | Assistant ID | Your `asst_...` ID for custom assistant |

### NEURAL Tab — Live Parameter Tuning

| Section | Parameter | Description |
|---------|-----------|-------------|
| **COMBAT FLEE** | Critical HP | Bot flees if HP ≤ this value (default: 6) |
| | Safe HP | Bot returns to combat when HP ≥ this (default: 12) |
| | Retreat Threshold | Risk score to trigger flee (default: 2.5) |
| | Flee Distance | Blocks to run from threat (default: 10) |
| | Danger Radius | Immediate danger zone in blocks (default: 11) |
| | HP Weight | HP factor in retreat score (default: 1.0) |
| | Pressure Weight | Crowd pressure factor (default: 0.58) |
| **PVP** | Attack Cooldown | ms between sword hits (default: 600) |
| | Ideal Distance | Melee engagement range (default: 2.9) |
| | Kite HP | Switch to kiting below this HP (default: 8) |
| | Engage Safe HP | Attack aggressively above this HP (default: 15) |
| **NAVIGATION** | Path Think Timeout | ms for A* pathfinding (default: 24000) |
| | Stuck Check Ticks | Ticks before stuck detection (default: 11) |
| | Follow Distance | Player follow range in blocks (default: 3) |
| | Guard Mob Distance | Mob guard radius (default: 10) |
| **MINING** | Branch Length | Tunnel length per branch (default: 32) — *restart required* |
| | Max Branches | Branches per session (default: 8) — *restart required* |
| | Ore Scan Radius | Ore detection radius (default: 6) — *restart required* |
| | Torch Interval | Steps between torches (default: 8) — *restart required* |
| **AI** | AI Cooldown | ms between AI requests (default: 4000) |
| | AI Timeout | AI response timeout ms (default: 12000) |
| | Thread Reset | Reset thread after N replies, 0=off (default: 0) |

> **SAVE** writes to `config.json → neural` and hot-reloads into the running bot in ~300ms. Mining params require bot restart.

### AI Setup (Optional)

To enable AI chat commands:
1. Get API key: https://platform.openai.com/api-keys
2. Create assistant: https://platform.openai.com/assistants
3. Copy IDs to AI CONFIG section
4. Save and restart bot

---

## Updates

### First-Time Bot Installation
When you first launch NULLBIT without AIBot.exe:
- **Cyberpunk WELCOME screen** appears with hacking-style animations
- **AUTO INSTALL BOT** - Downloads and installs latest bot automatically
- **MANUAL INSTALL** - Opens launcher folder for manual file placement
- Download shows real-time speed (MB/s) and progress

### Bot Updates (Auto)
- Go to **UPDATE** tab
- Click **CHECK FOR UPDATE**
- If available — click **DOWNLOAD & INSTALL**
- Bot updates automatically, no manual file replacement
- Bot version shown in sidebar after update

### Launcher Updates (Auto/Manual)
- Yellow banner appears if new launcher version available
- Click **DOWNLOAD** to get latest installer
- Run new installer - it will update automatically
- Current version shown in sidebar: `LAUNCHER v3.0.3`

---

## Controls

| Action | Method |
|--------|--------|
| Launch/Stop Bot | LAUNCH button or **F1** hotkey |
| Minimize to Tray | Close window (X button) |
| Show from Tray | Double-click tray icon |
| View Logs | DASHBOARD tab → Log console |
| Copy Logs | COPY button in log toolbar |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "AIBOT.EXE NOT FOUND" on first launch | Click **AUTO INSTALL BOT** or place AIBot.exe manually |
| "Direct execution blocked" | Always launch bot through NULLBIT Launcher |
| Bot won't connect | Check host/port in CORE ACCESS |
| AI not responding | Verify API key and Assistant ID |
| Update fails | Run launcher as Administrator |
| Slow download speed | Check internet connection or use Manual Install |
| Launcher shows old version after update | Reinstall using latest `Setup 3.0.3.exe`

---

## Security

- Bot **cannot** be launched directly — only via NULLBIT Launcher
- Config and license stored locally
- No data collection or telemetry

---

## Support

For issues and feature requests:
- GitHub Issues: `nullbit26/Nullbit-Client`
- Discord: [invite link]

---

## Version History

- **v3.0.7** (2026-05-23) - NEURAL Tab: live bot parameter tuning, hot-reload, BranchMineJob params exposed
- **v3.0.6** (2026-05-22) - Fixed duplicate IPC handler crash, NSIS auto-update
- **v3.0.5** (2026-05-22) - Restart modal after bot download, telemetry OFFLINE fix
- **v3.0.4** (2026-05-21) - DIAGNOSTICS tab, real terminal logic
- **v3.0.3** (2026-05-22) - Cyberpunk Edition: Auto bot download, hacking effects, improved UI
- **v3.0.0** (2026-05-20) - Initial release with basic launcher functionality

---

**© 2026 NULLBIT Systems**
**Current Version: v3.0.7**
