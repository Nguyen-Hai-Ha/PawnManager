const db = require('../config/database');

const Customer = {
    getAll: () => {
        const sql = `
            SELECT c.*,
            (
                SELECT JSON_GROUP_ARRAY(
                    JSON_OBJECT(
                        'id', id,
                        'name', name,
                        'address', address,
                        'cccd', cccd,
                        'phone', phone,
                        'job', job,
                        'workplace', workplace
                    )
                )
                FROM relatives 
                WHERE id_customer = c.id
            ) as relatives
            FROM customers c`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM customers WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO customers (name, phone, email, address, cccd, birth_date, images_cccd) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.phone, data.email, data.address, data.cccd, data.birth_date, data.images_cccd);
        return { id: result.lastInsertRowid };
    },
    update: (id, data) => {
        const sql = `UPDATE customers SET name = @name, phone = @phone, email = @email, address = @address, cccd = @cccd, birth_date = @birth_date, images_cccd= @images_cccd WHERE id = @id`;
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