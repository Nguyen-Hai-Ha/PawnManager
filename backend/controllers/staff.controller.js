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
    update: (req, res) => {
        const data = req.body;
        const password = data.password;
        if (password && password.length > 0) {
            Staff.updatePassword(req.params.id, password);
        }
        Staff.update(req.params.id, data);
        AuditLogs.create({
            action: 'Cập nhật nhân viên',
            details: `Cập nhật nhân viên ${data.name} bởi admin`,
            id_staff: req.userId,
        });
        res.json({ message: "Cập nhật thành công" });
    },
    delete: (req, res) => {
        const staffInfo = Staff.getById(req.params.id);
        if (!staffInfo) return res.status(404).json({ error: "Không tìm thấy nhân viên cần xóa." });

        const staff = Staff.delete(req.params.id);
        AuditLogs.create({
            action: 'Xóa nhân viên',
            details: `Xóa nhân viên ${staffInfo.name} bởi admin`,
            id_staff: req.userId,
        });
        res.json(staff);
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