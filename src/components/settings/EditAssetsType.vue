<script setup>
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { editCollateralType } = storeToRefs(settingsStore)
const { closeEditCategoryModal, updateCollateralType } = settingsStore
</script>


<template>
    <div>
        <div class="modal-box">
        <div class="modal-header">
          <h2>Cập nhật danh mục tài sản</h2>
          <button class="modal-close" @click="closeEditCategoryModal">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <form @submit.prevent="updateCollateralType">
            <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Tên danh mục</label>
                <input type="text" class="form-input" id="editCollateralType" placeholder="VD: Điện thoại, Xe máy..." v-model="editCollateralType.name" required>
            </div>
            </div>
            <div class="modal-footer">
            <button class="btn-cancel" @click="closeEditCategoryModal">Hủy</button>
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