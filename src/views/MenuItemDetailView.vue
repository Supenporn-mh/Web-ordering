<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const quantity = ref(1)

const increment = () => quantity.value++
const decrement = () => { if (quantity.value > 1) quantity.value-- }
const note = ref('')

// Mock item data 
const item = {
  name: 'ข้าวกะเพราเนื้อวากิว',
  desc: 'เนื้อวากิวพรีเมียมผัดกะเพรารสจัดจ้าน เสิร์ฟพร้อมข้าวสวยร้อนๆ และไข่ดาวเป็ดไล่ทุ่ง',
  price: 250,
  img: 'https://images.unsplash.com/photo-1512058560366-cd242d4235cd?auto=format&fit=crop&w=800&q=80'
}

const extras = ref([
  { id: 1, name: 'เพิ่มไข่ดาว', price: 15, selected: false },
  { id: 2, name: 'เพิ่มเนื้อวากิว', price: 80, selected: false },
  { id: 3, name: 'เผ็ดน้อย', price: 0, selected: false }
])

const totalPrice = computed(() => {
  const extraCost = extras.value.filter(e => e.selected).reduce((sum, e) => sum + e.price, 0)
  return (item.price + extraCost) * quantity.value
})

const addToCart = () => {
  // Mock adding to cart and returning to menu
  router.push({ name: 'menu' })
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] font-sans pb-40">
    <!-- Image Header with Back Button -->
    <div class="relative w-full h-[280px]">
      <img :src="item.img" alt="food" class="w-full h-full object-cover" />
      <button @click="router.back()" class="absolute top-6 left-6 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm z-10 active:scale-95 transition-all outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#e7f4f3] to-transparent"></div>
    </div>

    <div class="px-6 -mt-6 relative z-10 space-y-6">
      <!-- Title & Desc -->
      <div class="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-200 space-y-2">
        <div class="flex justify-between items-start gap-4">
          <h1 class="text-lg font-bold text-gray-900 leading-tight">{{ item.name }}</h1>
          <span class="text-lg font-bold text-[#228085]">฿{{ item.price }}</span>
        </div>
        <p class="text-gray-600 text-[13px] font-bold leading-relaxed">{{ item.desc }}</p>
      </div>

      <!-- Add-ons -->
      <div class="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-200 space-y-4">
        <h3 class="font-bold text-sm text-gray-900 uppercase tracking-tight">ตัวเลือกเพิ่มเติม<span class="text-gray-500 text-[10px] ml-2 lowercase font-bold">(ถ้ามี)</span></h3>
        <div class="space-y-5">
          <label v-for="ex in extras" :key="ex.id" class="flex items-center justify-between cursor-pointer group">
            <div class="flex items-center gap-4">
              <input type="checkbox" v-model="ex.selected" class="w-5 h-5 accent-[#228085] rounded-md transition-all outline-none" />
              <span class="text-gray-800 font-bold group-hover:text-[#228085] text-[15px] transition-colors">{{ ex.name }}</span>
            </div>
            <span class="text-gray-900 font-bold text-[15px]" v-if="ex.price > 0">+฿{{ ex.price }}</span>
          </label>
        </div>
      </div>

      <!-- Special Instructions -->
      <div class="bg-white p-6 rounded-[1.5rem] shadow-sm border border-gray-200 space-y-4">
        <h3 class="font-bold text-sm text-gray-900 uppercase tracking-tight">ความต้องการพิเศษ</h3>
        <textarea v-model="note" placeholder="เช่น ไม่ใส่ผักชี, เผ็ดน้อยมาก..." class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-4 px-5 text-gray-800 outline-none focus:border-[#228085] min-h-[120px] transition-colors font-bold text-[15px] shadow-inner placeholder:text-gray-400"></textarea>
      </div>
    </div>

    <!-- Fixed Bottom Action -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-md border-t border-gray-200 p-6 pb-10 z-40 rounded-t-[2.5rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
      <div class="flex items-center gap-6 mb-5 justify-center">
        <button @click="decrement" class="w-12 h-12 bg-[#228085]/10 rounded-full flex items-center justify-center text-[#228085] font-bold text-2xl active:scale-90 transition-all border border-[#228085]/20 pb-1">−</button>
        <span class="text-2xl font-bold text-gray-900 w-12 text-center">{{ quantity }}</span>
        <button @click="increment" class="w-12 h-12 bg-[#228085] rounded-full flex items-center justify-center text-white font-bold text-2xl active:scale-90 transition-all shadow-lg pb-1 shadow-teal-500/20">＋</button>
      </div>
      <button @click="addToCart" class="w-full py-5 rounded-[22px] bg-[#228085] text-white font-bold text-[18px] shadow-xl shadow-teal-500/20 active:scale-[0.98] transition-all flex justify-between items-center px-10">
        <span>เพิ่มลงตะกร้า</span>
        <span class="bg-white/20 px-4 py-1 rounded-xl text-[16px] font-bold">฿{{ totalPrice.toLocaleString() }}</span>
      </button>
    </div>
  </div>
</template>
