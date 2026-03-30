<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const status = ref(1) // 1: Waiting, 2: Cooking, 3: Sending, 4: Complete

onMounted(() => {
  const timer = setInterval(() => {
    if (status.value < 4) {
      status.value++
    } else {
      clearInterval(timer)
    }
  }, 4000)
})

const steps = [
  { id: 1, name: 'รอดำเนินการ' },
  { id: 2, name: 'กำลังปรุง' },
  { id: 3, name: 'กำลังนำส่ง' },
  { id: 4, name: 'เรียบร้อย' }
]

const deliveryOption = ref('')
const orderNote = ref('')
const pickupTime = ref('')
const room = ref('')
const hn = ref('')
const discount = ref(0)
const cartItems = ref<any[]>([])

onMounted(() => {
  deliveryOption.value = localStorage.getItem('deliveryOption') || 'delivery'
  orderNote.value = localStorage.getItem('orderNote') || ''
  pickupTime.value = localStorage.getItem('pickupTime') || 'ทันที'
  room.value = localStorage.getItem('roomNumber') || '-'
  hn.value = localStorage.getItem('hnNumber') || '-'
  discount.value = Number(localStorage.getItem('discount')) || 0
  
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
})

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const qty = Number(item.qty) || Number(item.quantity) || 0
    return sum + (price * qty)
  }, 0)
})
const tax = computed(() => Math.round((subtotal.value - discount.value) * 0.07 * 100) / 100)
const total = computed(() => subtotal.value - discount.value + tax.value)

