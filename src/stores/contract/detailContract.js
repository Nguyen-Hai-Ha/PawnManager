import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/plugins/axios'

export const useDetailContractStore = defineStore('detailContract', () => {
    const detailContract = ref(null)
    const showDetailContract = ref(false);

    const openDetailContract = (id) => {
        getDetailContract(id);
        showDetailContract.value = true;
    };

    const closeDetailContract = () => {
        showDetailContract.value = false;
    };

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const collateralmetadata = computed(() => {
        if (!detailContract.value?.collateral[0]) return [];
        
        return detailContract.value?.collateral[0].metadata ? JSON.parse(detailContract.value?.collateral[0].metadata) : [];
    })

    const collateralImages = computed(() => {
        if (!detailContract.value?.collateral[0]) return [];
        
        let images = detailContract.value?.collateral[0].images;
        if (typeof images === 'string') {
            try {
                return JSON.parse(images);
            } catch (e) {
                return [];
            }
        }
        return images || [];
    })

    const getDetailContract = async (id) => {
        try {
            const response = await apiClient.get(`/contract/${id}`);
            if (response.data.paymentSchedules) {
                response.data.paymentSchedules = response.data.paymentSchedules.map(item => {
                    // 1. Lấy dữ liệu history
                    let historyArr = [];
                    try {
                        historyArr = typeof item.payment_history === 'string'
                            ? JSON.parse(item.payment_history)
                            : (item.payment_history || []);

                        historyArr = Array.isArray(historyArr) ? historyArr.filter(p => p && p.amount > 0) : [];
                    } catch (e) { historyArr = []; }
                    item.display_history = historyArr
                        .map(p => `${formatCurrency(p.amount)} - (${p.created_at})`)
                        .join(', ');

                    return item;
                });
            }
            detailContract.value = response.data;
        } catch (error) {
            console.error('Error fetching detail contract:', error);
        }
    };

    return {
        //state
        showDetailContract, detailContract,

        //computed
        collateralmetadata, collateralImages,

        //actions
        openDetailContract, closeDetailContract, formatCurrency, 

        //fetch
        getDetailContract
    };
});