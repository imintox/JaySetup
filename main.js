const { app, BrowserWindow, ipcMain, session, dialog } = require("electron");
const { spawn, execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const APPS = require("./apps");
const TWEAKS = require("./tweaks");
const DEBLOAT = require("./debloat");

// ---------- Hardening ----------
app.enableSandbox();
if (!app.requestSingleInstanceLock()) app.quit();

let win = null;
let current = null;
let cancelled = false;
let working = false; // only one install / tweak / debloat run at a time

// This app runs as administrator, so never launch tools by bare name (a file planted next to
// the exe or in the working directory could be picked up). Use absolute System32 paths.
const SYS = path.join(process.env.SystemRoot || "C:\\Windows", "System32");
const EXE = {
  reg: path.join(SYS, "reg.exe"),
  powercfg: path.join(SYS, "powercfg.exe"),
  taskkill: path.join(SYS, "taskkill.exe"),
  where: path.join(SYS, "where.exe"),
  powershell: path.join(SYS, "WindowsPowerShell", "v1.0", "powershell.exe"),
};
const SPAWN_OPTS = { windowsHide: true, cwd: SYS };

let wingetPath;    // undefined = not looked up yet, null = not found
let wingetVersion = "";
async function resolveWinget() {
  if (wingetPath !== undefined) return wingetPath;
  // winget is a Windows "app execution alias". Node can't stat those, so test by running it.
  // Only accept locations Windows itself uses, never a random folder on PATH.
  const safeRoots = [
    path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WindowsApps"),
    path.join(process.env.ProgramFiles || "C:\\Program Files", "WindowsApps"),
    process.env.SystemRoot || "C:\\Windows",
  ].map((p) => p.toLowerCase());
  const cands = [];
  if (process.env.LOCALAPPDATA) cands.push(path.join(process.env.LOCALAPPDATA, "Microsoft", "WindowsApps", "winget.exe"));
  const w = await run("where", ["winget"]);
  if (w.code === 0) {
    for (const line of w.out.split(/\r?\n/)) {
      const p = line.trim();
      if (path.isAbsolute(p) && /winget\.exe$/i.test(p) && safeRoots.some((r) => p.toLowerCase().startsWith(r))) cands.push(p);
    }
  }
  for (const c of cands) {
    const r = await run(c, ["--version"]);
    if (r.code === 0) { wingetVersion = r.out; return (wingetPath = c); }
  }
  return (wingetPath = null);
}

function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 760,
    minWidth: 360,
    minHeight: 520,
    backgroundColor: "#0b0c11",
    title: "Jay Setup",
    icon: path.join(__dirname, "build", "icon.ico"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      webviewTag: false,
      spellcheck: false,
      navigateOnDragDrop: false,
      devTools: !app.isPackaged,
    },
  });
  win.removeMenu();
  // The window may only ever show our own page.
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (e) => e.preventDefault());
  win.webContents.on("will-attach-webview", (e) => e.preventDefault());
  // Never fail silently with a blank window.
  win.webContents.on("did-fail-load", (_e, code, desc, url, isMainFrame) => {
    if (isMainFrame && code !== -3) dialog.showErrorBox("Jay Setup could not load its window", `${desc} (${code})\n${url}`);
  });
  win.loadFile("index.html");
}

app.on("second-instance", () => {
  if (win) { if (win.isMinimized()) win.restore(); win.focus(); }
});

app.whenReady().then(() => {
  const ses = session.defaultSession;
  ses.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
  ses.setPermissionCheckHandler(() => false);
  // Network allowlist: local files plus the favicon service used for app icons. Nothing else.
  ses.webRequest.onBeforeRequest((details, cb) => {
    let ok = false;
    try {
      const u = new URL(details.url);
      ok =
        u.protocol === "file:" ||
        u.protocol === "data:" ||
        (!app.isPackaged && (u.protocol === "devtools:" || u.protocol === "chrome-extension:")) ||
        (u.protocol === "https:" &&
          ((u.hostname === "www.google.com" && u.pathname.startsWith("/s2/favicons")) ||
            u.hostname.endsWith(".gstatic.com")));
    } catch { /* blocked */ }
    cb({ cancel: !ok });
  });
  createWindow();
});
app.on("window-all-closed", () => app.quit());

