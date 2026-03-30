<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const lang = ref(localStorage.getItem('user_lang') || 'EN')

const setLang = (val: string) => {
  lang.value = val
  localStorage.setItem('user_lang', val)
}

const selectBranch = (branch: string) => {
  localStorage.setItem('selectedBranch', branch)
  router.push({ name: 'menu' })
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] flex flex-col items-center px-8 pt-12 pb-10 font-sans">
    
    <!-- Header -->
    <div class="w-full max-w-sm flex justify-between items-center mb-12">
      <div class="flex items-center gap-2">
        <!-- Chef Hat Icon -->
        <div class="w-10 h-10 bg-[#228085] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M22,12C22,12 22,8 19,8C19,8 19,5 12,5C5,5 5,8 5,8C2,8 2,12 2,12L2,13C2,13 2,15 4,15V19C4,19 4,20 5,20H19C20,20 20,19 20,19V15C22,15 22,13 22,13L22,12M12,7C14,7 16,7.5 17,8.5C18,9.5 18,10.5 18,11.5V12C18,12 18,12.5 17.5,12.5C17,12.5 17,12 17,12V11.5C17,10.5 16,10 15,9.5C14,9 13,9 12,9C11,9 10,9 9,9.5C8,10 7,10.5 7,11.5V12C7,12 7,12.5 6.5,12.5C6,12.5 6,12 6,12V11.5C6,10.5 6,9.5 7,8.5C8,7.5 10,7 12,7M7,14C7,14 7,13.5 7.5,13.5C8,13.5 8,14 8,14V14.5C8,15.5 10,16 12,16C14,16 16,15.5 16,14.5V14C16,14 16,13.5 16.5,13.5C17,13.5 17,14 17,14V14.5C17,16.5 15,18 12,18C9,18 7,16.5 7,14.5V14Z"/></svg>
        </div>
        <span class="text-3xl font-black text-black tracking-tight">pos</span>
      </div>
      
      <!-- Lang Toggle -->
      <div class="bg-white/90 p-1 rounded-2xl flex gap-1 shadow-sm border border-white">
        <button 
          @click="setLang('EN')"
          :class="lang === 'EN' ? 'bg-[#228085] text-white' : 'text-gray-400'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          EN
        </button>
        <button 
          @click="setLang('TH')"
          :class="lang === 'TH' ? 'bg-[#228085] text-white' : 'text-gray-400'"
          class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all"
        >
          TH
        </button>
      </div>
    </div>

    <!-- Illustration Image -->
    <div class="w-full max-w-[280px] aspect-square bg-white rounded-[32px] flex items-center justify-center mb-8 overflow-hidden shadow-xl shadow-teal-900/5">
      <img src="https://img.freepik.com/free-vector/delivery-service-illustrated-concept_23-2148505081.jpg?t=st=1710599184~exp=1710602784~hmac=6217df12c0199f357b9d628d09aaad6f1ee43ff0bd58296d997184a1a33a8862&w=740" alt="delivery" class="w-full h-full object-cover p-4" />
    </div>

    <h2 class="text-4xl font-black text-black mb-12 tracking-tight text-center">
      {{ lang === 'TH' ? 'สั่งอาหาร' : 'Order Food' }}
    </h2>

    <!-- Actions -->
    <div class="w-full max-w-sm space-y-5">
      <button 
        @click="selectBranch('Modern Recipe')"
        class="w-full py-5 rounded-[22px] bg-[#228085] text-white font-black text-lg shadow-xl shadow-teal-500/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-wide border-b-4 border-teal-900/30"
      >
        Modern Recipe
      </button>
      
      <button 
        @click="selectBranch('Room Service')"
        class="w-full py-5 rounded-[22px] bg-[#228085] text-white font-black text-lg shadow-xl shadow-teal-500/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-wide border-b-4 border-teal-900/30"
      >
        Room Service
      </button>
    </div>
  </div>
</template>
