<script setup>
import Aside from './components/Aside.vue';
</script>
<template>
  <main>
    <div class="app-layout">
      <Aside />
      <router-view />
    </div>
  </main>
</template>
<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh; 
}
</style>
