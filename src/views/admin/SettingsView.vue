<script setup>
import { useSettingsStore } from '@/stores/settings'
import { storeToRefs } from 'pinia'
import { ref, onMounted } from 'vue'

const activeTab = ref('notifications')

const tabs = [
  { key: 'notifications', label: 'Cấu hình thông báo', icon: 'fa-solid fa-bell' },
  { key: 'contracts',     label: 'Mẫu hợp đồng',       icon: 'fa-solid fa-file-contract' },
  { key: 'categories',   label: 'Danh mục tài sản',    icon: 'fa-solid fa-tags' },
]

const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const { getSettings, updateSettings } = settingsStore

onMounted(() => {
  getSettings()
})

/* ── Notification mock state ── */
const notifSettings = ref({
  overdue:        true,
  dueToday:       true,
  newContract:    false,
  liquidation:    true,
  emailEnabled:   false,
  zaloEnabled:     true,
  reminderDays:   3,
  reminderTime:   '08:00',
})

/* ── Contract template mock state ── */
const contractTemplates = ref([
  { id: 1, name: 'Mẫu Cầm Đồ Chuẩn',  type: 'Cầm Đồ',  updatedAt: '01/04/2026', active: true  },
  { id: 2, name: 'Mẫu Tín Chấp Chuẩn', type: 'Tín Chấp', updatedAt: '28/03/2026', active: true  },
  { id: 3, name: 'Mẫu Trả Góp Chuẩn',  type: 'Trả Góp',  updatedAt: '15/03/2026', active: false },
])

const showTemplateModal = ref(false)
const editingTemplate   = ref(null)

function openAddTemplate() {
  editingTemplate.value = { id: null, name: '', type: 'Cầm Đồ', active: true }
  showTemplateModal.value = true
}
function openEditTemplate(t) {
  editingTemplate.value = { ...t }
  showTemplateModal.value = true
}
function closeTemplateModal() { showTemplateModal.value = false }

/* ── Asset category mock state ── */
const assetCategories = ref([
  { id: 1, name: 'Điện thoại',    icon: '📱', count: 42, active: true  },
  { id: 2, name: 'Trang sức',     icon: '💍', count: 28, active: true  },
  { id: 3, name: 'Xe máy',        icon: '🛵', count: 15, active: true  },
  { id: 4, name: 'Laptop / Máy tính', icon: '💻', count: 19, active: true  },
  { id: 5, name: 'Đồng hồ',       icon: '⌚', count: 11, active: false },
  { id: 6, name: 'Khác',          icon: '📦', count: 7,  active: true  },
])

const showCategoryModal = ref(false)
const editingCategory   = ref(null)

function openAddCategory() {
  editingCategory.value = { id: null, name: '', icon: '📦', active: true }
  showCategoryModal.value = true
}
function openEditCategory(c) {
  editingCategory.value = { ...c }
  showCategoryModal.value = true
}
function closeCategoryModal() { showCategoryModal.value = false }
</script>

