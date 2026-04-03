<script setup>
import { storeToRefs } from 'pinia';
import { useAssetsStore } from '@/stores/assets';
const assetsStore = useAssetsStore();
const { assetDetail, parseMetadata, parseImages, fileInputRef } = storeToRefs(assetsStore);
const { closeAssetsDetailModal, triggerFileInput, handleFileChange, submitUpdateAsset } = assetsStore;
</script>

<template>
    <div class="assets-detail">
        <div class="modal-header">
            <div class="title-section">
                <h2>Tài sản {{ assetDetail.code }}</h2>
                <span class="status-badge">{{ assetDetail.status }}</span>
            </div>
            <button class="close-icon" @click="closeAssetsDetailModal">&times;</button>
        </div>

        <div class="modal-body">
            <form @submit.prevent="submitUpdateAsset">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Khách hàng</label>
                        <div class="read-only-field">{{ assetDetail.customer_name }}</div>
                    </div>
                    <div class="form-group">
                        <label>Mã tài sản</label>
                        <div class="read-only-field">{{ assetDetail.code }}</div>
                    </div>
                    <div class="form-group">
                        <label>Loại tài sản</label>
                        <div class="read-only-field">{{ assetDetail.type_name }}</div>
                    </div>
                    <div class="form-group">
                        <label>Tên tài sản</label>
                        <input type="text" v-model="assetDetail.name">
                    </div>
                    <div class="form-group" v-for="(value, key) in parseMetadata" :key="key">
                        <label>{{ key }}</label>
                        <input type="text" v-model="parseMetadata[key]">
                    </div>
                </div>

                <div class="image-section">
                    <p class="section-title">Hình ảnh:</p>
                    <div class="image-list">
                        <div v-for="(img, index) in parseImages" :key="index" class="image-wrapper">
                            <img :src="`http://localhost:3000${img.url}`" :alt="'Ảnh ' + (index + 1)">
                            <div class="image-upload-overlay d-flex align-items-center justify-content-center rounded" @click="triggerFileInput(img.id)">
                                <div class="text-white text-center">
                                    <i class="bi bi-camera-fill fs-3"></i>
                                    <div class="small fw-bold">Đổi ảnh</div>
                                </div>
                            </div>
                        </div>
                        <!-- Add new images button -->
                        <div class="image-wrapper add-image-btn" @click="triggerFileInput(null)">
                            <div class="d-flex flex-column align-items-center justify-content-center h-100">
                                <i class="bi bi-plus-circle fs-2 text-muted"></i>
                                <span class="small fw-bold text-muted mt-1">Thêm ảnh</span>
                            </div>
                        </div>
                    </div>
                    <input type="file" class="image-upload" multiple accept="image/*" hidden="true" ref="fileInputRef" @change="handleFileChange">
                </div>
                <div class="modal-footer">
                    <button type="submit" class="btn-submit" v-permission="'collateral.update'">Lưu</button>
                    <button type="button" class="cancel-btn" @click="closeAssetsDetailModal">Đóng</button>
                </div>
            </form>
        </div>

        
    </div>
</template>

<style scoped>
.assets-detail {
    background: #fff;
    width: 900px;
    max-width: 95vw;
    border-radius: 12px;
    padding: 30px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
}

.title-section {
    display: flex;
    align-items: center;
    gap: 15px;
}

.title-section h2 {
    margin: 0;
    font-size: 26px;
    font-weight: 600;
    color: #1a7a6e;
}

.status-badge {
    background-color: #c9ece8;
    color: #1a7a6e;
    padding: 2px 15px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
}

.close-icon {
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    line-height: 1;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px 25px;
    margin-bottom: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 15px;
    font-weight: 500;
    color: #000;
}

.form-group input {
    border: 1px solid #D0D0D0;
    color: #000;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 16px;
    min-height: 45px;
    display: flex;
    align-items: center;
}

.read-only-field {
    background-color: #F0F0F0;
    border: 1px solid #D0D0D0;
    color: #000;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 16px;
    min-height: 45px;
    display: flex;
    align-items: center;
}

.image-section {
    margin-top: 25px;
}

.section-title {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 15px;
    color: #000;
}

.image-list {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    padding: 10px;
    border: 1px dashed #1a7a6e;
    border-radius: 10px;
}

.image-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 8px;
    background-color: #f5f5f5;
    cursor: pointer;
    overflow: hidden;
}

.add-image-btn {
    border: 2px dashed #ccc;
    background-color: #fbfbfb;
    transition: all 0.2s;
}

.add-image-btn:hover {
    border-color: #1a7a6e;
    background-color: #f0f7f6;
}

.add-image-btn i {
    transition: color 0.2s;
}

.add-image-btn:hover i, .add-image-btn:hover span {
    color: #1a7a6e !important;
}

.image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.no-images {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.placeholder-box {
    background-color: #FAD09E; /* Example color from mockup if no image, or a generic placeholder */
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
}

.inner-placeholder {
    width: 80%;
    height: 60%;
    background-color: #C1D3E0;
    border: 1px solid #99a;
    border-radius: 4px;
    position: relative;
}

/* Custom styling for the specific placeholder image look if needed, 
   but it's better to just use a clean placeholder or color */

.modal-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 30px;
    gap: 5px;
}

.btn-close {
    background-color: #E0E0E0;
    border: none;
    color: #000;
    padding: 10px 40px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
}

.btn-close:hover {
    background-color: #D0D0D0;
}

.cancel-btn,
.btn-submit {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.cancel-btn {
    background-color: #ccc;
}

.image-upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6); /* Màn đen 60% */
  opacity: 0; /* Mặc định ẩn */
  transition: opacity 0.3s ease;
}

.image-wrapper:hover .image-upload-overlay {
  opacity: 1; /* Hiện khi hover */
}
</style>
