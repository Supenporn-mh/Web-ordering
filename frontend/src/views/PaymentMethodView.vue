<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedMethod = ref('credit')
const methods = [
  { id: 'credit', name: 'เครดิต/เดบิต' },
  { id: 'promptpay', name: 'พร้อมเพย์' },
  { id: 'maemanee', name: 'แม่มณี' },
  { id: 'member', name: 'สมาชิก' },
  { id: 'truemoney', name: 'Truemoney' },
  { id: 'coupon', name: 'คูปอง' },
  { id: 'cash', name: 'เงินสด' },
  { id: 'roomservice', name: 'Room Service' },
  { id: 'alipay', name: 'Alipay' },
  { id: 'wechat', name: 'Wechat Pay' }
]
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] font-sans pb-32">
    <!-- Header -->
    <div class="px-6 py-4 flex items-center bg-white border-b border-gray-50 sticky top-0 z-10">
      <button @click="router.back()" class="mr-4 text-2xl text-gray-600">←</button>
      <h1 class="text-xl font-bold text-gray-800">เลือกช่องทางชำระเงิน</h1>
    </div>

    <div class="p-4 space-y-4">
      <!-- Order Summary Banner -->
      <div class="bg-[#eef4ff] rounded-2xl p-6 border border-blue-50">
        <h4 class="text-[#004e8c] font-black text-lg mb-2">รายละเอียดคำสั่งซื้อ</h4>
        <p class="text-[#1a7fff] text-sm font-bold">ประเภทการสั่ง: takeaway</p>
        <p class="text-[#1a7fff] text-sm font-bold">เวลาชำระเงิน: จ่ายทีหลัง</p>
      </div>

      <!-- Payment Method List -->
      <div class="bg-white rounded-[1.5rem] p-8 shadow-sm border border-gray-50 space-y-6">
        <h3 class="text-lg font-black text-gray-800">ช่องทางการชำระเงิน</h3>
        
        <div class="space-y-7">
          <label v-for="m in methods" :key="m.id" class="flex items-center gap-4 cursor-pointer group">
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="selectedMethod === m.id ? 'border-[#3a7c85]' : 'border-gray-200 group-hover:border-gray-300'">
               <div v-if="selectedMethod === m.id" class="w-3 h-3 bg-[#3a7c85] rounded-full"></div>
            </div>
            <input type="radio" :value="m.id" v-model="selectedMethod" class="hidden" />
            <span class="font-bold text-[#1f4e55] text-lg">{{ m.name }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Bottom Action -->
    <div class="fixed bottom-0 left-0 right-0 bg-[#e7f4f3] p-6 pb-20 pt-2 border-t border-gray-50">
      <div class="flex justify-between items-center mb-6 px-2">
        <span class="text-gray-900 font-black text-xl">ยอดเงินที่ต้องชำระ</span>
        <span class="text-[#1a7fff] font-black text-2xl">฿500</span>
      </div>
      <button @click="router.push({ name: 'success' })" class="w-full py-5 rounded-[1rem] bg-[#1a7fff] text-white font-black text-xl shadow-lg">
        ยืนยันคำสั่งซื้อ
      </button>
    </div>

    <!-- Bottom Nav -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 flex justify-around py-4 z-30">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center text-gray-400 text-xs cursor-pointer">🍴<span class="mt-1 text-[10px] font-bold">เมนู</span></div>
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center text-[#1a7fff] text-xs cursor-pointer">📋<span class="mt-1 text-[10px] font-bold">คำสั่งซื้อ</span></div>
      <div @click="router.push({ name: 'login' })" class="flex flex-col items-center text-gray-400 text-xs cursor-pointer">👤<span class="mt-1 text-[10px] font-bold">ออกจากระบบ</span></div>
    </div>
  </div>
</template>
