const db = require('../config/database');

const Customer = {
    getAll: () => {
        const sql = `SELECT * FROM customers`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM customers WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO customers (name, phone, address, cccd, images_cccd) VALUES (?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.phone, data.address, data.cccd, data.images_cccd);
        return { id: result.lastInsertRowid };
    },
    update: (id, data) => {
        const sql = `UPDATE customers SET name = @name, phone = @phone, address = @address, cccd = @cccd, images_cccd= @images_cccd WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM customers WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Customer;