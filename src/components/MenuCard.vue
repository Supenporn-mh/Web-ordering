<script setup lang="ts">
defineProps<{
  item: {
    id: number
    name: string
    desc: string
    price: number
    img: string
    spicy?: number
  }
}>()

defineEmits(['click'])
</script>

<template>
  <div 
    @click="$emit('click', item)"
    class="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-all active:scale-[0.98] group flex flex-col"
  >
    <div class="h-40 overflow-hidden relative">
      <img 
        :src="item.img" 
        :alt="item.name"
        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
    </div>
    
    <div class="p-4 flex flex-col flex-1 gap-2">
      <h3 class="text-[15px] font-bold text-gray-900 leading-tight">{{ item.name }}</h3>
      <p class="text-[12px] text-gray-600 font-bold line-clamp-2 leading-relaxed">{{ item.desc }}</p>
      
      <!-- Spicy Icons (as per screenshot) -->
      <div v-if="item.spicy" class="flex gap-0.5 mt-1">
        <span v-for="i in item.spicy" :key="i" class="text-[14px]">🌭</span>
      </div>
      
      <div class="mt-auto pt-2 flex items-center justify-between">
        <span class="text-[16px] font-extrabold text-[#228085]">฿{{ item.price.toLocaleString() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Individual Card Fade In */
.group {
  animation: cardFade 0.3s ease-out forwards;
}

@keyframes cardFade {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
