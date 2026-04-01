const db = require('../config/database');

const Transactions = {
    getAll: () => {
        const sql = `SELECT * FROM transactions`;
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
        WHERE id_contract = ? AND id_transaction_type != 1`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    getHistoryReducePrincipal: (id) => {
        const sql = `SELECT * FROM transactions 
        INNER JOIN transactions_types ON transactions.id_transaction_type = transactions_types.id
        WHERE id_contract = ? AND id_transaction_type = 4`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO transactions (id_contract, id_transaction_type, id_schedule, id_staff, amount, other_fees, description) VALUES (?, ?, ?, ?, ?, ?, ?)`
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