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
              <div class="sm:flex sm:items-start">
                <div
                  class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h1m0 0h-1m1 0v4m-4-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                    {{ title }}
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">{{ message }}</p>

                    <!-- Demo Features -->
                    <div class="mt-4 p-4 bg-blue-50 rounded-md">
                      <h4 class="text-sm font-medium text-blue-900 mb-2">Demo Features Available:</h4>
                      <ul class="list-disc pl-5 text-sm text-blue-800 space-y-1">
                        <li>View categories from TheMealDB API</li>
                        <li>View category details</li>
                        <li>Navigate through the application</li>
                        <li>Experience the user interface</li>
                      </ul>
                    </div>

                    <!-- Limitations -->
                    <div class="mt-4 p-4 bg-yellow-50 rounded-md">
                      <h4 class="text-sm font-medium text-yellow-900 mb-2">Demo Limitations:</h4>
                      <ul class="list-disc pl-5 text-sm text-yellow-800 space-y-1">
                        <li>Create/Update/Delete operations are disabled</li>
                        <li>Data is fetched from external API (read-only)</li>
                        <li>User authentication is simulated</li>
                      </ul>
                    </div>

                    <!-- Call to Action -->
                    <div class="mt-4 p-4 bg-green-50 rounded-md">
                      <h4 class="text-sm font-medium text-green-900 mb-2">Want the Full Version?</h4>
                      <p class="text-sm text-green-800">This is a demo application. Contact us for a fully functional version with database integration.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button type="button"
                  class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                  @click="emitClose">
                  {{ confirmText }}
                </button>
                <button v-if="showContact" type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="emitContact">
                  Contact Us
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

interface Props {
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  showContact?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = withDefaults(defineProps<Props>(), {
  title: 'Demo Mode Information',
  message: 'You are currently using a demonstration version of the application.',
  confirmText: 'Got it!',
  showContact: true
})

const emit = defineEmits<{
  close: []
  contact: []
}>()

function emitClose() {
  emit('close')
}

function emitContact() {
  emit('contact')
  // Optionally navigate to contact page
  // router.push('/contact')
}
</script>
