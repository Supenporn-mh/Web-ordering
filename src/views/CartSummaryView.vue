<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const deliveryOption = ref('delivery') 
const orderNote = ref('')
const putInBox = ref('false')
const pickupMode = ref('')
const roomNumber = ref('')
const hnNumber = ref('')
const pickupTime = ref('')
const cartItems = ref<any[]>([])

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    const price = Number(item.price) || 0
    const qty = Number(item.qty) || Number(item.quantity) || 0
    return sum + (price * qty)
  }, 0)
})
const discount = ref(0)
const vat = computed(() => Math.round((subtotal.value - discount.value) * 0.07 * 100) / 100)
const serviceCharge = computed(() => 0)
const total = computed(() => subtotal.value - discount.value + vat.value + serviceCharge.value)

const promoCode = ref('')
const applyPromo = () => {
  if (promoCode.value === 'Sodexo') {
    discount.value = 50
    localStorage.setItem('discount', '50')
    alert('คูปองใช้งานได้! รับส่วนลด 50 บาท')
  } else {
    alert('รหัสโปรโมชั่นไม่ถูกต้อง')
  }
}

// Edit Modal State
const selectedItem = ref<any>(null)
const selectedIndex = ref(-1)
const isModalOpen = ref(false)
const editQuantity = ref(1)
const editNote = ref('')

onMounted(() => {
  deliveryOption.value = localStorage.getItem('deliveryOption') || 'delivery'
  orderNote.value = localStorage.getItem('orderNote') || ''
  putInBox.value = localStorage.getItem('putInBox') || 'false'
  pickupMode.value = localStorage.getItem('pickupMode') || ''
  roomNumber.value = localStorage.getItem('roomNumber') || '-'
  hnNumber.value = localStorage.getItem('hnNumber') || '-'
  pickupTime.value = localStorage.getItem('pickupTime') || 'ทันที'
  
  const savedCart = localStorage.getItem('cart')
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart)
  }
})

const updateQuantity = (index: number, delta: number) => {
  const item = cartItems.value[index]
  const currentQty = Number(item.qty) || Number(item.quantity) || 1
  if (currentQty + delta > 0) {
    cartItems.value[index].qty = currentQty + delta
    delete cartItems.value[index].quantity // Cleanup old key if exists
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }
}

const removeItem = (index: number) => {
  cartItems.value.splice(index, 1)
  localStorage.setItem('cart', JSON.stringify(cartItems.value))
}

const openEditModal = (item: any, index: number) => {
  selectedItem.value = { ...item }
  selectedIndex.value = index
  editQuantity.value = Number(item.qty) || Number(item.quantity) || 1
  editNote.value = item.note || ''
  isModalOpen.value = true
}

const saveEdit = () => {
  if (selectedIndex.value !== -1) {
    cartItems.value[selectedIndex.value].qty = editQuantity.value
    cartItems.value[selectedIndex.value].note = editNote.value
    delete cartItems.value[selectedIndex.value].quantity // Cleanup
    localStorage.setItem('cart', JSON.stringify(cartItems.value))
  }
  isModalOpen.value = false
}

