<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const branchType = ref(localStorage.getItem('selectedBranch') || 'Room Service')
const deliveryOption = ref(branchType.value === 'Room Service' ? 'delivery' : 'store')
const putInBox = ref(false)
const orderNote = ref('')
const pickupMode = ref('') // 'dine-in' | 'takeaway'
const roomNumber = ref('')
const hnNumber = ref('')

const getCurrentTimePlusTwoHours = () => {
  const now = new Date()
  now.setHours(now.getHours() + 2)
  const m = now.getMinutes() < 30 ? 0 : 30
  return `${now.getHours().toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

const pickupTimeOption = ref('now')
const scheduleTime = ref(branchType.value === 'Room Service' ? getCurrentTimePlusTwoHours() : '12:00')

// --- Custom Time Picker ---
const pickerHour = ref(6)
const pickerMinute = ref(0)
const pickerAmPm = ref('PM')
const showPicker = ref(false)

const initPickerFromSchedule = () => {
  const [h24, m] = scheduleTime.value.split(':').map(Number)
  pickerAmPm.value = h24 >= 12 ? 'PM' : 'AM'
  pickerHour.value = h24 % 12 || 12
  pickerMinute.value = m
}

const updateScheduleFromPicker = () => {
  let h = pickerHour.value
  if (pickerAmPm.value === 'PM' && h !== 12) h += 12
  if (pickerAmPm.value === 'AM' && h === 12) h = 0
  scheduleTime.value = `${h.toString().padStart(2, '0')}:${pickerMinute.value.toString().padStart(2, '0')}`
}

const incHour = () => { pickerHour.value = (pickerHour.value % 12) + 1; updateScheduleFromPicker() }
const decHour = () => { pickerHour.value = ((pickerHour.value - 2 + 12) % 12) + 1; updateScheduleFromPicker() }
const incMin = () => { pickerMinute.value = pickerMinute.value === 0 ? 30 : 0; updateScheduleFromPicker() }
const decMin = () => { pickerMinute.value = pickerMinute.value === 30 ? 0 : 30; updateScheduleFromPicker() }
const toggleAmPm = (val: string) => { pickerAmPm.value = val; updateScheduleFromPicker() }

const pickerDisplayTime = computed(() =>
  `${pickerHour.value} : ${pickerMinute.value.toString().padStart(2, '0')}  ${pickerAmPm.value}`
)

watch(pickupTimeOption, (val) => {
  if (val === 'schedule') {
    initPickerFromSchedule()
    showPicker.value = true
  } else {
    showPicker.value = false
  }
})

onMounted(() => {
  initPickerFromSchedule()
  
  // Restore from localStorage if exists
  const savedDelivery = localStorage.getItem('deliveryOption')
  if (savedDelivery) deliveryOption.value = savedDelivery
  
  roomNumber.value = localStorage.getItem('roomNumber') || ''
  hnNumber.value = localStorage.getItem('hnNumber') || ''
  orderNote.value = localStorage.getItem('orderNote') || ''
  pickupMode.value = localStorage.getItem('pickupMode') || ''
  
  const savedPutInBox = localStorage.getItem('putInBox')
  if (savedPutInBox) putInBox.value = savedPutInBox === 'true'
})
// --- End Time Picker ---

const canProceed = computed(() => {
  if (deliveryOption.value === 'store' && !pickupMode.value) return false
  return true
})

const goNext = () => {
  if (!canProceed.value) return
  localStorage.setItem('deliveryOption', deliveryOption.value)
  localStorage.setItem('putInBox', putInBox.value.toString())
  localStorage.setItem('orderNote', orderNote.value)
  localStorage.setItem('pickupMode', pickupMode.value)
  localStorage.setItem('roomNumber', roomNumber.value)
  localStorage.setItem('hnNumber', hnNumber.value)
  localStorage.setItem('pickupTime', pickupTimeOption.value === 'now' ? 'ทันที' : scheduleTime.value)
  router.push({ name: 'cart' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f4fafa] font-sans pb-28">
    <!-- Header -->
    <div class="px-5 py-3 flex items-center sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm shadow-teal-900/5">
      <button @click="router.back()" class="p-2 rounded-xl text-gray-900 active:scale-90 absolute left-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-[18px] font-bold text-gray-800 mx-auto tracking-tight">ข้อมูลที่อยู่จัดส่ง</h1>
    </div>

    <div class="px-4 pt-6 pb-10 space-y-4 text-[#2d3748]">
      <!-- Contact Info -->
      <div class="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-200">
        <h3 class="text-sm font-bold uppercase tracking-wider text-gray-600">ข้อมูลติดต่อ<span class="text-red-500 ml-1">*</span></h3>
        <div class="space-y-3">
          <input type="text" value="นวิยา อินทรประสิทธิ์" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 font-bold text-gray-500 text-[16px] outline-none" readonly />
          <input type="text" value="0800987465" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 font-bold text-gray-500 text-[16px] outline-none" readonly />
        </div>
      </div>

      <!-- Location -->
      <div class="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-200">
        <h3 class="text-sm font-bold uppercase tracking-wider text-gray-600 pb-2.5 border-b border-gray-200">สถานที่จัดส่ง<span class="text-red-500 ml-1">*</span></h3>

        <!-- Delivery Option -->
        <div class="space-y-4 pt-1">
          <label class="flex items-center gap-3 cursor-pointer group">
            <div class="w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all p-[2.5px]" :class="deliveryOption === 'delivery' ? 'border-[#228085]' : 'border-gray-300'">
              <div v-if="deliveryOption === 'delivery'" class="w-full h-full bg-[#228085] rounded-full border-2 border-white"></div>
            </div>
            <input type="radio" value="delivery" v-model="deliveryOption" class="hidden" />
            <span class="font-bold text-[17px] text-gray-800">บริการจัดส่ง</span>
          </label>

          <div v-if="deliveryOption === 'delivery'" class="pl-8 space-y-3.5 animate-slide-down">
            <input type="text" v-model="roomNumber" placeholder="กรอกเลขห้อง*" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 text-[15px] font-bold text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#228085] shadow-sm" />
            <input type="text" v-model="hnNumber" placeholder="กรอกเลข HN*" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 text-[15px] font-bold text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#228085] shadow-sm" />
            <label class="flex items-center gap-3 text-gray-700 font-bold cursor-pointer text-[15px] pt-1 select-none">
              <input type="checkbox" v-model="putInBox" class="w-5 h-5 rounded-lg border-2 border-gray-300 accent-[#228085]" />
              ใส่กล่อง
            </label>

            <!-- Room Service Timing -->
            <div v-if="branchType === 'Room Service'" class="pt-4 border-t border-gray-200 mt-1">
               <p class="text-[11px] text-[#228085] font-bold uppercase tracking-wider flex items-center gap-1.5">
                 📍 Room Service: จัดส่งถึงห้องเท่านั้น
               </p>
               
               <div class="space-y-3.5">
                 <label class="flex items-center gap-3 cursor-pointer group select-none">
                   <div class="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-all">
                     <div v-if="pickupTimeOption === 'now'" class="w-full h-full bg-[#228085] rounded-full scale-75"></div>
                   </div>
                   <input type="radio" value="now" v-model="pickupTimeOption" class="hidden" />
                   <span class="text-[14px] font-semibold">รับทันที</span>
                 </label>
                 <label class="flex items-center gap-3 cursor-pointer group select-none">
                   <div class="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-all">
                     <div v-if="pickupTimeOption === 'schedule'" class="w-full h-full bg-[#228085] rounded-full scale-75"></div>
                   </div>
                   <input type="radio" value="schedule" v-model="pickupTimeOption" class="hidden" />
                   <span class="text-[14px] font-semibold">ระบุเวลา <span class="text-xs text-gray-400 font-normal">(ขั้นต่ำ 2 ชม.)</span></span>
                 </label>
               </div>
            </div>
          </div>
        </div>

        <!-- Store Pickup Option -->
        <div v-if="branchType !== 'Room Service'" class="pt-1 border-t border-gray-200 mt-2">
          <label class="flex items-center gap-4 cursor-pointer group mt-4">
            <div class="w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all p-[2.5px]" :class="deliveryOption === 'store' ? 'border-[#228085]' : 'border-gray-300'">
              <div v-if="deliveryOption === 'store'" class="w-full h-full bg-[#228085] rounded-full border-2 border-white"></div>
            </div>
            <input type="radio" value="store" v-model="deliveryOption" class="hidden" />
            <span class="font-bold text-[17px] text-gray-800">รับที่ร้าน (Pickup)</span>
          </label>

          <div v-if="deliveryOption === 'store'" class="pl-8 pt-4 space-y-4 animate-slide-down">
             <!-- Required Selection -->
             <div class="flex gap-2.5">
                <button 
                  @click="pickupMode = 'dine-in'" 
                  :class="pickupMode === 'dine-in' ? 'bg-[#228085] text-white shadow-md' : 'bg-[#f0f4f4] text-gray-600 border border-gray-200'"
                  class="flex-1 py-3.5 rounded-2xl font-bold text-[15px] transition-all"
                >ทานที่ร้าน</button>
                <button 
                  @click="pickupMode = 'takeaway'" 
                  :class="pickupMode === 'takeaway' ? 'bg-[#228085] text-white shadow-md' : 'bg-[#f0f4f4] text-gray-600 border border-gray-200'"
                  class="flex-1 py-3.5 rounded-2xl font-bold text-[15px] transition-all"
                >รับกลับบ้าน</button>
             </div>

             <div class="space-y-4 pt-2">
               <label class="flex items-center gap-3.5 cursor-pointer group select-none">
                 <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-all">
                   <div v-if="pickupTimeOption === 'now'" class="w-full h-full bg-[#228085] rounded-full scale-75 border-2 border-white"></div>
                 </div>
                 <input type="radio" value="now" v-model="pickupTimeOption" class="hidden" />
                 <span class="text-[15px] font-bold text-gray-800">รับทันที</span>
               </label>
               <label class="flex items-center gap-3.5 cursor-pointer group select-none">
                 <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-all">
                   <div v-if="pickupTimeOption === 'schedule'" class="w-full h-full bg-[#228085] rounded-full scale-75 border-2 border-white"></div>
                 </div>
                 <input type="radio" value="schedule" v-model="pickupTimeOption" class="hidden" />
                 <span class="text-[15px] font-bold text-gray-800">ระบุเวลา <span class="text-xs text-gray-500 font-bold ml-1">(ขั้นต่ำ 2 ชม.)</span></span>
               </label>
             </div>
          </div>
        </div>

        <!-- Time Picker Display -->
        <div v-if="pickupTimeOption === 'schedule'" class="mt-3 bg-white border border-gray-50 rounded-3xl overflow-hidden shadow-xl shadow-teal-900/5 animate-fade-in mx-1">
          <div class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors" @click="showPicker = !showPicker">
            <span class="text-[16px] font-bold text-gray-800 tracking-tight">{{ pickerDisplayTime }}</span>
            <svg class="w-5 h-5 text-[#228085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>

          <div v-if="showPicker" class="p-6 bg-gray-50/30 border-t border-gray-50">
            <div class="flex items-center justify-center gap-8">
              <div class="flex flex-col items-center gap-1">
                <button @click="incHour" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
                </button>
                <span class="text-5xl font-bold text-gray-800 w-16 text-center tabular-nums">{{ pickerHour }}</span>
                <button @click="decHour" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>

              <span class="text-5xl font-medium text-gray-200 pb-3 leading-none">:</span>

              <div class="flex flex-col items-center gap-1">
                <button @click="incMin" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
                </button>
                <span class="text-5xl font-bold text-gray-800 w-16 text-center tabular-nums">{{ pickerMinute.toString().padStart(2,'0') }}</span>
                <button @click="decMin" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>
            </div>

            <div class="flex mt-6 rounded-[20px] overflow-hidden border border-gray-100 bg-white p-1 shadow-inner">
              <button @click="toggleAmPm('AM')" :class="pickerAmPm === 'AM' ? 'bg-[#228085] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'" class="flex-1 py-3 text-sm font-semibold transition-all rounded-[16px]">AM</button>
              <button @click="toggleAmPm('PM')" :class="pickerAmPm === 'PM' ? 'bg-[#228085] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'" class="flex-1 py-3 text-sm font-semibold transition-all rounded-[16px]">PM</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Note -->
      <div class="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-200">
        <h3 class="text-sm font-bold uppercase tracking-wider text-gray-600">หมายเหตุการสั่ง</h3>
        <textarea v-model="orderNote" placeholder="เพิ่มคำแนะนำพิเศษ เช่น ไม่เผ็ด, เผ็ดน้อย..." class="w-full min-h-[100px] bg-[#f8fbff] border border-gray-200 rounded-2xl py-4 px-5 text-[15px] font-bold text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#228085] transition-all shadow-inner"></textarea>
      </div>

    <!-- Fixed Bottom Action (Standardized rounded-[24px]) -->
    <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-md border-t border-gray-200 p-6 pb-10 z-40 shadow-[0_-8px_30px_rgba(0,0,0,0.08)]">
      <button 
        @click="goNext" 
        :disabled="!canProceed"
        class="w-full py-5 rounded-[24px] bg-[#228085] text-white font-bold text-[18px] shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50 transition-all"
      >
        ดำเนินการสรุปรายการ
      </button>
    </div>
    </div>
  </div>
</template>

<style scoped>
.py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
.animate-slide-down { animation: slideDown 0.3s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDown { 
  from { opacity: 0; transform: translateY(-10px); } 
  to { opacity: 1; transform: translateY(0); } 
}
</style>
