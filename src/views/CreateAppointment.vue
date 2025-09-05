<script setup lang="ts">
import { useAppointments } from '@/composables/useAppointment'
import { useScreen } from '@/composables/useScreen'
import { getDate, getFormattedDateParts } from '@/helpers/dataHelpers'
import router from '@/router'
import { useAppointmentsStore } from '@/stores/appointments'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref } from 'vue'

const { createAppointment } = useAppointments()

const { toastPosition, screenWidth } = useScreen()

const selectedColor = ref('red')
const formattedDay = ref<number | null>(null)
const formattedMonth = ref('')
const formattedWeekday = ref('')

const store = useAppointmentsStore()
const { getDailyAppointments } = useAppointments()

onMounted(() => {
  if (store.currentDate) {
    handleDateChange(store.currentDate)
  }
})

const handleDateChange = (newDate: Date) => {
  const { day, month, weekday } = getFormattedDateParts(newDate)

  formattedDay.value = day
  formattedMonth.value = month
  formattedWeekday.value = weekday
}

const appointmentType = ref('')
const clientName = ref('')
const appointmentStartingHours = ref<number>()
const appointmentStartingMinutes = ref<number>()
const appointmentEndingHours = ref<number>()
const appointmentEndingMinutes = ref<number>()

const toast = useToast()

const hideCreateAppointments = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const createNewAppointment = async (e: Event) => {
  e.preventDefault()

  const appointmentDate = getDate(store.currentDate)
  const newAppointment = {
    clientFirstName: clientName.value.trim().split(' ')[0] || '',
    clientLastName: clientName.value.trim().split(' ').slice(1).join(' ') || '',
    appointmentType: appointmentType.value,
    date: `${appointmentDate.year}-${appointmentDate.month}-${appointmentDate.day}`,
    startTime: `${appointmentStartingHours.value}:${appointmentStartingMinutes.value || '00'}`,
    endTime: `${appointmentEndingHours.value}:${appointmentEndingMinutes.value || '00'}`,
  }
  const res = await createAppointment(newAppointment)
  if (res.status === 200) {
    getDailyAppointments(store.currentDate)
    toast.add({
      severity: 'success',
      summary: 'Uspjeh!',
      detail: `Uspješno si kreirala novi termin.`,
      life: 1500,
    })
    setTimeout(() => {
      hideCreateAppointments()
    }, 1500)
  } else {
    if (axios.isAxiosError(res)) {
      const endTimeErr = res.response?.data?.errors?.EndTime[0]
      const appointmentOverlaping = res.response?.data?.detail
      if (endTimeErr === 'End time must be later than start time.') {
        toast.add({
          severity: 'error',
          summary: 'Greška!',
          detail: `Vrijeme završetka termina mora biti nakon početka termina.`,
          life: 1500,
        })
      } else if (
        appointmentOverlaping === 'Appointment time overlaps with an existing appointment.'
      ) {
        toast.add({
          severity: 'error',
          summary: 'Greška!',
          detail: `Vrijeme termina preklapa se s postojećim terminom.`,
          life: 1500,
        })
      } else {
        toast.add({
          severity: 'error',
          summary: 'Greška!',
          detail: `Došlo je do greške, molimo pokušajte ponovno.`,
          life: 1500,
        })
      }
    }
  }
}
</script>

<template>
  <PrimeToast :position="toastPosition" />
  <main
    class="flex justify-center items-center w-full h-[100dvh]"
    v-motion="'transition'"
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1 }"
    :leave="{ opacity: 0 }"
    :duration="500"
  >
    <div class="w-full h-[100dvh] flex flex-col gap-4 bg-white sm:max-w-[600px] sm:max-h-[95%]">
      <form class="w-full h-full flex flex-col gap-4" method="POST" @submit="createNewAppointment">
        <button
          class="px-4 py-2 cursor-pointer"
          @click="hideCreateAppointments()"
          v-if="screenWidth > 640"
        >
          <img src="../assets/arrow-left.png" alt="Nazad" width="28" />
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
              class="bg-transparent text-black outline-none w-full"
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
              class="flex-1 bg-transparent text-black outline-none w-full"
            />
          </div>
        </div>

        <VDatePicker
          v-model="store.currentDate"
          mode="date"
          locale="hr"
          :masks="{ weekdays: 'WWW', title: 'MMMM' }"
          :color="selectedColor"
          class="flex-1 w-full !mt-4 h-full !rounded-t-none !border-t-[#c7c7c7] !border-none"
          @update:model-value="handleDateChange"
          disable-page-swipe
        >
          <template #footer>
            <div class="flex flex-col h-full items-center justify-between w-full">
              <div class="flex flex-col items-center gap-1 w-full h-full">
                <div class="flex flex-col w-full h-full justify-between items-center gap-4">
                  <div class="flex flex-col gap-2">
                    <h3 class="text-[#484848] text-xl pt-4 sm:pt-2 text-center">Odaberi vrijeme</h3>
                    <div
                      class="flex gap-[3px] w-full h-fit justify-center items-center px-2 font-['Istok web', 'sans-serif']"
                    >
                      <div class="flex relative h-fit">
                        <input
                          type="number"
                          v-model="appointmentStartingHours"
                          placeholder="00"
                          min="1"
                          max="23"
                          required
                          class="appearance-none w-18 h-13 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                        />
                        <p class="absolute top-16 left-0 text-xs">Sati</p>
                      </div>
                      <p class="text-6xl h-16">:</p>
                      <div class="flex relative h-fit">
                        <input
                          type="number"
                          placeholder="00"
                          v-model="appointmentStartingMinutes"
                          min="0"
                          max="59"
                          class="w-18 h-13 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                        />
                        <p class="absolute top-16 left-0 text-xs">Minute</p>
                      </div>
                      <p class="text-6xl h-16">-</p>
                      <div class="flex relative h-fit">
                        <input
                          type="number"
                          v-model="appointmentEndingHours"
                          placeholder="00"
                          min="1"
                          max="23"
                          required
                          class="w-18 h-13 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                        />
                        <p class="absolute top-16 left-0 text-xs">Sati</p>
                      </div>
                      <p class="text-6xl h-16">:</p>
                      <div class="flex relative h-fit">
                        <input
                          type="number"
                          v-model="appointmentEndingMinutes"
                          placeholder="00"
                          min="0"
                          max="59"
                          class="w-18 h-13 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                        />
                        <p class="absolute top-16 left-0 text-xs">Minute</p>
                      </div>
                    </div>
                    <input
                      type="submit"
                      value="Dodaj termin"
                      class="w-full bg-[#F54242] text-white px-8 py-3 sm:px-14 sm:py-2 text-lg font-semibold cursor-pointer absolute bottom-0 left-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </VDatePicker>
      </form>
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

.vc-red {
  --vc-accent-600: #f54242 !important;
}

@media screen and (max-width: 640px) {
  .vc-pane-container {
    height: 100% !important;
  }
}
</style>
