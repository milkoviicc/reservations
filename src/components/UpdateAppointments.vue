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

const toast = useToast()

const callUpdateAppointment = async (e: Event) => {
  e.preventDefault()
  if (appointmentToUpdate.value) {
    const updatedAppointment: Appointment = {
      appointmentId: appointmentToUpdate.value.appointmentId,
      clientFirstName: appointmentToUpdate.value.clientFirstName,
      clientLastName: appointmentToUpdate.value.clientLastName,
      appointmentType: appointmentToUpdate.value.appointmentType,
      date: `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, '0')}-${String(date.value.getDate()).padStart(2, '0')}`,
      startTime: `${startingHour.value}:${startingMinutes.value}:00`,
      endTime: `${endingHour.value}:${endingMinutes.value}:00`,
      cost: appointmentToUpdate.value.cost,
    }
    const res = await updateAppointment(updatedAppointment)

    if (res.status === 200) {
      toast.add({
        severity: 'success',
        summary: 'Uspjeh!',
        detail: `Uspješno si kreirala novi termin.`,
        life: 1500,
      })

      setTimeout(() => {
        updateAppointments(date.value)
        toggleUpdateAppointmentView()
      }, 1500)
    } else {
      if (axios.isAxiosError(res)) {
        const endTimeErr = res.response?.data?.errors?.EndTime
        if (endTimeErr === 'End time must be later than start time.') {
          toast.add({
            severity: 'error',
            summary: 'Greška!',
            detail: `Vrijeme završetka termina mora biti nakon početka termina.`,
          })
        } else {
          toast.add({
            severity: 'error',
            summary: 'Greška!',
            detail: `Došlo je do greške, molimo pokušajte ponovno.`,
          })
        }
      }
    }
  }
}
</script>

<template>
  <main class="min-h-full h-full w-full sm:max-w-full sm:w-full sm:min-h-[600px]">
    <div class="relative w-full h-full min-h-[600px] flex flex-col gap-4">
      <button class="px-4 py-2 cursor-pointer" @click="hideUpdateAppointments">
        <img src="../assets/arrow-left.png" alt="Nazad" width="20" />
      </button>

      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        class="flex-1 w-full !mt-16 sm:mt-10! max-w-[301.6px] min-w-[301.6px] h-[400px] !rounded-b-md !rounded-t-none !border-t-[#c7c7c7] relative !border-none"
        @update:model-value="handleDateChange"
        disable-page-swipe
      >
        <template #footer>
          <div class="flex flex-col h-full sm:min-h-[200px] items-center justify-between w-full">
            <div class="flex flex-col items-center gap-1 w-full h-full">
              <form
                class="flex flex-col w-full h-full justify-evenly items-center sm:justify-between sm:pb-4"
                method="PUT"
                @submit="callUpdateAppointment"
              >
                <div class="flex flex-col gap-2">
                  <h3 class="text-[#484848] text-xl sm:pt-2 text-center">Odaberi vrijeme</h3>
                  <div class="flex gap-[3px] w-full h-fit justify-center px-2">
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="startingHour"
                        placeholder="00"
                        min="1"
                        max="23"
                        required
                        class="appearance-none w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-2xl sm:text-3xl text-center"
                      />
                      <p class="absolute top-12 sm:top-16 left-0 text-xs">Sati</p>
                    </div>
                    <p class="text-5xl h-fit sm:text-6xl sm:h-16">:</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        placeholder="00"
                        v-model="startingMinutes"
                        min="0"
                        max="59"
                        required
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-2xl sm:text-3xl text-center"
                      />
                      <p class="absolute top-12 sm:top-16 left-0 text-xs">Minute</p>
                    </div>
                    <p class="text-5xl h-fit sm:text-6xl sm:h-16">-</p>
                    <div class="flex relative h-fit font-['Istok web', 'sans-serif']">
                      <input
                        type="number"
                        v-model="endingHour"
                        placeholder="00"
                        min="1"
                        max="23"
                        required
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-2xl sm:text-3xl text-center"
                      />
                      <p class="absolute top-12 sm:top-16 left-0 text-xs">Sati</p>
                    </div>
                    <p class="text-5xl h-fit sm:text-6xl sm:h-16">:</p>
                    <div class="flex relative h-fit">
                      <input
                        type="number"
                        v-model="endingMinutes"
                        placeholder="00"
                        min="0"
                        max="59"
                        required
                        class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-2xl sm:text-3xl text-center"
                      />
                      <p class="absolute top-12 sm:top-16 left-0 text-xs">Minute</p>
                    </div>
                  </div>
                </div>
                <input
                  type="submit"
                  value="Ažuriraj termin"
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
