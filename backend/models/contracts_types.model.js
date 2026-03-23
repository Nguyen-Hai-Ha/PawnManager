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
    },
    create: (data) => {
        const sql = `INSERT INTO contracts_types (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name);
        return result.lastInsertRowid;
    },
}

module.exports = ContractType;