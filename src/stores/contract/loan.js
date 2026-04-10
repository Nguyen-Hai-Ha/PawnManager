import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

export const useLoanStore = defineStore("loan", () => {
    const itemPage = 8;
    const currentPage = ref(1);
    const search = ref('');
    const filterStatus = ref('');
    const startDate = ref('');
    const endDate = ref('');
    const route = useRoute();
    const pageTitles = {
        'AdminLoanPawn': 1,
        'AdminPledges': 2,
        'AdminRepayments': 3
    }

    const paginated = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return sortedLoans.value.slice(start, end);
    });

    const id_contract_type = computed(() => pageTitles[route.name]);

    const totalPage = computed(() => {
        return Math.ceil(sortedLoans.value.length / itemPage);
    });

    const changePage = ( page) => {
        if (page >= 1 && page <= totalPage){
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

    const filteredLoans = computed (() => {
        let result = loans.value;

        if (search.value.trim()) {
            const searchTerm = search.value.trim().toLowerCase();
            result = result.filter(loan => {
                const searchFields = [
                    loan.code,
                    loan.customer_name,
                    loan.collateral_name,
                ];
                return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
            });
        }

        if (filterStatus.value) {
            result = result.filter(loan => String(loan.status).toLowerCase() === String(filterStatus.value).toLowerCase());
        }

        if (startDate.value) {
            result = result.filter(loan => new Date(loan.start_date) >= new Date(startDate.value));
        }

        if (endDate.value) {
            const eDate = new Date(endDate.value);
            eDate.setHours(23, 59, 59, 999);
            result = result.filter(loan => new Date(loan.end_date) <= eDate);
        }

        return result;
    })

    const sortedLoans = computed(() => {
        const list = [...filteredLoans.value];
        const { key, direction } = sortConfig.value;
        list.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            // So sánh số cho STT (index), còn lại so sánh string
            if (typeof valA === 'number' && typeof valB === 'number') {
                return direction === 'asc' ? valA - valB : valB - valA;
            }
            valA = String(valA ?? '').toLowerCase();
            valB = String(valB ?? '').toLowerCase();
            if (valA < valB) return direction === 'asc' ? -1 : 1;
            if (valA > valB) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        return list;
    });

    const loans = ref([]);
    const customers = ref([]);
    const assetTypes = ref([]);
    const assets = ref({
        name: '',
        metadata: {},
        id_type: ''
    });

    const sortConfig = ref({
        key: 'code',
        direction: 'asc'
    });

    const handleSort = (key) => {
        if (sortConfig.value.key === key) {
            sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.value.key = key;
            sortConfig.value.direction = 'asc';
        }
    }

    const formatCurrency = (amount) => {
        if (amount === undefined || amount === null) return '0';

        const formattedAmount = new Intl.NumberFormat('ni-VN').format(amount);

        return `${formattedAmount} VNĐ`;
    }

    const deleteLoan = async (id) => {
        try {
            const response = await apiClient.delete(`/contract/${id}`);
            await getAllLoans();
        } catch (error) {
            console.error('Error deleting loan:', error);
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

    const handleExportExcel = async () => {
    try {
        const response = await apiClient.get('/contract/export', { responseType: 'blob', params: { id_contract_type: id_contract_type.value } });
        
        // Tạo link ảo để trình duyệt tự tải file về
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'DanhSachHopDong.xlsx'); // Tên file khi tải về
        document.body.appendChild(link);
        link.click();
        link.remove();
    } catch (error) {
        console.log("Lỗi xuất excel", error);
    }
}


    return {
        //state
        loans, customers, assetTypes, assets, search, filterStatus, startDate, endDate, paginated, totalPage, currentPage, pageTitles,
        

        //computed
        filteredLoans, sortConfig, id_contract_type,

        //actions
        formatCurrency, changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage, handleSort,
        

        //fetch
        getAllLoans,
        fetchCustomer,
        fetchAssetTypes,
        deleteLoan,
        handleExportExcel
    }
});