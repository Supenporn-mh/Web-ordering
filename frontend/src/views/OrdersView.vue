<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('current') // current | past

const currentOrders = [
  { id: '#1202603170001', date: 'Mar 17, 2026 at 07:00 AM 14:14', items: '1x กรีกสลัด', total: '210.00', type: 'สั่งกลับบ้าน', status: 'รอดำเนินการ', statusColor: 'bg-[#eaa636]' },
  { id: '#1202603160001', date: 'Mar 16, 2026 at 07:00 AM 16:51', items: '1x แกงเขียวหวานทำจากนมถั่วเหลืองเสิร์ฟกับข้าวกล้อง...', total: '260.00', type: 'สั่งกลับบ้าน', status: 'รอดำเนินการ', statusColor: 'bg-[#eaa636]' },
  { id: '#1202603130008', date: 'Mar 13, 2026 at 07:00 AM 18:52', items: '1x กรีกสลัด', total: '210.00', type: 'สั่งกลับบ้าน', status: 'รอดำเนินการ', statusColor: 'bg-[#eaa636]' }
]

const pastOrders = [
  { id: '#1202603020005', date: 'Mar 2, 2026 at 07:00 AM 14:49', items: '1x เส้นหมี่น้ำยาปู (ขนุนอ่อน)', total: '280.00', type: 'สั่งกลับบ้าน', status: 'ยกเลิก', statusColor: 'bg-[#db5b60]' },
  { id: '#1202602190003', date: 'Feb 19, 2026 at 07:00 AM 10:53', items: '1x เส้นหมี่น้ำยาปู (ขนุนอ่อน)', total: '270.00', type: 'ส่งที่ห้อง', status: 'ยกเลิก', statusColor: 'bg-[#db5b60]' },
  { id: '#1202602190002', date: 'Feb 19, 2026 at 07:00 AM 10:53', items: '1x ไมโล', total: '15.00', type: 'ส่งที่ห้อง', status: 'ยกเลิก', statusColor: 'bg-[#db5b60]' }
]

const viewOrderDetail = (orderId: string) => {
  router.push({ name: 'success', query: { id: orderId } })
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] font-sans pb-28">
    <!-- Header -->
    <div class="px-6 py-6 bg-white sticky top-0 z-20">
      <h1 class="text-lg font-bold text-gray-900 mb-1">คำสั่งซื้อของฉัน</h1>
      <p class="text-sm text-gray-400 font-medium">ติดตามคำสั่งซื้อของคุณ</p>
    </div>

    <!-- Tabs -->
    <div class="px-6 py-2 bg-white sticky top-[84px] z-10 border-b border-gray-50 mb-4">
      <div class="flex bg-[#f4f6fa] rounded-[1rem] p-1">
        <button 
          @click="activeTab = 'current'"
          :class="activeTab === 'current' ? 'bg-white shadow-sm text-gray-900 font-bold' : 'text-gray-500 font-medium'"
          class="flex-1 py-3 rounded-[0.8rem] text-sm transition-all"
        >
          กำลังดำเนินการ
        </button>
        <button 
          @click="activeTab = 'past'"
          :class="activeTab === 'past' ? 'bg-white shadow-sm text-gray-900 font-bold' : 'text-gray-500 font-medium'"
          class="flex-1 py-3 rounded-[0.8rem] text-sm transition-all"
        >
          ประวัติคำสั่งซื้อ
        </button>
      </div>
    </div>

    <!-- Current Orders List -->
    <div class="px-5 space-y-4" v-if="activeTab === 'current'">
      <div v-for="order in currentOrders" :key="order.id" @click="viewOrderDetail(order.id)" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col cursor-pointer active:scale-[0.98] transition-all">
        <div class="flex justify-between items-center mb-1">
          <h3 class="font-bold text-[17px] text-[#0e1f32] tracking-tighter">{{ order.id }}</h3>
          <span :class="order.statusColor" class="text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">{{ order.status }}</span>
        </div>
        <p class="text-[13px] text-[#6b7785] font-medium mb-3">{{ order.date }}</p>
        
        <div class="flex justify-between items-start mb-4">
          <p class="text-[14px] font-medium text-[#4a5568]">{{ order.items }}</p>
          <p class="font-bold text-[#0e1f32] text-[14px]">฿{{ order.total }}</p>
        </div>

        <div class="border-t border-gray-100 py-3 mt-auto space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-[13px] font-medium text-[#6b7785]">ประเภท:</span>
            <span class="font-bold text-[#4a5568] text-[13px]">{{ order.type }}</span>
          </div>
          <div class="flex justify-between items-center pb-1">
            <span class="font-bold text-[14px] text-[#0e1f32]">ยอดรวม</span>
             <!-- Using Custom Brand Color instead of the Blue from the mock image -->
            <span class="font-black text-xl text-[#228085]">฿{{ order.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Past Orders List -->
    <div class="px-5 space-y-4" v-if="activeTab === 'past'">
      <div v-for="order in pastOrders" :key="order.id" @click="viewOrderDetail(order.id)" class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col cursor-pointer active:scale-[0.98] transition-all opacity-80">
        <div class="flex justify-between items-center mb-1">
          <h3 class="font-bold text-[17px] text-gray-500 tracking-tighter">{{ order.id }}</h3>
          <span :class="order.statusColor" class="text-white text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap">{{ order.status }}</span>
        </div>
        <p class="text-[13px] text-gray-400 font-medium mb-3">{{ order.date }}</p>
        
        <div class="flex justify-between items-start mb-4">
          <p class="text-[14px] font-medium text-gray-500">{{ order.items }}</p>
          <p class="font-bold text-gray-500 text-[14px]">฿{{ order.total }}</p>
        </div>

        <div class="border-t border-gray-100 py-3 mt-auto space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-[13px] font-medium text-gray-400">ประเภท:</span>
            <span class="font-bold text-gray-500 text-[13px]">{{ order.type }}</span>
          </div>
          <div class="flex justify-between items-center pb-1">
            <span class="font-bold text-[14px] text-gray-500">ยอดรวม</span>
            <span class="font-black text-xl text-gray-400">฿{{ order.total }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Tab Bar -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex h-20 items-center justify-around z-30 pb-safe">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer w-20 h-full">
        <span class="text-2xl leading-none">🍴</span>
        <span class="text-[10px] font-bold tracking-tight">เมนู</span>
      </div>
      <div class="flex flex-col items-center justify-center gap-1 text-[#228085] cursor-pointer w-20 h-full">
        <span class="text-2xl leading-none">📋</span>
        <span class="text-[10px] font-bold tracking-tight">คำสั่งซื้อ</span>
      </div>
      <div @click="router.push({ name: 'login'})" class="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 cursor-pointer w-20 h-full">
        <span class="text-2xl leading-none">👤</span>
        <span class="text-[10px] font-bold tracking-tight">ออกจากระบบ</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
</style>
