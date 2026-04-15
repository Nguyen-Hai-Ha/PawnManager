const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { autoUpdater } = require('electron-updater');

// Resolve đường dẫn backend đúng cho cả dev và production
// ASAR được disable (asar: false), nên dùng __dirname cho cả dev và production
function getBackendPath(relativePath) {
    return path.join(__dirname, relativePath);
}

// Khởi động Express Backend
let backupDatabase;
try {
    // Backend được unpack ra ngoài app.asar trong production
    const backendPath = getBackendPath('backend/index.js');
    require(backendPath);
    // Load BackupService sau khi backend đã khởi động
    ({ backupDatabase } = require(getBackendPath('backend/services/backup/BackupService')));
} catch (error) {
    console.error('Lỗi khi khởi động backend:', error);
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs')
        },
        icon: path.join(__dirname, 'public/logo.png')
    });

    // Trong môi trường development (Vite đang chạy)
    const isDev = !app.isPackaged;
    
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Trong môi trường production
        mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    }
}


// IPC Handlers
ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

ipcMain.on('download-update', () => {
    autoUpdater.downloadUpdate();
});

ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
});

// Auto-Updater Events
autoUpdater.on('checking-for-update', () => {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', { status: 'checking' });
    }
});

autoUpdater.on('update-available', (info) => {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', {
            status: 'available',
            version: info.version
        });
    }
});

autoUpdater.on('update-not-available', () => {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', { status: 'not-available' });
    }
});

autoUpdater.on('download-progress', (progressObj) => {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', {
            status: 'downloading',
            percent: Math.round(progressObj.percent)
        });
    }
});

autoUpdater.on('update-downloaded', (info) => {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', {
            status: 'downloaded',
            version: info.version
        });
    }
});

autoUpdater.on('error', (err) => {
    if (mainWindow) {
        mainWindow.webContents.send('update-status', {
            status: 'error',
            message: err.message || 'Không thể kiểm tra cập nhật'
        });
    }
});

app.whenReady().then(() => {
    createWindow();
    
    // Check for updates in production
    if (app.isPackaged) {
        autoUpdater.checkForUpdatesAndNotify();
    }

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});


app.on('window-all-closed', function () {
    if (backupDatabase) backupDatabase(); // Backup trước khi đóng ứng dụng
    if (process.platform !== 'darwin') app.quit();
});
