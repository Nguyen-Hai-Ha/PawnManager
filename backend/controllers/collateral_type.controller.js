const { CollateralType } = require('../models');

const CollateralTypeController = {
    getAll: (req, res) => {
        try {
            const collateralTypes = CollateralType.getAll();
            res.json(collateralTypes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const collateralType = CollateralType.getById(req.params.id);
            res.json(collateralType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const collateralType = CollateralType.create(req.body);
            res.json(collateralType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const collateralType = CollateralType.update(req.params.id, req.body);
            res.json(collateralType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const collateralType = CollateralType.delete(req.params.id);
            res.json(collateralType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CollateralTypeController;
