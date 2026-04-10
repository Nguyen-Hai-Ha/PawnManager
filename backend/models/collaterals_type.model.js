const db = require('../config/database');

const CollateralsType = {
    getAll: () => {
        const sql = `
        SELECT collaterals_type.*, COUNT(collaterals.id) as count
        FROM collaterals_type
        LEFT JOIN collaterals ON collaterals_type.id = collaterals.id_collateral_type
        GROUP BY collaterals_type.id`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM collaterals_type WHERE id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    create: (data) => {
        const sql = `INSERT INTO collaterals_type (name) VALUES (?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name);
        return { id: result.lastInsertRowid };
    },
    update: (id, data) => {
        const sql = `UPDATE collaterals_type SET name = @name WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM collaterals_type WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = CollateralsType;