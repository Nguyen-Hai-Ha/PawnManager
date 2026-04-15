import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import apiClient from '@/plugins/axios'
import { useInterestPayment } from './interestPayment';

export const useDetailContractStore = defineStore('detailContract', () => {
    const useInterestPaymentStore = useInterestPayment();
    const { paymentDetail } = storeToRefs(useInterestPaymentStore);
    const detailContract = ref(null)
    const showDetailContract = ref(false);
    const showSelectTemplate = ref(false);
    const templates = ref({});
    const typeTemplate = ref('');
    const loading = ref(false);

    const openDetailContract = (id) => {
        getDetailContract(id);
        showDetailContract.value = true;
    };

    const closeDetailContract = () => {
        showDetailContract.value = false;
    };

    const openSelectTemplate = (type) => {
        loading.value = true;
        typeTemplate.value = type
        showSelectTemplate.value = true;
        loading.value = false;
    };

    const closeSelectTemplate = () => {
        showSelectTemplate.value = false;
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

    const getAllTemplates = async () => {
        const response = await apiClient.get('/settings/templates');
        templates.value = response.data;
    }

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

    const filterTemplate = computed(() => {
        if (!templates.value || !Array.isArray(templates.value)) return [];
        return templates.value.filter(item => item.type === typeTemplate.value);
    })

    const SelectTemplate = async (id_template) => {
        closeSelectTemplate();
        if(typeTemplate.value === 'phieu_thu' && paymentDetail.value?.paymentDetail?.id) {
            await getTransactionPrint(paymentDetail.value?.paymentDetail?.id, id_template);
        } else {
            await getContractPrint(detailContract.value.contract.id, id_template);
        }
    }

    const getContractPrint = async (id, id_template) => {
        try {
            // Thêm responseType: 'blob' để Axios hiểu đây là file nhị phân
            const response = await apiClient.get(`/contract/${id}/print`, { responseType: 'blob', params: { id_template } });
            
            // Xử lý file blob và buộc trình duyệt tải xuống
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Lấy tên file từ header (nếu backend có gửi Content-Disposition)
            let fileName = typeTemplate.value +'_'+detailContract.value?.contract?.code+'.docx';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = decodeURIComponent(fileNameMatch[1]);
                }
            }
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            
            // Dọn dẹp
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading contract:', error);
        }
    };

    const getTransactionPrint = async (id, id_template) => {
        try {
            // Thêm responseType: 'blob' để Axios hiểu đây là file nhị phân
            const response = await apiClient.get(`/transactions/receipt/${id}`, { responseType: 'blob', params: { id_template } });
            
            // Xử lý file blob và buộc trình duyệt tải xuống
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Lấy tên file từ header (nếu backend có gửi Content-Disposition)
            let fileName = typeTemplate.value +'_'+detailContract.value?.contract?.code+'.docx';
            const contentDisposition = response.headers['content-disposition'];
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    fileName = decodeURIComponent(fileNameMatch[1]);
                }
            }
            
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            
            // Dọn dẹp
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading transaction receipt:', error);
        }
    };
    return {
        //state
        showDetailContract, detailContract, templates, showSelectTemplate, typeTemplate, loading,

        //computed
        collateralmetadata, collateralImages, filterTemplate,

        //actions
        openDetailContract, closeDetailContract, formatCurrency, openSelectTemplate, closeSelectTemplate, SelectTemplate, getTransactionPrint,

        //fetch
        getDetailContract, getContractPrint, getAllTemplates
    };
});