const send = (ch, data) => win && !win.isDestroyed() && win.webContents.send(ch, data);

// ---------- IPC (only our own local page may call these) ----------
const trusted = (e) => {
  try {
    return !!e.senderFrame && new URL(e.senderFrame.url).protocol === "file:" && e.sender === win.webContents;
  } catch { return false; }
};
function handle(channel, fn) {
  ipcMain.handle(channel, (e, ...args) => {
    if (!trusted(e)) throw new Error("untrusted sender");
    return fn(e, ...args);
  });
}
const cleanIds = (x) => {
  if (!Array.isArray(x) || x.length > 500 || !x.every((s) => typeof s === "string" && s.length < 64)) {
    throw new Error("bad ids");
  }
  return x;
};
// Wrap long-running jobs so two can't run at once.
const exclusive = (fn) => async (...args) => {
  if (working) throw new Error("busy");
  working = true;
  try { return await fn(...args); } finally { working = false; }
};

handle("get-apps", () => APPS);
handle("get-tweaks", () => TWEAKS);
handle("get-debloat", () => DEBLOAT);

handle("check-winget", async () => {
  const w = await resolveWinget();
  return w ? { ok: true, version: wingetVersion } : { ok: false };
});

// winget exit codes treated as success
const OK_CODES = new Set([
  0,
  -1978335189, // already installed / no applicable update
  3010,        // success, reboot required
]);

function runWinget(wingetExe, entry) {
  return new Promise((resolve) => {
    // Every argument comes from the built-in catalog, never from the UI.
    const args = [
      "install", "--id", entry.winget, "-e",
      "--source", entry.source || "winget",
      "--silent", "--disable-interactivity",
      "--accept-package-agreements", "--accept-source-agreements",
    ];
    current = spawn(wingetExe, args, SPAWN_OPTS);
    const onData = (buf) => {
      String(buf)
        .split(/[\r\n]+/)
        .map((l) => l.trim())
        .filter((l) => l.length > 2 && !/[█▒]/.test(l) && !/^[-\\|/]+$/.test(l))
        .forEach((l) => send("log", l));
    };
    current.stdout.on("data", onData);
    current.stderr.on("data", onData);
    current.on("error", (e) => {
      send("log", "Could not run winget: " + e.message);
      resolve(-1);
    });
    current.on("close", (code) => {
      current = null;
      resolve(code === null ? -1 : code | 0);
    });
  });
}

handle("install", exclusive(async (_e, rawIds) => {
  const ids = cleanIds(rawIds);
  cancelled = false;
  const w = await resolveWinget();
  const queue = APPS.filter((a) => ids.includes(a.id));
  let done = 0;
  let failed = 0;
  for (const entry of queue) {
    if (cancelled) {
      send("status", { id: entry.id, state: "cancelled" });
      continue;
    }
    if (!w) {
      failed++;
      send("log", "winget was not found.");
      send("status", { id: entry.id, state: "failed" });
      continue;
    }
    send("status", { id: entry.id, state: "running" });
    send("log", `--- Installing ${entry.name} ---`);
    const code = await runWinget(w, entry);
    if (cancelled) {
      send("status", { id: entry.id, state: "cancelled" });
    } else if (OK_CODES.has(code)) {
      done++;
      send("status", { id: entry.id, state: "done", reboot: code === 3010 });
    } else {
      failed++;
      send("log", `${entry.name} failed (exit code ${code}).`);
      send("status", { id: entry.id, state: "failed" });
    }
  }
  return { done, failed, cancelled };
}));

handle("cancel", () => {
  cancelled = true;
  if (current) {
    // kill winget and any installer it launched
    spawn(EXE.taskkill, ["/pid", String(current.pid), "/t", "/f"], SPAWN_OPTS);
  }
});

// ---------- Helpers ----------
function run(cmd, args) {
  const file = EXE[cmd] || cmd; // names map to System32; anything else must already be an absolute path
  if (!path.isAbsolute(file)) throw new Error("refusing to run a non-absolute path: " + cmd);
  return new Promise((resolve) =>
    execFile(file, args, SPAWN_OPTS, (err, so, se) =>
      resolve({ code: err ? (typeof err.code === "number" ? err.code : 1) : 0, out: `${so || ""}${se || ""}`.trim() })
    )
  );
}

