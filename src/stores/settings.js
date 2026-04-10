import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import apiClient from "@/plugins/axios";

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({})
    const loading = ref({ getSettings: false, updateSettings: false })
    const templates = ref([])
    const showAddTemplateModal = ref(false)
    const newTemplate = ref({
        name_file: '',
        file_path: '',
        type: '',
        active: true
    })
    const fileInput = ref(null);
    const collateralTypes = ref([]);
    const newCollateralType = ref({});
    const editCollateralType = ref({
        name: '',
    });
    const showEditTemplateModal = ref(false);
    const editTemplate = ref({
        name_file: '',
        file_path: '',
        type: '',
        active: true
    });

    const newFileForEdit = ref(null);
    const handleFileUploadEdit = (event) => {
        const file = event.target.files[0];
        if (file) {
            newFileForEdit.value = file;
        }
    }

    const openEditTemplateModal = (id) => {
        getIdTemplate(id);
        showEditTemplateModal.value = true
        nextTick(() => {
            const firstInput = document.getElementById('editTemplate');
            if (firstInput) {
                firstInput.focus();
            }
        })
    }
    const closeEditTemplateModal = () => {
        editTemplate.value = {
            name_file: '',
            file_path: '',
            type: '',
            active: true
        }
        showEditTemplateModal.value = false
    }

    const showEditCategoryModal = ref(false);
    const openEditCategoryModal = (id) => {
        GetIdCollateralType(id);
        showEditCategoryModal.value = true

        nextTick(() => {
            const firstInput = document.getElementById('editCollateralType');
            if (firstInput) {
                firstInput.focus();
            }
        })
    }
    const closeEditCategoryModal = () => {
        editCollateralType.value = {
            name: '',
        }
        showEditCategoryModal.value = false
    }

    const handleFileUpload = () => {
        const file = fileInput.value.files[0];
        if (file) {
            newTemplate.value.file_path = file;
        }
    }

    const openAddTemplateModal = () => {
        showAddTemplateModal.value = true

        nextTick(() => {
            const firstInput = document.getElementById('addTemplate');
            if (firstInput) {
                firstInput.focus();
            }
        })
    }

    const closeAddTemplateModal = () => {
        newTemplate.value = {
            name_file: '',
            file_path: '',
            type: '',
            active: true
        }
        showAddTemplateModal.value = false
    }

    const showAddCategoryModal = ref(false)
    const openAddCategoryModal = () => {
        showAddCategoryModal.value = true
        nextTick(() => {
            const firstInput = document.getElementById('addCollateralType');
            if (firstInput) {
                firstInput.focus();
            }
        })
    }
    const closeAddCategoryModal = () => {
        newCollateralType.value = {
            name: '',
        }
        showAddCategoryModal.value = false
    }

    const getSettings = async () => {
        loading.value.getSettings = true;
        const response = await apiClient.get('/settings');
        settings.value = response.data;
        loading.value.getSettings = false;
    }

    const updateSettings = async (settings) => {
        const response = await apiClient.put('/settings', settings);
        await getSettings();
    }

    const getAllTemplates = async () => {
        const response = await apiClient.get('/settings/templates');
        templates.value = response.data;
    }

    const createTemplate = async () => {
        const formData = new FormData();
        formData.append('name_file', newTemplate.value.name_file);
        formData.append('file_path', newTemplate.value.file_path);
        formData.append('type', newTemplate.value.type);
        formData.append('active', newTemplate.value.active);
        try {
            const response = await apiClient.post('/settings/templates', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(response.data);
            await getAllTemplates();
            closeAddTemplateModal();
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCollateralTypes = async () => {
        try {
            const response = await apiClient.get('/collateral_type');
            collateralTypes.value = response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const GetIdCollateralType = async (id) => {
        try {
            const response = await apiClient.get(`/collateral_type/${id}`);
            editCollateralType.value = response.data;
        } catch (error) {
            console.log(error);
        }
    }

    const createCollateralType = async () => {
        const payload = {
            name: newCollateralType.value.name
        }
        try {
            const response = await apiClient.post('/collateral_type', payload);
            await fetchCollateralTypes();
            closeAddCategoryModal();
        } catch (error) {
            console.log(error);
        }
    }

    const deleteCollateralType = async (id) => {
        try {
            const response = await apiClient.delete(`/collateral_type/${id}`);
            await fetchCollateralTypes();
        } catch (error) {
            console.log(error);
        }
    }

    const updateCollateralType = async () => {
        const payload = {
            name: editCollateralType.value.name
        }
        try {
            const response = await apiClient.put(`/collateral_type/${editCollateralType.value.id}`, payload);
            await fetchCollateralTypes();
            closeEditCategoryModal();
        } catch (error) {
            console.log(error);
        }
    }

    const getIdTemplate = async (id) => {
        try {
            const response = await apiClient.get(`/settings/templates/${id}`);
            editTemplate.value = response.data;
        } catch (error) {     
            console.log(error);
        }
    }

    const updateTemplate = async () => {
        const formData = new FormData();
        formData.append('name_file', editTemplate.value.name_file);
        formData.append('type', editTemplate.value.type);
        formData.append('active', editTemplate.value.active);
        formData.append('existing_file_path', editTemplate.value.file_path);
        if (newFileForEdit.value) {
            formData.append('file_path', newFileForEdit.value);
        }
        try {
            await apiClient.put(`/settings/templates/${editTemplate.value.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await getAllTemplates();
            newFileForEdit.value = null;
            closeEditTemplateModal();
        } catch (error) {
            console.log(error);
        }
    }

    return {
        //state
        settings, loading, showAddTemplateModal, newTemplate, fileInput, templates, collateralTypes, newCollateralType,
        showAddCategoryModal, editCollateralType, showEditCategoryModal, showEditTemplateModal, editTemplate,

        //actions
        handleFileUpload,
        openAddTemplateModal,
        closeAddTemplateModal,
        openAddCategoryModal,
        closeAddCategoryModal,
        openEditCategoryModal,
        closeEditCategoryModal,
        openEditTemplateModal,
        closeEditTemplateModal,
        handleFileUploadEdit,

        //fetch
        getSettings,
        updateSettings,
        getAllTemplates,
        createTemplate,
        fetchCollateralTypes,
        createCollateralType,
        deleteCollateralType,
        GetIdCollateralType,
        updateCollateralType,
        getIdTemplate,
        updateTemplate
    }
})