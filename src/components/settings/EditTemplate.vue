<script setup>
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'

const settingsStore = useSettingsStore()
const { editTemplate } = storeToRefs(settingsStore)
const { closeEditTemplateModal, handleFileUploadEdit, updateTemplate } = settingsStore
</script>

<template>
      <div class="modal-box">
        <div class="modal-header">
          <h2>Cập nhật mẫu hợp đồng {{ editTemplate.name_file }}</h2>
          <button class="modal-close" @click="closeEditTemplateModal">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <form @submit.prevent="updateTemplate">
            <div class="modal-body">
            <div class="form-group">
                <label class="form-label">Tên mẫu</label>
                <input type="text" id="editTemplate" class="form-input" v-model="editTemplate.name_file" placeholder="Nhập tên mẫu hợp đồng" >
            </div>
            <div class="form-group">
                <label class="form-label">Loại hợp đồng</label>
                <select class="form-input" v-model="editTemplate.type" required>
                    <option value="hop_dong_cam_do">Cầm Đồ</option>
                    <option value="hop_dong_tin_chap">Tín Chấp</option>
                    <option value="hop_dong_tra_gop">Trả Góp</option>
                    <option value="phieu_thu">Phiếu Thu</option>
                    <option value="bien_nhan">Biên Nhận</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <div class="toggle-row no-border">
                <span class="toggle-label">Đang sử dụng</span>
                <label class="switch">
                    <input type="checkbox" v-model="editTemplate.active">
                    <span class="slider"></span>
                </label>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">File mẫu hiện tại</label>
                <div class="current-file-badge">
                    <font-awesome-icon icon="fa-solid fa-file-word" />
                    <span>{{ editTemplate.file_path?.split('/').pop() || 'Chưa có file' }}</span>
                </div>
                <label class="form-label" style="margin-top: 10px;">Thay file mới (tuỳ chọn)</label>
                <input type="file" class="form-input" @change="handleFileUploadEdit" accept=".doc,.docx">
            </div>

            </div>
            <div class="modal-footer">
            <button class="btn-cancel" @click="closeEditTemplateModal">Hủy</button>
            <button class="btn-save" type="submit">
                <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Lưu
            </button>
            </div>
        </form>
      </div>
</template>

<style scoped>
@import "../../assets/setting.css";

.current-file-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f0faf8;
    border: 1px solid #1a7a6e40;
    border-radius: 8px;
    color: #1a7a6e;
    font-size: 0.875rem;
    font-weight: 500;
}
</style>