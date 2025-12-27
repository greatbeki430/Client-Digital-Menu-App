<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader v-if="showHeader" />
    <main class="flex-grow">
      <slot />
    </main>
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'

const route = useRoute()

const showHeader = computed(() => {
  const hideOnRoutes = ['/login', '/register']
  return !hideOnRoutes.includes(route.path)
})

const showFooter = computed(() => {
  const hideOnRoutes = ['/login', '/register']
  return !hideOnRoutes.includes(route.path)
})
</script>
