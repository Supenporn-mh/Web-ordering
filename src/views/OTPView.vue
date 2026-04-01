<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const phone = route.query.phone as string || ''
const mode = route.query.mode as string || ''

const otp = ref(['', '', '', '', '', ''])
const timer = ref(180) // 3 minutes (180 seconds)
let interval: any = null

const lang = ref(localStorage.getItem('user_lang') || 'TH')

onMounted(() => {
  lang.value = localStorage.getItem('user_lang') || 'TH'
  interval = setInterval(() => {
    if (timer.value > 0) timer.value--
  }, 1000)
})

const t = computed(() => ({
  title: lang.value === 'TH' ? 'ยืนยันตัวตน' : 'Verify Account',
  sentTo: lang.value === 'TH' ? 'เราได้ส่งรหัส 6 หลักไปที่เบอร์' : 'We sent a 6-digit code to',
  expiresIn: lang.value === 'TH' ? 'รหัสจะหมดอายุใน' : 'Code expires in',
  verifyBtn: lang.value === 'TH' ? 'ยืนยันรหัส OTP' : 'Verify OTP',
  notReceived: lang.value === 'TH' ? 'ไม่ได้รับรหัส?' : "Didn't receive the code?",
  resendBtn: lang.value === 'TH' ? 'ส่งรหัสอีกครั้ง' : 'Resend OTP'
}))

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const handleInput = (index: number, e: any) => {
  const val = e.target.value
  if (val.length > 1) otp.value[index] = val.slice(-1)
  if (val && index < 5) document.getElementById(`otp-${index + 1}`)?.focus()
}

const handleVerify = () => {
  const fullOtp = otp.value.join('')
  if (fullOtp.length === 6) {
    if (mode === 'register') router.push({ name: 'register', query: { phone: phone } })
    else router.push({ name: 'branch' })
  }
}

const canResend = computed(() => timer.value === 0)

const resendOTP = () => {
  if (!canResend.value) return
  timer.value = 180 // Reset to 3 minutes
  // Add actual API call here if needed
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="min-h-screen sm:max-w-md sm:mx-auto bg-[#e7f4f3] flex flex-col pt-20 pb-10 font-sans">
    <button @click="router.back()" class="ml-8 w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-10 border border-white shadow-sm active:scale-95 transition-all group">
      <span class="text-xl font-medium text-[#228085]">←</span>
    </button>

    <div class="px-8 mb-10">
      <h1 class="text-[34px] font-medium text-gray-900 tracking-tight leading-tight mb-2">{{ t.title }}</h1>
      <p class="text-gray-400 font-medium text-[16px] leading-relaxed">{{ t.sentTo }} <span class="text-gray-800 font-semibold">+66 {{ phone }}</span></p>
    </div>

    <div class="px-8 space-y-6">
      <!-- OTP Inputs -->
      <div class="flex justify-between gap-2.5">
        <input 
          v-for="(_digit, i) in otp" :key="i"
          :id="'otp-' + i"
          v-model="otp[i]"
          type="tel"
          maxlength="1"
          class="w-full aspect-square text-center text-3xl font-semibold bg-white border border-gray-100 rounded-[20px] text-[#228085] outline-none focus:ring-2 focus:ring-[#228085]/20 shadow-sm transition-all shadow-teal-900/5 placeholder:text-gray-200"
          @input="handleInput(i, $event)"
        />
      </div>

      <!-- Timer -->
      <div class="text-center space-y-2">
        <p class="text-[12px] font-medium text-gray-400 uppercase tracking-widest">{{ t.expiresIn }}</p>
        <p class="text-[28px] font-semibold text-gray-800 tracking-tight transition-all" :class="timer === 0 ? 'text-red-500 animate-pulse' : 'text-gray-800'">{{ formatTime(timer) }}</p>
      </div>

      <!-- Action Button -->
      <div class="pt-6">
        <button 
          @click="handleVerify" 
          :disabled="otp.join('').length < 6"
          class="w-full py-5 rounded-[22px] bg-[#228085] text-white font-semibold text-[18px] shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-40 transition-all"
        >
          {{ t.verifyBtn }}
        </button>
      </div>

      <!-- Resend Info -->
      <div class="text-center pt-4">
         <p class="text-gray-400 font-medium text-[15px]">{{ t.notReceived }} 
           <button 
             @click="resendOTP" 
             :disabled="!canResend"
             class="text-[#228085] font-semibold underline underline-offset-4 ml-1 disabled:text-gray-300 disabled:no-underline transition-all"
           >
             {{ t.resendBtn }}
           </button>
         </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none; margin: 0;
}
</style>
