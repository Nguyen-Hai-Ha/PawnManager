import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { useAuthStore } from './auth';
import { ref, nextTick, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

export const useLoanStore = defineStore("loan", () => {
    const route = useRoute();
    const itemPage = 8;
    const currentPage = ref(1);
    const search = ref('');

    const paginated = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return searchLoans.value.slice(start, end);
    });

    const totalPage = computed(() => {
        return Math.ceil(searchLoans.value.length / itemPage);
    });

    const changePage = ( page) => {
        if (page >= 1 && page < totalPage){
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

    const searchLoans = computed (() => {
        if (!search.value.trim()) {
            return loans.value;
        }
        const searchTerm = search.value.trim().toLowerCase();

        return loans.value.filter(loan => {
            const searchFields = [
                loan.code,
                loan.customer_name,
                loan.collateral_name,
            ];
            return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
        });
    })

    const pageTitles = {
        'AdminLoanPawn': 1,
        'AdminRepayments': 3,
        'AdminPledges': 2
    };
    const id_contract_type = computed(() => pageTitles[route.name]);

    const status = computed(() => id_contract_type.value === 1 ? "Đang cầm" : "Đang vay");

    const code = computed(() => {
        const prefix = id_contract_type.value === 1 ? "C" : "V";

        if (loans.value.length === 0) {
            return `${prefix}0001`
        }

        const lastCode = loans.value[loans.value.length - 1].code;

        const lastNumber = parseInt(lastCode.replace(/\D/g, "")) || 0;

        const nextNumber = lastNumber + 1;
        return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
    });

    const loanDetails = ref([]);
    const loans = ref([]);
    const customers = ref([]);
    const assetTypes = ref([]);
    const assets = ref({
        name: '',
        metadata: {},
        id_type: ''
    });
    const loan = ref({
        code: code.value,
        loan_amount: '',
        interest_rate: '',
        start_date: '',
        end_date: '',
        payment_term: '',
        term_unit: '',
        total_periods: '',
        interest_type: '',
        id_customer: '',
    });

    const paymentDetails = ref([]);
    
    const images = ref([]);
    const imagePreviews = ref([]);
    const showModal = ref(false);
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

    const EndDate = computed(() => {
        const { payment_term, total_periods, term_unit } = loan.value;
        const start_date = StartDate.value;

        if (start_date && payment_term && term_unit && total_periods) {
            const pTerm = parseInt(payment_term);
            const tPeriods = parseInt(total_periods);
            const totalDuration = pTerm * tPeriods;

            let date = dayjs(start_date);

            if (term_unit === 'Ngày') {
                date = date.add(totalDuration, 'day');
            } else if (term_unit === 'Tháng') {
                date = date.add(totalDuration, 'month');
            }

            return date.format('YYYY-MM-DD');
        }
        return '';
    });

    const countDaysBetween = (startDate, endDate) => {
        const start = dayjs(startDate);
        const end = dayjs(endDate);
        return end.diff(start, 'day');
    }

    const TotalInterest = computed(() => {
        const { loan_amount, interest_rate, interest_type, total_periods, term_unit, payment_term } = loan.value;
        const LoanAmount = parseFloat(loan_amount);
        const InterestRate = parseFloat(interest_rate);
        const TotalPeriods = parseInt(total_periods);
        const PaymentTerm = parseInt(payment_term);
        const days = countDaysBetween(StartDate.value, EndDate.value);

        if (!LoanAmount || !InterestRate || !TotalPeriods || !PaymentTerm) {
            return 0;
        }

        if (interest_type === 'percent*term') {
            return ((LoanAmount * InterestRate / 100) * TotalPeriods);
        } else if (interest_type === 'percent/term') {
            return ((LoanAmount * InterestRate / 100));
        } else if (interest_type === 'daily_amount') {
            if (term_unit === 'Ngày') {
                return (InterestRate * (TotalPeriods * PaymentTerm));
            } else if (term_unit === 'Tháng') {
                return (InterestRate * days);
            }
        }
    })

    const revokeImages = () => {
        imagePreviews.value.forEach((url) => URL.revokeObjectURL(url));
        imagePreviews.value = [];
        images.value = [];
    }

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (!files.length) return;
        revokeImages();
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        images.value.push(...files);
        imagePreviews.value = [...newPreviews];

        event.target.value = '';
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(imagePreviews.value[index]);
        images.value.splice(index, 1);
        imagePreviews.value.splice(index, 1);
    };

    onBeforeUnmount(() => {
        revokeImages();
    });

    const openModal = () => {
        showModal.value = true;
        nextTick(() => {
            const firstInput = document.getElementById('assets_name');
            if (firstInput) {
                firstInput.focus();
            }
        })
    };

    const closeModal = () => {
        assets.value = {
            name: '',
            metadata: {},
            id_type: ''
        };
        revokeImages();
        showModal.value = false;
    };

    const openInterestModal = (id) => {
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
            payment_date: StartDate.value,
            customer_name: '',
            payment_amount: '',
            other_fees: '',
            note: '',
            id_schedule: '',
            id_contract: '',
            id_transaction_type: '',
            id_staff: staffId.value,
        };
        paymentDetails.value = [];
        showInterestModal.value = false;
    };

    const submitLoan = async () => {
        const payload = {
            contract: {
                code: loan.value.code,
                loan_amount: loan.value.loan_amount,
                interest_rate: loan.value.interest_rate,
                start_date: StartDate.value,
                end_date: EndDate.value,
                payment_term: loan.value.payment_term,
                term_unit: loan.value.term_unit,
                total_periods: loan.value.total_periods,
                interest_type: loan.value.interest_type,
                status: status.value,
                id_customer: loan.value.id_customer,
                id_contract_type: id_contract_type.value
            },
            collateral: {
                name: assets.value.name,
                metadata: JSON.stringify(assets.value.metadata),
                status: 'Đang cầm',
                id_collateral_type: assets.value.id_type
            },
            images: { images: images.value },
            staff: { id: staffId.value }
        }
        try {
            const response = await apiClient.post('/contract', payload);
            await getAllLoans();
            closeModal();
        } catch (error) {
            console.error('Error submitting loan:', error);
        }
    }

    const submitInterestPayment = async () => {
        const payload = {
            amount: parseInt(formDetails.value.payment_amount),
            other_fee: parseInt(formDetails.value.other_fees),
            id_contract: formDetails.value.id_contract,
            id_transaction_type: 2,
            id_staff: staffId.value,
            id_schedule: schedule.value.id
        }
        console.log(payload);
        try {
            const response = await apiClient.post('/transaction', payload);
            await getAllLoans();
            closeInterestModal();
        } catch (error) {
            console.error('Error submitting interest payment:', error);
        }
    }

    const getAllLoans = async () => {
        try {
            const response = await apiClient.get('/contract');
            loans.value = response.data;
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const fetchCustomer = async () => {
        try {
            const response = await apiClient.get('/customer');
            customers.value = response.data;
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchAssetTypes = async () => {
        try {
            const response = await apiClient.get('/collateral_type');
            assetTypes.value = response.data;
        } catch (error) {
            console.error('Error fetching asset types:', error);
        }
    }

    const fetchPaymentDetails = async (id) => {
        try {
            const response = await apiClient.get(`/contract/${id}/payment-details`);
            await fetchContractDetails(id);
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
                        .map(p => `${formatCurrency(p.amount)} (${p.created_at})`)
                        .join(', ');

                    return item;
                });
            }
            paymentDetails.value = response.data;
            formDetails.value.id_contract = response.data.contract.id;
            formDetails.value.customer_name = response.data.customer.name;
            formDetails.value.payment_amount = schedule.value?.remaining_amount;
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
    

    return {
        //state
        loans, customers, assetTypes, assets, images, imagePreviews, showModal, loan, status,
        showInterestModal, paymentDetails, formDetails, search, paginated, totalPage, currentPage,
        loanDetails,

        //computed
        StartDate, EndDate, TotalInterest, id_contract_type, schedule, searchLoans,  

        //actions
        formatCurrency, handleImageChange, openModal, closeModal, removeImage, submitLoan,
        openInterestModal, closeInterestModal, submitInterestPayment, fetchContractDetails,
        changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage, 

        //fetch
        getAllLoans,
        fetchCustomer,
        fetchAssetTypes,
        fetchPaymentDetails
    }
});