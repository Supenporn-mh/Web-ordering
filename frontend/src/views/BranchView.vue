<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const selectBranch = (branch: string) => {
  localStorage.setItem('selectedBranch', branch)
  router.push({ name: 'menu' })
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] flex flex-col items-center px-8 pt-12 font-sans">
    
    <!-- Header -->
    <div class="w-full max-w-sm flex justify-between items-center mb-16">
      <div class="flex items-center gap-2">
        <!-- POS Logo Simulation -->
        <div class="bg-[#1a7fff] text-white font-black text-xl rounded-lg px-2 py-1 leading-none shadow-sm flex flex-col items-center pb-1.5">
           <span class="text-[8px] -mb-1 opacity-0">o</span>
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <span class="text-3xl font-black text-black tracking-tighter">pos</span>
      </div>
      
      <!-- Lang Toggle -->
      <div class="bg-[#eef4ff] rounded-[0.4rem] flex p-0.5 shadow-sm">
        <button class="bg-[#228085] text-white px-3 py-1 rounded-[0.3rem] text-xs font-bold w-10 text-center shadow-sm">EN</button>
        <button class="text-gray-500 px-3 py-1 rounded-[0.3rem] text-xs font-bold w-10 text-center">TH</button>
      </div>
    </div>

    <!-- Illustration Image -->
    <div class="w-full max-w-[280px] aspect-square bg-white rounded-3xl flex items-center justify-center mb-6 overflow-hidden">
      <!-- Using generic delivery image placeholder since I can't map the exact image provided -->
      <img src="https://img.freepik.com/free-vector/delivery-service-illustrated-concept_23-2148505081.jpg?t=st=1710599184~exp=1710602784~hmac=6217df12c0199f357b9d628d09aaad6f1ee43ff0bd58296d997184a1a33a8862&w=740" alt="delivery" class="w-full h-full object-cover p-2" />
    </div>

    <h2 class="text-3xl font-black text-black mb-10">สั่งอาหาร</h2>

    <!-- Actions -->
    <div class="w-full max-w-sm space-y-4">
      <button 
        @click="selectBranch('Modern Recipe')"
        class="w-full py-4 rounded-xl bg-[#228085] text-white font-bold text-base shadow-lg shadow-teal-500/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase"
      >
        Modern Recipe
      </button>
      
      <button 
        @click="selectBranch('Room Service')"
        class="w-full py-4 rounded-xl bg-[#228085] text-white font-bold text-base shadow-lg shadow-teal-500/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase"
      >
        Room Service
      </button>
    </div>
  </div>
</template>
