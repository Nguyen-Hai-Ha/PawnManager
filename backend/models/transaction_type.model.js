const db = require('../config/database');

const TransactionType = {
    getAll: () => {
        const sql = `SELECT * FROM transaction_type`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM transaction_type WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO transaction_type (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE transaction_type SET name = @name WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM transaction_type WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = TransactionType;