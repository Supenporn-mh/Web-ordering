<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const branchType = ref(localStorage.getItem('selectedBranch') || 'Room Service')
const deliveryOption = ref(branchType.value === 'Room Service' ? 'delivery' : 'delivery') // delivery | store
const putInBox = ref(false)
const orderNote = ref('')

const getCurrentTimePlusTwoHours = () => {
  const now = new Date()
  now.setHours(now.getHours() + 2)
  return `${now.getHours().toString().padStart(2, '0')}:${(Math.ceil(now.getMinutes() / 30) * 30 % 60).toString().padStart(2, '0')}`
}

const pickupTimeOption = ref('now') // now | schedule
const scheduleTime = ref(branchType.value === 'Room Service' ? getCurrentTimePlusTwoHours() : '12:00')

const timeSlots = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2).toString().padStart(2, '0')
  const m = (i % 2 === 1 ? '30' : '00')
  return `${h}:${m}`
})

watch([putInBox], () => {
  let notes = []
  if (putInBox.value) notes.push('ใส่กล่อง')
  orderNote.value = notes.join(', ')
})

const setShortNote = (text: string) => {
  if (!orderNote.value.includes(text)) {
    orderNote.value = orderNote.value ? `${orderNote.value}, ${text}` : text
  }
}

const goNext = () => {
  localStorage.setItem('deliveryOption', deliveryOption.value)
  localStorage.setItem('putInBox', putInBox.value.toString())
  localStorage.setItem('orderNote', orderNote.value)
  localStorage.setItem('pickupTime', pickupTimeOption.value === 'now' ? 'ทันที' : scheduleTime.value)
  router.push({ name: 'cart' })
}
</script>

