import { defineStore } from 'pinia';
import apiClient from '@/plugins/axios';
import { ref, computed, watch } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref([]);
    const staffs = ref([]);
    const transactionTypes = ref([]);
    const contractTypes = ref([]);
    const itemPage = 12;
    const currentPage = ref(1);
    const search = ref('');
    const filterDate = ref('');
    const Staff = ref('');
    const TransactionType = ref('');
    const ContractType = ref('');

    const changePage = ( page) => {
        if (page >= 1 && page <= totalPage.value) {
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
        return Math.ceil(filtedTransaction.value.length / itemPage);
    });

    const filtedTransaction = computed(() => {
        let result = transactions.value;
        if (search.value.trim()) {
            const searchTerm = search.value.trim().toLowerCase();

            result = result.filter(transaction => {
                const searchFields = [
                    transaction.contract_code,
                    transaction.customer_name,
                    transaction.customer_cccd,
                    transaction.staff_name,
                ];
                return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
            });
        }
        
        if (filterDate.value) {
            const startDate = new Date(filterDate.value);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(filterDate.value);
            endDate.setHours(23, 59, 59, 999);
            
            result = result.filter(transaction => {
                const txDate = new Date(transaction.created_at);
                return txDate >= startDate && txDate <= endDate;
            });
        }
        if (Staff.value) {
            result = result.filter(transaction => String(transaction.staff_name).toLowerCase() === String(Staff.value).toLowerCase());
        }
        if (TransactionType.value) {
            result = result.filter(transaction => String(transaction.id_transaction_type).toLowerCase() === String(TransactionType.value).toLowerCase());
        }
        if (ContractType.value) {
            result = result.filter(transaction => String(transaction.contract_type_id).toLowerCase() === String(ContractType.value).toLowerCase());
        }
        return result;
    });

    const sortConfig = ref({
        key: 'id',
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
        const list = [...filtedTransaction.value];
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

    const fetchStaffs = async () => {
        const response = await apiClient.get('/staff');
        staffs.value = response.data;
    };

    const fetchTransactionTypes = async () => {
        const response = await apiClient.get('/transaction_type');
        transactionTypes.value = response.data;
    };

    const fetchContractTypes = async () => {
        const response = await apiClient.get('/contracts_type');
        contractTypes.value = response.data;
    };

    watch([search, filterDate, Staff, TransactionType, ContractType], () => {
        currentPage.value = 1;
    });

    return {
        //state
        transactions, sortConfig, totalPage, currentPage, itemPage, search, filterDate, Staff, TransactionType, ContractType,
        staffs, transactionTypes, contractTypes,
        //computed
        sortedTransactions, paginated, filtedTransaction,
        //function
        formatCurrency, fetchTransactions, handleSort, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage,
        fetchStaffs, fetchTransactionTypes, fetchContractTypes
    }
});