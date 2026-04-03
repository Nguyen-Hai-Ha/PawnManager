<script setup>
import { Money3Component as Money3 } from 'v-money3';
import { useAssetsStore } from '@/stores/assets';
import { storeToRefs } from 'pinia';

const assetsStore = useAssetsStore();
const { liquidation } = storeToRefs(assetsStore);
const { closeAssetsLiquidationModal, formatCurrency, submitLiquidation } = assetsStore;

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
</script>

<template>
    <div class="modal-assets-liquidation">
        <div class="modal-header">
            <h2>Thanh lý tài sản {{ liquidation.code }}</h2>
            <button class="close-btn" @click="closeAssetsLiquidationModal">&times;</button>
        </div>
        <div class="modal-body">
            <div class="form">
                <form @submit.prevent="submitLiquidation">
                    <div class="form-group">
                        <span >Tài sản: {{ liquidation.name }}</span>
                    </div>
                    <div class="form-group">
                        <label for="liquidation_price">Giá thanh lý</label>
                        <money3 v-bind="moneyConfig" v-model="liquidation.price"></money3>
                    </div>
                    <button type="submit" class="confirm-btn" v-permission="'collateral.liquidation'">Xác nhận</button>
                </form>
            </div>
            <div class="content">
                <div class="content-item">
                    <span>Hợp đồng: </span>
                    <span class="text-success fw-bold">{{ liquidation.contract_code }}</span>
                </div>
                <div class="content-item">
                    <span>Khách hàng: </span>
                    <span>{{ liquidation.customer_name }}</span>
                </div>
                <div class="content-item">
                    <span>Số tiền vay: </span>
                    <span class="text-danger fw-bold">{{ formatCurrency(liquidation.loan_amount) }}</span>
                </div>
                <div class="content-item">
                    <span>Tiền đã trả: </span>
                    <span class="text-success fw-bold">{{ formatCurrency(liquidation.had_paid) }}</span>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="cancel-btn" @click="closeAssetsLiquidationModal" >Hủy</button>
            
        </div>
    </div>
</template>

<style scoped>
.modal-assets-liquidation {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    width: 800px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    color: #1a7a6e
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.modal-body {
    display: flex;
    gap: 20px;
}

.form {
    flex: 1;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
}

.form-group {
    margin-bottom: 15px;
    color: #000;
    font-size: 15px;
}

.form-group span {
    font-weight: 500;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.content {
    flex: 1;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 10px;
    height: 150px;
}

.content-item {
    margin-bottom: 10px;
    color: #000;
    font-size: 15px;
}

.content-item span {
    font-weight: 500;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
}

.cancel-btn,
.confirm-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px
}

.cancel-btn {
    background-color: #ccc;
}

.confirm-btn {
    background-color: #1a7a6e;
    color: white;
}
</style>
