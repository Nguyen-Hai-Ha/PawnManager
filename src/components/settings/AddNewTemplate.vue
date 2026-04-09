<script setup>
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { newTemplate, fileInput } = storeToRefs(settingsStore)
const { closeAddTemplateModal, handleFileUpload, createTemplate } = settingsStore
</script>

<template>
      <div class="modal-box">
        <div class="modal-header">
          <h2>Thêm mẫu hợp đồng mới</h2>
          <button class="modal-close" @click="closeAddTemplateModal">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <form @submit.prevent="createTemplate()">
            <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Tên mẫu</label>
                <input type="text" class="form-input" v-model="newTemplate.name_file" placeholder="Nhập tên mẫu hợp đồng" >
            </div>
            <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <div class="toggle-row no-border">
                <span class="toggle-label">Đang sử dụng</span>
                <label class="switch">
                    <input type="checkbox" v-model="newTemplate.active">
                    <span class="slider"></span>
                </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">File mẫu</label>
                <input type="file" class="form-input" ref="fileInput" @change="handleFileUpload" placeholder="Nhập tên mẫu hợp đồng" >
            </div>

            </div>
            <div class="modal-footer">
            <button class="btn-cancel" @click="closeAddTemplateModal">Hủy</button>
            <button class="btn-save" type="submit">
                <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Lưu
            </button>
            </div>
        </form>
      </div>
</template>

<style scoped>
@import "../../assets/setting.css";
</style>