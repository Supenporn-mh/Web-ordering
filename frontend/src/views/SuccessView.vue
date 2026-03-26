<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const status = ref(1) // 1: Waiting, 2: Cooking, 3: Sending, 4: Complete

onMounted(() => {
  // Simple animation simulation
  const timer = setInterval(() => {
    if (status.value < 4) {
      status.value++
    } else {
      clearInterval(timer)
    }
  }, 3000)
})

const steps = [
  { id: 1, name: 'รอดำเนินการ' },
  { id: 2, name: 'กำลังปรุง' },
  { id: 3, name: 'กำลังนำส่ง' },
  { id: 4, name: 'เรียบร้อย' }
]

const orderType = ref('Room Delivery')
const hn = ref('828292992')
const room = ref('879')

onMounted(() => {
  const isDelivery = localStorage.getItem('deliveryOption') === 'delivery'
  orderType.value = isDelivery ? 'บริการจัดส่ง' : 'รับที่ร้าน'
})
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] font-sans pb-28">
    <!-- Header -->
    <div class="px-6 py-6 flex items-center justify-center bg-white sticky top-0 z-10 shadow-sm shadow-gray-100/50">
      <h1 class="text-xl font-bold text-gray-900">E-Receipt</h1>
    </div>

    <div class="p-6 space-y-4">
      
      <!-- 1. Pending Card (Matches Image - Now at Top) -->
      <div class="bg-[#fff9ea] rounded-2xl p-6 text-center shadow-sm">
        <div class="w-14 h-14 bg-[#caa542] rounded-full flex items-center justify-center mx-auto mb-3 text-white text-2xl">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 class="text-[#0e1f32] font-bold text-xl mb-1">Pending Payment</h2>
        <p class="text-[#caa542] font-medium text-sm">Please complete payment</p>
      </div>

      <!-- 2. Animated Status Tracker (Now Second) -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
        <h3 class="text-xs font-bold text-gray-400 mb-6 text-center uppercase tracking-widest">สถานะคำสั่งซื้อ (Tracking)</h3>
        <div class="flex items-center justify-between relative px-2">
          <!-- Progress Container bounded by exact ends of circles -->
          <div class="absolute top-[22px] left-6 right-6 h-1 bg-[#e7f4f3] rounded-full -z-0 max-w-full">
            <!-- Active Progress Line Animation bounded inside -->
            <div 
              class="absolute top-0 left-0 bottom-0 bg-[#228085] rounded-full transition-all duration-1000"
              :style="{ width: `${(status - 1) * 33.33}%` }"
            ></div>
          </div>

          <div v-for="step in steps" :key="step.id" class="relative z-10 flex flex-col items-center gap-3">
             <div 
                class="w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-500 bg-white"
                :class="status >= step.id ? 'border-[#228085] scale-110 shadow-md shadow-teal-500/10' : 'border-gray-100'"
             >
                <div class="w-6 h-6 flex justify-center items-center" :class="status >= step.id ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale'">
                  <!-- Waiting Icon -->
                  <svg v-if="step.id === 1" :stroke="status >= step.id ? '#228085' : 'currentColor'" fill="none" viewBox="0 0 24 24" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <!-- Cooking Icon (Chef Shortcut/Emoji for simplicity as SVG path for a detailed chef is complex) -->
                  <div v-if="step.id === 2" class="text-2xl leading-none">👨‍🍳</div>
                  <!-- Sending/Delivery Icon -->
                  <svg v-if="step.id === 3" :stroke="status >= step.id ? '#228085' : 'currentColor'" fill="none" viewBox="0 0 24 24" class="w-full h-full"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10h2m4 0h6m4 0h2v-4.586a1 1 0 00-.293-.707l-2-2A1 1 0 0018 7.5V16M13 5v4m0 0h5M13 9h5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                  <!-- Complete Icon -->
                  <svg v-if="step.id === 4" :stroke="status >= step.id ? '#228085' : 'currentColor'" fill="none" viewBox="0 0 24 24" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
             </div>
             <span 
                class="text-[10px] font-bold transition-colors duration-500 tracking-wider"
                :class="status >= step.id ? 'text-[#228085]' : 'text-gray-300'"
             >
                {{ step.name }}
             </span>
          </div>
        </div>
      </div>

      <!-- 3. Order Details with Row Separators (Matches Image) -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-2">
          <div class="flex justify-between items-center text-sm py-3.5 border-b border-gray-50">
            <span class="text-gray-400 font-medium">เลขที่สั่งซื้อ</span>
            <span class="text-[#0e1f32] font-bold">1202603170001</span>
          </div>
          <div class="flex justify-between items-center text-sm py-3.5 border-b border-gray-50">
            <span class="text-gray-400 font-medium">วันที่ & เวลา</span>
            <span class="text-[#0e1f32] font-bold">17 มีนาคม 2569 เวลา 14:14</span>
          </div>
          <div class="flex justify-between items-center text-sm py-3.5 border-b border-gray-50">
            <span class="text-gray-400 font-medium">ประเภทการสั่ง</span>
            <span class="text-[#0e1f32] font-bold">{{ orderType }}</span>
          </div>
          <div v-if="orderType === 'บริการจัดส่ง'" class="flex justify-between items-center text-sm py-3.5 border-b border-gray-50">
            <span class="text-gray-400 font-medium">ห้อง / HN</span>
            <span class="text-[#0e1f32] font-bold">{{ room }} / {{ hn }}</span>
          </div>
          <div class="flex justify-between items-center text-sm py-3.5 border-b border-gray-50">
            <span class="text-gray-400 font-medium">วิธีการชำระเงิน</span>
            <span class="text-[#0e1f32] font-bold">เงินสด</span>
          </div>
          <div class="flex justify-between items-center text-sm py-3.5 border-b border-gray-50">
            <span class="text-gray-400 font-medium">สถานะการชำระเงิน</span>
            <span class="text-[#caa542] font-bold px-2">รอดำเนินการ</span>
          </div>
          <div class="flex justify-between items-center text-sm py-3.5">
            <span class="text-gray-400 font-medium">สถานะออเดอร์</span>
            <span class="text-[#0e1f32] font-bold">รอดำเนินการ</span>
          </div>
        </div>
      </div>

      <!-- 4. Order Items Summary with Row Separators -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-[#0e1f32] font-bold text-sm mb-4">รายการอาหาร</h3>
        <div class="flex justify-between items-start pb-4 border-b border-gray-50 mb-4">
          <div class="flex gap-3">
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80" class="w-12 h-12 rounded-lg object-cover shadow-sm" />
            <div>
              <p class="text-[#596675] text-sm"><span class="font-bold text-[#0e1f32]">1x</span> กรีกสลัด</p>
              <p class="text-gray-400 text-[10px] mt-1">+ น้ำสลัดน้ำผึ้งและน้ำส้ม</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-bold text-[#0e1f32] text-sm">฿210</p>
            <p class="text-gray-400 text-[10px] mt-1 line-through">฿0</p>
          </div>
        </div>
        <div class="flex justify-between items-end">
          <span class="text-[#0e1f32] font-bold text-lg">ยอดรวมสุทธิ</span>
          <span class="text-[#228085] font-bold text-2xl">฿210</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3 pt-2">
        <button @click="router.push({ name: 'orders' })" class="w-full py-4 rounded-xl bg-[#228085] text-white font-bold text-base shadow-lg shadow-teal-500/20 active:scale-95 transition-all outline-none">
          View Orders
        </button>
        <button @click="router.push({ name: 'menu' })" class="w-full py-4 rounded-xl bg-[#e7f4f3] text-[#0e1f32] font-bold text-base active:scale-95 transition-all outline-none">
          Back to Menu
        </button>
      </div>
    </div>

    <!-- Bottom Nav -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex h-[72px] items-center justify-around z-30 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer w-20 h-full">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"></path></svg>
        <span class="text-[10px] font-bold">เมนู</span>
      </div>
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer w-20 h-full">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        <span class="text-[10px] font-bold">คำสั่งซื้อ</span>
      </div>
      <div @click="router.push({ name: 'login'})" class="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer w-20 h-full">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-[10px] font-bold">โปรไฟล์</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
</style>
