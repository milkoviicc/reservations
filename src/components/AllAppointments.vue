<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import axios from 'axios'
import ScrollableContainer from './ScrollableContainer.vue'
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue'
import type { Appointment } from '@/lib/types'

const props = defineProps<{
  appointments: Appointment[]
  data: {
    date: Date
    day: number
    month: string
    weekday: string
  }
  allAppointmentsRef: HTMLElement | null
  handleAllAppointments: () => void
  handleCreateAppointments: () => void
  handleUpdateAppointment: (appointment: Appointment) => void
  updateAppointments: (newDate: Date) => void
}>()

const appointments = ref(props.appointments)
const data = props.data
const allAppointmentsRef = ref<HTMLElement | null>(props.allAppointmentsRef)
const handleAllAppointments = props.handleAllAppointments
const handleCreateAppointments = props.handleCreateAppointments
const handleUpdateAppointment = props.handleUpdateAppointment
// const updateAppointments = props.updateAppointments

const emit = defineEmits<{
  (e: 'delete-appointment', appointmentId: string): void
}>()

watch(
  () => props.allAppointmentsRef,
  (newVal) => {
    allAppointmentsRef.value = newVal || null
  },
)

const formattedDay = ref(data.day)
const formattedMonth = ref(data.month)
const formattedWeekday = ref(data.weekday)

const hideAppointments = () => {
  if (!allAppointmentsRef.value) return
  allAppointmentsRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    handleAllAppointments()
  }, 200)
}

const deleteAppointment = async (appointmentId: string) => {
  try {
    const res = await axios.delete(`http://91.99.227.117/api/appointments/${appointmentId}`)

    if (res.status === 200) {
      emit('delete-appointment', appointmentId)
    }
  } catch (error) {
    console.error(error)
  }
}

const updateAppointment = (appointment: Appointment) => {
  handleUpdateAppointment(appointment)
}
</script>

<template>
  <div
    class="h-[100dvh] sm:h-fit sm:min-h-[550px] sm:max-h-[550px] overflow-hidden flex flex-col justify-between"
  >
    <div class="flex flex-col gap-2">
      <button class="px-4 py-2 cursor-pointer" @click="hideAppointments">
        <img src="../assets/arrow-left.png" alt="" width="20" />
      </button>
      <div class="w-full h-fit flex flex-col px-4 py-2">
        <h3 class="text-[#484848] text-xl font-bold">{{ formattedDay }}. {{ formattedMonth }}</h3>
        <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
      </div>
      <div class="flex flex-col gap-2 pb-4 flex-1 overflow-auto">
        <p class="text-[#484848] px-4">{{ appointments.length }} mušterija</p>
        <ScrollableContainer class="flex-col gap-2 px-4 py-1 max-h-[450px] sm:max-h-[300px]">
          <div v-for="appointment in appointments" :key="appointment.appointmentId">
            <div
              class="shadow-[1px_2px_5px_1px_rgba(0,0,0,0.3)] flex justify-between py-2 px-4 rounded-lg"
            >
              <div class="flex flex-col gap-[2px]">
                <h1 class="text-black font-medium text-[13px]">
                  {{ appointment.appointmentType }} {{ appointment.clientFirstName }} (
                  {{ appointment.cost }} eura)
                </h1>
                <div class="flex gap-2 items-center">
                  <div class="bg-[#F54242] w-[5px] h-[5px] rounded-full"></div>
                  <p class="text-[#454545] text-[11px] font-medium">
                    {{ appointment.startTime }} - {{ appointment.endTime }}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger class="cursor-pointer"
                  ><EllipsisVertical :size="24" class="text-[#444]"
                /></DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    @click="deleteAppointment(appointment.appointmentId)"
                    class="cursor-pointer"
                    >Obriši</DropdownMenuItem
                  >
                  <DropdownMenuItem @click="updateAppointment(appointment)" class="cursor-pointer"
                    >Ažuriraj</DropdownMenuItem
                  >
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ScrollableContainer>
      </div>
    </div>
    <div class="flex items-end justify-center h-fit pt-8">
      <button
        class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] shadow-lg relative cursor-pointer"
        @click="handleCreateAppointments()"
      >
        <span class="absolute -top-[3px] left-1/2 transform -translate-x-1/2 text-4xl font-normal">
          +
        </span>
      </button>
    </div>
  </div>
</template>
