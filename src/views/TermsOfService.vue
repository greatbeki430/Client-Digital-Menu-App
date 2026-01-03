<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p class="text-gray-600 text-lg">Last updated: {{ currentDate }}</p>
          <p class="text-gray-500 mt-2">Please read these terms carefully before using our service.</p>
        </div>

        <!-- Content Sections -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="prose prose-lg max-w-none">

            <!-- Agreement -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p class="text-gray-700">
                By accessing or using Digital Menu's services, you agree to be bound by these Terms of Service.
                If you disagree with any part of the terms, you may not access the service.
              </p>
            </section>

            <!-- Description of Service -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
              <p class="text-gray-700 mb-4">
                Digital Menu provides a platform for restaurants, cafes, and other food service businesses to create,
                manage, and display digital menus. Our services include:
              </p>
              <ul class="list-disc pl-6 text-gray-700 space-y-2">
                <li>Menu creation and management tools</li>
                <li>Digital menu display solutions</li>
                <li>Order management systems</li>
                <li>Customer relationship management</li>
                <li>Analytics and reporting</li>
              </ul>
            </section>

            <!-- User Accounts -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
              <p class="text-gray-700 mb-4">When you create an account with us, you must:</p>
              <ul class="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide accurate, complete, and current information</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Be responsible for all activities that occur under your account</li>
              </ul>
              <p class="text-gray-700 mt-4">
                We reserve the right to disable any user account at our sole discretion for any reason,
                including if you have violated any provision of these Terms.
              </p>
            </section>

            <!-- Subscription and Payments -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Subscription and Payments</h2>
              <p class="text-gray-700 mb-4">
                Some parts of the Service are billed on a subscription basis. You will be billed in advance on a
                recurring
                and periodic basis. At the end of each period, your subscription will automatically renew under the same
                conditions unless you cancel it.
              </p>
              <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                      <strong>Note:</strong> During the development phase, all features are available for free.
                      Subscription plans will be introduced in the production version.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <!-- Content Ownership -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Content Ownership</h2>
              <p class="text-gray-700 mb-4">
                You retain all rights to the content you upload to Digital Menu, including:
              </p>
              <ul class="list-disc pl-6 text-gray-700 space-y-2">
                <li>Menu item descriptions and prices</li>
                <li>Food and beverage images</li>
                <li>Business information and branding</li>
                <li>Customer data and order history</li>
              </ul>
              <p class="text-gray-700 mt-4">
                By uploading content, you grant Digital Menu a worldwide, non-exclusive, royalty-free license to use,
                reproduce, and display your content solely for the purpose of providing the service to you.
              </p>
            </section>

            <!-- Prohibited Uses -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Prohibited Uses</h2>
              <p class="text-gray-700 mb-4">You agree not to use the service:</p>
              <ul class="list-disc pl-6 text-gray-700 space-y-2">
                <li>In any way that violates any applicable law or regulation</li>
                <li>To transmit any advertising or promotional material without our consent</li>
                <li>To impersonate or attempt to impersonate Digital Menu or another user</li>
                <li>To engage in any conduct that restricts or inhibits anyone's use of the service</li>
                <li>To upload viruses or malicious code</li>
                <li>To collect or track personal information of others</li>
              </ul>
            </section>

            <!-- Termination -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
              <p class="text-gray-700">
                We may terminate or suspend your account immediately, without prior notice or liability, for any reason
                whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use
                the
                Service will immediately cease.
              </p>
            </section>

            <!-- Limitation of Liability -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <p class="text-gray-700">
                In no event shall Digital Menu, nor its directors, employees, partners, agents, suppliers, or
                affiliates,
                be liable for any indirect, incidental, special, consequential or punitive damages, including without
                limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <!-- Changes to Terms -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">9. Changes to Terms</h2>
              <p class="text-gray-700">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will
                provide
                at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will
                be
                determined at our sole discretion.
              </p>
            </section>

            <!-- Contact Information -->
            <section class="mt-12 pt-8 border-t border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
              <p class="text-gray-700 mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700"><strong>Email:</strong> legal@digitalmenu.com</p>
                <p class="text-gray-700"><strong>Address:</strong> 123 Tech Street, Digital City, Addis 10001</p>
                <p class="text-gray-700"><strong>Phone:</strong> (+251) 961 305 788</p>
              </div>
            </section>

          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-8 flex justify-center space-x-4">
          <router-link to="/"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
            Back to Home
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
import { computed } from 'vue'

const currentDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})
</script>
