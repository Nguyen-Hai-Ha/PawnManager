<script setup>
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';

const store = useCustomerStore();
const { form } = storeToRefs(store);
const { closeModal, handleImageChange, removeImage, submitForm } = store;

</script>
<template>
    <div class="pm-modal">
        <div class="pm-modal-content">
            <div class="pm-modal-header">
                <h2 class="pm-modal-title">Thêm khách hàng</h2>
                <button class="pm-modal-close" @click="closeModal">&times;</button>
            </div>
            <div class="pm-modal-body">
                <form @submit.prevent="submitForm">
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="name">Họ và tên</label>
                            <input type="text" id="name" v-model="form.name" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="phone">Số điện thoại</label>
                            <input type="number" id="phone" v-model="form.phone" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="cccd">CCCD</label>
                            <input type="text" id="cccd" v-model="form.cccd" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="birthday">Ngày sinh</label>
                            <input type="date" id="birthday" v-model="form.birth_date" required>
                        </div>
                    </div>
                    <div class="pm-form-group">
                        <label for="address">Địa chỉ</label>
                        <input type="text" id="address" v-model="form.address" required>
                    </div>
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="images_cccd">Hình ảnh CCCD</label>
                            <input type="file" id="images_cccd" @change="handleImageChange" required>
                        </div>
                        <div class="pm-form-group">
                            <div class="image-preview" v-if="form.imagePreview">
                                <img :src="form.imagePreview" alt="Preview"
                                    style="width: 100px; height: 100px; object-fit: cover;">
                                <button type="button" class="remove-image btn-action text-danger" data-tooltip="Xóa"
                                    @click="removeImage"><font-awesome-icon icon="circle-xmark" /></button>
                            </div>
                        </div>
                    </div>
                    <div class="pm-modal-footer">
                        <button type="submit" class="btn-submit">Thêm</button>
                        <button type="button" class="btn-cancel" @click="closeModal">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>