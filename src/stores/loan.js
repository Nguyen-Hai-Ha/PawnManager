import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref, nextTick, onBeforeUnmount, computed } from "vue";

export const useLoanStore = defineStore("loan", () => {
    const itemPage = 8;
    const currentPage = ref(1);
    const search = ref('');

    const paginated = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return sortedLoans.value.slice(start, end);
    });

    const totalPage = computed(() => {
        return Math.ceil(sortedLoans.value.length / itemPage);
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

    const searchLoans = computed (() => {
        if (!search.value.trim()) {
            return loans.value;
        }
        const searchTerm = search.value.trim().toLowerCase();

        return loans.value.filter(loan => {
            const searchFields = [
                loan.code,
                loan.customer_name,
                loan.collateral_name,
            ];
            return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
        });
    })

    const sortedLoans = computed(() => {
        const list = [...searchLoans.value];
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

    const loans = ref([]);
    const customers = ref([]);
    const assetTypes = ref([]);
    const assets = ref({
        name: '',
        metadata: {},
        id_type: ''
    });

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

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const getAllLoans = async () => {
        try {
            const response = await apiClient.get('/contract');
            loans.value = response.data;
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const fetchCustomer = async () => {
        try {
            const response = await apiClient.get('/customer');
            customers.value = response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchAssetTypes = async () => {
        try {
            const response = await apiClient.get('/collateral_type');
            assetTypes.value = response.data;
        } catch (error) {
            console.error('Error fetching asset types:', error);
        }
    }

    return {
        //state
        loans, customers, assetTypes, assets, search, paginated, totalPage, currentPage,
        

        //computed
       searchLoans, sortConfig,

        //actions
        formatCurrency, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage, handleSort,
        

        //fetch
        getAllLoans,
        fetchCustomer,
        fetchAssetTypes,
    }
});