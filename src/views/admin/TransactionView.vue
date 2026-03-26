<template>
    <div class="transaction">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT">
                </div>
                <div class="time-range">
                    <div class="time-range-input">
                        <label for="">Thời gian</label>
                        <input type="date" id="start-date">
                    </div>
                </div>
                <div class="filter">
                    <label for="filter">Nhân viên</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Đang vay</option>
                        <option value="">Đã thanh toán</option>
                        <option value="">Quá hạn</option>
                    </select>
                </div>
                <div class="filter">
                    <label for="filter">Kiểu vay</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Cầm đồ</option>
                        <option value="">Trả góp</option>
                        <option value="">Tín chấp</option>
                    </select>
                </div>
                <div class="filter">
                    <label for="filter">Loại thu chi</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Chi cho vay</option>
                        <option value="">Kỳ lãi</option>
                        <option value="">Trả bớt gốc</option>
                        <option value="">Tất toán</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="table-wrapper-trannsaction">
            <div class="table-trannsaction">
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">STT</th>
                            <th rowspan="2">Thời gian</th>
                            <th rowspan="2">Nhân viên</th>
                            <th rowspan="2">Mã hợp đồng</th>
                            <th rowspan="2">Khách hàng</th>
                            <th rowspan="2">CCCD</th>
                            <th rowspan="2">Loại</th>
                            <th rowspan="2">Thu</th>
                            <th rowspan="2">Chi</th>
                            <th colspan="2" class="special">Thu lãi</th>
                            <th rowspan="2" class="special">Thao tác</th>
                        </tr>
                        <tr>
                            <th class="special">Tiền gốc</th>
                            <th class="special">Tiền lãi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>26/03/2026</td>
                            <td>Tôn Ngộ Không</td>
                            <td class="text-success fw-bold">HD0001</td>
                            <td>Nguyễn Văn A</td>
                            <td>123456789</td>
                            <td class="fw-bold">Chi cho vay</td>
                            <td class="text-success fw-bold">0</td>
                            <td class="text-danger fw-bold">-10.000.000</td>
                            <td class="text-warning fw-bold">0</td>
                            <td class="text-success fw-bold">0</td>
                            <td class="special">
                                <button class="btn-action text-primary" data-tooltip="Xem chi tiết">
                                    <font-awesome-icon icon="fa-solid fa-eye" />
                                </button>
                                <button class="btn-action text-danger" data-tooltip="Xóa">
                                    <font-awesome-icon icon="fa-solid fa-trash-can" />
                                </button>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>26/03/2026</td>
                            <td>Sugar Tank</td>
                            <td class="text-success fw-bold">HD0002</td>
                            <td>Nguyễn Văn B</td>
                            <td>987654321</td>
                            <td class="fw-bold">Kỳ lãi</td>
                            <td class="text-success fw-bold">500.000</td>
                            <td class="text-danger fw-bold">0</td>
                            <td class="text-warning fw-bold">0</td>
                            <td class="text-success fw-bold">500.000</td>
                            <td class="special">
                                <button class="btn-action text-primary" data-tooltip="Xem chi tiết">
                                    <font-awesome-icon icon="fa-solid fa-eye" />
                                </button>
                                <button class="btn-action text-danger" data-tooltip="Xóa">
                                    <font-awesome-icon icon="fa-solid fa-trash-can" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style>
@import '@/assets/main.css';
</style>