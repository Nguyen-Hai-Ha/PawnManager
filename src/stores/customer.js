import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref, computed, nextTick } from "vue";

export const useCustomerStore = defineStore('customer', () => {
    const customers = ref([]);
    const showAddCustomer = ref(false);
    const showEditCustomer = ref(false);
    const form = ref({
        name: '',
        phone: '',
        cccd: '',
        birth_date: '',
        address: '',
        images_cccd: null,
        imagePreview: ''
    });
    const Editform = ref({
        name: '',
        phone: '',
        cccd: '',
        birth_date: '',
        address: '',
        images_cccd: null,
        imagePreview: ''
    })
    const relative = ref([]);

    const itemPage = 12;
    const currentPage = ref(1);

    const search = ref('');

    const paginated = computed(() => {
        const start = (currentPage.value - 1) * itemPage;
        const end = start + itemPage;
        return searchCustomer.value.slice(start, end);
    });

    const totalPage = computed(() => {
        return Math.ceil(searchCustomer.value.length / itemPage);
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

    const searchCustomer = computed (() => {
        if (!search.value.trim()) {
            return customers.value;
        }
        const searchTerm = search.value.trim().toLowerCase();

        return customers.value.filter(customer => {
            const searchFields = [
                customer.name,
                customer.phone,
                customer.cccd,
                customer.address
            ];
            return searchFields.some(field => field.toLowerCase().includes(searchTerm));
        });
    })

    const addRelative = () => {
        relative.value.push({
            name: '',
            phone: '',
            cccd: '',
            address: '',
            job: '',
            workplace: ''
        })
    };
    const removeRelative = (index) => {
        relative.value.splice(index, 1);
    };

    const openModal = () => {
        showAddCustomer.value = true;
    };

    const openEditModal = (customer) => {
        Editform.value = customer;
        showEditCustomer.value = true;

        nextTick(() => {
            const firstInput = document.getElementById('edit-name');
            if (firstInput) firstInput.focus();
        })
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
        relative.value = []
        showAddCustomer.value = false;
    };

    const closeEditModal = () => {
        Editform.value = {
            name: '',
            phone: '',
            cccd: '',
            birth_date: '',
            address: '',
            images_cccd: '',
            imagePreview: ''
        }
        relative.value = []
        showEditCustomer.value = false;
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            form.value.images_cccd = file;
            form.value.imagePreview = URL.createObjectURL(file);
            console.log(form.value.images_cccd);
        }
    };

    const removeImage = () => {
        form.value.images_cccd = '';
        form.value.imagePreview = '';
        const fileInput = document.getElementById('images_cccd');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const submitForm = async () => {
        const formData = new FormData();
        formData.append('name', form.value.name);
        formData.append('phone', form.value.phone);
        formData.append('cccd', form.value.cccd);
        formData.append('birth_date', form.value.birth_date || '');
        formData.append('address', form.value.address);
        formData.append('images_cccd', form.value.images_cccd);
        formData.append('relatives', JSON.stringify(relative.value));

        try {
            await apiClient.post('/customer', formData);
            await fetchcustomer();
            closeModal();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    };

    const deleteCutomer = async (id) => {
        try {
            await apiClient.delete(`/customer/${id}`);
            await fetchcustomer();
        }catch (error) {
            console.error('Error deleting customer:', error);
        }
    }

    const fetchcustomer = async () => {
        const respone = await apiClient.get('/customer');
        customers.value = await respone.data;
    }

    return {
        // state
        customers, form, showAddCustomer, relative,
        itemPage, currentPage, search,

        // computed
        paginated, totalPage, searchCustomer,

        // method
        changePage, goToFirstPage, goToNextPage, goToPrevPage, goToLastPage,
        openModal, closeModal, handleImageChange, removeImage, 
        addRelative, removeRelative, submitForm, deleteCutomer,

        // fetch
        fetchcustomer
    }
})