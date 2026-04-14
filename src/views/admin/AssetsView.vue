<script setup>
import { onMounted, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssetsStore } from '@/stores/assets'
import { useDetailContractStore } from '@/stores/contract/detailContract';

import AssetsLiquidation from '@/components/assets/AssetsLiquidation.vue'
import AssetsDetail from '@/components/assets/AssetsDetail.vue'
import AssetsEdit from '@/components/assets/AssetsEdit.vue'
import DetailContract from '@/components/contracts/DetailContract.vue';

const assetsStore = useAssetsStore()
const detailContractStore = useDetailContractStore();

const { assets, search, paginatedAssets, totalPage, currentPage, sortConfig, 
        showAssetsLiquidationModal, showAssetsDetailModal, showAssetsEditModal, filterStatus } = storeToRefs(assetsStore)
const { 
        fetchAssets, formatCurrency, handleSort, changePage, 
        goToFirstPage, goToNextPage, goToPrevPage, goToLastPage,
        openAssetsLiquidationModal, closeAssetsLiquidationModal,
        openAssetsDetailModal, closeAssetsDetailModal,
        openAssetsEditModal, closeAssetsEditModal
    } = assetsStore
    
const { showDetailContract } = storeToRefs(detailContractStore);
const { openDetailContract, closeDetailContract } = detailContractStore;

const CountBetweenDate = (expectedDate, todayDate) => {
    if (!expectedDate) return "Chưa có lịch";
    
    const firstDate = new Date(expectedDate);
    const secondDate = new Date(todayDate);
    
    // Đổi const thành let để có thể gán lại giá trị
    let diffTime = firstDate - secondDate; 
    
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Đến Hạn";
    
    if (diffDays < 0) {
        return `Quá hạn ${Math.abs(diffDays)} ngày`;
    }
    
    return `${diffDays} ngày đến hạn`;
}

const today = new Date().toISOString().split('T')[0];

onMounted( async() => {
    const promise = []
    if (assets.value.length === 0) {
        promise.push(fetchAssets())
    }
    await Promise.all(promise)
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
                    <select id="filter" v-model="filterStatus">
                        <option value="">Tất cả</option>
                        <option value="Đang Cầm">Đang Cầm</option>
                        <option value="Chờ Thanh Lý">Chờ Thanh Lý</option>
                        <option value="Đã Chuộc">Đã Chuộc</option>
                        <option value="Đã Thanh Lý">Đã Thanh Lý</option>
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
                                <span id="detailContract" @click="openAssetsDetailModal(asset.id)" v-permission="'collateral.detail'" class="fw-bold">{{ asset.code || 'Chưa có' }}</span>
                                <p v-if="asset.status === 'Đang Cầm' || asset.status === 'Đang cầm' || asset.status === 'Quá Hạn' || asset.status === 'Chờ Thanh Lý'" class="text-danger fw-bold">
                                    {{ CountBetweenDate(asset.payment_schedules, today) == 0 ? 'Đến Hạn' : CountBetweenDate(asset.payment_schedules, today, asset.status)}}
                                </p>
                            </td>
                            <td>{{ asset.name }}</td>
                            <td><span class="text-success fw-bold" id="detailContract" @click="openDetailContract(asset.contract_id)" v-permission="['loans.detail', 'pledge.detail', 'repayment.detail']">{{ asset.contract_code }}</span></td>
                            <td>
                                <span>{{ asset.customer_name }}</span>
                                <p>{{ asset.customer_phone }}</p>
                            </td>
                            <td><span class="text-danger fw-bold">{{ formatCurrency(asset.loan_amount) }}</span></td>
                            <td>
                                <span class="badge rounded-pill bg-warning text-warning-emphasis fw-bold" v-if="asset.status === 'Đang cầm'">{{ asset.status }}</span>
                                <span class="badge rounded-pill bg-success fw-bold" v-if="asset.status === 'Đã Thanh Lý'">{{ asset.status }}</span>
                                <span class="badge rounded-pill bg-success fw-bold" v-if="asset.status === 'Đã Chuộc'">{{ asset.status }}</span>
                                <span class="badge rounded-pill bg-danger fw-bold" v-if="asset.status === 'Chờ Thanh Lý'">{{ asset.status }}</span>
                            </td>
                            <td>
                                <div class="action-cell" v-if="asset.status === 'Đã Thanh Lý'">
                                    <button class="btn-action text-primary  " data-tooltip="Xem chi tiết" v-permission="'collateral.detail'" @click="openAssetsDetailModal(asset.id)">
                                        <font-awesome-icon icon="eye" />
                                    </button>
                                </div>
                                <div class="action-cell" v-else>
                                    <button class="btn-action text-warning yellow-600" data-tooltip="Chỉnh sửa" v-permission="'collateral.update'" @click="openAssetsEditModal(asset.id)">
                                        <font-awesome-icon icon="pen-to-square" />
                                    </button>
                                    <button v-if="asset.status === 'Chờ Thanh Lý'" class="btn-action text-success" data-tooltip="Thanh lý" v-permission="'collateral.liquidation'" @click="openAssetsLiquidationModal(asset.id)">
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

    <div class="modal-overlay" v-if="showAssetsLiquidationModal">
        <AssetsLiquidation @close="closeAssetsLiquidationModal" />
    </div>
    <div class="modal-overlay" v-if="showAssetsDetailModal">
        <AssetsDetail @close="closeAssetsDetailModal" />
    </div>
    <div class="modal-overlay" v-if="showAssetsEditModal">
        <AssetsEdit @close="closeAssetsEditModal" />
    </div>
    <div class="modal-overlay" v-if="showDetailContract">
        <DetailContract @close="closeDetailContract" />
    </div>
</template>

<style scoped>
#detailContract:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>