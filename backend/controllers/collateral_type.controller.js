const { CollateralsType } = require('../models');

const CollateralTypeController = {
    getAll: (req, res) => {
        try {
            const collateralTypes = CollateralsType.getAll();
            res.json(collateralTypes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    // getById: (req, res) => {
    //     try {
    //         const collateralType = CollateralsType.getById(req.params.id);
    //         res.json(collateralType);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    // create: (req, res) => {
    //     try {
    //         const collateralType = CollateralsType.create(req.body);
    //         res.json(collateralType);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    // update: (req, res) => {
    //     try {
    //         const collateralType = CollateralsType.update(req.params.id, req.body);
    //         res.json(collateralType);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // },
    // delete: (req, res) => {
    //     try {
    //         const collateralType = CollateralsType.delete(req.params.id);
    //         res.json(collateralType);
    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // }
}

module.exports = CollateralTypeController;
