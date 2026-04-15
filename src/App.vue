<script setup>
import Aside from './components/Aside.vue';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import UpdateNotification from './components/UpdateNotification.vue';
import apiClient from './plugins/axios';

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const route = useRoute();
const router = useRouter();

const isLoginPage = computed(() => route.name === 'Login');

const pageTitles = {
  'AdminDashboard': 'Dashboard',
  'AdminCustomers': 'Khách Hàng',
  'AdminLoanPawn': 'Cầm Đồ',
  'AdminRepayments': 'Trả Góp',
  'AdminPledges': 'Tín Chấp',
  'AdminAssets': 'Quản Lý Tài Sản',
  'AdminStaff': 'Quản Lý Nhân Viên',
  'AdminTransactions': 'Quản Lý Thu Chi',
  'AdminSettings': 'Cấu hình hệ thống',
};

const pageTitle = computed(() => pageTitles[route.name] || '');

const refreshPage = () => window.location.reload();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
const count = ref(0);
const Liquidation = ref(0);

const countContractOverDate = async () => {
  try {
    const response = await apiClient.get('/contract/count-over-date');
    count.value = response.data.count;
  } catch (error) {
    console.error('Lỗi khi đếm hợp đồng quá hạn:', error);
    return 0;
  }
}

const countLiquidation = async () => {
  try {
    const response = await apiClient.get('/collateral/count-liquidation');
    Liquidation.value = response.data.count;
  } catch (error) {
    console.error('Lỗi khi đếm tài sản chờ thanh lý:', error);
    return 0;
  }
}

const goToOverDueContracts = () => {
  router.push({
    name: 'AdminLoanPawn',
    query: { filter: 'Quá Hạn' },
  });
}

const goToLiquidation = () => {
  router.push({
    name: 'AdminAssets',
    query: { filter: 'Chờ Thanh Lý' },
  });
}

onMounted(async () => {
  await countContractOverDate();
  await countLiquidation();
})

</script>
<template>
  <main>
    <div class="app-layout" v-if="!isLoginPage">
      <UpdateNotification />
      <Aside />
      <div class="main-content">
        <!-- Header -->
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
              <div class="header-waring-liquidation" v-if="Liquidation > 0" @click="goToLiquidation">
                <span>{{ Liquidation }} Tài sản chờ thanh lý</span>
              </div>
              <div class="header-waring-contract" v-if="count > 0" @click="goToOverDueContracts">
                <span>{{ count }} Hợp đồng Quá Hạn</span>
              </div>
              <div class="header-actions">
                <button class="refresh-btn" @click="refreshPage" title="Tải lại trang">
                  <font-awesome-icon icon="fa-solid fa-rotate" />
                </button>
              </div>
              <div class="header-infor">
                <span>Hi! {{ user?.name }}</span>
                <button class="logout-btn" @click="logout">Đăng Xuất</button>
              </div>
            </div>
          </div>
        </header>
        <!-- Page -->
        <router-view />
      </div>
    </div>
    <div v-else>
      <router-view />
    </div>
  </main>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.logout-btn {
  background-color: #1a7a6e;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
}
</style>
