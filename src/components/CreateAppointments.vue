<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
const date = ref(new Date())

const props = defineProps<{
  createAppointmentRef: HTMLElement | null
  handleCreateAppointments: () => void
  updateAppointments: (newDate: Date) => void
}>()

const createAppointmentRef = ref<HTMLElement | null>(props.createAppointmentRef)
const handleCreateAppointments = props.handleCreateAppointments
const updateAppointments = props.updateAppointments

watch(
  () => props.createAppointmentRef,
  (newVal) => {
    createAppointmentRef.value = newVal || null
  },
)

const selectedColor = ref('red')
const formattedDay = ref<number | null>(null)
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

  const year = date.toLocaleDateString('hr-HR', {
    year: 'numeric',
  })

  const uppercase = (str: string) => str.toUpperCase()

  return {
    day,
    month: uppercase(month),
    weekday: uppercase(weekday),
    year: year,
  }
}

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const handleDateChange = (newDate: Date) => {
  const { day, month, weekday } = getFormattedDateParts(newDate)

  formattedDay.value = day
  formattedMonth.value = month
  formattedWeekday.value = weekday
}

const getDate = () => {
  const day = String(date.value.getDate()).padStart(2, '0')
  const month = String(date.value.getMonth() + 1).padStart(2, '0')
  const year = date.value.getFullYear()

  return { day, year, month }
}

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const hideCreateAppointments = () => {
  if (!createAppointmentRef.value) return
  createAppointmentRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    handleCreateAppointments()
  }, 200)
}

const appointmentType = ref('')
const clientName = ref('')
const appointmentStartingHours = ref('')
const appointmentStartingMinutes = ref('')
const appointmentEndingHours = ref('')
const appointmentEndingMinutes = ref('')

const createAppointment = async (e: Event) => {
  e.preventDefault()

  const appointmentDate = getDate()
  try {
    const res = await axios.post('http://91.99.227.117/api/appointments', {
      clientFirstName: clientName.value.trim().split(' ')[0] || '',
      clientLastName: clientName.value.trim().split(' ').slice(1).join(' ') || '',
      appointmentType: appointmentType.value,
      date: `${appointmentDate.year}-${appointmentDate.month}-${appointmentDate.day}`,
      startTime: `${appointmentStartingHours.value}:${appointmentStartingMinutes.value}`,
      endTime: `${appointmentEndingHours.value}:${appointmentEndingMinutes.value}`,
      cost: 50,
    })

    if (res.status === 200) {
      updateAppointments(date.value)
      handleCreateAppointments()
    }
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <main class="h-[100dvh] sm:h-fit !overflow-visible">
    <div class="relative w-full h-full flex flex-col gap-4">
      <button class="px-4 py-2 cursor-pointer" @click="hideCreateAppointments">
        <img src="../assets/arrow-left.png" alt="Nazad" width="20" />
      </button>

      <div class="flex flex-col gap-1 !mt-4">
        <div
          class="flex flex-1 gap-4 px-3 shadow-[1px_2px_4px_1px_rgba(0,0,0,0.20)] py-2 mt-8 max-h-fit"
        >
          <div class="bg-[#F54242] w-[22px] h-[22px] rounded-full"></div>
          <input
            v-model="appointmentType"
            type="text"
            placeholder="Naziv termina"
            required
            class="bg-transparent text-black outline-none"
          />
        </div>
        <div
          class="flex flex-1 gap-2 px-2 shadow-[1px_2px_4px_1px_rgba(0,0,0,0.20)] py-2 mt-8 max-h-fit"
        >
          <div class="w-[34px] h-[34px] rounded-full">
            <img src="../assets/frame.png" alt="User frame" class="w-full h-full" />
          </div>
          <input
            v-model="clientName"
            type="text"
            placeholder="Ime i prezime klijenta"
            required
            class="flex-1 bg-transparent text-black outline-none"
          />
        </div>
      </div>

      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        class="flex-1 w-full !mt-4 max-w-[301.6px] min-w-[301.6px] h-full !rounded-b-md !rounded-t-none !border-t-[#c7c7c7] relative !border-none"
        @update:model-value="handleDateChange"
        disable-page-swipe
      >
        <template #footer>
          <div
            class="flex flex-col h-full sm:min-h-[200px] items-center justify-between w-full pt-4 sm:pt-0"
          >
            <div class="flex flex-col items-center gap-1 w-full h-full">
              <form
                class="flex flex-col w-full h-full justify-evenly items-center sm:justify-between sm:pb-4"
                method="POST"
                @submit="createAppointment"
              >
                <div class="flex flex-col gap-2">
                  <h3 class="text-[#484848] text-xl sm:pt-2 text-center">Odaberi vrijeme</h3>
                  <div class="flex gap-[3px] w-full h-fit justify-center px-2">
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="appointmentStartingHours"
                        placeholder="00"
                        min="1"
                        max="23"
                        required
                        class="appearance-none w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Sati</p>
                    </div>
                    <p class="text-6xl h-12 sm:h-16 flex sm:pt-2 leading-8">:</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        placeholder="00"
                        v-model="appointmentStartingMinutes"
                        min="0"
                        max="59"
                        required
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Minute</p>
                    </div>
                    <p class="text-6xl h-12 sm:h-16 flex sm:pt-2 leading-8">-</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="appointmentEndingHours"
                        placeholder="00"
                        min="1"
                        max="23"
                        required
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Sati</p>
                    </div>
                    <p class="text-6xl h-12 sm:h-16 flex sm:pt-2 leading-8">:</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="appointmentEndingMinutes"
                        placeholder="00"
                        min="0"
                        max="59"
                        required
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Minute</p>
                    </div>
                  </div>
                </div>
                <input
                  type="submit"
                  value="Dodaj termin"
                  class="w-fit bg-[#F54242] text-white px-8 py-1 sm:px-14 sm:py-2 rounded-md cursor-pointer"
                />
              </form>
            </div>
          </div>
        </template>
      </VDatePicker>
    </div>
  </main>
</template>

<style scoped>
.vc-weekdays {
  text-transform: capitalize !important;
}

.vc-title-wrapper button {
  text-transform: uppercase !important;
}

.vc-header {
  border-top: none !important;
  border-bottom: 1px solid #c7c7c7 !important;
  margin: 0 !important;
  border-radius: 0 !important;
}

.vc-arrow,
.vc-title {
  background-color: transparent !important;
}

.vc-weeks {
  border-bottom: 1px solid #c7c7c7 !important;
}

.vc-pane-container {
  display: flex;
  flex-direction: column;
  height: 100% !important;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

@media screen and (max-width: 640px) {
  .vc-pane-container {
    height: 100% !important;
  }
}
</style>
