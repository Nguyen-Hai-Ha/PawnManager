const db = require('../config/database');

const Role = {
    getAll: () => {
        const sql = `SELECT * FROM role`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    create: (data) => {
        const sql = `INSERT INTO role (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name);
        return result.lastInsertRowid;
    },
    delete: (id) => {
        const sql = `DELETE FROM role WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Role;