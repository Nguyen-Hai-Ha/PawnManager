<script setup>
import { useStaffStore } from '@/stores/staff'
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue'
import AddNewStaff from '@/components/staff/AddNewStaff.vue'

const staffStore = useStaffStore()
const { staff, showAddStaffModal, role, search, sortedStaff, sortConfig } = storeToRefs(staffStore)
const { fetchStaff, openAddStaffModal, closeAddStaffModal, fetchRole, handleSort } = staffStore

onMounted(() => {
    const promise = []
    if (staff.value.length === 0) {
        promise.push(fetchStaff())
    }
    if (role.value.length === 0) {
        promise.push(fetchRole())
    }
    Promise.all(promise)
})
</script>


<template>
    <div class="staff">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT" v-model="search">
                </div>
            </div>
            <div class="button-group">
                <button>Phân quyền nhóm</button>
                <button @click="openAddStaffModal">Thêm nhân viên</button>
            </div>
        </div>
        <div class="table-wrapper">
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th @click="handleSort('id')">STT
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'id' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'id' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th @click="handleSort('name')">Tên NV
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'name' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'name' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th @click="handleSort('email')">Email đăng nhập
                                <span class="sort-icon">
                                    <font-awesome-icon v-if="sortConfig.key === 'email' && sortConfig.direction === 'asc'" icon="sort-up" />
                                    <font-awesome-icon v-else-if="sortConfig.key === 'email' && sortConfig.direction === 'desc'" icon="sort-down" />
                                    <font-awesome-icon v-else icon="sort" />
                                </span>
                            </th>
                            <th>Số điện thoại</th>
                            <th >Quyền</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in sortedStaff" :key="item.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.name }}</td>
                            <td>{{ item.email }}</td>
                            <td>{{ item.phone }}</td>
                            <td>{{ item.role_name }}</td>
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
            <!-- <div class="pagination">
                <div class="pagination-info">
                    <span class="page-info">Trang 1/1 (2)</span>
                </div>
                <div class="pagination-controls">
                    <button class="page-btn"><font-awesome-icon icon="angles-left" /></button>
                    <button class="page-btn"><font-awesome-icon icon="angle-left" /></button>
                    <button class="page-btn">1</button>
                    <button class="page-btn"><font-awesome-icon icon="angle-right" /></button>
                    <button class="page-btn"><font-awesome-icon icon="angles-right" /></button>
                </div>
            </div> -->
        </div>
    </div>
    <div class="modal-overlay" v-if="showAddStaffModal">
        <AddNewStaff @close="closeAddStaffModal" />
    </div>

</template>

