<script setup lang="ts">
import AllReservations from '@/components/AllReservations.vue'
import CreateReservation from '@/components/CreateReservation.vue'
import ScrollableContainer from '@/components/ScrollableContainer.vue'
import UpdateReservation from '@/components/UpdateReservation.vue'
import type { Appointment } from '@/lib/types'
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const date = ref(new Date())
const selectedColor = ref('red')
const formattedDay = ref<number>(0)
const formattedMonth = ref('')
const formattedWeekday = ref('')

const getFormattedDateParts = (date: Date) => {
  const day = date.getDate() // e.g., 15

  const month = date.toLocaleDateString('hr-HR', {
    month: 'long',
  })

  const weekday = date.toLocaleDateString('hr-HR', {
    weekday: 'long',
  })

  const uppercase = (str: string) => str.toUpperCase()

  return {
    day,
    month: uppercase(month),
    weekday: uppercase(weekday),
  }
}

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const brojMusterija = ref(0)

const handleDateChange = async (newDate: Date) => {
  const { day, month, weekday } = getFormattedDateParts(newDate)

  formattedDay.value = day
  formattedMonth.value = month
  formattedWeekday.value = weekday

  try {
    const formattedDate = newDate.toISOString().split('T')[0]

    const getAppointments = await axios.get(
      `http://91.99.227.117/api/appointments/date/${formattedDate}`,
    )

    if (getAppointments.status === 200) {
      appointments.value = getAppointments.data
      brojMusterija.value = appointments.value.length
    }
  } catch (error) {
    console.error(error)
  }
}

const appointments = ref<Appointment[]>([])
// Hours for the main timeline (like your code)
const hours = Array.from({ length: 11 }, (_, i) => i + 9) // 9 → 19

// Helper: decide the color of the hour based on 15-min precision
function getHourStyle(hour: number): Record<string, string> {
  let redStartPercent: number | null = null
  let redEndPercent: number | null = null

  const hourStartMin = hour * 60
  const hourEndMin = hourStartMin + 60

  appointments.value.forEach((appt) => {
    const [sh, sm] = appt.startTime.split(':').map(Number)
    const [eh, em] = appt.endTime.split(':').map(Number)

    const apptStart = sh * 60 + sm
    const apptEnd = eh * 60 + em

    // Find overlap within the current hour
    const overlapStart = Math.max(hourStartMin, apptStart)
    const overlapEnd = Math.min(hourEndMin, apptEnd)

    if (overlapEnd > overlapStart) {
      const startPct = ((overlapStart - hourStartMin) / 60) * 100
      const endPct = ((overlapEnd - hourStartMin) / 60) * 100

      redStartPercent = redStartPercent === null ? startPct : Math.min(redStartPercent, startPct)

      redEndPercent = redEndPercent === null ? endPct : Math.max(redEndPercent, endPct)
    }
  })

  if (redStartPercent === null) {
    // Fully free (green)
    return { background: '#89EB7C' }
  }

  // Create gradient from green → red → green
  return {
    background: `linear-gradient(
    to right,
    #89EB7C 0%,
    #89EB7C ${redStartPercent}%,
    #F54242 ${redStartPercent}%,
    #F54242 ${redEndPercent}%,
    #89EB7C ${redEndPercent}%,
    #89EB7C 100%
  )`,
  }
}
const hoveredHour = ref<number | null>(null)
// Get the first appointment in an hour (for tooltip)
function getAppointment(hour: number) {
  return appointments.value.find((app) => {
    const [startH, startM] = app.startTime.split(':').map(Number)
    const [endH, endM] = app.endTime.split(':').map(Number)

    const slotStart = hour * 60 // slot start in minutes
    const slotEnd = (hour + 1) * 60 // slot end in minutes

    const appStart = startH * 60 + startM
    const appEnd = endH * 60 + endM

    // Match if appointment overlaps the slot
    return appStart < slotEnd && appEnd > slotStart
  })
}

const allReservationsOpened = ref(false)
const allReservationsRef = ref()
const createReservationRef = ref<HTMLElement | null>(null)
const createReservationsOpened = ref(false)
const updateReservationRef = ref<HTMLElement | null>(null)
const updateReservationOpened = ref(false)
const updateAppointment = ref<Appointment | undefined>()

