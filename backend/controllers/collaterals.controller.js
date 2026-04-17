const { Collaterals, AuditLogs, Contract } = require('../models');

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
    getLiquidationById: (req, res) => {
        try {
            const collateral = Collaterals.getLiquidationById(req.params.id);
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
            const { id } = req.params;

            // Cập nhật thông tin tài sản
            Collaterals.update(id, data);

            // Lấy lại thông tin tài sản để lấy id_contract và name
            const collateralData = Collaterals.getById(id);

            if (collateralData) {
                const staff = Contract.getStaffByIdContract(collateralData.id_contract);
                if (staff) {
                    AuditLogs.create({
                        action: 'Thay đổi thông tin tài sản',
                        details: `Thay đổi thông tin tài sản ${collateralData.name} bởi nhân viên ${staff.staff_name}`,
                        id_staff: staff.id_staff,
                    });
                }
            }

            res.json({ message: "Cập nhật tài sản thành công" });
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
    },
    countLiquidation: (req, res) => {
        try {
            const count = Collaterals.countLiquidation();
            res.json(count);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = CollateralsController;