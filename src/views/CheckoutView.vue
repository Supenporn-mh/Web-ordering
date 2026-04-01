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

const pickupTimeOption = ref('now')
const scheduleTime = ref('')

const contactName = ref('นวิยา อินทรประสิทธิ์')
const contactPhone = ref('0800987465')

const handlePhoneInput = (e: any) => {
  const val = e.target.value.replace(/\D/g, '') // Only numbers
  if (val.length > 10) contactPhone.value = val.slice(0, 10)
  else contactPhone.value = val
}



const getMinAvailableMinutes = () => {
  const now = new Date()
  return (now.getHours() + 2) * 60 + now.getMinutes()
}

const getPickerMinutes = () => {
  let h = pickerHour.value
  if (pickerAmPm.value === 'PM' && h !== 12) h += 12
  if (pickerAmPm.value === 'AM' && h === 12) h = 0
  return h * 60 + pickerMinute.value
}

const validateAndUpdateTime = () => {
  const minDate = new Date()
  minDate.setHours(minDate.getHours() + 2)
  const minMin = minDate.getHours() * 60 + minDate.getMinutes()
  const currentMin = getPickerMinutes()
  
  if (currentMin < minMin || currentMin > minMin + 1440) { // Simple check, handling midnight naive
    const h24 = minDate.getHours()
    pickerAmPm.value = h24 >= 12 ? 'PM' : 'AM'
    pickerHour.value = h24 % 12 || 12
    pickerMinute.value = minDate.getMinutes()
  }
  updateScheduleFromPicker()
}

// --- Custom Time Picker ---
const pickerHour = ref(6)
const pickerMinute = ref(0)
const pickerAmPm = ref('PM')
const showPicker = ref(false)

const initPickerFromSchedule = () => {
  if (!scheduleTime.value) {
    const minDate = new Date()
    minDate.setHours(minDate.getHours() + 2)
    const h24 = minDate.getHours()
    pickerAmPm.value = h24 >= 12 ? 'PM' : 'AM'
    pickerHour.value = h24 % 12 || 12
    pickerMinute.value = minDate.getMinutes()
    updateScheduleFromPicker()
    return
  }
  const parts = scheduleTime.value.split(':')
  if (parts.length === 2 && !isNaN(Number(parts[0])) && !isNaN(Number(parts[1]))) {
    const [h24, m] = parts.map(Number)
    pickerAmPm.value = h24 >= 12 ? 'PM' : 'AM'
    pickerHour.value = h24 % 12 || 12
    pickerMinute.value = m
  }
}

const updateScheduleFromPicker = () => {
  let h = pickerHour.value
  if (pickerAmPm.value === 'PM' && h !== 12) h += 12
  if (pickerAmPm.value === 'AM' && h === 12) h = 0
  scheduleTime.value = `${h.toString().padStart(2, '0')}:${pickerMinute.value.toString().padStart(2, '0')}`
}

const incHour = () => { pickerHour.value = (pickerHour.value % 12) + 1; updateScheduleFromPicker() }
const decHour = () => { 
  const oldH = pickerHour.value
  pickerHour.value = ((pickerHour.value - 2 + 12) % 12) + 1
  if (getPickerMinutes() < getMinAvailableMinutes()) pickerHour.value = oldH
  updateScheduleFromPicker() 
}
const incMin = () => { pickerMinute.value = (pickerMinute.value + 1) % 60; updateScheduleFromPicker() }
const decMin = () => { 
  const oldM = pickerMinute.value
  pickerMinute.value = (pickerMinute.value - 1 + 60) % 60
  if (getPickerMinutes() < getMinAvailableMinutes()) pickerMinute.value = oldM
  updateScheduleFromPicker() 
}
const toggleAmPm = (val: string) => { 
  const oldAP = pickerAmPm.value
  pickerAmPm.value = val
  if (getPickerMinutes() < getMinAvailableMinutes()) pickerAmPm.value = oldAP
  updateScheduleFromPicker() 
}

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

