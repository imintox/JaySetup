# Jay Setup

**Set up a fresh Windows install in minutes.** Tick the apps you want and Jay Setup installs them silently, applies a set of Windows tweaks, and strips out preinstalled bloat. No plugins, no mods, nothing left running afterwards.

*Designed by: Jayden M.*

---

## Download

Go to the **[Releases](../../releases/latest)** page and pick one:

| File | Use it when |
|---|---|
| `JaySetup-Setup.exe` | You want a normal installer with Start menu and desktop shortcuts, and an entry in *Installed apps* to uninstall it later. |
| `JaySetup-Portable.exe` | You want one file to run from a USB stick on a fresh PC, with nothing to install. |

Both ask for administrator rights, because installing apps and changing system settings needs them.

> **SmartScreen warning:** the exe isn't code-signed (a signing certificate is a paid purchase), so Windows may say *"Windows protected your PC"* the first time. Check your download using the steps in [SECURITY.md](SECURITY.md), then choose **More info > Run anyway**.

**Requirements:** Windows 10 or 11 with `winget`. Windows 11 has it built in. On Windows 10, update **App Installer** in the Microsoft Store. The Tweaks and Debloat tabs work without winget.

---

## What it does

### Apps
Silent installs through Windows' own package manager (`winget`), which verifies every installer.

- **Game launchers:** Steam, Epic Games, Xbox app, Xbox Gaming Services, EA app, Ubisoft Connect, GOG Galaxy, Battle.net
- **Communication:** Discord, Telegram, Zoom
- **Browsers:** Chrome, Firefox, Brave
- **Media:** Spotify, VLC, OBS Studio
- **Utilities:** 7-Zip, Notepad++, PowerToys, Everything
- **Drivers and runtimes:** NVIDIA App, Visual C++, DirectX, .NET 8
- **Dev tools:** Git, VS Code, Node.js, Python

One-click presets (**Gamer**, **Everyday**, **Developer**, **Everything**), search, a live progress bar, per-app status, and a Cancel button. Apps that are already installed are skipped cleanly.

### Windows Tweaks
31 tweaks, applied directly through registry and system settings. Each one can be **reverted** from the same screen.

| Group | Examples |
|---|---|
| File Explorer | Show file extensions and hidden files, classic right-click menu, open to This PC, long file paths |
| Taskbar and Start | Left-aligned icons; hide Task View, Widgets, Chat and search; clock seconds; remove Start ads and web search |
| Appearance | Dark mode, faster menus, no startup delay |
| Input | Mouse acceleration off, no Sticky Keys popups |
| Gaming and performance | Game DVR off, GPU scheduling, High performance power plan, Fast Startup off |
| Privacy and cleanup | Minimum telemetry, no advertising ID, no promo apps, Copilot off, no forced restarts |

### Debloat
Removes preinstalled and promoted apps from a hand-picked list: News, Weather, Tips, Feedback Hub, Solitaire, Clipchamp, personal Teams, the Copilot app, Candy Crush, Disney+, Netflix and more, plus optional OneDrive removal.

The Microsoft Store, winget, Calculator, Photos, Notepad, Terminal, Paint, Edge and the Xbox components that games need are **never** on the list. Apps are removed for all users and from the system image so they don't come back for new accounts. Anything removed can be reinstalled from the Microsoft Store.

---

## How to use it

1. Run **Jay Setup** and approve the administrator prompt.
2. **Apps:** pick a preset or tick apps, then **Install selected**.
3. **Windows Tweaks:** tick what you want, then **Apply selected**.
4. **Debloat:** use **Recommended** or pick your own, then **Remove selected**.
5. Press **Restart Explorer**, and sign out or restart if the app tells you to.

Before applying tweaks or removing apps, Jay Setup tries to create a **System Restore point** (skipped if System Protection is off).

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "winget was not found" | Update **App Installer** in the Microsoft Store, then restart Jay Setup. |
| An app shows **failed** | Open **Log** at the bottom for the exit code. Search the right ID with `winget search <name>` and update `apps.js`. |
| A tweak shows **failed** | It probably doesn't apply to your Windows version (for example the classic menu is Windows 11 only). The rest still apply. |
| Taskbar didn't change | Press **Restart Explorer**, or sign out and back in. |
| App icons show as letters | You're offline. Icons load from the web while the app is open. |

---

## Security

Short version: it only runs commands from its own built-in lists, installs through winget, makes no network calls except app icons, and releases are built by GitHub Actions with checksums and a signed build attestation you can verify. Details, how to check a download, and the known limits are in **[SECURITY.md](SECURITY.md)**.

---

## Build it yourself

Needs [Node.js](https://nodejs.org) LTS and Windows.

```powershell
npm install
npm run build
```

This creates `dist\JaySetup-Setup.exe` and `dist\JaySetup-Portable.exe`. Use `npm run build:installer` or `npm run build:portable` for just one. To try it without building, run `npm start` from an administrator PowerShell.

### Publishing a release

Releases are built on GitHub's servers, not on a personal PC. Push a tag and the workflow in `.github/workflows/release.yml` does the rest:

```powershell
git tag v1.4.0
git push origin v1.4.0
```

It builds both exes, writes `SHA256SUMS.txt`, signs a build attestation and publishes the release.

---

## Customise

- **Apps:** edit `apps.js`. Each entry has a name, group, `winget` ID and a `site` for the icon. Set `on: true` to tick it by default. Find IDs with `winget search <name>`.
- **Tweaks:** edit `tweaks.js`. Each tweak lists its registry changes and how to undo them.
- **Debloat:** edit `debloat.js`. Each entry is an Appx package name (wildcards allowed). List yours with `Get-AppxPackage | Select Name`.

## Project layout

| File | Purpose |
|---|---|
| `main.js` | Runs winget, applies tweaks and removes apps |
| `preload.js` | The only bridge between the window and `main.js` |
| `index.html` | The interface |
| `apps.js` / `tweaks.js` / `debloat.js` | The three catalogs |
| `build/icon.ico` | App icon |
| `.github/workflows/release.yml` | Builds, checksums, attests and publishes releases |
| `SECURITY.md` | Security details and how to verify a download |
