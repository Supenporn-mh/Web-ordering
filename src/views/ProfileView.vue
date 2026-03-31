<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentLang = ref('TH')
const isEditModalOpen = ref(false)

const userData = ref({
  firstName: 'นวิยา',
  lastName: 'อินทรประสิทธิ์',
  email: '',
  phone: '0908091315',
  hn: '828292992',
  role: 'Member'
})

// Modal form state
const form = ref({ ...userData.value })

onMounted(() => {
  currentLang.value = localStorage.getItem('user_lang') || 'TH'
})

const toggleLang = (lang: string) => {
  currentLang.value = lang
  localStorage.setItem('user_lang', lang)
}

const handleLogout = () => {
  localStorage.removeItem('cart')
  router.push({ name: 'login' })
}

const openEditModal = () => {
  form.value = { ...userData.value }
  isEditModalOpen.value = true
}

const saveProfile = () => {
  userData.value = { ...form.value }
  isEditModalOpen.value = false
  // Success feedback or API call here
}

// Translations
const translations: any = {
  TH: {
    title: 'โปรไฟล์',
    subTitle: 'จัดการบัญชีของคุณ',
    role: 'ระดับสมาชิค',
    fName: 'ชื่อจริง',
    lName: 'นามสกุล',
    email: 'อีเมล',
    phone: 'เบอร์โทรศัพท์',
    hn: 'เลข HN / บัตรประชาชน',
    editBtn: 'แก้ไขข้อมูลส่วนตัว',
    logoutBtn: 'ออกจากระบบ',
    save: 'บันทึก',
    cancel: 'ยกเลิก'
  },
  EN: {
    title: 'Profile',
    subTitle: 'Manage your account',
    role: 'Role',
    fName: 'First Name',
    lName: 'Last Name',
    email: 'Email',
    phone: 'Phone',
    hn: 'HN / ID Number',
    editBtn: 'Edit Profile',
    logoutBtn: 'Logout',
    save: 'Save',
    cancel: 'Cancel'
  }
}

const t = computed(() => translations[currentLang.value])
</script>

