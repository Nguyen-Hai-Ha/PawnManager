const { Relative } = require('../models');

const RelativeController = {
    getByIdCustomer: (req, res) => {
        const relative = Relative.getByIdCustomer(req.params.id_customer);
        res.json(relative);
    },
    create: (req, res) => {
        const data = req.body;
        const relative = Relative.create(data);
        res.json(relative);
    },
    update: (req, res) => {
        const data = req.body;
        const relative = Relative.update(req.params.id, data);
        res.json(relative);
    },
    delete: (req, res) => {
        const relative = Relative.delete(req.params.id);
        res.json(relative);
    }
}

module.exports = RelativeController;