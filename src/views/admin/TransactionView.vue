<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import DetailContract from '@/components/contracts/DetailContract.vue';

import { useTransactionStore } from '@/stores/transaction';
import { useDetailContractStore } from '@/stores/contract/detailContract';

const transactionStore = useTransactionStore();
const detailContractStore = useDetailContractStore();

const { transactions, search, paginated, totalPage, currentPage, sortConfig,
        filterDate, Staff, TransactionType, ContractType, staffs, transactionTypes, contractTypes } = storeToRefs(transactionStore);
const { fetchTransactions, formatCurrency, changePage, goToFirstPage, 
        goToNextPage, goToPrevPage, goToLastPage, handleSort, fetchStaffs, fetchTransactionTypes, fetchContractTypes } = transactionStore

const { showDetailContract } = storeToRefs(detailContractStore);
const { openDetailContract, closeDetailContract } = detailContractStore;

onMounted( async () => {
    const promise = [];
    if (!transactions.value.length) {
        promise.push(fetchTransactions());
    }
    if (!staffs.value.length) {
        promise.push(fetchStaffs());
    }
    if (!transactionTypes.value.length) {
        promise.push(fetchTransactionTypes());
    }
    if (!contractTypes.value.length) {
        promise.push(fetchContractTypes());
    }
    await Promise.all(promise);
});
</script>

<template>
    <div class="transaction">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo Mã HĐ, Khách hàng, CCCD, Nhân viên" v-model="search">
                </div>
                <div class="time-range">
                    <div class="time-range-input">
                        <label for="">Thời gian</label>
                        <input type="date" id="start-date" v-model="filterDate">
                    </div>
                </div>
                <div class="filter">
                    <label for="filter">Nhân viên</label>
                    <select id="filter" v-model="Staff">
                        <option value="">Tất cả</option>
                        <option v-for="staff in staffs" :key="staff.id" :value="staff.name">{{ staff.name }}</option>
                    </select>
                </div>
                <div class="filter">
                    <label for="filter">Kiểu vay</label>
                    <select id="filter" v-model="ContractType">
                        <option value="">Tất cả</option>
                        <option v-for="contractType in contractTypes" :key="contractType.id" :value="contractType.id">{{ contractType.name }}</option>
                    </select>
                </div>
                <div class="filter">
                    <label for="filter">Loại thu chi</label>
                    <select id="filter" v-model="TransactionType">
                        <option value="">Tất cả</option>
                        <option v-for="transactionType in transactionTypes" :key="transactionType.id" :value="transactionType.id">{{ transactionType.name }}</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="table-wrapper-trannsaction">
            <div class="table-trannsaction">
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2" @click="handleSort('id')">STT
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'id' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'id' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th rowspan="2" @click="handleSort('created_at')">Thời gian
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'created_at' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'created_at' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th rowspan="2" @click="handleSort('staff_name')">Nhân viên
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'staff_name' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'staff_name' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th rowspan="2" @click="handleSort('contract_code')">Mã hợp đồng
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'contract_code' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'contract_code' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th rowspan="2" @click="handleSort('customer_name')">Khách hàng
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'customer_name' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'customer_name' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th rowspan="2">CCCD</th>
                            <th rowspan="2">Loại</th>
                            <th rowspan="2">Thu</th>
                            <th rowspan="2">Chi</th>
                            <th colspan="3" class="special">Thu lãi</th>
                            <th rowspan="2" class="special">Thao tác</th>
                        </tr>
                        <tr>
                            <th class="special">Tiền gốc</th>
                            <th class="special">Tiền lãi</th>
                            <th class="special">Phí khác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="transaction in paginated" :key="transaction.id">
                            <td>{{ transaction.id }}</td>
                            <td>{{ transaction.created_at }}</td>
                            <td>{{ transaction.staff_name }}</td>
                            <td class="text-success fw-bold" v-permission="['loans.detail', 'pledge.detail', 'repayment.detail']" id="detailContract" @click="openDetailContract(transaction.contract_id)">
                                {{ transaction.contract_code }}
                            </td>
                            <td>{{ transaction.customer_name }}</td>
                            <td>{{ transaction.customer_cccd }}</td>
                            <td class="fw-bold">{{ transaction.transaction_type_name }}</td>
                            <td class="text-success fw-bold" >
                                {{ transaction.id_transaction_type != 1 ? formatCurrency(transaction.amount) : 0 }}
                            </td>
                            <td class="text-danger fw-bold" >
                                -{{ transaction.id_transaction_type === 1 ? formatCurrency(transaction.amount) : 0 }}
                            </td>
                            <td class="text-warning fw-bold" v-if="transaction.id_transaction_type === 4">
                                {{ formatCurrency(transaction.amount) || 0 }}
                            </td>
                            <td class="text-warning fw-bold" v-else>
                                {{ formatCurrency(transaction.principal_amount) || 0 }}
                            </td>
                            <td class="text-success fw-bold">{{ formatCurrency(transaction.interest_amount) || 0 }}</td>
                            <td class="text-success fw-bold">{{ formatCurrency(transaction.other_fees) || 0 }}</td>
                            <td class="special">
                                <button class="btn-action text-primary" data-tooltip="Xem chi tiết">
                                    <font-awesome-icon icon="fa-solid fa-eye" />
                                </button>
                                <button class="btn-action text-danger" data-tooltip="Xóa">
                                    <font-awesome-icon icon="fa-solid fa-trash-can" />
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="pagination" v-if="totalPage >= 1">
            <div class="pagination-info">
                <span class="page-info">Trang {{ currentPage }}/{{ totalPage }} ({{ transactions.length }})</span>
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
    <div class="modal-overlay" v-if="showDetailContract">
        <DetailContract @close="closeDetailContract" />
    </div>
</template>