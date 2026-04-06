const express = require('express');
const router = express.Router();

const Contract = require('./contract.routes');
const ContractType = require('./contracts_types.routes');
const Customer = require('./customer.routes');
const Relative = require('./relative.routes');
const Collateral = require('./collaterals.routes');
const CollateralType = require('./collaterals_type.routes');
const Image = require('./image.routes');
const PaymentSchedule = require('./payment_schedule.routes');
const Transaction = require('./transactions.routes');
const TransactionType = require('./transactions_type.routes');
const Role = require('./role.routes');
const Staff = require('./staff.routes');
const Dashboard = require('./dashboard.routes');
// const AuditLogs = require('./audit-logs.routes');
// const Permissions = require('./permissions.routes');
// const RolePermission = require('./role-permission.routes');

router.use('/contract', Contract);
router.use('/contracts_type', ContractType);
router.use('/customer', Customer);
router.use('/relative', Relative);
router.use('/collateral', Collateral);
router.use('/collateral_type', CollateralType);
router.use('/image', Image);
router.use('/payment_schedule', PaymentSchedule);
router.use('/transaction', Transaction);
router.use('/transaction_type', TransactionType);
router.use('/role', Role);
router.use('/staff', Staff);
router.use('/dashboard', Dashboard);
// router.use('/audit-logs', AuditLogs);
// router.use('/permissions', Permissions);
// router.use('/role-permission', RolePermission);

module.exports = router;