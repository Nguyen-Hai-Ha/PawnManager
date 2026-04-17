const db = require('../config/database');

const ContractHistory = {
    create: (data) => {
        const sql = `INSERT INTO contract_history (old_principal, new_principal, old_interest_rate, new_interest_rate, type, id_contract, id_staff, id_transaction) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.old_principal, data.new_principal, data.old_interest_rate, data.new_interest_rate, data.type, data.id_contract, data.id_staff, data.id_transaction);
        return { id: result.lastInsertRowid };
    },
    getByContractId: (id) => {
        const sql = `SELECT * FROM contract_history WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    deleteByContractId: (id) => {
        const sql = `DELETE FROM contract_history WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        return stmt.run(id);
    }
}

module.exports = ContractHistory;