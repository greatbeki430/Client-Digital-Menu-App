<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <!-- IMPORTANT: Fixed the logic - it was backwards -->
      <component :is="Component" v-if="route.meta?.hideLayout" />
      <AppLayout v-else>
        <component :is="Component" />
      </AppLayout>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
// Correct import path for your AppLayout
import AppLayout from '@/components/layout/AppLayout.vue'

const authStore = useAuthStore()

// Initialize auth from localStorage on app mount
onMounted(() => {
  authStore.initFromStorage()
})
</script>

<style scoped>
/* Fade transition for page changes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
