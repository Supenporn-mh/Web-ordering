<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const phoneOrEmail = ref('')
const lang = ref<'EN' | 'TH'>((localStorage.getItem('user_lang') as 'EN' | 'TH') || 'EN')

const handleSendOTP = () => {
  if (phoneOrEmail.value) {
    router.push({ name: 'otp', query: { phone: phoneOrEmail.value, mode: 'register' } })
  }
}

const t = {
  register: { EN: 'Register', TH: 'สมัครสมาชิก' },
  subTitle: { EN: 'Fill in information to use the system', TH: 'กรอกข้อมูลเพื่อเริ่มต้นใช้งานระบบ' },
  sendOtp: { EN: 'Sent OTP', TH: 'ส่งรหัส OTP' },
  alreadyHaveAccount: { EN: 'Already have an account? Sign in', TH: 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ' }
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] flex flex-col items-center px-8 pt-24 pb-10 font-sans">
    
    <!-- Header with Sodexo Logo & Lang Switcher -->
    <div class="w-full max-w-sm flex justify-between items-center mb-20">
      <div class="flex items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Sodexo_logo.svg" alt="Sodexo Logo" class="h-10 object-contain" />
      </div>
      
      <!-- Lang Toggle (Teal theme) -->
      <div class="bg-[#eff8f8]/80 p-1 rounded-full flex gap-1 shadow-sm border border-white/50">
        <button 
          @click="lang = 'EN'"
          :class="lang === 'EN' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
        >
          EN
        </button>
        <button 
          @click="lang = 'TH'"
          :class="lang === 'TH' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
        >
          TH
        </button>
      </div>
    </div>

    <!-- Titles -->
    <div class="w-full max-w-sm mb-12 text-left">
      <h1 class="text-[32px] font-bold text-[#1a1a1a] mb-1.5 tracking-tight">{{ t.register[lang] }}</h1>
      <p class="text-[#7a869a] font-medium text-lg leading-tight">{{ t.subTitle[lang] }}</p>
    </div>

    <!-- Form -->
    <div class="w-full max-w-sm space-y-10">
      <div class="space-y-3">
        <label class="text-[14px] font-semibold text-[#1a1a1a] block ml-1 uppercase tracking-wider">Phone / Email</label>
        <input 
          v-model="phoneOrEmail"
          type="text" 
          placeholder="Enter phone or email"
          class="w-full bg-white border-none focus:ring-2 focus:ring-[#228085]/50 rounded-[18px] py-4.5 px-6 text-gray-700 font-medium outline-none transition-all placeholder:text-gray-300 shadow-sm text-[16px]"
        />
      </div>

      <button 
        @click="handleSendOTP"
        :disabled="!phoneOrEmail"
        class="w-full py-4.5 rounded-[18px] bg-[#228085] text-white font-semibold text-lg shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all hover:brightness-110 disabled:bg-[#bfc5c5] disabled:shadow-none disabled:active:scale-100"
      >
        {{ t.sendOtp[lang] }}
      </button>

      <div class="text-center pt-2">
        <button 
          @click="router.push({ name: 'login' })"
          class="text-[#228085] font-semibold hover:underline text-sm underline-offset-4 decoration-2"
        >
          {{ t.alreadyHaveAccount[lang] }}
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
</style>
