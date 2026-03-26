<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const phone = ref('')
const acceptPDPA = ref(false)

const handleRegister = () => {
  if (name.value && phone.value && acceptPDPA.value) {
    router.push({ name: 'otp', query: { phone: phone.value, mode: 'register' } })
  }
}
</script>

<template>
  <div class="min-h-screen sm:max-w-md sm:mx-auto bg-white flex flex-col px-8 pt-20 pb-10 overflow-y-auto">
    <div class="mb-12">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p class="text-gray-500 font-medium">ลงทะเบียนครั้งแรกเพื่อเริ่มสั่งอาหาร</p>
    </div>

    <div class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-bold text-gray-700 ml-1">Full Name <span class="text-red-500">*</span></label>
        <input 
          v-model="name"
          type="text" 
          placeholder="กรอกชื่อ-นามสกุล"
          class="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#228085] focus:bg-white transition-all rounded-2xl py-4 px-4 text-lg font-bold outline-none shadow-sm"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-bold text-gray-700 ml-1">Phone Number <span class="text-red-500">*</span></label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+66</span>
          <input 
            v-model="phone"
            type="tel" 
            placeholder="081 234 5678"
            class="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#228085] focus:bg-white transition-all rounded-2xl py-4 pl-14 pr-4 text-lg font-bold outline-none shadow-sm"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-bold text-gray-700 ml-1">Email <span class="text-gray-400 font-normal">(Optional)</span></label>
        <input 
          v-model="email"
          type="email" 
          placeholder="example@mail.com"
          class="w-full bg-gray-50 border-2 border-gray-100 focus:border-[#228085] focus:bg-white transition-all rounded-2xl py-4 px-4 text-lg font-bold outline-none shadow-sm"
        />
      </div>

      <div class="space-y-4 pt-2">
        <label class="flex items-start gap-3 cursor-pointer group">
          <input 
            type="checkbox" 
            v-model="acceptPDPA" 
            class="mt-1 w-5 h-5 rounded border-gray-300 text-[#228085] focus:ring-[#228085] transition-all"
          />
          <span class="text-xs text-gray-500 font-medium leading-relaxed">
            ฉันได้อ่านและยอมรับ <span class="text-[#228085] font-bold">นโยบายความเป็นส่วนตัว (PDPA)</span> และยินยอมให้ระบบเก็บรักษาข้อมูลเพื่อเข้าใช้งาน
          </span>
        </label>

        <button 
          @click="handleRegister"
          :disabled="!name || phone.length < 9 || !acceptPDPA"
          class="w-full py-4 rounded-2xl bg-[#228085] text-white font-black text-lg shadow-lg shadow-teal-500/20 active:scale-95 disabled:grayscale disabled:opacity-50 transition-all duration-200"
        >
          Register & Continue
        </button>
      </div>
    </div>

    <div class="text-center mt-12 mb-6">
      <p class="text-gray-500 font-medium">มีบัญชีอยู่แล้ว?</p>
      <button 
        @click="router.push({ name: 'login' })"
        class="text-[#228085] font-black mt-1 hover:underline underline-offset-4"
      >
        เข้าสู่ระบบ (Login)
      </button>
    </div>
  </div>
</template>
