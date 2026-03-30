<script setup>
import { useLoanStore } from '@/stores/loan';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const store = useLoanStore();
const { paymentDetails, formDetails } = storeToRefs(store);
const { formatCurrency } = store;

const emit = defineEmits(['close']);
const activeTab = ref('Chi tiết đóng lãi');
const tabs = ['Chi tiết đóng lãi', 'Thông Tin hợp đồng', 'Lịch sử đóng lãi'];

const closeModal = () => {
    emit('close');
}
</script>

<template>
    <div class="modal-interest-container" @click.self="closeModal">
        <div class="modal-interest-content">
            <div class="modal-header">
                <h2>Đóng Lãi</h2>
                <button class="btn-close" @click="closeModal">&times;</button>
            </div>

            <div class="modal-tabs">
                <div v-for="tab in tabs" :key="tab" class="tab-item" :class="{ active: activeTab === tab }"
                    @click="activeTab = tab">
                    {{ tab }}
                </div>
            </div>

            <div class="modal-body" v-if="activeTab === 'Chi tiết đóng lãi'">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày Trả Lãi</th>
                                <th>Tiền Lãi</th>
                                <th>Tiền Gốc</th>
                                <th>Phí Khác</th>
                                <th>Cần Thanh Toán</th>
                                <th>Đã Thanh Toán</th>
                                <th>Còn Phải Trả</th>
                                <th>Các Lần Đóng</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in paymentDetails.paymentDetails">
                                <td>{{ item.period_number }}</td>
                                <td>{{ item.expected_date }}</td>
                                <td>{{ formatCurrency(item.interest_amount) }}</td>
                                <td>{{ formatCurrency(item.principal_amount) }}</td>
                                <td>0</td>
                                <td class="text-danger fw-bold">{{ formatCurrency(item.remaining_amount) }}</td>
                                <td class="text-success fw-bold">{{ formatCurrency(item.paid_amount) }}</td>
                                <td class="text-warning fw-bold">{{ formatCurrency(item.remaining_amount) }}</td>
                                <td><span class="text-blue">{{ item.display_history }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="form-container">
                    <div class="form-header">Đóng Lãi</div>
                    <form action="">
                        <div class="form-body">
                            <div class="form-group">
                                <label>Ngày Thanh Toán</label>
                                <input type="text" v-model="formDetails.payment_date" style="background-color: #E8E8E8;" readonly>
                            </div>
                            <div class="form-group">
                                <label>Người Thanh Toán</label>
                                <input type="text" v-model="formDetails.customer_name" style="background-color: #E8E8E8;" readonly>
                            </div>
                            <div class="form-group">
                                <label>Tiền Thanh Toán</label>
                                <input id="payment_amount" type="text" v-model="formDetails.payment_amount" >
                            </div>
                            <div class="form-group">
                                <label>Phí khác</label>
                                <input type="text" v-model="formDetails.other_fees">
                            </div>
                            <div class="form-group">
                                <label>Ghi chú</label>
                                <input type="text" v-model="formDetails.note">
                            </div>
                            <div class="form-actions">
                                <button class="btn-confirm">Xác nhận</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <button class="btn-primary">
                        <font-awesome-icon icon="hand-holding-dollar" /> Tất Toán
                    </button>
                    <button class="btn-primary">
                        <font-awesome-icon icon="money-bill-wave" /> Trả Bớt Gốc
                    </button>
                </div>
                <div class="footer-right">
                    <button class="btn-secondary" @click="closeModal">
                        Đóng <font-awesome-icon icon="circle-xmark" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-interest-container {
    background: #fff;
    border-radius: 12px;
    width: 95vw;
    max-width: 1500px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    max-height: 90vh;
    /* Ensure modal fits within viewport */
    animation: fadeIn 0.3s ease-in-out;
}

.modal-interest-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    /* Cho phép giãn ra tối đa theo parent thay vì fixed 100% */
    min-height: 0;
    /* TRÁNH LỖI FLEX BOX bị nở chiều cao */
}

/* Header */
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 12px 24px;
    flex-shrink: 0;
}

.modal-header h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: #111;
}

.btn-close {
    background: transparent;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #888;
    line-height: 1;
}

.btn-close:hover {
    color: #333;
}

/* Tabs */
.modal-tabs {
    display: flex;
    margin: 10px 24px 24px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;
    flex-shrink: 0;
}

.tab-item {
    padding: 14px 28px;
    font-weight: 600;
    font-size: 15px;
    color: #444;
    cursor: pointer;
    border-bottom: 3px solid transparent;
}

.tab-item.active {
    color: #1a7a6e;
    border-bottom: 3px solid #1a7a6e;
}

/* Body */
.modal-body {
    display: flex;
    gap: 24px;
    padding: 0 24px;
    flex: 1;
    min-height: 0;
    /* CRITICAL: Force flex child to shrink properly */
    overflow-y: auto;
}

/* Table Area */
.table-container {
    flex: 3;
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    height: fit-content;
}

table {
    width: 100%;
    border-collapse: collapse;
    text-align: center;
    font-size: 13px;
    color: #333;
}

table thead {
    background-color: #3a3a3a;
    color: #fff;
}

table th,
table td {
    padding: 16px 12px;
    border-bottom: 1px solid #eee;
    vertical-align: middle;
}

table th {
    font-weight: 600;
}

.text-blue {
    color: #1a7a6e;
    line-height: 1.4;
    font-weight: 500;
}

/* Form Area */
.form-container {
    flex: 1;
    min-width: 340px;
    border: 1px solid #ccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: fit-content;
}

.form-header {
    background-color: #3a3a3a;
    color: #fff;
    padding: 14px 20px;
    font-weight: 600;
    font-size: 15px;
}

.form-body {
    padding: 20px;
    background: #fff;
}

.form-group {
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 13px;
    font-weight: 600;
    color: #222;
}

.form-group input {
    padding: 10px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    color: #333;
}

.form-group input:focus {
    border-color: #1a7a6e;
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
}

.btn-confirm {
    background-color: #1a7a6e;
    color: #fff;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
}

.btn-confirm:hover {
    background-color: #2980b9;
}

/* Footer */
.modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-top: 1px solid #ddd;
    margin-top: 24px;
    background: #fcfcfc;
    flex-shrink: 0;
}

.footer-left {
    display: flex;
    gap: 16px;
}

.btn-primary {
    background-color: #1a7a6e;
    color: #fff;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
}

.btn-primary:hover {
    background-color: #2980b9;
}

.btn-secondary {
    background-color: #dfdfdf;
    color: #333;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: 0.2s;
}

.btn-secondary:hover {
    background-color: #d0d0d0;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>