<script setup>
import { useFinalSettlementStore } from '@/stores/contract/finalSettlement';
import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { useInterestPayment } from '@/stores/contract/interestPayment';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Money3Component as Money3 } from 'v-money3';

const finalSettlementStore = useFinalSettlementStore();
const reducePrincipalStore = useReducePrincipalStore();
const interestPaymentStore = useInterestPayment();

const { settlementData } = storeToRefs(finalSettlementStore);
const { closeFinalModal } = finalSettlementStore;
const { openReducePrincipalModal } = reducePrincipalStore;
const { openInterestModal } = interestPaymentStore;

const loanStore = {
    formatCurrency: (amount) => {
        if (amount === undefined || amount === null) return '0';
        return new Intl.NumberFormat('ni-VN').format(amount) + ' VNĐ';
    }
};

const formatCurrency = loanStore.formatCurrency;

const formDetails = ref({
    other_fees: 0,
    note: ''
});

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
    <div class="modal-interest-container" @click.self="closeFinalModal">
        <div class="modal-interest-content">
            <div class="modal-header">
                <h2>Tất toán</h2>
                <button class="btn-close" @click="closeFinalModal">&times;</button>
            </div>

            <div class="modal-body" >
                <div class="form-container">
                    <div class="form-header">Tất toán</div>
                    <form>
                        <div class="form-body">
                            <div class="form-group">
                                <label>Ngày thanh toán</label>
                                <input type="text" :value="new Date().toLocaleDateString('vi-VN')" style="background-color: #E8E8E8;"  readonly>
                            </div>
                            <div class="form-group">
                                <label>Người thanh toán</label>
                                <input type="text" :value="settlementData?.customer?.name" style="background-color: #E8E8E8;"  readonly>
                            </div>
                            <div class="form-group">
                                <label>Tiền tất toán</label>
                                 <input type="text" :value="formatCurrency(settlementData?.total_remaining)" style="background-color: #E8E8E8;"  readonly>
                            </div>
                            <div class="form-group">
                                <label>Phí khác</label>
                                <money3 v-model="formDetails.other_fees" v-bind="moneyConfig" ></money3>
                            </div>
                            <div class="form-group">
                                <label>Ghi chú</label>
                                <input type="text" v-model="formDetails.note">
                            </div>
                            <div class="form-actions">
                                <button class="btn-confirm" type="button" @click="finalSettlementStore.submitFinalSettlement(formDetails)">Xác nhận</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="container">
                    <div class="info-container">
                        <div class="info">
                            <div class="info-item">
                                <span class="fw-bold">Mã hợp đồng</span>
                                <span class="text-success fw-bold">{{ settlementData?.contract?.code }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Tên khách hàng</span>
                                <span>{{ settlementData?.customer?.name }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Số điện thoại</span>
                                <span>{{ settlementData?.customer?.phone }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">CCCD</span>
                                <span>{{ settlementData?.customer?.cccd }}</span>
                            </div>
                        </div>
                        <div class="info">
                            <div class="info-item">
                                <span class="fw-bold">Số tiền vay:</span>
                                <span class="text-danger fw-bold">{{ formatCurrency(settlementData?.contract?.loan_amount) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Kiểu lãi:</span>
                                <span v-if="settlementData?.contract?.interest_type === 'daily_amount'">Lãi suất theo ngày</span>
                                <span v-if="settlementData?.contract?.interest_type === 'percent*term'">Lãi suất % định kỳ</span>
                                <span v-if="settlementData?.contract?.interest_type === 'percent/term'">Lãi suất % chia đều</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Lãi đã trả:</span>
                                <span class="text-success">{{ formatCurrency(settlementData?.total_interest_paid) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Tổng tiền tất toán (tính đến nay):</span>
                                <span class="text-danger fw-bold">{{ formatCurrency(settlementData?.total_remaining) }}</span>
                            </div>
                            <div class="info-item">
                                <span class="fw-bold">Số ngày đã qua:</span>
                                <span>{{ settlementData?.day_count }} ngày</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <button class="btn-primary" v-permission="['loans.reduce_principal', 'repayment.reduce_principal', 'pledge.reduce_principal']" @click="openReducePrincipalModal(settlementData?.contract?.id)">
                        <font-awesome-icon icon="money-bill-wave" /> Trả Bớt Gốc
                    </button>
                    <button class="btn-primary" v-permission="['loans.interest_payment', 'repayment.interest_payment', 'pledge.interest_payment']" @click="openInterestModal(settlementData?.contract?.id)">
                        <font-awesome-icon icon="coins" /> Đóng Lãi
                    </button>
                </div>
                <div class="footer-right">
                    <button class="btn-secondary" @click="closeFinalModal">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('@/assets/interest.css');
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
    max-height: 40%;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.container{
    display: flex;
    flex-direction: column;
}
.table{
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
}
</style>