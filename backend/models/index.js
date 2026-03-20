const db = require('../config/database');
const Contract = require('./contracts.model');
const ContractType = require('./contracts_types.model');
const Customer = require('./customer.model');

module.exports = {
    db,
    Contract,
    ContractType,
    Customer
};