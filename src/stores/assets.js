import { defineStore } from "pinia";
import { ref } from 'vue'
import apiClient from "@/plugins/axios";

export const useAssetsStore = defineStore("assets", () => {
    const assets = ref([])

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
        assets,
        fetchAssets, formatCurrency
    }
});