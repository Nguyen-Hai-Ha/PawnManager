const { Staff, RolePermission, Role, AuditLogs } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const StaffController = {
    getAll: (req, res) => {
        try {
            const staffs = Staff.getAll();
            res.json(staffs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getById: (req, res) => {
        try {
            const staff = Staff.getById(req.params.id);
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    create: async (req, res) => {
        try {
            const data = req.body;
            const staff = await Staff.create(data);
            const log = AuditLogs.create({
                action: 'Thêm mới nhân viên',
                details: `Thêm mới nhân viên ${staff.name} bởi admin`,
                id_staff: data.id_staff,
            });
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    update: (req, res) => {
        try {
            const data = req.body;
            const password = data.password;
            if (password && password.length > 0) {
                Staff.updatePassword(req.params.id, password);
            }
            const result = Staff.update(req.params.id, data);
            AuditLogs.create({
                action: 'Cập nhật nhân viên',
                details: `Cập nhật nhân viên ${result.name} bởi admin`,
                id_staff: data.id_staff,
            });
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    delete: (req, res) => {
        try {
            const staffInfo = Staff.getById(req.params.id);
            const staff = Staff.delete(req.params.id);
            AuditLogs.create({
                action: 'Xóa nhân viên',
                details: `Xóa nhân viên ${staffInfo.name} bởi admin`,
                id_staff: req.body.id_staff,
            });
            res.json(staff);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    login: (req, res) => {
        try {
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
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = StaffController;