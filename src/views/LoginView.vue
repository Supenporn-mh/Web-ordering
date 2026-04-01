<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const phoneOrEmail = ref('')
const lang = ref<'EN' | 'TH'>((localStorage.getItem('user_lang') as 'EN' | 'TH') || 'TH')

onMounted(() => {
  phoneOrEmail.value = route.query.phone as string || ''
  lang.value = (localStorage.getItem('user_lang') as 'EN' | 'TH') || 'TH'
})

const setLang = (val: 'EN' | 'TH') => {
  lang.value = val
  localStorage.setItem('user_lang', val)
}

const handleInput = (e: any) => {
  const val = e.target.value.replace(/\D/g, '')
  phoneOrEmail.value = val
}

const handleSendOTP = () => {
  if (phoneOrEmail.value.length >= 9) {
    router.push({ name: 'otp', query: { phone: phoneOrEmail.value } })
  }
}

const goToRegisterInput = () => {
  router.push({ name: 'register-step1' })
}

const t = {
  signIn: { EN: 'Sign In', TH: 'ลงชื่อเข้าใช้' },
  sendOtp: { EN: 'Send OTP', TH: 'ส่งรหัส OTP' },
  notHaveAccount: { EN: "Don't have an account yet? Register", TH: "ยังไม่มีบัญชี? สมัครสมาชิก" },
  placeholder: { EN: 'Enter phone or email', TH: 'กรอกเบอร์โทรหรืออีเมล' }
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] flex flex-col items-center px-8 pt-24 pb-10 font-sans">
    
    <div class="w-full max-w-sm flex justify-between items-center mb-20">
      <div class="flex items-center">
        <img src="https://upload.wikimedia.org/wikipedia/commons/d/d4/Sodexo_logo.svg" alt="Sodexo Logo" class="h-10 object-contain" />
      </div>
      
      <div class="bg-[#eff8f8]/80 p-1 rounded-full flex gap-1 shadow-sm border border-white/50">
        <button 
          @click="setLang('EN')"
          :class="lang === 'EN' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
        >
          EN
        </button>
        <button 
          @click="setLang('TH')"
          :class="lang === 'TH' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-600'"
          class="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
        >
          TH
        </button>
      </div>
    </div>

    <div class="w-full max-w-sm mb-12">
      <h1 class="text-[32px] font-medium text-[#1a1a1a] mb-1.5 tracking-tight leading-tight">{{ t.signIn[lang] }}</h1>
      <p class="text-[#7a869a] font-medium text-lg leading-tight">Phone / Email</p>
    </div>

    <div class="w-full max-w-sm space-y-10">
      <div class="space-y-3">
        <label class="text-[14px] font-semibold text-[#1a1a1a] block ml-1">Phone / Email</label>
        <input 
          v-model="phoneOrEmail"
          type="tel" 
          :placeholder="t.placeholder[lang]"
          @input="handleInput"
          class="w-full bg-white border-none focus:ring-2 focus:ring-[#228085]/50 rounded-[18px] py-4.5 px-6 text-gray-700 font-medium outline-none transition-all placeholder:text-gray-500 shadow-sm text-[16px]"
        />
      </div>

      <button 
        @click="handleSendOTP"
        :disabled="phoneOrEmail.length < 10"
        class="w-full py-4.5 rounded-[18px] bg-[#228085] text-white font-semibold text-lg shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all hover:brightness-110 disabled:bg-[#bfc5c5] disabled:shadow-none disabled:active:scale-100"
      >
        {{ t.sendOtp[lang] }}
      </button>

      <div class="text-center pt-2">
        <button 
          @click="goToRegisterInput"
          class="text-[#228085] font-semibold hover:underline text-sm underline-offset-4 decoration-2"
        >
          {{ t.notHaveAccount[lang] }}
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
</style>
