import { defineStore } from 'pinia';
import apiClient from '@/plugins/axios';
import { ref, computed } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref([]);
    const itemPage = 12;
    const currentPage = ref(1);
    const search = ref('');

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

    const paginated = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return sortedTransactions.value.slice(start, end);
    });

    const totalPage = computed(() => {
        return Math.ceil(searchTransactions.value.length / itemPage);
    });

    const searchTransactions = computed(() => {
        if (!search.value.trim()) {
            return transactions.value;
        }
        const searchTerm = search.value.trim().toLowerCase();

        return transactions.value.filter(transaction => {
            const searchFields = [
                transaction.contract_code,
                transaction.customer_name,
                transaction.customer_cccd,
                transaction.staff_name,
            ];
            return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
        });
    });

    const sortConfig = ref({
        key: 'created_at',
        direction: 'desc'   
    });

    const handleSort = (key) => {
        if (sortConfig.value.key === key) {
            sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.value.key = key;
            sortConfig.value.direction = 'asc';
        }
    }

    const sortedTransactions = computed(() => {
        const list = [...searchTransactions.value];
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

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const fetchTransactions = async () => {
        const response = await apiClient.get('/transaction');
        transactions.value = response.data;
    };

    return {
        transactions, sortConfig, totalPage, currentPage, itemPage, search,
        sortedTransactions, paginated, searchTransactions,
        formatCurrency, fetchTransactions, handleSort, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage
    }
});