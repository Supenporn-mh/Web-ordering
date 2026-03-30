<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('active')
const currentLang = ref('TH')

onMounted(() => {
  currentLang.value = localStorage.getItem('user_lang') || 'TH'
})

const translations: any = {
  TH: {
    title: 'คำสั่งซื้อของฉัน',
    subTitle: 'ติดตามคำสั่งซื้อของคุณ',
    tabActive: 'กำลังดำเนินการ',
    tabHistory: 'ประวัติคำสั่งซื้อ',
    noOrders: 'ยังไม่มีรายการคำสั่งซื้อ',
    orderNumPrefix: '#',
    statusPending: 'รอดำเนินการ',
    typeLabel: 'ประเภท:',
    totalLabel: 'ยอดรวม',
    takeaway: 'สั่งกลับบ้าน',
    menu: 'เมนู',
    orders: 'คำสั่งซื้อ',
    profile: 'โปรไฟล์'
  },
  EN: {
    title: 'My Orders',
    subTitle: 'Track your orders',
    tabActive: 'Active',
    tabHistory: 'History',
    noOrders: 'No orders found',
    orderNumPrefix: '#',
    statusPending: 'Pending',
    typeLabel: 'Type:',
    totalLabel: 'Total',
    takeaway: 'Takeaway',
    menu: 'Menu',
    orders: 'Orders',
    profile: 'Profile'
  }
}

const t = computed(() => translations[currentLang.value] || translations.TH)

// Mock data based on the screenshot
const mockOrders = [
  {
    id: '1202603170001',
    date: 'Mar 17, 2026 at 07:00 AM 14:14',
    items: [{ name: 'กรีนสลัด', qty: 1, price: 210.00 }],
    type: 'สั่งกลับบ้าน',
    status: 'Pending',
    total: 210.00
  },
  {
    id: '1202603160001',
    date: 'Mar 16, 2026 at 07:00 AM 16:51',
    items: [{ name: 'แกงเขียวหวานทำจากนมถั่วเหลืองเสิร์ฟกับข้าวกล้อง...', qty: 1, price: 260.00 }],
    type: 'สั่งกลับบ้าน',
    status: 'Pending',
    total: 260.00
  },
  {
    id: '1202603130008',
    date: 'Mar 13, 2026 at 07:00 AM 18:52',
    items: [{ name: 'กรีนสลัด', qty: 1, price: 210.00 }],
    type: 'สั่งกลับบ้าน',
    status: 'Pending',
    total: 210.00
  }
]

const orders = ref<any[]>(mockOrders)
</script>

<template>
  <div class="min-h-screen bg-[#f8fcfc] font-sans pb-32">
    <!-- Header (Based on screenshot) -->
    <div class="px-6 pt-10 pb-6 flex justify-between items-start">
      <div>
        <h1 class="text-[24px] font-bold text-gray-900 tracking-tight">{{ t.title }}</h1>
        <p class="text-[14px] text-gray-400 font-medium tracking-wide">{{ t.subTitle }}</p>
      </div>
    </div>

    <!-- Tabs (Based on screenshot, standardized to system rounded-24) -->
    <div class="px-5 mb-8">
      <div class="bg-gray-100/60 p-1.5 rounded-[24px] flex gap-2">
        <button 
          @click="activeTab = 'active'"
          :class="activeTab === 'active' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-400 font-bold'"
          class="flex-1 py-3.5 rounded-[20px] text-[16px] transition-all"
        >
          {{ t.tabActive }}
        </button>
        <button 
          @click="activeTab = 'history'"
          :class="activeTab === 'history' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-400 font-bold'"
          class="flex-1 py-3.5 rounded-[20px] text-[16px] transition-all"
        >
          {{ t.tabHistory }}
        </button>
      </div>
    </div>

    <!-- Orders List (Based on screenshot card design) -->
    <div class="px-5 space-y-5">
      <div v-if="orders.length === 0" class="flex flex-col items-center justify-center py-20 opacity-40">
        <p class="text-gray-500 font-bold text-[18px]">{{ t.noOrders }}</p>
      </div>
      
      <!-- Order Card -->
      <div v-for="order in orders" :key="order.id" class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50/50 flex flex-col gap-4">
         <!-- Order Header -->
         <div class="flex justify-between items-start">
            <div>
               <h3 class="text-[18px] font-bold text-gray-800 tracking-tight">{{ t.orderNumPrefix }}{{ order.id }}</h3>
               <p class="text-[13px] text-gray-400 font-medium mt-1">{{ order.date }}</p>
            </div>
            <!-- Status Badge (Orange as per screenshot) -->
            <span class="px-4 py-1.5 rounded-full bg-[#f6ab40] text-white text-[13px] font-bold shadow-sm shadow-orange-500/10">
               {{ t.statusPending }}
            </span>
         </div>

         <!-- Items List -->
         <div class="mt-2 space-y-3">
            <div v-for="item in order.items" :key="item.name" class="flex justify-between items-start">
               <span class="text-[15px] font-bold text-gray-700 w-[70%] leading-snug">{{ item.qty }}x {{ item.name }}</span>
               <span class="text-[15px] font-bold text-gray-900 shrink-0">฿{{ item.price.toFixed(2) }}</span>
            </div>
         </div>

         <!-- Details Footer -->
         <div class="mt-4 pt-4 border-t border-gray-50/80 space-y-2">
            <div class="flex justify-between items-center text-[14px]">
               <span class="text-gray-400 font-bold">{{ t.typeLabel }}</span>
               <span class="text-gray-800 font-bold">{{ t.takeaway }}</span>
            </div>
            <div class="flex justify-between items-center text-[18px]">
               <span class="text-gray-900 font-bold">{{ t.totalLabel }}</span>
               <span class="text-[#228085] font-bold">฿{{ order.total.toFixed(2) }}</span>
            </div>
         </div>
      </div>
    </div>

    <!-- Standardized Bottom Nav -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 flex h-[85px] items-center justify-around z-50 pb-safe shadow-[0_-5px_25px_rgba(0,0,0,0.03)] px-4">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 2v7c0 1.1.9 2 2 2h4v10h2V11h4c1.1 0 2-.9 2-2V2H3z m8 7H5V4h1v5h1V4h1v5h1V4h1v5h1V4h2v5z"/></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.menu }}</span>
      </div>
      
      <div class="flex flex-col items-center justify-center gap-1.5 text-[#228085] cursor-pointer w-24 h-full relative">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.orders }}</span>
      </div>

      <div @click="router.push({ name: 'profile' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full group active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.profile }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
</style>
