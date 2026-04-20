<script setup>
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import AddNewLoan from '@/components/contracts/AddNewLoan.vue';
import InterestPayment from '@/components/contracts/InterestPayment.vue';
import ReducePrincipal from '@/components/contracts/ReducePrincipal.vue';
import FinalSettlement from '@/components/contracts/FinalSettlement.vue';
import DetailContract from '@/components/contracts/DetailContract.vue';

import { useReducePrincipalStore } from '@/stores/contract/reducePrincipal';
import { useFinalSettlementStore } from '@/stores/contract/finalSettlement';
import { useDetailContractStore } from '@/stores/contract/detailContract';
import { useLoanStore } from '@/stores/contract/loan';
import { useAddNewLoanStore } from '@/stores/contract/addNewLoan';
import { useInterestPayment } from '@/stores/contract/interestPayment';

const loanStore = useLoanStore();
const addNewLoanStore = useAddNewLoanStore();
const interestPaymentStore = useInterestPayment();
const reducePrincipalStore = useReducePrincipalStore();
const finalSettlementStore = useFinalSettlementStore();
const detailContractStore = useDetailContractStore();

const {loans, paginated, totalPage, currentPage, search, 
        sortConfig, filterStatus, startDate, endDate, pageNumbers} = storeToRefs(loanStore);
const { getAllLoansType, deleteLoan, formatCurrency, changePage, goToFirstPage, 
        goToNextPage, goToPrevPage, goToLastPage, handleSort, fetchCustomer, 
        handleExportExcel, handleImportExcel } = loanStore;

const { showModal } = storeToRefs(addNewLoanStore);
const { openModal, closeModal } = addNewLoanStore;

const { showInterestModal } = storeToRefs(interestPaymentStore);
const { openInterestModal, closeInterestModal } = interestPaymentStore;

const { showReducePrincipalModal } = storeToRefs(reducePrincipalStore);
const { openReducePrincipalModal, closeReducePrincipalModal } = reducePrincipalStore;

const { showFinalModal } = storeToRefs(finalSettlementStore);
const { openFinalModal, closeFinalModal } = finalSettlementStore;

const { showDetailContract } = storeToRefs(detailContractStore);
const { openDetailContract, closeDetailContract } = detailContractStore;

const onFileSelected = async (event) => {
    const file = event.target.files[0];
    if (file) {
        await handleImportExcel(file);
        event.target.value = '';
        await getAllLoansType();
    }
}

onMounted(async() => {
    await getAllLoansType();
    await fetchCustomer()
})
</script>

<template>
    <div class="pledges">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" v-model="search" placeholder="Tìm kiếm theo Mã HĐ, Tên KH, SĐT">
                </div>
                <div class="filter">
                    <label for="filter">Trạng thái</label>
                    <select id="filter" v-model="filterStatus">
                        <option value="">Tất cả</option>
                        <option value="Đang Vay">Đang Vay</option>
                        <option value="Đã Hoàn Tất">Đã Hoàn Tất</option>
                        <option value="Đã Tất Toán">Đã Tất Toán</option>
                        <option value="Quá Hạn">Quá Hạn</option>
                        <option value="Đến Hạn">Đến Hạn</option>
                        <option value="Sắp Đến Hạn">Sắp Đến Hạn</option>
                    </select>
                </div>
                <div class="time-range">
                    <div class="time-range-input">
                        <label for="start-date">Thời gian</label>
                        <input type="date" id="start-date" v-model="startDate">
                        <span>-</span>
                        <input type="date" id="end-date" v-model="endDate">
                    </div>
                </div>
            </div>
            <div class="button-group">
                <!-- Nút Xuất File -->
                <button class="btn-export" style="background-color: #ff7221; color: white;" @click="handleExportExcel">
                    <font-awesome-icon icon="fa-solid fa-file-excel" /> Xuất Excel
                </button>
                
                <!-- Nút Nhập File (kèm input bị ẩn) -->
                <input type="file" ref="fileInput" accept=".xlsx, .xls" style="display: none" @change="onFileSelected"/>
                <button class="btn-import" @click="$refs.fileInput.click()" style="background-color: #1976d2; color: white;">
                    <font-awesome-icon icon="fa-solid fa-file-import" /> Nhập Excel
                </button>
                <button v-permission="'pledges.create'" @click="openModal">Thêm hợp đồng</button>
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
                                <span class="text-success fw-bold" id="detailContract" @click="openDetailContract(loan.id)" v-permission="'pledges.detail'">{{ loan.code }}</span>
                                <p>{{ loan.start_date }}</p>
                                <p>{{ loan.end_date }}</p>
                            </td>
                            <td><span>{{ loan.customer_name }}</span> <p>{{ loan.customer_phone }}</p></td>
                            <td><span class="text-danger fw-bold">{{ formatCurrency(loan.loan_amount) }}</span></td>
                            <td><span class="text-success fw-bold">{{ formatCurrency(loan.had_paid) }}</span></td>
                            <td><span class="text fw-bold">{{ formatCurrency(loan.remaining_amount) }}</span></td>
                            <td>
                                <span class="badge rounded-pill bg-warning text-warning-emphasis fw-bold" v-if="loan.status === 'Đang vay' || loan.status === 'Đang Vay'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-success fw-bold" v-if="loan.status === 'Đã Hoàn Tất' || loan.status === 'Đã Tất Toán'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-danger fw-bold" v-if="loan.status === 'Quá Hạn'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg fw-bold" style="background-color: #ff7221;" v-if="loan.status === 'Đến Hạn'">
                                    {{ loan.status }}
                                </span>
                                <span class="badge rounded-pill bg-warning text-warning-emphasis fw-bold" v-if="loan.status === 'Sắp Đến Hạn'">
                                    {{ loan.status }}
                                </span>
                            </td>
                            <td>
                                <div class="action-cell" v-if="loan.status === 'Đã Hoàn Tất' || loan.status === 'Đã Tất Toán'">
                                    <button class="btn-action text-primary" data-tooltip="Xem chi tiết" @click="openDetailContract(loan.id)" v-permission="'pledges.detail'">
                                        <font-awesome-icon icon="fa-solid fa-eye" />
                                    </button>
                                </div>
                                <div class="action-cell" v-else>
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi" v-permission="'loans.interest_payment'" @click="openInterestModal(loan.id)">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-success" data-tooltip="Trả bớt gốc" v-permission="'loans.reduce_principal'" @click="openReducePrincipalModal(loan.id)">
                                        <font-awesome-icon icon="money-bill-wave" />
                                    </button>
                                    <button class="btn-action text-success" data-tooltip="Tất toán" v-permission="'loans.final_settlement'" @click="openFinalModal(loan.id)">
                                        <font-awesome-icon icon="hand-holding-dollar" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa" v-permission="'loans.delete'" @click="deleteLoan(loan.id)">
                                        <font-awesome-icon icon="circle-xmark" />
                                    </button>
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
                    <button class="page-btn" v-for="page in pageNumbers" 
                        :key="page" @click="changePage(page)"
                        :class="{ 'active': page === currentPage ? 'btn-primary' : ''}">
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
    <div class="modal-overlay" v-if="showDetailContract">
        <DetailContract @close="closeDetailContract" />
    </div>
</template>