import { defineStore } from "pinia";
import apiClient from "@/plugins/axios";
import { ref, nextTick, computed } from "vue";

export const useReducePrincipalStore = defineStore('reducePrincipal', () => {
    const showReducePrincipalModal = ref(false);

    const openReducePrincipalModal = () => {
        showReducePrincipalModal.value = true;
    }

    const closeReducePrincipalModal = () => {
        showReducePrincipalModal.value = false;
    }

    return {
        //state
        showReducePrincipalModal,

        //action
        openReducePrincipalModal, closeReducePrincipalModal,
    }
})