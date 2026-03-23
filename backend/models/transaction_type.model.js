const db = require('../config/database');

const TransactionType = {
    getAll: () => {
        const sql = `SELECT * FROM transactions_types`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    create: (data) => {
        const sql = `INSERT INTO transactions_types (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name);
        return result.lastInsertRowid;
    },
    delete: (id) => {
        const sql = `DELETE FROM transactions_types WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = TransactionType;