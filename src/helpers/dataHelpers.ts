import type { Appointment } from '@/lib/types'

// Hours for the main timeline (like your code)
export const hours = Array.from({ length: 11 }, (_, i) => i + 9) // 9 → 19

export const formatForApi = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const getAppointment = (appointments: Appointment[], hour: number) => {
  return appointments.find((app) => {
    const [startH, startM] = app.startTime.split(':').map(Number)
    const [endH, endM] = app.endTime.split(':').map(Number)

    const slotStart = hour * 60 // slot start in minutes
    const slotEnd = (hour + 1) * 60 // slot end in minutes

    const appStart = startH * 60 + startM
    const appEnd = endH * 60 + endM

    // Match if appointment overlaps the slot
    return appStart < slotEnd && appEnd > slotStart
  })
}

export const getFormattedDateParts = (date: Date) => {
  const day = date.getDate() // e.g., 15

  const month = date.toLocaleDateString('hr-HR', {
    month: 'long',
  })

  const weekday = date.toLocaleDateString('hr-HR', {
    weekday: 'long',
  })

  const year = date.toLocaleDateString('hr-HR', {
    year: 'numeric',
  })

  const uppercase = (str: string) => str.toUpperCase()

  return {
    day,
    month: uppercase(month),
    weekday: uppercase(weekday),
    year: year,
  }
}

export const getDate = (date: Date) => {
  console.log(date)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  console.log(day, year, month)
  return { day, year, month }
}

export function timeToMinutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export function getAppointmentText(brojTermina: number): string {
  const lastDigit = brojTermina % 10
  const lastTwoDigits = brojTermina % 100

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return 'termin'
  }
  return 'termina'
}
