<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAppointments } from '../composables/useAppointment'
import { timeToMinutes } from '@/helpers/dataHelpers'

const { getWeeklyAppointments, weeklyAppointments } = useAppointments()

const scrollContainer = ref<HTMLDivElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

function startDrag(e: MouseEvent) {
  if (!scrollContainer.value) return
  isDragging.value = true
  startX.value = e.pageX - scrollContainer.value.offsetLeft
  scrollLeft.value = scrollContainer.value.scrollLeft
}

function stopDrag() {
  isDragging.value = false
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value || !scrollContainer.value) return
  e.preventDefault()
  const x = e.pageX - scrollContainer.value.offsetLeft
  const walk = (x - startX.value) * 1 // scroll speed multiplier
  scrollContainer.value.scrollLeft = scrollLeft.value - walk
}

const days: string[] = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet']
const workDayStart = '09:00'
const workDayEnd = '19:00'
const pxPerMinute = 1

const monthsHr = [
  'siječnja',
  'veljače',
  'ožujka',
  'travnja',
  'svibnja',
  'lipnja',
  'srpnja',
  'kolovoza',
  'rujna',
  'listopada',
  'studenoga',
  'prosinca',
]

function getMonday(date: Date): Date {
  const day = date.getDay() || 7
  const monday = new Date(date)
  monday.setDate(date.getDate() - day + 1)
  return monday
}

function formatWeek(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  startDate.value = new Date(monday)
  endDate.value = sunday
  if (monday.getMonth() === sunday.getMonth()) {
    return `${monday.getDate()}. - ${sunday.getDate()}. ${monthsHr[monday.getMonth()]}`
  } else {
    return `${monday.getDate()}. ${monthsHr[monday.getMonth()]} - ${sunday.getDate()}. ${monthsHr[sunday.getMonth()]}`
  }
}

// === STATE ===
const weekRange = ref<string>('')
const startDate = ref<Date>()
const endDate = ref<Date>()
const currentMonday = ref<Date>(getMonday(new Date()))
let timeout: ReturnType<typeof setTimeout> | null = null

function updateWeekString() {
  weekRange.value = formatWeek(currentMonday.value)
}
function nextWeek() {
  currentMonday.value.setDate(currentMonday.value.getDate() + 7)
  updateWeekString()
  if (timeout) clearTimeout(timeout)
  if (startDate.value && endDate.value) {
    timeout = setTimeout(() => getWeeklyAppointments(startDate.value!, endDate.value!), 300)
  }
}
function prevWeek() {
  currentMonday.value.setDate(currentMonday.value.getDate() - 7)
  updateWeekString()
  if (timeout) clearTimeout(timeout)
  timeout = setTimeout(() => getWeeklyAppointments(startDate.value!, endDate.value!), 300)
}

function buildBlocksForDay(day: string) {
  const dayIndex = days.indexOf(day) + 1 // Mon=1 ... Fri=5 in JS getDay()
  const dayAppointments = weeklyAppointments.value
    .filter((app) => new Date(app.date).getDay() === dayIndex)
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

  const blocks: { startTime: string; endTime: string; color: string; width: number }[] = []
  let currentTime = workDayStart

  for (const app of dayAppointments) {
    // Free block before appointment
    if (timeToMinutes(app.startTime) > timeToMinutes(currentTime)) {
      const dur = timeToMinutes(app.startTime) - timeToMinutes(currentTime)
      blocks.push({
        startTime: currentTime,
        endTime: app.startTime,
        color: '#89EB7C',
        width: dur * pxPerMinute,
      })
    }
    // Appointment block
    const appDur = timeToMinutes(app.endTime) - timeToMinutes(app.startTime)
    blocks.push({
      startTime: app.startTime,
      endTime: app.endTime,
      color: '#F54242',
      width: appDur * pxPerMinute,
    })
    currentTime = app.endTime
  }

  // Free block after last appointment
  if (timeToMinutes(currentTime) < timeToMinutes(workDayEnd)) {
    const dur = timeToMinutes(workDayEnd) - timeToMinutes(currentTime)
    blocks.push({
      startTime: currentTime,
      endTime: workDayEnd,
      color: '#89EB7C',
      width: dur * pxPerMinute,
    })
  }
  return blocks
}

const weekBlocks = computed(() => {
  const table: Record<string, ReturnType<typeof buildBlocksForDay>> = {}
  days.forEach((day) => {
    table[day] = buildBlocksForDay(day)
  })
  return table
})

// === INIT ===
updateWeekString()
getWeeklyAppointments(startDate.value!, endDate.value!)
</script>

<template>
  <div class="flex flex-col gap-2 pt-4 sm:pt-2">
    <div class="border-t-[1px] border-b-[1px] p-2 border-[#C7C7C7] flex justify-between">
      <button @click="prevWeek()" class="cursor-pointer">
        <img src="../assets/left.png" alt="Previous week button" />
      </button>
      <h3 class="text-black text-lg font-['Inter', 'sans-serif'] font-medium">
        {{ weekRange }}
      </h3>
      <button @click="nextWeek()" class="cursor-pointer">
        <img src="../assets/right.png" alt="Next week button" />
      </button>
    </div>

    <div class="flex py-4 sm:py-2">
      <div class="flex flex-col w-16 h-full border-b border-[#B0B0B0]">
        <div class="h-8"></div>
        <div
          v-for="day in days"
          :key="day"
          class="flex items-center justify-center h-22 border-t border-r border-[#B0B0B0] font-semibold text-[#484848]"
        >
          {{ day }}
        </div>
      </div>

      <div
        ref="scrollContainer"
        class="overflow-x-scroll scrollbar-hide cursor-grab active:cursor-grabbing select-none flex-1"
        @mousedown="startDrag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
        @mousemove="onDrag"
      >
        <div class="flex flex-col border-b border-[#B0B0B0] min-w-max">
          <div class="flex h-full w-fit max-w-[600px]">
            <div class="flex">
              <div
                v-for="hour in Array.from({ length: 11 }, (_, i) => i + 9)"
                :key="hour"
                class="relative w-[60px] text-center text-[#282828] font-medium h-8 after:content-[''] after:absolute after:top-[24px] after:left-[25px] after:border-[4px] after:border-transparent after:border-t-[#282828]"
              >
                {{ hour.toString().padStart(2, '0') }}:00
              </div>
            </div>
          </div>

          <div
            v-for="day in days"
            :key="day"
            class="flex h-full border-t border-[#B0B0B0] w-[660px] max-h-22 py-1"
          >
            <div class="flex gap-1 max-h-22 h-full !ml-[30px] w-[600px]">
              <div
                v-for="(block, idx) in weekBlocks[day]"
                :key="idx"
                :style="{ width: block.width + 'px', backgroundColor: block.color }"
                class="relative h-20 flex items-center justify-center rounded group"
              >
                <div
                  v-if="block.color === '#F54242'"
                  class="absolute -top-6 z-50 text-xs flex flex-col items-center justify-center bg-white text-gray-800 px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                >
                  <p>{{ block.startTime }}</p>
                  <p>-</p>
                  <p>{{ block.endTime }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
