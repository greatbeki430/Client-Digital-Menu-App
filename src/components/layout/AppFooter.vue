<template>
  <footer class="bg-gray-900 text-white mt-12">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <!-- Logo and Copyright -->
        <div class="mb-6 md:mb-0">
          <div class="flex items-center space-x-2 mb-2">
            <div class="w-6 h-6 bg-white rounded flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span class="text-lg font-bold">{{ appName }}</span>
          </div>
          <p class="text-gray-400 text-sm">&copy; {{ currentYear }} All rights reserved.</p>
        </div>

        <!-- Links -->
        <div class="flex space-x-6">
          <router-link to="/privacy" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Privacy Policy
          </router-link>
          <router-link to="/terms" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Terms of Service
          </router-link>
          <router-link to="/contact" class="text-gray-400 hover:text-white transition-colors duration-200 text-sm">
            Contact Us
          </router-link>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>Designed for restaurants, cafes, hotels and service providers</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appName = import.meta.env.VITE_APP_NAME || 'Digital Menu'
const currentYear = computed(() => new Date().getFullYear())
</script>