<template>
  <div class="settings-page">

    <!-- Page Header -->
    <div class="settings-header">
      <div class="header-left">
        <div class="header-icon">
          <font-awesome-icon icon="fa-solid fa-gears" />
        </div>
        <div>
          <h1 class="header-title">Cấu Hình Hệ Thống</h1>
          <p class="header-sub">Quản lý thông báo, mẫu hợp đồng và danh mục tài sản</p>
        </div>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="settings-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab-btn"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <font-awesome-icon :icon="tab.icon" class="tab-icon" />
        {{ tab.label }}
      </button>
    </div>

    <!-- ─── TAB: Notifications ─── -->
    <div v-if="activeTab === 'notifications'" class="tab-content">
      <div class="settings-grid">

        <!-- Card: Loại thông báo -->
        <div class="setting-card">
          <div class="card-header">
            <span class="card-icon teal"><font-awesome-icon icon="fa-solid fa-bell" /></span>
            <div>
              <h2 class="card-title">Loại thông báo</h2>
              <p class="card-desc">Chọn các sự kiện muốn nhận thông báo</p>
            </div>
          </div>
          <div class="toggle-list">
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Hợp đồng quá hạn</span>
                <span class="toggle-desc">Thông báo khi hợp đồng không được thanh toán đúng hạn</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.overdue">
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Đến hạn hôm nay</span>
                <span class="toggle-desc">Nhắc nhở các hợp đồng đến kỳ thu lãi trong ngày</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.dueToday">
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Hợp đồng mới</span>
                <span class="toggle-desc">Thông báo khi có hợp đồng mới được tạo</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.newContract">
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">Thanh lý tài sản</span>
                <span class="toggle-desc">Thông báo thanh lý tài sản đến hợp đồng quá hạn</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.liquidation">
                <span class="slider"></span>
              </label>
            </div>
            <div class="toggle-list">
            <div class="toggle-row">
              <div class="toggle-info">
                <span class="toggle-label">📧 Email</span>
                <span class="toggle-desc">Gửi thông báo qua email</span>
              </div>
              <label class="switch">
                <input type="checkbox" v-model="settings.emailEnabled">
                <span class="slider"></span>
              </label>
            </div>
          </div>
          </div>
        </div>

        <!-- Card: Kênh thông báo -->
        <div class="setting-card">
          <div class="card-header">
            <span class="card-icon orange"><font-awesome-icon icon="fa-solid fa-paper-plane" /></span>
            <div>
              <h2 class="card-title">Kênh thông báo</h2>
              <p class="card-desc">Cấu hình phương thức gửi thông báo</p>
            </div>
          </div>
          <div class="form-section">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nhắc trước (ngày)</label>
                <input type="number" class="form-input" v-model="settings.reminderDays" min="1" max="30">
              </div>
              <div class="form-group">
                <label class="form-label">Giờ gửi nhắc</label>
                <input type="time" class="form-input" v-model="settings.reminderTime">
              </div>
            </div>
          </div>
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">Email (Dùng để gửi thông báo)</label>
              <input type="email" class="form-input" v-model="settings.email_sender" placeholder="Chưa có mail">
            </div>
            <div class="form-group" style="margin-top: 10px;">
              <label class="form-label">Mật khẩu ứng dụng (App Password)</label>
              <input type="password" class="form-input" v-model="settings.email_password" placeholder="*** **** **** ****">
              <p class="toggle-desc">Mật khẩu gồm 16 ký tự tạo từ phần bảo mật tài khoản Google.</p>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn-save" @click="updateSettings(settings)">
              <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Lưu cài đặt
            </button>
          </div>
        </div>

        <!-- Card: Xem trước thông báo -->
        <div class="setting-card preview-card">
          <div class="card-header">
            <span class="card-icon purple"><font-awesome-icon icon="fa-solid fa-eye" /></span>
            <div>
              <h2 class="card-title">Xem trước thông báo</h2>
              <p class="card-desc">Ví dụ thông báo sẽ được gửi đến khách hàng</p>
            </div>
          </div>
          <div class="notif-preview-list">
            <div class="notif-preview overdue">
              <span class="notif-dot"></span>
              <div>
                <p class="notif-title">⚠️ Hợp đồng quá hạn</p>
                <p class="notif-body">Hợp đồng <strong>#HD001</strong> của KH Nguyễn Văn A đã quá hạn 3 ngày. Vui lòng liên hệ thu hồi.</p>
                <p class="notif-time">Hôm nay lúc 08:00</p>
              </div>
            </div>
            <div class="notif-preview due">
              <span class="notif-dot"></span>
              <div>
                <p class="notif-title">🔔 Đến hạn hôm nay</p>
                <p class="notif-body">Có <strong>5 hợp đồng</strong> đến kỳ thu lãi hôm nay. Tổng dự thu: <strong>2.500.000 đ</strong></p>
                <p class="notif-time">Hôm nay lúc 08:00</p>
              </div>
            </div>
            <div class="notif-preview new">
              <span class="notif-dot"></span>
              <div>
                <p class="notif-title">✅ Hợp đồng mới</p>
                <p class="notif-body">Hợp đồng <strong>#HD042</strong> vừa được tạo bởi NV Trần Thị B. Số tiền vay: <strong>5.000.000 đ</strong></p>
                <p class="notif-time">Hôm nay lúc 09:15</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ─── TAB: Contract Templates ─── -->
    <div v-if="activeTab === 'contracts'" class="tab-content">
      <div class="section-toolbar">
        <div class="toolbar-left">
          <h2 class="section-title">Danh sách mẫu hợp đồng</h2>
          <span class="count-badge">{{ contractTemplates.length }} mẫu</span>
        </div>
        <button class="btn-add" @click="openAddTemplate">
          <font-awesome-icon icon="fa-solid fa-plus" /> Thêm mẫu
        </button>
      </div>

      <div class="template-grid">
        <div
          v-for="t in contractTemplates"
          :key="t.id"
          class="template-card"
          :class="{ inactive: !t.active }"
        >
          <div class="template-top">
            <div class="template-icon-wrap">
              <font-awesome-icon icon="fa-solid fa-file-contract" class="template-icon" />
            </div>
            <span class="template-badge" :class="t.type === 'Cầm Đồ' ? 'badge-teal' : t.type === 'Tín Chấp' ? 'badge-purple' : 'badge-orange'">
              {{ t.type }}
            </span>
          </div>
          <h3 class="template-name">{{ t.name }}</h3>
          <p class="template-date">Cập nhật: {{ t.updatedAt }}</p>
          <div class="template-status">
            <span class="status-dot" :class="t.active ? 'dot-green' : 'dot-gray'"></span>
            {{ t.active ? 'Đang sử dụng' : 'Không sử dụng' }}
          </div>
          <div class="template-actions">
            <button class="btn-icon-action text-teal" title="Chỉnh sửa" @click="openEditTemplate(t)">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" />
            </button>
            <button class="btn-icon-action text-blue" title="Xem trước">
              <font-awesome-icon icon="fa-solid fa-eye" />
            </button>
            <button class="btn-icon-action text-orange" title="Tải xuống">
              <font-awesome-icon icon="fa-solid fa-download" />
            </button>
          </div>
        </div>

        <!-- Add Placeholder Card -->
        <div class="template-card add-card" @click="openAddTemplate">
          <font-awesome-icon icon="fa-solid fa-plus" class="add-icon" />
          <p>Thêm mẫu mới</p>
        </div>
      </div>
    </div>

    <!-- ─── TAB: Asset Categories ─── -->
    <div v-if="activeTab === 'categories'" class="tab-content">
      <div class="section-toolbar">
        <div class="toolbar-left">
          <h2 class="section-title">Danh mục tài sản</h2>
          <span class="count-badge">{{ assetCategories.length }} danh mục</span>
        </div>
        <button class="btn-add" @click="openAddCategory">
          <font-awesome-icon icon="fa-solid fa-plus" /> Thêm danh mục
        </button>
      </div>

      <div class="category-table-wrapper">
        <table class="category-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Biểu tượng</th>
              <th>Tên danh mục</th>
              <th>Số tài sản</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(cat, idx) in assetCategories" :key="cat.id" :class="{ 'row-inactive': !cat.active }">
              <td class="td-center">{{ idx + 1 }}</td>
              <td class="td-center">
                <span class="cat-emoji">{{ cat.icon }}</span>
              </td>
              <td class="td-name">{{ cat.name }}</td>
              <td class="td-center">
                <span class="count-pill">{{ cat.count }}</span>
              </td>
              <td class="td-center">
                <span class="status-badge" :class="cat.active ? 'badge-active' : 'badge-inactive'">
                  {{ cat.active ? 'Đang dùng' : 'Ẩn' }}
                </span>
              </td>
              <td class="td-center">
                <div class="action-cell">
                  <button class="btn-icon-action text-teal" title="Chỉnh sửa" @click="openEditCategory(cat)">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square" />
                  </button>
                  <button class="btn-icon-action text-red" title="Xoá">
                    <font-awesome-icon icon="fa-solid fa-trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Stats row -->
      <div class="category-stats">
        <div class="cat-stat-card">
          <span class="cat-stat-icon">📦</span>
          <div>
            <div class="cat-stat-value">{{ assetCategories.reduce((s,c) => s + c.count, 0) }}</div>
            <div class="cat-stat-label">Tổng tài sản</div>
          </div>
        </div>
        <div class="cat-stat-card">
          <span class="cat-stat-icon">✅</span>
          <div>
            <div class="cat-stat-value">{{ assetCategories.filter(c => c.active).length }}</div>
            <div class="cat-stat-label">Danh mục đang dùng</div>
          </div>
        </div>
        <div class="cat-stat-card">
          <span class="cat-stat-icon">🏷️</span>
          <div>
            <div class="cat-stat-value">{{ assetCategories.length }}</div>
            <div class="cat-stat-label">Tổng danh mục</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Modal: Template Form ─── -->
    <div class="modal-overlay" v-if="showTemplateModal">
      <div class="modal-box">
        <div class="modal-header">
          <h2>{{ editingTemplate?.id ? 'Chỉnh sửa mẫu' : 'Thêm mẫu hợp đồng' }}</h2>
          <button class="modal-close" @click="closeTemplateModal">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Tên mẫu</label>
            <input type="text" class="form-input" placeholder="Nhập tên mẫu hợp đồng" v-model="editingTemplate.name">
          </div>
          <div class="form-group">
            <label class="form-label">Loại hợp đồng</label>
            <select class="form-input" v-model="editingTemplate.type">
              <option>Cầm Đồ</option>
              <option>Tín Chấp</option>
              <option>Trả Góp</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <div class="toggle-row no-border">
              <span class="toggle-label">Đang sử dụng</span>
              <label class="switch">
                <input type="checkbox" v-model="editingTemplate.active">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeTemplateModal">Hủy</button>
          <button class="btn-save" @click="closeTemplateModal">
            <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Lưu
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Modal: Category Form ─── -->
    <div class="modal-overlay" v-if="showCategoryModal">
      <div class="modal-box">
        <div class="modal-header">
          <h2>{{ editingCategory?.id ? 'Chỉnh sửa danh mục' : 'Thêm danh mục tài sản' }}</h2>
          <button class="modal-close" @click="closeCategoryModal">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Tên danh mục</label>
            <input type="text" class="form-input" placeholder="VD: Điện thoại, Xe máy..." v-model="editingCategory.name">
          </div>
          <div class="form-group">
            <label class="form-label">Biểu tượng (emoji)</label>
            <input type="text" class="form-input" placeholder="VD: 📱" v-model="editingCategory.icon" maxlength="2">
          </div>
          <div class="form-group">
            <label class="form-label">Trạng thái</label>
            <div class="toggle-row no-border">
              <span class="toggle-label">Hiển thị danh mục</span>
              <label class="switch">
                <input type="checkbox" v-model="editingCategory.active">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeCategoryModal">Hủy</button>
          <button class="btn-save" @click="closeCategoryModal">
            <font-awesome-icon icon="fa-solid fa-floppy-disk" /> Lưu
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
@import "../../assets/setting.css";
</style>
