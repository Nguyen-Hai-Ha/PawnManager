<template>
    <div class="permission-modal">
        <div class="permission-content">
            <div class="permission-header">
                <h3>Phân Quyền Nhân Viên</h3>
                <button class="close-btn">&times;</button>
            </div>
            
            <div class="permission-main">
                <!-- Sidebar -->
                <div class="permission-sidebar">
                    <div class="category-item active">Cầm đồ</div>
                    <div class="category-item">Tín chấp</div>
                    <div class="category-item">Trả góp</div>
                    <div class="category-item">Quản lý khách hàng</div>
                    <div class="category-item">Quản lý tài sản</div>
                    <div class="category-item">Quản lý nhân viên</div>
                    <div class="category-item">Quản lý thu chi</div>
                </div>

                <!-- Main Content -->
                <div class="permission-grid-container">
                    <div class="permission-grid-header">
                        <label class="checkbox-container">
                            <input type="checkbox">
                            <span class="checkmark"></span>
                            Tất cả
                        </label>
                    </div>
                    <div class="permission-grid-body">
                        <div class="permission-row">
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Danh sách Cầm Đồ
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Thêm mới Cầm Đồ
                            </label>
                        </div>
                        <div class="permission-row">
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Sửa Cầm Đồ
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Xóa Cầm Đồ
                            </label>
                        </div>
                        <div class="permission-row">
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Đóng lãi Cầm Đồ
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Tất toán Cầm Đồ
                            </label>
                        </div>
                        <div class="permission-row">
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Thông tin chi tiết hợp đồng
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Thông tin chi tiết khách hàng
                            </label>
                        </div>
                        <div class="permission-row">
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Thay đổi kỳ lãi
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                Thay đổi lãi suất
                            </label>
                        </div>
                        <div class="permission-row">
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                In phiếu thu
                            </label>
                            <label class="checkbox-container">
                                <input type="checkbox">
                                <span class="checkmark"></span>
                                In hợp đồng
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="permission-footer">
                <button class="btn-cancel">Hủy</button>
                <button class="btn-save">Lưu Quyền</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.permission-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.permission-content {
    background: #fff;
    width: 900px;
    max-width: 95%;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.permission-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.permission-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a1a1a;
    font-weight: 700;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #333;
}

.permission-main {
    display: flex;
    height: 480px;
}

/* Sidebar */
.permission-sidebar {
    width: 220px;
    border-right: 1px solid #eee;
    padding: 16px;
    background: #fafafa;
}

.category-item {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    color: #444;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.category-item:hover {
    background: #fff;
    border-color: #3498db66;
    color: #3498db;
}

.category-item.active {
    background: #e3f2fd;
    color: #1976d2;
    border-color: #bbdefb;
    font-weight: 600;
}

/* Main Grid */
.permission-grid-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;
}

.permission-grid-header {
    background: #333;
    padding: 12px 16px;
    border-radius: 6px 6px 0 0;
    color: #fff;
    font-weight: 600;
    margin-bottom: 1px;
}

.permission-grid-body {
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 6px 6px;
}

.permission-row {
    display: flex;
    border-bottom: 1px solid #eee;
}

.permission-row:last-child {
    border-bottom: none;
}

.permission-row label {
    flex: 1;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #555;
    cursor: pointer;
    transition: background 0.15s;
}

.permission-row label:first-child {
    border-right: 1px solid #eee;
}

.permission-row label:hover {
    background: #f8f9fa;
}

/* Checkbox Styling */
.checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 28px !important; /* Overriding common label padding */
    cursor: pointer;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 4px;
    transition: all 0.2s;
}

.checkbox-container:hover input ~ .checkmark {
    border-color: #3498db;
}

.checkbox-container input:checked ~ .checkmark {
    background-color: #3498db;
    border-color: #3498db;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Footer */
.permission-footer {
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    background: #e0e0e0;
    color: #333;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-cancel:hover {
    background: #d5d5d5;
}

.btn-save {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    background: #3498db;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 10px rgba(52, 152, 219, 0.3);
}

.btn-save:hover {
    background: #2980b9;
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
}
</style>