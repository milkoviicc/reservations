import { useModal } from '@/composables/useModal'
import type { Appointment } from '@/lib/types'
import { ref } from 'vue'

export const allAppointmentsRef = ref()
export const createAppointmentRef = ref()
export const updateAppointmentRef = ref()

export const allAppointmentsOpened = ref(false)
export const createAppointmentOpened = ref(false)
export const updateAppointmentOpened = ref(false)

export const appointmentToUpdate = ref<Appointment | undefined>()

const { modalStack } = useModal()

export const toggleAllAppointmentsView = (open: boolean | null = null) => {
  const shouldOpen = open !== null ? open : !allAppointmentsOpened.value

  if (shouldOpen) {
    // Open modal
    allAppointmentsOpened.value = true
    modalStack.push('all') // push to stack
    history.pushState({ modalOpen: true, modal: 'all' }, '')
  } else {
    // Close modal with animation
    if (!allAppointmentsRef.value) {
      allAppointmentsOpened.value = false
      modalStack.pop() // remove from stack
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
      allAppointmentsOpened.value = false
      modalStack.pop() // remove from stack
      // Go back in history if last state was this modal
      if (history.state?.modal === 'all') history.back()
    }, 200)
  }
}

export const toggleCreateAppointmentView = (open: boolean | null = null) => {
  const shouldOpen = open !== null ? open : !createAppointmentOpened.value

  if (shouldOpen) {
    createAppointmentOpened.value = true
    modalStack.push('create')
    history.pushState({ modalOpen: true, modal: 'create' }, '')
  } else {
    if (!createAppointmentRef.value) {
      createAppointmentOpened.value = false
      modalStack.pop()
      if (history.state?.modal === 'create') history.back()
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
      createAppointmentOpened.value = false
      modalStack.pop()
      if (history.state?.modal === 'create') history.back()
    }, 200)
  }
}

export const toggleUpdateAppointmentView = (open: boolean | null = null) => {
  const shouldOpen = open !== null ? open : !updateAppointmentOpened.value

  if (shouldOpen) {
    updateAppointmentOpened.value = true
    modalStack.push('update')
    history.pushState({ modalOpen: true, modal: 'update' }, '')
  } else {
    if (!updateAppointmentRef.value) {
      updateAppointmentOpened.value = false
      modalStack.pop()
      if (history.state?.modal === 'update') history.back()
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
      updateAppointmentOpened.value = false
      modalStack.pop()
      if (history.state?.modal === 'update') history.back()
    }, 200)
  }
}

export const handleUpdateAppointment = (appointment: Appointment | undefined) => {
  appointmentToUpdate.value = appointment
  toggleUpdateAppointmentView()
}
