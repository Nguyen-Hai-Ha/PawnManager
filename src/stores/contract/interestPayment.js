import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { useAuthStore } from '../auth';
import { useLoanStore } from '../loan';
import { useFinalSettlementStore } from './finalSettlement';
import { useReducePrincipalStore } from './reducePrincipal';
import { ref, nextTick, computed } from "vue";

export const useInterestPayment = defineStore('interestPayment', () => {
    const loanStore = useLoanStore();
    const finalSettlementStore = useFinalSettlementStore();
    const reducePrincipalStore = useReducePrincipalStore();
    const loanDetails = ref([]);
    const paymentDetails = ref([]);
    const historyPayment = ref([]);
    const showInterestModal = ref(false);
    const authStore = useAuthStore();
    const staffId = computed(() => authStore.user.id);
    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const StartDate = computed(() => {
        return new Date().toISOString().split('T')[0];
    })

    const schedule = computed(() => {
        const list = paymentDetails.value.paymentDetails;

        if (!Array.isArray(list)) {
            return null;
        }
        const firstUnpaid = list.find(item => item.is_paid === 0);
        
        return firstUnpaid? firstUnpaid : null;
    })
    
    const formDetails = ref({
        payment_date: StartDate.value,
        customer_name: '',
        payment_amount: '',
        other_fees: '',
        note: '',
        id_schedule: '',
        id_contract: '',
        id_transaction_type: '',
        id_staff: staffId.value,
    });

    const openInterestModal = (id) => {
        finalSettlementStore.closeFinalModal();
        reducePrincipalStore.closeReducePrincipalModal();
        showInterestModal.value = true;
        fetchPaymentDetails(id);

        nextTick(() => {
            const firstInput = document.getElementById('payment_amount');
            if (firstInput) {
                firstInput.focus();
            }
        })
    };

    const closeInterestModal = () => {
        formDetails.value = {
            payment_date: '',
            customer_name: '',
            payment_amount: '',
            other_fees: '',
            note: '',
            id_schedule: '',
            id_contract: '',
            id_transaction_type: '',
            id_staff: '',
        };
        paymentDetails.value = [];
        showInterestModal.value = false;
    };

    const submitInterestPayment = async () => {
        const payload = {
            amount: parseInt(formDetails.value.payment_amount),
            other_fees: parseInt(formDetails.value.other_fees),
            description: formDetails.value.note,
            id_contract: formDetails.value.id_contract,
            id_transaction_type: 2,
            id_staff: staffId.value,
            id_schedule: schedule.value.id
        }
        try {
            const response = await apiClient.post('/transaction', payload);
            await loanStore.getAllLoans();
            closeInterestModal();
        } catch (error) {
            console.error('Error submitting interest payment:', error);
        }
    }

    const fetchPaymentDetails = async (id) => {
        try {
            const response = await apiClient.get(`/contract/${id}/payment-details`);
            if (response.data.paymentDetails) {
                response.data.paymentDetails = response.data.paymentDetails.map(item => {
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
            paymentDetails.value = response.data;
            formDetails.value.id_contract = response.data.contract.id;
            formDetails.value.customer_name = response.data.customer.name;
            formDetails.value.payment_amount = schedule.value?.remaining_amount;

            await fetchContractDetails(id);
            await fetchHistoryPayment(id);
        } catch (error) {
            console.error('Error fetching payment details:', error);
        }
    };

    const fetchContractDetails = async (id) => {
        try {
            const response = await apiClient.get(`/contract/${id}`);
            loanDetails.value = response.data;
        } catch (error) {
            console.error('Error fetching contract details:', error);
        }
    };

    const fetchHistoryPayment = async (id) => {
        try {
            const response = await apiClient.get(`/transaction/schedule/${id}`);
            historyPayment.value = response.data;
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
    };

    return {
        //state
        paymentDetails, formDetails, loanDetails, historyPayment, showInterestModal,

        //computed
        StartDate, schedule,

        //actions
        openInterestModal, closeInterestModal, submitInterestPayment, formatCurrency,

        //fetch
        fetchPaymentDetails, fetchContractDetails, fetchHistoryPayment,
    }
})