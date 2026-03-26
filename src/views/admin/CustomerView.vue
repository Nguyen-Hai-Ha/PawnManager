<template>
    <div class="customer">
        <div class="group-function">
            <div class="search">
                <input type="text" placeholder="Tìm kiếm theo tên, SĐT">
            </div>
            <div class="button-group">
                <button v-permission="'customer.create'">Thêm khách hàng</button>
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
                        <tr v-for="customer in customers" :key="customer.id">
                            <td>{{ customer.id }}</td>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.phone }}</td>
                            <td>{{ customer.cccd }}</td>
                            <td>{{ customer.address }}</td>
                            <td><img :src="getImageUrl(customer.images_cccd)" alt="" class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa"><font-awesome-icon
                                            icon="pen-to-square" /></button>
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
    <AddCustomer v-if="showAddCustomer" @close="showAddCustomer = false" />
</template>

<script setup>
import AddCustomer from '@/components/AddCustomer.vue';
import { onMounted } from 'vue';
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';

const store = useCustomerStore();

const { customers, showAddCustomer } = storeToRefs(store);

const { fetchcustomer } = store;

const getImageUrl = (name) => {
    if (!name) return '';
    return new URL(`../../assets/images/${name}`, import.meta.url).href;
};

onMounted(async () => {
    const promise = [];
    if (customers.value.length === 0) {
        promise.push(fetchcustomer());
    }
    await Promise.all(promise);
})
</script>

<style scoped>
@import '@/assets/main.css';
</style>