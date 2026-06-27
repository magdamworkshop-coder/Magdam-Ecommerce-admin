<template>
  <main class="admin-app">
    <header class="admin-header bg-white border-b shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="text-sm text-gray-600">Manage products, orders, and store operations</p>
        </div>
        <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </header>

    <div class="admin-container max-w-7xl mx-auto p-4">
      <AdminPanel />
    </div>
  </main>
</template>

<script setup>
import AdminPanel from './components/AdminPanel.vue'

const logout = () => {
  localStorage.removeItem('adminToken')
  window.location.href = '/' 
}
</script>

<style>
.admin-app {
  min-height: 100vh;
  background: #f3f4f6;
}

.admin-header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.admin-container {
  padding-top: 2rem;
}
</style>
