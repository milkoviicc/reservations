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
</script>

<template>
  <main>
    <div>
      <VDatePicker
        v-model="date"
        mode="date"
        locale="hr"
        :masks="{ weekdays: 'WWW', title: 'MMMM' }"
        :color="selectedColor"
        @update:model-value="handleDateChange"
      >
        <template #footer>
          <div class="max-w-[300px] px-4 border-t flex flex-col border-[rgba(0,0,0,0.2)]">
            <div class="w-full h-full flex flex-col">
              <h3 class="text-black text-xl font-bold">{{ formattedDay }}. {{ formattedMonth }}</h3>
              <p class="font-semibold text-lg">{{ formattedWeekday }}</p>
            </div>
            <div class="w-full flex justify-between pt-4">
              <p>{{ brojMusterija }} mušterija</p>
              <button class="underline cursor-pointer">Svi termini</button>
            </div>
            <DraggableScroll :rezervacije="rezervacije" />
          </div>
        </template>
      </VDatePicker>
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
