import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref, watch } from "vue";

export const useCustomerStore = defineStore('customer', () => {
    const customers = ref([]);
    const form = ref({
        name: '',
        phone: '',
        cccd: '',
        birth_date: '',
        address: '',
        images_cccd: null,
        imagePreview: ''
    })
    const showAddCustomer = ref(false);

    const openModal = () => {
        showAddCustomer.value = true;
    }

    const closeModal = () => {
        form.value = {
            name: '',
            phone: '',
            cccd: '',
            birth_date: '',
            address: '',
            images_cccd: '',
            imagePreview: ''
        }
        showAddCustomer.value = false;
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            form.value.images_cccd = file;
            form.value.imagePreview = URL.createObjectURL(file);
            console.log(form.value.images_cccd);
        }
    }

    const removeImage = () => {
        form.value.images_cccd = '';
        form.value.imagePreview = '';
        const fileInput = document.getElementById('images_cccd');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    const submitForm = async () => {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('phone', form.value.phone);
        formData.append('cccd', form.value.cccd);
        console.log("SubmitForm - Form values:", form.value);
        // Gửi birth_date để khớp với Database Model
        formData.append('birth_date', form.value.birth_date || form.value.birth_day || '');
        formData.append('address', form.value.address);
        formData.append('images_cccd', form.value.images_cccd);

        // Debug FormData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }
        try {
            await apiClient.post('/customer', formData);
            await fetchcustomer(); // Refresh list
            closeModal();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const deleteCutomer = async (id) => {
    const fetchcustomer = async () => {
        const respone = await apiClient.get('/customer');
        customers.value = await respone.data;
    }

    return {
        customers, form, showAddCustomer,
        openModal, closeModal, handleImageChange, removeImage, submitForm,
        fetchcustomer
    }
})