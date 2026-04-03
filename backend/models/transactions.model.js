const db = require('../config/database');

const Transactions = {
    getAll: () => {
        const sql = `
        SELECT 
            t.id,
            t.amount,
            t.other_fees,
            t.created_at,
            t.id_transaction_type,
            tt.name as transaction_type_name,
            c.code as contract_code,
            cu.name as customer_name,
            cu.cccd as customer_cccd,
            s.name as staff_name,
            ps.principal_amount as principal_amount,
            ps.interest_amount as interest_amount
        FROM transactions t
        LEFT JOIN payment_schedules ps ON t.id_schedule = ps.id
        LEFT JOIN transactions_types tt ON t.id_transaction_type = tt.id
        LEFT JOIN contracts c ON t.id_contract = c.id
        LEFT JOIN customers cu ON c.id_customer = cu.id
        LEFT JOIN staff s ON t.id_staff = s.id`;
        const stmt = db.prepare(sql);
        return stmt.all()
    },
    getById: (id) => {
        const sql = `SELECT * FROM transactions WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    getByContractId: (id) => {
        const sql = `SELECT * FROM transactions 
        INNER JOIN transactions_types ON transactions.id_transaction_type = transactions_types.id
        INNER JOIN contracts ON transactions.id_contract = contracts.id
        INNER JOIN staff ON transactions.id_staff = staff.id
        WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    getByScheduleId: (id) => {
        const sql = `SELECT * FROM transactions 
        INNER JOIN transactions_types ON transactions.id_transaction_type = transactions_types.id
        INNER JOIN payment_schedules ON transactions.id_schedule = payment_schedules.id
        INNER JOIN contracts ON transactions.id_contract = contracts.id
        INNER JOIN staff ON transactions.id_staff = staff.id
        WHERE id_schedule = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    getHistoryPayment: (id) => {
        const sql = `SELECT * FROM transactions 
        INNER JOIN transactions_types ON transactions.id_transaction_type = transactions_types.id
        WHERE id_contract = ? AND id_transaction_type = 2`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    getHistoryReducePrincipal: (id) => {
        const sql = `SELECT 
        transactions.id,
        transactions.amount,
        transactions.other_fees,
        transactions.description,
        transactions.created_at,
        transactions_types.name as transaction_type_name,
        contracts.code as contract_code,
        customers.name as customer_name,
        customers.phone as customer_phone
        FROM transactions 
        INNER JOIN transactions_types ON transactions.id_transaction_type = transactions_types.id
        INNER JOIN contracts ON transactions.id_contract = contracts.id
        INNER JOIN customers ON contracts.id_customer = customers.id
        WHERE id_contract = ? AND id_transaction_type = 4`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO transactions (id_contract, id_transaction_type, id_schedule, id_staff, amount, other_fees, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, date('now'))`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_contract, data.id_transaction_type, data.id_schedule, data.id_staff, data.amount, data.other_fees, data.description);
        return { id: result.lastInsertRowid };
    },
    delete: (id) => {
        const sql = `DELETE FROM transactions WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    deleteByContractId: (id) => {
        const sql = `DELETE FROM transactions WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Transactions;