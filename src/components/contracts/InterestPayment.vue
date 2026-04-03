<script setup>
import { useInterestPayment } from '@/stores/contract/interestPayment';
import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { useFinalSettlementStore } from '@/stores/contract/finalSettlement';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Money3Component as Money3 } from 'v-money3';

const store = useInterestPayment();
const reducePrincipalStore = useReducePrincipalStore();
const finalSettlementStore = useFinalSettlementStore();


const { paymentDetails, formDetails, loanDetails, historyPayment } = storeToRefs(store);
const { formatCurrency, closeInterestModal, submitInterestPayment } = store;

const { openReducePrincipalModal } = reducePrincipalStore;
const { openFinalModal } = finalSettlementStore;


const emit = defineEmits(['close']);
const activeTab = ref('Chi tiết đóng lãi');
const tabs = ['Chi tiết đóng lãi', 'Thông Tin hợp đồng', 'Lịch sử đóng lãi'];

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
    <div class="modal-interest-container" @click.self="closeInterestModal">
        <div class="modal-interest-content">
            <div class="modal-header">
                <h2>Đóng Lãi</h2>
                <button class="btn-close" @click="closeInterestModal">&times;</button>
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
                    <form @submit.prevent="submitInterestPayment">
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
                                <money3 id="payment_amount" v-model="formDetails.payment_amount" v-bind="moneyConfig" ></money3>
                            </div>
                            <div class="form-group">
                                <label>Phí khác</label>
                                <money3 v-model="formDetails.other_fees" v-bind="moneyConfig"></money3>
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
            
            <div class="modal-body" v-permission="['loans.read', 'repayment.read', 'pledge.read']" v-if="activeTab === 'Thông Tin hợp đồng'">
                <div class="info-contract">
                    <div class="info">
                        <div class="info-item">
                            <span class="fw-bold">Mã hợp đồng</span>
                            <span class="text-success fw-bold">{{ loanDetails.contract.code }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Tên khách hàng</span>
                            <span>{{ loanDetails.customer.name }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Số điện thoại</span>
                            <span>{{ loanDetails.customer.phone }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">CCCD</span>
                            <span>{{ loanDetails.customer.cccd }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Địa chỉ</span>
                            <span>{{ loanDetails.customer.address }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Ngày sinh</span>
                            <span>{{ loanDetails.customer.birth_date || 'Chưa cập nhật' }}</span>
                        </div>
                    </div>
                </div>

                <div class="info-contract">
                    <div class="info">
                        <div class="info-item">
                            <span class="fw-bold">Số tiền vay:</span>
                            <span class="text-danger fw-bold">{{ formatCurrency(loanDetails.contract.loan_amount) }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Lãi suất:</span>
                            <span class="fw-bold" v-if="loanDetails.contract.interest_type === 'percent*term'">Lãi {{ loanDetails.contract.term_unit }}: {{ loanDetails.contract.interest_rate }}%/{{ loanDetails.contract.payment_term }} {{ loanDetails.contract.term_unit }}</span>
                            <span class="fw-bold" v-if="loanDetails.contract.interest_type === 'percent/term'">Lãi {{ loanDetails.contract.term_unit }}: {{ loanDetails.contract.interest_rate }}%/ {{ (loanDetails.contract.payment_term * loanDetails.contract.total_periods) }} {{ loanDetails.contract.term_unit }}</span>
                            <span class="fw-bold" v-if="loanDetails.contract.interest_type === 'daily_amount'">Lãi {{ loanDetails.contract.term_unit }}: {{ formatCurrency(loanDetails.contract.interest_rate) }}/{{ loanDetails.contract.term_unit }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Kiểu hợp đồng:</span>
                            <span v-if="loanDetails.contract.id_contract_type == 1">Cầm cố</span>
                            <span v-if="loanDetails.contract.id_contract_type == 2">Thế chấp</span>
                            <span v-if="loanDetails.contract.id_contract_type == 3">Trả góp</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Kỳ đóng lãi:</span>
                            <span>{{ loanDetails.contract.payment_term }}/{{ loanDetails.contract.term_unit }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Ngày bắt đầu:</span>
                            <span>{{ loanDetails.contract.start_date }}</span>
                        </div>
                        <div class="info-item">
                            <span class="fw-bold">Ngày kết thúc:</span>
                            <span>{{ loanDetails.contract.end_date }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal-body" v-permission="['loans.read', 'repayment.read', 'pledge.read']" v-if="activeTab === 'Lịch sử đóng lãi'">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Ngày Thanh Toán</th>
                                <th>Tiền Thanh Toán</th>
                                <th>Phí Khác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item, index in historyPayment">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.created_at }}</td>
                                <td>{{ formatCurrency(item.amount) }}</td>
                                <td>{{ formatCurrency(item.other_fees) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="modal-footer">
                <div class="footer-left">
                    <button class="btn-primary" v-permission="['loans.final_settlement', 'repayment.final_settlement', 'pledge.final_settlement']" @click="openFinalModal(loanDetails.contract.id)">
                        <font-awesome-icon icon="hand-holding-dollar" /> Tất Toán
                    </button>
                    <button class="btn-primary" v-permission="['loans.reduce_principal', 'repayment.reduce_principal', 'pledge.reduce_principal']" @click="openReducePrincipalModal(loanDetails.contract.id)">
                        <font-awesome-icon icon="money-bill-wave" /> Trả Bớt Gốc
                    </button>
                </div>
                <div class="footer-right">
                    <button class="btn-secondary" @click="closeInterestModal">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import url('@/assets/interest.css');
</style>