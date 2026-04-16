const path = require('path');
const fs = require('fs');

let app;
try {
    ({ app } = require('electron'));
} catch (e) {
    app = null;
}

const isPackaged = app && app.isPackaged;

// Base directories
const userDataDir = app ? app.getPath('userData') : path.join(__dirname, '../../');
const baseDir = isPackaged 
    ? path.join(userDataDir)
    : path.join(__dirname, '../');

// Define application paths
const paths = {
    dataDir: isPackaged ? path.join(userDataDir, 'data') : path.join(baseDir, 'data'),
    imagesDir: isPackaged ? path.join(userDataDir, 'images') : path.join(baseDir, 'images'),
    templatesDir: isPackaged ? path.join(userDataDir, 'templates') : path.join(baseDir, 'templates'),
    outputDir: isPackaged ? path.join(userDataDir, 'output') : path.join(baseDir, 'output'),
    
    // Original template path in the program files (read-only default templates)
    defaultTemplatesDir: isPackaged ? path.join(__dirname, '../templates') : path.join(baseDir, 'templates')
};

// Ensure directories exist in Roaming (Production)
const ensureDirectories = () => {
    Object.entries(paths).forEach(([key, dir]) => {
        // Don't try to create directories in the read-only program folder
        if (key === 'defaultTemplatesDir') return;
        
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });

    // Special logic for templates in production:
    // If AppData/templates is empty, we should ideally NOT fail.
    // The controllers should check both paths.
};

module.exports = {
    ...paths,
    isPackaged,
    ensureDirectories
};
