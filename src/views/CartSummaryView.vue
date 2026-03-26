<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const deliveryOption = ref('delivery') 
const orderNote = ref('')
const putInBox = ref('false')

const items = ref([
  { id: 1, name: 'กรีกสลัด', price: 210, quantity: 1, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80', desc: '+ น้ำสลัดน้ำผึ้งและน้ำส้ม' },
  { id: 2, name: 'ชาบูหมู', price: 75, quantity: 1, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80', desc: '' }
])

const subtotal = computed(() => items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0))
const tax = computed(() => subtotal.value * 0.07)
const total = computed(() => subtotal.value + tax.value)

const removeItem = (id: number) => {
  items.value = items.value.filter(i => i.id !== id)
}

const selectedItem = ref<any>(null)
const isModalOpen = ref(false)
const editQuantity = ref(1)
const editNote = ref('')

const openEditModal = (item: any) => {
  selectedItem.value = { ...item }
  editQuantity.value = item.quantity
  editNote.value = item.desc || ''
  isModalOpen.value = true
}

const saveEdit = () => {
  const idx = items.value.findIndex(i => i.id === selectedItem.value.id)
  if (idx !== -1) {
    items.value[idx].quantity = editQuantity.value
    items.value[idx].desc = editNote.value
  }
  isModalOpen.value = false
}

onMounted(() => {
  deliveryOption.value = localStorage.getItem('deliveryOption') || 'delivery'
  orderNote.value = localStorage.getItem('orderNote') || ''
  putInBox.value = localStorage.getItem('putInBox') || 'false'
})

</script>

<template>
  <div class="min-h-screen bg-[#dff2f2] font-sans pb-40">
    <!-- Header with Back -->
    <div class="px-6 py-4 flex items-center bg-white border-b border-gray-50 sticky top-0 z-20">
      <button @click="router.back()" class="mr-4 text-2xl text-gray-400">←</button>
      <h1 class="text-lg font-bold text-gray-900 mx-auto">รายการออเดอร์ที่สั่ง</h1>
    </div>

    <div class="p-6 space-y-6">
      <!-- Shipping Location Card -->
      <div class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider">สถานที่จัดส่ง</h3>
          <button @click="router.push({ name: 'checkout' })" class="text-[#228085] font-bold text-sm">แก้ไข</button>
        </div>
        <div class="flex items-start gap-4">
          <div class="mt-0.5 text-[#228085] text-lg">📍</div>
          <div class="space-y-1">
             <p class="font-bold text-gray-800 text-sm">
               {{ deliveryOption === 'delivery' ? 'บริการจัดส่ง : ห้องพัก 879, HN 229826857' : 'รับที่ร้าน' }}
             </p>
             <p v-if="putInBox === 'true'" class="text-[10px] text-gray-400 font-medium pb-1">+ ต้องการใส่กล่อง</p>
             <p class="text-[10px] text-gray-400 font-medium">หมายเหตุการสั่ง</p>
             <p class="text-[13px] font-medium text-gray-700 leading-tight bg-[#f8fbff] px-2 py-1 rounded-md">{{ orderNote || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 space-y-6">
        <h1 class="text-xl font-bold text-gray-900 mb-2">รายการอาหาร</h1>
        
        <div v-for="item in items" :key="item.id" class="flex gap-4 py-5 border-b border-gray-100 last:border-0 first:pt-0">
          <!-- Left: Image -->
          <div class="w-20 h-20 rounded-2xl bg-[#f0f9f9] overflow-hidden flex-shrink-0 flex items-center justify-center">
             <img :src="item.img" class="w-full h-full object-cover" v-if="item.img" />
             <div v-else class="text-[#228085] opacity-40">🍜</div>
          </div>

          <!-- Right: Content Column -->
          <div class="flex-1 flex flex-col justify-between min-w-0">
             <!-- Top Row: Title and Action Buttons -->
             <div class="flex justify-between items-start">
                <div class="flex-1 pr-2">
                   <h4 class="font-bold text-gray-800 text-[15px] leading-snug line-clamp-1">{{ item.name }}</h4>
                   <p class="text-[11px] text-[#228085] mt-1 font-medium" v-if="item.desc">
                     <span class="text-gray-400">หมายเหตุ :</span> {{ item.desc }}
                   </p>
                </div>
                <div class="flex items-center gap-3">
                   <button @click="openEditModal(item)" class="text-[13px] text-gray-400 font-medium">แก้ไข</button>
                   <button @click="removeItem(item.id)" class="text-red-500">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                   </button>
                </div>
             </div>

             <!-- Bottom Row: Quantity and Price -->
             <div class="flex justify-between items-center mt-3">
                <div class="flex items-center gap-4">
                   <button @click="item.quantity > 1 ? item.quantity-- : null" class="w-8 h-8 rounded-full bg-[#f0f9f9] flex items-center justify-center text-gray-300 font-bold active:scale-90 transition-all">−</button>
                   <span class="text-base font-bold text-gray-800 w-4 text-center">{{ item.quantity }}</span>
                   <button @click="item.quantity++" class="w-8 h-8 rounded-full bg-[#228085] flex items-center justify-center text-white font-bold shadow-sm active:scale-90 transition-all">+</button>
                </div>
                <span class="text-2xl font-bold text-[#228085]">฿{{ item.price * item.quantity }}</span>
             </div>
          </div>
        </div>

        <div v-if="items.length === 0" class="py-10 text-center">
           <p class="text-gray-400 font-bold">ไม่มีสินค้าในตะกร้า</p>
           <button @click="router.push({ name: 'menu' })" class="text-[#228085] text-sm font-bold mt-2">ไปหน้าเมนู</button>
        </div>
      </div>

      <!-- Price Summary -->
      <div class="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-50 space-y-4">
        <div class="flex justify-between items-center text-sm">
           <span class="text-gray-400 font-bold">ราคาอาหาร</span>
           <span class="text-gray-900 font-bold">฿{{ subtotal }}</span>
        </div>
        <div class="flex justify-between items-center text-sm pb-4 border-b border-gray-50">
           <span class="text-gray-400 font-bold">ภาษี (7%)</span>
           <span class="text-gray-900 font-bold">฿{{ tax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-end">
           <span class="text-gray-400 font-bold text-sm pb-1">ยอดชำระสุทธิ</span>
           <span class="text-[#228085] font-bold text-2xl">฿{{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Fixed Action Section -->
    <div class="fixed bottom-0 left-0 right-0 p-6 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100">
      <button @click="router.push({ name: 'payment-option' })" class="w-full py-5 rounded-[1.2rem] bg-[#228085] text-white font-bold text-base shadow-xl shadow-teal-500/10 active:scale-95 transition-all outline-none">
        สั่งซื้อเลย
      </button>
    </div>

    <!-- Edit Item Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="isModalOpen = false"></div>
      
      <!-- Modal Content -->
      <div class="bg-white w-full max-w-sm rounded-[1.5rem] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <button @click="isModalOpen = false" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-500 hover:bg-black/10 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="p-5 flex flex-col max-h-[90vh] overflow-y-auto">
          <h2 class="text-sm font-bold text-gray-800 mb-4 px-1 pr-10 truncate">{{ selectedItem?.name }}</h2>
          
          <div class="w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-50">
            <img :src="selectedItem?.img" class="w-full h-full object-cover" />
          </div>

          <div class="mb-5">
             <h3 class="text-xs font-bold text-gray-800 mb-2">หมายเหตุ</h3>
             <textarea v-model="editNote" placeholder="เพิ่มหมายเหตุ..." class="w-full bg-[#f8fbff] border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium text-gray-600 outline-none focus:border-[#228085] transition-colors min-h-[80px] resize-none"></textarea>
          </div>

          <div class="pt-4 border-t border-gray-50 flex flex-col gap-4">
             <div class="flex items-center justify-between px-1">
                <span class="text-xs font-bold text-gray-800">จำนวน</span>
                <div class="flex items-center gap-5">
                   <button @click="editQuantity > 1 ? editQuantity-- : null" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold transition-active active:scale-90">−</button>
                   <span class="text-sm font-bold w-4 text-center">{{ editQuantity }}</span>
                   <button @click="editQuantity++" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold transition-active active:scale-90">+</button>
                </div>
             </div>

             <button @click="saveEdit" class="w-full py-3.5 rounded-xl bg-[#228085] text-white font-bold text-sm shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all">
                ตกลง • ฿{{ selectedItem?.price * editQuantity }}
             </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
