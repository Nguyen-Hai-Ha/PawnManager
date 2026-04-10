<script setup>
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { newCollateralType } = storeToRefs(settingsStore)
const { createCollateralType, closeAddCategoryModal } = settingsStore
</script>

<template>
    <div class="">
    <div class="modal-box">
        <div class="modal-header">
          <h2>Thêm danh mục tài sản</h2>
          <button class="modal-close" @click="closeAddCategoryModal">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <form @submit.prevent="createCollateralType">
            <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Tên danh mục</label>
                <input type="text" class="form-input" id="addCollateralType" placeholder="VD: Điện thoại, Xe máy..." v-model="newCollateralType.name" required>
            </div>
            </div>
            <div class="modal-footer">
            <button class="btn-cancel" @click="closeAddCategoryModal">Hủy</button>
            <button class="btn-save" type="submit">
                <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Lưu
            </button>
            </div>
        </form>
    </div>
    </div>
</template>

<style scoped>
@import "../../assets/setting.css";
</style>