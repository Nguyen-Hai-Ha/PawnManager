import { defineStore } from 'pinia';
import apiClient from '@/plugins/axios';
import { ref, computed } from 'vue';

export const useDashboardStore = defineStore('dashboard', () => {
    const summary = ref({
        stats: {
            transactions: { today: 0, compare: 0 },
            loans: { count: 0, amount: 0 },
            collected: { count: 0, amount: 0 },
            fund: 0
        },
        loanSummary: [],
        projected: { paid: 0, unpaid: 0, percent: 0 }
    });

    const loading = ref(false);

    const fetchSummary = async () => {
        loading.value = true;
        try {
            const response = await apiClient.get('/dashboard/summary');
            summary.value = response.data;
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
        } finally {
            loading.value = false;
        }
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';
        return new Intl.NumberFormat('vi-VN').format(amount);
    };

    const todayDateStr = computed(() => {
        const d = new Date();
        return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    const currentMonthYearStr = computed(() => {
        const d = new Date();
        return `${d.getMonth() + 1}/${d.getFullYear()}`;
    });

    return {
        summary,
        loading,
        fetchSummary,
        formatCurrency,
        todayDateStr,
        currentMonthYearStr
    };
});