const handleConfirmOrder = () => {
  if (cartItems.value.length === 0) return
  router.push({ name: 'payment-option' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fcfc] font-sans pb-40">
    <!-- Header -->
    <div class="px-5 py-4 flex items-center bg-white border-b border-gray-50 sticky top-0 z-20 shadow-sm shadow-teal-900/5">
      <button @click="router.back()" class="text-gray-900 absolute left-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-[18px] font-bold text-gray-800 mx-auto tracking-tight">รายการออเดอร์ที่สั่ง</h1>
    </div>

    <div class="p-4 space-y-4">
      <!-- Location Card (Uniform rounded-[24px]) -->
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50/50">
        <!-- Header Row -->
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-[18px] font-bold text-gray-900 tracking-tight">สถานที่จัดส่ง</h3>
          <button @click="router.push({ name: 'checkout' })" class="text-[#228085] font-bold text-[16px] tracking-tight">แก้ไข</button>
        </div>
        
        <!-- Divider -->
        <div class="h-[1px] bg-gray-50 w-full mb-5"></div>

        <!-- Location Detail Row -->
        <div class="flex items-start gap-3.5 mb-6">
          <div class="mt-1 text-gray-900 shrink-0">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <div class="flex-1">
             <template v-if="deliveryOption === 'delivery'">
               <p class="font-bold text-gray-900 text-[18px] leading-snug">ห้อง : {{ roomNumber }}</p>
               <p class="font-bold text-gray-900 text-[18px] leading-snug">HN : {{ hnNumber }}</p>
             </template>
             <template v-else>
               <p class="font-bold text-gray-900 text-[18px] leading-snug">รับที่ร้าน : {{ pickupTime }}</p>
             </template>
          </div>
        </div>

        <!-- Order Note Section -->
        <div class="bg-[#f0f4f4] p-4 rounded-[18px] border border-gray-200">
          <p class="text-[14px] font-bold text-gray-600 mb-1 uppercase tracking-wider">หมายเหตุการสั่ง</p>
          <p class="text-[18px] font-bold text-gray-900 leading-tight">
            {{ deliveryOption === 'delivery' ? (putInBox === 'true' ? 'ใส่กล่อง' : '') : (pickupMode === 'dine-in' ? 'ทานที่ร้าน' : 'รับกลับบ้าน') }}
            {{ orderNote ? (deliveryOption === 'delivery' && putInBox === 'true' ? ', ' : '') + orderNote : '' }}
          </p>
        </div>
      </div>

      <!-- Items List Card (Uniform rounded-[24px]) -->
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50/30">
        <h2 class="text-[18px] font-bold text-gray-800 mb-6 text-center tracking-tight border-b border-gray-50 pb-3">รายการออเดอร์</h2>
        
        <div class="space-y-8">
          <div v-for="(item, index) in cartItems" :key="item.id" class="flex gap-4">
            <!-- Inner images/boxes also rounded-[18px] to be slightly less than card but still unified -->
            <div class="w-16 h-16 rounded-[18px] bg-[#eff8f8] shrink-0 flex items-center justify-center border border-gray-50 shadow-sm overflow-hidden">
               <img :src="item.img" class="w-full h-full object-cover" v-if="item.img" />
               <svg v-else class="w-8 h-8 text-[#228085]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 11s2 2 8 2 8-2 8-2M4 14s2 2 8 2 8-2 8-2M2 8c0 0 4-2 10-2s10 2 10 2l-1 11a2 2 0 01-2 2H5a2 2 0 01-2-2L2 8z"/><path d="M12 3v2"/></svg>
            </div>

            <div class="flex-1 min-w-0">
               <div class="flex justify-between items-start mb-1">
                  <h4 class="font-bold text-gray-800 text-[16px] leading-tight pr-1 tracking-tight truncate">{{ item.name }}</h4>
                  <div class="flex items-center gap-2">
                    <button @click="openEditModal(item, index)" class="px-3 py-1 rounded-full bg-white border border-gray-200 shadow-sm text-[12px] text-[#228085] font-bold hover:bg-[#228085] hover:text-white transition-all">แก้ไข</button>
                    <button @click="removeItem(index)" class="w-8 h-8 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-all border border-red-100">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
               </div>
               <div class="space-y-0.5">
                 <p v-if="index === 0" class="text-[14px] font-bold text-gray-800">เพิ่มผัก (+฿15)</p>
                 <p v-if="item.desc" class="text-[14px] text-[#228085] font-bold line-clamp-1">
                   <span class="text-gray-600 font-bold">หมายเหตุ :</span> {{ item.desc }}
                 </p>
               </div>
               <div class="flex justify-between items-center mt-3">
                  <div class="flex items-center gap-4 bg-[#f0f4f4] p-1.5 rounded-full border border-gray-300 shadow-sm">
                     <button @click="updateQuantity(index, -1)" class="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center text-[#228085] font-bold active:scale-90 shadow-sm">−</button>
                  <span class="text-[16px] font-bold text-gray-800 w-5 text-center">{{ item.qty || item.quantity }}</span>
                  <button @click="updateQuantity(index, 1)" class="w-8 h-8 rounded-full bg-[#228085] border border-[#228085] flex items-center justify-center text-white font-bold active:scale-90 shadow-md">+</button>
               </div>
               <span class="text-[16px] font-bold text-[#228085]">฿{{ (item.price * (item.qty || item.quantity)).toLocaleString() }}</span>
            </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Promo Code Card (Like Grab/Shopee) -->
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-50/50">
        <div class="flex items-center gap-3 mb-4">
           <svg class="w-6 h-6 text-[#228085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4v-3a2 2 0 00-2-2H5z"/></svg>
           <h3 class="text-[16px] font-bold text-gray-800">คูปองส่วนลด / รหัสโปรโมชั่น</h3>
        </div>
        <div class="flex gap-3">
          <input 
            v-model="promoCode"
            type="text" 
            placeholder="ระบุรหัสโปรโมชั่น (เช่น Sodexo)" 
            class="flex-1 bg-[#f8fbff] border-none rounded-[18px] py-3.5 px-5 text-[15px] font-medium text-gray-600 outline-none focus:ring-2 focus:ring-[#228085]/40"
          />
          <button @click="applyPromo" class="px-6 rounded-[18px] bg-[#228085] text-white font-bold text-[14px]">ใช้สิทธิ์</button>
        </div>
      </div>

      <!-- Payment Summary Card (Uniform rounded-[24px]) -->
      <div class="bg-white rounded-[24px] p-7 shadow-sm border border-gray-50/30">
        <h2 class="text-[18px] font-bold text-gray-800 mb-6 text-center tracking-tight">สรุปยอดชำระ</h2>
        <div class="space-y-4 pb-5 border-b border-gray-100 mb-5">
          <div class="flex justify-between items-center text-[16px] font-medium text-gray-800">
             <span>ยอดรวม</span>
             <span class="font-bold">฿{{ subtotal.toLocaleString() }}</span>
          </div>
          <div v-if="discount > 0" class="flex justify-between items-center text-[16px] font-medium text-red-500">
             <span>ส่วนลด</span>
             <span class="font-bold">-฿{{ discount.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center text-[16px] font-medium text-gray-800">
             <span>ภาษี (7%)</span>
             <span class="font-bold">฿{{ vat.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between items-center text-[16px] font-medium text-gray-800">
             <span>Service Charge 10%</span>
             <span class="font-bold">฿{{ serviceCharge.toLocaleString() }}</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
           <span class="text-[18px] font-bold text-gray-900">ยอดรวมสุทธิ</span>
           <span class="text-[#228085] font-bold text-[22px]">฿{{ total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Edit Modal (Standardized Rounded) -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-6 overflow-hidden">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[4px]" @click="isModalOpen = false"></div>
      <div class="bg-white w-full max-w-sm rounded-[24px] overflow-hidden relative shadow-2xl animate-fade-in">
        <div class="p-7 flex flex-col max-h-[85vh]">
          <div class="flex justify-between items-start mb-6">
             <h2 class="text-[18px] font-bold text-gray-800 pr-10 line-clamp-1 truncate">{{ selectedItem?.name }}</h2>
             <button @click="isModalOpen = false" class="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          <div class="w-full aspect-square rounded-[20px] overflow-hidden mb-6 border border-gray-50 shadow-sm bg-[#f8fcfc] flex items-center justify-center">
            <img v-if="selectedItem?.img" :src="selectedItem?.img" class="w-full h-full object-cover" />
            <span v-else class="text-4xl">🥘</span>
          </div>
          <div class="mb-7">
             <h3 class="text-[14px] font-bold text-gray-500 uppercase tracking-widest mb-3 ml-1">หมายเหตุเพิ่มเติม</h3>
             <textarea v-model="editNote" placeholder="เช่น ไม่เอาเผ็ด, แพ้ถั่ว..." class="w-full bg-[#f0f4f4] border-none rounded-[18px] py-4 px-5 text-[16px] font-medium text-gray-700 outline-none focus:ring-2 focus:ring-[#228085]/40 min-h-[100px] resize-none placeholder:text-gray-400"></textarea>
          </div>
          <div class="pt-6 border-t border-gray-100 flex flex-col gap-6">
             <div class="flex items-center justify-between">
                <span class="text-[16px] font-bold text-gray-700">เลือกจำนวน</span>
                <div class="flex items-center gap-5 bg-[#f0f4f4] p-1 rounded-full border border-gray-200">
                   <button @click="editQuantity > 1 ? editQuantity-- : null" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#228085] font-bold shadow-sm active:scale-95">−</button>
                   <span class="text-[16px] font-bold text-gray-800">{{ editQuantity }}</span>
                   <button @click="editQuantity++" class="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#228085] font-bold shadow-sm active:scale-95">+</button>
                </div>
             </div>
             <button @click="saveEdit" class="w-full py-4.5 rounded-[24px] bg-[#228085] text-white font-bold text-[18px] shadow-xl shadow-teal-500/20 active:scale-[0.98]">
                บันทึกการแก้ไข • {{ selectedItem?.price * editQuantity }} ฿
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Fixed Bottom Action (Standardized rounded-[24px]) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-md border-t border-gray-100 p-6 pb-10 z-30 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <button 
        @click="handleConfirmOrder" 
        :disabled="cartItems.length === 0"
        class="w-full py-5 rounded-[24px] bg-[#228085] text-white font-bold text-[18px] shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50 transition-all"
      >
        ยืนยันการสั่งซื้อ
      </button>
    </div>
  </div>
</template>

<style scoped>
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>
