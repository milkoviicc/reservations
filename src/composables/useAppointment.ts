// src/composables/useAppointments.ts
import { computed, ref } from 'vue'
import {
  fetchWeeklyAppointments,
  fetchDailyAppointments,
  createAppointmentApi,
  updateAppointmentApi,
  deleteAppointmentApi,
} from '../api/appointments'
import type { Appointment } from '@/lib/types'
import router from '@/router'
import { useAppointmentsStore } from '@/stores/appointments'

const weeklyAppointments = ref<Appointment[]>([])
const dailyAppointments = ref<Appointment[]>([])
const brojMusterija = computed((): number => {
  return dailyAppointments.value.length
})
const appointmentToUpdate = ref<Appointment | undefined>()

export function useAppointments() {
  const store = useAppointmentsStore()
  const getWeeklyAppointments = async (startDate: Date, endTime: Date) => {
    weeklyAppointments.value = await fetchWeeklyAppointments(startDate, endTime)
  }

  const getDailyAppointments = async (date: Date) => {
    dailyAppointments.value = await fetchDailyAppointments(date)

    store.setDate(date)
  }

  const createAppointment = async (newAppointment: {
    clientFirstName: string
    clientLastName: string
    appointmentType: string
    date: string
    startTime: string
    endTime: string
  }) => {
    const res = await createAppointmentApi(newAppointment)
    return res
  }

  const updateAppointment = async (appointment: Appointment) => {
    const res = await updateAppointmentApi(appointment)
    return res
  }

  const deleteAppointment = async (appointmentId: string) => {
    const res = await deleteAppointmentApi(appointmentId)
    return res
  }

  const handleUpdateAppointment = (appointment: Appointment | undefined) => {
    appointmentToUpdate.value = appointment
    router.push('/update-appointment')
  }

  return {
    weeklyAppointments,
    dailyAppointments,
    brojMusterija,
    appointmentToUpdate,
    handleUpdateAppointment,
    getWeeklyAppointments,
    getDailyAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
  }
}
