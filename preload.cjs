const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    // Get app version
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),
    
    // Update methods
    downloadUpdate: () => ipcRenderer.send('download-update'),
    installUpdate: () => ipcRenderer.send('install-update'),
    
    // Listen for update status changes
    onUpdateStatus: (callback) => {
        const listener = (event, data) => callback(data);
        ipcRenderer.on('update-status', listener);
        
        // Return cleanup function
        return () => {
            ipcRenderer.removeListener('update-status', listener);
        };
    }
});
