<script setup>
import { useStaffStore } from '@/stores/staff';
import { storeToRefs } from 'pinia';
const staffStore = useStaffStore();
const { editStaff, role, editPassword } = storeToRefs(staffStore);
const { closeEditStaffModal, submitEditStaff } = staffStore;

</script>

<template>
    <div class="modal-add-staff">
        <div class="modal-content-add-staff">
            <div class="modal-add-staff-header">
                <h3>Sửa thông tin nhân viên</h3>
                <button class="pm-modal-close" @click="closeEditStaffModal">&times;</button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="submitEditStaff">
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="name">Tên nhân viên</label>
                            <input type="text" id="name" v-model="editStaff.name" required>
                        </div>
                    </div>
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="email">Email đăng nhập</label>
                            <input type="email" id="email" v-model="editStaff.email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Mật khẩu</label>
                            <input type="password" id="password" v-model="editPassword" placeholder="Thay đổi mật khẩu, Hãy nhập vào">
                        </div>
                    </div>
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="phone">Số điện thoại</label>
                            <input type="text" id="phone" v-model="editStaff.phone"  required>
                        </div>
                        <div class="form-group">
                            <label for="address">Địa chỉ</label>
                            <input type="text" id="address" v-model="editStaff.address" required>
                        </div>
                    </div>
                    <div class="form-row-add-staff">
                        <div class="form-group">
                            <label for="cccd">CCCD</label>
                            <input type="text" id="cccd" v-model="editStaff.cccd" required>
                        </div>
                        <div class="form-group">
                            <label for="id_role">Quyền</label>
                            <select id="id_role" v-model="editStaff.id_role" required>
                                <option v-for="item in role" :key="item.id" :value="item.id">{{ item.name }}</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer-add-staff">
                        <button type="submit" class="btn-submit" v-permission="'staff.update'">Lưu</button>
                        <button type="button" class="btn-cancel" @click="closeEditStaffModal">Hủy</button>
                    </div>
                    
                </form>
            </div>
        </div>
    </div>

</template>