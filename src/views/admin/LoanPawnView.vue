<script setup>
import { useLoanStore } from '@/stores/loan';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

import AddNewLoan from '@/components/contracts/AddNewLoan.vue';

const loanStore = useLoanStore();

const { loans, showModal } = storeToRefs(loanStore);
const { getAllLoans, formatCurrency, openModal, closeModal } = loanStore;

onMounted(async() => {
    const promise = [];
    if (loans.value.length === 0) {
        promise.push(getAllLoans());
    }
    await Promise.all(promise);
})

</script>

<template>
    <div class="loan-pawn">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT">
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
                <button @click="openModal">Thêm hợp đồng</button>
            </div>
        </div>

        <div class="table-wrapper">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã hợp đồng</th>
                            <th>Tên khách hàng</th>
                            <th>TS thế chấp</th>
                            <th>Số tiền vay</th>
                            <th>Số tiền đã trả</th>
                            <th>Còn phải đóng</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for = " loan in loans" :key = "loan.id">
                            <td>1</td>
                            <td>
                                <span class="fw-bold">{{ loan.code }}</span>
                                <p>{{ loan.start_date }}</p>
                                <p>{{ loan.end_date }}</p>
                            </td>
                            <td>{{ loan.customer_name }}</td>
                            <td>{{ loan.collateral_name }}</td>
                            <td><span class="text-danger fw-bold">{{ formatCurrency(loan.loan_amount) }}</span></td>
                            <td><span class="text-success fw-bold">{{ formatCurrency(loan.had_paid) }}</span></td>
                            <td><span class="text fw-bold">{{ formatCurrency(loan.remaining_amount) }}</span></td>
                            <td><span class="badge rounded-pill bg-warning text-warning-emphasis">{{ loan.status }}</span>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-success" data-tooltip="Đóng lãi">
                                        <font-awesome-icon icon="coins" />
                                    </button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <div class="pagination-info">
                    <span class="page-info">Trang 1/5 (72)</span>
                </div>
                <div class="pagination-controls">
                    <button class="page-btn"><font-awesome-icon icon="angles-left" /></button>
                    <button class="page-btn"><font-awesome-icon icon="angle-left" /></button>
                    <button class="page-btn">1</button>
                    <button class="page-btn">2</button>
                    <button class="page-btn">3</button>
                    <button class="page-btn">4</button>
                    <button class="page-btn"><font-awesome-icon icon="angle-right" /></button>
                    <button class="page-btn"><font-awesome-icon icon="angles-right" /></button>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-overlay" v-if="showModal">
        <AddNewLoan @close="closeModal" />
    </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>