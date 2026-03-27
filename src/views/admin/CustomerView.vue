<script setup>
import AddCustomer from '@/components/AddCustomer.vue';
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';

const store = useCustomerStore();

const { customers, showAddCustomer, paginated, currentPage, totalPage, search } = storeToRefs(store);

const { fetchcustomer, closeModal, openModal,
        changePage, goToFirstPage, goToLastPage,
        goToNextPage, goToPrevPage, deleteCutomer } = store;

onMounted(async () => {
    const promise = [];
    if (customers.value.length === 0) {
        promise.push(fetchcustomer());
    }
    await Promise.all(promise);
})
</script>
<template>
    <div class="customer">
        <div class="group-function">
            <div class="search">
                <input type="text" v-model="search" placeholder="Tìm kiếm theo tên, SĐT">
            </div>
            <div class="button-group">
                <button @click="openModal" v-permission="'customer.create'">Thêm khách hàng</button>
            </div>
        </div>
        <div class="table-wrapper">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>STT <font-awesome-icon icon="sort" class="sort-icon" /></th>
                            <th>Họ và tên <font-awesome-icon icon="sort" class="sort-icon" /></th>
                            <th>SĐT <font-awesome-icon icon="sort" class="sort-icon" /></th>
                            <th>CCCD</th>
                            <th>Địa chỉ</th>
                            <th>Hình CCCD</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(customer, index) in paginated" :key="customer.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.phone }}</td>
                            <td>{{ customer.cccd }}</td>
                            <td>{{ customer.address }}</td>
                            <td><img :src="`http://localhost:3000/uploads/` + customer.images_cccd" alt="" class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa"><font-awesome-icon
                                            icon="pen-to-square" /></button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa" @click="deleteCutomer(customer.id)"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" v-if="totalPage >= 1">
                <div class="pagination-info">
                    <span class="page-info">Trang {{ currentPage }}/{{ totalPage }} ({{ customers.length }})</span>
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
    <div class="pm-modal-overlay" v-if="showAddCustomer">
        <AddCustomer @close="closeModal" />
    </div>
</template>
<style scoped>
@import '@/assets/main.css';
</style>