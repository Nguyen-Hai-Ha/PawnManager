const db = require('../config/database');

const Relative = {
    getAll: () => {
        const sql = `SELECT * FROM relative`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM relative WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO relative (name, phone, address, cccd, job, workplace, id_customer) VALUES (?, ?, ?, ?, ?, ?, ?)`
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.phone, data.address, data.cccd, data.job, data.workplace, data.id_customer);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE relative SET name = @name, phone = @phone, address = @address, cccd = @cccd, job = @job, workplace = @workplace, id_customer = @id_customer WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM relative WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Relative;
