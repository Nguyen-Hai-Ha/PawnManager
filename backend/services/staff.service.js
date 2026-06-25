const { Staff, RolePermission, Role, AuditLogs } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

const StaffService = {
    createStaff: async (data) => {
        const staff = await Staff.create(data);
        AuditLogs.create({
            action: 'Thêm mới nhân viên',
            details: `Thêm mới nhân viên ${data.name} bởi admin`,
            id_staff: 1,
        });
        return staff;
    },
    updateStaff: async (data, id) => {
        const password = data.password;
        if (password && password.length > 0) {
            await Staff.updatePassword(id, password);
        }
        Staff.update(id, data);
        AuditLogs.create({
            action: 'Cập nhật nhân viên',
            details: `Cập nhật nhân viên ${data.name} bởi admin`,
            id_staff: 1,
        });
        return { message: "Cập nhật thành công" };
    },
    deleteStaff: (id) => {
        const staffInfo = Staff.getById(id);
        if (!staffInfo) return { error: "Không tìm thấy nhân viên cần xóa." };

        const staff = Staff.delete(id);
        AuditLogs.create({
            action: 'Xóa nhân viên',
            details: `Xóa nhân viên ${staffInfo.name} bởi admin`,
            id_staff: 1,
        });
        return staff;
    },
    loginStaff: (data) => {
        const staff = Staff.getByEmail(data.email);
        if (!staff) return { error: "Nhân viên không tồn tại" };

        const isPasswordValid = bcrypt.compareSync(data.password, staff.password);
        if (!isPasswordValid) return { error: "Sai mật khẩu" };

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

        return { staff, token, permissions: permissionNames };
    }
}

module.exports = StaffService;