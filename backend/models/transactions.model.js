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
    create: (data) => {
        const sql = `INSERT INTO transactions (id_contract, id_transactions_type, id_schedule, id_staff, amount, other_fees) VALUES (?, ?, ?, ?, ?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_contract, data.id_transactions_type, data.id_schedule, data.id_staff, data.amount, data.other_fees);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE transactions SET id_contract = @id_contract, id_transactions_type = @id_transactions_type, id_schedule = @id_schedule, id_staff = @id_staff, amount = @amount, other_fees = @other_fees WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM transactions WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Transactions;