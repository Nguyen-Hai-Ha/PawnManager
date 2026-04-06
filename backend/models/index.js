const db = require('../config/database');
const Contract = require('./contracts.model');
const ContractType = require('./contracts_types.model');
const Customer = require('./customer.model');
const Relative = require('./relative.model');
const Collaterals = require('./collaterals.model');
const CollateralsType = require('./collaterals_type.model');
const Image = require('./images.model');
const PaymentSchedules = require('./payment_schedules.model');
const Transactions = require('./transactions.model');
const TransactionType = require('./transaction_type.model');
const Role = require('./role.model');
const Staff = require('./staff.model');
const AuditLogs = require('./audit_logs.model');
const Permissions = require('./permissions.model');
const RolePermission = require('./role_permission.model');
const ContractHistory = require('./contract_history.model');

module.exports = {
    db,
    Contract,
    ContractType,
    Customer,
    Relative,
    Collaterals,
    CollateralsType,
    Image,
    PaymentSchedules,
    Transactions,
    TransactionType,
    Role,
    Staff,
    AuditLogs,
    Permissions,
    RolePermission,
    ContractHistory
};