const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pawn.db');
const sqlPath = path.join(__dirname, '../models/init.sql');

try {
    const db = new Database(dbPath, { verbose: console.log });
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    db.exec(sqlContent);
    db.pragma('foreign_keys = ON');
    console.log(`--- Database initialized successfully ---`);
} catch (error) {
    console.error(`--- Database initialization failed: ${error.message} ---`);
}
const db = new Database(dbPath, { verbose: console.log });
db.pragma('foreign_keys = ON');

console.log(`--- Database connected tại: ${dbPath} ---`);

module.exports = db;