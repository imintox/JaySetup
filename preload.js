const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("setup", {
  getApps: () => ipcRenderer.invoke("get-apps"),
  checkWinget: () => ipcRenderer.invoke("check-winget"),
  install: (ids) => ipcRenderer.invoke("install", ids),
  cancel: () => ipcRenderer.invoke("cancel"),
  onStatus: (cb) => ipcRenderer.on("status", (_e, d) => cb(d)),
  onLog: (cb) => ipcRenderer.on("log", (_e, line) => cb(line)),
});
