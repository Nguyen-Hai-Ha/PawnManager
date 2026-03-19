import DashboardView from "@/views/admin/DashboardView.vue";

import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: DashboardView
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;