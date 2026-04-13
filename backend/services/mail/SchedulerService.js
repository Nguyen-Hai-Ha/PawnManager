const cron = require('node-cron');
const { getSettingsInternal } = require('./SettingsService');
const { sendOverDueEmail, sendDueTodayEmail, sendNewContractToAdminEmail, sendLiquidationEmail, sendLiquidationForAdminEmail, sendReminderEarlyEmail } = require('../notificationService');
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
                WHERE ps.is_paid = 0 AND ps.expected_date = ?
                AND ps.notified_due_today_at IS NULL
            `).all(today);
            
            for (const schedule of dueSchedules) {
                // if (s.zaloEnabled) await sendDueTodayZaloZNS(schedule);
                if (s.emailEnabled) await sendDueTodayEmail(schedule);
                db.prepare(`UPDATE payment_schedules SET notified_due_today_at = CURRENT_TIMESTAMP WHERE id = ?`).run(schedule.id);
            }
        }

        // ── Thông báo Hợp đồng mới ──
        if (s.newContract) {
            const newContracts = db.prepare(`
                SELECT 
                c.code as contract_code,
                c.loan_amount,
                c.start_date,
                c.end_date,
                c.created_at,
                cu.name as customer_name,
                col.name as asset_name
                FROM contracts c
                LEFT JOIN customers cu ON c.id_customer = cu.id
                LEFT JOIN collaterals col ON c.id = col.id_contract
                WHERE DATE(c.created_at) = ?
                AND c.notified_new_at IS NULL
            `).all(today);
            
            for (const contract of newContracts) {
                if (s.emailEnabled) await sendNewContractToAdminEmail(contract);
                db.prepare(`UPDATE contracts SET notified_new_at = CURRENT_TIMESTAMP WHERE id = ?`).run(contract.id);
            }
        }

        // ── Thông báo thanh lý tài sản sau 7 ngày quá hạn ──
        if (s.liquidation) {
            const liquidation = db.prepare(`
                SELECT
                col.id,
                col.name as asset_name,
                c.code as contract_code,
                cu.name as customer_name,
                cu.email as customer_email,
                MIN(ps.expected_date) as overdue_date,
                c.loan_amount,
                COALESCE((SELECT SUM(principal_amount + interest_amount) FROM payment_schedules WHERE id_contract = c.id AND is_paid = 0), 0) as total_debt
                FROM collaterals col
                LEFT JOIN contracts c ON col.id_contract = c.id
                LEFT JOIN customers cu ON c.id_customer = cu.id
                LEFT JOIN payment_schedules ps ON c.id = ps.id_contract
                WHERE col.status = 'Đang Cầm'
                AND col.notified_liquidation_at IS NULL
                AND ps.is_paid = 0
                AND DATE(ps.expected_date, '+7 days') <= ?
                GROUP BY col.id
                `).all(today);

            for (const item of liquidation) {
                if (s.emailEnabled) await sendLiquidationEmail(item);
                if (s.emailEnabled) await sendLiquidationForAdminEmail(item);
                db.prepare(`UPDATE collaterals SET notified_liquidation_at = CURRENT_TIMESTAMP, status = 'Chờ Thanh Lý' WHERE id = ?`).run(item.id);
            }
        }

        // ── Thông báo nhắc hẹn thanh toán trước ──
        if (s.reminderEarly) {
            const targetDateObj = new Date(now);
            targetDateObj.setDate(now.getDate() + parseInt(s.reminderDays));
            const targetDateString = targetDateObj.toISOString().split('T')[0];

            const reminderEarly = db.prepare(`
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
                WHERE ps.is_paid = 0 AND ps.expected_date = ?
                AND ps.notified_reminder_early_at IS NULL
            `).all(targetDateString);
            
            for (const item of reminderEarly) {
                if (s.emailEnabled) await sendReminderEarlyEmail(item);
                db.prepare(`UPDATE payment_schedules SET notified_reminder_early_at = CURRENT_TIMESTAMP WHERE id = ?`).run(item.id);
            }
        }
    });
}

module.exports = { startScheduler };
