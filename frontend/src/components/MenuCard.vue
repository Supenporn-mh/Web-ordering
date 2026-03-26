<script setup lang="ts">
defineProps<{
  item: {
    id: number;
    name: string;
    desc: string;
    price: number;
    img: string;
    spicy: number;
  }
}>()
defineEmits(['click'])
</script>

<template>
  <div 
    @click="$emit('click', item)"
    class="bg-white rounded-[1.2rem] shadow-sm flex flex-col active:scale-[0.98] transition-all cursor-pointer overflow-hidden border border-white"
  >
    <!-- Item Image -->
    <div class="w-full h-40">
      <img :src="item.img" :alt="item.name" class="w-full h-full object-cover" />
    </div>
    <!-- Item Details -->
    <div class="p-3 flex flex-col justify-between flex-1">
      <div>
        <h3 class="font-bold text-[#1a2b3c] text-sm leading-snug whitespace-pre-line">{{ item.name }}</h3>
        <p class="text-xs text-gray-400 font-medium mt-1 line-clamp-1">{{ item.desc }}</p>
         <!-- Spiciness rating -->
        <div class="flex gap-0.5 mt-2" v-if="item.spicy > 0">
          <span class="text-lg" v-for="n in item.spicy" :key="n">🌭</span>
        </div>
        <div class="h-6 mt-2" v-else></div> <!-- Spacer -->
      </div>
      <div class="mt-3">
         <span class="text-[#228085] font-bold text-sm">฿{{ item.price }}</span>
      </div>
    </div>
  </div>
</template>
