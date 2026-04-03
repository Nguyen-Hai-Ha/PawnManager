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
            SELECT p.id, p.name as permission
            FROM role_permissions rp
            LEFT JOIN role r ON rp.id_role = r.id
            LEFT JOIN permissions p ON rp.id_permission = p.id
            WHERE r.id = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id_role);
    },
    updateRolePermissions: (id_role, permissionIds) => {
        const deleteSql = `DELETE FROM role_permissions WHERE id_role = ?`;
        const insertSql = `INSERT INTO role_permissions (id_role, id_permission) VALUES (?, ?)`;

        const deleteStmt = db.prepare(deleteSql);
        const insertStmt = db.prepare(insertSql);

        const transaction = db.transaction((roleId, pIds) => {
            deleteStmt.run(roleId);
            for (const pId of pIds) {
                insertStmt.run(roleId, pId);
            }
        });

        transaction(id_role, permissionIds);
        return true;
    }
}

module.exports = RolePermission;