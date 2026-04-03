<script setup>
import { useStaffStore } from '@/stores/staff'
import { storeToRefs } from 'pinia'

const staffStore = useStaffStore()
const { 
    role, 
    selectedRole,
    activeCategory, 
    selectedPermissionIds, 
    categories, 
    currentPermissions, 
    isAllSelected 
} = storeToRefs(staffStore)
const { closePermissionModal, toggleSelectAll, submitUpdatePermissionRole } = staffStore
</script>

<template>
    <div class="permission-modal">
        <div class="permission-content">
            <div class="permission-header">
                <h3>Phân Quyền Nhóm Chức Vụ</h3>
                <button class="close-btn" @click="closePermissionModal">&times;</button>
            </div>

            <div class="role-selection-wrapper">
                <div class="role-selection">
                    <label>Chọn chức vụ:</label>
                    <select v-model="selectedRole">
                        <option value="" disabled>-- Chọn chức vụ --</option>
                        <template v-for="r in role" :key="r.id">
                            <option v-if="r.id !== 1" :value="r.id">{{ r.name }}</option>
                        </template>
                    </select>
                </div>
            </div>

            <div class="permission-main">
                <!-- Sidebar -->
                <div class="permission-sidebar">
                    <div 
                        v-for="cat in categories" 
                        :key="cat"
                        class="category-item" 
                        :class="{ active: activeCategory === cat }"
                        @click="activeCategory = cat"
                    >
                        {{ cat }}
                    </div>
                </div>

                <!-- Main Content -->
                <div class="permission-grid-container">
                    <div class="permission-grid-header">
                        <label class="checkbox-container">
                            <input type="checkbox" :checked="isAllSelected" @change="toggleSelectAll">
                            <span class="checkmark"></span>
                            Tất cả ({{ activeCategory }})
                        </label>
                    </div>
                    <div class="permission-grid-body">
                        <template v-if="currentPermissions.length > 0">
                            <div 
                                v-for="i in Math.ceil(currentPermissions.length / 2)" 
                                :key="i" 
                                class="permission-row"
                            >
                                <label 
                                    v-for="idx in [2*(i-1), 2*(i-1)+1]" 
                                    :key="idx"
                                    class="checkbox-container"
                                    v-show="currentPermissions[idx]"
                                >
                                    <template v-if="currentPermissions[idx]">
                                        <input 
                                            type="checkbox" 
                                            :value="currentPermissions[idx].id" 
                                            v-model="selectedPermissionIds"
                                        >
                                        <span class="checkmark"></span>
                                        {{ currentPermissions[idx].name }}
                                    </template>
                                </label>
                            </div>
                        </template>
                        <div v-else style="padding: 20px; text-align: center; color: #888;">
                            Chưa cấu hình quyền cho mục này.
                        </div>
                    </div>
                </div>
            </div>

            <div class="permission-footer">
                <button class="btn-cancel" @click="closePermissionModal">Hủy</button>
                <button class="btn-save" @click="submitUpdatePermissionRole" v-permission="'staff.permission'">Lưu Quyền</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.permission-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.permission-content {
    background: #fff;
    width: 900px;
    max-width: 95%;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.permission-header {
    padding: 16px 24px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.permission-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a1a1a;
    font-weight: 700;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: #999;
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #333;
}

.role-selection-wrapper {
    padding: 15px 25px;
    background: #f8faf9;
    border-bottom: 1px solid #eee;
}

.role-selection {
    display: flex;
    align-items: center;
    gap: 15px;
}

.role-selection label {
    font-weight: 600;
    color: #444;
    white-space: nowrap;
    font-size: 0.9rem;
}

.role-selection select {
    flex: 1;
    max-width: 250px;
    padding: 8px 12px;
    border: 1.5px solid #e0e0e0;
    border-radius: 6px;
    outline: none;
    font-size: 14px;
    transition: all 0.2s;
    background: white;
    cursor: pointer;
}

.role-selection select:focus {
    border-color: #1a7a6e;
    box-shadow: 0 0 0 3px rgba(26, 122, 110, 0.1);
}

.permission-main {
    display: flex;
    height: 480px;
}

/* Sidebar */
.permission-sidebar {
    width: 220px;
    border-right: 1px solid #eee;
    padding: 16px;
    background: #fafafa;
}

.category-item {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    font-size: 0.95rem;
    color: #444;
    font-weight: 500;
    transition: all 0.2s ease;
    border: 1px solid transparent;
}

.category-item:hover {
    background: #fff;
    border-color: #289487;
    color: #1a7a6e;
}

.category-item.active {
    background: #c7e7e4;
    color: #1a7a6e;
    border-color: #289487;
    font-weight: 600;
}

/* Main Grid */
.permission-grid-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px;
    overflow-y: auto;
}

.permission-grid-header {
    background: #333;
    padding: 12px 16px;
    border-radius: 6px 6px 0 0;
    color: #fff;
    font-weight: 600;
    margin-bottom: 1px;
}

.permission-grid-body {
    border: 1px solid #ddd;
    border-top: none;
    border-radius: 0 0 6px 6px;
}

.permission-row {
    display: flex;
    border-bottom: 1px solid #eee;
}

.permission-row:last-child {
    border-bottom: none;
}

.permission-row label {
    flex: 1;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: #555;
    cursor: pointer;
    transition: background 0.15s;
}

.permission-row label:first-child {
    border-right: 1px solid #eee;
}

.permission-row label:hover {
    background: #f8f9fa;
}

/* Checkbox Styling */
.checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 28px !important;
    /* Overriding common label padding */
    cursor: pointer;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 50%;
    left: 5PX;
    transform: translateY(-50%);
    height: 18px;
    width: 18px;
    background-color: #fff;
    border: 2px solid #ccc;
    border-radius: 4px;
    transition: all 0.2s;
}

.checkbox-container:hover input~.checkmark {
    border-color: #1a7a6e;
}

.checkbox-container input:checked~.checkmark {
    background-color: #1a7a6e;
    border-color: #1a7a6e;
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked~.checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 5px;
    top: 1px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

/* Footer */
.permission-footer {
    padding: 16px 24px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    background: #e0e0e0;
    color: #333;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.btn-cancel:hover {
    background: #d5d5d5;
}

.btn-save {
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    background: #1a7a6e;
    color: #fff;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 10px rgba(65, 201, 189, 0.3);
}

.btn-save:hover {
    background: #289487;
    transform: translateY(-1px);
    box-shadow: 0 6px 15px rgba(52, 152, 219, 0.4);
}
</style>