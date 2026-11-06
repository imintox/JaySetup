# Security

Jay Setup runs as administrator and changes system settings, so it is built to do as little as possible and to be easy to check.

## What it does

- Installs apps only through **winget** (Microsoft's package manager), which verifies each installer's hash.
- Applies a fixed list of registry and power-plan changes from `tweaks.js`.
- Removes a fixed list of preinstalled apps from `debloat.js`.
- Every command it runs is built from those built-in lists. Nothing you type, and nothing from the internet, is ever turned into a command.
- The only network request the app itself makes is app icons, loaded from Google's favicon service. This sends the website names of the apps in the list (for example `steampowered.com`) and nothing about you or your PC. Everything else is blocked.
- No telemetry, no accounts, no auto-update, nothing left running in the background.

## How it is locked down

- Sandboxed window with context isolation, no Node.js in the page, no DevTools in release builds, no navigation, no pop-ups, no `webview`, all permission prompts denied.
- A Content Security Policy plus a network allowlist (local files and the icon service only).
- The window can only call a small set of functions, and only from the app's own page. Every request is checked and unknown values are rejected.
- Windows tools (`reg`, `powershell`, `powercfg`, `taskkill`, `winget`) are started by full path with a safe working folder, so a file placed next to the exe can't be run in their place.
- Electron "fuses" are set so the app can't be turned into a plain Node.js process, can't be started with debug flags, and only loads its code from a checked `app.asar`.
- Only one install, tweak or debloat job can run at a time.
- Releases are built by GitHub Actions from this repo's source with locked dependency versions, not on a personal PC.

## Check your download

Each release includes `SHA256SUMS.txt`. In PowerShell, in the folder with the file:

```powershell
(Get-FileHash .\JaySetup-Setup.exe -Algorithm SHA256).Hash.ToLower()
```

The result should match the line for that file in `SHA256SUMS.txt`.

You can also confirm it was built by this repository's workflow (needs the [GitHub CLI](https://cli.github.com)):

```powershell
gh attestation verify .\JaySetup-Setup.exe --repo imintox/JaySetup
```

## Known limits

- **The exe is not code-signed**, because a signing certificate is a paid purchase. Windows SmartScreen may show "Windows protected your PC" the first time. The checksum and attestation above are how you confirm the file is genuine. Click **More info**, then **Run anyway**, only after checking.
- **It needs administrator rights** to install apps and change system settings. Only run it from a copy you got from this repository's Releases page.
- No software can be promised to be 100% secure. If you find a problem, please report it.

## Reporting a problem

Open a private report under **Security > Report a vulnerability** on the GitHub repository, or open an issue if it isn't sensitive.
