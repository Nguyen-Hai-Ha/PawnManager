import { defineStore } from "pinia";
import { ref, computed } from 'vue'
import apiClient from "@/plugins/axios";

export const useAssetsStore = defineStore("assets", () => {
    const assets = ref([]);
    const search = ref('');
    const currentPage = ref(1);
    const itemPage = 12;

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

    const fetchAssets = async () => {
        try {
            const response = await apiClient.get('collateral')
            assets.value = response.data
        } catch (error) {
            console.error('Error fetching assets:', error)
        }
    }

    return {
        //state
        assets, search, sortConfig, currentPage, itemPage, totalPage, paginatedAssets,
        //computed
        searchAssets, sortedAssets, 
        //action
        fetchAssets, formatCurrency, handleSort, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage
    }
});