const { Customer, Relative, Contract, Staff, AuditLogs } = require('../models');

const CustomerService = {
    createCustomer: (data, file, id) => {
        if (file) {
            if (file['images_cccd']) {
                data.images_cccd = file['images_cccd'][0].filename;
            }
            if (file['images_cccd_back']) {
                data.images_cccd_back = file['images_cccd_back'][0].filename;
            }
        }

        const customer = Customer.create(data);
        const staff = Staff.getById(id || data.id_staff);
        if (staff && data.name) {
            AuditLogs.create({
                action: 'Thêm mới khách hàng',
                details: `Thêm mới khách hàng ${data.name} bởi nhân viên ${staff.name}`,
                id_staff: staff.id,
            });
        }
        if (data.relatives && typeof data.relatives === 'string' && data.relatives.length > 0) {
            try {
                const relativesArray = JSON.parse(data.relatives);
                if (Array.isArray(relativesArray)) {
                    relativesArray.forEach(item => {
                        if (item) Relative.create({ ...item, id_customer: customer.id });
                    });
                }
            } catch (e) {
                console.error('Error parsing relatives:', e);
            }
        }

        return customer;
    },
}