import { defineStore } from 'pinia';
import apiClient from '@/plugins/axios';
import { ref } from 'vue';

export const useTransactionStore = defineStore('transaction', () => {
    const transactions = ref([]);

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
        transactions,
        formatCurrency, fetchTransactions
    }
});