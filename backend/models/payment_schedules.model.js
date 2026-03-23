const db = require('../config/database');

const PaymentSchedules = {
    getAll: () => {
        const sql = `SELECT * FROM payment_schedules`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM payment_schedules WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    getByContractId: (id) => {
        const sql = `SELECT * FROM payment_schedules WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO payment_schedules (id_contract, period_number, expected_date, is_paid, interest_amount, principal_amount) VALUES (?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_contract, data.period_number, data.expected_date, data.is_paid, data.interest_amount, data.principal_amount);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE payment_schedules SET id_contract = @id_contract, period_number = @period_number, expected_date = @expected_date, is_paid = @is_paid, interest_amount = @interest_amount, principal_amount = @principal_amount WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM payment_schedules WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = PaymentSchedules;