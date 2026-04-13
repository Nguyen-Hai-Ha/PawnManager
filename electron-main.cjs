const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Khởi động Express Backend
try {
    // Import backend script
    // Note: Backend sử dụng require, nên chạy trong CommonJS là ổn.
    // Nếu backend tự gọi app.listen, nó sẽ chạy ngay khi require.
    require('./backend/index.js');
} catch (error) {
    console.error('Lỗi khi khởi động backend:', error);
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs') // Chúng ta sẽ tạo file này sau nếu cần
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

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
