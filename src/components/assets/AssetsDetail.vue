<script setup>
import { storeToRefs } from 'pinia';
import { useAssetsStore } from '@/stores/assets';
const assetsStore = useAssetsStore();
const { assetDetail, parseMetadata, parseImages } = storeToRefs(assetsStore);
const props = defineProps({
    asset: {
        type: Object,
        required: true,
        default: () => ({
            code: 'SH01_20261802',
            name: 'SH 125i',
            customer_name: 'Nguyễn Văn C',
            type_name: 'Xe máy',
            description: 'Trắng',
            note: '',
            license_plate: '36A1-04953',
            chassis_number: 'IUHANX478612VGE',
            engine_number: 'BSUWFDBF46781',
            status: 'Đang cầm',
            images: []
        })
    }
});

const emit = defineEmits(['close']);
</script>

<template>
    <div class="assets-detail">
        <div class="modal-header">
            <div class="title-section">
                <h2>Tài sản {{ assetDetail.code }}</h2>
                <span class="status-badge">{{ assetDetail.status }}</span>
            </div>
            <button class="close-icon" @click="emit('close')">&times;</button>
        </div>

        <div class="modal-body">
            <div class="form-grid">
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
                    <div class="read-only-field">{{ assetDetail.name }}</div>
                </div>
                <div class="form-group">
                    <label>Khách hàng</label>
                    <div class="read-only-field">{{ assetDetail.customer_name }}</div>
                </div>
                <div class="form-group" v-for="(value, key) in parseMetadata" :key="key">
                    <label>{{ key }}</label>
                    <div class="read-only-field">{{ value }}</div>
                </div>
            </div>

            <div class="image-section">
                <p class="section-title">Hình ảnh:</p>
                <div class="image-list">
                    <div v-for="(img, index) in parseImages" :key="index" class="image-wrapper">
                        <img :src="`http://localhost:3000/${img.url}`" :alt="'Ảnh ' + (index + 1)">
                    </div>
                </div>
            </div>
        </div>

        <div class="modal-footer">
            <button class="cancel-btn" >Đóng</button>
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
    color: #000;
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
}

.image-wrapper, .placeholder-box {
    width: 130px;
    height: 130px;
    border-radius: 4px;
    background-color: #f5f5f5;
    overflow: hidden;
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
.confirm-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px
}

.cancel-btn {
    background-color: #ccc;
}
</style>