const formattedDate = computed(() => {
  const d = new Date()
  const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤษภาคม", "ธันวาคม"]
  return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543} เวลา ${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`
})
</script>

<template>
  <div class="min-h-screen bg-[#f8fcfc] font-sans pb-32">
    <!-- Header -->
    <div class="px-5 py-5 flex items-center justify-center bg-white sticky top-0 z-20 shadow-sm border-b border-gray-50">
      <h1 class="text-[18px] font-bold text-gray-800 tracking-tight">E-Receipt</h1>
    </div>

    <div class="p-4 space-y-4">
      
      <!-- 1. Pending Status Card -->
      <div class="bg-[#fffcf0] rounded-[24px] p-8 text-center shadow-sm border border-yellow-100/50">
        <div class="w-16 h-16 bg-[#caa542] rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-xl shadow-yellow-500/20">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 class="text-[20px] font-bold text-gray-800 mb-1.5 tracking-tight">Pending Payment</h2>
        <p class="text-[15px] font-bold text-[#caa542]">Please complete payment</p>
      </div>

      <!-- 2. Tracking Card -->
      <div class="bg-white rounded-[24px] p-7 shadow-sm border border-gray-50/50">
        <h3 class="text-[12px] font-bold text-gray-300 mb-8 text-center uppercase tracking-[0.2em]">สถานะคำสั่งซื้อ (TRACKING)</h3>
        
        <div class="flex items-center justify-between relative px-2">
          <div class="absolute top-[23px] left-8 right-8 h-1.5 bg-[#eff8f8] rounded-full">
            <div class="absolute inset-0 bg-[#228085] rounded-full transition-all duration-1000 ease-out" :style="{ width: `${(status - 1) * 33.3}%` }"></div>
          </div>

          <div v-for="step in steps" :key="step.id" class="relative z-10 flex flex-col items-center gap-3">
             <div 
                class="w-12 h-12 rounded-full border-[3px] flex items-center justify-center bg-white transition-all duration-500"
                :class="status >= step.id ? 'border-[#228085] scale-110 shadow-lg shadow-teal-500/10' : 'border-gray-100'"
             >
                <div class="w-6 h-6 flex items-center justify-center transition-opacity" :class="status >= step.id ? 'opacity-100' : 'opacity-20 grayscale'">
                  <svg v-if="step.id === 1" class="w-full h-full text-[#228085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <span v-if="step.id === 2" class="text-2xl mt-1 leading-none">👨‍🍳</span>
                  <svg v-if="step.id === 3" class="w-full h-full text-[#228085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                  <svg v-if="step.id === 4" class="w-full h-full text-[#228085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
                </div>
             </div>
             <span class="text-[11px] font-bold uppercase tracking-wider transition-colors" :class="status >= step.id ? 'text-[#228085]' : 'text-gray-300'">{{ step.name }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Details Card -->
      <div class="bg-white rounded-[24px] px-7 py-4 shadow-sm border border-gray-50/50">
        <div class="divide-y divide-gray-50">
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">เลขที่สั่งซื้อ</span>
            <span class="text-[16px] font-bold text-gray-800">1202603170001</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">วันที่ & เวลา</span>
            <span class="text-[16px] font-bold text-gray-800">{{ formattedDate }}</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">ประเภทการสั่ง</span>
            <span class="text-[16px] font-bold text-gray-800">{{ deliveryOption === 'delivery' ? 'บริการจัดส่ง' : 'รับกลับบ้าน' }}</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">ห้อง</span>
            <span class="text-[16px] font-bold text-gray-800">{{ room }}</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">HN</span>
            <span class="text-[16px] font-bold text-gray-800">{{ hn }}</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">วิธีการชำระเงิน</span>
            <span class="text-[16px] font-bold text-gray-800">เงินสด</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">สถานะการชำระเงิน</span>
            <span class="text-[16px] font-bold text-[#caa542]">รอดำเนินการ</span>
          </div>
          <div class="flex justify-between items-center py-4">
            <span class="text-[16px] text-gray-400 font-bold">สถานะออเดอร์</span>
            <span class="text-[16px] font-bold text-gray-800">รอดำเนินการ</span>
          </div>
        </div>
      </div>

      <!-- 4. Items Card -->
      <div class="bg-white rounded-[24px] p-7 shadow-sm border border-gray-50/50">
        <div class="flex justify-between items-center mb-6">
           <h3 class="text-[16px] font-bold text-gray-800">รายการออเดอร์</h3>
           <span class="text-[12px] text-gray-400 font-bold uppercase tracking-wider">ออเดอร์ทั้งหมด</span>
        </div>
        <div class="space-y-6 pb-6 border-b border-gray-50 mb-6">
          <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
            <div class="flex gap-4 min-w-0">
              <div class="w-14 h-14 rounded-[18px] overflow-hidden border border-gray-50 shadow-sm bg-gray-50/50 shrink-0 flex items-center justify-center">
                 <img v-if="item.img" :src="item.img" class="w-full h-full object-cover" />
                 <span v-else class="text-2xl">🍜</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[16px] font-bold text-gray-800 truncate"><span class="text-[#228085]">{{ item.qty || item.quantity }}x</span> {{ item.name }}</p>
                <p v-if="item.desc || item.note" class="text-[12px] text-gray-400 mt-1 truncate">+ {{ item.desc || item.note }}</p>
              </div>
            </div>
            <div class="text-right ml-4">
               <span class="text-[18px] font-bold text-gray-900">฿{{ (item.price * (item.qty || item.quantity)).toLocaleString() }}</span>
            </div>
          </div>
        </div>
        <div class="space-y-2 mb-6">
          <div class="flex justify-between items-center text-[15px] font-medium text-gray-400">
             <span>ยอดรวม</span>
             <span class="font-bold text-gray-800">฿{{ subtotal.toLocaleString() }}</span>
          </div>
          <div v-if="discount > 0" class="flex justify-between items-center text-[15px] font-medium text-red-500">
             <span>ส่วนลด</span>
             <span class="font-bold">-฿{{ discount.toLocaleString() }}</span>
          </div>
           <div class="flex justify-between items-center text-[15px] font-medium text-gray-400">
             <span>ภาษี (7%)</span>
             <span class="font-bold text-gray-800">฿{{ tax.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center pt-4 border-t border-gray-100">
           <span class="text-[18px] font-bold text-gray-900">ยอดรวมสุทธิ</span>
           <span class="text-[24px] font-black text-[#228085]">฿{{ total.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-4 pt-4 px-1 pb-14">
        <button @click="router.push({ name: 'orders' })" class="w-full py-5 rounded-[24px] bg-[#228085] text-white font-bold text-[18px] shadow-lg shadow-teal-500/10 active:scale-95 transition-all">View Orders</button>
        <button @click="router.push({ name: 'menu' })" class="w-full py-5 rounded-[24px] bg-[#e7f4f3] text-[#228085] font-bold text-[18px] active:scale-95 transition-all border border-teal-100/50">Back to Menu</button>
      </div>
    </div>

    <!-- Standardized Bottom Nav (English labels as per screenshot) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 flex h-[85px] items-center justify-around z-50 pb-safe shadow-[0_-5px_25px_rgba(0,0,0,0.03)] px-4">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-300 cursor-pointer w-24 h-full group active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2v10c0 1.1.9 2 2 2h2v7h2v-7h2c1.1 0 2-.9 2-2V2H6z M11 10H8V5h1v5h1V5h1v5z"/></svg>
         <span class="text-[12px] font-bold tracking-tight">Menu</span>
      </div>
      
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-300 cursor-pointer w-24 h-full group active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">Orders</span>
      </div>

      <div @click="router.push({ name: 'profile' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-300 cursor-pointer w-24 h-full group active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">Profile</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
</style>
