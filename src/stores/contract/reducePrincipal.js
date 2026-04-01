import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref, nextTick, computed } from "vue";
import { useAuthStore } from '../auth';
import { useLoanStore } from '../loan';

import { useInterestPayment } from "./interestPayment";
import { useFinalSettlementStore } from "./finalSettlement";

export const useReducePrincipalStore = defineStore('reducePrincipal', () => {
    const loanStore = useLoanStore();
    const showReducePrincipalModal = ref(false);
    const id_contract = ref(null);
    const interestPaymentStore = useInterestPayment();
    const finalSettlementStore = useFinalSettlementStore();
    const paymentDetails = ref([]);
    const historyReducePrincipal = ref([]);

    const authStore = useAuthStore();
    const user = computed(() => authStore.user);
    
    const StartDate = computed(() => {
        return new Date().toISOString().split('T')[0];
    })

    const formReducePrincipal = ref({
        id_contract: '',
        amount: 0,
        other_fees: 0,
        id_staff: user.value.id,
        payment_date: StartDate.value,
        interest_rate: 0,
        note: '',
    })

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const openReducePrincipalModal = async (id) => {
        interestPaymentStore.closeInterestModal(); 
        finalSettlementStore.closeFinalModal();
        id_contract.value = id;
        await fetchPaymentDetails(id);
        showReducePrincipalModal.value = true;

        nextTick(() => {
            const firstInput = document.getElementById('payment_amount');
            firstInput.focus();
        })
    }

    const closeReducePrincipalModal = () => {
        showReducePrincipalModal.value = false;
        id_contract.value = null;
    }

    const submitReducePrincipal = async () => {
        const payload = {
            id_contract: formReducePrincipal.value.id_contract,
            amount: formReducePrincipal.value.amount,
            other_fees: formReducePrincipal.value.other_fees,
            id_staff: user.value.id,
            payment_date: formReducePrincipal.value.payment_date,
            interest_rate: formReducePrincipal.value.interest_rate,
            note: formReducePrincipal.value.note,
        }
        console.log(payload);
        try {
            const response = await apiClient.post('/transaction/reduce-principal', payload);
            await loanStore.getAllLoans();
            closeReducePrincipalModal();
        } catch (error) {
            console.error('Error submitting reduce principal:', error);
        }
    }

    const fetchPaymentDetails = async (id) => {
        try {
            const response = await apiClient.get(`/contract/${id}/payment-details`);
            paymentDetails.value = response.data;
            formReducePrincipal.value.id_contract = paymentDetails.value.contract.id;
            fetchHistoryReducePrincipal(id);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        }
    };

    const fetchHistoryReducePrincipal = async (id) => {
        try {
            const response = await apiClient.get(`/transaction/history/reduce-principal/${id}`);
            historyReducePrincipal.value = response.data;
        } catch (error) {
            console.error('Error fetching history reduce principal:', error);
        }
    };

    return {
        //state
        showReducePrincipalModal, id_contract, paymentDetails, StartDate, formReducePrincipal, user, historyReducePrincipal,

        //action
        openReducePrincipalModal, closeReducePrincipalModal, formatCurrency, 

        //fetch
        submitReducePrincipal, fetchPaymentDetails, fetchHistoryReducePrincipal
    }
})