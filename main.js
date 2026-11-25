const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const { pathToFileURL } = require('url');
const path = require('path');

let mainWindow = null;

ipcMain.handle('select-rom', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: '选择 ROM 文件',
    properties: ['openFile'],
    filters: [
      { name: 'ROM 文件', extensions: ['bin', 'gen', 'md', 'rom', 'zip', '7z', 'rar'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  });
  if (result.canceled || !result.filePaths.length) return null;
  return pathToFileURL(result.filePaths[0]).href;
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    title: '梦幻模拟战2 帝国之路·暗灭',
    backgroundColor: '#0b1020',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  Menu.setApplicationMenu(null);

  const romArg = process.argv.find(function (arg) { return arg.indexOf('--rom=') === 0; });
  if (romArg) {
    mainWindow.loadFile(path.join(__dirname, 'index.html'), {
      query: { rom: romArg.slice(6) }
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
