<script setup>
import { useDetailContractStore } from '@/stores/contract/detailContract';
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';

import SelectTemplate from '@/components/contracts/SelectTemplatePrint.vue';

const detailContractStore = useDetailContractStore();

const { detailContract, collateralmetadata, collateralImages, showSelectTemplate } = storeToRefs(detailContractStore);
const { closeDetailContract, formatCurrency, getContractPrint, getContractReceipt, openSelectTemplate } = detailContractStore;

const activetabs = ref('Thông tin vay')
const tabs = computed(() => [
    { name: 'Thông tin vay', badge: null },
    { name: 'Chi tiết đóng lãi', badge: detailContract.value?.paymentSchedules?.length || 0 },
    { name: 'Lịch sử trả bớt gốc', badge: detailContract.value?.transactions?.length || 0 },
    { name: 'Tài sản cầm cố', badge: detailContract.value?.collateral?.length || 0 },
    { name: 'In hợp đồng', badge: null }
])

const detail = computed(() => {
    return detailContract.value;
})

</script>

<template>
    <div class="detail-contract">
        <div class="modal-detail-contract-content" v-if="detail">
            <!-- Header -->
            <div class="modal-header">
                <div class="header-title">
                    <h2>Chi tiết hợp đồng: <span class="contract-code">{{ detail.contract?.code }}</span></h2>
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
                    <div class="customer-info-grid">
                        <div class="customer-avatar">
                            <div class="customer-image">
                                <img v-if="detail.customer?.images_cccd"
                                    :src="`http://localhost:3000/uploads/` + detail.customer.images_cccd"
                                    alt="Customer Image" class="customer-image-cccd">
                            </div>
                        </div>
                        <div class="customer-details">
                            <h3 class="customer-name">Tên khách hàng: {{ detail.customer?.name }}</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    Ngày sinh: {{ detail.customer?.birth_date }}
                                </div>
                                <div class="info-item">
                                    Số điện thoại: {{ detail.customer?.phone }}
                                </div>
                                <div class="info-item">
                                    Địa chỉ: {{ detail.customer?.address }}
                                </div>
                                <div class="info-item">
                                    Số CCCD: {{ detail.customer?.cccd }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="customer-info-grid" v-for="(relative, index) in detail.relative" :key="relative.id">
                        <div class="customer-details">
                            <h3 class="customer-name">Người thân {{ index + 1 }}</h3>
                            <div class="info-grid">
                                <div class="info-item">Họ và tên: 
                                    {{ relative.name }}
                                </div>
                                <div class="info-item">Số điện thoại: 
                                    {{ relative.phone }}
                                </div>
                                <div class="info-item">Địa chỉ: 
                                    {{ relative.address }}
                                </div>
                                <div class="info-item">Số CCCD: 
                                    {{ relative.cccd }}
                                </div>
                                <div class="info-item">Nghề nghiệp: 
                                    {{ relative.job }}
                                </div>
                                <div class="info-item">Nơi làm việc: 
                                    {{ relative.workplace }}
                                </div>
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
                            <span class="value text-danger fw-bold">{{ formatCurrency(detail.contract?.loan_amount) }}
                                (vnđ)</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Lãi suất:</span>
                            <span class="value text-success" v-if="detail.contract?.interest_type === 'daily_amount'">
                                {{ formatCurrency(detail.contract?.interest_rate) }} / ngày
                            </span>
                            <span class="value text-success" v-else>
                                {{ detail.contract?.interest_rate }}%
                            </span>
                        </div>

                        <div class="detail-row">
                            <span class="label">Kiểu vay:</span>
                            <span class="value">{{ detail.contract?.contract_name }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Ngày bắt đầu:</span>
                            <span class="value">{{ detail.contract?.start_date }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Ngày kết thúc:</span>
                            <span class="value">{{ detail.contract?.end_date }}</span>
                        </div>
                    </div>

                    <!-- Column 2 -->
                    <div class="info-column">

                        <!-- <div class="detail-row">
                            <span class="label">Kiểu đóng lãi:</span>
                            <span class="value" v-if="detail.contract?.interest_type === 'percent*term'">% x Số kỳ</span>
                            <span class="value" v-else-if="detail.contract?.interest_type === 'percent/term'">% / Số kỳ</span>
                            <span class="value" v-else-if="detail.contract?.interest_type === 'daily_amount'">Số tiền cố định</span>
                        </div> -->
                        <div class="detail-row">
                            <span class="label">Kỳ đóng lãi:</span>
                            <span class="value">{{ detail.contract?.payment_term }} {{ detail.contract?.term_unit
                                }}</span>
                        </div>

                        <div class="detail-row">
                            <span class="label">Số lần trả:</span>
                            <span class="value text-success">{{ detail.contract?.total_periods }} Lần</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Thời gian tạo:</span>
                            <span class="value">{{ detail.contract?.created_at }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Người tạo hợp đồng:</span>
                            <span class="value">{{ detail.contract?.staff_name }}</span>
                        </div>
                    </div>
                </div>

                <div class="payment-schedules" v-if="activetabs === 'Chi tiết đóng lãi'">
                    <div class="table-wapper" v-if="detail.paymentSchedules.length > 0">
                        <table>
                            <thead>
                                <tr>
                                    <th>Số kỳ thứ</th>
                                    <th>Ngày thanh toán</th>
                                    <th>Tiền lãi</th>
                                    <th>Tiền gốc</th>
                                    <th>Phí khác</th>
                                    <th>Đã thanh toán</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="schedule in detail.paymentSchedules" :key="schedule.id">
                                    <td>{{ schedule.period_number }}</td>
                                    <td>{{ schedule.created_at }}</td>
                                    <td class="text-success fw-bold">{{ formatCurrency(schedule.interest_amount) }}</td>
                                    <td class="text-danger fw-bold">{{ formatCurrency(schedule.principal_amount) }}</td>
                                    <td>{{ formatCurrency(schedule.other_fees) || 0 }}</td>
                                    <td>{{ schedule.display_history || 0 }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="placeholder-content">
                        Chưa đóng kỳ nào
                    </div>
                </div>

                <div class="history-reduce" v-if="activetabs === 'Lịch sử trả bớt gốc'">
                    <div class="table-wapper" v-if="detail.transactions.length > 0">
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Ngày trả bớt gốc</th>
                                    <th>Số tiền</th>
                                    <th>Gốc cũ</th>
                                    <th>Gốc mới</th>
                                    <th>Lãi suất cũ</th>
                                    <th>Lãi suất mới</th>
                                    <th>Phí khác</th>
                                    <th>Ghi chú</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in detail.transactions" :key="item.id">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{ item.created_at }}</td>
                                    <td class="text-success fw-bold">{{ formatCurrency(item.amount) }}</td>
                                    <td>{{ formatCurrency(item.old_principal) }}</td>
                                    <td>{{ formatCurrency(item.new_principal) }}</td>
                                    <!-- Lãi suất cũ -->
                                    <td v-if="detail.contract.interest_type === 'daily_amount'">{{
                                        item.old_interest_rate > 0 ? formatCurrency(item.old_interest_rate) : 'Không đổi'}}</td>
                                    <td v-else>{{ item.old_interest_rate > 0 ? item.old_interest_rate + '%' : 'Không đổi'}}</td>
                                    <!-- Lãi suất mới -->
                                    <td v-if="detail.contract.interest_type === 'daily_amount'">{{
                                        item.new_interest_rate > 0 ? formatCurrency(item.new_interest_rate) : 'Không đổi'}}</td>
                                    <td v-else>{{ item.new_interest_rate > 0 ? item.new_interest_rate + '%' : 'Không đổi'}}</td>
                                    <td>{{ formatCurrency(item.other_fees) || 0 }}</td>
                                    <td>{{ item.note }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="placeholder-content">
                        Chưa trả bớt gốc lần nào
                    </div>
                </div>

                <div class="assets" v-if="activetabs === 'Tài sản cầm cố'">
                    <div class="assets-item" v-if="detail.collateral.length > 0">
                        <div class="assets-item-header">
                            <div class="asset-main-info">
                                <h3 class="asset-name">{{ detail.collateral[0].name }}</h3>
                                <span class="asset-type-badge">{{ detail.collateral[0].type_name }}</span>
                            </div>
                            <div class="asset-description">
                                <div class="metadata-grid" v-if="Object.keys(collateralmetadata).length > 0">
                                    <div v-for="(value, key) in collateralmetadata" :key="key" class="metadata-item">
                                        <span class="m-label">{{ key }}:</span>
                                        <span class="m-value">{{ value }}</span>
                                    </div>
                                </div>
                                <div v-else class="no-metadata">
                                    <font-awesome-icon icon="info-circle" /> Chưa có thông tin chi tiết
                                </div>
                            </div>
                        </div>
                        <div class="assets-gallery">
                            <div class="gallery-item" v-for="(img, idx) in collateralImages" :key="idx">
                                <img :src="`http://localhost:3000${img.url}`" alt="Hình ảnh tài sản">
                            </div>
                        </div>
                    </div>
                    <div v-else class="placeholder-content">
                        Chưa có tài sản cầm cố
                    </div>
                </div>

                <div class="print-section" v-permission="['loans.print', 'pledge.print', 'repayment.print']" v-if="activetabs === 'In hợp đồng'">
                    <div class="customer-subtitle">
                        <font-awesome-icon icon="print" /> Tùy chọn in
                    </div>
                    <div class="print-section-content">
                        <div class="print-card" @click="openSelectTemplate()">
                            <font-awesome-icon class="icon-print" icon="file-contract" style="color: #1a7a6e;" />
                            <h4>In hợp đồng chính</h4>
                            <p>In hợp đồng cầm đồ tiêu chuẩn kèm điều khoản.</p>
                        </div>
                        
                        <div class="print-card" v-if="detail.collateral.length > 0" @click="openSelectTemplate()">
                            <font-awesome-icon class="icon-print" icon="receipt" style="color: #3498db;" />
                            <h4>In biên nhận</h4>
                            <p>In phiếu biên nhận giao nhận tiền và tài sản.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
                <button class="btn-footer-close" @click="closeDetailContract">
                    <font-awesome-icon icon="times" /> Đóng
                </button>
            </div>
        </div>
        <div v-else class="loading-overlay">
            <div class="loader"></div>
            <p>Đang tải dữ liệu...</p>
        </div>
    </div>
    <SelectTemplate v-if="showSelectTemplate" />
</template>

<style scoped>
@import '@/assets/detailContract.css';
</style>