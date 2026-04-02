import { defineStore } from "pinia";
import { ref, computed } from 'vue'
import apiClient from "@/plugins/axios";
import { useAuthStore } from "./auth";

export const useAssetsStore = defineStore("assets", () => {
    const assets = ref([]);
    const assetDetail = ref([]);
    const fileInputRef = ref(null);
    const selectedImage = ref(null);
    const editingImageId = ref(null);
    const liquidation = ref([]);
    const search = ref('');
    const showAssetsDetailModal = ref(false);
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

    const openAssetsLiquidationModal = (id) => {
        fetchLiquidationById(id);
        showAssetsLiquidationModal.value = true;
    }

    const closeAssetsLiquidationModal = () => {
        showAssetsLiquidationModal.value = false;
    }

    const searchAssets = computed(() => {
        if (!search.value.trim()) {
            return assets.value;
        }
        const searchTerm = search.value.trim().toLowerCase();

        return assets.value.filter(asset => {
            const searchFields = [
                asset.code,
                asset.name,
                asset.contract_code,
                asset.customer_name,
                asset.customer_phone,
            ];
            return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
        });
    })

    const paginatedAssets = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return sortedAssets.value.slice(start, end);
    })

    const totalPage = computed(() => {
        return Math.ceil(searchAssets.value.length / itemPage);
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
        const list = [...searchAssets.value];
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
        if (page >= 1 && page < totalPage){
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

    const submitLiquidation = async () => {
        const payload = {
            amount: liquidation.value.price,
            id_collateral: liquidation.value.id,
            id_contract: liquidation.value.id_contract,
            id_staff: user.value.id
        }
        console.log(payload)
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
            assets.value = response.data
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

    return {
        //state
        assets, search, sortConfig, currentPage, itemPage, totalPage, paginatedAssets, showAssetsLiquidationModal, 
        liquidation, user, showAssetsDetailModal, assetDetail, selectedImage, fileInputRef, editingImageId,
        //computed
        searchAssets, sortedAssets, parseMetadata, parseImages,
        //action
        fetchAssets, formatCurrency, handleSort, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage,
        openAssetsLiquidationModal, closeAssetsLiquidationModal, fetchLiquidationById, submitLiquidation,
        openAssetsDetailModal, closeAssetsDetailModal, fetchAssetDetail, triggerFileInput, handleFileChange
    }
});