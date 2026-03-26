<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const phone = route.query.phone as string || ''
const mode = route.query.mode as string || 'login'

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
  if (val.length > 1) {
    otp.value[index] = val.slice(-1)
  }
  
  if (val && index < 5) {
    const nextInput = document.getElementById(`otp-${index + 1}`)
    nextInput?.focus()
  }
}

const handleVerify = () => {
  const fullOtp = otp.value.join('')
  if (fullOtp.length === 6) {
    router.push({ name: 'branch' })
  }
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="min-h-screen sm:max-w-md sm:mx-auto bg-white flex flex-col px-8 pt-20 pb-10">
    <button @click="router.back()" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-8 border border-gray-100 active:scale-95 transition-all">
      <span class="text-xl font-bold text-gray-600">←</span>
    </button>

    <div class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
      <p class="text-gray-500 font-medium">เราได้ส่งรหัส 6 หลักไปที่เบอร์ <span class="text-primary-main font-bold">+66 {{ phone }}</span></p>
    </div>

    <div class="flex-1 space-y-10">
      <div class="flex justify-between gap-2">
        <input 
          v-for="(digit, i) in otp" 
          :key="i"
          :id="`otp-${i}`"
          v-model="otp[i]"
          type="number"
          maxlength="1"
          @input="handleInput(i, $event)"
          class="w-full aspect-square text-center text-2xl font-black bg-gray-50 border-2 border-transparent focus:border-primary-main focus:bg-white rounded-2xl outline-none transition-all shadow-sm no-spinner"
        />
      </div>

      <div class="text-center space-y-2">
        <p class="text-sm font-medium text-gray-500">รหัสจะหมดอายุใน</p>
        <p class="text-2xl font-black text-primary-dark tracking-tighter">{{ formatTime(timer) }}</p>
      </div>

      <button 
        @click="handleVerify"
        :disabled="otp.join('').length < 6"
        class="w-full py-4 rounded-2xl bg-primary-main text-white font-black text-lg shadow-lg shadow-primary-main/30 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all duration-200"
      >
        Verify Now
      </button>
    </div>

    <div class="text-center mt-auto pt-10">
      <button class="text-gray-400 font-bold hover:text-primary-main transition-colors">ส่งรหัสอีกครั้ง (Resend OTP)</button>
    </div>
  </div>
</template>

<style scoped>
.no-spinner::-webkit-inner-spin-button,
.no-spinner::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
