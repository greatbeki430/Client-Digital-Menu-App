<template>
  <TransitionRoot as="template" :show="open">
    <Dialog as="div" class="relative z-50" @close="emitClose">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
        leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild as="template" enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <!-- Progress Bar for Auto-dismiss -->
              <div v-if="autoCloseDelay > 0" class="absolute top-0 left-0 right-0 h-1 bg-gray-200">
                <div class="h-full bg-green-500 transition-all duration-100 ease-linear"
                  :style="{ width: `${progress}%` }"></div>
              </div>

              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                    {{ title }}
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">{{ message }}</p>

                    <!-- Credentials display (only for registration) -->
                    <div v-if="credentials" class="mt-4 p-4 bg-gray-50 rounded-md">
                      <p class="text-sm font-medium text-gray-700 mb-2">Your login credentials:</p>
                      <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                          <span class="text-gray-600">Email:</span>
                          <span class="font-mono text-gray-900">{{ credentials.email }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Password:</span>
                          <span class="font-mono text-gray-900">{{ credentials.password }}</span>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 mt-3">
                        ⚠️ Please save these credentials. You'll need them to login.
                      </p>
                    </div>

                    <!-- Auto-dismiss notice -->
                    <div v-if="autoCloseDelay > 0" class="mt-4 flex items-center text-xs text-gray-500">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>This message will auto-dismiss in {{ countdown }} seconds</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button type="button"
                  class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
                  @click="emitConfirm">
                  {{ confirmText }}
                </button>
                <button type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="emitClose">
                  {{ cancelText }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  open: boolean
  title?: string
  message?: string
  credentials?: {
    email: string
    password: string
  } | null
  confirmText?: string
  cancelText?: string
  autoCloseDelay?: number // milliseconds, 0 = no auto-close
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Success!',
  message: 'Operation completed successfully.',
  confirmText: 'Continue',
  cancelText: 'Close',
  autoCloseDelay: 5000, // 5 seconds default
  credentials: null
})

const emit = defineEmits<{
  close: []
  confirm: []
}>()

// Auto-dismiss state
const progress = ref(100)
const countdown = ref(Math.ceil(props.autoCloseDelay / 1000))
let progressInterval: number | null = null
let countdownInterval: number | null = null

// Start auto-dismiss countdown
const startAutoDismiss = () => {
  if (props.autoCloseDelay <= 0) return

  // Reset values
  progress.value = 100
  countdown.value = Math.ceil(props.autoCloseDelay / 1000)

  // Clear any existing intervals
  stopAutoDismiss()

  const totalSteps = props.autoCloseDelay / 100 // Updates every 100ms
  const progressStep = 100 / totalSteps

  // Progress bar interval
  progressInterval = window.setInterval(() => {
    progress.value = Math.max(0, progress.value - progressStep)
    if (progress.value <= 0) {
      emitClose()
    }
  }, 100)

  // Countdown timer interval
  countdownInterval = window.setInterval(() => {
    countdown.value = Math.max(0, countdown.value - 1)
    if (countdown.value <= 0) {
      stopAutoDismiss()
    }
  }, 1000)
}

// Stop auto-dismiss
const stopAutoDismiss = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// Watch for modal open/close
watch(() => props.open, (isOpen) => {
  if (isOpen && props.autoCloseDelay > 0) {
    startAutoDismiss()
  } else {
    stopAutoDismiss()
  }
})

function emitClose() {
  stopAutoDismiss()
  emit('close')
}

function emitConfirm() {
  stopAutoDismiss()
  emit('confirm')
}

// Cleanup on component unmount
onUnmounted(() => {
  stopAutoDismiss()
})
</script>