watch(deliveryOption, (val) => {
  // If user switches to Delivery and it's not Room Service (which supports scheduling)
  if (val === 'delivery' && branchType.value !== 'Room Service') {
    pickupTimeOption.value = 'now'
    pickupMode.value = '' // Clear pickup mode as well
  }
})

onMounted(() => {
  // Load profile data but allow Override
  const userDataStr = localStorage.getItem('userData')
  if (userDataStr) {
    const userData = JSON.parse(userDataStr)
    contactName.value = `${userData.firstName} ${userData.lastName}`
    contactPhone.value = userData.phone
  }

  const savedPickupTime = localStorage.getItem('pickupTime')
  if (savedPickupTime && savedPickupTime !== 'ทันที') {
    scheduleTime.value = savedPickupTime
    pickupTimeOption.value = 'schedule'
  }
  
  initPickerFromSchedule()
  validateAndUpdateTime()
  
  // Restore from localStorage if exists
  const savedDelivery = localStorage.getItem('deliveryOption')
  if (savedDelivery) deliveryOption.value = savedDelivery
  
  roomNumber.value = localStorage.getItem('roomNumber') || ''
  hnNumber.value = localStorage.getItem('hnNumber') || ''
  orderNote.value = localStorage.getItem('orderNote') || ''
  pickupMode.value = localStorage.getItem('pickupMode') || ''
  
  const savedPutInBox = localStorage.getItem('putInBox')
  if (savedPutInBox) putInBox.value = savedPutInBox === 'true'

  const savedName = localStorage.getItem('contactName')
  if (savedName) contactName.value = savedName
  const savedPhone = localStorage.getItem('contactPhone')
  if (savedPhone) contactPhone.value = savedPhone
})
// --- End Time Picker ---

