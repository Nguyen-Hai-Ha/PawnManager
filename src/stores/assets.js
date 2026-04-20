import { defineStore } from "pinia";
import { ref, computed, watch } from 'vue'
import apiClient from "@/plugins/axios";
import { useAuthStore } from "./auth";

export const useAssetsStore = defineStore("assets", () => {
    const assets = ref([]);
    const assetDetail = ref([]);
    const fileInputRef = ref(null);
    const selectedImage = ref(null);
    const filterStatus = ref('');
    const editingImageId = ref(null);
    const liquidation = ref([]);
    const search = ref('');
    const showAssetsDetailModal = ref(false);
    const showAssetsEditModal = ref(false);
    const showAssetsLiquidationModal = ref(false);
    const currentPage = ref(1);
    const itemPage = 12;
    const authStore = useAuthStore();

    const user = computed(() => authStore.user);

    const triggerFileInput = (id) => {
        editingImageId.value = id;
        if (fileInputRef.value) {
            fileInputRef.value.click();
        }
    };

    const handleFileChange = async (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;

        try {
            if (editingImageId.value) {
                const file = files[0];
                const formData = new FormData();
                formData.append('image', file);
                await apiClient.put(`image/${editingImageId.value}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                for (const file of files) {
                    const formData = new FormData();
                    formData.append('image', file);
                    formData.append('id_collateral', assetDetail.value.id);
                    await apiClient.post(`image`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }
            }
            await fetchAssetDetail(assetDetail.value.id);
        } catch (error) {
            console.error('Error handling image upload:', error);
        } finally {
            editingImageId.value = null; 
            event.target.value = ''; 
        }
    };

    const openAssetsDetailModal = (id) => {
        fetchAssetDetail(id);
        showAssetsDetailModal.value = true;
    }

    const closeAssetsDetailModal = () => {
        showAssetsDetailModal.value = false;
    }

    const openAssetsEditModal = (id) => {
        fetchAssetDetail(id);
        showAssetsEditModal.value = true;
    }

    const closeAssetsEditModal = () => {
        showAssetsEditModal.value = false;
    }

    const openAssetsLiquidationModal = (id) => {
        fetchLiquidationById(id);
        showAssetsLiquidationModal.value = true;
    }

    const closeAssetsLiquidationModal = () => {
        showAssetsLiquidationModal.value = false;
    }

    const filteredAssets = computed(() => {
        let result = assets.value;
        
        if (search.value.trim()) {
            const searchTerm = search.value.trim().toLowerCase();
            result = result.filter(asset => {
                const searchFields = [
                    asset.code,
                    asset.name,
                    asset.contract_code,
                    asset.customer_name,
                    asset.customer_phone,
                ];
                return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
            });
        }

        if (filterStatus.value) {
            result = result.filter(asset => String(asset.status).toLocaleLowerCase() === String(filterStatus.value).toLocaleLowerCase());
        }
        return result;
    })

    const paginatedAssets = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return sortedAssets.value.slice(start, end);
    })

    const pageNumbers = computed(() => {
        const total = totalPage.value;
        const current = currentPage.value;
        const maxVisible = 5;
        if (!total) return []
        if (total <= maxVisible) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }
        
        const half = Math.floor(maxVisible / 2);
        let start = current - half;
        let end = current + half;

        if (start < 1) {
            start = 1;
            end = maxVisible;
        }

        if (end > total) {
            end = total;
            start = total - maxVisible + 1;
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);

    })

    const totalPage = computed(() => {
        return Math.ceil(filteredAssets.value.length / itemPage);
    })

    const sortConfig = ref({
        key: 'code',
        direction: 'asc'
    });

    const handleSort = (key) => {
        if (sortConfig.value.key === key) {
            sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.value.key = key;
            sortConfig.value.direction = 'asc';
        }
    }

    const sortedAssets = computed(() => {
        const list = [...filteredAssets.value];
        const { key, direction } = sortConfig.value;
        list.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            // So sánh số cho STT (index), còn lại so sánh string
            if (typeof valA === 'number' && typeof valB === 'number') {
                return direction === 'asc' ? valA - valB : valB - valA;
            }
            valA = String(valA ?? '').toLowerCase();
            valB = String(valB ?? '').toLowerCase();
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        return list;
    });

    const changePage = ( page) => {
        if (page >= 1 && page <= totalPage.value){
            currentPage.value = page;
        }
    };

    const goToFirstPage = () => {
        currentPage.value = 1;
    };

    const goToNextPage = () => {
        if (currentPage.value < totalPage.value) {
            currentPage.value++;
        }
    };

    const goToPrevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const goToLastPage = () => {
        currentPage.value = totalPage.value;
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const parseMetadata = computed(() => {
        try {
            return assetDetail.value?.metadata ? JSON.parse(assetDetail.value.metadata) : [];
        } catch (e) {
            console.error("Lỗi parse metadata:", e);
            return [];
        }
    })

    const parseImages = computed(() => {
        try {
            return assetDetail.value?.images ? JSON.parse(assetDetail.value.images) : [];
        } catch (e) {
            console.error("Lỗi parse images:", e);
            return [];
        }
    })

    const submitUpdateAsset = async () => {
        const payload = {
            name: assetDetail.value.name,
            metadata: JSON.stringify(parseMetadata.value),
        }
        try {
            await apiClient.put(`collateral/${assetDetail.value.id}`, payload)
            await fetchAssets()
            closeAssetsDetailModal()
        } catch (error) {
            console.error('Error updating asset:', error)
        }
    }

    const submitLiquidation = async () => {
        const payload = {
            amount: liquidation.value.price,
            id_collateral: liquidation.value.id,
            id_contract: liquidation.value.id_contract,
            id_staff: user.value.id
        }
        try {
            await apiClient.post(`transaction/liquidation`,payload)
            await fetchAssets()
            closeAssetsLiquidationModal()
        } catch (error) {
            console.error('Error fetching liquidation:', error)
        }
    }

    const fetchAssets = async () => {
        try {
            const response = await apiClient.get('collateral')
            assets.value = response.data.map(item => {
                let schedule = item.payment_schedules
                if (typeof schedule === 'string'){
                    try {
                        schedule = JSON.parse(schedule);
                    } catch (error) {
                        schedule = []
                    }
                }
                if (Array.isArray(schedule)) {
                    // Tìm ngày của kỳ đóng lãi đầu tiên chưa thanh toán
                    item.payment_schedules = schedule
                        .filter(s => s.is_paid === 0)[0]?.expected_date || null;
                } else {
                    item.payment_schedules = null;
                }
                return item
            })
            
            console.log(assets.value)
        } catch (error) {
            console.error('Error fetching assets:', error)
        }
    }
    const fetchAssetDetail = async (id) => {
        try{
            const response = await apiClient.get(`collateral/${id}`)
            assetDetail.value = response.data
        }catch(error){
            console.error('Error fetching asset detail:', error)
        }
    }

    const fetchLiquidationById = async (id) => {
        try {
            const response = await apiClient.get(`collateral/liquidation/${id}`)
            liquidation.value = response.data
            console.log(liquidation.value)
        } catch (error) {
            console.error('Error fetching liquidation:', error)
        }
    }

    watch([search, filterStatus], () => {
        currentPage.value = 1;
    });

    return {
        //state
        assets, search, sortConfig, currentPage, itemPage, totalPage, paginatedAssets, showAssetsLiquidationModal, 
        liquidation, user, showAssetsDetailModal, assetDetail, selectedImage, fileInputRef, editingImageId, filterStatus,
        showAssetsEditModal,
        //computed
        filteredAssets, sortedAssets, parseMetadata, parseImages, pageNumbers,
        //action
        fetchAssets, formatCurrency, handleSort, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage,
        openAssetsLiquidationModal, closeAssetsLiquidationModal, fetchLiquidationById, submitLiquidation,
        openAssetsDetailModal, closeAssetsDetailModal, fetchAssetDetail, triggerFileInput, handleFileChange,
        submitUpdateAsset, openAssetsEditModal, closeAssetsEditModal
    }
});