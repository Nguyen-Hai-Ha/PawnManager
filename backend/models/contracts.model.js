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
        const sql = `INSERT INTO contracts (code, loan_amount, interest_rate, start_date, end_date, payment_term, term_unit,total_periods, interest_type, status, id_customer, id_contract_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const resuilt = stmt.run(data.code, data.loan_amount, data.interest_rate, data.start_date, data.end_date, data.payment_term, data.term_unit, data.total_periods, data.interest_type, data.status, data.id_customer, data.id_contract_type);
        const result = stmt.lastInsertRowid;
        return result;
    },
    delete: (id) => {
        const sql = `DELETE FROM contracts WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
};

module.exports = Contract;