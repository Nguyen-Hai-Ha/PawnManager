const db = require('../config/database');

const Collaterals = {
    getAll: () => {
        const sql = `SELECT * FROM collaterals
        LEFT JOIN collaterals_type ON collaterals.id_collateral_type = collaterals_type.id
        LEFT JOIN images ON collaterals.id = images.id_collateral`;
        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT * FROM collaterals
        LEFT JOIN collaterals_type ON collaterals.id_collateral_type = collaterals_type.id
        LEFT JOIN images ON collaterals.id = images.id_collateral
        WHERE collaterals.id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    getByContractId: (id) => {
        const sql = `SELECT * FROM collaterals 
        LEFT JOIN collaterals_type ON collaterals.id_collateral_type = collaterals_type.id
        LEFT JOIN images ON collaterals.id = images.id_collateral
        WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO collaterals (name, metadata, status, id_contract, id_collateral_type) VALUES (?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.name, data.metadata, data.status, data.id_contract, data.id_collateral_type);
        const id = result.lastInsertRowid;
        return { id };
    },
    update: (id, data) => {
        const sql = `UPDATE collaterals SET name = @name, metadata = @metadata, status = @status, id_contract = @id_contract, id_collateral_type = @id_collateral_type WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    delete: (id) => {
        const sql = `DELETE FROM collaterals WHERE id = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    },
    deleteByContractId: (id) => {
        const sql = `DELETE FROM collaterals WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        const result = stmt.run(id);
        return result.changes;
    }
}

module.exports = Collaterals;