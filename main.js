const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn, execFile } = require("child_process");
const path = require("path");
const APPS = require("./apps");
const TWEAKS = require("./tweaks");

let win = null;
let current = null;
let cancelled = false;

function createWindow() {
  win = new BrowserWindow({
    width: 960,
    height: 760,
    minWidth: 360,
    minHeight: 520,
    backgroundColor: "#0e0f14",
    title: "Jay Setup",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.removeMenu();
  win.loadFile("index.html");
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());

const send = (ch, data) => win && !win.isDestroyed() && win.webContents.send(ch, data);

ipcMain.handle("get-apps", () => APPS);
ipcMain.handle("get-tweaks", () => TWEAKS);

ipcMain.handle("check-winget", () =>
  new Promise((resolve) => {
    execFile("winget", ["--version"], { windowsHide: true }, (err, out) =>
      resolve(err ? { ok: false } : { ok: true, version: String(out).trim() })
    );
  })
);

// winget exit codes treated as success
const OK_CODES = new Set([
  0,
  -1978335189, // already installed / no applicable update
  3010,        // success, reboot required
]);

function runWinget(entry) {
  return new Promise((resolve) => {
    const args = [
      "install", "--id", entry.winget, "-e",
      "--source", entry.source || "winget",
      "--silent", "--disable-interactivity",
      "--accept-package-agreements", "--accept-source-agreements",
    ];
    current = spawn("winget", args, { windowsHide: true });
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

ipcMain.handle("install", async (_e, ids) => {
  cancelled = false;
  const queue = APPS.filter((a) => ids.includes(a.id));
  let done = 0;
  let failed = 0;
  for (const entry of queue) {
    if (cancelled) {
      send("status", { id: entry.id, state: "cancelled" });
      continue;
    }
    send("status", { id: entry.id, state: "running" });
    send("log", `--- Installing ${entry.name} ---`);
    const code = await runWinget(entry);
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
});

ipcMain.handle("cancel", () => {
  cancelled = true;
  if (current) {
    // kill winget and any installer it launched
    spawn("taskkill", ["/pid", String(current.pid), "/t", "/f"], { windowsHide: true });
  }
});

// ---------- Windows tweaks ----------
const run = (cmd, args) =>
  new Promise((resolve) =>
    execFile(cmd, args, { windowsHide: true }, (err, so, se) =>
      resolve({ code: err ? (typeof err.code === "number" ? err.code : 1) : 0, out: `${so || ""}${se || ""}`.trim() })
    )
  );

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

ipcMain.handle("apply-tweaks", async (_e, ids, mode) => {
  const list = TWEAKS.filter((t) => ids.includes(t.id));
  if (mode === "on" && list.length) {
    send("log", "Creating a restore point (skipped if System Protection is off)...");
    const rp = await run("powershell", [
      "-NoProfile", "-Command",
      "Checkpoint-Computer -Description 'Jay Setup' -RestorePointType MODIFY_SETTINGS -ErrorAction Stop",
    ]);
    send("log", rp.code === 0 ? "Restore point created." : "No restore point made (System Protection off or one was made in the last 24h).");
  }
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
});

ipcMain.handle("restart-explorer", async () => {
  // Windows relaunches the shell on its own after it is killed
  await run("taskkill", ["/f", "/im", "explorer.exe"]);
});
