<script setup>
import { useDetailContractStore } from '@/stores/contract/detailContract';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const activetabs = ref('Thông tin vay')
const tabs = [
    { name: 'Thông tin vay', badge: null, icon: 'file-invoice' },
    { name: 'Chi tiết đóng lãi', badge: 4, icon: 'coins' },
    { name: 'Lịch sử trả bớt gốc', badge: 1, icon: 'history' },
    { name: 'Tài sản cầm cố', badge: 1, icon: 'motorcycle' },
    { name: 'Lịch sử gia hạn', badge: 0, icon: 'calendar-plus' }
]

const detailContractStore = useDetailContractStore();
const { closeDetailContract } = detailContractStore;

</script>

<template>
    <div class="detail-contract">
        <div class="modal-detail-contract-content">
            <!-- Header -->
            <div class="modal-header">
                <div class="header-title">
                    <h2>Chi tiết hợp đồng: <span class="contract-code">CD0056</span></h2>
                </div>
                <button class="btn-close" @click="closeDetailContract">
                    <font-awesome-icon icon="times" />
                </button>
            </div>

            <!-- Customer Info Section -->
            <div class="customer-banner">
                <div class="customer-subtitle">
                    <font-awesome-icon icon="user-tie" /> Thông tin khách vay
                </div>
                <div class="customer-info-card">
                    <div class="customer-avatar">
                        <!-- Placeholder for avatar icon if needed -->
                    </div>
                    <div class="customer-details">
                        <h3 class="customer-name">Kim Jong En</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                24/03/1999
                            </div>
                            <div class="info-item">
                                0123456789
                            </div>
                            <div class="info-item">
                                Bắc Triều Tiên
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs Navigation -->
            <div class="modal-tabs">
                <div v-for="tab in tabs" :key="tab.name" class="tab-item" :class="{ active: activetabs === tab.name }"
                    @click="activetabs = tab.name">
                    <span v-if="tab.badge !== null" class="tab-badge" :class="{ 'badge-zero': tab.badge === 0 }">
                        {{ tab.badge }}
                    </span>
                    <font-awesome-icon :icon="tab.icon" v-if="tab.icon && tab.badge === null" class="tab-icon-small" />
                    {{ tab.name }}
                </div>
            </div>

            <!-- Tab Content Area -->
            <div class="tab-content">
                <div class="info-details-grid" v-if="activetabs === 'Thông tin vay'">
                    <!-- Column 1 -->
                    <div class="info-column">
                        <div class="detail-row">
                            <span class="label">Số tiền vay:</span>
                            <span class="value text-danger">29,000,000 (vnđ)</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Ngày vay:</span>
                            <span class="value">14/03/2026</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Kiểu vay:</span>
                            <span class="value">Cầm đồ</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Thời gian tạo:</span>
                            <span class="value">14/03/2026 16:28:59</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Người tạo hợp đồng:</span>
                            <span class="value">hanguyen032325@gmail.com</span>
                        </div>
                    </div>

                    <!-- Column 2 -->
                    <div class="info-column">
                        <div class="detail-row">
                            <span class="label">Ngày bắt đầu trả lãi:</span>
                            <span class="value">14/03/2026</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Kiểu đóng lãi:</span>
                            <span class="value">Sau</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Kỳ đóng lãi:</span>
                            <span class="value">1 tháng đóng một lần | trả theo tháng</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Lãi suất:</span>
                            <span class="value text-warning">Lãi tháng: 3%</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Số lần trả:</span>
                            <span class="value text-warning">2 Lần</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Ngày tất toán:</span>
                            <span class="value">13/05/2026</span>
                        </div>
                    </div>

                    <!-- Column 3 (Notes) -->
                    <div class="info-column">
                        <div class="detail-row note-row">
                            <span class="label"><font-awesome-icon icon="sticky-note" class="text-success" /> Ghi chú:</span>
                            <div class="note-box"></div>
                        </div>
                    </div>
                </div>

                <!-- Other tabs placeholders -->
                <div v-else class="placeholder-content">
                    Đang hiển thị nội dung của: {{ activetabs }}
                </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
                <button class="btn-footer-close" @click="closeDetailContract">
                    <font-awesome-icon icon="times" /> Đóng
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/detailContract.css';
</style>