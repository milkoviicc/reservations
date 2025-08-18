<script setup lang="ts">
import AllAppointments from '@/components/AllAppointments.vue'
import CreateAppointment from '@/components/CreateAppointments.vue'
import ScrollableContainer from '@/components/ScrollableContainer.vue'
import UpdateAppointments from '@/components/UpdateAppointments.vue'
import WeeklyAppointments from '@/components/WeeklyAppointments.vue'
import { useAppointments } from '@/composables/useAppointment'
import { useModal } from '@/composables/useModal'
import {
  allAppointmentsRef,
  createAppointmentRef,
  updateAppointmentRef,
  allAppointmentsOpened,
  createAppointmentOpened,
  toggleAllAppointmentsView,
  updateAppointmentOpened,
  toggleCreateAppointmentView,
} from '@/helpers/appointmentsRefHelper'
import { getFormattedDateParts, timeToMinutes } from '@/helpers/dataHelpers'
import { computed, onMounted, ref } from 'vue'

const { getDailyAppointments, dailyAppointments, brojMusterija } = useAppointments()
const date = ref(new Date())
const selectedColor = ref('red')
const formattedDay = ref<number>(0)
const formattedMonth = ref('')
const formattedWeekday = ref('')

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const handleDateChange = async (newDate: Date) => {
  date.value = newDate
  const { day, month, weekday } = getFormattedDateParts(newDate)

  formattedDay.value = day
  formattedMonth.value = month
  formattedWeekday.value = weekday

  if (currentDisplay.value === 'dan') {
    await getDailyAppointments(newDate)
    if (allAppointmentsOpened.value) {
      allAppointmentsOpened.value = !allAppointmentsOpened.value
    }
  }
}

const allAppointmentsDateData = computed(() => ({
  date: date.value,
  day: formattedDay.value,
  month: formattedMonth.value,
  weekday: formattedWeekday.value,
}))

const currentDisplay = ref('dan')
const changeCalendarDisplay = (display: string) => {
  currentDisplay.value = display
}

///////////

const pxPerMinute = 1
const workDayStart = '09:00'
const workDayEnd = '20:00'

// compute total width of the workday (in px)
const workDayTotalWidthPx = computed(() => {
  return (timeToMinutes(workDayEnd) - timeToMinutes(workDayStart)) * pxPerMinute
})

const hourTicks = computed(() => {
  const startH = Number(workDayStart.split(':')[0])
  const hoursCount = Math.floor((timeToMinutes(workDayEnd) - timeToMinutes(workDayStart)) / 60)
  return Array.from({ length: hoursCount }, (_, i) => startH + i)
})

function buildBlocksForAppointments(appointments: { startTime: string; endTime: string }[]) {
  const sorted = (appointments || [])
    .slice()
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

  const blocks: { startTime: string; endTime: string; color: string; width: number }[] = []
  let currentTime = workDayStart

  for (const app of sorted) {
    const startMin = timeToMinutes(app.startTime)
    const endMin = timeToMinutes(app.endTime)
    const currentMin = timeToMinutes(currentTime)

    if (startMin > currentMin) {
      const dur = startMin - currentMin
      blocks.push({
        startTime: currentTime,
        endTime: app.startTime,
        color: '#89EB7C',
        width: dur * pxPerMinute,
      })
    }

    const durApp = Math.max(0, endMin - startMin)
    if (durApp > 0) {
      blocks.push({
        startTime: app.startTime,
        endTime: app.endTime,
        color: '#F54242',
        width: durApp * pxPerMinute,
      })
    }

    currentTime = app.endTime
  }

  const currMin = timeToMinutes(currentTime)
  const workEndMin = timeToMinutes(workDayEnd)
  if (currMin < workEndMin) {
    const dur = workEndMin - currMin
    blocks.push({
      startTime: currentTime,
      endTime: workDayEnd,
      color: '#89EB7C',
      width: dur * pxPerMinute,
    })
  }

  return blocks
}

// computed blocks for the selected day (expects dailyAppointments.value to already contain only that day's appts)
const dailyBlocks = computed(() => buildBlocksForAppointments(dailyAppointments.value || []))

const { modalStack } = useModal()

window.addEventListener('popstate', () => {
  const lastModal = modalStack.pop()

  if (!lastModal) return // no modals, let browser handle back

  // Close the last opened modal
  if (lastModal === 'all') allAppointmentsOpened.value = false
  if (lastModal === 'create') createAppointmentOpened.value = false
  if (lastModal === 'update') updateAppointmentOpened.value = false
})
</script>

