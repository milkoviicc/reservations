<script setup lang="ts">
import { useAppointments } from '@/composables/useAppointment'
import {
  appointmentToUpdate,
  handleUpdateAppointment,
  toggleUpdateAppointmentView,
  updateAppointmentRef,
} from '@/helpers/appointmentsRefHelper'
import { formatForApi } from '@/helpers/dataHelpers'
import type { Appointment } from '@/lib/types'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, watch } from 'vue'
const date = ref(new Date())

const { updateAppointment } = useAppointments()

const props = defineProps<{
  updateAppointments: (newDate: Date) => void
}>()

const updateAppointments = props.updateAppointments

watch(
  () => updateAppointmentRef,
  (newVal) => {
    updateAppointmentRef.value = newVal || null
  },
)

const selectedColor = ref('red')

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const newFormattedDate = ref()

const handleDateChange = (newDate: Date) => {
  newFormattedDate.value = formatForApi(newDate)
}

const hideUpdateAppointments = () => {
  if (appointmentToUpdate.value) {
    handleUpdateAppointment(appointmentToUpdate.value)
  }
}

const startingHour = ref()
const startingMinutes = ref()
const endingHour = ref()
const endingMinutes = ref()
const appointmentType = ref(appointmentToUpdate.value?.appointmentType)
const clientName = ref(
  `${appointmentToUpdate.value?.clientFirstName} ${appointmentToUpdate.value?.clientLastName}`,
)

const toast = useToast()

const callUpdateAppointment = async (e: Event) => {
  e.preventDefault()
  if (appointmentToUpdate.value && appointmentType.value) {
    const updatedAppointment: Appointment = {
      appointmentId: appointmentToUpdate.value.appointmentId,
      clientFirstName: clientName.value.split(' ')[0],
      clientLastName: clientName.value.split(' ')[1],
      appointmentType: appointmentType.value,
      date: `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, '0')}-${String(date.value.getDate()).padStart(2, '0')}`,
      startTime: `${startingHour.value}:${startingMinutes.value}:00`,
      endTime: `${endingHour.value}:${endingMinutes.value}:00`,
    }
    const res = await updateAppointment(updatedAppointment)

    if (res.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Uspjeh!',
        detail: `Uspješno si ažurirala postojeći termin.`,
        life: 2500,
      })

      setTimeout(() => {
        updateAppointments(date.value)
        toggleUpdateAppointmentView()
      }, 2500)
    } else {
      if (axios.isAxiosError(res)) {
        const endTimeErr = res.response?.data?.errors?.EndTime[0]
        const appointmentOverlaping = res.response?.data?.detail
        if (endTimeErr === 'End time must be later than start time.') {
          toast.add({
            severity: 'error',
            summary: 'Greška!',
            detail: `Vrijeme završetka termina mora biti nakon početka termina.`,
            life: 2500,
          })
        } else if (
          appointmentOverlaping === 'Appointment time overlaps with an existing appointment.'
        ) {
          toast.add({
            severity: 'error',
            summary: 'Greška!',
            detail: `Vrijeme termina preklapa se s postojećim terminom.`,
            life: 2500,
          })
        } else {
          toast.add({
            severity: 'error',
            summary: 'Greška!',
            detail: `Došlo je do greške, molimo pokušajte ponovno.`,
            life: 2500,
          })
        }
      }
    }
  }
}
</script>

<template>
  <PrimeToast />
  <main class="h-[100dvh] sm:h-fit !overflow-visible">
    <form
      class="relative w-full h-full flex flex-col gap-4"
      method="POST"
      @submit="callUpdateAppointment"
    >
      <button class="px-4 py-2 cursor-pointer" @click="hideUpdateAppointments()">
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
          <div class="flex flex-col h-full sm:min-h-[200px] items-center justify-between w-full">
            <div class="flex flex-col items-center gap-1 w-full h-full">
              <div
                class="flex flex-col w-full h-full justify-between pt-4 items-center sm:justify-between sm:pt-0"
              >
                <div class="flex flex-col gap-2">
                  <h3 class="text-[#484848] text-xl sm:pt-2 text-center">Odaberi vrijeme</h3>
                  <div
                    class="flex gap-[3px] w-full h-fit justify-center px-2 font-['Istok web', 'sans-serif']"
                  >
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="startingHour"
                        placeholder="00"
                        min="1"
                        max="23"
                        required
                        class="appearance-none w-16 h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Sati</p>
                    </div>
                    <p class="text-6xl h-16">:</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        placeholder="00"
                        v-model="startingMinutes"
                        min="0"
                        max="59"
                        required
                        class="w-16 h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Minute</p>
                    </div>
                    <p class="text-6xl h-16">-</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="endingHour"
                        placeholder="00"
                        min="1"
                        max="23"
                        required
                        class="w-16 h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Sati</p>
                    </div>
                    <p class="text-6xl h-16">:</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="endingMinutes"
                        placeholder="00"
                        min="0"
                        max="59"
                        required
                        class="w-16 h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                      />
                      <p class="absolute top-16 left-0 text-xs">Minute</p>
                    </div>
                  </div>
                </div>
                <input
                  type="submit"
                  value="Ažuriraj termin"
                  class="w-full sm:min-w-[670px] bg-[#F54242] text-white px-8 py-3 sm:px-14 sm:py-2 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </template>
      </VDatePicker>
    </form>
  </main>
</template>

<style>
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
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.vc-red {
  --vc-accent-600: #f54242 !important;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
