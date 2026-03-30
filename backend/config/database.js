const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../data');

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'pawn.db');
const sqlPath = path.join(__dirname, '../models/init.sql');

// Khởi tạo 1 connection duy nhất
const db = new Database(dbPath, { verbose: console.log });

// Đặt timeout trước để chờ nếu DB đang bị process khác hold lock
db.pragma('busy_timeout = 5000');

// Bật WAL mode cho phép đọc/ghi đồng thời không lock DB
// Đặt trong try-catch vì nếu bạn đang mở DB bằng app khác (như DB Browser, DBeaver), 
// SQLite sẽ không cho phép đổi journal_mode và quăng lỗi "database is locked".
try {
    db.pragma('journal_mode = WAL');
} catch (err) {
    console.warn('--- Chú ý: Không thể bật WAL mode do database đang bị ứng dụng khác khoá. ---');
}

db.pragma('foreign_keys = ON');

try {
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    db.exec(sqlContent);
    console.log(`--- Database initialized successfully ---`);
} catch (error) {
    if (error.code !== 'SQLITE_ERROR') {
        // Chỉ log nếu lỗi nghiêm trọng (ngoại trừ bảng đã có sẵn)
        console.error(`--- Database initialization warning: ${error.message} ---`);
    }
}

console.log(`--- Database connected tại: ${dbPath} ---`);

module.exports = db;