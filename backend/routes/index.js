const express = require('express');
const router = express.Router();

const Contract = require('./contract.routes');
// const ContractType = require('./contract-type.routes');
// const Customer = require('./customer.routes');
// const Relative = require('./relative.routes');
// const Collateral = require('./collateral.routes');
// const CollateralType = require('./collateral-type.routes');
// const Image = require('./image.routes');
// const PaymentSchedule = require('./payment-schedule.routes');
// const Transaction = require('./transaction.routes');
// const TransactionType = require('./transaction-type.routes');
// const Role = require('./role.routes');
// const Staff = require('./staff.routes');
// const AuditLogs = require('./audit-logs.routes');
// const Permissions = require('./permissions.routes');
// const RolePermission = require('./role-permission.routes');

router.use('/contract', Contract);
// router.use('/contract-type', ContractType);
// router.use('/customer', Customer);
// router.use('/relative', Relative);
// router.use('/collateral', Collateral);
// router.use('/collateral-type', CollateralType);
// router.use('/image', Image);
// router.use('/payment-schedule', PaymentSchedule);
// router.use('/transaction', Transaction);
// router.use('/transaction-type', TransactionType);
// router.use('/role', Role);
// router.use('/staff', Staff);
// router.use('/audit-logs', AuditLogs);
// router.use('/permissions', Permissions);
// router.use('/role-permission', RolePermission);

module.exports = router;