const {contextBridge, ipcRenderer} = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: async () => ipcRenderer.invoke('getConfig'),
  onPlaySound: callback =>
    ipcRenderer.on('playSound', (_event, value) => callback(value))
})
