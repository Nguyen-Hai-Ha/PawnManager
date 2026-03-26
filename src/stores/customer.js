import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref } from "vue";

export const useCustomerStore = defineStore('customer', () => {
    const customers = ref([]);
    
    const showAddCustomer = ref(false);

    const fetchcustomer = async () => {
        const respone = await apiClient.get('/customer');
        customers.value = await respone.data;
    }
    return { customers, fetchcustomer, showAddCustomer }
})