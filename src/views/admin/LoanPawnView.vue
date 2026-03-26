<template>
    <div class="loan-pawn">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT">
                </div>
                <div class="filter">
                    <label for="filter">Trạng thái</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Đang cầm</option>
                        <option value="">Đã hoàn thành</option>
                        <option value="">Cần thanh lý</option>
                        <option value="">Đã thanh lý</option>
                        <option value="">Quá hạn</option>
                    </select>
                </div>
                <div class="time-range">
                    <div class="time-range-input">
                        <label for="">Thời gian</label>
                        <input type="date" id="start-date">
                        <span>-</span>
                        <input type="date" id="end-date">
                    </div>
                </div>
            </div>
            <div class="button-group">
                <button>Thêm khách hàng</button>
            </div>
        </div>

        <div class="table-wrapper">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã hợp đồng</th>
                            <th>Tên khách hàng</th>
                            <th>TS thế chấp</th>
                            <th>Số tiền vay</th>
                            <th>Số tiền đã trả</th>
                            <th>Còn phải đóng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>
                                <span class="fw-bold">HD0001</span>
                                <p>26/03/2026</p>
                                <p>26/04/2026</p>
                            </td>
                            <td>Nguyễn Văn A</td>
                            <td>Vàng 24k</td>
                            <td><span class="text-danger fw-bold">20.000.000</span></td>
                            <td><span class="text-success fw-bold">500.000</span></td>
                            <td><span class="text fw-bold">20.500.000</span></td>
                            <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>
                                <span class="fw-bold">HD0002</span>
                                <p>26/03/2026</p>
                                <p>26/04/2026</p>
                            </td>
                            <td>Nguyễn Ro nan đô</td>
                            <td>Xe máy</td>
                            <td><span class="text-danger fw-bold">20.000.000</span></td>
                            <td><span class="text-success fw-bold">500.000</span></td>
                            <td><span class="text fw-bold">20.500.000</span></td>
                            <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>
                                <span class="fw-bold">HD0003</span>
                                <p>26/03/2026</p>
                                <p>26/04/2026</p>
                            </td>
                            <td>Tokuda</td>
                            <td>oto Toyota</td>
                            <td><span class="text-danger fw-bold">20.000.000</span></td>
                            <td><span class="text-success fw-bold">500.000</span></td>
                            <td><span class="text fw-bold">20.500.000</span></td>
                            <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>
                                <span class="fw-bold">HD0004</span>
                                <p>26/03/2026</p>
                                <p>26/04/2026</p>
                            </td>
                            <td>Lê La Lê</td>
                            <td>Samsung Galaxy S24 Ultra</td>
                            <td><span class="text-danger fw-bold">20.000.000</span></td>
                            <td><span class="text-success fw-bold">500.000</span></td>
                            <td><span class="text fw-bold">20.500.000</span></td>
                            <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">
                    <span class="page-info">Trang 1/5 (72)</span>
                </div>
                <div class="pagination-controls">
                    <button class="page-btn"><font-awesome-icon icon="angles-left" /></button>
                    <button class="page-btn"><font-awesome-icon icon="angle-left" /></button>
                    <button class="page-btn">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">4</button>
                    <button class="page-btn"><font-awesome-icon icon="angle-right" /></button>
                    <button class="page-btn"><font-awesome-icon icon="angles-right" /></button>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped>
@import '@/assets/main.css';
</style>