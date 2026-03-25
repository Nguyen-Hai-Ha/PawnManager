const db = require('../config/database');

const RolePermission = {
    getAll: () => {
        const sql = `SELECT * FROM role_permissions`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    create: (data) => {
        const sql = `INSERT INTO role_permissions (id_role, id_permission) VALUES (?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.id_role, data.id_permission);
        return result.lastInsertRowid;
    },
    delete: (id) => {
        const sql = `DELETE FROM role_permissions WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    getPermissionByRoleId: (id_role) => {
        const sql = `
            SELECT p.name as permission
            FROM role_permissions rp
            LEFT JOIN role r ON rp.id_role = r.id
            LEFT JOIN permissions p ON rp.id_permission = p.id
            WHERE r.id = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id_role);
    }
}

module.exports = RolePermission;