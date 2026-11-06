const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("setup", {
  getApps: () => ipcRenderer.invoke("get-apps"),
  checkWinget: () => ipcRenderer.invoke("check-winget"),
  getTweaks: () => ipcRenderer.invoke("get-tweaks"),
  applyTweaks: (ids, mode) => ipcRenderer.invoke("apply-tweaks", ids, mode),
  getDebloat: () => ipcRenderer.invoke("get-debloat"),
  removeBloat: (ids) => ipcRenderer.invoke("remove-bloat", ids),
  restartExplorer: () => ipcRenderer.invoke("restart-explorer"),
  install: (ids) => ipcRenderer.invoke("install", ids),
  cancel: () => ipcRenderer.invoke("cancel"),
  onStatus: (cb) => ipcRenderer.on("status", (_e, d) => cb(d)),
  onLog: (cb) => ipcRenderer.on("log", (_e, line) => cb(line)),
});
