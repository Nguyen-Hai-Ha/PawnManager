import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/plugins/axios'

export const useDetailContractStore = defineStore('detailContract', () => {
    const detailContract = ref(null)
    const showDetailContract = ref(false);

    const openDetailContract = (id) => {
        getDetailContract(id);
        showDetailContract.value = true;
    };

    const closeDetailContract = () => {
        showDetailContract.value = false;
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

    const getContractPrint = async (id) => {
        try {
            // Thêm responseType: 'blob' để Axios hiểu đây là file nhị phân
            const response = await apiClient.get(`/contract/${id}/print`, { responseType: 'blob' });
            
            // Xử lý file blob và buộc trình duyệt tải xuống
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Lấy tên file từ header (nếu backend có gửi Content-Disposition)
            let fileName = 'Hop_Dong_'+detailContract.value?.customer?.name+'.docx';
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

    const getContractReceipt = async (id) => {
        try {
            // Thêm responseType: 'blob' để Axios hiểu đây là file nhị phân
            const response = await apiClient.get(`/contract/${id}/print-receipt`, { responseType: 'blob' });
            
            // Xử lý file blob và buộc trình duyệt tải xuống
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Lấy tên file từ header (nếu backend có gửi Content-Disposition)
            let fileName = 'Bien_Nhan_HĐ_'+detailContract.value?.customer?.name+'.docx';
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

    return {
        //state
        showDetailContract, detailContract,

        //computed
        collateralmetadata, collateralImages,

        //actions
        openDetailContract, closeDetailContract, formatCurrency, 

        //fetch
        getDetailContract, getContractPrint, getContractReceipt
    };
});