const db = require('../config/database');

const Collaterals = {
    getAll: () => {
        const sql = `SELECT 
            c.id,
            c.code,
            c.name,
            c.status,
            co.id as contract_id,
            co.code as contract_code,
            co.loan_amount,
            cu.name as customer_name,
            cu.phone as customer_phone,
            MIN(i.id) as image_id,
            MIN(i.url) as image_url
            FROM collaterals c
            LEFT JOIN contracts co ON c.id_contract = co.id
            LEFT JOIN customers cu ON co.id_customer = cu.id
            LEFT JOIN images i ON c.id = i.id_collateral
            GROUP BY c.id`;

        const stmt = db.prepare(sql);
        return stmt.all();
    },
    getById: (id) => {
        const sql = `SELECT 
            c.*, 
            ct.name as type_name, 
            (SELECT JSON_GROUP_ARRAY(
                JSON_OBJECT(
                    'id', i.id,
                    'url', i.url
                )
            ) as images
            FROM images i WHERE i.id_collateral = c.id) as images,
            cu.name as customer_name
        FROM collaterals c
        LEFT JOIN collaterals_type ct ON c.id_collateral_type = ct.id
        LEFT JOIN contracts co ON c.id_contract = co.id
        LEFT JOIN customers cu ON co.id_customer = cu.id
        WHERE c.id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    getLiquidationById: (id) => {
        const sql = `SELECT 
            c.*, 
            co.id as contract_id,
            co.code as contract_code,
            co.loan_amount,
            cu.name as customer_name,
            COALESCE((SELECT SUM(amount) FROM transactions WHERE id_contract = co.id AND id_transaction_type != 1), 0) as had_paid
        FROM collaterals c
        LEFT JOIN contracts co ON c.id_contract = co.id
        LEFT JOIN customers cu ON co.id_customer = cu.id
        WHERE c.id = ?`;
        const stmt = db.prepare(sql);
        return stmt.get(id);
    },
    getByContractId: (id) => {
        const sql = `
        SELECT 
        collaterals.code as code,
        collaterals.name as name, 
        collaterals.status as status,
        collaterals.metadata as metadata,
        collaterals_type.name as type_name,
        (SELECT JSON_GROUP_ARRAY(
            JSON_OBJECT(
                'id', i.id,
                'url', i.url
            )
        ) as images
        FROM images i WHERE i.id_collateral = collaterals.id) as images
        FROM collaterals 
        LEFT JOIN collaterals_type ON collaterals.id_collateral_type = collaterals_type.id
        WHERE id_contract = ?`;
        const stmt = db.prepare(sql);
        return stmt.all(id);
    },
    create: (data) => {
        const sql = `INSERT INTO collaterals (code, name, metadata, status, id_contract, id_collateral_type) VALUES (?, ?, ?, ?, ?, ?)`;
        const stmt = db.prepare(sql);
        const result = stmt.run(data.code, data.name, data.metadata, data.status, data.id_contract, data.id_collateral_type);
        const id = result.lastInsertRowid;
        return { id };
    },
    update: (id, data) => {
        const sql = `UPDATE collaterals SET name = @name, metadata = @metadata WHERE id = @id`;
        const stmt = db.prepare(sql);
        const result = stmt.run({ ...data, id: id });
        return result.changes;
    },
    updateStatus: (data, id) => {
        const sql = `UPDATE collaterals SET status = @status WHERE id = @id`;
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