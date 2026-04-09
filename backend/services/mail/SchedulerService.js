const cron = require('node-cron');
const { getSettingsInternal } = require('./SettingsService');
const { sendOverDueEmail, sendDueTodayEmail } = require('../notificationService');
const { sendOverDueEmail, sendDueTodayEmail, sendNewContractToAdminEmail, sendLiquidationEmail, sendLiquidationForAdminEmail } = require('../notificationService');
const db = require('../../config/database');

const startScheduler = () => {
    // Chạy mỗi phút để kiểm tra giờ cấu hình
    cron.schedule('* * * * *', async () => {
        const s = await getSettingsInternal();
        
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        
        if (currentTime !== s.reminderTime) return;

        const today = now.toISOString().split('T')[0];

        // ── Thông báo quá hạn ──
        if (s.overdue) {
            const overdueSchedules = db.prepare(`
                SELECT 
                ps.id,
                ps.expected_date,
                COALESCE((ps.interest_amount + ps.principal_amount), 0) as interest_amount,
                c.code as contract_code,
                cu.name as customer_name,
                cu.email as customer_email,
                col.name as asset_name
                FROM payment_schedules ps
                LEFT JOIN contracts c ON ps.id_contract = c.id
                LEFT JOIN customers cu ON c.id_customer = cu.id
                LEFT JOIN collaterals col ON c.id = col.id_contract
                WHERE ps.is_paid = 0 AND ps.expected_date < ?
                AND ps.notified_overdue_at IS NULL
            `).all(today);

            for (const schedule of overdueSchedules) {
                // if (s.zaloEnabled) await sendOverDueZaloZNS(schedule);
                if (s.emailEnabled) await sendOverDueEmail(schedule);
                // Đánh dấu đã gửi
                db.prepare(`UPDATE payment_schedules SET notified_overdue_at = CURRENT_TIMESTAMP WHERE id = ?`).run(schedule.id);
            }
        }

        // ── Thông báo đến hạn hôm nay ──
        if (s.dueToday) {
            const dueSchedules = db.prepare(`
                SELECT ps.*,
                SELECT 
                c.code as contract_code,
                cu.name as customer_name,
                cu.email as customer_email
                cu.email as customer_email,
                FROM payment_schedules ps
                LEFT JOIN contracts c ON ps.id_contract = c.id
                LEFT JOIN customers cu ON c.id_customer = cu.id
                LEFT JOIN collaterals col ON c.id = col.id_contract
                WHERE ps.is_paid = 0 AND ps.expected_date = ?
                AND ps.notified_due_today_at IS NULL
            `).all(today);
            
            for (const schedule of dueSchedules) {
                // if (s.zaloEnabled) await sendDueTodayZaloZNS(schedule);
                if (s.emailEnabled) await sendDueTodayEmail(schedule);
                db.prepare(`UPDATE payment_schedules SET notified_due_today_at = CURRENT_TIMESTAMP WHERE id = ?`).run(schedule.id);
            }
        }
    });

    console.log('Scheduler started');
}

module.exports = { startScheduler };
