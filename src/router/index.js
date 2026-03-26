import DashboardView from "@/views/admin/DashboardView.vue";
import CustomerView from "@/views/admin/CustomerView.vue";
import LoanPawnView from "@/views/admin/LoanPawnView.vue";
import RepaymentView from "@/views/admin/RepaymentView.vue";
import PledgesView from "@/views/admin/PledgesView.vue";
import AssetsView from "@/views/admin/AssetsView.vue";
import StaffView from "@/views/admin/StaffView.vue";

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;