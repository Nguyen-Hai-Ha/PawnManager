const db = require('../config/database');

const Images = {
    getAll: () => {
        const sql = `SELECT * FROM images`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM images WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO images (url, id_collateral) VALUES (?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.url, data.id_collateral);
        return result.lastInsertRowid;
    },
    update: (id, data) => {
        const sql = `UPDATE images SET url = @url WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM images WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    deleteByCollateralId: (id) => {
        const sql = `DELETE FROM images WHERE id_collateral = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Images;