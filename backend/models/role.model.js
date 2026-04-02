const db = require('../config/database');

const Role = {
    getAll: () => {
        const sql = `SELECT * FROM role`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM role WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    }
}

module.exports = Role;