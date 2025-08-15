<script setup lang="ts">
import AllAppointments from '@/components/AllAppointments.vue'
import CreateAppointment from '@/components/CreateAppointments.vue'
import ScrollableContainer from '@/components/ScrollableContainer.vue'
import UpdateAppointments from '@/components/UpdateAppointments.vue'
import WeeklyAppointments from '@/components/WeeklyAppointments.vue'
import { useAppointments } from '@/composables/useAppointment'
import {
  allAppointmentsRef,
  createAppointmentRef,
  updateAppointmentRef,
  allAppointmentsOpened,
  createAppointmentOpened,
  toggleAllAppointmentsView,
  togleCreateAppointmentView,
  updateAppointmentOpened,
} from '@/helpers/appointmentsRefHelper'
import { getAppointment, getFormattedDateParts, hours } from '@/helpers/dataHelpers'
import { getHourStyle } from '@/helpers/uiHelpers'
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

const hoveredHour = ref<number | null>(null)

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
</script>

<template>
  <main class="h-[100dvh] overflow-hidden">
    <div class="h-full max-w-[640px] sm:w-fit sm:max-w-full flex items-center">
      <div class="bg-white rounded-md w-full h-full sm:h-fit max-w-[640px] sm:w-fit sm:max-w-full">
        <div class="flex gap-2 pt-16 pb-4 sm:py-4 text-black justify-center">
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
          class="flex flex-col h-full min-h-full sm:min-h-fit pt-3 min-w-full max-w-[640px] sm:w-auto homeViewCalendar"
          @update:model-value="handleDateChange"
          disable-page-swipe
          v-if="currentDisplay === 'dan'"
        >
          <template #footer>
            <div class="w-full h-full flex flex-col justify-between relative box-border">
              <div class="w-full h-full border-t flex flex-col border-[rgba(0,0,0,0.2)] box-border">
                <div class="w-full h-fit flex flex-col px-4 box-border">
                  <h3 class="text-[#484848] text-xl font-bold">
                    {{ formattedDay }}. {{ formattedMonth }}
                  </h3>
                  <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
                </div>

                <div class="w-full flex justify-between pt-4 px-4 box-border">
                  <p class="text-[#484848]">{{ brojMusterija }} mušterija</p>
                  <button class="underline cursor-pointer" @click="toggleAllAppointmentsView">
                    Svi termini
                  </button>
                </div>
                <ScrollableContainer :class="'border-[#C7C7C7] border-t-[1px] border-b-[1px]'">
                  <div
                    class="w-full px-[1px] py-1 text-center text-sm font-medium flex gap-[3px] items-center"
                  >
                    <div
                      v-for="hour in hours"
                      :key="hour"
                      class="w-full h-full rounded mt-2 relative group flex flex-col gap-[1px]"
                      @mouseenter="hoveredHour = hour"
                      @mouseleave="hoveredHour = null"
                    >
                      <p>{{ hour.toString().padStart(2, '0') }}:00</p>
                      <div :style="getHourStyle(hour)" class="min-w-[50px] h-8 rounded-md">
                        <div
                          class="absolute left -1/2 -translate-x-1/2 top-0 h-fit w-fit z-20"
                          v-if="getAppointment(dailyAppointments, hour)?.startTime"
                        >
                          <span
                            v-if="hoveredHour === hour"
                            class="h-full w-fit z-20 flex flex-col items-center justify-center gap-[1px] bg-white text-gray-800 px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          >
                            <p class="text-black z-50 h-fit w-full">
                              {{ getAppointment(dailyAppointments, hour)?.startTime }}
                            </p>
                            <p class="text-black z-50 h-fit w-full">-</p>
                            <p class="text-black z-50 h-fit w-full">
                              {{ getAppointment(dailyAppointments, hour)?.endTime }}
                            </p>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollableContainer>
              </div>

              <div class="flex h-full justify-center items-center sm:p-4">
                <button
                  class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] shadow-lg relative cursor-pointer"
                  @click="togleCreateAppointmentView()"
                >
                  <span
                    class="absolute top-0 sm:-top-[5px] left-1/2 transform -translate-x-1/2 text-4xl font-normal"
                  >
                    +
                  </span>
                </button>
              </div>
            </div>
          </template>
        </VDatePicker>
        <div
          v-if="currentDisplay === 'tjedan'"
          class="w-full max-w-[550px] h-full sm:min-h-fit flex flex-col justify-between"
        >
          <WeeklyAppointments />
        </div>
      </div>

      <div
        ref="allAppointmentsRef"
        v-if="allAppointmentsOpened"
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col bg-white z-10 pt-2 rounded-md h-full sm:h-fit overflow-y-hidden"
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
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-10 pt-2 rounded-md w-full sm:h-fit h-full"
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
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col bg-white z-10 rounded-md pt-2 w-full h-full sm:h-fit"
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
}

@media screen and (max-width: 640px) {
  .homeViewCalendar .vc-pane-container {
    height: 100dvh !important;
  }
}
</style>
