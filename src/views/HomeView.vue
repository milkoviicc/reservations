<script setup lang="ts">
import DraggableScroll from '@/components/DraggableScroll.vue'
import { onMounted, ref } from 'vue'
const date = ref(new Date())

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

const musterije = ref([
  {
    datum: {
      dan: 23,
      mjesec: 'KOLOVOZ',
      godina: 2025,
    },
    brojMusterija: 5,
  },
  {
    datum: {
      dan: 15,
      mjesec: 'LIPANJ',
      godina: 2025,
    },
    brojMusterija: 2,
  },
  {
    datum: {
      dan: 10,
      mjesec: 'KOLOVOZ',
      godina: 2025,
    },
    brojMusterija: 10,
  },
])

const brojMusterija = ref(0)

const updateBrojMusterija = (day: number, month: string, year: number) => {
  const found = musterije.value.find(
    (m) => m.datum.dan === day && m.datum.mjesec === month && m.datum.godina === year,
  )
  brojMusterija.value = found ? found.brojMusterija : 0
}

const handleDateChange = (newDate: Date) => {
  const { day, month, weekday } = getFormattedDateParts(newDate)

  formattedDay.value = day
  formattedMonth.value = month
  formattedWeekday.value = weekday

  updateBrojMusterija(day, month, newDate.getFullYear())
}

onMounted(() => {
  if (date.value) {
    handleDateChange(date.value)
  }
})

const rezervacije = ref([
  {
    dan: 23,
    startHour: '9:00',
    finishingHour: '10:30',
    color: '#dc2626',
  },
  {
    startHour: '10:30',
    finishingHour: '12:45',
    color: '#00FF00',
  },
  {
    startHour: '12:45',
    finishingHour: '14:00',
    color: '#dc2626',
  },
])

const allReservations = ref(false)
const hideReservationsRef = ref()

const showAllReservations = () => {
  allReservations.value = !allReservations.value
}

const hideReservations = () => {
  if (!hideReservationsRef.value) return
  hideReservationsRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    showAllReservations()
  }, 200)
}
</script>

<template>
  <main>
    <div class="relative">
      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        @update:model-value="handleDateChange"
      >
        <template #footer>
          <div class="w-full h-full relative">
            <div class="max-w-[300px] px-4 border-t flex flex-col border-[rgba(0,0,0,0.2)]">
              <div class="w-full h-full flex flex-col">
                <h3 class="text-[#484848] text-xl font-bold">
                  {{ formattedDay }}. {{ formattedMonth }}
                </h3>
                <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
              </div>
              <div class="w-full flex justify-between pt-4">
                <p class="text-[#484848]">{{ brojMusterija }} mušterija</p>
                <button class="underline cursor-pointer" @click="showAllReservations">
                  Svi termini
                </button>
              </div>
              <DraggableScroll :rezervacije="rezervacije" />
            </div>
          </div>
        </template>
      </VDatePicker>
      <div
        ref="hideReservationsRef"
        v-if="allReservations"
        class="absolute top-0 left-0 w-full h-full flex flex-col bg-white z-10 rounded-md"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <button class="p-4 cursor-pointer" @click="hideReservations">
          <img src="../assets/arrow-left.png" alt="" />
        </button>
        <div class="w-full h-full flex flex-col p-4">
          <h3 class="text-[#484848] text-xl font-bold">{{ formattedDay }}. {{ formattedMonth }}</h3>
          <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
        </div>
        <div class="flex flex-col gap-2">
          <p class="text-[#484848]">{{ brojMusterija }} mušterija</p>
        </div>
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
