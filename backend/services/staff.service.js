const { Staff, RolePermission, Role, AuditLogs } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const StaffService = {
    createStaff: (data) => {
        const staff = Staff.create(data);
        AuditLogs.create({
            action: 'Thêm mới nhân viên',
            details: `Thêm mới nhân viên ${data.name} bởi admin`,
            id_staff: req.userId,
        });
        return staff;
    },
}

module.exports = StaffService;