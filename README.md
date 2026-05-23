# NULLBIT LAUNCHER v3.0.6

**Professional AI Bot Management Interface for Minecraft**

## Quick Start

### First Launch (New Users)
1. Download and install `NULLBIT Launcher Setup 3.0.3.exe`
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

- **Modern UI**: Red theme with gold accents, glitch effects, scanlines

  
<img width="1204" height="799" alt="image" src="https://github.com/user-attachments/assets/267acc51-4ee5-4b30-8b5d-5d00da9c05c8" />

- **Animated WELCOME**: Text scramble effect (hacking/decoding style)
- **Red NULLBIT Logo**: Pulsing animation on first-time setup
- **Download Progress**: Real-time speed (MB/s) and progress bar
- **Smooth Transitions**: Professional fade effects, no screen shake

---

## System Requirements

- Windows 10/11 (64-bit)
- 4GB RAM minimum
- Internet connection for AI features
- Minecraft Java Edition server (1.16.5 - 1.21.11)

---

## Configuration Guide

### CORE ACCESS Tab Settings

| Section | Field | Description |
|---------|-------|-------------|
| **LICENSE** | License Key | Your purchased license (XXXX-XXXX-XXXX-XXXX) |
| **SERVER** | Host | Server IP or domain (e.g., `play.server.com`) |
| | Port | Server port (default: 25565) |
| | Version | Minecraft version (e.g., `1.20.1`) |
| | Auth | `offline` (cracked) or `microsoft` (premium) |
| **BOT IDENTITY** | Username | Bot name in-game |
| | Login Password | For online-mode servers |
| | Allowed User | Your nickname (bot obeys only you) |
| **AI CONFIG** | OpenAI API Key | Your `sk-...` key for GPT features |
| | Assistant ID | Your `asst_...` ID for custom assistant |

### AI Setup (Optional)

To enable AI chat commands:
1. Get API key:
https://platform.openai.com/api-keys
https://build.nvidia.com/models
3. Create assistant:
https://platform.openai.com/assistants
5. Copy IDs to AI CONFIG section
6. Save and restart bot

---

## Updates

### First-Time Bot Installation
When you first launch NULLBIT without AIBot.exe:
- **WELCOME screen** appears with hacking-style animations
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

---

## Version History

## v3.0.6
- Fixed duplicate `nsis-install-update` IPC handler crash on startup
- Removed portable build target (NSIS only)
- Switched launcher auto-update to native NSIS `electron-updater` flow
- Added bot update row in launcher update banner with GitHub link
- Fixed bot version badge showing "vinstalled" instead of actual version
- Fixed hardcoded `LAUNCHER_VERSION` constant

## v3.0.5
- Added full-screen restart modal after bot download
- Added `RESTART LAUNCHER` button with auto-relaunch via IPC
- Added bot update notification row in launcher update banner
- Fixed NaN/NaN MB display during downloads
- Fixed telemetry OFFLINE status (added heartbeat in ResourceSystem and GlobalWatchdog)
- Updated launcher version badge to v3.0.5

## v3.0.3
- Initial public release


---

**© 2026 NULLBIT**
**Current Version: v3.0.6**
