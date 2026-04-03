import { defineStore } from 'pinia'
import apiClient from "@/plugins/axios";
import { ref, computed, watch, nextTick } from 'vue';
import { PERMISSION } from '@/constants/permission';

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
    const editStaff = ref({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        cccd: '',
        id_role: ''
    })
    const editPassword = ref('')
    const role = ref([]);
    const showAddStaffModal = ref(false);
    const showPermissionModal = ref(false);
    const showEditStaffModal = ref(false);
    const activeCategory = ref('Cầm đồ');
    const selectedPermissionIds = ref([]);
    const categories = ref(Object.keys(PERMISSION));
    const search = ref('');
    const selectedRole = ref('');

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
        nextTick(() => {
            const firstInput = document.getElementById('name');
            if (firstInput) {
                firstInput.focus();
            }
        })
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

    const openPermissionModal = async () => {
        showPermissionModal.value = true;
    }

    const closePermissionModal = () => {
        showPermissionModal.value = false;
    }

    const openEditStaffModal = async (id) => {
        await fetchEditStaff(id);
        showEditStaffModal.value = true;
        nextTick(() => {
            const firstInput = document.getElementById('name');
            if (firstInput) {
                firstInput.focus();
            }
        })
    }

    const closeEditStaffModal = () => {
        editStaff.value = {
            name: '',
            email: '',
            password: '',
            phone: '',
            address: '',
            cccd: '',
            id_role: ''
        }
        showEditStaffModal.value = false;
    }

    const currentPermissions = computed(() => {
        return PERMISSION[activeCategory.value] || [];
    });

    const isAllSelected = computed(() => {
        const currentIds = currentPermissions.value.map(p => p.id);
        return currentIds.length > 0 && currentIds.every(id => selectedPermissionIds.value.includes(id));
    });

    const toggleSelectAll = (event) => {
        const isChecked = event.target.checked;
        const currentIds = currentPermissions.value.map(p => p.id);
        
        if (isChecked) {
            currentIds.forEach(id => {
                if (!selectedPermissionIds.value.includes(id)) {
                    selectedPermissionIds.value.push(id);
                }
            });
        } else {
            selectedPermissionIds.value = selectedPermissionIds.value.filter(id => !currentIds.includes(id));
        }
    };

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

    const submitEditStaff = async () => {
        const data = {
            name: editStaff.value.name,
            email: editStaff.value.email,
            password: editPassword.value,
            phone: editStaff.value.phone,
            address: editStaff.value.address,
            cccd: editStaff.value.cccd,
            id_role: editStaff.value.id_role
        }
        console.log(data)
        try {
            const response = await apiClient.put(`/staff/${editStaff.value.id}`, data)
            fetchStaff()
            closeEditStaffModal()
        } catch (error) {
            console.error('Error editing staff:', error)
        }
    }

    const submitUpdatePermissionRole = async () => {
        if (!selectedRole.value) {
            console.error('Không xác định được nhóm chức vụ');
            alert('Không xác định được nhóm chức vụ');
            return;
        }
        const data = {
            permissionIds: selectedPermissionIds.value
        }
        try {
            const response = await apiClient.put(`/role/permission-role/${selectedRole.value}`, data)
            fetchPermissionRole(selectedRole.value)
            closePermissionModal()
        } catch (error) {
            console.error('Error updating permission role:', error)
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

    const fetchPermissionRole = async (id) => {
        try {
            const response = await apiClient.get(`/role/permission-role/${id}`)
            selectedPermissionIds.value = response.data.map(p => p.id)
            console.log(selectedPermissionIds.value)
        } catch (error) {
            console.error('Error fetching permission role:', error)
        }
    }

    const fetchEditStaff = async (id) => {
        try {
            const response = await apiClient.get(`/staff/${id}`)
            editStaff.value = response.data
        } catch (error) {
            console.error('Error fetching staff:', error)
        }
    }

    watch(() => selectedRole.value, async (newId) => {
        if (newId) {
            await fetchPermissionRole(newId)
        }
    })

    return {
        //state
        staff, newStaff, role, showAddStaffModal, search, sortConfig, showPermissionModal,
        activeCategory, selectedPermissionIds, categories, selectedRole, editStaff, showEditStaffModal,
        editPassword,

        //computed
        searchStaff, sortedStaff, currentPermissions, isAllSelected, 
        
        //actions
        fetchStaff, fetchRole, openAddStaffModal, closeAddStaffModal, submitAddStaff, handleSort,
        openPermissionModal, closePermissionModal, toggleSelectAll, fetchPermissionRole,
        submitUpdatePermissionRole, openEditStaffModal, closeEditStaffModal, fetchEditStaff,
        submitEditStaff
    }
})