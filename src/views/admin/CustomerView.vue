<script setup>
import AddCustomer from '@/components/customer/AddCustomer.vue';
import EditCustomer from '@/components/customer/EditCustomer.vue'
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';

const store = useCustomerStore();

const { customers, showAddCustomer, paginated, currentPage, 
        totalPage, search, showEditCustomer, sortConfig, pageNumbers } = storeToRefs(store);

const { fetchcustomer, closeModal, openModal,
        changePage, goToFirstPage, goToLastPage,
        goToNextPage, goToPrevPage, deleteCutomer,
        openEditModal, closeEditModal, handleSort } = store;

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
                            <th>STT 
                                <span class="sort-icon" @click="handleSort('id')">
                                    <font-awesome-icon v-if="sortConfig.key === 'id'" :icon="sortConfig.direction === 'asc' ? 'sort-up' : 'sort-down'" class="sort-icon" />
                                    <font-awesome-icon v-else icon="sort" class="sort-icon"/>
                                </span>
                            </th>
                            <th>Họ và tên 
                                <span class="sort-icon" @click="handleSort('name')">
                                    <font-awesome-icon v-if="sortConfig.key === 'name'" :icon="sortConfig.direction === 'asc' ? 'sort-up' : 'sort-down'" class="sort-icon"/>
                                    <font-awesome-icon v-else icon="sort" class="sort-icon"/>
                                </span>
                            </th>
                            <th>SĐT 
                                <span class="sort-icon" @click="handleSort('phone')" >
                                    <font-awesome-icon v-if="sortConfig.key === 'phone'" :icon="sortConfig.direction === 'asc' ? 'sort-up' : 'sort-down'" class="sort-icon"/>
                                    <font-awesome-icon v-else icon="sort" class="sort-icon"/>
                                </span>
                            </th>
                            <th>CCCD</th>
                            <th>Địa chỉ</th>
                            <th>Hình CCCD</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in paginated" :key="customer.id">
                            <td>{{ customer.id }}</td>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.phone }}</td>
                            <td>{{ customer.cccd }}</td>
                            <td>{{ customer.address }}</td>
                            <td> 
                                <viewer :images="[`http://localhost:3000/uploads/` + customer.images_cccd]">
                                    <img :src="`http://localhost:3000/uploads/` + customer.images_cccd" alt="" class="cccd-img">
                                </viewer>
                            </td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa" v-permission="'customer.detail'" @click="openEditModal(customer)"><font-awesome-icon
                                            icon="pen-to-square" /></button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa" v-permission="'customer.delete'" @click="deleteCutomer(customer.id)"><font-awesome-icon
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
                    <button class="page-btn" v-for="page in pageNumbers" 
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
    <div class="pm-modal-overlay" v-if="showEditCustomer">
        <EditCustomer @close="closeEditModal" />
    </div>
</template>