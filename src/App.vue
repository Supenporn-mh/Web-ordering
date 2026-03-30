<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div class="max-w-md mx-auto bg-[#f8fcfc] min-h-screen relative overflow-x-hidden shadow-2xl shadow-black/10">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route?.path || 'app'" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom UI Reset for Web Ordering Platform */
body {
  @apply bg-gray-100 antialiased font-sans text-gray-900;
  margin: 0;
  padding: 0;
}

/* Ensure no mysterious blue outlines/shadows on focus for better aesthetics */
*:focus {
  outline: none !important;
}

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
