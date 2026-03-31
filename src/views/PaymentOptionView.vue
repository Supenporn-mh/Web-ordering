<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Step 1: เลือกเวลาชำระ
const payTiming = ref<'now' | 'later' | null>(null)

// Step 2: เลือกช่องทาง (เฉพาะ now)
const payMethod = ref('promptpay')

const deliveryOption = ref('')
const orderNote = ref('')
const putInBox = ref('false')
const pickupMode = ref('')
const pickupTime = ref('ทันที')
const room = ref('')
const hn = ref('')
const discount = ref(0)
const cartItems = ref<any[]>([])

onMounted(() => {
  deliveryOption.value = localStorage.getItem('deliveryOption') || 'delivery'
  orderNote.value = localStorage.getItem('orderNote') || ''
  putInBox.value = localStorage.getItem('putInBox') || 'false'
  pickupMode.value = localStorage.getItem('pickupMode') || ''
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

const canProceed = computed(() => {
  if (!payTiming.value) return false
  if (payTiming.value === 'now' && !payMethod.value) return false
  return true
})

const handlePay = () => {
  if (!canProceed.value) return
  router.push({ name: 'success' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fcfc] font-sans pb-40">
    <!-- Header -->
    <div class="px-5 py-3 flex items-center bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm shadow-teal-900/5">
      <button @click="router.back()" class="p-2 rounded-xl text-gray-900 active:scale-90 absolute left-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-[18px] font-bold text-gray-800 mx-auto tracking-tight">สรุปคำสั่งซื้อ</h1>
    </div>

    <div class="px-4 pt-6 pb-10 space-y-4">
      <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200">
        <div class="flex items-start gap-4">
          <!-- Icon -->
          <div class="mt-1 text-red-500 shrink-0">
             <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"/></svg>
          </div>
          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-[16px] font-bold text-gray-500 mb-1">{{ deliveryOption === 'delivery' ? 'จัดส่งไปที่' : 'ช่องทางการรับอาหาร' }}</p>
            <template v-if="deliveryOption === 'delivery'">
              <p class="text-[18px] font-bold text-gray-900 leading-tight">ห้องพัก {{ room }} — HN {{ hn }}</p>
            </template>
            <template v-else>
              <p class="text-[18px] font-bold text-gray-900 leading-tight">รับอาหารด้วยตนเอง (Pickup)</p>
            </template>
            <p class="text-[14px] text-gray-600 mt-2 font-bold tracking-tight">
               หมายเหตุ: 
               {{ deliveryOption === 'delivery' ? (putInBox === 'true' ? 'ใส่กล่อง' : 'ปกติ') : (pickupMode === 'dine-in' ? 'ทานที่ร้าน' : 'รับกลับบ้าน') }}
               {{ orderNote ? ', ' + orderNote : '' }}
            </p>
          </div>
          <!-- Time (Top Right) -->
          <div class="text-right shrink-0">
            <p class="text-[14px] text-gray-500 font-bold uppercase tracking-wider">เวลา</p>
            <p class="text-[16px] font-bold text-[#228085]">{{ pickupTime }}</p>
          </div>
        </div>
      </div>

      <!-- Payment Option Selection (Standardized rounded-[24px]) -->
      <div class="px-1">
        <p class="text-[16px] font-bold text-gray-400 mb-4 ml-1">เลือกรูปแบบการชำระ</p>
        <div class="grid grid-cols-2 gap-4">
          <!-- Instant Pay -->
          <button
            @click="payTiming = 'now'"
            :class="payTiming === 'now' ? 'border-[#228085] bg-[#f0f9f9]' : 'border-gray-50 bg-white shadow-sm'"
            class="rounded-[24px] border-2 p-6 text-left transition-all active:scale-95 flex flex-col items-start gap-1"
          >
            <div>
              <p class="text-[18px] font-bold text-gray-900 leading-tight">ชำระทันที</p>
              <p class="text-[14px] text-gray-400 mt-1 leading-snug">ชำระผ่านช่องทางที่เลือก</p>
            </div>
            <div v-if="payTiming === 'now'" class="w-7 h-7 rounded-full bg-[#228085] flex items-center justify-center mt-2">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"/></svg>
            </div>
          </button>

          <!-- Pay Later -->
          <button
            @click="payTiming = 'later'"
            :class="payTiming === 'later' ? 'border-[#228085] bg-[#f0f9f9]' : 'border-gray-50 bg-white shadow-sm'"
            class="rounded-[24px] border-2 p-6 text-left transition-all active:scale-95 flex flex-col items-start gap-1"
          >
            <div>
              <p class="text-[18px] font-bold text-gray-900 leading-tight">ชำระภายหลัง</p>
              <p class="text-[14px] text-gray-400 mt-1 leading-snug">ชำระเมื่อได้รับอาหาร</p>
            </div>
            <div v-if="payTiming === 'later'" class="w-7 h-7 rounded-full bg-[#228085] flex items-center justify-center mt-2">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"/></svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Item Summary Card (Standardized rounded-[24px]) -->
      <div class="bg-white rounded-[24px] p-5 shadow-sm border border-gray-200">
        <h2 class="text-[16px] font-bold text-gray-500 mb-4 border-b border-gray-200 pb-2">รายการออเดอร์</h2>
        
        <div class="space-y-4">
          <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-start pb-4 border-b border-gray-200 last:border-0 last:pb-0">
            <div class="flex-1 min-w-0">
               <p class="text-[16px] font-bold text-gray-800 leading-tight"><span class="text-[#228085]">{{ item.qty || item.quantity }}x</span> {{ item.name }}</p>
               <p v-if="item.desc || item.note" class="text-[13px] text-gray-400 mt-1.5 line-clamp-1">+ {{ item.desc || item.note }}</p>
            </div>
            <span class="text-[18px] font-bold text-gray-900 ml-4">฿{{ (item.price * (item.qty || item.quantity)).toLocaleString() }}</span>
          </div>
        </div>

        <div class="pt-6 border-t-2 border-dashed border-gray-200 space-y-3">
          <div class="flex justify-between items-center text-[16px] text-gray-600 font-medium tracking-tight">
             <span>ยอดรวม</span>
             <span class="font-bold text-gray-900">฿{{ subtotal.toLocaleString() }}</span>
          </div>
          <div v-if="discount > 0" class="flex justify-between items-center text-[16px] text-red-500 font-bold tracking-tight">
             <span>ส่วนลด</span>
             <span class="font-bold">-฿{{ discount.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center text-[16px] text-gray-600 font-medium pb-2 tracking-tight">
             <span>ภาษี (7%)</span>
             <span class="font-bold text-gray-900">฿{{ tax.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-gray-200">
             <span class="text-[18px] font-bold text-gray-900">ยอดรวมสุทธิ</span>
             <span class="text-[24px] font-black text-[#228085]">฿{{ total.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Action (Standardized rounded-[24px]) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-md border-t border-gray-200 p-6 pb-10 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <button
        @click="handlePay"
        :disabled="!canProceed"
        class="w-full py-5 rounded-[24px] font-bold text-[18px] transition-all"
        :class="canProceed
          ? 'bg-[#228085] text-white active:scale-[0.98] shadow-xl shadow-teal-500/20'
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
      >
        {{ payTiming ? 'สั่งซื้อเลย' : 'กรุณาเลือกรูปแบบการชำระ' }}
      </button>
    </div>
  </div>
</template>
