<script setup>
import { useStaffStore } from '@/stores/staff';
import { storeToRefs } from 'pinia';
const staffStore = useStaffStore();
const { newStaff, role } = storeToRefs(staffStore);
const { closeAddStaffModal, submitAddStaff } = staffStore;

</script>

<template>
    <div class="modal-add-staff">
        <div class="modal-content-add-staff">
            <div class="modal-add-staff-header">
                <h3>Thêm nhân viên</h3>
                <button class="pm-modal-close" @click="closeAddStaffModal">&times;</button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="submitAddStaff">
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="name">Tên nhân viên</label>
                            <input type="text" id="name" v-model="newStaff.name" required>
                        </div>
                    </div>
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="email">Email đăng nhập</label>
                            <input type="email" id="email" v-model="newStaff.email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Mật khẩu</label>
                            <input type="password" id="password" v-model="newStaff.password" required>
                        </div>
                    </div>
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="phone">Số điện thoại</label>
                            <input type="text" id="phone" v-model="newStaff.phone"  required>
                        </div>
                        <div class="form-group">
                            <label for="address">Địa chỉ</label>
                            <input type="text" id="address" v-model="newStaff.address" required>
                        </div>
                    </div>
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="cccd">CCCD</label>
                            <input type="text" id="cccd" v-model="newStaff.cccd" required>
                        </div>
                        <div class="form-group">
                            <label for="id_role">Quyền</label>
                            <select id="id_role" v-model="newStaff.id_role" required>
                                <option value="">Chọn quyền</option>
                                <option v-for="item in role" :key="item.id" :value="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer-add-staff">
                        <button type="submit" class="btn-submit">Thêm</button>
                        <button type="button" class="btn-cancel" @click="closeAddStaffModal">Hủy</button>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>

</template>