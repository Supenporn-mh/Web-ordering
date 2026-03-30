<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const phone = route.query.phone as string || ''
const mode = route.query.mode as string || ''

const otp = ref(['', '', '', '', '', ''])
const timer = ref(300) // 5 minutes (300 seconds)
let interval: any = null

onMounted(() => {
  interval = setInterval(() => {
    if (timer.value > 0) timer.value--
  }, 1000)
})

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

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="min-h-screen sm:max-w-md sm:mx-auto bg-[#e7f4f3] flex flex-col px-8 pt-20 pb-10 font-sans">
    <button @click="router.back()" class="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-10 border border-white shadow-sm active:scale-95 transition-all group">
      <span class="text-xl font-bold text-[#228085]">←</span>
    </button>

    <div class="mb-14">
      <h2 class="text-[32px] font-bold text-[#1a1a1a] mb-1.5 tracking-tight">Verify OTP</h2>
      <p class="text-[#7a869a] font-medium text-[17px]"> เราได้ส่งรหัส 6 หลักไปที่เบอร์ <span class="text-[#228085] font-semibold">+66 {{ phone }}</span></p>
    </div>

    <div class="flex-1 space-y-12">
      <div class="flex justify-between gap-2.5">
        <input 
          v-for="(_digit, i) in otp" :key="i" :id="`otp-${i}`"
          v-model="otp[i]" type="number" maxlength="1"
          @input="handleInput(i, $event)"
          class="w-full aspect-square text-center text-3xl font-bold bg-white border-2 border-transparent focus:border-[#228085] focus:shadow-lg focus:shadow-teal-500/10 rounded-[18px] outline-none transition-all shadow-sm no-spinner"
        />
      </div>

      <div class="text-center space-y-3">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-widest">Expires in</p>
        <p class="text-3xl font-bold text-[#1a1a1a] tracking-tight">{{ formatTime(timer) }}</p>
      </div>

      <button 
        @click="handleVerify"
        :disabled="otp.join('').length < 6"
        class="w-full py-4.5 rounded-[18px] bg-[#228085] text-white font-semibold text-lg shadow-lg shadow-teal-500/20 active:scale-95 disabled:bg-[#bfc5c5] disabled:shadow-none transition-all pointer-events-auto"
      >
        Verify Now
      </button>
    </div>

    <div class="text-center mt-auto pt-10">
      <button class="text-[#228085] font-semibold hover:underline underline-offset-4 decoration-2 text-sm">Resend OTP Code</button>
    </div>
  </div>
</template>

<style scoped>
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
.no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none; margin: 0;
}
</style>
