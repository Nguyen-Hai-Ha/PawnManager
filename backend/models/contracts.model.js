const db = require('../config/database');

const Contract = {
    getAll: () => {
        const sql = `SELECT * FROM contracts`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM contracts WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO contracts (code, loan_amount, interest_rate, start_date, end_date, payment_term, term_unit,total_periods, status, id_customer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const resuilt = stmt.run(data.code, data.loan_amount, data.interest_rate, data.start_date, data.end_date, data.payment_term, data.term_unit, data.total_periods, data.status, data.id_customer);
        const result = stmt.lastInsertRowid;
        return result;
    },
    update: (id, data) => {
        const sql = `UPDATE contracts SET code = @code, loan_amount = @loan_amount, interest_rate = @interest_rate, start_date = @start_date, end_date = @end_date, payment_term = @payment_term, term_unit = @term_unit,total_periods = @total_periods, status = @status, id_customer = @id_customer WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM contracts WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
};

module.exports = Contract;