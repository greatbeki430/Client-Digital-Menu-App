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

<style scoped>
/* Custom animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Footer styles */
footer {
  animation: fadeInUp 0.6s ease-out 0.3s both;
  background: linear-gradient(135deg, #111827 0%, #1F2937 100%);
  position: relative;
  overflow: hidden;
}

/* Gradient border effect */
footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6, #10B981);
  background-size: 200% 100%;
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

/* Logo hover effect */
.flex.items-center.space-x-2 {
  transition: all 0.3s ease;
}

.flex.items-center.space-x-2:hover {
  transform: translateY(-2px);
}

.flex.items-center.space-x-2:hover .w-6.h-6 {
  transform: rotate(12deg);
  box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
}

.w-6.h-6 {
  transition: all 0.3s ease;
}

/* Links hover effect */
.router-link-active {
  position: relative;
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6);
  transition: width 0.3s ease;
}

.router-link-active:hover::after {
  width: 100%;
}

/* Enhanced hover states */
.text-gray-400 {
  transition: all 0.3s ease;
  position: relative;
  padding: 4px 0;
}

.text-gray-400:hover {
  color: #FFFFFF;
  transform: translateY(-1px);
}

/* Bottom text animation */
.text-center p {
  position: relative;
  display: inline-block;
  padding: 0 10px;
}

.text-center p::before,
.text-center p::after {
  content: '✨';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.text-center p::before {
  left: -20px;
}

.text-center p::after {
  right: -20px;
}

.text-center:hover p::before,
.text-center:hover p::after {
  opacity: 1;
}

/* Responsive styles */
@media (max-width: 768px) {
  .flex.flex-col {
    animation: fadeInUp 0.4s ease-out;
  }

  .flex.space-x-6 {
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .text-center p {
    max-width: 280px;
    line-height: 1.4;
  }
}

/* Dark mode adjustments */
@media (prefers-color-scheme: dark) {
  footer {
    background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  }

  .border-gray-800 {
    border-color: #334155;
  }
}

/* Print styles */
@media print {
  footer {
    display: none;
  }
}

/* Accessibility focus styles */
.router-link-active:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 4px;
  border-radius: 4px;
}

/* Loading state for links */
.router-link-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Enhanced text effects */
.text-gray-400 {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.text-gray-400:hover {
  text-shadow: 0 2px 4px rgba(255, 255, 255, 0.1);
}

/* Subtle pulse animation for current year */
.current-year {
  display: inline-block;
  animation: subtlePulse 2s ease-in-out infinite;
}

@keyframes subtlePulse {

  0%,
  100% {
    opacity: 0.9;
  }

  50% {
    opacity: 1;
  }
}

/* Custom scrollbar for footer links on mobile */
@media (max-width: 768px) {
  .flex.space-x-6 {
    overflow-x: auto;
    padding-bottom: 8px;
    scrollbar-width: thin;
    scrollbar-color: #4B5563 transparent;
  }

  .flex.space-x-6::-webkit-scrollbar {
    height: 4px;
  }

  .flex.space-x-6::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 2px;
  }

  .flex.space-x-6::-webkit-scrollbar-thumb {
    background: #4B5563;
    border-radius: 2px;
  }

  .flex.space-x-6::-webkit-scrollbar-thumb:hover {
    background: #6B7280;
  }
}

/* Glass effect for modern browsers */
@supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
  footer {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    background: linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(31, 41, 55, 0.95) 100%);
  }
}
</style>
