<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssetsStore } from '@/stores/assets'

const assetsStore = useAssetsStore()
const { assets } = storeToRefs(assetsStore)
const { fetchAssets, formatCurrency } = assetsStore

onMounted(() => {
    fetchAssets()
})
</script>

<template>
    <div class="assets">
        <div class="group-function">
            <div class="search">
                <div class="search-input">
                    <label for="search">Tìm kiếm</label>
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT">
                </div>
                <div class="filter">
                    <label for="filter">Trạng thái</label>
                    <select id="filter">
                        <option value="">Tất cả</option>
                        <option value="">Đang cầm</option>
                        <option value="">Đã thanh lý</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="table-wrapper">
                <div class="table">
                    <table>
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã TS</th>
                                <th>Tên tài sản</th>
                                <th>Hợp đồng</th>
                                <th>Tên khách hàng</th>
                                <th>Số tiền vay</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="asset, index in assets" :key="asset.id">
                                <td>{{ index + 1 }}</td>
                                <td>
                                    <span class="fw-bold">{{ asset.code || 'Chưa có' }}</span>
                                </td>
                                <td>{{ asset.name }}</td>
                                <td><span class="text-success fw-bold">{{ asset.contract_code }}</span></td>
                                <td>
                                    <span>{{ asset.customer_name }}</span>
                                    <p>{{ asset.customer_phone }}</p>
                                </td>
                                <td><span class="text-danger fw-bold">{{ formatCurrency(asset.loan_amount) }}</span></td>
                                <td><span class="badge rounded-pill bg-warning text-warning-emphasis">{{ asset.status }}</span>
                                </td>
                                <td>
                                    <div class="action-cell">
                                        <button class="btn-action text-success" data-tooltip="Thanh lý">
                                            <font-awesome-icon icon="fa-solid fa-gavel" />
                                        </button>
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
                <div class="pagination">
                    <div class="pagination-info">
                        <span class="page-info">Trang 1/1 (4)</span>
                    </div>
                    <div class="pagination-controls">
                        <button class="page-btn"><font-awesome-icon icon="angles-left" /></button>
                        <button class="page-btn"><font-awesome-icon icon="angle-left" /></button>
                        <button class="page-btn">1</button>
                        <button class="page-btn">2</button>
                        <button class="page-btn">3</button>
                        <button class="page-btn">4</button>
                        <button class="page-btn"><font-awesome-icon icon="angle-right" /></button>
                        <button class="page-btn"><font-awesome-icon icon="angles-right" /></button>
                    </div>
                </div>
        </div>
    </div>
</template>