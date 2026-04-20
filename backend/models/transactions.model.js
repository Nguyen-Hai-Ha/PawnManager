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
            c.id as contract_id,
            c.id_contract_type as contract_type_id,
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
    getHistoryPayment: (id) => {
        const sql = `SELECT 
        t.id,
        t.amount,
        t.other_fees,
        t.description,
        t.created_at,
        t.id_transaction_type,
        tt.name as transaction_type_name
        FROM transactions t
        LEFT JOIN transactions_types tt ON t.id_transaction_type = tt.id
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
        contract_history.old_principal,
        contract_history.new_principal,
        contract_history.old_interest_rate,
        contract_history.new_interest_rate,
        customers.name as customer_name
        FROM transactions 
        LEFT JOIN customers ON contracts.id_customer = customers.id
        LEFT JOIN contract_history ON transactions.id = contract_history.id_transaction
        WHERE transactions.id_contract = ? AND transactions.id_transaction_type = 4`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO transactions (id_contract, id_transaction_type, id_schedule, id_staff, amount, other_fees, description, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, (datetime('now', 'localtime')))`
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
    },
    getReceiptToPrint: (id) => {
        const sql = `SELECT 
        t.amount as amount,
        t.other_fees as other_fees,
        t.created_at as created_at,
        cu.name as customer_name,
        cu.phone as customer_phone,
        cu.address as customer_address,
        c.code as contract_code
        FROM transactions t
        LEFT JOIN contracts c ON t.id_contract = c.id
        LEFT JOIN customers cu ON c.id_customer = cu.id
        WHERE t.id = ?`
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
}

module.exports = Transactions;