import {
  allAppointmentsOpened,
  createAppointmentOpened,
  updateAppointmentOpened,
} from '@/helpers/appointmentsRefHelper'

export function useModal() {
  const modalStack: string[] = []

  function openModal(modal: 'all' | 'create' | 'update') {
    if (modal === 'all') allAppointmentsOpened.value = true
    if (modal === 'create') createAppointmentOpened.value = true
    if (modal === 'update') updateAppointmentOpened.value = true

    // Push to modal stack and browser history
    modalStack.push(modal)
    history.pushState({ modalOpen: true, modal }, '')
  }

  function closeModal(modal: 'all' | 'create' | 'update') {
    if (modal === 'all') allAppointmentsOpened.value = false
    if (modal === 'create') createAppointmentOpened.value = false
    if (modal === 'update') updateAppointmentOpened.value = false

    // Pop from stack if we close manually
    const idx = modalStack.lastIndexOf(modal)
    if (idx !== -1) modalStack.splice(idx, 1)

    // Go back in history if needed
    if (history.state?.modalOpen) history.back()
  }

  return {
    modalStack,
    openModal,
    closeModal,
  }
}
