import { defineStore } from 'pinia';
import { ref } from 'vue';
// import { apiClient } from '@/plugins/axios'

export const useDetailContractStore = defineStore('detailContract', () => {
    const showDetailContract = ref(false);

    const openDetailContract = () => {
        showDetailContract.value = true;
    };

    const closeDetailContract = () => {
        showDetailContract.value = false;
    };

    return {
        //state
        showDetailContract,

        //actions
        openDetailContract, closeDetailContract
    };
});