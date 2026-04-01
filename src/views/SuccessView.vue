<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const lang = ref(localStorage.getItem('user_lang') || 'TH')
const isThai = computed(() => lang.value.toUpperCase() === 'TH')
const status = ref(1) // 1: รอดำเนินการ, 2: กำลังปรุง, 3: กำลังนำส่ง, 4: เรียบร้อย

// Translation Dictionary
const t = computed(() => {
  if (isThai.value) {
    return {
      orderNumber: 'หมายเลขออเดอร์',
      dateTime: 'วันที่และเวลา',
      orderType: 'ประเภทออเดอร์',
      hn: 'หมายเลข HN',
      paymentMethod: 'ช่องทางชำระเงิน',
      paymentStatus: 'สถานะการชำระเงิน',
      orderStatus: 'สถานะออเดอร์',
      roomDelivery: 'จัดส่งที่ห้อง',
      pickupShop: 'รับที่ร้าน',
      pending: 'รอดำเนินการ',
      processing: 'กำลังดำเนินการ',
      delivering: 'กำลังนำส่ง',
      completed: 'เรียบร้อยแล้ว'
    }
  }
  return {
    orderNumber: 'Order Number',
    dateTime: 'Date & Time',
    orderType: 'Order Type',
    hn: 'HN',
    paymentMethod: 'Payment Method',
    paymentStatus: 'Payment Status',
    orderStatus: 'Order Status',
    roomDelivery: 'Room Delivery',
    pickupShop: 'Pickup at Shop',
    pending: 'Pending',
    processing: 'Processing',
    delivering: 'Delivering',
    completed: 'Completed'
  }
})

let timer: any = null

const startTimer = () => {
  timer = setInterval(() => {
    if (status.value < 4) {
      status.value++
    } else {
      clearInterval(timer)
    }
  }, 5000)
}

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
const paymentMethod = ref('เงินสด') // Default as seen in image
const cartItems = ref<any[]>([])
const orderId = ref(new Date().getTime().toString().slice(-6))

const displayPaymentMethod = computed(() => {
  if (paymentMethod.value === 'เงินสด') return 'CASH'
  if (paymentMethod.value === 'qr') return 'PROMPTPAY / QR'
  return paymentMethod.value.toUpperCase()
})

