<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <router-link to="/" class="flex items-center space-x-2 text-gray-700 hover:text-gray-900">
              <div class="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span class="text-xl font-bold">Digital Menu</span>
            </router-link>
          </div>
          <router-link to="/" class="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </router-link>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p class="text-gray-600 text-lg">We'd love to hear from you. Get in touch with us using any of the methods
            below.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Name -->
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input v-model="form.name" type="text" id="name" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="John Doe" />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input v-model="form.email" type="email" id="email" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="john@example.com" />
              </div>

              <!-- Subject -->
              <div>
                <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <select v-model="form.subject" id="subject" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200">
                  <option value="">Select a subject</option>
                  <option value="support">Technical Support</option>
                  <option value="sales">Sales Inquiry</option>
                  <option value="billing">Billing Question</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <!-- Message -->
              <div>
                <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                <textarea v-model="form.message" id="message" rows="6" required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Please describe your inquiry in detail..."></textarea>
              </div>

              <!-- Submit Button -->
              <div>
                <button type="submit" :disabled="loading"
                  class="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                  <span v-if="loading">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Sending...
                  </span>
                  <span v-else>Send Message</span>
                </button>
              </div>

              <!-- Success Message -->
              <div v-if="showSuccess" class="rounded-md bg-green-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-green-800">Message Sent Successfully!</h3>
                    <div class="mt-2 text-sm text-green-700">
                      <p>Thank you for contacting us. We'll get back to you within 24-48 hours.</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="rounded-md bg-red-50 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <h3 class="text-sm font-medium text-red-800">Error Sending Message</h3>
                    <div class="mt-2 text-sm text-red-700">
                      <p>{{ error }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Contact Information -->
          <div class="space-y-8">
            <!-- Contact Details -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div class="space-y-6">
                <!-- Email -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Email</h3>
                    <p class="text-gray-600">support@digitalmenu.com</p>
                    <p class="text-sm text-gray-500 mt-1">Typically respond within 24 hours</p>
                  </div>
                </div>

                <!-- Phone -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Phone</h3>
                    <p class="text-gray-600">+1 (555) 123-4567</p>
                    <p class="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM EST</p>
                  </div>
                </div>

                <!-- Address -->
                <div class="flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">Office</h3>
                    <p class="text-gray-600">123 Tech Street</p>
                    <p class="text-gray-600">Digital City, DC 10001</p>
                    <p class="text-gray-600">United States</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Business Hours -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>

              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-700">Monday - Friday</span>
                  <span class="font-medium text-gray-900">9:00 AM - 6:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700">Saturday</span>
                  <span class="font-medium text-gray-900">10:00 AM - 4:00 PM</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-700">Sunday</span>
                  <span class="font-medium text-gray-900">Closed</span>
                </div>
              </div>

              <div class="mt-6 pt-6 border-t border-gray-200">
                <p class="text-sm text-gray-500">
                  <strong>Note:</strong> For urgent technical support outside business hours, please email
                  <span class="text-blue-600">emergency@digitalmenu.com</span>
                </p>
              </div>
            </div>

            <!-- FAQ Link -->
            <div class="bg-blue-50 rounded-lg p-6">
              <h3 class="text-lg font-medium text-blue-900 mb-3">Need Immediate Help?</h3>
              <p class="text-blue-700 mb-4">
                Check out our Frequently Asked Questions for quick answers to common questions.
              </p>
              <button @click="scrollToFAQ" class="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                View FAQ
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            <!-- Map -->
            <div class="bg-white rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div class="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p class="text-gray-600">Interactive Map</p>
                  <p class="text-sm text-gray-500 mt-1">Our office location</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div id="faq" class="mt-20">
          <h2 class="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-2">{{ faq.question }}</h3>
              <p class="text-gray-600">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white mt-20">
      <div class="container mx-auto px-4 py-8">
        <div class="text-center">
          <p class="text-gray-400">© 2024 Digital Menu. All rights reserved.</p>
          <p class="text-gray-500 text-sm mt-2">123 Tech Street, Digital City, DC 10001, United States</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
export default {
  name: 'ContactUs',
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      loading: false,
      showSuccess: false,
      error: '',
      faqs: [
        {
          question: 'How long does it take to get a response?',
          answer: 'We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please use our emergency email.'
        },
        {
          question: 'Do you offer customer support on weekends?',
          answer: 'Yes, we offer limited support on Saturdays from 10AM-4PM EST. Sunday support is available for emergency technical issues only.'
        },
        {
          question: 'What information should I include in my support request?',
          answer: 'Please include your account email, a detailed description of the issue, any error messages, and steps to reproduce the problem.'
        },
        {
          question: 'Do you offer phone support?',
          answer: 'Yes, phone support is available Monday-Friday, 9AM-6PM EST. For complex issues, we may schedule a call back.'
        },
        {
          question: 'Can I request a feature or provide feedback?',
          answer: 'Absolutely! We welcome all feedback and feature requests. Please use the "Feedback & Suggestions" subject when contacting us.'
        },
        {
          question: 'What is your refund policy?',
          answer: 'We offer a 30-day money-back guarantee for all our subscription plans. Please contact billing for refund requests.'
        }
      ]
    }
  },
  methods: {
    async handleSubmit() {
      // Reset states
      this.loading = true
      this.showSuccess = false
      this.error = ''

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Validate form
        if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
          throw new Error('Please fill in all required fields')
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(this.form.email)) {
          throw new Error('Please enter a valid email address')
        }

        // Here you would normally send the form data to your backend
        console.log('Form submitted:', this.form)

        // Show success message
        this.showSuccess = true

        // Reset form
        this.form = {
          name: '',
          email: '',
          subject: '',
          message: ''
        }

        // Hide success message after 5 seconds
        setTimeout(() => {
          this.showSuccess = false
        }, 5000)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        this.error = err.message || 'Failed to send message. Please try again.'
      } finally {
        this.loading = false
      }
    },
    scrollToFAQ() {
      const faqSection = document.getElementById('faq')
      if (faqSection) {
        faqSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

/* Component styles */
.min-h-screen {
  animation: fadeIn 0.6s ease-out;
}

/* Header styles */
.bg-white.shadow {
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

/* Logo hover effect */
.router-link-active {
  transition: all 0.3s ease;
}

.router-link-active:hover {
  transform: translateY(-1px);
}

/* Content animation */
.container.mx-auto {
  animation: fadeIn 0.8s ease-out 0.2s both;
}

/* Form styles */
.bg-white.rounded-lg.shadow-lg {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(229, 231, 235, 0.5);
  transition: all 0.3s ease;
}

.bg-white.rounded-lg.shadow-lg:hover {
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Form input focus effects */
input:focus,
select:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* Custom placeholder styles */
::placeholder {
  color: #9CA3AF;
  opacity: 0.7;
}

/* Button styles */
button[type="submit"] {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

button[type="submit"]:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

button[type="submit"]:active:not(:disabled) {
  transform: translateY(0);
}

button[type="submit"]::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

button[type="submit"]:focus:not(:active)::after {
  animation: ripple 1s ease-out;
}

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 0.5;
  }

  100% {
    transform: scale(50, 50);
    opacity: 0;
  }
}

/* Success and error message animations */
.rounded-md {
  animation: slideIn 0.5s ease-out;
}

/* Contact info cards */
.bg-white.rounded-lg.shadow-lg .flex.items-start {
  transition: all 0.3s ease;
  padding: 8px;
  border-radius: 8px;
}

.bg-white.rounded-lg.shadow-lg .flex.items-start:hover {
  background: rgba(249, 250, 251, 0.5);
  transform: translateX(5px);
}

/* Icon containers */
.w-12.h-12.rounded-lg {
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.w-12.h-12.rounded-lg:hover {
  transform: scale(1.1) rotate(5deg);
}

/* Business hours animation */
.bg-white.rounded-lg.shadow-lg .space-y-3>div {
  animation: fadeIn 0.6s ease-out;
  animation-fill-mode: both;
}

.bg-white.rounded-lg.shadow-lg .space-y-3>div:nth-child(1) {
  animation-delay: 0.1s;
}

.bg-white.rounded-lg.shadow-lg .space-y-3>div:nth-child(2) {
  animation-delay: 0.2s;
}

.bg-white.rounded-lg.shadow-lg .space-y-3>div:nth-child(3) {
  animation-delay: 0.3s;
}

/* FAQ link card hover effect */
.bg-blue-50.rounded-lg {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.bg-blue-50.rounded-lg:hover {
  border-color: #3B82F6;
  background: rgba(59, 130, 246, 0.05);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.15);
}

.bg-blue-50.rounded-lg button {
  transition: all 0.3s ease;
}

.bg-blue-50.rounded-lg:hover button {
  transform: translateX(5px);
}

/* FAQ section styles */
#faq {
  animation: fadeIn 0.8s ease-out;
}

.bg-white.rounded-lg.shadow {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.bg-white.rounded-lg.shadow:hover {
  border-left-color: #3B82F6;
  transform: translateX(5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Map placeholder animation */
.bg-gray-200.rounded-lg {
  position: relative;
  overflow: hidden;
}

.bg-gray-200.rounded-lg::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

/* Footer styles */
footer.bg-gray-800 {
  background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
  position: relative;
  overflow: hidden;
}

footer.bg-gray-800::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3B82F6, #8B5CF6, #10B981);
  animation: gradientShift 3s ease infinite;
}

@keyframes gradientShift {

  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

/* Loading spinner customization */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container.mx-auto {
    animation: fadeIn 0.6s ease-out;
  }

  .grid.grid-cols-1 {
    gap: 24px;
  }

  .bg-white.rounded-lg.shadow-lg:hover {
    transform: none;
  }

  .bg-white.rounded-lg.shadow-lg .flex.items-start:hover {
    transform: none;
  }
}

/* Dark mode support (if implemented) */
@media (prefers-color-scheme: dark) {
  :deep(.bg-white) {
    background-color: #1F2937;
  }

  :deep(.text-gray-900) {
    color: #F9FAFB;
  }

  :deep(.text-gray-700) {
    color: #D1D5DB;
  }

  :deep(.text-gray-600) {
    color: #9CA3AF;
  }

  :deep(.border-gray-300) {
    border-color: #374151;
  }

  :deep(.bg-gray-50) {
    background-color: #111827;
  }

  :deep(.bg-blue-50) {
    background-color: rgba(30, 58, 138, 0.3);
  }

  :deep(.text-blue-700) {
    color: #93C5FD;
  }

  :deep(.text-blue-900) {
    color: #DBEAFE;
  }
}

/* Print styles */
@media print {

  button,
  .bg-blue-50.rounded-lg,
  form {
    display: none !important;
  }

  .min-h-screen {
    min-height: auto;
  }

  .bg-white.rounded-lg.shadow-lg {
    box-shadow: none;
    border: 1px solid #E5E7EB;
  }
}

/* Custom scrollbar for the component */
* {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E1 transparent;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

/* Smooth scrolling for the entire component */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
:focus-visible {
  outline: 2px solid #3B82F6;
  outline-offset: 2px;
  border-radius: 4px;
}
</style>
