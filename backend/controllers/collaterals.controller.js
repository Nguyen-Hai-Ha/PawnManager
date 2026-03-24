const { Collaterals } = require('../models');

const CollateralsController = {
    getAll: (req, res) => {
        try {
            const collaterals = Collaterals.getAll();
            res.json(collaterals);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const collateral = Collaterals.getById(req.params.id);
            res.json(collateral);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const data = req.body;
            const collateral = Collaterals.create(data);
            res.json(collateral);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const data = req.body;
            const collateral = Collaterals.update(req.params.id, data);
            res.json(collateral);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const collateral = Collaterals.delete(req.params.id);
            res.json(collateral);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CollateralsController;