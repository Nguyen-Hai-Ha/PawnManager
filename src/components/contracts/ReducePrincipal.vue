<script setup>
import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { storeToRefs } from 'pinia';
import { Money3Component as Money3 } from 'v-money3';

const reducePrincipalStore = useReducePrincipalStore();

const { closeReducePrincipalModal } = reducePrincipalStore;

const emit = defineEmits(['close']);

const moneyConfig = {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    precision: 0,
    masked: false,
    disableNegative: true,
    min: 0,
};
</script>

<template>
    <div class="modal-interest-container" @click.self="closeReducePrincipalModal">
        <div class="modal-interest-content">
            <div class="modal-header">
                <h2>Trả Bớt Gốc</h2>
                <button class="btn-close" @click="closeReducePrincipalModal">&times;</button>
            </div>

            <div class="modal-body" >
                <div class="form-container">
                    <div class="form-header">Trả Bớt Gốc</div>
                    <form>
                        <div class="form-body">
                            <div class="form-group">
                                <label>Ngày thanh toán</label>
                                <input type="text" style="background-color: #E8E8E8;" readonly>
                            </div>
                            <div class="form-group">
                                <label>Người thanh toán</label>
                                <input type="text" style="background-color: #E8E8E8;" readonly>
                            </div>
                            <div class="form-group">
                                <label>Tiền trả bớt gốc</label>
                                <money3 id="payment_amount"  v-bind="moneyConfig"></money3>
                            </div>
                            <div class="form-group">
                                <div class="row-group">
                                    <div class="col-group">
                                        <label>Lãi suất cũ</label>
                                        <input type="text" style="background-color: #E8E8E8;" readonly>
                                    </div>
                                    <div class="col-group">
                                        <label>Kiểu lãi xuất</label>
                                        <input type="text" style="background-color: #E8E8E8;" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Lãi suất mới</label>
                                <money3  v-bind="moneyConfig"></money3>
                            </div>
                            <div class="form-group">
                                <label>Phí khác</label>
                                <money3  v-bind="moneyConfig"></money3>
                            </div>
                            <div class="form-group">
                                <label>Ghi chú</label>
                                <input type="text" >
                            </div>
                            <div class="form-actions">
                                <button class="btn-confirm">Xác nhận</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <div class="info-container">
                            <div class="info">
                                <div class="info-item">
                                    <span class="fw-bold">Mã hợp đồng</span>
                                    <span class="text-success fw-bold"></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Tên khách hàng</span>
                                    <span></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Số điện thoại</span>
                                    <span></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">CCCD</span>
                                    <span></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Địa chỉ</span>
                                    <span></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Ngày sinh</span>
                                    <span></span>
                                </div>
                            </div>
                            <div class="info">
                                <div class="info-item">
                                    <span class="fw-bold">Số tiền vay:</span>
                                    <span class="text-danger fw-bold"></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Kiểu hợp đồng:</span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Kỳ đóng lãi:</span>
                                    <span></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Ngày bắt đầu:</span>
                                    <span></span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Ngày kết thúc:</span>
                                    <span></span>
                                </div>
                            </div>
                    </div>
                    <div class="table">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên khách hàng</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Tiền trả bớt gốc</th>
                                    <th>Phí khác</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Nguyễn Văn A</td>
                                    <td>2022-01-01</td>
                                    <td>1000000</td>
                                    <td>100000</td>
                                    <td>Ghi chú 1</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <button class="btn-primary">
                        <font-awesome-icon icon="hand-holding-dollar" /> Tất Toán
                    </button>
                    <button class="btn-primary">
                        <font-awesome-icon icon="coins" /> Đóng Lãi
                    </button>
                </div>
                <div class="footer-right">
                    <button class="btn-secondary" @click="closeReducePrincipalModal">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/interest.css';

.row-group{
    display: flex;
    gap: 10px;
}

.col-group{
    flex: 1;
}
.col-group input{
    width: 100%;
}

.info{
    display: flex;
    flex-direction: column;
    padding: 10px;
}

.info-container{
    display: flex;
    gap: 24px;
    padding: 0 10px;
    flex: 1;
    max-height: 230px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.container{
    display: flex;
    flex-direction: column;
    gap: 24px;
}
.table{
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}
</style>