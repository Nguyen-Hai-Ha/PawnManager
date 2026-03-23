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
        const sql = `SELECT * FROM transactions WHERE id_contract = ?
        INNER JOIN transactions_types ON transactions.id_transaction_type = transactions_types.id
        INNER JOIN schedules ON transactions.id_schedule = schedules.id
        INNER JOIN contracts ON transactions.id_contract = contracts.id
        INNER JOIN staffs ON transactions.id_staff = staffs.id`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO transactions (id_contract, id_transaction_type, id_schedule, id_staff, amount, other_fees) VALUES (?, ?, ?, ?, ?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_contract, data.id_transaction_type, data.id_schedule, data.id_staff, data.amount, data.other_fees);
        return { id: result.lastInsertRowid };
    },
    // update: (id, data) => {
    //     const sql = `UPDATE transactions SET id_contract = @id_contract, id_transactions_type = @id_transactions_type, id_schedule = @id_schedule, id_staff = @id_staff, amount = @amount, other_fees = @other_fees WHERE id = @id`;
    //     const stmt = db.prepare(sql);
    //     const result = stmt.run({ ...data, id: id });
    //     return result.changes;
    // },
    delete: (id) => {
        const sql = `DELETE FROM transactions WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Transactions;