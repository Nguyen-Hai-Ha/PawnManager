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
        const sql = `INSERT INTO payment_schedules (id_contract, period_number, from_date, expected_date, is_paid, interest_amount, principal_amount) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_contract, data.period_number, data.from_date, data.expected_date, data.is_paid, data.interest_amount, data.principal_amount);
        return { id: result.lastInsertRowid };
    },
    update: (id, data) => {
        const sql = `UPDATE payment_schedules SET id_contract = @id_contract, period_number = @period_number, from_date = @from_date, expected_date = @expected_date, is_paid = @is_paid, interest_amount = @interest_amount, principal_amount = @principal_amount WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM payment_schedules WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    deleteByContractId: (id) => {
        const sql = `DELETE FROM payment_schedules WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    updateStatus: (data, id) => {

        const sql = `UPDATE payment_schedules SET is_paid = @is_paid WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    getTotalPrincipalByContractId: (id) => {
        const sql = `SELECT SUM(principal_amount) as total_principal FROM payment_schedules WHERE id_contract = ? and is_paid = 0`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    updateInterestAmount: (id, interest_amount) => {
        const sql = `UPDATE payment_schedules SET interest_amount = @interest_amount WHERE id = @id AND is_paid = 0`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ interest_amount: interest_amount, id: id });
        return result.changes;
    },
    updatePrincipalAmount: (id, principal_amount) => {
        const sql = `UPDATE payment_schedules SET principal_amount = @principal_amount WHERE id = @id AND is_paid = 0`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ principal_amount: principal_amount, id: id });
        return result.changes;
    },

}

module.exports = PaymentSchedules;