<template>
  <div class="min-h-screen bg-[#f4fafa] font-sans pb-32">
    <!-- Header (No separating border from background to match image) -->
    <div class="px-6 py-5 flex items-center sticky top-0 z-30 bg-[#f4fafa]">
      <button @click="router.back()" class="mr-4 text-xl text-gray-800">
         <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <h1 class="text-[17px] font-medium text-gray-900 leading-none mt-0.5">ข้อมูลที่อยู่จัดส่ง</h1>
    </div>

    <div class="p-5 space-y-5">
      <!-- Contact Info Card -->
      <div class="bg-white rounded-[1rem] p-5 shadow-sm space-y-4">
        <h3 class="text-base font-bold text-gray-900">ข้อมูลติดต่อ<span class="text-red-500">*</span></h3>
        <input type="text" value="นวิยา อินทรประสิทธิ์" class="w-full bg-white border border-gray-300 rounded-[0.6rem] py-3.5 px-4 font-medium text-gray-500 text-[15px] outline-none shadow-sm" />
        <input type="text" value="0800987465" class="w-full bg-white border border-gray-300 rounded-[0.6rem] py-3.5 px-4 font-medium text-gray-500 text-[15px] outline-none shadow-sm" />
      </div>

      <!-- Location Info Card -->
      <div class="bg-white rounded-[1rem] p-5 shadow-sm space-y-5">
        <h3 class="text-base font-bold text-gray-900 pb-1 border-b border-gray-100">สถานที่จัดส่ง<span class="text-red-500">*</span></h3>
        
        <!-- Delivery Option -->
        <div class="space-y-4 pt-1">
          <label class="flex items-center gap-3 cursor-pointer group">
            <div class="w-[22px] h-[22px] rounded-full border-[2.5px] flex items-center justify-center transition-all bg-white" :class="deliveryOption === 'delivery' ? 'border-[#228085]' : 'border-gray-300'">
               <div v-if="deliveryOption === 'delivery'" class="w-3 h-3 bg-[#228085] rounded-full"></div>
            </div>
            <input type="radio" value="delivery" v-model="deliveryOption" class="hidden" />
            <span class="font-medium text-[#2d3748] text-[15px]">บริการจัดส่ง</span>
          </label>
          
          <div v-if="deliveryOption === 'delivery'" class="pl-8 space-y-3">
            <input type="text" placeholder="กรอกเลขห้อง*" class="w-full bg-white border border-gray-300 rounded-[0.6rem] py-3.5 px-4 font-medium text-[15px] outline-none shadow-sm placeholder:text-gray-400" />
            <input type="text" placeholder="กรอกเลข HN*" class="w-full bg-white border border-gray-300 rounded-[0.6rem] py-3.5 px-4 font-medium text-[15px] outline-none shadow-sm placeholder:text-gray-400" />
            <label class="flex items-center gap-2 text-[#4a5568] font-medium cursor-pointer text-[15px] pt-1">
              <input type="checkbox" v-model="putInBox" class="w-[18px] h-[18px] border-gray-300 rounded-[0.2rem] text-[#228085] focus:ring-0 checked:bg-[#228085] accent-[#228085]" />
              ใส่กล่อง
            </label>
          </div>
        </div>

        <!-- Store Pickup Option (Hide if Room Service) -->
        <div v-if="branchType !== 'Room Service'" class="pt-1">
          <label class="flex items-center gap-3 cursor-pointer group">
            <div class="w-[22px] h-[22px] rounded-full border-[2.5px] flex items-center justify-center transition-all bg-white" :class="deliveryOption === 'store' ? 'border-[#228085]' : 'border-gray-300'">
               <div v-if="deliveryOption === 'store'" class="w-3 h-3 bg-[#228085] rounded-full"></div>
            </div>
            <input type="radio" value="store" v-model="deliveryOption" class="hidden" />
            <span class="font-medium text-[#2d3748] text-[15px]">รับที่ร้าน (Pickup)</span>
          </label>
          
          <!-- Pickup Time Options (Only for Store Pickup) -->
          <div v-if="deliveryOption === 'store'" class="pl-8 pt-4 space-y-4">
             <div class="flex flex-col gap-3">
                <label class="flex items-center gap-3 cursor-pointer">
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="pickupTimeOption === 'now' ? 'border-[#228085]' : 'border-gray-300'">
                    <div v-if="pickupTimeOption === 'now'" class="w-2.5 h-2.5 bg-[#228085] rounded-full"></div>
                  </div>
                  <input type="radio" value="now" v-model="pickupTimeOption" class="hidden" />
                  <span class="text-sm font-medium text-gray-700">รับทันที</span>
                </label>

                <div class="flex items-center justify-between">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all" :class="pickupTimeOption === 'schedule' ? 'border-[#228085]' : 'border-gray-300'">
                      <div v-if="pickupTimeOption === 'schedule'" class="w-2.5 h-2.5 bg-[#228085] rounded-full"></div>
                    </div>
                    <input type="radio" value="schedule" v-model="pickupTimeOption" class="hidden" />
                    <span class="text-sm font-medium text-gray-700">ระบุเวลา</span>
                  </label>
                  
                  <select v-if="pickupTimeOption === 'schedule'" v-model="scheduleTime" class="bg-gray-50 border border-gray-200 rounded-lg py-1.5 px-3 text-sm outline-none focus:border-[#228085]">
                    <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
             </div>
          </div>
        </div>

        <!-- Room Service Specific Tip/Notice -->
        <div v-if="branchType === 'Room Service'" class="mt-4 p-4 bg-[#f0f9f9] rounded-xl border border-teal-50">
           <p class="text-[12px] text-[#228085] font-medium leading-relaxed">
             📍 <span class="font-bold">Room Service:</span> จัดส่งถึงห้องพักเท่านั้น 
             <br/>
             ⏰ ระยะเวลาจัดส่งขั้นต่ำ 2 ชั่วโมง (ระบุเวลาด้านล่าง)
           </p>
           <div class="mt-3 flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
             <span class="text-sm font-bold text-gray-700">ระบุเวลาจัดส่ง</span>
             <select v-model="scheduleTime" class="bg-gray-50 border border-gray-200 rounded-lg py-1 px-2 text-sm outline-none">
                <option v-for="t in timeSlots" :key="t" :value="t">{{ t }}</option>
             </select>
           </div>
        </div>
      </div>

      <!-- Note Card -->
      <div class="bg-white rounded-[1rem] p-5 shadow-sm space-y-4">
        <h3 class="text-base font-bold text-gray-900">หมายเหตุการสั่ง</h3>
        
        <!-- Short-cut Buttons (Only for Store Pickup) -->
        <div v-if="deliveryOption === 'store'" class="flex gap-3 mb-2">
          <button 
            @click="setShortNote('ทานที่ร้าน')"
            class="flex-1 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-gray-500 font-bold text-sm hover:border-[#228085] hover:text-[#228085] active:bg-[#228085] active:text-white transition-all outline-none"
          >ทานที่ร้าน</button>
          <button 
            @click="setShortNote('รับกลับบ้าน')"
            class="flex-1 py-2.5 rounded-xl border-[1.5px] border-gray-200 text-gray-500 font-bold text-sm hover:border-[#228085] hover:text-[#228085] active:bg-[#228085] active:text-white transition-all outline-none"
          >รับกลับบ้าน</button>
        </div>

        <textarea v-model="orderNote" placeholder="เพิ่มคำแนะนำพิเศษ..." class="w-full min-h-[90px] bg-white border border-gray-300 rounded-[0.6rem] py-3.5 px-4 font-medium text-gray-600 outline-none shadow-sm text-[15px] placeholder:text-gray-400"></textarea>
      </div>

      <!-- Action -->
      <div class="pt-4">
        <button @click="goNext" class="w-full py-4 rounded-[0.8rem] bg-[#228085] text-white font-medium text-lg shadow-sm active:scale-[0.98] transition-all">
          ถัดไป
        </button>
      </div>
    </div>
  </div>
</template>
