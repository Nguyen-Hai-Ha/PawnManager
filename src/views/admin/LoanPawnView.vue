<script setup>
import { useLoanStore } from '@/stores/loan';
import { useAddNewLoanStore } from '@/stores/contract/addNewLoan';
import { useInterestPayment } from '@/stores/contract/interestPayment';
import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { useFinalSettlementStore } from '@/stores/contract/finalSettlement';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import AddNewLoan from '@/components/contracts/AddNewLoan.vue';
import InterestPayment from '@/components/contracts/InterestPayment.vue';
import ReducePrincipal from '@/components/contracts/ReducePrincipal.vue';
import FinalSettlement from '@/components/contracts/FinalSettlement.vue';

const loanStore = useLoanStore();
const addNewLoanStore = useAddNewLoanStore();
const interestPaymentStore = useInterestPayment();
const reducePrincipalStore = useReducePrincipalStore();
const finalSettlementStore = useFinalSettlementStore();

const { loans, paginated, totalPage, currentPage, search, sortConfig } = storeToRefs(loanStore);
const { getAllLoans, formatCurrency, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage, handleSort, fetchCustomer, deleteLoan } = loanStore;

const { showModal } = storeToRefs(addNewLoanStore);
const { openModal, closeModal } = addNewLoanStore;

const { showInterestModal } = storeToRefs(interestPaymentStore);
const { openInterestModal, closeInterestModal } = interestPaymentStore;

const { showReducePrincipalModal } = storeToRefs(reducePrincipalStore);
const { openReducePrincipalModal, closeReducePrincipalModal } = reducePrincipalStore;

const { showFinalModal } = storeToRefs(finalSettlementStore);
const { openFinalModal, closeFinalModal } = finalSettlementStore;

onMounted(async() => {
    await getAllLoans();
    await fetchCustomer()
})

</script>

<template>
    <div class="loan-pawn">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, mã hợp đồng, TS thế chấp" v-model="search">
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
                <button v-permission="'contract.create'" @click="openModal">Thêm hợp đồng</button>
            </div>
        </div>

        <div class="table-wrapper">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th class="sortable" @click="handleSort('id')">
                                STT
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'id' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'id' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th class="sortable" @click="handleSort('code')">
                                Mã hợp đồng
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'code' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'code' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th class="sortable" @click="handleSort('customer_name')">
                                Tên khách hàng
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'customer_name' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'customer_name' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th>TS thế chấp</th>
                            <th>Số tiền vay</th>
                            <th>Số tiền đã trả</th>
                            <th>Còn phải đóng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for = " loan, index in paginated" :key = "loan.id">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <span class="text-success fw-bold">{{ loan.code }}</span>
                                <p>{{ loan.start_date }}</p>
                                <p>{{ loan.end_date }}</p>
                            </td>
                            <td>{{ loan.customer_name }} {{ loan.customer_phone }}</td>
                            <td>{{ loan.collateral_name }}</td>
                            <td><span class="text-danger fw-bold">{{ formatCurrency(loan.loan_amount) }}</span></td>
                            <td><span class="text-success fw-bold">{{ formatCurrency(loan.had_paid) }}</span></td>
                            <td><span class="text fw-bold">{{ formatCurrency(loan.remaining_amount) }}</span></td>
                            <td>
                                <span class="badge rounded-pill bg-warning text-warning-emphasis fw-bold" v-if="loan.status === 'Đang cầm' || loan.status === 'Đang Cầm'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-success fw-bold" v-if="loan.status === 'Đã Hoàn Tất'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-danger text-danger-emphasis fw-bold" v-if="loan.status === 'Cần thanh lý' || loan.status === 'Quá hạn'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-primary fw-bold" v-if="loan.status === 'Đã thanh lý'">
                                    {{ loan.status }}
                                </span>
                            </td>
                            <td>
                                <div class="action-cell" v-if="loan.status === 'Đã Hoàn Tất'">
                                    <button class="btn-action text-primary" data-tooltip="Xem chi tiết">
                                        <font-awesome-icon icon="fa-solid fa-eye" />
                                    </button>
                                </div>
                                <div class="action-cell" v-else>
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi" v-permission="'contract.detail'" @click="openInterestModal(loan.id)">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-success" data-tooltip="Trả bớt gốc" @click="openReducePrincipalModal(loan.id)">
                                        <font-awesome-icon icon="money-bill-wave" />
                                    </button>
                                    <button class="btn-action text-success" data-tooltip="Tất toán" @click="openFinalModal(loan.id)">
                                        <font-awesome-icon icon="hand-holding-dollar" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa" v-permission="'contract.delete'" @click="deleteLoan(loan.id)"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                                
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" v-if="totalPage >= 1">
                <div class="pagination-info">
                    <span class="page-info">Trang {{ currentPage }}/{{ totalPage }} ({{ loans.length }})</span>
                </div>
                <div class="pagination-controls">
                    <button class="page-btn" @click="goToFirstPage"><font-awesome-icon icon="angles-left" /></button>
                    <button class="page-btn" @click="goToPrevPage"><font-awesome-icon icon="angle-left" /></button>
                    <button class="page-btn" v-for="page in Math.min(5, totalPage)" 
                        :key="page" @click="changePage(page)"
                        :class="{ 'active': page === currentPage ? 'btb-primary' : ''}">
                        {{ page }}
                    </button>
                    <button class="page-btn" @click="goToNextPage"><font-awesome-icon icon="angle-right" /></button>
                    <button class="page-btn" @click="goToLastPage"><font-awesome-icon icon="angles-right" /></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-overlay" v-if="showModal">
        <AddNewLoan @close="closeModal" />
    </div>
    <div class="modal-overlay" v-if="showInterestModal">
        <InterestPayment @close="closeInterestModal" />
    </div>
    <div class="modal-overlay" v-if="showReducePrincipalModal">
        <ReducePrincipal @close="closeReducePrincipalModal" />
    </div>
    <div class="modal-overlay" v-if="showFinalModal">
        <FinalSettlement @close="closeFinalModal" />
    </div>
</template>

<style scoped>
@import '@/assets/main.css';

th.sortable {
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}

.sort-icon {
    margin-left: 4px;
    opacity: 0.6;
    font-size: 0.8em;
    color: #ffffff;
}

th.sortable:hover .sort-icon {
    opacity: 1;
}
</style>