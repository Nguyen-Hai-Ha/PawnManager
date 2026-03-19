<script setup>
import Aside from './components/Aside.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();

const pageTitles = {
  'AdminDashboard': 'Dashboard',
  'AdminCustomers': 'Khách Hàng',
  'AdminLoans': 'Cầm Đồ',
  'AdminRepayments': 'Trả Góp',
  'AdminPledges': 'Tín Chấp',
  'AdminAssets': 'Quản Lý Tài Sản',
  'AdminStaff': 'Quản Lý Nhân Viên',
  'AdminTransactions': 'Quản Lý Thu Chi',
};

const pageTitle = computed(() => pageTitles[route.name] || 'Dashboard');

const refreshPage = () => window.location.reload();
</script>
<template>
  <main>
    <div class="app-layout">
      <Aside />
      <div class="main-content">
        <!-- Header bar -->
        <header class="admin-main">
          <div class="admin-header">
            <div class="header-left">
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <span class="breadcrumb-item active">{{ pageTitle }}</span>
              </div>
              <h1>{{ pageTitle }}</h1>
            </div>
            <div class="header-right">
              <div class="header-actions">
                <button class="refresh-btn" @click="refreshPage" title="Tải lại trang">
                  <font-awesome-icon icon="fa-solid fa-rotate" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <!-- Page content -->
        <router-view />
      </div>
    </div>
  </main>
</template>
<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}
</style>
