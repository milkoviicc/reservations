<script setup lang="ts">
import type { Appointment } from '@/lib/types'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { onMounted, ref, watch } from 'vue'
const date = ref(new Date())

const props = defineProps<{
  appointment: Appointment | undefined
  updateAppointmentRef: HTMLElement | null
  handleUpdateAppointment: (appointment: Appointment) => void
  updateAppointments: (newDate: Date) => void
}>()

const appointment = ref<Appointment | undefined>(props.appointment)
const updateAppointmentRef = ref<HTMLElement | null>(props.updateAppointmentRef)
const handleUpdateAppointment = props.handleUpdateAppointment
const updateAppointments = props.updateAppointments

watch(
  () => props.updateAppointmentRef,
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
  newFormattedDate.value = newDate.toISOString().split('T')[0]
}

const hideUpdateAppointments = () => {
  if (!updateAppointmentRef.value) return
  updateAppointmentRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    if (appointment.value) {
      handleUpdateAppointment(appointment.value)
    }
  }, 200)
}

const startingHour = ref()
const startingMinutes = ref()
const endingHour = ref()
const endingMinutes = ref()

const toast = useToast()

const updateAppointment = async (e: Event) => {
  e.preventDefault()
  if (appointment.value) {
    try {
      const res = await axios.put('http://91.99.227.117/api/appointments', {
        appointmentId: appointment.value.appointmentId,
        clientFirstName: appointment.value.clientFirstName,
        clientLastName: appointment.value.clientLastName,
        appointmentType: appointment.value.appointmentType,
        date: `${date.value.getFullYear()}-${String(date.value.getMonth() + 1).padStart(2, '0')}-${String(date.value.getDate()).padStart(2, '0')}`,
        startTime: `${startingHour.value}:${startingMinutes.value}:00`,
        endTime: `${endingHour.value}:${endingMinutes.value}:00`,
        cost: appointment.value.cost,
      })

      if (res.status === 200) {
        toast.add({
          severity: 'success',
          summary: 'Uspjeh!',
          detail: `Uspješno si ažurirala postojeći termin.`,
          life: 1500,
        })
        setTimeout(() => {
          updateAppointments(date.value)
          if (appointment.value) {
            handleUpdateAppointment(appointment.value)
          }
        }, 1500)
      }
    } catch (error) {
      console.error(error)
      toast.add({
        severity: 'success',
        summary: 'Greška!',
        detail: `Došlo je do greške, molimo pokušajte ponovno.`,
        life: 1500,
      })
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
          <div
            class="flex flex-col sm:min-h-[200px] items-center justify-between h-full w-full pt-16 sm:pt-8!"
          >
            <div class="flex flex-col items-center gap-1 w-full h-full">
              <h3 class="text-[#484848] text-xl sm:pt-2">Odaberi vrijeme</h3>
              <form
                class="flex flex-col justify-between w-full h-full"
                method="PUT"
                @submit="updateAppointment"
              >
                <div class="flex gap-[3px] w-full h-fit justify-center px-2">
                  <div class="flex relative">
                    <input
                      type="number"
                      v-model="startingHour"
                      placeholder="00"
                      min="1"
                      max="23"
                      required
                      class="appearance-none w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                    />
                    <p class="absolute top-16 left-0 text-xs">Sati</p>
                  </div>
                  <p class="text-6xl h-12 sm:h-16 flex sm:pt-2 leading-8">:</p>
                  <div class="flex relative">
                    <input
                      type="number"
                      placeholder="00"
                      v-model="startingMinutes"
                      min="0"
                      max="59"
                      required
                      class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                    />
                    <p class="absolute top-16 left-0 text-xs">Minute</p>
                  </div>
                  <p class="text-6xl h-12 sm:h-16 flex sm:pt-2 leading-8">-</p>
                  <div class="flex relative">
                    <input
                      type="number"
                      v-model="endingHour"
                      placeholder="00"
                      min="1"
                      max="23"
                      required
                      class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                    />
                    <p class="absolute top-16 left-0 text-xs">Sati</p>
                  </div>
                  <p class="text-6xl h-12 sm:h-16 flex sm:pt-2 leading-8">:</p>
                  <div class="flex relative">
                    <input
                      type="number"
                      v-model="endingMinutes"
                      placeholder="00"
                      min="0"
                      max="59"
                      required
                      class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                    />
                    <p class="absolute top-16 left-0 text-xs">Minute</p>
                  </div>
                </div>
                <input
                  type="submit"
                  value="Spremi Promjene"
                  class="w-full bg-[#F54242] text-white py-1 sm:py-3 rounded-b-md cursor-pointer"
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

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
