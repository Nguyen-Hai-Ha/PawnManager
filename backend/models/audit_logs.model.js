const db = require('../config/database');

const AuditLogs = {
    getAll: () => {
        const sql = `SELECT * FROM audit_logs`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM audit_logs WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO audit_logs (action, details, id_staff) VALUES (?, ?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.action, data.details, data.id_staff);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE audit_logs SET action = @action, details = @details, id_staff = @id_staff WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM audit_logs WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = AuditLogs;