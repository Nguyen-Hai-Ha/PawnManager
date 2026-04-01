<script setup>
import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { useInterestPayment } from '@/stores/contract/interestPayment';
import { storeToRefs } from 'pinia';
import { Money3Component as Money3 } from 'v-money3';
import { onMounted } from 'vue';

const reducePrincipalStore = useReducePrincipalStore();
const interestPaymentStore = useInterestPayment();

const { paymentDetails, StartDate, formReducePrincipal, historyReducePrincipal } = storeToRefs(reducePrincipalStore);
const { closeReducePrincipalModal, formatCurrency, submitReducePrincipal } = reducePrincipalStore;

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
                    <form @submit.prevent="submitReducePrincipal">
                        <div class="form-body">
                            <div class="form-group">
                                <label>Ngày thanh toán</label>
                                <input type="text" style="background-color: #E8E8E8;" :value="StartDate" readonly>
                            </div>
                            <div class="form-group">
                                <label>Người thanh toán</label>
                                <input type="text" style="background-color: #E8E8E8;" :value="paymentDetails.customer.name" readonly>
                            </div>
                            <div class="form-group">
                                <label>Tiền tất toán</label>
                                <money3 id="payment_amount" v-model="formReducePrincipal.amount" v-bind="moneyConfig"></money3>
                            </div>
                            <div class="form-group">
                                <label>Phí khác</label>
                                <money3  v-bind="moneyConfig" v-model="formReducePrincipal.other_fees"></money3>
                            </div>
                            <div class="form-group">
                                <label>Ghi chú</label>
                                <input type="text" v-model="formReducePrincipal.note">
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
                                <span class="text-success fw-bold">{{ paymentDetails.contract.code }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Tên khách hàng</span>
                                <span>{{ paymentDetails.customer.name }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Số điện thoại</span>
                                <span>{{ paymentDetails.customer.phone }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">CCCD</span>
                                <span>{{ paymentDetails.customer.cccd }}</span>
                            </div>
                        </div>
                        <div class="info">
                            <div class="info-item">
                                <span class="fw-bold">Số tiền vay:</span>
                                <span class="text-danger fw-bold">{{ formatCurrency(paymentDetails.contract.loan_amount) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Kiểu hợp đồng:</span>
                                <span v-if="paymentDetails.contract.id_contract_type === 1">Cầm đồ</span>
                                <span v-if="paymentDetails.contract.id_contract_type === 2">Tín chấp</span>
                                <span v-if="paymentDetails.contract.id_contract_type === 3">Trả góp</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Số tiền đã trả:</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Số tiền còn lại phải trả:</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <button class="btn-primary">
                        <font-awesome-icon icon="hand-holding-dollar" /> Trả Bớt Gốc
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