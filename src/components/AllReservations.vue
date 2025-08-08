<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { defineProps } from 'vue'
import ScrollableContainer from './ScrollableContainer.vue'
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue'

const props = defineProps<{
  allReservationsRef: HTMLElement | null
  handleAllReservations: () => void
  handleCreateReservations: () => void
  handleUpdateReservation: (id: number | null) => void
}>()

const allReservationsRef = ref<HTMLElement | null>(props.allReservationsRef)
const handleAllReservations = props.handleAllReservations
const handleCreateReservations = props.handleCreateReservations
const handleUpdateReservation = props.handleUpdateReservation

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

const date = ref(new Date())

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

  updateBrojMusterija(day, month, newDate.getFullYear())
}
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

const hideReservations = () => {
  if (!allReservationsRef.value) return
  allReservationsRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    handleAllReservations()
  }, 200)
}

const deleteReservation = async (id: number) => {
  try {
    const res = await axios.delete(`http://91.99.227.117/api/appointments/${id}`)

    if (res.status === 200) {
      console.log('appointment deleted')
    }
  } catch (error) {
    console.error(error)
  }
}

const updateReservation = (id: number) => {
  handleUpdateReservation(id)
}
</script>

<template>
  <div class="flex flex-col">
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
            <DropdownMenu>
              <DropdownMenuTrigger class="cursor-pointer"
                ><EllipsisVertical :size="24" class="text-[#444]"
              /></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem @click="deleteReservation(index)" class="cursor-pointer"
                  >Obriši</DropdownMenuItem
                >
                <DropdownMenuItem @click="updateReservation(index)" class="cursor-pointer"
                  >Ažuriraj</DropdownMenuItem
                >
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </ScrollableContainer>
    </div>
    <div class="flex items-end justify-center h-fit pt-8">
      <button
        class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] shadow-lg relative cursor-pointer"
        @click="handleCreateReservations()"
      >
        <span class="absolute -top-[3px] left-1/2 transform -translate-x-1/2 text-4xl font-normal">
          +
        </span>
      </button>
    </div>
  </div>
</template>
