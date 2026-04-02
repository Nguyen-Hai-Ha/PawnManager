import { defineStore } from 'pinia'
import apiClient from "@/plugins/axios";
import { ref, computed } from 'vue';

export const useStaffStore = defineStore('staff', () => {
    const staff = ref([])
    const newStaff = ref({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        cccd: '',
        id_role: ''
    })
    const role = ref([]);
    const showAddStaffModal = ref(false);
    const search = ref('');

    const searchStaff = computed(() => {
        if (!search.value.trim()) {
            return staff.value;
        }
        const searchTerm = search.value.trim().toLowerCase();
        return staff.value.filter(item => {
            const searchFields = [
                item.name,
                item.email,
                item.phone,
                item.role_name
            ];
            return searchFields.some(field => field && String(field).toLowerCase().includes(searchTerm));
        });
    })

    const sortConfig = ref({
        key: 'id',
        direction: 'asc'
    })

    const handleSort = (key) => {
        if (sortConfig.value.key === key) {
            sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.value.key = key;
            sortConfig.value.direction = 'asc';
        }
    }

    const sortedStaff = computed(() => {
        const list = [...searchStaff.value];
        const { key, direction } = sortConfig.value;
        list.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
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
    })

    const openAddStaffModal = () => {
        showAddStaffModal.value = true;
    }

    const closeAddStaffModal = () => {
        newStaff.value = {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            cccd: '',
            id_role: ''
        }
        showAddStaffModal.value = false;
    }

    const submitAddStaff = async () => {
        const data = {
            name: newStaff.value.name,
            email: newStaff.value.email,
            password: newStaff.value.password,
            phone: newStaff.value.phone,
            address: newStaff.value.address,
            cccd: newStaff.value.cccd,
            id_role: newStaff.value.id_role
        }
        try {
            const response = await apiClient.post('/staff', data)
            fetchStaff()
            closeAddStaffModal()
        } catch (error) {
            console.error('Error adding staff:', error)
        }
    }

    const fetchStaff = async () => {
        try {
            const response = await apiClient.get('/staff')
            staff.value = response.data
        } catch (error) {
            console.error('Error fetching staff:', error)
        }
    }

    const fetchRole = async () => {
        try {
            const response = await apiClient.get('/role')
            role.value = response.data
        } catch (error) {
            console.error('Error fetching role:', error)
        }
    }

    return {
        //state
        staff, newStaff, role, showAddStaffModal, search, sortConfig,

        //computed
        searchStaff, sortedStaff,
        
        //actions
        fetchStaff, fetchRole, openAddStaffModal, closeAddStaffModal, submitAddStaff, handleSort
    }
})