<script setup>
import { useDetailContractStore } from '@/stores/contract/detailContract'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'

const detailContractStore = useDetailContractStore()
const { templates } = storeToRefs(detailContractStore)
const { getAllTemplates, closeSelectTemplate, SelectTemplate } = detailContractStore

onMounted(() => {
    getAllTemplates();
})

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa cập nhật';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="modal-overlay">
    <div class="template-selector modal-box">
      <div class="modal-header selector-header">
        <div class="header-content">
            <div class="header-icon">
            <font-awesome-icon icon="file-contract" />
            </div>
            <div class="header-text">
            <h2>Chọn mẫu hợp đồng</h2>
            <p>Chọn một mẫu để thực hiện in hợp đồng</p>
            </div>
        </div>
        <button class="modal-close" @click="closeSelectTemplate()">
          <font-awesome-icon icon="times" />
        </button>
      </div>

      <div class="modal-body">
        <div v-if="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Đang tải danh sách mẫu...</p>
        </div>

        <div v-else-if="templates.length === 0" class="empty-state">
            <font-awesome-icon icon="file-circle-exclamation" class="empty-icon" />
            <p>Không tìm thấy mẫu hợp đồng nào khả dụng.</p>
            <small>Vui lòng kiểm tra lại cài đặt mẫu trong hệ thống.</small>
        </div>

        <div v-else class="template-list custom-scrollbar">
            <div 
            v-for="template in templates" 
            :key="template.id"
            class="template-item"
            @click="SelectTemplate(template.id)"
            >
            <div class="item-icon">
                <font-awesome-icon icon="file-word" />
            </div>
            <div class="item-info">
                <h4 class="template-name">{{ template.name_file }}</h4>
                <div class="item-meta">
                <span class="meta-date">
                    <font-awesome-icon icon="calendar-alt" /> {{ formatDate(template.created_at) }}
                </span>
                <span v-if="template.active === 'true' || template.active === 1" class="status-badge active-badge">
                    Đang dùng
                </span>
                </div>
            </div>
            <div class="item-action">
                <button class="btn-select">Chọn <font-awesome-icon icon="chevron-right" /></button>
            </div>
            </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-cancel" @click="closeSelectTemplate()">Hủy</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Reset css từ modal có sẵn trong file setting/detail nhưng được tách ra dùng chung nếu cần */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
}

.selector-header {
  background:#1a7a6e ;
  color: white;
  border-bottom: none;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.header-icon {
  font-size: 24px;
  opacity: 0.9;
  background: rgba(255, 255, 255, 0.2);
  padding: 10px;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.header-text p {
  margin: 4px 0 0;
  font-size: 13px;
  opacity: 0.8;
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.2s;
}

.modal-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  flex-grow: 1;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  background: #fafafa;
}

.btn-cancel {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

/* Các item bên trong */
.template-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e0e6ed;
  margin-bottom: 12px;
  background: #ffffff;
}

.template-item:hover {
  background: #f0f7f6;
  border-color: #1a7a6e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 122, 110, 0.08);
}

.item-icon {
  width: 44px;
  height: 44px;
  background: #e6f2f1;
  color: #1a7a6e;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 20px;
  margin-right: 15px;
}

.item-info {
  flex-grow: 1;
}

.template-name {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-date {
  font-size: 12px;
  color: #7f8c8d;
}

.status-badge {
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 20px;
  font-weight: 600;
}

.active-badge {
  background: #e8f5e9;
  color: #2e7d32;
}

.btn-select {
  background: transparent;
  border: 1px solid #1a7a6e;
  color: #1a7a6e;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.template-item:hover .btn-select {
  background: #1a7a6e;
  color: white;
}

.empty-state {
  padding: 40px 20px;
  text-align: center;
  color: #95a5a6;
}

.empty-icon {
    font-size: 40px;
    margin-bottom: 15px;
    color: #cbd5e1;
}

.loading-state {
  padding: 40px 20px;
  text-align: center;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1a7a6e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
