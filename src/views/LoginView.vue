<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phoneOrEmail = ref('')
const lang = ref('EN')

const handleSendOTP = () => {
  if (phoneOrEmail.value) {
    router.push({ name: 'otp', query: { phone: phoneOrEmail.value } })
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] flex flex-col items-center px-8 pt-24 pb-10 font-sans">
    
    <!-- Header with Logo and Lang Switcher -->
    <div class="w-full max-w-sm flex justify-between items-center mb-16">
      <div class="flex items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Sodexo_logo.svg" alt="Sodexo Logo" class="h-10 object-contain" />
      </div>
      
      <!-- Lang Toggle -->
      <div class="bg-white/80 p-1 rounded-full flex gap-1 border border-gray-100 shadow-sm">
        <button 
          @click="lang = 'EN'"
          :class="lang === 'EN' ? 'bg-[#228085] text-white' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
        >
          EN
        </button>
        <button 
          @click="lang = 'TH'"
          :class="lang === 'TH' ? 'bg-[#228085] text-white' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
        >
          TH
        </button>
      </div>
    </div>

    <!-- Sign In Titles -->
    <div class="w-full max-w-sm mb-10">
      <h1 class="text-3xl font-bold text-[#1a1a1a] mb-1">Sign In</h1>
      <p class="text-[#7a869a] font-medium text-lg">Phone / Email</p>
    </div>

    <!-- Form -->
    <div class="w-full max-w-sm space-y-8">
      <div class="space-y-3">
        <label class="text-sm font-bold text-[#1a1a1a] block ml-1">Phone / Email</label>
        <input 
          v-model="phoneOrEmail"
          type="text" 
          placeholder="Enter phone or email"
          class="w-full bg-white border border-gray-200 focus:border-[#228085] rounded-xl py-4 px-5 text-gray-700 font-medium outline-none transition-all placeholder:text-gray-300 shadow-sm"
        />
      </div>

      <button 
        @click="handleSendOTP"
        class="w-full py-4 rounded-xl bg-[#228085] text-white font-bold text-lg shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all hover:brightness-110"
      >
        Send OTP
      </button>

      <div class="text-center pt-2">
        <button 
          @click="router.push({ name: 'register' })"
          class="text-[#228085] font-medium hover:underline text-sm"
        >
          Don't have an account yet? Register
        </button>
      </div>
    </div>

  </div>
</template>
