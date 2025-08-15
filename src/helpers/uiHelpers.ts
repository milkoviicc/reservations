// Helper: decide the color of the hour based on 15-min precision

import { useAppointments } from '@/composables/useAppointment'

const { dailyAppointments } = useAppointments()
export function getHourStyle(hour: number): Record<string, string> {
  let redStartPercent: number | null = null
  let redEndPercent: number | null = null
  const pxPerMinute = 1

  const hourStartMin = hour * 60
  const hourEndMin = hourStartMin + 60

  let durationMinutes = 0

  dailyAppointments.value.forEach((appt) => {
    const [sh, sm] = appt.startTime.split(':').map(Number)
    const [eh, em] = appt.endTime.split(':').map(Number)

    const apptStart = sh * 60 + sm
    const apptEnd = eh * 60 + em

    const start = new Date(appt.startTime)
    const end = new Date(appt.endTime)

    durationMinutes = (end.getTime() - start.getTime()) / 60000

    // Find overlap within the current hour
    const overlapStart = Math.max(hourStartMin, apptStart)
    const overlapEnd = Math.min(hourEndMin, apptEnd)

    if (overlapEnd > overlapStart) {
      const startPct = ((overlapStart - hourStartMin) / 60) * 100
      const endPct = ((overlapEnd - hourStartMin) / 60) * 100

      redStartPercent = redStartPercent === null ? startPct : Math.min(redStartPercent, startPct)

      redEndPercent = redEndPercent === null ? endPct : Math.max(redEndPercent, endPct)
    }
  })

  if (redStartPercent === null) {
    // Fully free (green)
    return { background: '#89EB7C' }
  }

  // Create gradient from green → red → green
  return {
    background: `linear-gradient(
    to right,
    #89EB7C 0%,
    #89EB7C ${redStartPercent}%,
    #F54242 ${redStartPercent}%,
    #F54242 ${redEndPercent}%,
    #89EB7C ${redEndPercent}%,
    #89EB7C 100%
  )`,
    width: `${durationMinutes * pxPerMinute}px`,
  }
}
