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
                        <tr>
                            <td>1</td>
                            <td>Nguyễn Văn A</td>
                            <td>0123456789</td>
                            <td>012345678911</td>
                            <td>Thanh Hóa,...</td>
                            <td><img src="@/assets/images/604541102_851721887617478_7372388113818936334_n.jpg" alt=""
                                    class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa"><font-awesome-icon
                                            icon="pen-to-square" /></button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Nguyễn Văn B</td>
                            <td>0987654321</td>
                            <td>0123456789</td>
                            <td>Hồ Chí Minh</td>
                            <td><img src="@/assets/images/604541102_851721887617478_7372388113818936334_n.jpg" alt=""
                                    class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa"><font-awesome-icon
                                            icon="pen-to-square" /></button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Nguyễn Văn C</td>
                            <td>0123456789</td>
                            <td>012345678911</td>
                            <td>Thanh Hóa,...</td>
                            <td><img src="@/assets/images/604541102_851721887617478_7372388113818936334_n.jpg" alt=""
                                    class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa"><font-awesome-icon
                                            icon="pen-to-square" /></button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td>Nguyễn Văn D</td>
                            <td>0987654321</td>
                            <td>0123456789</td>
                            <td>Hồ Chí Minh</td>
                            <td><img src="@/assets/images/604541102_851721887617478_7372388113818936334_n.jpg" alt=""
                                    class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning" data-tooltip="Chỉnh sửa"><font-awesome-icon
                                            icon="pen-to-square" /></button>
                                    <button class="btn-action text-danger" data-tooltip="Xóa"><font-awesome-icon
                                            icon="circle-xmark" /></button>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>Nguyễn Văn A</td>
                            <td>0123456789</td>
                            <td>012345678911</td>
                            <td>Thanh Hóa,...</td>
                            <td><img src="@/assets/images/604541102_851721887617478_7372388113818936334_n.jpg" alt=""
                                    class="cccd-img"></td>
                            <td>
                                <div class="action-cell">
                                    <button class="btn-action text-warning yellow-600" data-tooltip="Chỉnh sửa"><font-awesome-icon
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
    <AddCustomer />
</template>

<script setup>
import AddCustomer from '@/components/AddCustomer.vue';
import { ref, onMounted } from 'vue';
import apiClient from '@/plugins/axios';

const customers = ref([]);
const showAddCustomer = ref(false);

const fetchcustomer = async () => {
    const respone = await apiClient.get('/customer');
    customers.value = await respone.data;
    console.log(customers.value);
}

onMounted(() => {
    fetchcustomer();
})
</script>

<style scoped>
@import '@/assets/main.css';
</style>