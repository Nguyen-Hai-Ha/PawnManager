const db = require('../config/database');

const DashboardController = {
    getSummary: (req, res) => {
        try {
            const today = new Date().toLocaleDateString('sv-SE');
            
            // 1. Transactions Today vs Yesterday
            const todayCount = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE created_at = ?").get(today).count;
            const yesterdayDate = new Date();
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = yesterdayDate.toLocaleDateString('sv-SE');
            const yesterdayCount = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE created_at = ?").get(yesterdayStr).count;
            
            let transactionCompare = 0;
            if (yesterdayCount > 0) {
                transactionCompare = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
            } else if (todayCount > 0) {
                transactionCompare = 100;
            }

            // 2. Active Loans
            const activeLoans = db.prepare(`
                SELECT COUNT(*) as count, SUM(loan_amount) as total_amount 
                FROM contracts 
                WHERE status NOT IN ('Đã Hoàn Tất', 'Đã Tất Toán', 'Đã Thanh Lý')
            `).get();

            // 3. Collected Today (Interest Payment - Transaction Type 2)
            const collectedToday = db.prepare(`
                SELECT COUNT(*) as count, SUM(amount) as total_amount 
                FROM transactions 
                WHERE id_transaction_type = 2 AND created_at = ?
            `).get(today);

            // 4. Fund Balance (Piggy Bank)
            // Income types: 2 (Kỳ lãi), 3 (Tất toán), 4 (Trả bớt gốc), 5 (Thanh lý)
            // Expense types: 1 (Chi cho vay)
            const income = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE id_transaction_type IN (2, 3, 4, 5)").get().total || 0;
            const expense = db.prepare("SELECT SUM(amount) as total FROM transactions WHERE id_transaction_type = 1").get().total || 0;
            const fundBalance = income - expense;

            // 5. Loan Summary by Type
            const loanSummary = db.prepare(`
                SELECT 
                    ct.id,
                    ct.name,
                    COUNT(c.id) as count,
                    SUM(c.loan_amount) as total_loan,
                    (SELECT SUM(t.amount) FROM transactions t JOIN contracts c2 ON t.id_contract = c2.id WHERE c2.id_contract_type = ct.id AND t.id_transaction_type = 2) as total_interest
                FROM contracts_types ct
                LEFT JOIN contracts c ON c.id_contract_type = ct.id AND c.status NOT IN ('Đã Hoàn Tất', 'Đã Tất Toán', 'Đã Thanh Lý')
                GROUP BY ct.id
            `).all();

            // Calculate current month interest (Month 3/2026 for example)
            const currentMonth = today.substring(0, 7); // YYYY-MM
            const monthInterest = db.prepare(`
                SELECT ct.id, SUM(t.amount) as amount
                FROM transactions t
                JOIN contracts c ON t.id_contract = c.id
                JOIN contracts_types ct ON c.id_contract_type = ct.id
                WHERE t.id_transaction_type = 2 AND t.created_at LIKE ?
                GROUP BY ct.id
            `).all(currentMonth + '%');

            // 6. Projected Interest (Pie Chart 1)
            const projected = db.prepare(`
                SELECT 
                    SUM(CASE WHEN is_paid = 1 THEN interest_amount ELSE 0 END) as paid,
                    SUM(CASE WHEN is_paid = 0 THEN interest_amount ELSE 0 END) as unpaid
                FROM payment_schedules
            `).get();

            res.json({
                stats: {
                    transactions: {
                        today: todayCount,
                        compare: transactionCompare.toFixed(1)
                    },
                    loans: {
                        count: activeLoans.count || 0,
                        amount: activeLoans.total_amount || 0
                    },
                    collected: {
                        count: collectedToday.count || 0,
                        amount: collectedToday.total_amount || 0
                    },
                    fund: fundBalance
                },
                loanSummary: loanSummary.map(item => {
                    const mInterest = monthInterest.find(m => m.id === item.id);
                    return {
                        ...item,
                        month_interest: mInterest ? mInterest.amount : 0
                    };
                }),
                projected: {
                    paid: projected.paid || 0,
                    unpaid: projected.unpaid || 0,
                    percent: projected.paid ? ((projected.paid / (projected.paid + projected.unpaid)) * 100).toFixed(1) : 0
                },
                dueToday: db.prepare(`
                    SELECT 
                        c.id as id_contract,
                        c.code as contract_code,
                        cu.name as customer_name,
                        cu.phone as customer_phone,
                        ps.expected_date,
                        COALESCE(ps.interest_amount + ps.principal_amount, 0) as amount_due
                    FROM payment_schedules ps
                    JOIN contracts c ON ps.id_contract = c.id
                    JOIN customers cu ON c.id_customer = cu.id
                    WHERE ps.is_paid = 0 AND ps.expected_date = ?
                    ORDER BY ps.expected_date ASC
                `).all(today),
                dueSoon: db.prepare(`
                    SELECT 
                        c.id as id_contract,
                        c.code as contract_code,
                        cu.name as customer_name,
                        cu.phone as customer_phone,
                        ps.expected_date,
                        COALESCE(ps.interest_amount + ps.principal_amount, 0) as amount_due
                    FROM payment_schedules ps
                    JOIN contracts c ON ps.id_contract = c.id
                    JOIN customers cu ON c.id_customer = cu.id
                    WHERE ps.is_paid = 0 AND ps.expected_date > ? AND ps.expected_date <= date(?, '+3 days')
                    ORDER BY ps.expected_date ASC
                `).all(today, today)
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = DashboardController;
