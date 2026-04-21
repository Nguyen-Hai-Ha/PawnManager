<script setup>
import { useCustomerStore } from '@/stores/customer';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const store = useCustomerStore();
const { form, relative } = storeToRefs(store);
const { closeModal, handleImageChange, removeImage, 
        submitForm, addRelative, removeRelative } = store;

const maxBirthday = computed(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    return date.toISOString().split('T')[0];
});

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
                            <input type="text" id="phone" v-model="form.phone" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="cccd">CCCD</label>
                            <input type="text" id="cccd" v-model="form.cccd" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" v-model="form.email" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="address">Địa chỉ</label>
                            <input type="text" id="address" v-model="form.address" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="birthday">Ngày sinh</label>
                            <input type="date" id="birthday" v-model="form.birth_date" :max="maxBirthday" required>
                        </div>
                        
                    </div>
                    
                    <div class="form-row">
                        <div class="pm-form-group">
                            <label for="images_cccd">Hình ảnh CCCD mặt trước</label>
                            <input type="file" id="images_cccd" @change="handleImageChange" required>
                        </div>
                        <div class="pm-form-group">
                            <label for="images_cccd_back">Hình ảnh CCCD mặt sau</label>
                            <input type="file" id="images_cccd_back" @change="handleImageChange" required>
                        </div>
                        <div class="pm-form-group">
                            <div class="image-previews" style="display: flex; gap: 10px;">
                                <div class="image-preview" v-if="form.imagePreview">
                                    <p class="small">Mặt trước</p>
                                    <img :src="form.imagePreview" alt="Preview Front"
                                        style="width: 100px; height: 100px; object-fit: cover;">
                                </div>
                                <div class="image-preview" v-if="form.imagePreviewBack">
                                    <p class="small">Mặt sau</p>
                                    <img :src="form.imagePreviewBack" alt="Preview Back"
                                        style="width: 100px; height: 100px; object-fit: cover;">
                                </div>
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
                                <input type="text" id="relative_name" v-model="item.name" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="relative_phone">Số điện thoại</label>
                                <input type="text" id="relative_phone" v-model="item.phone" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="pm-form-group">
                                <label for="relative_cccd">CCCD</label>
                                <input type="text" id="relative_cccd" v-model="item.cccd" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="relative_address">Địa chỉ</label>
                                <input type="text" id="relative_address" v-model="item.address" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="pm-form-group">
                                <label for="relative_job">Nghề nghiệp</label>
                                <input type="text" id="relative_job" v-model="item.job" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="relative_workplace">Nơi làm việc</label>
                                <input type="text" id="relative_workplace" v-model="item.workplace" required>
                            </div>
                        </div>
                    </div>
                    <div class="pm-modal-footer">
                        <button class="btn-submit" @click="addRelative">Thêm người thân </button>
                        <button type="submit" class="btn-submit" v-permission="'customer.create'">Thêm</button>
                        <button type="button" class="btn-cancel" @click="closeModal">Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>