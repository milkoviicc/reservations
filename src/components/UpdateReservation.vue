<script setup lang="ts">
import type { Appointment } from '@/lib/types'
import axios from 'axios'
import { onMounted, ref, watch } from 'vue'
const date = ref(new Date())

import { defineProps } from 'vue'

const props = defineProps<{
  appointment: Appointment | undefined
  updateReservationRef: HTMLElement | null
  handleUpdateReservation: (appointment: Appointment) => void
}>()

const appointment = ref<Appointment | undefined>(props.appointment)
const updateReservationRef = ref<HTMLElement | null>(props.updateReservationRef)
const handleUpdateReservation = props.handleUpdateReservation

watch(
  () => props.updateReservationRef,
  (newVal) => {
    updateReservationRef.value = newVal || null
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

const hideCreateReservations = () => {
  if (!updateReservationRef.value) return
  updateReservationRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    if (appointment.value) {
      handleUpdateReservation(appointment.value)
    }
  }, 200)
}

const startingHour = ref()
const startingMinutes = ref()
const endingHour = ref()
const endingMinutes = ref()

const updateReservation = async () => {
  if (appointment.value) {
    try {
      const res = await axios.put('http://91.99.227.117/api/appointments', {
        appointmentId: appointment.value.appointmentId,
        clientFirstName: appointment.value.clientFirstName,
        clientLastName: appointment.value.clientLastName,
        appointmentType: appointment.value.appointmentType,
        date: date,
        startTime: `${startingHour.value}-${startingMinutes.value}:00`,
        endTime: `${endingHour.value}-${endingMinutes.value}:00`,
        cost: appointment.value.cost,
      })

      if (res.status === 200) {
        console.log('appointment updated')
      }
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <main class="relative h-full w-full">
    <div class="relative w-full h-full flex flex-col gap-4">
      <button class="px-4 cursor-pointer" @click="hideCreateReservations">
        <img src="../assets/arrow-left.png" alt="Nazad" width="20" />
      </button>

      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        class="flex-1 w-full max-w-[301.6px] min-w-[301.6px] h-[400px] !rounded-b-md !rounded-t-none !border-t-[#c7c7c7] relative !border-none"
        @update:model-value="handleDateChange"
      >
        <template #footer>
          <div class="flex flex-col flex-1 items-center justify-between h-full w-full">
            <div class="flex flex-col items-center gap-1 w-full h-full">
              <h3 class="text-[#484848] text-xl pt-8">Odaberi vrijeme</h3>
              <div class="flex px-2 pt-2 gap-[3px] w-full justify-center">
                <div class="flex relative items-center">
                  <input
                    v-model="startingHour"
                    type="number"
                    placeholder="00"
                    min="1"
                    max="23"
                    class="appearance-none w-12 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Sati</p>
                </div>
                <p class="text-6xl leading-8">:</p>
                <div class="flex relative items-center">
                  <input
                    v-model="startingMinutes"
                    type="number"
                    placeholder="00"
                    min="0"
                    max="59"
                    class="w-12 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Minute</p>
                </div>
                <p class="text-6xl leading-8">-</p>
                <div class="flex relative items-center">
                  <input
                    v-model="endingHour"
                    type="number"
                    placeholder="00"
                    min="1"
                    max="23"
                    class="w-12 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Sati</p>
                </div>
                <p class="text-6xl leading-8">:</p>
                <div class="flex relative items-center">
                  <input
                    v-model="endingMinutes"
                    type="number"
                    placeholder="00"
                    min="0"
                    max="59"
                    class="w-12 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Minute</p>
                </div>
              </div>
            </div>
            <button
              class="w-full bg-[#F54242] text-white py-1 rounded-b-md cursor-pointer"
              @click="updateReservation"
            >
              Spremi promjene
            </button>
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
