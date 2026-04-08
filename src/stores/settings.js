import { defineStore } from 'pinia'
import { ref } from 'vue'
import apiClient from "@/plugins/axios";

export const useSettingsStore = defineStore('settings', () => {
    const settings = ref({})
    const loading = ref({ getSettings: false, updateSettings: false })

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

    return {
        settings, loading,
        getSettings,
        updateSettings
    }
})