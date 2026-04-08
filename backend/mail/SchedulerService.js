const cron = require('node-cron');
const { getSettings } = require('./SettingsService');
const { sendZaloZNS, sendEmail } = require('./NotificationService');
const db = require('../config/db');

const startScheduler = () => {
    // Chạy mỗi phút để kiểm tra giờ cấu hình
    cron.schedule('* * * * *', async () => {
        const s = await getSettings();
        
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        
        // Chỉ chạy đúng giờ cấu hình (VD: 08:00)
        if (currentTime !== s.reminderTime) return;

        // ── Thông báo quá hạn ──
        if (s.overdue) {
            const overdueContracts = db.prepare(`
                SELECT * FROM contracts 
                WHERE status = 'active' AND next_payment_date < date('now')
                AND DATE(notified_overdue_at) != DATE('now') -- tránh gửi trùng
            `).all();

            for (const contract of overdueContracts) {
                if (s.zaloEnabled) await sendZaloZNS('overdue', contract);
                if (s.emailEnabled) await sendEmail('overdue', contract);
                // Đánh dấu đã gửi
                db.prepare(`UPDATE contracts SET notified_overdue_at = CURRENT_TIMESTAMP WHERE id = ?`).run(contract.id);
            }
        }

        // ── Thông báo đến hạn hôm nay ──
        if (s.dueToday) {
            const dueContracts = db.prepare(`
                SELECT * FROM contracts 
                WHERE status = 'active' 
                AND DATE(next_payment_date) = DATE('now', '+' || ? || ' days')
            `).all(s.reminderDays);
            // gửi tương tự...
        }
    });

    console.log('Scheduler started');
}

module.exports = { startScheduler };
