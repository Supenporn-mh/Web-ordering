<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import MenuCard from '../components/MenuCard.vue'

const router = useRouter()
const currentLang = ref('TH')
const activeCategory = ref('All')
const isModalOpen = ref(false)
const selectedItem = ref<any>(null)
const quantity = ref(1)
const note = ref('')

const cartCount = ref(0)
const loadCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cartCount.value = cart.reduce((sum: number, item: any) => sum + (item.qty || 0), 0)
}

onMounted(() => {
  currentLang.value = localStorage.getItem('user_lang') || 'TH'
  loadCartCount()
})

const translations: any = {
  TH: {
    title: 'เมนู',
    subTitle: 'เลือกเมนูที่คุณชื่นชอบ',
    all: 'All',
    category1: 'Canteen (F0001)',
    category2: 'ทดสอบธนบุรี (F0001)',
    addToCart: 'เพิ่มลงตะกร้า',
    total: 'ยอดรวม',
    menu: 'เมนู',
    orders: 'คำสั่งซื้อ',
    profile: 'โปรไฟล์'
  },
  EN: {
    title: 'Menu',
    subTitle: 'Choose your favorite menu',
    all: 'All',
    category1: 'Canteen (F0001)',
    category2: 'Thonburi Test (F0001)',
    addToCart: 'Add to Cart',
    total: 'Total',
    menu: 'Menu',
    orders: 'Orders',
    profile: 'Profile'
  }
}

const t = computed(() => translations[currentLang.value] || translations.TH)

const categories = ['All', 'Canteen (F0001)', 'ทดสอบธนบุรี (F0001)']

const items = [
  {
    id: 1,
    name: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)',
    desc: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)',
    price: 270,
    img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    spicy: 3
  },
  {
    id: 2,
    name: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)',
    desc: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)',
    price: 270,
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    spicy: 3
  },
  {
    id: 3,
    name: 'สลัดผักเพื่อสุขภาพ',
    desc: 'สลัดผักสดพร้อมน้ำสลัดสูตรพิเศษ',
    price: 250,
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&auto=format&fit=crop&q=60',
    spicy: 0
  }
]

const openItem = (item: any) => {
  selectedItem.value = item
  quantity.value = 1
  note.value = ''
  isModalOpen.value = true
}

const addToCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  // Check if item already exists
  const existingIndex = cart.findIndex((i: any) => i.id === selectedItem.value.id && i.note === note.value)
  if (existingIndex > -1) {
    cart[existingIndex].qty += quantity.value
  } else {
    cart.push({
      ...selectedItem.value,
      qty: quantity.value,
      note: note.value
    })
  }
  localStorage.setItem('cart', JSON.stringify(cart))
  loadCartCount()
  isModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fcfc] font-sans pb-32">
    <!-- Top Header (Based on screenshot: Demo | 0xxxxxxx) -->
    <div class="bg-white px-5 pt-3 pb-4 flex justify-between items-center text-[14px] font-bold text-gray-800">
      <span>Demo</span>
      <span class="text-gray-400">0xxxxxxx</span>
    </div>

    <!-- Title & Language Toggle -->
    <div class="px-5 pt-4 pb-2 flex justify-between items-end">
      <div>
        <h1 class="text-[28px] font-bold text-gray-900 tracking-tight leading-none">{{ t.title }}</h1>
        <p class="text-[14px] text-gray-400 mt-2">{{ t.subTitle }}</p>
      </div>
      <div class="flex bg-gray-100 p-1 rounded-full text-[12px] font-bold">
        <button @click="currentLang = 'EN'" :class="currentLang === 'EN' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'" class="px-3 py-1 rounded-full transition-all">EN</button>
        <button @click="currentLang = 'TH'" :class="currentLang === 'TH' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-400'" class="px-3 py-1 rounded-full transition-all ml-1">TH</button>
      </div>
    </div>

    <!-- Hero Banner (Promotion) -->
    <div class="px-5 mt-4">
      <div class="rounded-[24px] overflow-hidden shadow-sm aspect-[21/9]">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=60" class="w-full h-full object-cover" alt="Promotion Banner" />
      </div>
    </div>

    <!-- Categories Pills -->
    <div class="px-5 mt-6 flex gap-3 overflow-x-auto hide-scrollbar">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="activeCategory = cat"
        :class="activeCategory === cat ? 'bg-[#228085] text-white shadow-teal-900/10' : 'bg-[#e7f4f3] text-gray-600'"
        class="px-5 py-2.5 rounded-full text-[14px] font-bold whitespace-nowrap transition-all active:scale-95"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Menu Grid -->
    <div class="p-5 grid grid-cols-2 gap-4">
      <MenuCard 
        v-for="item in items" 
        :key="item.id" 
        :item="item"
        @click="openItem(item)"
      />
    </div>

    <!-- Floating Cart Button (Teal Circle bottom right) -->
    <div class="fixed bottom-28 right-6 z-40">
      <button @click="router.push({ name: 'checkout' })" class="bg-[#228085] w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-teal-900/20 active:scale-90 transition-all border-2 border-white relative">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">{{ cartCount }}</span>
      </button>
    </div>

    <!-- Standardized Bottom Nav (Thai labels) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-gray-100 flex h-[85px] items-center justify-around z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-4">
      <div class="flex flex-col items-center justify-center gap-1.5 text-[#228085] cursor-pointer w-24 h-full relative">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 2v10c0 1.1.9 2 2 2h2v7h2v-7h2c1.1 0 2-.9 2-2V2H6z M11 10H8V5h1v5h1V5h1v5z"/></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.menu }}</span>
      </div>
      
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.orders }}</span>
      </div>

      <div @click="router.push({ name: 'profile' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-400 cursor-pointer w-24 h-full group active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.profile }}</span>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="isModalOpen = false"></div>
      <div class="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <img :src="selectedItem?.img" class="w-full h-56 object-cover" />
        <div class="absolute top-4 right-4 z-50">
          <button @click="isModalOpen = false" class="bg-gray-100/90 backdrop-blur-md text-gray-700 p-2.5 rounded-full hover:bg-gray-200 transition-all border border-gray-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6">
          <h2 class="text-[20px] font-bold text-gray-900">{{ selectedItem?.name }}</h2>
          <p class="text-gray-500 text-[14px] mt-2 leading-relaxed">{{ selectedItem?.desc }}</p>
          
          <div class="flex items-center justify-between mt-8">
            <div class="flex items-center bg-[#f0f4f4] rounded-full p-1.5 border border-gray-200 shadow-sm">
              <button @click="quantity > 1 ? quantity-- : null" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#228085] font-bold active:scale-95 transition-all">-</button>
              <span class="w-12 text-center font-bold text-[18px] text-gray-800">{{ quantity }}</span>
              <button @click="quantity++" class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#228085] font-bold active:scale-95 transition-all">+</button>
            </div>
            <div class="text-[24px] font-bold text-[#228085]">฿{{ (selectedItem?.price * quantity).toLocaleString() }}</div>
          </div>
          
          <textarea 
            v-model="note" 
            placeholder="คำแนะนำพิเศษ (ถ้ามี)"
            class="w-full mt-6 bg-[#f0f4f4] rounded-2xl p-4 text-[15px] font-medium text-gray-800 border border-gray-200 focus:ring-2 focus:ring-[#228085]/20 focus:bg-white transition-all outline-none resize-none placeholder:text-gray-500"
            rows="3"
          ></textarea>
          
          <button @click="addToCart" class="w-full mt-6 bg-[#228085] text-white py-4 rounded-full font-bold text-[16px] shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all">
            {{ t.addToCart }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
