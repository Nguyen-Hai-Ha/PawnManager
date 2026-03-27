import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref } from "vue";

export const useLoanStore = defineStore("loan", () => {
    const loans = ref([]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const getAllLoans = async () => {
        try {
            const response = await apiClient.get('/contract');
            loans.value = response.data;
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    return {
        loans,
        formatCurrency,
        getAllLoans
    }
});