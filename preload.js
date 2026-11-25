const { contextBridge, ipcRenderer, webUtils } = require('electron');
const { pathToFileURL } = require('url');

contextBridge.exposeInMainWorld('romPicker', {
  select: () => ipcRenderer.invoke('select-rom'),
  pathForFile: (file) => webUtils.getPathForFile(file),
  toFileUrl: (filePath) => pathToFileURL(filePath).href
});
