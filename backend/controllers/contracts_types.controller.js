const { ContractType } = require('../models');

const ContractTypesController = {
    getAll: (req, res) => {
        try {
            const contractsTypes = ContractType.getAll();
            res.json(contractsTypes);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const contractsType = ContractType.getById(req.params.id);
            res.json(contractsType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: (req, res) => {
        try {
            const contractsType = ContractType.create(req.body);
            res.json(contractsType);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ContractTypesController;