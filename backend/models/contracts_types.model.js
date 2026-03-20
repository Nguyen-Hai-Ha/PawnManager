const db = require('../config/database');

const ContractType = {
    getAll: () => {
        const sql = `SELECT * FROM contracts_types`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM contracts_types WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
}

module.exports = ContractType;