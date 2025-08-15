import type { Appointment } from '@/lib/types'
import { ref } from 'vue'

export const allAppointmentsRef = ref()
export const createAppointmentRef = ref()
export const updateAppointmentRef = ref()

export const allAppointmentsOpened = ref(false)
export const createAppointmentOpened = ref(false)
export const updateAppointmentOpened = ref(false)

export const appointmentToUpdate = ref<Appointment | undefined>()

export const toggleAllAppointmentsView = () => {
  if (!allAppointmentsRef.value) {
    allAppointmentsOpened.value = !allAppointmentsOpened.value
    return
  }

  allAppointmentsRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    allAppointmentsOpened.value = !allAppointmentsOpened.value
  }, 200)
}

export const togleCreateAppointmentView = () => {
  if (!createAppointmentRef.value) {
    createAppointmentOpened.value = !createAppointmentOpened.value
    return
  }
  createAppointmentRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    createAppointmentOpened.value = !createAppointmentOpened.value
  }, 200)
}

export const toggleUpdateAppointmentView = () => {
  if (!updateAppointmentRef.value) {
    updateAppointmentOpened.value = !updateAppointmentOpened.value
    return
  }
  updateAppointmentRef.value.classList.add(
    '!opacity-0',
    'transform',
    'translate-x-[100px]',
    'transition-all',
    'duration-200',
  )
  setTimeout(() => {
    updateAppointmentOpened.value = !updateAppointmentOpened.value
  }, 200)
}

export const handleUpdateAppointment = (appointment: Appointment | undefined) => {
  appointmentToUpdate.value = appointment
  toggleUpdateAppointmentView()
}
