import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from "@/plugins/axios";
import { useAuthStore } from '../auth';
import { useLoanStore } from '../loan';
import { useInterestPayment } from './interestPayment';
import { useReducePrincipalStore } from './reducePrincipal';

export const useFinalSettlementStore = defineStore('finalSettlement', () => {
    const showFinalModal = ref(false)
    const settlementData = ref(null)

    const authStore = useAuthStore()
    const loanStore = useLoanStore()
    const interestPaymentStore = useInterestPayment()
    const reducePrincipalStore = useReducePrincipalStore()
    
    const staffId = computed(() => authStore.user.id);

    const openFinalModal = async (id) => {
        if (!id) return
        interestPaymentStore.closeInterestModal()
        reducePrincipalStore.closeReducePrincipalModal()
        await fetchSettlementDetail(id)
        showFinalModal.value = true
    }

    const fetchSettlementDetail = async (id) => {
        try {
            const response = await apiClient.get(`/contract/${id}/settlement-detail`);
            settlementData.value = response.data;
        } catch (error) {
            console.error('Error fetching settlement detail:', error);
        }
    }

    const closeFinalModal = () => {
        showFinalModal.value = false
    }

    const submitFinalSettlement = async (formData) => {
        const payload = {
            amount: settlementData.value.total_remaining,
            other_fees: parseInt(formData.other_fees),
            description: formData.note,
            id_contract: settlementData.value.contract.id,
            id_staff: staffId.value
        }

        try {
            await apiClient.post('/transaction/final-settlement', payload);
            await loanStore.getAllLoans();
            closeFinalModal();
        } catch (error) {
            console.error('Error submitting final settlement:', error);
        }
    }

    return {
        // state
        showFinalModal,
        settlementData,
        // action
        openFinalModal,
        closeFinalModal,
        fetchSettlementDetail,
        submitFinalSettlement
    }
});