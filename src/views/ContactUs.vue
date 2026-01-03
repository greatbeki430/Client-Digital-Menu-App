<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p class="text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions, suggestions, or need support? We're here to help you get the most out of Digital Menu.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input v-model="form.name" type="text" id="name" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Your name" />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input v-model="form.email" type="email" id="email" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="you@example.com" />
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select v-model="form.subject" id="subject" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                  <option value="" disabled>Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Question</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="partnership">Partnership Opportunity</option>
                </select>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea v-model="form.message" id="message" rows="6" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us how we can help you..."></textarea>
              </div>

              <!-- Submit Button -->
              <button type="submit" :disabled="isSubmitting"
                class="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2">
                <span v-if="!isSubmitting">Send Message</span>
                <span v-else class="flex items-center space-x-2">
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <span>Sending...</span>
                </span>
              </button>
            </form>

            <!-- Success Message -->
            <div v-if="showSuccess" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div class="flex items-center space-x-3">
                <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
                <p class="text-green-700 font-medium">Thank you! Your message has been sent successfully.</p>
              </div>
              <p class="text-green-600 text-sm mt-1">We'll get back to you within 24-48 hours.</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <!-- Contact Info Cards -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

              <!-- Email -->
              <div class="flex items-start space-x-4 mb-6 p-4 bg-blue-50 rounded-lg">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p class="text-gray-600 mb-2">Our support team is here to help</p>
                  <a href="mailto:gezbekele@ju2.edu.et" class="text-blue-600 hover:text-blue-800 font-medium">
                    support@digitalmenu.com
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start space-x-4 mb-6 p-4 bg-green-50 rounded-lg">
                <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Call Us</h3>
                  <p class="text-gray-600 mb-2">Monday to Friday, 9AM - 6PM EST</p>
                  <a href="tel:+251961305788" class="text-green-600 hover:text-green-800 font-medium">
                    +251 723 305 788
                  </a>
                </div>
              </div>

              <!-- Address -->
              <div class="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg">
                <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">Visit Our Office</h3>
                  <p class="text-gray-600 mb-2">Feel free to drop by</p>
                  <p class="text-purple-600 font-medium">
                    123 Tech Street<br>
                    Digital City, Addis 10001
                  </p>
                </div>
              </div>
            </div>

            <!-- FAQ -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

              <div class="space-y-4">
                <div class="border-b border-gray-200 pb-4">
                  <h3 class="font-semibold text-gray-900 mb-2">How quickly do you respond to support requests?</h3>
                  <p class="text-gray-600">We aim to respond to all inquiries within 24 hours. For urgent technical
                    issues, we prioritize responses within 2-4 hours during business hours.</p>
                </div>

                <div class="border-b border-gray-200 pb-4">
                  <h3 class="font-semibold text-gray-900 mb-2">Do you offer custom solutions for large restaurants?</h3>
                  <p class="text-gray-600">Yes! We provide enterprise solutions with custom features, dedicated support,
                    and API integration. Contact our sales team for a custom quote.</p>
                </div>

                <div>
                  <h3 class="font-semibold text-gray-900 mb-2">Can I schedule a demo of the platform?</h3>
                  <p class="text-gray-600">Absolutely! We offer personalized demos to show you all the features. Use the
                    contact form above to schedule a demo at your convenience.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-12 flex justify-center space-x-4">
          <router-link to="/"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Back to Home
          </router-link>
          <router-link to="/terms"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200">
            View Terms of Service
          </router-link>
          <router-link to="/privacy"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200">
            View Privacy Policy
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface ContactForm {
  name: string
  email: string
  subject: string
  message: string
}

const form = reactive<ContactForm>({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const handleSubmit = async () => {
  if (isSubmitting.value) return

  isSubmitting.value = true
  showSuccess.value = false

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // In production, you would make an actual API call here
    // await api.post('/contact', form)

    console.log('Form submitted:', form)

    // Show success message
    showSuccess.value = true

    // Reset form
    Object.assign(form, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })

    // Scroll to success message
    setTimeout(() => {
      const successElement = document.querySelector('.bg-green-50')
      if (successElement) {
        successElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)

  } catch (error) {
    console.error('Error submitting form:', error)
    alert('There was an error sending your message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Smooth transitions for form elements */
input,
select,
textarea {
  transition: all 0.2s ease;
}

/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Success message animation */
.bg-green-50 {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Contact info card hover effects */
.bg-blue-50,
.bg-green-50,
.bg-purple-50 {
  transition: all 0.3s ease;
}

.bg-blue-50:hover,
.bg-green-50:hover,
.bg-purple-50:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* FAQ item hover effect */
.border-b:hover h3 {
  color: #2563eb;
}

/* Button loading animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
