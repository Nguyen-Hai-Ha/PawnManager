const db = require('../config/database');
const bcrypt = require('bcryptjs');

const Staff = {
    getAll: () => {
        const sql = `SELECT s.name, 
                            s.email, 
                            s.phone,
                            r.name as role_name 
                    FROM staff s 
                    LEFT JOIN role r ON s.id_role = r.id`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM staff WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: async (data) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        const sql = `INSERT INTO staff (name, email, password, phone, address, cccd, id_role) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.email, hashedPassword, data.phone, data.address, data.cccd, data.id_role);
        return { id: result.lastInsertRowid };
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
    },
    getByEmail: (email) => {
        const sql = `SELECT * FROM staff WHERE email = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(email);
    }
}

module.exports = Staff;