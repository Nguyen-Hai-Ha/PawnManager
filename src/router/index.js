import DashboardView from "@/views/admin/DashboardView.vue";
import CustomerView from "@/views/admin/CustomerView.vue";
import LoanPawnView from "@/views/admin/LoanPawnView.vue";
import RepaymentView from "@/views/admin/RepaymentView.vue";
import PledgesView from "@/views/admin/PledgesView.vue";
import AssetsView from "@/views/admin/AssetsView.vue";
import StaffView from "@/views/admin/StaffView.vue";
import TransactionView from "@/views/admin/TransactionView.vue";
import SettingsView from "@/views/admin/SettingsView.vue";
import LoginView from "@/views/LoginView.vue";

import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: DashboardView
  },
  {
    path: '/admin/customers',
    name: 'AdminCustomers',
    component: CustomerView
  },
  {
    path: '/admin/loan-pawn',
    name: 'AdminLoanPawn',
    component: LoanPawnView
  },
  {
    path: '/admin/repayments',
    name: 'AdminRepayments',
    component: RepaymentView
  },
  {
    path: '/admin/pledges',
    name: 'AdminPledges',
    component: PledgesView
  },
  {
    path: '/admin/assets',
    name: 'AdminAssets',
    component: AssetsView
  },
  {
    path: '/admin/staff',
    name: 'AdminStaff',
    component: StaffView
  },
  {
    path: '/admin/transactions',
    name: 'AdminTransactions',
    component: TransactionView
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: SettingsView
  },
  {
    path: '/',
    redirect: '/admin/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.user;

  if (!to.meta.public && !isAuthenticated) {
    next('/login');
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/admin/dashboard');
  } else {
    next();
  }
});

export default router;