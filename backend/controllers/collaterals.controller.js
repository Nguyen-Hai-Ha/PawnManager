const { Collaterals, AuditLogs, Contract } = require('../models');

const CollateralsController = {
    getAll: (req, res) => {
            const collaterals = Collaterals.getAll();
            res.json(collaterals);
    },
    getById: (req, res) => {
            const collateral = Collaterals.getById(req.params.id);
            res.json(collateral);
    },
    getLiquidationById: (req, res) => {
            const collateral = Collaterals.getLiquidationById(req.params.id);
            res.json(collateral);
    },
    create: (req, res) => {
            const data = req.body;
            const collateral = Collaterals.create(data);
            res.json(collateral);
    },
    update: (req, res) => {
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
    },
    delete: (req, res) => {
            const collateral = Collaterals.delete(req.params.id);
            res.json(collateral);
    },
    countLiquidation: (req, res) => {
            const count = Collaterals.countLiquidation();
            res.json(count);
    }
}

module.exports = CollateralsController;