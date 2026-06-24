const { CollateralsType } = require('../models');

const CollateralTypeController = {
    getAll: (req, res) => {
            const collateralTypes = CollateralsType.getAll();
            res.json(collateralTypes);
    },
    getById: (req, res) => {
            const collateralType = CollateralsType.getById(req.params.id);
            res.json(collateralType);
    },
    create: (req, res) => {
            const collateralType = CollateralsType.create(req.body);
            res.json(collateralType);
    },
    update: (req, res) => {
            const collateralType = CollateralsType.update(req.params.id, req.body);
            res.json(collateralType);
    },
    delete: (req, res) => {
            const collateralType = CollateralsType.delete(req.params.id);
            res.json(collateralType);
    }
}

module.exports = CollateralTypeController;
