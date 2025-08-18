<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import ScrollableContainer from './ScrollableContainer.vue'
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue'
import { useToast } from 'primevue/usetoast'
import { useAppointments } from '@/composables/useAppointment'
import {
  allAppointmentsRef,
  handleUpdateAppointment,
  toggleAllAppointmentsView,
  togleCreateAppointmentView,
} from '@/helpers/appointmentsRefHelper'
import { useScreen } from '@/composables/useScreen'

const props = defineProps<{
  data: {
    date: Date
    day: number
    month: string
    weekday: string
  }
}>()

const data = props.data

const { dailyAppointments, deleteAppointment } = useAppointments()

watch(
  () => allAppointmentsRef,
  (newVal) => {
    allAppointmentsRef.value = newVal || null
  },
)

const { toastPosition } = useScreen()

const formattedDay = ref(data.day)
const formattedMonth = ref(data.month)
const formattedWeekday = ref(data.weekday)

const toast = useToast()

const hideAppointments = () => {
  toggleAllAppointmentsView()
}

const callDeleteAppointment = async (appointmentId: string) => {
  const res = await deleteAppointment(appointmentId)
  if (res === 200) {
    toast.add({
      severity: 'success',
      summary: 'Uspjeh!',
      detail: `Uspješno si obrisala postojeći termin.`,
      life: 2500,
    })
    setTimeout(() => {
      dailyAppointments.value = dailyAppointments.value.filter(
        (appt) => appt.appointmentId !== appointmentId,
      )
      toggleAllAppointmentsView()
    }, 2500)
  }
}
</script>

<template>
  <div class="h-[100dvh] sm:h-fit sm:min-h-[650px] overflow-hidden flex flex-col justify-between">
    <PrimeToast :position="toastPosition" />
    <div class="flex flex-col gap-2 h-full flex-1">
      <button class="px-4 py-2 cursor-pointer" @click="hideAppointments">
        <img src="../assets/arrow-left.png" alt="" width="28" />
      </button>
      <div class="w-full h-fit flex flex-col px-4 pt-16 sm:pt-8">
        <h3 class="text-[#484848] text-3xl font-bold leading-6">
          {{ formattedDay }}. {{ formattedMonth }}
        </h3>
        <p class="font-semibold text-lg text-[#484848]">{{ formattedWeekday }}</p>
      </div>
      <div class="h-full flex flex-col justify-center gap-2 pb-4 flex-1 overflow-hidden">
        <p class="text-[#484848] px-4">{{ dailyAppointments.length }} mušterija</p>
        <ScrollableContainer class="flex-1 flex-col max-h-[320px] gap-2 px-4 py-1">
          <div v-for="appointment in dailyAppointments" :key="appointment.appointmentId">
            <div
              class="shadow-[1px_1px_5px_0px_rgba(0,0,0,0.5)] flex justify-between py-2 px-4 rounded-lg"
            >
              <div class="flex flex-col gap-[2px]">
                <h1 class="text-black font-medium text-[13px]">
                  {{ appointment.appointmentType }} {{ appointment.clientFirstName }}
                  {{ appointment.clientLastName }}
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
                    @click="callDeleteAppointment(appointment.appointmentId)"
                    class="cursor-pointer"
                    >Obriši</DropdownMenuItem
                  >
                  <DropdownMenuItem
                    @click="handleUpdateAppointment(appointment)"
                    class="cursor-pointer"
                    >Ažuriraj</DropdownMenuItem
                  >
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </ScrollableContainer>
      </div>
    </div>
    <div class="flex items-end justify-center h-fit py-4">
      <button
        class="bg-[#F54242] text-white w-[40px] h-[40px] rounded-[17px] shadow-[0_5px_5px_0_rgba(0,0,0,0.25)] relative cursor-pointer"
        @click="togleCreateAppointmentView()"
      >
        <span
          class="absolute top-0 sm:-top-[3px] left-1/2 transform -translate-x-1/2 text-4xl font-normal"
        >
          +
        </span>
      </button>
    </div>
  </div>
</template>
