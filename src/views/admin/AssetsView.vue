<template>
    <div class="assets">
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
                        <option value="">Đã thanh lý</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="table-wrapper">
                <div class="table">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã TS</th>
                                <th>Tên tài sản</th>
                                <th>Hợp đồng</th>
                                <th>Tên khách hàng</th>
                                <th>Số tiền vay</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>
                                    <span class="fw-bold">TS00001</span>
                                </td>
                                <td>Wave 110</td>
                                <td><span class="text-success fw-bold">HD0001</span></td>
                                <td>
                                    <span>Nguyễn Văn A</span>
                                    <p>0123456789</p>
                                </td>
                                <td><span class="text-danger fw-bold">10.500.000</span></td>
                                <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                                </td>
                                <td>
                                    <div class="action-cell">
                                        <button class="btn-action text-success" data-tooltip="Thanh lý">
                                            <font-awesome-icon icon="fa-solid fa-gavel" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>
                                    <span class="fw-bold">TS00001</span>
                                </td>
                                <td>SH 350i</td>
                                <td><span class="text-success fw-bold">HS0001</span></td>
                                <td>
                                    <span>Nguyễn Văn B</span>
                                    <p>0123456789</p>
                                </td>
                                <td><span class="text-danger fw-bold">40.000.000</span></td>
                                <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                                </td>
                                <td>
                                    <div class="action-cell">
                                        <button class="btn-action text-primary" data-tooltip="Xem chi tiết">
                                            <font-awesome-icon icon="fa-solid fa-eye" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>
                                    <span class="fw-bold">TS00001</span>
                                </td>
                                <td>VF3</td>
                                <td><span class="text-success fw-bold">HD0001</span></td>
                                <td>
                                    <span>Nguyễn Văn C</span>
                                    <p>0123456789</p>
                                </td>
                                <td><span class="text-danger fw-bold">50.000.000</span></td>
                                <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                                </td>
                                <td>
                                    <div class="action-cell">
                                        <button class="btn-action text-success" data-tooltip="Thanh lý">
                                            <font-awesome-icon icon="fa-solid fa-gavel" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>
                                    <span class="fw-bold">TS00001</span>
                                </td>
                                <td>iPhone 16</td>
                                <td><span class="text-success fw-bold">HD0001</span></td>
                                <td>
                                    <span>Nguyễn Văn D</span>
                                    <p>0123456789</p>
                                </td>
                                <td><span class="text-danger fw-bold">8.000.000</span></td>
                                <td><span class="badge rounded-pill bg-warning text-warning-emphasis">Đang cầm</span>
                                </td>
                                <td>
                                    <div class="action-cell">
                                        <button class="btn-action text-success" data-tooltip="Thanh lý">
                                            <font-awesome-icon icon="fa-solid fa-gavel" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="pagination">
                    <div class="pagination-info">
                        <span class="page-info">Trang 1/1 (4)</span>
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