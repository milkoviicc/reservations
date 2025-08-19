<script setup lang="ts">
import { EllipsisVertical } from 'lucide-vue-next'
import ScrollableContainer from './ScrollableContainer.vue'
import DropdownMenuTrigger from './ui/dropdown-menu/DropdownMenuTrigger.vue'
import DropdownMenuContent from './ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from './ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenu from './ui/dropdown-menu/DropdownMenu.vue'
import { useToast } from 'primevue/usetoast'
import { useAppointments } from '@/composables/useAppointment'
import { handleUpdateAppointment } from '@/helpers/appointmentsRefHelper'
import { useScreen } from '@/composables/useScreen'
import { getAppointmentText, getFormattedDateParts } from '@/helpers/dataHelpers'
import router from '@/router'

const { dailyAppointments, deleteAppointment } = useAppointments()

const { toastPosition } = useScreen()
const { currentDate } = useAppointments()

const toast = useToast()

const hideAppointments = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
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
      hideAppointments()
    }, 2500)
  }
}
</script>

<template>
  <main
    class="w-full h-full flex justify-center items-center"
    v-motion="'transition'"
    :initial="{ opacity: 0 }"
    :enter="{ opacity: 1 }"
    :leave="{ opacity: 0 }"
    :duration="500"
  >
    <div
      class="flex flex-col justify-between w-full sm:max-w-[600px] h-full sm:max-h-[90%] bg-white"
    >
      <PrimeToast :position="toastPosition" />
      <div class="flex flex-col gap-2 h-full flex-1">
        <button class="px-4 py-2 cursor-pointer" @click="hideAppointments">
          <img src="../assets/arrow-left.png" alt="" width="28" />
        </button>
        <div class="w-full h-fit flex flex-col px-4 pt-16 sm:pt-8">
          <h3 class="text-[#484848] text-3xl font-bold leading-6">
            {{ getFormattedDateParts(currentDate).day }}.
            {{ getFormattedDateParts(currentDate).month }}
          </h3>
          <p class="font-semibold text-lg text-[#484848]">
            {{ getFormattedDateParts(currentDate).weekday }}
          </p>
        </div>
        <div class="h-full flex flex-col justify-center gap-2 pb-4 flex-1 overflow-hidden">
          <p class="text-[#484848] px-4">
            {{ dailyAppointments.length }} {{ getAppointmentText(dailyAppointments.length) }}
          </p>
          <ScrollableContainer class="flex-1 flex-col max-h-[320px] gap-2 px-4 py-1">
            <div v-for="appointment in dailyAppointments" :key="appointment.appointmentId">
              <div
                class="shadow-[1px_3px_4px_1px_rgba(0,0,0,0.25)] flex justify-between py-2 px-4 rounded-lg"
              >
                <div class="flex flex-col gap-[2px]">
                  <h1 class="text-black font-medium text-[13px]">
                    {{ appointment.appointmentType }} - {{ appointment.clientFirstName }}
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
      <div class="flex justify-center h-[100px] sm:h-fit items-end sm:items-start pb-4 sm:py-2">
        <button
          class="bg-[#F54242] text-white w-[50px] h-[45px] rounded-[17px] !text-5xl plus !font-semibold shadow-[0_5px_5px_0_rgba(0,0,0,0.25)]"
          @click="router.push('/create-appointments')"
        >
          +
        </button>
      </div>
    </div>
  </main>
</template>
