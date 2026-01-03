<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Content -->
    <div class="container mx-auto px-4 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p class="text-gray-600 text-lg">Last updated: {{ currentDate }}</p>
        </div>

        <!-- Content Sections -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="prose prose-lg max-w-none">

            <!-- Introduction -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p class="text-gray-700 mb-4">
                Welcome to Digital Menu. We are committed to protecting your personal information and your right to
                privacy.
                If you have any questions or concerns about this privacy policy, or our practices with regards to your
                personal
                information, please contact us at <span class="text-blue-600">privacy@digitalmenu.com</span>.
              </p>
            </section>

            <!-- Information We Collect -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              <p class="text-gray-700 mb-4">We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul class="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li>Register an account on our platform</li>
                <li>Express an interest in obtaining information about us or our products and services</li>
                <li>Participate in activities on the platform</li>
                <li>Contact us for support or inquiries</li>
              </ul>
              <p class="text-gray-700">
                The personal information we collect may include:
              </p>
              <ul class="list-disc pl-6 text-gray-700 mt-2 space-y-2">
                <li><strong>Name and contact data:</strong> Your first and last name, email address, phone number</li>
                <li><strong>Business information:</strong> Business name, TIN number, business contact details</li>
                <li><strong>Menu data:</strong> Your menu items, categories, pricing, and images</li>
                <li><strong>Account credentials:</strong> Passwords and other authentication information</li>
              </ul>
            </section>

            <!-- How We Use Your Information -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p class="text-gray-700 mb-4">We use your information for the following purposes:</p>
              <ul class="list-disc pl-6 text-gray-700 space-y-2">
                <li>To provide and maintain our service</li>
                <li>To manage your account and registration</li>
                <li>To communicate with you about updates, security alerts, and support messages</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our service</li>
                <li>To monitor usage of our service</li>
                <li>To detect, prevent and address technical issues</li>
              </ul>
            </section>

            <!-- Data Storage and Security -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">4. Data Storage and Security</h2>
              <p class="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures designed to protect the security
                of any
                personal information we process. However, please also remember that we cannot guarantee that the
                internet itself
                is 100% secure.
              </p>
              <p class="text-gray-700">
                We will only keep your personal information for as long as it is necessary for the purposes set out in
                this
                privacy policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <!-- Your Privacy Rights -->
            <section class="mb-10">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">5. Your Privacy Rights</h2>
              <p class="text-gray-700 mb-4">Depending on your location, you may have the following rights regarding your
                personal data:</p>
              <ul class="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Right to access:</strong> You have the right to request copies of your personal data.</li>
                <li><strong>Right to rectification:</strong> You have the right to request correction of any information
                  you believe is inaccurate.</li>
                <li><strong>Right to erasure:</strong> You have the right to request that we erase your personal data.
                </li>
                <li><strong>Right to restrict processing:</strong> You have the right to request that we restrict
                  processing of your personal data.</li>
                <li><strong>Right to data portability:</strong> You have the right to request transfer of your data to
                  another organization.</li>
                <li><strong>Right to object:</strong> You have the right to object to our processing of your personal
                  data.</li>
              </ul>
            </section>

            <!-- Contact Information -->
            <section class="mt-12 pt-8 border-t border-gray-200">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">6. Contact Us</h2>
              <p class="text-gray-700">
                If you have questions or comments about this policy, you may contact our Data Protection Officer at:
              </p>
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <p class="text-gray-700"><strong>Email:</strong> privacy@digitalmenu.com</p>
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
          <button @click="downloadPDF"
            class="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200">
            Download PDF Version
          </button>
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

const downloadPDF = () => {
  alert('PDF download functionality would be implemented in production. For now, please print this page.')
  // In production: window.open('/privacy-policy.pdf', '_blank')
}
</script>
