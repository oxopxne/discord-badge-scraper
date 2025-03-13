const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    startBadgeCheck: (token, guildId) => ipcRenderer.send("start-badge-check", { token, guildId }),
    onBadgeCheckResult: (callback) => ipcRenderer.on("badge-check-result", (_event, results) => callback(results)),
    onBadgeCheckError: (callback) => ipcRenderer.on("badge-check-error", (_event, error) => callback(error))
});
