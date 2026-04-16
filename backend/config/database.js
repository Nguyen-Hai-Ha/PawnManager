const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

let app;
try {
    ({ app } = require('electron'));
} catch (e) {
    app = null;
}

// Save database in AppData for persistent data across updates
// Dev: backend/data/pawn.db | Production: C:\Users\[User]\AppData\Local\Roaming\PawnManager\pawn.db
const dbDir = app && app.isPackaged
    ? path.join(app.getPath('userData'), 'data')
    : path.join(__dirname, '../data');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'pawn.db');
const sqlPath = path.join(__dirname, '../models/init.sql');

const isNewDb = !fs.existsSync(dbPath);
const db = new Database(dbPath, { verbose: console.log });
db.pragma('foreign_keys = ON');

if (isNewDb) {
    try {
        console.log(`--- Initializing new database ---`);
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');
        db.exec(sqlContent);
        console.log(`--- Database initialized successfully ---`);
    } catch (error) {
        console.error(`--- Database initialization failed: ${error.message} ---`);
    }
}

console.log(`--- Database connected tại: ${dbPath} ---`);

module.exports = db;