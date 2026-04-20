<script setup>
import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { useInterestPayment } from '@/stores/contract/interestPayment';
import { useFinalSettlementStore } from '@/stores/contract/finalSettlement';
import { storeToRefs } from 'pinia';
import { Money3Component as Money3 } from 'v-money3';
import { onMounted } from 'vue';

const reducePrincipalStore = useReducePrincipalStore();
const interestPaymentStore = useInterestPayment();
const finalSettlementStore = useFinalSettlementStore();

const { paymentDetails, StartDate, formReducePrincipal, historyReducePrincipal } = storeToRefs(reducePrincipalStore);
const { closeReducePrincipalModal, formatCurrency, submitReducePrincipal } = reducePrincipalStore;
const { openInterestModal } = interestPaymentStore;
const { openFinalModal } = finalSettlementStore;


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
                                <label>Tiền trả bớt gốc</label>
                                <money3 id="payment_amount" v-model="formReducePrincipal.amount" v-bind="moneyConfig" :max="paymentDetails.contract.loan_amount"></money3>
                            </div>
                            <div class="form-group">
                                <div class="row-group">
                                    <div class="col-group">
                                        <label>Lãi suất cũ</label>
                                        <input type="text" style="background-color: #E8E8E8;" v-if="paymentDetails.contract.interest_type === 'daily_amount'" :value="formatCurrency(paymentDetails.contract.interest_rate)" readonly>
                                        <input type="text" style="background-color: #E8E8E8;" v-else :value="`${paymentDetails.contract.interest_rate}%`" readonly>
                                    </div>
                                    <div class="col-group">
                                        <label>Kiểu lãi xuất</label>
                                        <input type="text" style="background-color: #E8E8E8;" v-if="paymentDetails.contract.interest_type === 'daily_amount'" value= "Lãi suất theo ngày" readonly>
                                        <input type="text" style="background-color: #E8E8E8;" v-if="paymentDetails.contract.interest_type === 'percent*term'" value="Lãi suất % định kỳ" readonly>  
                                        <input type="text" style="background-color: #E8E8E8;" v-if="paymentDetails.contract.interest_type === 'percent/term'" value="Lãi suất % chia đều" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Lãi suất mới</label>
                                <money3  v-bind="moneyConfig"  v-model="formReducePrincipal.interest_rate"></money3>
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
                                <div class="info-item">
                                    <span class="fw-bold">Địa chỉ</span>
                                    <span>{{ paymentDetails.customer.address }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Ngày sinh</span>
                                    <span>{{ paymentDetails.customer.birth_date }}</span>
                                </div>
                            </div>
                            <div class="info">
                                <div class="info-item">
                                    <span class="fw-bold">Số tiền gốc còn lại:</span>
                                    <span class="text-danger fw-bold">{{ formatCurrency(paymentDetails.contract.remaining_amount) }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Kiểu hợp đồng:</span>
                                    <span v-if="paymentDetails.contract.id_contract_type === 1">Cầm đồ</span>
                                    <span v-if="paymentDetails.contract.id_contract_type === 2">Tín chấp</span>
                                    <span v-if="paymentDetails.contract.id_contract_type === 3">Trả góp</span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Kỳ đóng lãi:</span>
                                    <span>{{ paymentDetails.contract.payment_term }}/{{ paymentDetails.contract.term_unit }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Ngày bắt đầu:</span>
                                    <span>{{ paymentDetails.contract.start_date }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="fw-bold">Ngày kết thúc:</span>
                                    <span>{{ paymentDetails.contract.end_date }}</span>
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
                                    <th>Gốc cũ</th>
                                    <th>Gốc mới</th>
                                    <th>Lãi suất cũ</th>
                                    <th>Lãi suất mới</th>
                                    <th>Phí khác</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in historyReducePrincipal" :key="index">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.customer_name }}</td>
                                    <td>{{ item.created_at }}</td>
                                    <td>{{formatCurrency(item.amount)}}</td>
                                    <td>{{formatCurrency(item.old_principal)}}</td>
                                    <td>{{formatCurrency(item.new_principal)}}</td>

                                    <td v-if="paymentDetails.contract.interest_type === 'daily_amount'">{{ item.old_interest_rate > 0 ? formatCurrency(item.old_interest_rate) : 'Không thay đổi'}}</td>
                                    <td v-else>{{ item.old_interest_rate > 0 ? item.old_interest_rate + '%' : 'Không thay đổi'}}</td>

                                    <td v-if="paymentDetails.contract.interest_type === 'daily_amount'">{{ item.new_interest_rate > 0 ? formatCurrency(item.new_interest_rate) : 'Không thay đổi'}}</td>
                                    <td v-else>{{ item.new_interest_rate > 0 ? item.new_interest_rate + '%' : 'Không thay đổi'}}</td>

                                    <td>{{formatCurrency(item.other_fees)}}</td>
                                    <td>{{ item.description }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <button class="btn-primary" v-permission="['loans.final_settlement', 'repayment.final_settlement', 'pledge.final_settlement']" @click="openFinalModal(paymentDetails.contract.id)">
                        <font-awesome-icon icon="hand-holding-dollar" /> Tất Toán
                    </button>
                    <button class="btn-primary" v-permission="['loans.interest_payment', 'repayment.interest_payment', 'pledge.interest_payment']" @click="openInterestModal(paymentDetails.contract.id)">
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