<template>
  <main class="h-[100dvh] overflow-hidden flex items-center">
    <div
      class="h-[100dvh] w-full sm:h-fit bg-white max-w-[640px] sm:w-fit sm:max-w-full flex flex-col items-center justify-between"
    >
      <div class="bg-white rounded-md w-full h-fit max-w-[640px] sm:w-fit sm:max-w-full">
        <div class="flex gap-2 py-4 text-black justify-center">
          <button
            @click="changeCalendarDisplay('dan')"
            class="cursor-pointer text-lg text-[#7F7F7F]"
            :class="{
              'underline underline-offset-4 font-semibold text-black': currentDisplay === 'dan',
            }"
          >
            Dan
          </button>
          <h1 class="text-xl text-[#7F7F7F]">|</h1>
          <button
            @click="changeCalendarDisplay('tjedan')"
            class="cursor-pointer text-lg text-[#7F7F7F]"
            :class="{
              'underline underline-offset-4 font-semibold text-black': currentDisplay === 'tjedan',
            }"
          >
            Tjedan
          </button>
        </div>

        <VDatePicker
          v-model="date"
          mode="date"
          locale="hr"
          :masks="{ weekdays: 'WWW', title: 'MMMM' }"
          :color="selectedColor"
          class="flex flex-col h-fit pt-3 min-w-full max-w-[640px] sm:w-auto homeViewCalendar"
          @update:model-value="handleDateChange"
          disable-page-swipe
          v-if="currentDisplay === 'dan'"
        >
          <template #header-prev-button>
            <img src="../assets/left.png" alt="Previous month" />
          </template>

          <template #header-next-button>
            <img src="../assets/right.png" alt="Next month" />
          </template>

          <template #footer>
            <div class="w-full h-full flex flex-col justify-between max-h-[350px]">
              <div class="w-full h-fit border-t flex flex-col border-[rgba(0,0,0,0.2)]">
                <div class="w-full h-full flex flex-col justify-between">
                  <div class="w-full h-fit flex flex-col px-4 pt-4 box-border">
                    <h3 class="text-[#484848] text-3xl font-bold leading-6">
                      {{ formattedDay }}. {{ formattedMonth }}
                    </h3>
                    <h4 class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</h4>
                  </div>
                  <div class="w-full flex justify-between pt-12 px-4 box-border">
                    <p class="text-[16px] font-medium text-[#484848]">
                      {{ brojMusterija }} mušterija
                    </p>
                    <button
                      class="underline cursor-pointer text-[16px] font-medium text-[#484848]"
                      @click="toggleAllAppointmentsView()"
                    >
                      Svi termini
                    </button>
                  </div>
                </div>

                <ScrollableContainer
                  :class="'border-[#C7C7C7] border-t-[1px] border-b-[1px] h-full w-full flex flex-col !mt-1'"
                >
                  <div class="flex items-center">
                    <div
                      :style="{ width: workDayTotalWidthPx + 'px' }"
                      class="flex h-fit items-center"
                    >
                      <div
                        v-for="h in hourTicks"
                        :key="h"
                        class="min-w-[60px] text-center text-[#282828] font-medium"
                      >
                        {{ h.toString().padStart(2, '0') }}:00
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center h-14">
                    <div
                      :style="{ width: workDayTotalWidthPx + 'px' }"
                      class="h-14 flex items-center py-1"
                    >
                      <div class="flex gap-1 w-full px-2">
                        <div
                          v-for="(block, idx) in dailyBlocks"
                          :key="idx"
                          :style="{ width: block.width + 'px', backgroundColor: block.color }"
                          class="relative h-12 flex items-center justify-center rounded group"
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
                </ScrollableContainer>
              </div>
            </div>
          </template>
        </VDatePicker>

        <div
          v-if="currentDisplay === 'tjedan'"
          class="w-full max-w-[640px] h-full sm:min-h-fit flex flex-col justify-between"
        >
          <WeeklyAppointments />
        </div>
      </div>
      <div class="flex h-fit w-full justify-center pb-4 sm:py-2">
        <button
          class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] relative cursor-pointer shadow-[0_5px_5px_0_rgba(0,0,0,0.25)]"
          @click="toggleCreateAppointmentView()"
        >
          <span
            class="absolute top-0 sm:-top-[3px] left-1/2 transform -translate-x-1/2 text-4xl font-normal"
          >
            +
          </span>
        </button>
      </div>

      <div
        ref="allAppointmentsRef"
        v-if="allAppointmentsOpened"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col bg-white z-10 pt-2 rounded-md h-full sm:h-fit sm:min-h-[650px] overflow-y-hidden"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <AllAppointments :data="allAppointmentsDateData" />
      </div>

      <div
        ref="createAppointmentRef"
        v-if="createAppointmentOpened"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-10 pt-2 rounded-md w-full sm:w-[670px] sm:h-fit h-full"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <CreateAppointment :updateAppointments="handleDateChange" />
      </div>
      <div
        ref="updateAppointmentRef"
        v-if="updateAppointmentOpened"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-10 rounded-md pt-2 w-full sm:w-[670px] h-full sm:h-fit"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <UpdateAppointments :updateAppointments="handleDateChange" />
      </div>
    </div>
  </main>
</template>

<style>
.vc-weekdays {
  text-transform: capitalize;
}

.vc-title-wrapper button {
  text-transform: uppercase;
}

.vc-header {
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vc-arrow,
.vc-title {
  background-color: transparent !important;
  color: #4d4d4d !important;
}

.vc-bordered {
  border-top: none !important;
}

.vc-container,
.vc-monthly,
.vc-pane-container,
.vc-pane-layout,
.vc-header,
.vc-pane-header-wrapper,
.vc-pane {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  font-family: 'Inter', sans-serif !important;
}

.vc-red {
  --vc-accent-600: #f54242 !important;
}
</style>
