<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MenuCard from '../components/MenuCard.vue'

const router = useRouter()
const activeCategory = ref('All')

const categories = [
  'All', 'Canteen (F0001)', 'ทดสอบธนบุรี (F0001)'
]

const items = [
  { id: 1, name: 'เส้นหมี่น้ำยาปู\n(ขนุนอ่อน)', desc: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)', price: 270, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80', spicy: 3 },
  { id: 2, name: 'เส้นหมี่น้ำยาปู\n(ขนุนอ่อน)', desc: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)', price: 270, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80', spicy: 3 },
  { id: 3, name: 'เส้นหมี่น้ำยาปู\n(ขนุนอ่อน)', desc: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)', price: 270, img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80', spicy: 0 },
  { id: 4, name: 'เส้นหมี่น้ำยาปู\n(ขนุนอ่อน)', desc: 'เส้นหมี่น้ำยาปู (ขนุนอ่อน)', price: 270, img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?auto=format&fit=crop&w=400&q=80', spicy: 0 }
]

const selectedItem = ref<any>(null)
const isModalOpen = ref(false)
const cartCount = ref(0)
const quantity = ref(1)
const note = ref('')

const openItem = (item: any) => {
  selectedItem.value = item
  quantity.value = 1
  note.value = ''
  isModalOpen.value = true
}

const addToCart = () => {
  cartCount.value += quantity.value
  isModalOpen.value = false
  // Logic to save to storage would go here
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] font-sans pb-24">
    
    <!-- Top White Area containing Header, Title, Banner, and Categories -->
    <div class="bg-white px-5 pt-3 pb-4">
      <!-- Header Username / Branch -->
      <div class="flex justify-between items-center mb-6">
         <span class="font-bold text-gray-800 text-sm">Demo</span>
         <span class="font-medium text-gray-800 text-sm">0xxxxxxx</span>
      </div>

      <!-- Title & Lang Switcher -->
      <div class="flex flex-row justify-between items-start mb-6">
        <div>
          <h1 class="text-[28px] font-bold text-gray-900 leading-none mb-1">เมนู</h1>
          <p class="text-sm text-gray-500 font-medium">เลือกเมนูที่คุณชื่นชอบ</p>
        </div>
        
        <!-- Lang Toggle -->
        <div class="bg-[#eef4ff] rounded-[0.4rem] flex p-0.5 mt-1 shadow-sm h-7">
          <button class="text-gray-500 px-3 h-full rounded-[0.3rem] text-xs font-bold w-10">EN</button>
          <button class="bg-[#228085] text-white px-3 h-full rounded-[0.3rem] text-xs font-bold w-10 shadow-sm">TH</button>
        </div>
      </div>

      <!-- Banner -->
      <div class="w-full h-32 rounded-[1rem] overflow-hidden mb-5">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80" alt="Banner" class="w-full h-full object-cover" />
      </div>

      <!-- Categories Pills -->
      <div class="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="activeCategory === cat ? 'bg-[#228085] text-white' : 'bg-[#e7f4f3] text-[#1a2b3c]'"
          class="px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Items Grid (Bg #e7f4f3) -->
    <div class="p-4 grid grid-cols-2 gap-4">
      <MenuCard 
        v-for="item in items" 
        :key="item.id" 
        :item="item"
        @click="openItem"
      />
    </div>

    <div class="fixed bottom-[80px] right-6 z-40">
       <button @click="router.push({ name: 'checkout' })" class="w-14 h-14 bg-[#228085] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all text-white relative">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          <span v-if="cartCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white">{{ cartCount }}</span>
       </button>
    </div>

    <!-- Item Detail Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-hidden">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="isModalOpen = false"></div>
      
      <!-- Modal Content -->
      <div class="bg-white w-full max-w-sm rounded-[1.5rem] overflow-hidden relative shadow-2xl animate-in fade-in zoom-in duration-300">
        <!-- Close button (X) inside Modal Top Right -->
        <button @click="isModalOpen = false" class="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-gray-500 hover:bg-black/10 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div class="p-5 flex flex-col max-h-[90vh] overflow-y-auto">
          <!-- Modal Title -->
          <h2 class="text-sm font-bold text-gray-800 mb-4 px-1 pr-10 truncate">{{ selectedItem?.name }}</h2>
          
          <!-- Modal Image -->
          <div class="w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-50">
            <img :src="selectedItem?.img" class="w-full h-full object-cover" />
          </div>

          <!-- Price -->
          <div class="mb-4">
            <p class="text-[10px] text-gray-400 font-medium mb-1">{{ selectedItem?.desc }}</p>
            <span class="text-xl font-bold text-[#228085]">฿{{ selectedItem?.price }}</span>
          </div>

          <!-- Notes -->
          <div class="mb-5">
             <h3 class="text-xs font-bold text-gray-800 mb-2">หมายเหตุ</h3>
             <textarea v-model="note" placeholder="เพิ่มหมายเหตุ..." class="w-full bg-[#f8fbff] border border-gray-100 rounded-xl py-3 px-4 text-xs font-medium text-gray-600 outline-none focus:border-[#228085] transition-colors min-h-[80px] resize-none"></textarea>
          </div>

          <div class="pt-4 border-t border-gray-50 flex flex-col gap-4">
             <!-- Quantity Adjustment -->
             <div class="flex items-center justify-between px-1">
                <span class="text-xs font-bold text-gray-800">จำนวน</span>
                <div class="flex items-center gap-5">
                   <button @click="quantity > 1 ? quantity-- : null" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold transition-active active:scale-90">−</button>
                   <span class="text-sm font-bold w-4 text-center">{{ quantity }}</span>
                   <button @click="quantity++" class="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 font-bold transition-active active:scale-90">+</button>
                </div>
             </div>

             <!-- Action Button -->
             <button @click="addToCart" class="w-full py-3.5 rounded-xl bg-[#228085] text-white font-bold text-sm shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all">
                เพิ่มลงตะกร้า • ฿{{ selectedItem?.price * quantity }}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav (Tab Bar) -->
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex h-[72px] items-center justify-around z-30 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1 text-gray-500 cursor-pointer w-20 h-full">
         <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        <span class="text-[11px] font-medium tracking-wide">เมนู</span>
      </div>
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-gray-700 cursor-pointer w-20 h-full">
         <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
        <span class="text-[11px] font-medium tracking-wide">คำสั่งซื้อ</span>
      </div>
      <div class="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-700 cursor-pointer w-20 h-full">
         <svg class="w-[22px] h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        <span class="text-[11px] font-medium tracking-wide">โปรไฟล์</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
