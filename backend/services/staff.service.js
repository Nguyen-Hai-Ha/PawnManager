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
    updateStaff: (data) => {
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
        return { message: "Cập nhật thành công" };
    },
    deleteStaff: (id) => {
        const staffInfo = Staff.getById(id);
        if (!staffInfo) return { error: "Không tìm thấy nhân viên cần xóa." };

        const staff = Staff.delete(id);
        AuditLogs.create({
            action: 'Xóa nhân viên',
            details: `Xóa nhân viên ${staffInfo.name} bởi admin`,
            id_staff: req.userId,
        });
        return staff;
    },
}

module.exports = StaffService;