onMounted(() => {
  deliveryOption.value = localStorage.getItem('deliveryOption') || 'delivery'
  orderNote.value = localStorage.getItem('orderNote') || ''
  pickupTime.value = localStorage.getItem('pickupTime') || 'ทันที'
  room.value = localStorage.getItem('roomNumber') || '-'
  hn.value = localStorage.getItem('hnNumber') || '-'
  discount.value = Number(localStorage.getItem('discount')) || 0
  
  // Priority: Read from 'last_order_receipt' if it exists (for persistence on refresh)
  // Fallback: Read from current 'cart' (for the very first load)
  const lastOrder = localStorage.getItem('last_order_receipt')
  const currentCart = localStorage.getItem('cart')

  if (lastOrder) {
    const parsedLastOrder = JSON.parse(lastOrder)
    if (parsedLastOrder.isHistory) {
      status.value = parsedLastOrder.statusValue || 1
      orderId.value = parsedLastOrder.id
      customDate.value = parsedLastOrder.date
      cartItems.value = parsedLastOrder.items || []
      discount.value = parsedLastOrder.discount || 0
      deliveryOption.value = parsedLastOrder.deliveryOption || 'delivery'
      paymentMethod.value = parsedLastOrder.paymentMethod || 'CASH'
      room.value = parsedLastOrder.room || '-'
      hn.value = parsedLastOrder.hn || '-'
      // History mode: do not start timer
    } else {
      cartItems.value = parsedLastOrder
      discount.value = Number(localStorage.getItem('last_order_discount')) || 0
      startTimer()
    }
  } else if (currentCart) {
    cartItems.value = JSON.parse(currentCart)
    discount.value = Number(localStorage.getItem('discount')) || 0
    // One-time handover if not already done by payment pages
    localStorage.setItem('last_order_receipt', currentCart)
    localStorage.setItem('last_order_discount', localStorage.getItem('discount') || '0')
    localStorage.removeItem('cart')
    localStorage.removeItem('discount')
    localStorage.removeItem('orderNote')
    localStorage.removeItem('putInBox')
    startTimer()
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

const customDate = ref('')

const formattedDate = computed(() => {
  // If custom date string provided and we are in English, we might need to parse it (assuming it is Thai)
  // For simplicity since mock is "Mar 16, 2026 at 07:00 AM 16:51", we will just return it.
  if (customDate.value) return customDate.value
  const d = new Date()
  
  if (isThai.value) {
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
    return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543} เวลา ${d.getHours()}:${d.getMinutes().toString().padStart(2,'0')}`
  } else {
    const engMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    return `${engMonths[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} at ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`
  }
})

// Dynamic Status Card Data
const statusCardData = computed(() => {
  switch(status.value) {
    case 1:
      return { 
        title: isThai.value ? 'กำลังรอรับออเดอร์' : 'Order Confirmed', 
        sub: isThai.value ? 'ร้านกำลังเตรียมรับออเดอร์ของคุณ' : 'Preparing your order...', 
        color: '#f6ab40', bg: 'bg-[#fffdf7]', border: 'border-orange-100', text: 'text-orange-900', icon: 'clock', 
        paymentStatusText: t.value.pending, orderStatusText: t.value.pending, orderStatusColor: '#f6ab40' 
      }
    case 2:
      return { 
        title: isThai.value ? 'กำลังปรุงอาหาร' : 'In the Kitchen', 
        sub: isThai.value ? 'เชฟกำลังตั้งใจทำเมนูอร่อยให้คุณอยู่!' : 'Chef is preparing your meal!', 
        color: '#ff7e67', bg: 'bg-[#fff5f3]', border: 'border-red-100', text: 'text-red-900', icon: 'chef', 
        paymentStatusText: t.value.completed, orderStatusText: t.value.processing, orderStatusColor: '#ff7e67' 
      }
    case 3:
      return { 
        title: isThai.value ? 'กำลังนำไปจัดส่ง' : 'On the Way', 
        sub: isThai.value ? 'อาหารกำลังเดินทางไปหาคุณ' : 'Your food is arriving soon.', 
        color: '#3498db', bg: 'bg-[#f0f9ff]', border: 'border-blue-100', text: 'text-blue-900', icon: 'truck', 
        paymentStatusText: t.value.completed, orderStatusText: t.value.delivering, orderStatusColor: '#3498db' 
      }
    case 4:
      return { 
        title: isThai.value ? 'ได้รับอาหารแล้ว' : 'Delivered', 
        sub: isThai.value ? 'ทานให้อร่อยนะคะ!' : 'Enjoy your meal!', 
        color: '#10b981', bg: 'bg-[#f0fdf4]', border: 'border-green-200', text: 'text-[#166534]', icon: 'check', 
        paymentStatusText: t.value.completed, orderStatusText: t.value.completed, orderStatusColor: '#10b981' 
      }
    default:
      return { 
        title: lang.value === 'TH' ? 'กำลังเตรียมการ' : 'Processing', 
        sub: '', color: '#94a3b8', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', icon: 'clock', 
        paymentStatusText: t.value.pending, orderStatusText: t.value.pending, orderStatusColor: '#1e293b' 
      }
  }
})
</script>

<template>
  <div class="min-h-screen bg-[#f4fafa] font-sans pb-32">
    <!-- Header: Centered 'E-Receipt' as requested -->
    <div class="bg-white px-5 py-4 flex items-center border-b border-gray-100 sticky top-0 z-20 shadow-sm shadow-teal-900/5">
      <h1 class="text-[18px] font-bold text-gray-800 mx-auto tracking-tight uppercase">E-Receipt</h1>
    </div>

    <div class="px-5 pt-6 pb-10 space-y-6">
      
      <!-- 1. Dynamic Status Card (Pending/Progress/Success) -->
      <div 
        class="rounded-[32px] p-10 text-center shadow-lg transition-all duration-700 border border-opacity-50"
        :class="[statusCardData.bg, statusCardData.border]"
      >
        <!-- Icon Circle -->
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-xl transition-all duration-700" 
          :style="{ backgroundColor: statusCardData.color }"
        >
          <svg v-if="statusCardData.icon === 'clock'" class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg>
          <svg v-else-if="statusCardData.icon === 'chef'" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12,3C10,3 8.3,4.3 7.7,6.1C5.6,6.6 4,8.5 4,10.8C4,12.7 5.1,14.4 6.7,15.2C6.3,15.7 6,16.4 6,17.2C6,18.8 7.3,20.1 8.9,20.1C9.6,20.1 10.2,19.8 10.7,19.3C11.1,19.6 11.5,19.8 12,19.8C12.5,19.8 12.9,19.6 13.3,19.3C13.8,19.8 14.4,20.1 15.1,20.1C16.7,20.1 18,18.8 18,17.2C18,16.4 17.7,15.7 17.3,15.2C18.9,14.4 20,12.7 20,10.8C20,8.5 18.4,6.6 16.3,6.1C15.7,4.3 14,3 12,3Z"/></svg>
          <svg v-else-if="statusCardData.icon === 'truck'" class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20,8V5H5V8H2V12H3V17H21V12H22V8H19M7,15A2,2 0 0,1 5,13A2,2 0 0,1 7,11A2,2 0 0,1 9,13A2,2 0 0,1 7,15M17,15A2,2 0 0,1 15,13A2,2 0 0,1 17,11A2,2 0 0,1 19,13A2,2 0 0,1 17,15Z"/></svg>
          <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="4"><path d="M5 13l4 4L19 7"/></svg>
        </div>
        
        <h2 class="text-[24px] font-bold tracking-tight mb-1" :class="statusCardData.text">{{ statusCardData.title }}</h2>
        <p class="text-[16px] font-semibold opacity-70" :class="statusCardData.text">{{ statusCardData.sub }}</p>
      </div>

      <!-- 2. Tracking Card (Revised Design) -->
      <div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100/60">
        <h3 class="text-[12px] font-bold text-gray-300 mb-10 text-center uppercase tracking-[0.2em] opacity-80">สถานะคำสั่งซื้อ (TRACKING)</h3>
        
        <div class="flex items-center justify-between relative px-2 mb-2">
          <!-- Connector Line -->
          <div class="absolute top-[22px] left-10 right-10 h-[2px] bg-gray-100 rounded-full">
             <div class="h-full bg-teal-600 transition-all duration-1000" :style="{ width: ((status - 1) * 33.33) + '%' }"></div>
          </div>
          
          <!-- Steps -->
          <div v-for="step in steps" :key="step.id" class="flex flex-col items-center gap-4 relative z-10 w-20">
             <div 
               class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2"
               :class="status >= step.id ? 'bg-white border-teal-600 shadow-sm' : 'bg-white border-gray-100 opacity-60'"
             >
                <!-- Step Icons Mapping (Clock, Chef, Truck, Check) -->
                <div class="w-6 h-6 flex items-center justify-center" :class="status >= step.id ? 'text-teal-600' : 'text-gray-200'">
                  <svg v-if="step.id === 1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 7v5l3 2"/></svg>
                  <svg v-else-if="step.id === 2" viewBox="0 0 24 24" fill="currentColor"><path d="M12,3C10,3 8.3,4.3 7.7,6.1C5.6,6.6 4,8.5 4,10.8C4,12.7 5.1,14.4 6.7,15.2C6.3,15.7 6,16.4 6,17.2C6,18.8 7.3,20.1 8.9,20.1C9.6,20.1 10.2,19.8 10.7,19.3C11.1,19.6 11.5,19.8 12,19.8C12.5,19.8 12.9,19.6 13.3,19.3C13.8,19.8 14.4,20.1 15.1,20.1C16.7,20.1 18,18.8 18,17.2C18,16.4 17.7,15.7 17.3,15.2C18.9,14.4 20,12.7 20,10.8C20,8.5 18.4,6.6 16.3,6.1C15.7,4.3 14,3 12,3Z"/></svg>
                  <svg v-else-if="step.id === 3" viewBox="0 0 24 24" fill="currentColor"><path d="M20,8H17V4H3C1.89,4 1,4.89 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8M6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5M17,12V9.5H19.5L21.47,12H17M18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5Z"/></svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><path d="M5 13l4 4L19 7"/></svg>
                </div>
             </div>
             <span class="text-[11px] font-bold transition-colors whitespace-nowrap" :class="status >= step.id ? 'text-gray-800' : 'text-gray-300'">{{ step.name }}</span>
          </div>
        </div>
      </div>

      <!-- 3. Details Card (Structured Metadata) -->
      <div class="bg-white rounded-[32px] p-7 shadow-sm border border-gray-100/60 flex flex-col gap-6">
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.orderNumber }}</span>
          <span class="text-gray-800 font-bold tracking-tight">{{ orderId }}</span>
        </div>
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.dateTime }}</span>
          <span class="text-gray-800 font-bold">{{ formattedDate }}</span>
        </div>
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.orderType }}</span>
          <span class="text-gray-800 font-bold">
            {{ deliveryOption === 'delivery' ? t.roomDelivery : t.pickupShop }}
            <span v-if="deliveryOption === 'delivery' && room !== '-'"> ({{ room }})</span>
          </span>
        </div>
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.hn }}</span>
          <span class="text-gray-800 font-bold uppercase">{{ hn }}</span>
        </div>
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.paymentMethod }}</span>
          <span class="text-gray-800 font-bold uppercase">{{ displayPaymentMethod }}</span>
        </div>
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.paymentStatus }}</span>
          <span class="font-bold" :style="{ color: statusCardData.color }">{{ statusCardData.paymentStatusText }}</span>
        </div>
        <div class="flex justify-between items-center text-[15px]">
          <span class="text-gray-500 font-medium tracking-tight">{{ t.orderStatus }}</span>
          <span class="font-bold uppercase tracking-tight" :style="{ color: statusCardData.orderStatusColor }">{{ statusCardData.orderStatusText }}</span>
        </div>
      </div>

      <!-- 4. Items Card (Receipt Details) -->
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/60 overflow-hidden">
        <h3 class="text-[15px] font-semibold text-gray-800 mb-5">รายการออเดอร์</h3>
        <div class="space-y-5 mb-6">
          <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-start gap-3">
             <div class="flex-1 min-w-0">
               <p class="text-[15px] font-medium text-gray-800 leading-snug">
                 <span class="font-semibold">{{ item.qty || item.quantity }}x</span> {{ item.name }}
               </p>
               <p v-if="item.desc || item.note" class="text-[13px] text-gray-400 mt-0.5 leading-snug">+ {{ item.desc || item.note }}</p>
               <p v-else class="text-[13px] text-gray-400 mt-0.5 leading-snug">+ {{ item.name }}</p>
             </div>
             <span class="text-[15px] font-semibold text-gray-800 tabular-nums shrink-0">฿{{ (item.price * (item.qty || item.quantity)).toFixed(1).replace(/\.0$/, '') }}</span>
          </div>
        </div>

        <div class="pt-5 border-t border-gray-100 space-y-3.5">
          <div class="flex justify-between items-center text-[15px] text-gray-600">
            <span>ยอดรวม</span>
            <span class="tabular-nums">฿{{ subtotal.toFixed(1).replace(/\.0$/, '') }}</span>
          </div>
          <div v-if="discount > 0" class="flex justify-between items-center text-[15px] text-red-500 font-medium">
            <span>ส่วนลด</span>
            <span class="tabular-nums">-฿{{ discount.toFixed(1).replace(/\.0$/, '') }}</span>
          </div>
          <div class="flex justify-between items-center text-[15px] text-gray-600">
            <span>ภาษี (7%)</span>
            <span class="tabular-nums">฿{{ tax.toFixed(1).replace(/\.0$/, '') }}</span>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-gray-100">
            <span class="text-[17px] font-bold text-gray-900">ยอดรวมสุทธิ</span>
            <span class="text-[20px] font-bold text-teal-600 tabular-nums">฿{{ total.toFixed(1).replace(/\.0$/, '') }}</span>
          </div>
        </div>
      </div>

      <!-- Back to Home Button -->
      <button 
        @click="router.push({ name: 'menu' })"
        class="w-full py-5 rounded-[24px] bg-[#228085] text-white font-semibold text-[18px] shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all mt-2 mb-8"
      >
        กลับสู่หน้าหลัก
      </button>
    </div>

    <!-- Standardized Bottom Nav (Sticky at bottom) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-md border-t border-gray-100 flex h-[85px] items-center justify-around z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.06)]">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full active:scale-95 transition-all">
         <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 2v7c0 1.1.9 2 2 2h4v10h2V11h4c1.1 0 2-.9 2-2V2H3z m8 7H5V4h1v5h1V4h1v5h1V4h1v5h1V4h2v5z"/></svg>
         <span class="text-[11px] font-bold uppercase tracking-tight">Menu</span>
      </div>
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full active:scale-95 transition-all">
         <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
         <span class="text-[11px] font-bold uppercase tracking-tight">Orders</span>
      </div>
      <div @click="router.push({ name: 'profile' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full group active:scale-95 transition-all">
         <svg class="w-6 h-6 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
         <span class="text-[11px] font-bold uppercase tracking-tight">Profile</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
</style>
