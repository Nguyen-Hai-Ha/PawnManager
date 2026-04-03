<script setup>
import { useTransactionStore } from '@/stores/transaction';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);
const { fetchTransactions, formatCurrency } = transactionStore

onMounted( async () => {
    const promise = [];
    if (!transactions.value.length) {
        promise.push(fetchTransactions());
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
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT">
                </div>
                <div class="time-range">
                    <div class="time-range-input">
                        <label for="">Thời gian</label>
                        <input type="date" id="start-date">
                    </div>
                </div>
                <div class="filter">
                    <label for="filter">Nhân viên</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Đang vay</option>
                        <option value="">Đã thanh toán</option>
                        <option value="">Quá hạn</option>
                    </select>
                </div>
                <div class="filter">
                    <label for="filter">Kiểu vay</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Cầm đồ</option>
                        <option value="">Trả góp</option>
                        <option value="">Tín chấp</option>
                    </select>
                </div>
                <div class="filter">
                    <label for="filter">Loại thu chi</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Chi cho vay</option>
                        <option value="">Kỳ lãi</option>
                        <option value="">Trả bớt gốc</option>
                        <option value="">Tất toán</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="table-wrapper-trannsaction">
            <div class="table-trannsaction">
                <table>
                    <thead>
                        <tr>
                            <th rowspan="2">STT</th>
                            <th rowspan="2">Thời gian</th>
                            <th rowspan="2">Nhân viên</th>
                            <th rowspan="2">Mã hợp đồng</th>
                            <th rowspan="2">Khách hàng</th>
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
                        <tr v-for="transaction in transactions" :key="transaction.id">
                            <td>{{ transaction.id }}</td>
                            <td>{{ transaction.created_at }}</td>
                            <td>{{ transaction.staff_name }}</td>
                            <td class="text-success fw-bold">{{ transaction.contract_code }}</td>
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
    </div>
</template>