<template>
    <Teleport to="body">
        <div v-if="showNotification" class="update-notification" :class="notificationClass">
            <!-- Checking -->
            <div v-if="updateStatus === 'checking'" class="update-content">
                <div class="update-icon spinning">
                    <FontAwesomeIcon :icon="['fas', 'sync']" />
                </div>
                <div class="update-text">
                    <span class="update-title">Đang kiểm tra cập nhật...</span>
                </div>
            </div>

            <!-- Update Available -->
            <div v-else-if="updateStatus === 'available'" class="update-content">
                <div class="update-icon">
                    <FontAwesomeIcon :icon="['fas', 'download']" />
                </div>
                <div class="update-text">
                    <span class="update-title">Có bản cập nhật mới!</span>
                    <span class="update-version">Phiên bản {{ newVersion }}</span>
                </div>
                <div class="update-actions">
                    <button class="btn-update" @click="downloadUpdate">
                        <FontAwesomeIcon :icon="['fas', 'download']" />
                        Tải xuống
                    </button>
                    <button class="btn-dismiss" @click="dismiss">Để sau</button>
                </div>
            </div>

            <!-- Downloading -->
            <div v-else-if="updateStatus === 'downloading'" class="update-content">
                <div class="update-icon spinning">
                    <FontAwesomeIcon :icon="['fas', 'spinner']" />
                </div>
                <div class="update-text">
                    <span class="update-title">Đang tải cập nhật...</span>
                    <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: downloadPercent + '%' }"></div>
                    </div>
                    <span class="update-percent">{{ downloadPercent.toFixed(1) }}%</span>
                </div>
            </div>

            <!-- Downloaded -->
            <div v-else-if="updateStatus === 'downloaded'" class="update-content">
                <div class="update-icon success">
                    <FontAwesomeIcon :icon="['fas', 'check-circle']" />
                </div>
                <div class="update-text">
                    <span class="update-title">Cập nhật đã sẵn sàng!</span>
                    <span class="update-version">Khởi động lại để cài đặt v{{ newVersion }}</span>
                </div>
                <div class="update-actions">
                    <button class="btn-install" @click="installUpdate">
                        <FontAwesomeIcon :icon="['fas', 'power-off']" />
                        Khởi động lại ngay
                    </button>
                    <button class="btn-dismiss" @click="dismiss">Để sau</button>
                </div>
            </div>

            <!-- Error -->
            <div v-else-if="updateStatus === 'error'" class="update-content">
                <div class="update-icon error">
                    <FontAwesomeIcon :icon="['fas', 'exclamation-triangle']" />
                </div>
                <div class="update-text">
                    <span class="update-title">Lỗi cập nhật</span>
                    <span class="update-error">{{ errorMessage }}</span>
                </div>
                <button class="btn-dismiss" @click="dismiss">Đóng</button>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const updateStatus = ref(null) // null, 'checking', 'available', 'downloading', 'downloaded', 'error'
const newVersion = ref('')
const downloadPercent = ref(0)
const errorMessage = ref('')
const dismissed = ref(false)
const appVersion = ref('')

let cleanupListener = null

const showNotification = computed(() => {
    if (dismissed.value) return false
    return ['checking', 'available', 'downloading', 'downloaded', 'error'].includes(updateStatus.value)
})

const notificationClass = computed(() => {
    return {
        'notification-success': updateStatus.value === 'downloaded',
        'notification-error': updateStatus.value === 'error',
        'notification-downloading': updateStatus.value === 'downloading'
    }
})

const downloadUpdate = () => {
    if (window.electronAPI?.downloadUpdate) {
        window.electronAPI.downloadUpdate()
    }
}

const installUpdate = () => {
    if (window.electronAPI?.installUpdate) {
        window.electronAPI.installUpdate()
    }
}

const dismiss = () => {
    dismissed.value = true
    // Reset after some time so next update will show
    if (updateStatus.value !== 'downloaded') {
        setTimeout(() => {
            updateStatus.value = null
            dismissed.value = false
        }, 60000) // Show again after 1 minute
    }
}

onMounted(async () => {
    // Only run in Electron environment
    if (!window.electronAPI) return

    // Get current app version
    if (window.electronAPI.getAppVersion) {
        appVersion.value = await window.electronAPI.getAppVersion()
    }

    // Listen for update events
    if (window.electronAPI.onUpdateStatus) {
        cleanupListener = window.electronAPI.onUpdateStatus((data) => {
            dismissed.value = false // Reset dismissed when new status arrives

            switch (data.status) {
                case 'checking':
                    updateStatus.value = 'checking'
                    break
                case 'available':
                    updateStatus.value = 'available'
                    newVersion.value = data.version
                    break
                case 'not-available':
                    updateStatus.value = null
                    break
                case 'downloading':
                    updateStatus.value = 'downloading'
                    downloadPercent.value = data.percent || 0
                    break
                case 'downloaded':
                    updateStatus.value = 'downloaded'
                    newVersion.value = data.version
                    break
                case 'error':
                    updateStatus.value = 'error'
                    errorMessage.value = data.message || 'Không thể kiểm tra cập nhật'
                    break
            }
        })
    }
})

onUnmounted(() => {
    if (cleanupListener) {
        cleanupListener()
    }
})
</script>

<style scoped>
.update-notification {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
    z-index: 10000;
    min-width: 320px;
    max-width: 420px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification-success {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    box-shadow: 0 10px 40px rgba(17, 153, 142, 0.4);
}

.notification-error {
    background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%);
    box-shadow: 0 10px 40px rgba(235, 51, 73, 0.4);
}

.update-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
}

.update-icon {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.update-icon.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.update-icon.success {
    background: rgba(255, 255, 255, 0.3);
}

.update-icon.error {
    background: rgba(255, 255, 255, 0.2);
}

.update-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.update-title {
    font-weight: 600;
    font-size: 14px;
}

.update-version,
.update-error {
    font-size: 12px;
    opacity: 0.9;
}

.update-percent {
    font-size: 11px;
    opacity: 0.8;
}

.progress-bar {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 4px;
}

.progress-fill {
    height: 100%;
    background: white;
    border-radius: 3px;
    transition: width 0.3s ease;
}

.update-actions {
    display: flex;
    gap: 8px;
    width: 100%;
    margin-top: 8px;
}

.btn-update,
.btn-install {
    flex: 1;
    padding: 10px 16px;
    background: white;
    color: #667eea;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s ease;
}

.btn-update:hover,
.btn-install:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-install {
    color: #11998e;
}

.btn-dismiss {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-dismiss:hover {
    background: rgba(255, 255, 255, 0.3);
}
</style>
