const db = require('../config/database');

const Permissions = {
    getAll: () => {
        const sql = `SELECT * FROM permissions`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM permissions WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO permissions (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE permissions SET name = @name WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM permissions WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Permissions;