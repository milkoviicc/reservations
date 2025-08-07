<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
const date = ref(new Date())

import { defineProps } from 'vue'

const props = defineProps<{
  createReservationRef: HTMLElement | null
  handleCreateReservations: () => void
}>()

const createReservationRef = ref<HTMLElement | null>(props.createReservationRef)
const handleCreateReservations = props.handleCreateReservations

watch(
  () => props.createReservationRef,
  (newVal) => {
    createReservationRef.value = newVal || null
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

const handleDateChange = (newDate: Date) => {
  const { day, month, weekday } = getFormattedDateParts(newDate)

  formattedDay.value = day
  formattedMonth.value = month
  formattedWeekday.value = weekday
}

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const hideCreateReservations = () => {
  if (!createReservationRef.value) return
  createReservationRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    handleCreateReservations()
  }, 200)
}
</script>

<template>
  <main class="relative h-full w-full">
    <div class="relative w-full h-full flex flex-col gap-4">
      <button class="px-4 cursor-pointer" @click="hideCreateReservations">
        <img src="../assets/arrow-left.png" alt="Nazad" width="20" />
      </button>

      <div
        class="flex flex-1 gap-2 px-4 shadow-[1px_2px_4px_1px_rgba(0,0,0,0.20)] py-2 mt-8 max-h-fit"
      >
        <div class="bg-[#F54242] w-5 h-5 rounded-full"></div>
        <input
          type="text"
          placeholder="Naziv termina"
          class="flex-1 bg-transparent text-black outline-none"
        />
      </div>

      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        class="flex-1 w-full max-w-[301.6px] h-[400px] !rounded-b-md !rounded-t-none !border-t-[#c7c7c7] relative !border-none"
        @update:model-value="handleDateChange"
      >
        <template #footer>
          <div class="flex flex-col flex-1 items-center justify-between h-full w-full">
            <div class="flex flex-col items-center gap-1 w-full h-full">
              <h3 class="text-[#484848] text-xl pt-2">Odaberi vrijeme</h3>
              <div class="flex px-2 pt-2 gap-[3px]">
                <div class="flex relative items-center">
                  <input
                    type="number"
                    placeholder="00"
                    min="1"
                    max="23"
                    class="appearance-none w-14 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Sati</p>
                </div>
                <p class="text-6xl leading-8">:</p>
                <div class="flex relative items-center">
                  <input
                    type="number"
                    placeholder="00"
                    min="0"
                    max="59"
                    class="w-14 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Minute</p>
                </div>
                <p class="text-6xl leading-8">-</p>
                <div class="flex relative items-center">
                  <input
                    type="number"
                    placeholder="00"
                    min="1"
                    max="23"
                    class="w-14 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Sati</p>
                </div>
                <p class="text-6xl leading-8">:</p>
                <div class="flex relative items-center">
                  <input
                    type="number"
                    placeholder="00"
                    min="0"
                    max="59"
                    class="w-14 h-12 rounded-lg shadow-[1px_2px_4px_1px_rgba(0,0,0,0.25)] flex justify-center items-center text-3xl text-center"
                  />
                  <p class="absolute -bottom-5 left-0 text-xs">Minute</p>
                </div>
              </div>
            </div>
            <button class="w-full bg-[#F54242] text-white py-1 rounded-b-md cursor-pointer">
              Dodaj termin
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
