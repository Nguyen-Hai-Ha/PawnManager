<script setup>
import { useAddNewLoanStore } from '@/stores/contract/addNewLoan';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { Money3Component as Money3 } from 'v-money3';

const store = useAddNewLoanStore();
const { customers, assetTypes, assets, imagePreviews, loan, StartDate, EndDate, TotalInterest, id_contract_type } = storeToRefs(store);
const { fetchAssetTypes, fetchCustomer, handleImageChange, closeModal, removeImage, formatCurrency, submitLoan } = store;

const moneyConfig = {
    prefix: '',
    suffix: '',
    thousands: '.',
    decimal: ',',
    precision: 0,
    masked: false,
    disableNegative: true,
    min: 0,
};

onMounted(async () => {
    const promises = [];
    if (customers.value.length === 0) {
        promises.push(fetchCustomer());
    }
    if (assetTypes.value.length === 0) {
        promises.push(fetchAssetTypes());
    }
    await Promise.all(promises);
})
</script>

<template>
    <div class="modal-add-loan">
        <div class="modal-add-loan-content">
            <div class="modal-add-loan-header">
                <h2>Thêm Hợp Đòng Cầm Đồ Mới</h2>
                <button class="close-modal" @click="closeModal">&times;</button>
            </div>
            <div class="modal-add-loan-body">
                <form @submit.prevent="submitLoan">
                    <select name="id_customer" id="id_customer" v-model="loan.id_customer">
                        <option value="">Chọn khách hàng</option>
                        <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.name
                            }} - {{ customer.cccd }}</option>
                    </select>
                    <div class="assets-info" v-if="id_contract_type === 1">
                        <span class="assets-title">Thông tin tài sản</span>
                        <div class="form-row">
                            <div class="pm-form-group">
                                <label for="assets_name">Tên tài sản</label>
                                <input type="text" id="assets_name" v-model="assets.name" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="assets_type">Loại tài sản</label>
                                <select name="assets_type" id="assets_type" v-model="assets.id_type">
                                    <option value="">Chọn loại tài sản</option>
                                    <option v-for="asset in assetTypes" :key="asset.id" :value="asset.id">{{ asset.name
                                        }}</option>
                                </select>
                            </div>
                        </div>
                        <!-- xe máy và oto -->
                        <div class="form-row" v-if="assets.id_type === 1 || assets.id_type === 2">
                            <div class="pm-form-group">
                                <label for="assets_description">Biển số xe</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['biển số']" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="assets_description">Đặc điểm nhận dạng</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['đặc điểm nhận dạng']" required>
                            </div>
                        </div>
                        <div class="form-row" v-if="assets.id_type === 1 || assets.id_type === 2">
                            <div class="pm-form-group">
                                <label for="assets_description">Số máy</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['số máy']" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="assets_price">Số khung</label>
                                <input type="text" id="assets_price" v-model="assets.metadata['số khung']" required>
                            </div>
                        </div>

                        <!-- điện thoại -->
                        <div class="form-row" v-if="assets.id_type === 3 || assets.id_type === 4">
                            <div class="pm-form-group">
                                <label for="assets_description">Màu sắc</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['màu sắc']" required>
                            </div>
                            <div class="pm-form-group">
                            </div>
                        </div>

                        <!-- vàng -->
                        <div class="form-row" v-if="assets.id_type === 5">
                            <div class="pm-form-group">
                                <label for="assets_description">Trọng lượng</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['trọng lượng']" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="assets_description">Tình trạng</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['tình trạng']" required>
                            </div>
                        </div>

                        <!-- giấy tờ -->
                        <div class="form-row" v-if="assets.id_type === 6">
                            <div class="pm-form-group">
                                <label for="assets_description">Loại giấy tờ</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['loại giấy tờ']" required>
                            </div>
                            <div class="pm-form-group">
                                <label for="assets_description">Số giấy tờ</label>
                                <input type="text" id="assets_description" v-model="assets.metadata['số giấy tờ']" required>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="pm-form-group-image">
                                <label for="images_assets">Hình ảnh tài sản</label>
                                <input type="file" multiple accept="image/*" id="images_assets"
                                    @change="handleImageChange">
                            </div>
                            <div class="pm-form-group-images">
                                <div class="image-preview" v-for="(image, index) in imagePreviews" :key="index">
                                    <img :src="image" alt="Preview"
                                        style="width: 100px; height: 100px; object-fit: cover;">
                                    <button type="button" class="remove-image btn-action text-danger" data-tooltip="Xóa"
                                        @click="removeImage(index)"><font-awesome-icon icon="circle-xmark" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="loan-info">
                        <span class="loan-title">Thông tin khoản vay</span>

                        <div class="loan-grid-row">
                            <div class="loan-group">
                                <label for="loan_amount">Tổng tiền vay</label>
                                <money3 id="loan_amount" v-model="loan.loan_amount" v-bind="moneyConfig"></money3>
                            </div>
                            <div class="loan-group">
                                <label for="interest_period">Kỳ đóng lãi:</label>
                                <div class="loan-input-group">
                                    <input type="number" id="interest_period" v-model="loan.payment_term" min="0" required>
                                    <select name="interest_period_type" id="interest_period_type"
                                        v-model="loan.term_unit">
                                        <option value="Ngày">Ngày</option>
                                        <option value="Tháng">Tháng</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="loan-grid-row">
                            <div class="loan-group">
                                <label for="interest_rate">Lãi suất:</label>
                                <div class="loan-input-group">
                                    <input type="number" id="interest_rate" v-model="loan.interest_rate" min="0" required
                                        placeholder="%">
                                    <select name="interest_type" id="interest_type" v-model="loan.interest_type">
                                        <option value="percent*term">% x Kỳ</option>
                                        <option value="percent/term">% / Kỳ</option>
                                        <option value="daily_amount">Lãi ngày</option>
                                    </select>
                                </div>
                            </div>
                            <div class="loan-group">
                                <label for="total_periods">Số lần trả:</label>
                                <input type="number" id="total_periods" v-model="loan.total_periods" min="0" required placeholder="Số lần trả">
                            </div>
                        </div>

                        <div class="loan-date-row">
                            <div class="loan-group">
                                <label for="start_date">Ngày vay:</label>
                                <input type="text" id="start_date" v-model="StartDate" class="input-gray"
                                    placeholder="dd/mm/yyyy" readonly>
                            </div>
                            <div class="loan-arrow">
                                &#8594;
                            </div>
                            <div class="loan-group">
                                <label for="end_date">Thời hạn</label>
                                <input type="text" id="end_date" v-model="EndDate" class="input-gray"
                                    placeholder="dd/mm/yyyy" readonly>
                            </div>
                        </div>
                    </div>
                    <div class="loan-detail">
                        <div class="loan-detail-header">
                            <span class="loan-detail-title">Chi tiết khoản vay</span>
                        </div>
                        <div class="loan-detail-body">
                            <div class="loan-detail-item">
                                <span class="loan-detail-label">Tổng tiền vay:</span>
                                <span class="loan-detail-value">{{ formatCurrency(loan.loan_amount) }}</span>
                            </div>
                            <div class="loan-detail-item">
                                <span class="loan-detail-label">Kỳ đóng lãi:</span>
                                <span class="loan-detail-value">{{ loan.payment_term }} {{ loan.term_unit }}</span>
                            </div>
                            <div class="loan-detail-item">
                                <span class="loan-detail-label">Tổng lãi suất:</span>
                                <span class="loan-detail-value" v-if="loan.interest_type === 'percent*term'">{{ formatCurrency(TotalInterest) }} ({{ loan.interest_rate }}% x {{ loan.total_periods }} Kỳ)</span>
                                <span class="loan-detail-value" v-if="loan.interest_type === 'percent/term'">{{ formatCurrency(TotalInterest) }} ({{ loan.interest_rate }}% / {{ loan.total_periods }} Kỳ)</span>
                                <span class="loan-detail-value" v-if="loan.interest_type === 'daily_amount'">{{ formatCurrency(TotalInterest) }} ({{ formatCurrency(loan.interest_rate) }}/Ngày)</span>
                            </div>
                            <div class="loan-detail-item">
                                <span class="loan-detail-label">Số lần trả:</span>
                                <span class="loan-detail-value">{{ loan.total_periods }}</span>
                            </div>
                            <div class="loan-detail-item">
                                <span class="loan-detail-label">Ngày vay:</span>
                                <span class="loan-detail-value">{{ StartDate }}</span>
                            </div>
                            <div class="loan-detail-item">
                                <span class="loan-detail-label">Thời hạn:</span>
                                <span class="loan-detail-value">{{ EndDate }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="modal-add-loan-footer">
                        <button class="btn-cancel" @click="closeModal">Hủy</button>
                        <button class="btn-submit" type="submit">Thêm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/main.css';
</style>