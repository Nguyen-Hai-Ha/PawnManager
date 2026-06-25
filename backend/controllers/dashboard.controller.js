const db = require('../config/database');
const DashboardService = require('../services/dashboard.service');

const DashboardController = {
    getSummary: (req, res) => {
        const result = DashboardService.getSummary();
        res.json(result);
    }
};

module.exports = DashboardController;
