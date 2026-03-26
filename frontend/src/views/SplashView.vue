<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  setTimeout(() => {
    router.push({ name: 'login' })
  }, 2000)
})
</script>

<template>
  <div class="min-h-screen bg-primary-main flex flex-col items-center justify-center text-white px-6">
    <div class="w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl animate-bounce mb-8">
      <span class="text-primary-main text-5xl font-black">WO</span>
    </div>
    <h1 class="text-3xl font-bold tracking-wider">Web Ordering</h1>
    <p class="mt-2 opacity-80 font-medium">Fast & Easy Food Online</p>
    
    <div class="absolute bottom-12">
      <div class="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  </div>
</template>
