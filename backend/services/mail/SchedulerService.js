const cron = require('node-cron');
const { getSettingsInternal } = require('./SettingsService');
// const { sendOverDueZaloZNS, sendOverDueEmail } = require('./NotificationService');
const db = require('../../config/database');

const startScheduler = () => {
    // Chạy mỗi phút để kiểm tra giờ cấu hình
    cron.schedule('* * * * *', async () => {
        const s = await getSettingsInternal();
        
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        
        // Chỉ chạy đúng giờ cấu hình (VD: 08:00)
        if (currentTime !== s.reminderTime) return;

        // ── Thông báo quá hạn ──
        if (s.overdue) {
            const overdueSchedules = db.prepare(`
                SELECT ps.*,
                c.code as contract_code,
                cu.name as customer_name,
                cu.email as customer_email
                FROM payment_schedules ps
                LEFT JOIN contracts c ON ps.id_contract = c.id
                LEFT JOIN customers cu ON c.id_customer = cu.id
                WHERE ps.is_paid = 0 AND ps.expected_date < date('now')
            `).all();

            for (const contract of overdueContracts) {
                if (s.zaloEnabled) await sendOverDueZaloZNS(contract);
                if (s.emailEnabled) await sendOverDueEmail(contract);
                // Đánh dấu đã gửi
                // db.prepare(`UPDATE contracts SET notified_overdue_at = CURRENT_TIMESTAMP WHERE id = ?`).run(contract.id);
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
