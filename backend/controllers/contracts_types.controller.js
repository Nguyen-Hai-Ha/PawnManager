const { ContractType } = require('../models');

const ContractTypesController = {
    getAll: (req, res) => {
            const contractsTypes = ContractType.getAll();
            res.json(contractsTypes);
    },
    getById: (req, res) => {
            const contractsType = ContractType.getById(req.params.id);
            res.json(contractsType);
    },
    create: (req, res) => {
            const contractsType = ContractType.create(req.body);
            res.json(contractsType);
    }
}

module.exports = ContractTypesController;