const canProceed = computed(() => {
  if (deliveryOption.value === 'store' && !pickupMode.value) return false
  if (deliveryOption.value === 'delivery' && (!roomNumber.value || !hnNumber.value)) return false
  if (!contactName.value || !contactPhone.value) return false
  
  // Final time check
  if (pickupTimeOption.value === 'schedule') {
    if (getPickerMinutes() < getMinAvailableMinutes()) return false
  }
  
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
  localStorage.setItem('contactName', contactName.value)
  localStorage.setItem('contactPhone', contactPhone.value)
  localStorage.setItem('pickupTime', pickupTimeOption.value === 'now' ? 'ทันที' : scheduleTime.value)
  router.push({ name: 'cart' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f4fafa] font-sans pb-28">
    <!-- Header -->
    <div class="px-5 py-3 flex items-center bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm shadow-teal-900/5">
      <button @click="router.back()" class="text-gray-900 absolute left-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <h1 class="text-[18px] font-medium text-gray-800 mx-auto tracking-tight">ข้อมูลที่อยู่จัดส่ง</h1>
    </div>

    <div class="px-4 pt-6 pb-10 space-y-4 text-[#2d3748]">
      <!-- Contact Info -->
      <div class="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-200">
        <h3 class="text-sm font-medium uppercase tracking-wider text-gray-600">ข้อมูลติดต่อ<span class="text-red-500 ml-1">*</span></h3>
        <div class="space-y-3">
          <input type="text" v-model="contactName" placeholder="ชื่อ-นามสกุล" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 font-semibold text-gray-700 text-[16px] outline-none focus:border-[#228085] transition-all" />
          <input type="tel" maxlength="10" v-model="contactPhone" @input="handlePhoneInput" placeholder="เบอร์โทรศัพท์" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 font-semibold text-gray-700 text-[16px] outline-none focus:border-[#228085] transition-all" />
        </div>
      </div>

      <!-- Delivery Info (Location) -->
      <div class="bg-white rounded-3xl p-5 shadow-sm space-y-4 border border-gray-200 animate-slide-up">
        <h3 class="text-sm font-medium uppercase tracking-wider text-gray-600">สถานที่จัดส่ง <span class="text-red-500 ml-1">*</span></h3>
        
        <!-- Delivery Selection -->
        <div class="space-y-4">
          <label class="flex items-center gap-4 cursor-pointer group">
            <div class="w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all p-[2.5px]" :class="deliveryOption === 'delivery' ? 'border-[#228085]' : 'border-gray-300'">
              <div v-if="deliveryOption === 'delivery'" class="w-full h-full bg-[#228085] rounded-full border-2 border-white"></div>
            </div>
            <input type="radio" value="delivery" v-model="deliveryOption" class="hidden" />
            <span class="font-medium text-[17px] text-gray-800">บริการจัดส่ง</span>
          </label>

          <div v-if="deliveryOption === 'delivery'" class="pl-8 space-y-3.5 animate-slide-down">
            <input type="text" v-model="roomNumber" placeholder="กรอกเลขห้อง*" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 text-[15px] font-semibold text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#228085] shadow-sm" />
            <input type="text" v-model="hnNumber" placeholder="กรอกเลข HN*" class="w-full bg-[#f8fbff] border border-gray-200 rounded-2xl py-3.5 px-5 text-[15px] font-semibold text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#228085] shadow-sm" />
            
            <label class="flex items-center gap-3 text-gray-700 font-medium cursor-pointer text-[15px] pt-1 select-none">
              <input type="checkbox" v-model="putInBox" class="w-5 h-5 rounded-lg border-2 border-gray-300 accent-[#228085]" />
              ใส่กล่อง
            </label>

            <!-- Room Service Timing -->
            <div v-if="branchType === 'Room Service'" class="pt-4 border-t border-gray-200 mt-1">
               <p class="text-[11px] text-[#228085] font-medium uppercase tracking-wider flex items-center gap-1.5 mb-3">
                 📍 Room Service: จัดส่งถึงห้องเท่านั้น
               </p>
               
               <div class="space-y-3.5">
                 <label class="flex items-center gap-3 cursor-pointer group select-none">
                   <div class="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-all">
                     <div v-if="pickupTimeOption === 'now'" class="w-full h-full bg-[#228085] rounded-full scale-75"></div>
                   </div>
                   <input type="radio" value="now" v-model="pickupTimeOption" class="hidden" />
                   <span class="text-[14px] font-medium">รับทันที</span>
                 </label>
                 <label class="flex items-center gap-3 cursor-pointer group select-none">
                   <div class="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-gray-200 transition-all">
                     <div v-if="pickupTimeOption === 'schedule'" class="w-full h-full bg-[#228085] rounded-full scale-75"></div>
                   </div>
                   <input type="radio" value="schedule" v-model="pickupTimeOption" class="hidden" />
                   <span class="text-[14px] font-medium">ระบุเวลา <span class="text-xs text-gray-400 font-normal">(ขั้นต่ำ 2 ชม.)</span></span>
                 </label>
               </div>
            </div>
          </div>
        </div>

        <!-- Store Pickup Option -->
        <div v-if="branchType !== 'Room Service'" class="pt-1 mt-2">
          <label class="flex items-center gap-4 cursor-pointer group mt-4">
            <div class="w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center transition-all p-[2.5px]" :class="deliveryOption === 'store' ? 'border-[#228085]' : 'border-gray-300'">
              <div v-if="deliveryOption === 'store'" class="w-full h-full bg-[#228085] rounded-full border-2 border-white"></div>
            </div>
            <input type="radio" value="store" v-model="deliveryOption" class="hidden" />
            <span class="font-medium text-[17px] text-gray-800">รับที่ร้าน (Pickup)</span>
          </label>

          <div v-if="deliveryOption === 'store'" class="pl-8 pt-4 space-y-4 animate-slide-down">
             <!-- Required Selection -->
             <div class="flex gap-2.5">
                <button 
                  @click="pickupMode = 'dine-in'" 
                  :class="pickupMode === 'dine-in' ? 'bg-[#228085] text-white shadow-md' : 'bg-[#f0f4f4] text-gray-600 border border-gray-200'"
                  class="flex-1 py-3.5 rounded-2xl font-semibold text-[15px] transition-all"
                >ทานที่ร้าน</button>
                <button 
                  @click="pickupMode = 'takeaway'" 
                  :class="pickupMode === 'takeaway' ? 'bg-[#228085] text-white shadow-md' : 'bg-[#f0f4f4] text-gray-600 border border-gray-200'"
                  class="flex-1 py-3.5 rounded-2xl font-semibold text-[15px] transition-all"
                >รับกลับบ้าน</button>
             </div>

             <div class="space-y-4 pt-2">
               <label class="flex items-center gap-3.5 cursor-pointer group select-none">
                 <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-all">
                   <div v-if="pickupTimeOption === 'now'" class="w-full h-full bg-[#228085] rounded-full scale-75 border-2 border-white"></div>
                 </div>
                 <input type="radio" value="now" v-model="pickupTimeOption" class="hidden" />
                 <span class="text-[15px] font-medium text-gray-800">รับทันที</span>
               </label>
               <label class="flex items-center gap-3.5 cursor-pointer group select-none">
                 <div class="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-gray-200 group-hover:bg-gray-300 transition-all">
                   <div v-if="pickupTimeOption === 'schedule'" class="w-full h-full bg-[#228085] rounded-full scale-75 border-2 border-white"></div>
                 </div>
                 <input type="radio" value="schedule" v-model="pickupTimeOption" class="hidden" />
                 <span class="text-[15px] font-medium text-gray-800">ระบุเวลา <span class="text-xs text-gray-500 font-medium ml-1">(ขั้นต่ำ 2 ชม.)</span></span>
               </label>
             </div>
          </div>
        </div>

        <!-- Time Picker (Schedule) -->
        <div v-if="pickupTimeOption === 'schedule'" class="mt-3 bg-white border border-gray-50 rounded-3xl overflow-hidden shadow-xl shadow-teal-900/5 animate-fade-in mx-1">
          <div class="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors" @click="showPicker = !showPicker">
            <span class="text-[16px] font-semibold text-gray-800 tracking-tight">{{ pickerDisplayTime }}</span>
            <svg class="w-5 h-5 text-[#228085]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>

          <div v-if="showPicker" class="p-6 bg-gray-50/30 border-t border-gray-50">
            <div class="flex items-center justify-center gap-8">
              <div class="flex flex-col items-center gap-1">
                <button @click="incHour" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
                </button>
                <span class="text-5xl font-semibold text-gray-800 w-16 text-center tabular-nums">{{ pickerHour }}</span>
                <button @click="decHour" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"/></svg>
                </button>
              </div>

              <span class="text-5xl font-medium text-gray-200 pb-3 leading-none">:</span>

              <div class="flex flex-col items-center gap-1">
                <button @click="incMin" class="w-10 h-10 flex items-center justify-center rounded-xl text-gray-300 hover:text-[#228085] active:scale-90 transition-all">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
                </button>
                <span class="text-5xl font-semibold text-gray-800 w-16 text-center tabular-nums">{{ pickerMinute.toString().padStart(2,'0') }}</span>
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
        <h3 class="text-sm font-medium uppercase tracking-wider text-gray-600">ระบุหมายเหตุ</h3>
        <textarea v-model="orderNote" placeholder="เช่น รายละเอียดที่อยู่เพิ่มเติม หรือความต้องการอื่นๆ..." class="w-full bg-[#f8fbff] rounded-2xl p-4 border border-gray-100 outline-none focus:ring-2 focus:ring-[#228085]/20 font-medium text-[16px] text-gray-900 placeholder:text-gray-400 h-28 resize-none transition-all"></textarea>
      </div>

      <!-- Fixed Bottom Action -->
      <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-white/95 backdrop-blur-md border-t border-gray-200 p-6 pb-10 z-[60] shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
        <button 
          @click="goNext" 
          :disabled="!canProceed"
          class="w-full py-5 rounded-[22px] bg-[#228085] text-white font-semibold text-[18px] shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50 transition-all font-semibold"
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
