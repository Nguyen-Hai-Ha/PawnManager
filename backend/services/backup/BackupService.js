const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/pawn.db');
const backupDir = path.join('C:', 'Users', 'Public', 'Documents', 'SystemConfig'); 
if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

// Xóa backup cũ hơn 7 ngày
const deleteOldBackups = () => {
    try {
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const files = fs.readdirSync(backupDir);

        files.forEach(file => {
            const filePath = path.join(backupDir, file);
            const stats = fs.statSync(filePath);
            
            if (stats.mtimeMs < sevenDaysAgo) {
                fs.unlinkSync(filePath);
                console.log(`Xóa backup cũ: ${file}`);
            }
        });
    } catch (error) {
        console.error('Lỗi xóa backup cũ:', error.message);
    }
};

// Hàm backup
const backupDatabase = () => {
    try {
        if (!fs.existsSync(dbPath)) {
            console.log('DB không tồn tại, bỏ qua backup');
            return;
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `pawn_${timestamp}.db`);
        
        fs.copyFileSync(dbPath, backupPath);
        console.log(`✓ Backup thành công: ${backupPath}`);
        
        // Xóa backup cũ sau khi backup xong
        deleteOldBackups();
    } catch (error) {
        console.error('Lỗi backup:', error.message);
    }
};

module.exports = { backupDatabase, backupDir };