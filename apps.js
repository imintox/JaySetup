// Catalog of installable apps. `winget` is the winget package ID.
// `source: "msstore"` is for Microsoft Store apps. `on: true` = ticked by default.
module.exports = [
  // Game launchers
  { id: "steam",   name: "Steam",                 cat: "Game Launchers", winget: "Valve.Steam", on: true, site: "steampowered.com" },
  { id: "epic",    name: "Epic Games Launcher",   cat: "Game Launchers", winget: "EpicGames.EpicGamesLauncher", on: true, site: "epicgames.com" },
  { id: "xbox",    name: "Xbox App",              cat: "Game Launchers", winget: "9MV0B5HZVK9Z", source: "msstore", on: true, site: "xbox.com" },
  { id: "gsvc",    name: "Xbox Gaming Services",  cat: "Game Launchers", winget: "9MWPM2CQNLHN", source: "msstore", on: true, site: "xbox.com" },
  { id: "ea",      name: "EA app",                cat: "Game Launchers", winget: "ElectronicArts.EADesktop", site: "ea.com" },
  { id: "ubi",     name: "Ubisoft Connect",       cat: "Game Launchers", winget: "Ubisoft.Connect", site: "ubisoft.com" },
  { id: "gog",     name: "GOG Galaxy",            cat: "Game Launchers", winget: "GOG.Galaxy", site: "gog.com" },
  { id: "bnet",    name: "Battle.net",            cat: "Game Launchers", winget: "Blizzard.BattleNet", site: "battle.net" },

  // Communication
  { id: "discord", name: "Discord",               cat: "Communication", winget: "Discord.Discord", on: true, site: "discord.com" },
  { id: "telegram",name: "Telegram",              cat: "Communication", winget: "Telegram.TelegramDesktop", site: "telegram.org" },
  { id: "zoom",    name: "Zoom",                  cat: "Communication", winget: "Zoom.Zoom", site: "zoom.us" },

  // Browsers
  { id: "chrome",  name: "Google Chrome",         cat: "Browsers", winget: "Google.Chrome", on: true, site: "chrome.com" },
  { id: "firefox", name: "Firefox",               cat: "Browsers", winget: "Mozilla.Firefox", site: "firefox.com" },
  { id: "brave",   name: "Brave",                 cat: "Browsers", winget: "Brave.Brave", site: "brave.com" },

  // Media
  { id: "spotify", name: "Spotify",               cat: "Media", winget: "Spotify.Spotify", on: true, site: "spotify.com" },
  { id: "vlc",     name: "VLC",                   cat: "Media", winget: "VideoLAN.VLC", on: true, site: "videolan.org" },
  { id: "obs",     name: "OBS Studio",            cat: "Media", winget: "OBSProject.OBSStudio", site: "obsproject.com" },

  // Utilities
  { id: "7zip",    name: "7-Zip",                 cat: "Utilities", winget: "7zip.7zip", on: true, site: "7-zip.org" },
  { id: "npp",     name: "Notepad++",             cat: "Utilities", winget: "Notepad++.Notepad++", site: "notepad-plus-plus.org" },
  { id: "powertoys",name: "PowerToys",            cat: "Utilities", winget: "Microsoft.PowerToys", site: "microsoft.com" },
  { id: "everything",name: "Everything (search)", cat: "Utilities", winget: "voidtools.Everything", site: "voidtools.com" },

  // Drivers & runtimes games need
  { id: "nvapp",   name: "NVIDIA App",            cat: "Drivers & Runtimes", winget: "Nvidia.NvidiaApp", site: "nvidia.com" },
  { id: "vcredist",name: "Visual C++ Runtime (x64)", cat: "Drivers & Runtimes", winget: "Microsoft.VCRedist.2015+.x64", on: true, site: "microsoft.com" },
  { id: "directx", name: "DirectX Runtime",       cat: "Drivers & Runtimes", winget: "Microsoft.DirectX", on: true, site: "microsoft.com" },
  { id: "dotnet8", name: ".NET Desktop Runtime 8", cat: "Drivers & Runtimes", winget: "Microsoft.DotNet.DesktopRuntime.8", on: true, site: "dotnet.microsoft.com" },

  // Dev
  { id: "git",     name: "Git",                   cat: "Dev Tools", winget: "Git.Git", site: "git-scm.com" },
  { id: "vscode",  name: "Visual Studio Code",    cat: "Dev Tools", winget: "Microsoft.VisualStudioCode", site: "code.visualstudio.com" },
  { id: "node",    name: "Node.js LTS",           cat: "Dev Tools", winget: "OpenJS.NodeJS.LTS", site: "nodejs.org" },
  { id: "python",  name: "Python 3.12",           cat: "Dev Tools", winget: "Python.Python.3.12", site: "python.org" },
];
