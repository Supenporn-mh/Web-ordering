<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const name = ref('')
const email = ref('')
const phone = ref('')
const acceptPDPA = ref(false)
const showPDPA = ref(false)

onMounted(() => {
  phone.value = route.query.phone as string || ''
})

const canSubmit = () => name.value.trim().length > 0 && acceptPDPA.value

const handleConfirmInfo = () => {
  if (canSubmit()) {
    alert(localStorage.getItem('user_lang') === 'TH' ? 'ลงทะเบียนสำเร็จ!' : 'Registration Successful!')
    router.push({ name: 'login' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#e7f4f3] flex flex-col font-sans">

    <!-- Header -->
    <div class="px-5 pt-20 pb-12 relative">
      <div class="text-center">
        <h1 class="text-[32px] font-bold text-gray-900 tracking-tight">สมัครสมาชิก</h1>
        <p class="text-gray-500 mt-2 font-semibold text-lg">{{ phone }}</p>
      </div>
    </div>

    <!-- Form -->
    <div class="flex-1 bg-white rounded-t-[48px] px-8 pt-10 pb-10 shadow-3xl shadow-teal-900/10 border-t border-white/50">
      <div class="space-y-7">

        <div class="space-y-2">
          <label class="text-[13px] font-bold uppercase tracking-wider text-gray-600 ml-1">ชื่อ-นามสกุล <span class="text-red-500">*</span></label>
          <input
            v-model="name"
            type="text"
            placeholder="กรอกชื่อ-นามสกุล"
            class="w-full bg-[#f8fbff] border border-gray-200 focus:ring-2 focus:ring-[#228085]/50 focus:bg-white rounded-[18px] py-4.5 px-6 text-lg font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 shadow-sm"
          />
        </div>

        <div class="space-y-2">
          <label class="text-[13px] font-bold uppercase tracking-wider text-gray-600 ml-1">อีเมล <span class="text-[10px] text-gray-500 font-bold lowercase">(optional)</span></label>
          <input
            v-model="email"
            type="email"
            placeholder="กรอกอีเมล"
            class="w-full bg-[#f8fbff] border border-gray-200 focus:ring-2 focus:ring-[#228085]/50 focus:bg-white rounded-[18px] py-4.5 px-6 text-lg font-bold text-gray-800 outline-none transition-all placeholder:text-gray-400 shadow-sm"
          />
        </div>

        <div class="bg-[#f8fbff] rounded-3xl p-6 border border-gray-200 mt-2">
          <label class="flex items-start gap-4 cursor-pointer group select-none">
            <input type="checkbox" v-model="acceptPDPA" class="hidden" />
            <div
              class="mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all p-1 shadow-sm"
              :class="acceptPDPA ? 'bg-[#228085] border-[#228085]' : 'border-gray-300 bg-white'"
            >
              <svg v-if="acceptPDPA" class="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-[14px] text-gray-700 font-bold leading-relaxed">
              ฉันได้อ่านและยอมรับ
              <button type="button" @click.stop="showPDPA = true" class="text-[#228085] font-bold underline underline-offset-4 decoration-2 hover:text-[#1a6367]">นโยบายความเป็นส่วนตัว (PDPA)</button>
              และยินยอมให้ระบบเก็บรักษาข้อมูลส่วนบุคคล
            </span>
          </label>
        </div>

        <button
          @click="handleConfirmInfo"
          :disabled="!canSubmit()"
          class="w-full py-4.5 rounded-[18px] font-semibold text-lg transition-all mt-6 tracking-wide shadow-lg shadow-teal-500/20"
          :class="canSubmit()
            ? 'bg-[#228085] text-white active:scale-[0.98]'
            : 'bg-[#bfc5c5] text-white cursor-not-allowed shadow-none'"
        >
          ยืนยันข้อมูล
        </button>

      </div>
    </div>

    <!-- PDPA Modal -->
    <Transition name="fade">
      <div v-if="showPDPA" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end" @click.self="showPDPA = false">
        <div class="bg-white w-full rounded-t-[40px] px-8 pt-10 pb-10 max-h-[85vh] flex flex-col shadow-2xl animate-slide-up">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-bold text-gray-900 tracking-tight">นโยบายความเป็นส่วนตัว</h3>
            <button @click="showPDPA = false" class="p-2.5 rounded-2xl bg-[#eff1f5] text-gray-400 hover:text-red-500 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="overflow-y-auto flex-1 text-[15px] font-bold text-gray-600 leading-relaxed space-y-5 pr-1 lowercase">
            <p>บริษัทฯ มุ่งมั่นที่จะปกป้องข้อมูลส่วนบุคคลของท่าน เพื่อให้ท่านได้รับประสบการณ์ที่ดีที่สุดในการใช้บริการ</p>
            <div class="bg-[#f8fbff] p-6 rounded-2xl space-y-3.5 border border-gray-200">
               <div class="flex gap-3"><span class="text-[#228085] font-bold">1.</span> <span class="capitalize">เก็บข้อมูลเพื่อการยืนยันตัวตนและการใช้งาน (OTP)</span></div>
               <div class="flex gap-3"><span class="text-[#228085] font-bold">2.</span> <span class="capitalize">บันทึกชื่อและรายละเอียดเพื่อใช้ในการเตรียมอาหาร</span></div>
               <div class="flex gap-3"><span class="text-[#228085] font-bold">3.</span> <span class="capitalize">ข้อมูลของท่านจะถูกเก็บเป็นความลับสูงสุด</span></div>
            </div>
            <p>ท่านมีสิทธิ์ตามกฎหมาย PDPA ในการแก้ไขหรือลบข้อมูลส่วนบุคคลของท่านได้ทุกเมื่อ</p>
          </div>
          <button
            @click="acceptPDPA = true; showPDPA = false"
            class="mt-10 w-full py-4.5 rounded-[18px] bg-[#228085] text-white font-semibold text-lg active:scale-[0.98] transition-all shadow-lg shadow-teal-500/20"
          >
            รับทราบและยินยอม
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>
