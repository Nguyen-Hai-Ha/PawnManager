const db = require('../config/database');
const Contract = require('./contracts.model');
const ContractType = require('./contracts_types.model');
const Customer = require('./customer.model');
const Relative = require('./relative.model');
const Collateral = require('./collateral.model');
const CollateralType = require('./collateral_type.model');
const Image = require('./image.model');
const PaymentSchedule = require('./payment_schedule.model');
const Transaction = require('./transaction.model');
const TransactionType = require('./transaction_type.model');
const Role = require('./role.model');
const Staff = require('./staff.model');
const AuditLogs = require('./audit_logs.model');
const Permissions = require('./permissions.model');
const RolePermission = require('./role_permission.model');

module.exports = {
    db,
    Contract,
    ContractType,
    Customer,
    Relative,
    Collateral,
    CollateralType,
    Image,
    PaymentSchedule,
    Transaction,
    TransactionType,
    Role,
    Staff,
    AuditLogs,
    Permissions,
    RolePermission
};