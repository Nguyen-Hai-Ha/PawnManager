import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { useAuthStore } from '../auth';
import { ref, nextTick, onBeforeUnmount, computed } from "vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";

export const useAddNewLoanStore = defineStore('addNewLoan', () => {
    const loans = ref([]);
    const customers = ref([]);
    const assetTypes = ref([]);
    const assets = ref({
        name: '',
        metadata: {},
        id_type: ''
    });
    const loan = ref({
        code: '',
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
    const images = ref([]);
    const imagePreviews = ref([]);
    const showModal = ref(false);
    const route = useRoute();
    const pageTitles = {
        'AdminLoanPawn': 1,
        'AdminPledges': 2,
        'AdminRepayments': 3
    }
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

    const openModal = async () => {
        await getAllLoans(); // fetch danh sách mới nhất để tính code chính xác
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
        loan.value = {
            code: '',
            loan_amount: '',
            interest_rate: '',
            start_date: '',
            end_date: '',
            payment_term: '',
            term_unit: '',
            total_periods: '',
            interest_type: '',
            id_customer: '',
        };
        revokeImages();
        showModal.value = false;
    };

    const submitLoan = async () => {
        const formData = new FormData();

        // Append contract fields
        const contractData = {
            code: code.value,
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
        }
        formData.append('contract', JSON.stringify(contractData));

        const collateralData = {
            name: assets.value.name,
            metadata: JSON.stringify(assets.value.metadata),
            status: 'Đang cầm',
            id_collateral_type: assets.value.id_type
        };
        formData.append('collateral', JSON.stringify(collateralData));

        const staffData = {
            id: staffId.value,
        };
        formData.append('staff', JSON.stringify(staffData));

        images.value.forEach((file) => {
            formData.append('images', file);
        });

        try {
            const response = await apiClient.post('/contract', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await getAllLoans();
            closeModal();
        } catch (error) {
            console.error('Error submitting loan:', error);
        }
    }

    const getAllLoans = async () => {
        try {
            const response = await apiClient.get(`/contract/type/${id_contract_type.value}`);
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

    return {
        //state
        loans, customers, assetTypes, assets, images, imagePreviews, showModal, loan, status, pageTitles,

        //computed
        StartDate, EndDate, TotalInterest, id_contract_type,

        //actions
        formatCurrency, handleImageChange, openModal, closeModal, removeImage, submitLoan,

        //fetch
        getAllLoans,
        fetchCustomer,
        fetchAssetTypes,
    }
})