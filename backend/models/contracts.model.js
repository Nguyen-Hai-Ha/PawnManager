const db = require('../config/database');

const Contract = {
    getAll: () => {
        const sql = `
            SELECT 
                c.id,
                c.code,
                c.loan_amount,
                c.start_date,
                c.end_date,
                c.status,
                cu.name as customer_name,
                cu.phone as customer_phone,
                ct.id as contract_type_id,
                cl.name as collateral_name,
                COALESCE((SELECT SUM(amount) FROM transactions WHERE id_contract = c.id AND id_transaction_type = 2), 0) as had_paid,
                COALESCE((SELECT SUM(principal_amount + interest_amount) FROM payment_schedules WHERE id_contract = c.id AND is_paid = 0), 0) as remaining_amount
            FROM contracts c
            LEFT JOIN customers cu ON c.id_customer = cu.id
            LEFT JOIN contracts_types ct ON c.id_contract_type = ct.id
            LEFT JOIN collaterals cl ON c.id == cl.id_contract
            GROUP BY c.id`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM contracts WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    getPaymentDetails: (id) => {
        const sql = `
            SELECT 
                ps.*,
                IFNULL(SUM(t.amount), 0) as paid_amount,
                ((ps.interest_amount + ps.principal_amount) - IFNULL(SUM(t.amount), 0)) as remaining_amount,
                GROUP_CONCAT(t.amount || ' (' || t.created_at || ')', '\n') as payment_history
            FROM payment_schedules ps
            LEFT JOIN transactions t ON ps.id = t.id_schedule
            WHERE ps.id_contract = ?
            GROUP BY ps.id
            ORDER BY ps.period_number ASC`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO contracts (code, loan_amount, interest_rate, start_date, end_date, payment_term, term_unit,total_periods, interest_type, status, id_customer, id_contract_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const resuilt = stmt.run(data.code, data.loan_amount, data.interest_rate, data.start_date, data.end_date, data.payment_term, data.term_unit, data.total_periods, data.interest_type, data.status, data.id_customer, data.id_contract_type);
        const id = resuilt.lastInsertRowid;
        return { id };
    },
    delete: (id) => {
        const sql = `DELETE FROM contracts WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    updateStatus: (data, id) => {
        const sql = `UPDATE contracts SET status = @status WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    updateLoanAmount: (data, id) => {
        const sql = `UPDATE contracts SET loan_amount = @loan_amount, interest_rate = @interest_rate WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    getDetailForPrint: (id) => {
        const sql = `
            SELECT 
                cu.name as full_name,
                cu.phone,
                cu.cccd,
                cu.address,
                cu.birth_date,
                c.loan_amount as Loan_amount,
                c.interest_rate as Interest_rate,
                c.start_date as Start_date,
                c.end_date as End_date,
                c.payment_term as Payment_term,
                c.term_unit as Term_unit,
                c.total_periods as Total_periods,
                c.interest_type as Interest_type,
                ct.name as Contract_type,
                cl.name as collateral_name,
                cl.metadata as collateral_metadata
            FROM contracts c
            LEFT JOIN collaterals cl ON c.id = cl.id_contract
            LEFT JOIN contracts_types ct ON c.id_contract_type = ct.id
            LEFT JOIN customers cu ON c.id_customer = cu.id
            WHERE c.id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
};

module.exports = Contract;