const path = require('path');
const fs = require('fs');

let basePath = __dirname;
let isPackaged = false;

if (typeof global.userDataPath === 'string') {
    isPackaged = true;
    basePath = global.userDataPath;
} else if (process.env.APPDATA || process.env.HOME) {
    // try to check if we are in an asar without global.userDataPath
    if (__dirname.includes('app.asar')) {
        isPackaged = true;
        const appData = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : process.env.HOME + '/.local/share');
        basePath = path.join(appData, 'PawnManager'); 
    }
}

// Fallback for dev mode
if (!isPackaged) {
    basePath = path.join(__dirname, '..');
}

function getPath(dirName) {
    const dirPath = path.join(basePath, dirName);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    return dirPath;
}

module.exports = {
    getPath,
    isPackaged,
    basePath
};