async function makeRestorePoint() {
  send("log", "Creating a restore point (skipped if System Protection is off)...");
  const rp = await run("powershell", [
    "-NoProfile", "-NonInteractive", "-Command",
    "Checkpoint-Computer -Description 'Jay Setup' -RestorePointType MODIFY_SETTINGS -ErrorAction Stop",
  ]);
  send("log", rp.code === 0 ? "Restore point created." : "No restore point made (System Protection off or one was made in the last 24h).");
}

// ---------- Windows tweaks ----------
function opToCall(op, mode) {
  if (op.cmd) return { cmd: op.cmd, args: mode === "on" ? op.args : op.offArgs, ignoreFail: false };
  const add = (data) => [
    "add", op.k, ...(op.v ? ["/v", op.v] : ["/ve"]), "/t", op.t, "/d", data, "/f",
  ];
  if (mode === "on") return { cmd: "reg", args: add(op.d), ignoreFail: false };
  if (op.off === "KEY") return { cmd: "reg", args: ["delete", op.k, "/f"], ignoreFail: true };
  if (op.off === undefined) return { cmd: "reg", args: ["delete", op.k, "/v", op.v, "/f"], ignoreFail: true };
  return { cmd: "reg", args: add(op.off), ignoreFail: false };
}

handle("apply-tweaks", exclusive(async (_e, rawIds, mode) => {
  const ids = cleanIds(rawIds);
  if (mode !== "on" && mode !== "off") throw new Error("bad mode");
  const list = TWEAKS.filter((t) => ids.includes(t.id));
  if (mode === "on" && list.length) await makeRestorePoint();
  let ok = 0, failed = 0, explorer = false, reboot = false;
  for (const t of list) {
    send("status", { id: t.id, state: "running" });
    let bad = false;
    for (const op of t.ops) {
      const c = opToCall(op, mode);
      const r = await run(c.cmd, c.args);
      if (r.code !== 0 && !c.ignoreFail) {
        bad = true;
        send("log", `${t.name}: ${r.out || "exit " + r.code}`);
      }
    }
    if (bad) { failed++; send("status", { id: t.id, state: "failed" }); }
    else {
      ok++;
      explorer = explorer || !!t.explorer;
      reboot = reboot || !!t.reboot;
      send("status", { id: t.id, state: "done", label: mode === "on" ? "applied" : "reverted" });
    }
  }
  return { ok, failed, explorer, reboot };
}));

// ---------- Debloat ----------
function bloatScript(item) {
  if (item.ps) return item.ps;
  const pats = [].concat(item.pkg).map((p) => `'${p}'`).join(",");
  return (
    `$n = 0; foreach ($p in @(${pats})) { ` +
    `$f = @(Get-AppxPackage -AllUsers -Name $p -ErrorAction SilentlyContinue); $n += $f.Count; ` +
    `$f | Remove-AppxPackage -AllUsers -ErrorAction SilentlyContinue; ` +
    `Get-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like $p } | ` +
    `Remove-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue | Out-Null }; Write-Output "removed:$n"`
  );
}

handle("remove-bloat", exclusive(async (_e, rawIds) => {
  const ids = cleanIds(rawIds);
  const list = DEBLOAT.filter((b) => ids.includes(b.id));
  if (list.length) await makeRestorePoint();
  let removed = 0, none = 0, failed = 0;
  for (const b of list) {
    send("status", { id: b.id, state: "running" });
    const r = await run("powershell", ["-NoProfile", "-NonInteractive", "-Command", bloatScript(b)]);
    const m = /removed:(\d+)/.exec(r.out);
    if (r.code !== 0 || !m) {
      failed++;
      send("log", `${b.name}: ${r.out || "exit " + r.code}`);
      send("status", { id: b.id, state: "failed" });
    } else if (Number(m[1]) === 0) {
      none++;
      send("status", { id: b.id, state: "done", label: "not installed" });
    } else {
      removed++;
      send("status", { id: b.id, state: "done", label: "removed" });
    }
  }
  return { removed, none, failed };
}));

handle("restart-explorer", async () => {
  // Windows relaunches the shell on its own after it is killed
  await run("taskkill", ["/f", "/im", "explorer.exe"]);
});
