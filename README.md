# Jay Setup

One exe you run after a fresh Windows install. Tick the apps you want and it installs them silently, applies Windows tweaks, and can strip out preinstalled bloat. No plugins, no mods, nothing left running.

*Designed by: Jayden M.*

## Features

**Apps tab**
- One-click silent installs through the built-in Windows Package Manager (`winget`)
- 29 apps in 6 groups: game launchers (Steam, Epic, Xbox app, Xbox Gaming Services, EA app, Ubisoft Connect, GOG Galaxy, Battle.net), communication, browsers, media, utilities, drivers and runtimes, dev tools
- Quick-pick presets: Gamer, Everyday, Developer, Everything, None
- Search, per-group toggle, live progress bar, per-app status and a log
- Cancel at any time, apps already installed are skipped cleanly

**Windows Tweaks tab**
- 31 tweaks applied directly through the registry and system settings
- Every tweak can be reverted from the same screen
- Tries to create a System Restore point before applying
- Groups: File Explorer, Taskbar and Start, Appearance, Input, Gaming and Performance, Privacy and Cleanup
- Optional Restart Explorer button so changes show without signing out

**Debloat tab**
- Removes preinstalled and promoted apps: News, Weather, Tips, Feedback Hub, Solitaire, Clipchamp, Teams (personal), Copilot app, Candy Crush, Disney+, Netflix and more, plus optional OneDrive removal
- Uses a hand-picked list, so the Microsoft Store, winget, Calculator, Photos, Notepad, Terminal, Paint and the Xbox components games need are never touched
- Removes for all users and from the system image so apps don't come back for new accounts
- Creates a restore point first, and anything removed can be reinstalled from the Microsoft Store

## Using it

1. Download `JaySetup.exe` from the Releases page.
2. Run it. It asks for administrator rights (needed for installs and system tweaks).
3. Pick your apps or a quick-pick preset, then **Install selected**.
4. Open **Windows Tweaks**, tick what you want, then **Apply selected**.
5. Open **Debloat**, pick what to remove (or use Recommended), then **Remove selected**.
6. Press **Restart Explorer**, and sign out or restart if the app tells you to.

Requires Windows 10 or 11 with `winget`. Windows 11 has it built in. On Windows 10, update **App Installer** in the Microsoft Store. The Tweaks tab works without winget.

## Notes

- A few tweaks are Windows 11 only (left-aligned taskbar, classic right-click menu, End task in taskbar) and a few need a supported GPU or driver. If one doesn't apply on your PC it shows as failed and the rest carry on.
- App icons are loaded from the web while the app is open. Offline, you get a coloured letter tile instead.
- Tweaks use the account you run the app as. Run it from your normal user account and approve the UAC prompt, so tweaks land on the right profile.

## Build it yourself

Needs [Node.js](https://nodejs.org) LTS.

```powershell
npm install
npm run build
```

The exe is created at `dist\JaySetup.exe`. To test without building, run `npm start` from an administrator PowerShell.

## Customise

- **Apps:** edit `apps.js`. Each entry has a name, a group, a `winget` ID and a `site` used for the icon. Find IDs with `winget search <name>`. Set `on: true` to tick it by default.
- **Tweaks:** edit `tweaks.js`. Each tweak lists its registry operations and how to undo them.
- **Debloat:** edit `debloat.js`. Each entry is an Appx package name (wildcards allowed). Find names with `Get-AppxPackage | Select Name`.

## Project layout

| File | Purpose |
|---|---|
| `main.js` | Runs winget and applies tweaks (Electron main process) |
| `preload.js` | Safe bridge between the window and the main process |
| `index.html` | The interface |
| `apps.js` | App catalog |
| `tweaks.js` | Tweak catalog |
| `debloat.js` | Removable preinstalled apps |
| `build/icon.ico` | App icon |
