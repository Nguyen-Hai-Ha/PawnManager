<script setup>
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssetsStore } from '@/stores/assets'

const assetsStore = useAssetsStore()
const { assets, search, paginatedAssets, totalPage, currentPage, sortConfig } = storeToRefs(assetsStore)
const { fetchAssets, formatCurrency, handleSort, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage } = assetsStore

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
                    <input type="text" id="search" placeholder="Tìm kiếm theo tên, SĐT" v-model="search">
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
                                <th @click="handleSort('id')">STT
                                    <span class="sort-icon">
                                        <font-awesome-icon v-if="sortConfig.key === 'id' && sortConfig.direction === 'asc'" icon="sort-up" />
                                        <font-awesome-icon v-else-if="sortConfig.key === 'id' && sortConfig.direction === 'desc'" icon="sort-down" />
                                        <font-awesome-icon v-else icon="sort" />
                                    </span>
                                </th>
                                <th @click="handleSort('code')">Mã TS
                                    <span class="sort-icon">
                                        <font-awesome-icon v-if="sortConfig.key === 'code' && sortConfig.direction === 'asc'" icon="sort-up" />
                                        <font-awesome-icon v-else-if="sortConfig.key === 'code' && sortConfig.direction === 'desc'" icon="sort-down" />
                                        <font-awesome-icon v-else icon="sort" />
                                    </span>
                                </th>
                                <th @click="handleSort('name')">Tên tài sản
                                    <span class="sort-icon">
                                        <font-awesome-icon v-if="sortConfig.key === 'name' && sortConfig.direction === 'asc'" icon="sort-up" />
                                        <font-awesome-icon v-else-if="sortConfig.key === 'name' && sortConfig.direction === 'desc'" icon="sort-down" />
                                        <font-awesome-icon v-else icon="sort" />
                                    </span>
                                </th>
                                <th @click="handleSort('contract_code')">Hợp đồng
                                    <span class="sort-icon">
                                        <font-awesome-icon v-if="sortConfig.key === 'contract_code' && sortConfig.direction === 'asc'" icon="sort-up" />
                                        <font-awesome-icon v-else-if="sortConfig.key === 'contract_code' && sortConfig.direction === 'desc'" icon="sort-down" />
                                        <font-awesome-icon v-else icon="sort" />
                                    </span>
                                </th>
                                <th>Tên khách hàng</th>
                                <th>Số tiền vay</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="asset in paginatedAssets" :key="asset.id">
                                <td>{{ asset.id }}</td>
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
                        <span class="page-info">Trang {{ currentPage }}/{{ totalPage }} ({{ assets.length }})</span>
                    </div>
                    <div class="pagination-controls">
                        <button class="page-btn" @click="goToFirstPage"><font-awesome-icon icon="angles-left" /></button>
                        <button class="page-btn" @click="goToPrevPage"><font-awesome-icon icon="angle-left" /></button>
                        <button class="page-btn" v-for="page in totalPage" :key="page" @click="changePage(page)">{{ page }}</button>
                        <button class="page-btn" @click="goToNextPage"><font-awesome-icon icon="angle-right" /></button>
                        <button class="page-btn" @click="goToLastPage"><font-awesome-icon icon="angles-right" /></button>
                    </div>
                </div>
        </div>
    </div>
</template>