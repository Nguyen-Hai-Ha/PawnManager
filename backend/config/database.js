const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');

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