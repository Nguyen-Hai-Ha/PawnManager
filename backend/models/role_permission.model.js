const db = require('../config/database');

const RolePermission = {
    getAll: () => {
        const sql = `SELECT * FROM role_permissions`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM role_permissions WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO role_permissions (id_role, id_permission) VALUES (?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_role, data.id_permission);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE role_permissions SET id_role = @id_role, id_permission = @id_permission WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM role_permissions WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = RolePermission;