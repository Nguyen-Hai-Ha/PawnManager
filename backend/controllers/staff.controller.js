const { Staff, RolePermission, Role, AuditLogs } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
const StaffService = require('../services/staff.service');

const StaffController = {
    getAll: (req, res) => {
        const staffs = Staff.getAll();
        res.json(staffs);
    },
    getById: (req, res) => {
        const staff = Staff.getById(req.params.id);
        res.json(staff);
    },
    create: async (req, res) => {
        const result = await StaffService.createStaff(req.body);
        res.json(result);
    },
    update: async (req, res) => {
        const result = await StaffService.updateStaff(req.body, req.params.id);
        res.json(result);
    },
    delete: (req, res) => {
        const result = StaffService.deleteStaff(req.params.id);
        res.json(result);
    },
    login: (req, res) => {
        const result = StaffService.loginStaff(req.body);
        res.json(result);
    }
}

module.exports = StaffController;