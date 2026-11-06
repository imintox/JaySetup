// Native Windows tweaks (registry / system settings only, no plugins or mods).
// Each op: { k: key, v: valueName, t: type, d: data, off: undo }
//   off undefined -> delete the value on revert
//   off "KEY"     -> delete the whole key on revert
//   off <value>   -> set that value on revert
// Or a command op: { cmd, args, offArgs }
// explorer: true  -> needs Explorer restart to show
// reboot: true    -> needs a reboot / sign-out
const ADV = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced";
const CDM = "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager";
const D = "REG_DWORD";
const S = "REG_SZ";

const cdm = (name) => ({ k: CDM, v: name, t: D, d: "0", off: "1" });

module.exports = [
  // ---- File Explorer ----
  { id: "tw-fileext", cat: "File Explorer", name: "Show file extensions", on: true, explorer: true,
    desc: "Shows .exe, .png, etc. on every file.",
    ops: [{ k: ADV, v: "HideFileExt", t: D, d: "0", off: "1" }] },
  { id: "tw-hidden", cat: "File Explorer", name: "Show hidden files", on: true, explorer: true,
    desc: "Shows hidden files and folders.",
    ops: [{ k: ADV, v: "Hidden", t: D, d: "1", off: "2" }] },
  { id: "tw-thispc", cat: "File Explorer", name: "Open Explorer to This PC", explorer: true,
    desc: "Explorer opens on This PC instead of Home / Quick access.",
    ops: [{ k: ADV, v: "LaunchTo", t: D, d: "1" }] },
  { id: "tw-fullpath", cat: "File Explorer", name: "Full path in Explorer title bar", explorer: true,
    desc: "Shows the whole folder path in the window title.",
    ops: [{ k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\CabinetState", v: "FullPath", t: D, d: "1", off: "0" }] },
  { id: "tw-compact", cat: "File Explorer", name: "Compact view (less spacing)", explorer: true,
    desc: "Tighter rows in Explorer lists.",
    ops: [{ k: ADV, v: "UseCompactMode", t: D, d: "1", off: "0" }] },
  { id: "tw-classicmenu", cat: "File Explorer", name: "Classic right-click menu (Win 11)", on: true, explorer: true,
    desc: "Brings back the full right-click menu without 'Show more options'.",
    ops: [{ k: "HKCU\\Software\\Classes\\CLSID\\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\\InprocServer32", t: S, d: "", off: "KEY" }] },
  { id: "tw-thispcicon", cat: "File Explorer", name: "This PC icon on desktop", explorer: true,
    desc: "Adds the This PC icon to your desktop.",
    ops: [{ k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\HideDesktopIcons\\NewStartPanel", v: "{20D04FE0-3AEA-1069-A2D8-08002B30309D}", t: D, d: "0", off: "1" }] },
  { id: "tw-longpaths", cat: "File Explorer", name: "Enable long file paths", reboot: true,
    desc: "Lifts the 260-character path limit for apps that support it.",
    ops: [{ k: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem", v: "LongPathsEnabled", t: D, d: "1", off: "0" }] },

  // ---- Taskbar & Start ----
  { id: "tw-tbleft", cat: "Taskbar & Start", name: "Taskbar icons aligned left (Win 11)", explorer: true,
    desc: "Moves taskbar icons and Start to the left.",
    ops: [{ k: ADV, v: "TaskbarAl", t: D, d: "0", off: "1" }] },
  { id: "tw-taskview", cat: "Taskbar & Start", name: "Hide Task View button", explorer: true,
    desc: "Removes the Task View button from the taskbar.",
    ops: [{ k: ADV, v: "ShowTaskViewButton", t: D, d: "0", off: "1" }] },
  { id: "tw-widgets", cat: "Taskbar & Start", name: "Turn off Widgets", explorer: true,
    desc: "Disables the Widgets / News panel and its taskbar button.",
    ops: [{ k: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Dsh", v: "AllowNewsAndInterests", t: D, d: "0" }] },
  { id: "tw-chat", cat: "Taskbar & Start", name: "Hide Chat / Teams button", explorer: true,
    desc: "Removes the Chat button from the taskbar.",
    ops: [{ k: ADV, v: "TaskbarMn", t: D, d: "0", off: "1" }] },
  { id: "tw-searchbox", cat: "Taskbar & Start", name: "Hide taskbar search box", explorer: true,
    desc: "Removes the search box / icon from the taskbar.",
    ops: [{ k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Search", v: "SearchboxTaskbarMode", t: D, d: "0", off: "1" }] },
  { id: "tw-seconds", cat: "Taskbar & Start", name: "Show seconds in taskbar clock", explorer: true,
    desc: "Clock shows hours, minutes and seconds.",
    ops: [{ k: ADV, v: "ShowSecondsInSystemClock", t: D, d: "1", off: "0" }] },
  { id: "tw-endtask", cat: "Taskbar & Start", name: "'End task' in taskbar right-click", explorer: true,
    desc: "Adds End task to the right-click menu of taskbar apps (Win 11 23H2+).",
    ops: [{ k: ADV + "\\TaskbarDeveloperSettings", v: "TaskbarEndTask", t: D, d: "1", off: "0" }] },
  { id: "tw-startads", cat: "Taskbar & Start", name: "Remove Start menu ads and suggestions",
    desc: "Turns off suggested apps, tips and promoted content.",
    ops: [cdm("SystemPaneSuggestionsEnabled"), cdm("SoftLandingEnabled"), cdm("RotatingLockScreenOverlayEnabled"),
      cdm("SubscribedContent-338387Enabled"), cdm("SubscribedContent-338388Enabled"), cdm("SubscribedContent-338389Enabled"),
      cdm("SubscribedContent-353694Enabled"), cdm("SubscribedContent-353696Enabled")] },
  { id: "tw-bing", cat: "Taskbar & Start", name: "Turn off web results in Start search",
    desc: "Start search only searches your PC, not Bing.",
    ops: [{ k: "HKCU\\Software\\Policies\\Microsoft\\Windows\\Explorer", v: "DisableSearchBoxSuggestions", t: D, d: "1" }] },

  // ---- Appearance ----
  { id: "tw-dark", cat: "Appearance", name: "Dark mode for Windows and apps",
    desc: "Switches the system and app theme to dark.",
    ops: [
      { k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize", v: "AppsUseLightTheme", t: D, d: "0", off: "1" },
      { k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize", v: "SystemUsesLightTheme", t: D, d: "0", off: "1" } ] },
  { id: "tw-menudelay", cat: "Appearance", name: "Faster menus",
    desc: "Removes the delay before menus open.", reboot: true,
    ops: [{ k: "HKCU\\Control Panel\\Desktop", v: "MenuShowDelay", t: S, d: "0", off: "400" }] },
  { id: "tw-startdelay", cat: "Appearance", name: "Remove startup app delay", reboot: true,
    desc: "Startup apps launch right away after sign-in.",
    ops: [{ k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Serialize", v: "StartupDelayInMSec", t: D, d: "0" }] },

  // ---- Input ----
  { id: "tw-mouseaccel", cat: "Input", name: "Turn off mouse acceleration", on: true, reboot: true,
    desc: "1:1 mouse movement, better for gaming. Applies after sign-out.",
    ops: [
      { k: "HKCU\\Control Panel\\Mouse", v: "MouseSpeed", t: S, d: "0", off: "1" },
      { k: "HKCU\\Control Panel\\Mouse", v: "MouseThreshold1", t: S, d: "0", off: "6" },
      { k: "HKCU\\Control Panel\\Mouse", v: "MouseThreshold2", t: S, d: "0", off: "10" } ] },
  { id: "tw-sticky", cat: "Input", name: "Stop Sticky / Filter / Toggle Keys popups", on: true,
    desc: "No more popup when you tap Shift five times in a game.",
    ops: [
      { k: "HKCU\\Control Panel\\Accessibility\\StickyKeys", v: "Flags", t: S, d: "506", off: "510" },
      { k: "HKCU\\Control Panel\\Accessibility\\Keyboard Response", v: "Flags", t: S, d: "122", off: "126" },
      { k: "HKCU\\Control Panel\\Accessibility\\ToggleKeys", v: "Flags", t: S, d: "58", off: "62" } ] },

  // ---- Gaming & Performance ----
  { id: "tw-gamedvr", cat: "Gaming & Performance", name: "Turn off Game DVR background recording",
    desc: "Stops Xbox Game Bar capturing in the background (small FPS gain).",
    ops: [
      { k: "HKCU\\System\\GameConfigStore", v: "GameDVR_Enabled", t: D, d: "0", off: "1" },
      { k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR", v: "AppCaptureEnabled", t: D, d: "0", off: "1" } ] },
  { id: "tw-hags", cat: "Gaming & Performance", name: "Hardware-accelerated GPU scheduling", reboot: true,
    desc: "Lets the GPU manage its own memory scheduling. Needs a supported GPU and driver.",
    ops: [{ k: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\GraphicsDrivers", v: "HwSchMode", t: D, d: "2", off: "1" }] },
  { id: "tw-highperf", cat: "Gaming & Performance", name: "High performance power plan",
    desc: "Uses the High performance plan. Revert goes back to Balanced.",
    ops: [{ cmd: "powercfg", args: ["/setactive", "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"], offArgs: ["/setactive", "381b4222-f694-41f0-9685-ff5bb260df2e"] }] },
  { id: "tw-faststartup", cat: "Gaming & Performance", name: "Turn off Fast Startup", reboot: true,
    desc: "Makes Shut down a real shutdown. Fixes odd driver and update issues.",
    ops: [{ k: "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power", v: "HiberbootEnabled", t: D, d: "0", off: "1" }] },

  // ---- Privacy & Cleanup ----
  { id: "tw-telemetry", cat: "Privacy & Cleanup", name: "Reduce telemetry to minimum",
    desc: "Sets diagnostic data to the lowest level your edition allows.",
    ops: [{ k: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection", v: "AllowTelemetry", t: D, d: "0" }] },
  { id: "tw-adid", cat: "Privacy & Cleanup", name: "Turn off advertising ID",
    desc: "Apps can't use your advertising ID.",
    ops: [{ k: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\AdvertisingInfo", v: "Enabled", t: D, d: "0", off: "1" }] },
  { id: "tw-consumer", cat: "Privacy & Cleanup", name: "Stop auto-installed promo apps",
    desc: "Blocks Windows from silently adding suggested apps.",
    ops: [{ k: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent", v: "DisableWindowsConsumerFeatures", t: D, d: "1" }] },
  { id: "tw-copilot", cat: "Privacy & Cleanup", name: "Turn off Windows Copilot", explorer: true,
    desc: "Disables Copilot via policy.",
    ops: [{ k: "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot", v: "TurnOffWindowsCopilot", t: D, d: "1" }] },
  { id: "tw-noreboot", cat: "Privacy & Cleanup", name: "No forced restart after updates while signed in",
    desc: "Windows Update won't reboot while you're logged in.",
    ops: [{ k: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU", v: "NoAutoRebootWithLoggedOnUsers", t: D, d: "1" }] },
];