const handleAllReservations = () => {
  allReservationsOpened.value = !allReservationsOpened.value
}

const handleCreateReservations = () => {
  createReservationsOpened.value = !createReservationsOpened.value
}

const openUpdateReservations = () => {
  updateReservationOpened.value = !updateReservationOpened.value
}

const handleUpdateReservation = (appointment: Appointment | undefined) => {
  updateAppointment.value = appointment
}

const allReservationsDateData = computed(() => ({
  date: date.value,
  day: formattedDay.value,
  month: formattedMonth.value,
  weekday: formattedWeekday.value,
}))
</script>

<template>
  <main class="w-fit h-fit">
    <div class="relative max-h-fit">
      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        class="flex flex-col flex-1 h-full pt-12"
        @update:model-value="handleDateChange"
      >
        <template #footer>
          <div class="w-full h-full max-h-[300px] relative">
            <div class="max-w-[300px] px-4 border-t flex flex-col border-[rgba(0,0,0,0.2)]">
              <div class="w-full h-full flex flex-col">
                <h3 class="text-[#484848] text-xl font-bold">
                  {{ formattedDay }}. {{ formattedMonth }}
                </h3>
                <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
              </div>
              <div class="w-full flex justify-between pt-4">
                <p class="text-[#484848]">{{ brojMusterija }} mušterija</p>
                <button class="underline cursor-pointer" @click="handleAllReservations">
                  Svi termini
                </button>
              </div>
              <ScrollableContainer>
                <div
                  class="min-w-[60px] px-[1px] py-1 border-[#C7C7C7] border-t-[1px] border-b-[1px] text-center text-sm font-medium flex gap-[3px] items-center"
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
                        v-if="getAppointment(hour)?.startTime"
                      >
                        <span
                          v-if="hoveredHour === hour"
                          class="h-full w-fit z-20 flex flex-col items-center justify-center gap-[1px] bg-white text-gray-800 px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        >
                          <p class="text-black z-50 h-fit w-full">
                            {{ getAppointment(hour)?.startTime }}
                          </p>
                          <p class="text-black z-50 h-fit w-full">-</p>
                          <p class="text-black z-50 h-fit w-full">
                            {{ getAppointment(hour)?.endTime }}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollableContainer>
            </div>
            <div class="flex items-end justify-center h-full pt-8 pb-4">
              <button
                class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] shadow-lg relative cursor-pointer"
                @click="handleCreateReservations()"
              >
                <span
                  class="absolute -top-[5px] left-1/2 transform -translate-x-1/2 text-4xl font-semibold"
                >
                  +
                </span>
              </button>
            </div>
          </div>
        </template>
      </VDatePicker>
      <div
        ref="allReservationsRef"
        v-if="allReservationsOpened"
        class="absolute inset-0 flex flex-col bg-white z-10 rounded-md py-4"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <AllReservations
          :appointments="appointments"
          :data="allReservationsDateData"
          :allReservationsRef="allReservationsRef"
          :handleAllReservations="handleAllReservations"
          :handleCreateReservations="handleCreateReservations"
          :openUpdateReservations="openUpdateReservations"
          :handleUpdateReservation="handleUpdateReservation"
          :updateAppointments="handleDateChange"
        />
      </div>

      <div
        ref="createReservationRef"
        v-if="createReservationsOpened"
        class="absolute inset-0 flex flex-col bg-white z-10 rounded-md pt-2 w-full"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <CreateReservation
          :createReservationRef="createReservationRef"
          :handleCreateReservations="handleCreateReservations"
          :updateAppointments="handleDateChange"
        />
      </div>
      <div
        ref="updateReservationRef"
        v-if="updateReservationOpened"
        class="absolute inset-0 flex flex-col bg-white z-10 rounded-md pt-2 w-full"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <UpdateReservation
          :appointment="updateAppointment"
          :updateReservationRef="updateReservationRef"
          :handleUpdateReservation="handleUpdateReservation"
          :updateAppointments="handleDateChange"
        />
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
</style>
