import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import apiClient from "@/plugins/axios";

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({})
    const loading = ref({ getSettings: false, updateSettings: false })
    const templates = ref({})
    const showAddTemplateModal = ref(false)
    const newTemplate = ref({
        name_file: '',
        file_path: '',
        type: '',
        active: true
    })
    const fileInput = ref(null);

    const handleFileUpload = () => {
        const file = fileInput.value.files[0];
        if (file) {
            newTemplate.value.file_path = file;
        }
    }

    const openAddTemplateModal = () => {
        showAddTemplateModal.value = true
    }

    const closeAddTemplateModal = () => {
        showAddTemplateModal.value = false
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

    watch(newTemplate.value, (newVal) => {
        console.log(newVal);
    })

    return {
        //state
        settings, loading, showAddTemplateModal, newTemplate, fileInput, templates,

        //actions
        handleFileUpload,
        openAddTemplateModal,
        closeAddTemplateModal,

        //fetch
        getSettings,
        updateSettings,
        getAllTemplates,
        createTemplate
    }
})