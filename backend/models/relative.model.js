const db = require('../config/database');

const Relative = {
    getByIdCustomer: (id_customer) => {
        const sql = `SELECT * FROM relatives WHERE id_customer = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id_customer);
    },
    create: (data) => {
        const sql = `INSERT INTO relatives (name, phone, address, cccd, job, workplace, id_customer) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.phone, data.address, data.cccd, data.job, data.workplace, data.id_customer);
        return { id: result.lastInsertRowid };
    },
    update: (id, data) => {
        const sql = `UPDATE relatives SET name = @name, phone = @phone, address = @address, cccd = @cccd, job = @job, workplace = @workplace, id_customer = @id_customer WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM relatives WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Relative;
