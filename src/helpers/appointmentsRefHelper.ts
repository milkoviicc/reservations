import type { Appointment } from '@/lib/types'
import router from '@/router'
import { ref } from 'vue'

export const appointmentToUpdate = ref<Appointment | undefined>()

export const handleUpdateAppointment = (appointment: Appointment | undefined) => {
  appointmentToUpdate.value = appointment
  if (window.history.length > 1) {
    router.back()
  } else if (appointment) {
    router.push('/update-appointments')
  } else {
    router.push('/')
  }
}
