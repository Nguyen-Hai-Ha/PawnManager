export const PERMISSION = {
    'Cầm đồ': [
        { id: 1, name: 'Thêm hợp đồng', key: 'loans.create'},
        { id: 2, name: 'Danh sách hợp đồng', key: 'loans.read'},
        { id: 3, name: 'Xem chi tiết hợp đồng', key: 'loans.detail'},
        { id: 4, name: 'In hợp đồng', key: 'loans.print'},
        { id: 5, name: 'Đóng lãi', key: 'loans.interest_payment'},
        { id: 6, name: 'Trả bớt gốc', key: 'loans.reduce_principal'},
        { id: 7, name: 'Tất toán', key: 'loans.final_settlement'},
    ],
    'Tín chấp': [
        { id: 8, name: 'Thêm hợp đồng', key: 'pledge.create'},
        { id: 9, name: 'Danh sách hợp đồng', key: 'pledge.read'},
        { id: 10, name: 'Xem chi tiết hợp đồng', key: 'pledge.detail'},
        { id: 11, name: 'In hợp đồng', key: 'pledge.print'},
        { id: 12, name: 'Đóng lãi', key: 'pledge.interest_payment'},
        { id: 13, name: 'Trả bớt gốc', key: 'pledge.reduce_principal'},
        { id: 14, name: 'Tất toán', key: 'pledge.final_settlement'},
    ],
    'Trả góp': [
        { id: 15, name: 'Thêm hợp đồng', key: 'repayment.create'},
        { id: 16, name: 'Danh sách hợp đồng', key: 'repayment.read'},
        { id: 17, name: 'Xem chi tiết hợp đồng', key: 'repayment.detail'},
        { id: 18, name: 'In hợp đồng', key: 'repayment.print'},
        { id: 19, name: 'Đóng lãi', key: 'repayment.interest_payment'},
        { id: 20, name: 'Trả bớt gốc', key: 'repayment.reduce_principal'},
        { id: 21, name: 'Tất toán', key: 'repayment.final_settlement'},
    ],
    'Quản lý tài sản': [
        { id: 28, name: 'Danh sách tài sản', key: 'collateral.read'},
        { id: 29, name: 'Xem chi tiết tài sản', key: 'collateral.detail'},
        { id: 30, name: 'Thanh lý tài sản', key: 'collateral.liquidation'},
        { id: 31, name: 'Cập nhật tài sản', key: 'collateral.update'},
    ],
    'Quản lý nhân viên': [
        { id: 45, name: 'Danh sách nhân viên', key: 'staff.read'},
        { id: 46, name: 'Xem chi tiết nhân viên', key: 'staff.detail'},
        { id: 44, name: 'Thêm nhân viên', key: 'staff.create'},
        { id: 47, name: 'Cập nhật nhân viên', key: 'staff.update'},
    ],
    'Quản lý khách hàng': [
        { id: 23, name: 'Danh sách khách hàng', key: 'customer.read'},
        { id: 24, name: 'Xem chi tiết khách hàng', key: 'customer.detail'},
        { id: 22, name: 'Thêm khách hàng', key: 'customer.create'},
        { id: 25, name: 'Cập nhật khách hàng', key: 'customer.update'},
    ],
    'Quản lý thu chi': [
        { id: 39, name: 'Danh sách thu chi', key: 'transaction.read'},
        { id: 41, name: 'Xem chi tiết thu chi', key: 'transaction.detail'},
    ]
}