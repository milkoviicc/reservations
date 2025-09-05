import { defineStore } from 'pinia'

export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    currentDate: new Date() as Date,
  }),
  actions: {
    setDate(date: Date) {
      this.currentDate = date
    },
  },
})
