// Preinstalled / promoted apps that can be removed.
// `pkg`: Appx package name pattern(s) (wildcards ok). `ps`: custom PowerShell instead.
// `on: true` = ticked in the Recommended pick.
// Deliberately NOT listed (removing them breaks things): Microsoft Store, App Installer (winget),
// Calculator, Photos, Notepad, Terminal, Paint, Xbox Identity/TCUI/Speech, Gaming Services, Edge.
module.exports = [
  // ---- Microsoft apps ----
  { id: "bl-news", cat: "Microsoft Apps", name: "News", pkg: "Microsoft.BingNews", on: true, desc: "Bing News app." },
  { id: "bl-weather", cat: "Microsoft Apps", name: "Weather", pkg: "Microsoft.BingWeather", on: true, desc: "Bing Weather app." },
  { id: "bl-bingsearch", cat: "Microsoft Apps", name: "Bing Search", pkg: "Microsoft.BingSearch", on: true, desc: "Bing search integration app." },
  { id: "bl-gethelp", cat: "Microsoft Apps", name: "Get Help", pkg: "Microsoft.GetHelp", on: true, desc: "Support chat app." },
  { id: "bl-tips", cat: "Microsoft Apps", name: "Tips", pkg: "Microsoft.Getstarted", on: true, desc: "The Windows Tips app." },
  { id: "bl-feedback", cat: "Microsoft Apps", name: "Feedback Hub", pkg: "Microsoft.WindowsFeedbackHub", on: true, desc: "Send feedback to Microsoft." },
  { id: "bl-office", cat: "Microsoft Apps", name: "Microsoft 365 (Office hub)", pkg: "Microsoft.MicrosoftOfficeHub", on: true, desc: "The Office promo launcher." },
  { id: "bl-onenote", cat: "Microsoft Apps", name: "OneNote (Store app)", pkg: "Microsoft.Office.OneNote", on: true, desc: "Store version of OneNote." },
  { id: "bl-solitaire", cat: "Microsoft Apps", name: "Solitaire Collection", pkg: "Microsoft.MicrosoftSolitaireCollection", on: true, desc: "Ad-supported card games." },
  { id: "bl-mr", cat: "Microsoft Apps", name: "Mixed Reality Portal", pkg: "Microsoft.MixedReality.Portal", on: true, desc: "VR headset portal." },
  { id: "bl-3d", cat: "Microsoft Apps", name: "3D Viewer, Paint 3D, 3D Builder", pkg: ["Microsoft.Microsoft3DViewer", "Microsoft.Paint3D", "Microsoft.3DBuilder", "Microsoft.Print3D"], on: true, desc: "Old 3D apps." },
  { id: "bl-skype", cat: "Microsoft Apps", name: "Skype", pkg: "Microsoft.SkypeApp", on: true, desc: "Consumer Skype app." },
  { id: "bl-people", cat: "Microsoft Apps", name: "People", pkg: "Microsoft.People", on: true, desc: "Contacts app." },
  { id: "bl-clipchamp", cat: "Microsoft Apps", name: "Clipchamp", pkg: "Clipchamp.Clipchamp", on: true, desc: "Video editor." },
  { id: "bl-teams", cat: "Microsoft Apps", name: "Teams (personal)", pkg: ["MicrosoftTeams", "MSTeams"], on: true, desc: "Chat button / personal Teams." },
  { id: "bl-cortana", cat: "Microsoft Apps", name: "Cortana", pkg: "Microsoft.549981C3F5F10", on: true, desc: "The old assistant app." },
  { id: "bl-family", cat: "Microsoft Apps", name: "Microsoft Family", pkg: "MicrosoftCorporationII.MicrosoftFamily", on: true, desc: "Family safety app." },
  { id: "bl-mobileplans", cat: "Microsoft Apps", name: "Wallet and Mobile Plans", pkg: ["Microsoft.Wallet", "Microsoft.OneConnect"], on: true, desc: "Rarely used." },
  { id: "bl-devhome", cat: "Microsoft Apps", name: "Dev Home", pkg: "Microsoft.Windows.DevHome", on: true, desc: "Developer dashboard." },
  { id: "bl-copilot", cat: "Microsoft Apps", name: "Copilot app", pkg: ["Microsoft.Copilot", "Microsoft.Windows.Ai.Copilot.Provider"], on: true, desc: "The Copilot assistant app." },
  { id: "bl-outlook", cat: "Microsoft Apps", name: "New Outlook", pkg: "Microsoft.OutlookForWindows", desc: "Remove only if you don't use it." },
  { id: "bl-phone", cat: "Microsoft Apps", name: "Phone Link", pkg: ["Microsoft.YourPhone", "MicrosoftWindows.CrossDevice"], desc: "Connects your phone. Remove if unused." },
  { id: "bl-maps", cat: "Microsoft Apps", name: "Maps", pkg: "Microsoft.WindowsMaps", desc: "Offline maps app." },
  { id: "bl-media", cat: "Microsoft Apps", name: "Media Player and Movies & TV", pkg: ["Microsoft.ZuneMusic", "Microsoft.ZuneVideo"], desc: "Built-in media apps. Keep if you don't use VLC." },
  { id: "bl-todo", cat: "Microsoft Apps", name: "Microsoft To Do", pkg: "Microsoft.Todos", desc: "To-do list app." },
  { id: "bl-sticky", cat: "Microsoft Apps", name: "Sticky Notes", pkg: "Microsoft.MicrosoftStickyNotes", desc: "Desktop notes." },
  { id: "bl-automate", cat: "Microsoft Apps", name: "Power Automate", pkg: "Microsoft.PowerAutomateDesktop", desc: "Automation tool." },

  // ---- Promoted third-party apps ----
  { id: "bl-candy", cat: "Promoted Apps", name: "Candy Crush games", pkg: "*CandyCrush*", on: true, desc: "Pre-installed ad games." },
  { id: "bl-disney", cat: "Promoted Apps", name: "Disney+", pkg: "Disney.*", on: true, desc: "Streaming app." },
  { id: "bl-prime", cat: "Promoted Apps", name: "Prime Video", pkg: "AmazonVideo.PrimeVideo", on: true, desc: "Streaming app." },
  { id: "bl-netflix", cat: "Promoted Apps", name: "Netflix", pkg: "*Netflix*", on: true, desc: "Streaming app." },
  { id: "bl-hulu", cat: "Promoted Apps", name: "Hulu", pkg: "*HULU*", on: true, desc: "Streaming app." },
  { id: "bl-spotifystore", cat: "Promoted Apps", name: "Spotify (Store version)", pkg: "SpotifyAB.SpotifyMusic", on: true, desc: "Does not touch the Spotify you install from Apps." },
  { id: "bl-social", cat: "Promoted Apps", name: "Facebook, Instagram, TikTok, Twitter", pkg: ["*Facebook*", "*Instagram*", "*TikTok*", "*Twitter*"], on: true, desc: "Promoted social apps." },
  { id: "bl-linkedin", cat: "Promoted Apps", name: "LinkedIn", pkg: "*LinkedIn*", on: true, desc: "Promoted app." },
  { id: "bl-duolingo", cat: "Promoted Apps", name: "Duolingo", pkg: "*Duolingo*", on: true, desc: "Promoted app." },
  { id: "bl-photoshop", cat: "Promoted Apps", name: "Photoshop Express", pkg: "*AdobePhotoshopExpress*", on: true, desc: "Promoted app." },
  { id: "bl-misc", cat: "Promoted Apps", name: "Pandora and Flipboard", pkg: ["*Pandora*", "*Flipboard*"], on: true, desc: "Promoted apps." },

  // ---- Other ----
  { id: "bl-onedrive", cat: "Other", name: "OneDrive", desc: "Uninstalls OneDrive. Files already synced stay in your OneDrive folder.",
    ps: "Get-Process OneDrive -ErrorAction SilentlyContinue | Stop-Process -Force; " +
        "$c = @(\"$env:SystemRoot\\SysWOW64\\OneDriveSetup.exe\", \"$env:SystemRoot\\System32\\OneDriveSetup.exe\", \"$env:LOCALAPPDATA\\Microsoft\\OneDrive\\OneDriveSetup.exe\"); " +
        "$p = $c | Where-Object { Test-Path $_ } | Select-Object -First 1; " +
        "if ($p) { Start-Process $p '/uninstall' -Wait; Write-Output 'removed:1' } else { Write-Output 'removed:0' }" },
];
