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
        staff, newStaff, role, showAddStaffModal,
        
        //actions
        fetchStaff, fetchRole, openAddStaffModal, closeAddStaffModal, submitAddStaff
    }
})