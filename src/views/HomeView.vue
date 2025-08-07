<script setup lang="ts">
import CreateReservation from '@/components/CreateReservation.vue'
import ScrollableContainer from '@/components/ScrollableContainer.vue'
import { EllipsisVertical } from 'lucide-vue-next'
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
    startHour: '13:30',
    finishingHour: '14:30',
    price: 30,
    type: 'Pedikura',
    name: 'Marija',
  },
  {
    startHour: '15:00',
    finishingHour: '15:30',
    price: 50,
    type: 'Depilacija',
    name: 'Ema',
  },
  {
    startHour: '15:30',
    finishingHour: '16:30',
    price: 25,
    type: 'Trajni lak',
    name: 'Lucija',
  },
  {
    startHour: '17:30',
    finishingHour: '18:30',
    price: 40,
    type: 'Depilacija',
    name: 'Ivana',
  },
  {
    startHour: '18:30',
    finishingHour: '19:00',
    price: 25,
    type: 'Trajni lak',
    name: 'Emanuela',
  },
])

function parseHour(hourStr: string): number {
  const [h, m] = hourStr.split(':').map(Number)
  return h + m / 60
}

const rezItem = (hour: number) => {
  return rezervacije.value.find((item) => {
    const start = parseHour(item.startHour)
    const end = parseHour(item.finishingHour)
    return hour >= start && hour < end
  })
}

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

const createReservationRef = ref<HTMLElement | null>(null)
const createReservationsOpened = ref(false)

const handleCreateReservations = () => {
  createReservationsOpened.value = !createReservationsOpened.value
}
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
                <button class="underline cursor-pointer" @click="showAllReservations">
                  Svi termini
                </button>
              </div>
              <ScrollableContainer>
                <div
                  v-for="hour in Array.from({ length: 11 }, (_, i) => i + 9)"
                  :key="hour"
                  class="min-w-[60px] px-[1px] py-1 border-[#C7C7C7] border-t-[1px] border-b-[1px] text-center text-sm font-medium flex flex-col items-center"
                >
                  {{ hour.toString().padStart(2, '0') }}:00
                  <div
                    v-if="rezItem(hour)"
                    class="w-full h-8 rounded mt-2 relative group bg-[#DC2626]"
                  >
                    <span
                      class="absolute left-1/2 -translate-x-1/2 -top-7 bg-white text-gray-800 px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {{ rezItem(hour)?.startHour }} - {{ rezItem(hour)?.finishingHour }}
                    </span>
                  </div>

                  <div v-else class="w-full h-8 rounded mt-2 bg-green-500"></div>
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
        ref="hideReservationsRef"
        v-if="allReservations"
        class="absolute inset-0 flex flex-col bg-white z-10 rounded-md py-4"
        v-motion="'transition'"
        :initial="{ opacity: 0, translateX: 100 }"
        :enter="{ opacity: 1, translateX: 0 }"
        :leave="{ opacity: 0, translateX: 100 }"
        :duration="200"
      >
        <button class="px-4 py-2 cursor-pointer" @click="hideReservations">
          <img src="../assets/arrow-left.png" alt="" width="20" />
        </button>
        <div class="w-full h-fit flex flex-col px-4 py-2">
          <h3 class="text-[#484848] text-xl font-bold">{{ formattedDay }}. {{ formattedMonth }}</h3>
          <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
        </div>
        <div class="flex flex-col gap-2 pb-4 flex-1 overflow-auto">
          <p class="text-[#484848] px-4">{{ brojMusterija }} mušterija</p>
          <ScrollableContainer class="flex-col px-4 py-1">
            <div v-for="(rezervacija, index) in rezervacije" :key="index">
              <div
                class="shadow-[1px_2px_5px_1px_rgba(0,0,0,0.3)] flex justify-between py-2 px-4 rounded-lg"
              >
                <div class="flex flex-col gap-[2px]">
                  <h1 class="text-black font-medium text-[13px]">
                    {{ rezervacija.type }} {{ rezervacija.name }} ( {{ rezervacija.price }} eura)
                  </h1>
                  <div class="flex gap-2 items-center">
                    <div class="bg-[#F54242] w-[5px] h-[5px] rounded-full"></div>
                    <p class="text-[#454545] text-[11px] font-medium">
                      {{ rezervacija.startHour }} - {{ rezervacija.finishingHour }}
                    </p>
                  </div>
                </div>
                <button class="cursor-pointer">
                  <EllipsisVertical :size="24" class="text-[#444]" />
                </button>
              </div>
            </div>
          </ScrollableContainer>
        </div>
        <div class="flex items-end justify-center h-fit pt-8">
          <button
            class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] shadow-lg relative cursor-pointer"
            @click="handleCreateReservations()"
          >
            <span
              class="absolute -top-[3px] left-1/2 transform -translate-x-1/2 text-4xl font-normal"
            >
              +
            </span>
          </button>
        </div>
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
