<script setup>
import { useLoanStore } from '@/stores/loan';
import { useAddNewLoanStore } from '@/stores/contract/addNewLoan';
import { useInterestPayment } from '@/stores/contract/interestPayment';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import AddNewLoan from '@/components/contracts/AddNewLoan.vue';
import InterestPayment from '@/components/contracts/InterestPayment.vue';

const loanStore = useLoanStore();
const addNewLoanStore = useAddNewLoanStore();
const interestPaymentStore = useInterestPayment();

const {loans, paginated, totalPage, currentPage, search, sortConfig} = storeToRefs(loanStore);
const { getAllLoans, deleteLoan, formatCurrency, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage, handleSort, fetchCustomer } = loanStore;

const { showModal } = storeToRefs(addNewLoanStore);
const { openModal, closeModal } = addNewLoanStore;

const { showInterestModal } = storeToRefs(interestPaymentStore);
const { openInterestModal, closeInterestModal } = interestPaymentStore;

onMounted(async() => {
    await getAllLoans();
    await fetchCustomer()
})
</script>

<template>
    <div class="pledges">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" v-model="search" placeholder="Tìm kiếm theo tên, SĐT">
                </div>
                <div class="filter">
                    <label for="filter">Trạng thái</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Đang vay</option>
                        <option value="">Đã thanh toán</option>
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
                <button @click="openModal">Thêm hợp đồng</button>
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
                            <th>Số tiền vay</th>
                            <th>Số tiền đã trả</th>
                            <th>Còn phải đóng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="loan, index in paginated" :key="loan.id">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <span class="text-success fw-bold">{{ loan.code }}</span>
                                <p>{{ loan.start_date }}</p>
                                <p>{{ loan.end_date }}</p>
                            </td>
                            <td>{{ loan.customer_name }} {{ loan.customer_phone }}</td>
                            <td><span class="text-danger fw-bold">{{ formatCurrency(loan.loan_amount) }}</span></td>
                            <td><span class="text-success fw-bold">{{ formatCurrency(loan.had_paid) }}</span></td>
                            <td><span class="text fw-bold">{{ formatCurrency(loan.remaining_amount) }}</span></td>
                            <td>
                                <span class="badge rounded-pill bg-warning text-warning-emphasis fw-bold" v-if="loan.status === 'Đang vay' || loan.status === 'Đang Vay'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-success fw-bold" v-if="loan.status === 'Đã Hoàn Tất'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-danger fw-bold" v-if="loan.status === 'Quá Hạn'">
                                    {{ loan.status }}
                                </span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi" v-permission="'contract.detail'" @click="openInterestModal(loan.id)">
                                        <font-awesome-icon icon="coins" />
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
</template>