<template>
  <div class="min-h-screen bg-[#f8fcfc] font-sans pb-32">
    <!-- Header with Language Toggle -->
    <div class="px-6 pt-10 pb-6 flex justify-between items-start">
      <div>
        <h1 class="text-[28px] font-bold text-gray-900 tracking-tight">{{ t.title }}</h1>
        <p class="text-[14px] text-gray-600 font-bold tracking-wide">{{ t.subTitle }}</p>
      </div>
      <!-- Language Toggle (pill style) -->
      <div class="bg-gray-100/80 p-1 rounded-full flex gap-1">
        <button 
          @click="toggleLang('EN')"
          :class="currentLang === 'EN' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-[13px] font-bold transition-all"
        >EN</button>
        <button 
          @click="toggleLang('TH')"
          :class="currentLang === 'TH' ? 'bg-[#228085] text-white shadow-sm' : 'text-gray-400'"
          class="px-4 py-1.5 rounded-full text-[13px] font-bold transition-all"
        >TH</button>
      </div>
    </div>

    <div class="px-5 space-y-6">
      <!-- Profile Header Card (Standardized rounded-[24px]) -->
      <div class="bg-white rounded-[24px] p-8 shadow-sm border border-gray-200 flex flex-col items-center text-center">
        <!-- Avatar -->
        <div class="w-24 h-24 bg-[#228085] rounded-full flex items-center justify-center text-white text-[32px] font-bold shadow-xl shadow-teal-500/20 mb-4">
          {{ userData.firstName.charAt(0).toUpperCase() }}
        </div>
        <h2 class="text-[20px] font-bold text-gray-900 mb-4 tracking-tight">{{ userData.firstName }} {{ userData.lastName }}</h2>
        
        <!-- Role Badge Box -->
        <div class="w-full bg-[#f0fafa] rounded-[18px] py-4 px-6 border border-gray-200">
           <p class="text-[12px] text-gray-500 font-bold uppercase tracking-widest mb-1">{{ t.role }}</p>
           <p class="text-[18px] font-bold text-[#228085]">Member</p>
        </div>
      </div>

      <!-- Details Card -->
      <div class="bg-white rounded-[24px] p-6 shadow-sm border border-gray-200 space-y-7">
        <!-- Detail Row: First Name -->
        <div class="flex items-center gap-5">
           <div class="w-12 h-12 rounded-[16px] bg-[#f0fafa] flex items-center justify-center text-[#228085] shrink-0 border border-gray-200">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
           </div>
           <div class="flex-1 border-b border-gray-200 pb-3">
             <p class="text-[14px] text-gray-500 font-bold mb-0.5 tracking-wide">{{ t.fName }}</p>
             <p class="text-[16px] font-bold text-gray-900">{{ userData.firstName }}</p>
           </div>
        </div>

        <!-- Detail Row: Last Name -->
        <div class="flex items-center gap-5">
           <div class="w-12 h-12 rounded-[16px] bg-[#f0fafa] flex items-center justify-center text-[#228085] shrink-0 border border-gray-200">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
           </div>
           <div class="flex-1 border-b border-gray-200 pb-3">
             <p class="text-[14px] text-gray-500 font-bold mb-0.5 tracking-wide">{{ t.lName }}</p>
             <p class="text-[16px] font-bold text-gray-900">{{ userData.lastName }}</p>
           </div>
        </div>

        <!-- Detail Row: Email -->
        <div class="flex items-center gap-5">
           <div class="w-12 h-12 rounded-[16px] bg-[#f0fafa] flex items-center justify-center text-[#228085] shrink-0 border border-gray-200">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"></path></svg>
           </div>
           <div class="flex-1 border-b border-gray-200 pb-3">
             <p class="text-[14px] text-gray-500 font-bold mb-0.5 tracking-wide">{{ t.email }}</p>
             <p class="text-[16px] font-bold text-gray-400 italic">{{ userData.email || t.email }}</p>
           </div>
        </div>

        <!-- Detail Row: Phone -->
        <div class="flex items-center gap-5">
           <div class="w-12 h-12 rounded-[16px] bg-[#f0fafa] flex items-center justify-center text-[#228085] shrink-0 border border-gray-200">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
           </div>
           <div class="flex-1 border-b border-gray-200 pb-3">
             <p class="text-[14px] text-gray-500 font-bold mb-0.5 tracking-wide">{{ t.phone }}</p>
             <p class="text-[16px] font-bold text-gray-900">{{ userData.phone }}</p>
           </div>
        </div>

        <!-- Detail Row: HN -->
        <div class="flex items-center gap-5">
           <div class="w-12 h-12 rounded-[16px] bg-[#f0fafa] flex items-center justify-center text-[#228085] shrink-0 border border-gray-200">
             <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
           </div>
           <div class="flex-1">
             <p class="text-[14px] text-gray-500 font-bold mb-0.5 tracking-wide">{{ t.hn }}</p>
             <p class="text-[16px] font-bold text-gray-900">{{ userData.hn }}</p>
           </div>
        </div>

        <!-- Action: Edit Profile -->
        <button @click="openEditModal" class="w-full py-5 rounded-[18px] bg-[#228085] text-white font-bold text-[18px] shadow-lg shadow-teal-500/10 flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
           {{ t.editBtn }}
        </button>
      </div>

      <!-- Logout Button -->
      <button @click="handleLogout" class="w-full py-5 rounded-[24px] bg-[#db5b60] text-white font-bold text-[18px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-red-500/10">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
         {{ t.logoutBtn }}
      </button>

    </div>

    <!-- Edit Profile Modal (Point 1) -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[6px]" @click="isEditModalOpen = false"></div>
      <div class="bg-white w-full max-w-md rounded-[24px] p-7 pt-9 relative animate-fade-in shadow-2xl">
         <div class="space-y-5">
            <div class="space-y-1.5 px-1">
               <label class="text-[14px] text-gray-400 font-bold tracking-wide uppercase">{{ t.fName }}</label>
               <input v-model="form.firstName" class="w-full bg-gray-50 border-none rounded-[16px] py-4 px-5 text-[16px] font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#228085]/40 transition-all"/>
            </div>
            <div class="space-y-1.5 px-1">
               <label class="text-[14px] text-gray-400 font-bold tracking-wide uppercase">{{ t.lName }}</label>
               <input v-model="form.lastName" class="w-full bg-gray-50 border-none rounded-[16px] py-4 px-5 text-[16px] font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#228085]/40 transition-all"/>
            </div>
            <div class="space-y-1.5 px-1">
               <label class="text-[14px] text-gray-400 font-bold tracking-wide uppercase">{{ t.email }}</label>
               <input v-model="form.email" type="email" class="w-full bg-gray-50 border-none rounded-[16px] py-4 px-5 text-[16px] font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#228085]/40 transition-all"/>
            </div>
            <div class="space-y-1.5 px-1">
               <label class="text-[14px] text-gray-400 font-bold tracking-wide uppercase">{{ t.phone }}</label>
               <input v-model="form.phone" class="w-full bg-gray-50 border-none rounded-[16px] py-4 px-5 text-[16px] font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#228085]/40 transition-all"/>
            </div>
            <div class="space-y-1.5 px-1 pb-4">
               <label class="text-[14px] text-gray-400 font-bold tracking-wide uppercase">{{ t.hn }}</label>
               <input v-model="form.hn" class="w-full bg-gray-50 border-none rounded-[16px] py-4 px-5 text-[16px] font-bold text-gray-800 outline-none focus:ring-2 focus:ring-[#228085]/40 transition-all"/>
            </div>
            
            <div class="flex gap-4 pt-4">
               <button @click="isEditModalOpen = false" class="flex-1 py-5 rounded-[18px] bg-gray-100 text-gray-600 font-bold text-[18px] active:scale-95 transition-all">{{ t.cancel }}</button>
               <button @click="saveProfile" class="flex-1 py-5 rounded-[18px] bg-[#228085] text-white font-bold text-[18px] shadow-xl shadow-teal-500/20 active:scale-95 transition-all">{{ t.save }}</button>
            </div>
         </div>
      </div>
    </div>

    <!-- Standardized Bottom Nav (English labels as per screenshot) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white border-t border-gray-200 flex h-[85px] items-center justify-around z-50 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.05)] px-4">
      <div @click="router.push({ name: 'menu' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-500 cursor-pointer w-24 h-full active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 2v7c0 1.1.9 2 2 2h4v10h2V11h4c1.1 0 2-.9 2-2V2H3z m8 7H5V4h1v5h1V4h1v5h1V4h1v5h1V4h2v5z"/></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.menu }}</span>
      </div>
      
      <div @click="router.push({ name: 'orders' })" class="flex flex-col items-center justify-center gap-1.5 text-gray-500 cursor-pointer w-24 h-full active:scale-95 transition-all">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.orders }}</span>
      </div>

      <div class="flex flex-col items-center justify-center gap-1.5 text-[#228085] cursor-pointer w-24 h-full relative">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
         <span class="text-[12px] font-bold tracking-tight">{{ t.profile }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
.animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
</style>
