<script setup>
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';

const store = useCustomerStore();
const { Editform, relative } = storeToRefs(store);
const { closeEditModal, handleImageChange, removeImage, 
        addRelative, removeRelative, updateCustomer } = store;

</script>
<template>
    <div class="pm-modal">
        <div class="pm-modal-content">
            <div class="pm-modal-header">
                <h2 class="pm-modal-title">Sửa thông tin khách hàng</h2>
                
                <button class="pm-modal-close" @click="closeEditModal">&times;</button>
            </div>
            <div class="pm-modal-body">
                <form @submit.prevent="updateCustomer">
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="name">Họ và tên</label>
                            <input type="text" id="edit-name" v-model="Editform.name" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="phone">Số điện thoại</label>
                            <input type="text" id="edit-phone" v-model="Editform.phone" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="cccd">CCCD</label>
                            <input type="text" id="edit-cccd" v-model="Editform.cccd" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="birthday">Ngày sinh</label>
                            <input type="date" id="edit-birthday" v-model="Editform.birth_date" required>
                        </div>
                    </div>
                    <div class="pm-form-group">
                        <label for="address">Địa chỉ</label>
                        <input type="text" id="edit-address" v-model="Editform.address" required>
                    </div>
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="images_cccd">Hình ảnh CCCD</label>
                            <input type="file" id="edit-images_cccd" @change="handleImageChange">
                        </div>
                        <div class="pm-form-group">
                            <div class="image-preview" v-if="Editform.imagePreview">
                                <img :src="Editform.imagePreview" alt="Preview"
                                    style="width: 100px; height: 100px; object-fit: cover;">
                                <button type="button" class="remove-image btn-action text-danger" data-tooltip="Xóa"
                                    @click="removeImage"><font-awesome-icon icon="circle-xmark" /></button>
                            </div>
                            <div class="image-preview" v-else-if="Editform.images_cccd">
                                <img :src="`http://localhost:3000/uploads/` + Editform.images_cccd" alt="Preview"
                                    style="width: 100px; height: 100px; object-fit: cover;">
                                <button type="button" class="remove-image btn-action text-danger" data-tooltip="Xóa"
                                    @click="removeImage"><font-awesome-icon icon="circle-xmark" /></button>
                            </div>
                        </div>
                    </div>
                    <div class="relative-info" v-for="(item, index) in relative" :key="index">
                        <div class="pm-form-group">
                            <span class="text-dark fw-bold ">Người thân {{ index + 1 }}  <span class="text-danger" style="cursor: pointer;" @click="removeRelative(index)">Xóa</span> </span>
                            
                        </div>
                        <div class="form-row">
                            <div class="pm-form-group">
                                <label for="relative_name">Họ và tên</label>
                                <input type="text" id="edit-relative_name" v-model="item.name" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="relative_phone">Số điện thoại</label>
                                <input type="text" id="edit-relative_phone" v-model="item.phone" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="pm-form-group">
                                <label for="relative_cccd">CCCD</label>
                                <input type="text" id="edit-relative_cccd" v-model="item.cccd" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="relative_address">Địa chỉ</label>
                                <input type="text" id="edit-relative_address" v-model="item.address" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="pm-form-group">
                                <label for="relative_job">Nghề nghiệp</label>
                                <input type="text" id="edit-relative_job" v-model="item.job" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="relative_workplace">Nơi làm việc</label>
                                <input type="text" id="edit-relative_workplace" v-model="item.workplace" required>
                            </div>
                        </div>
                    </div>
                    <div class="pm-modal-footer">
                        <button class="btn-submit" @click="addRelative">Thêm người thân </button>
                        <button type="submit" class="btn-submit" v-permission="'customer.update'">Lưu</button>
                        <button type="button" class="btn-cancel" @click="closeEditModal">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>