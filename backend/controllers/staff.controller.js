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
    delete: async (req, res) => {
        const result = await StaffService.deleteStaff(req.params.id);
        res.json(result);
    },
    login: (req, res) => {
        const data = req.body;
        const staff = Staff.getByEmail(data.email);
        if (!staff) return res.status(404).json({ error: "Nhân viên không tồn tại" });

        const isPasswordValid = bcrypt.compareSync(data.password, staff.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Sai mật khẩu" });

        const permissions = RolePermission.getPermissionByRoleId(staff.id_role);
        const permissionNames = permissions.map(p => p.permission);

        // Fetch role name
        const role = Role.getById(staff.id_role);
        staff.role = role ? role.name : 'staff';

        const token = jwt.sign(
            { id: staff.id, role: staff.role, permissions: permissionNames },
            config.secret,
            { expiresIn: '1d' }
        );

        const log = AuditLogs.create({
            action: 'Đăng nhập',
            details: `Nhân viên ${staff.name} đăng nhập`,
            id_staff: staff.id,
        });

        res.json({ staff, token, permissions: permissionNames });
    }
}

module.exports = StaffController;