import DashboardView from "@/views/admin/DashboardView.vue";
import CustomerView from "@/views/admin/CustomerView.vue";
import LoanPawnView from "@/views/admin/LoanPawnView.vue";

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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;