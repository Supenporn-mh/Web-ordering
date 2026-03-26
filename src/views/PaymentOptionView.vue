<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const payOption = ref('now') // now | later

const deliveryOption = ref('')
const orderNote = ref('')
const room = ref('879')
const hn = ref('229826857')

const items = ref([
  { id: 1, name: 'กรีกสลัด', price: 210, quantity: 1, desc: '+ น้ำสลัดน้ำผึ้งและน้ำส้ม' }
])

onMounted(() => {
  deliveryOption.value = localStorage.getItem('deliveryOption') || 'delivery'
  orderNote.value = localStorage.getItem('orderNote') || ''
})
</script>

<template>
  <div class="min-h-screen bg-[#dff2f2] font-sans pb-40">
    <!-- Header -->
    <div class="px-6 py-5 flex items-center bg-white border-b border-gray-50 sticky top-0 z-20">
      <button @click="router.back()" class="mr-4 text-xl text-gray-400">←</button>
      <h1 class="text-lg font-bold text-gray-900 mx-auto">การชำระเงิน</h1>
    </div>

    <div class="p-6 space-y-6">
      
      <!-- Shipping Location (Read-only) -->
      <div class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">สถานที่จัดส่ง</h3>
        <div class="flex items-start gap-4">
          <div class="mt-0.5 text-[#228085] text-lg">📍</div>
          <div class="space-y-1">
             <p class="font-bold text-gray-800 text-sm">
               {{ deliveryOption === 'delivery' ? `บริการจัดส่ง : ห้องพัก ${room}, HN ${hn}` : 'รับที่ร้าน' }}
             </p>
             <p class="text-[12px] font-medium text-gray-500 leading-tight bg-[#f8fbff] px-2 py-1.5 rounded-md mt-2">{{ orderNote || 'ไม่มีหมายเหตุ' }}</p>
          </div>
        </div>
      </div>

      <!-- Payment Option Card -->
      <div class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 space-y-6">
        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wider">วิธีการชำระเงิน</h3>
        
        <div class="space-y-4">
          <label class="flex items-center gap-4 cursor-pointer group">
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all bg-white" :class="payOption === 'now' ? 'border-[#228085]' : 'border-gray-200'">
               <div v-if="payOption === 'now'" class="w-3 h-3 bg-[#228085] rounded-full"></div>
            </div>
            <input type="radio" value="now" v-model="payOption" class="hidden" />
            <span class="font-bold text-gray-700 text-base">ชำระทันที</span>
          </label>

          <label class="flex items-center gap-4 cursor-pointer group border-t border-gray-50 pt-4">
            <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all bg-white" :class="payOption === 'later' ? 'border-[#228085]' : 'border-gray-200'">
               <div v-if="payOption === 'later'" class="w-3 h-3 bg-[#228085] rounded-full"></div>
            </div>
            <input type="radio" value="later" v-model="payOption" class="hidden" />
            <span class="font-bold text-gray-700 text-base">ชำระภายหลัง</span>
          </label>
        </div>
      </div>

      <!-- Order Items Summary (Read-only) -->
      <div class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50">
        <h3 class="text-xs font-bold text-gray-400 font-bold uppercase tracking-wider mb-4">รายการอาหาร</h3>
        <div class="space-y-4 mb-6">
           <div v-for="item in items" :key="item.id" class="flex justify-between items-start gap-4">
              <div class="flex-1">
                 <p class="text-sm font-bold text-gray-800">{{ item.quantity }}x {{ item.name }}</p>
                 <p class="text-[10px] text-gray-400 mt-1">{{ item.desc }}</p>
              </div>
              <span class="text-sm font-bold text-gray-800">฿{{ item.price * item.quantity }}</span>
           </div>
        </div>
        
        <div class="pt-4 border-t border-gray-100 space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-gray-400 font-bold">ราคาอาหาร</span>
            <span class="text-gray-900 font-bold">฿210</span>
          </div>
          <div class="flex justify-between items-center text-sm pb-4 border-b border-gray-50">
             <span class="text-gray-400 font-bold">ภาษี (7%)</span>
             <span class="text-gray-900 font-bold">฿14.70</span>
          </div>
          <div class="flex justify-between items-end pt-2">
            <span class="text-gray-400 font-bold text-sm mb-1">ยอดรวมสุทธิ</span>
            <span class="text-[#228085] font-bold text-2xl">฿224.70</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Action Section -->
    <div class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-6 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      <button @click="router.push({ name: 'success' })" class="w-full py-5 rounded-[1.5rem] bg-[#228085] text-white font-bold text-base shadow-lg shadow-teal-500/10 active:scale-95 transition-all outline-none">
        ดำเนินการต่อ
      </button>
    </div>
  </div>
</template>
