const db = require('../config/database');

const Staff = {
    getAll: () => {
        const sql = `SELECT * FROM staff`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM staff WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO staff (name, email, password, phone, address, cccd, id_role) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.email, data.password, data.phone, data.address, data.cccd, data.id_role);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE staff SET name = @name, email = @email, password = @password, phone = @phone, address = @address, cccd = @cccd, id_role = @id_role WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM staff WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Staff;