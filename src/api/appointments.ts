import { formatForApi } from '@/helpers/dataHelpers'
import type { Appointment } from '@/lib/types'
import axios from 'axios'

// src/api/appointments.ts
export const fetchWeeklyAppointments = async (startDate: Date, endDate: Date) => {
  try {
    const res = await axios.get(
      `http://91.99.227.117/api/appointments/date-range?startDate=${formatForApi(startDate)}&endDate=${formatForApi(endDate)}`,
    )
    if (res.status === 200) {
      return res.data
    }
  } catch {
    throw new Error('Failed to fetch weekly appointments')
  }
}

export const fetchDailyAppointments = async (date: Date) => {
  const formattedDate = date.toISOString().split('T')[0]
  try {
    const res = await axios.get(`http://91.99.227.117/api/appointments/date/${formattedDate}`)

    if (res.status === 200) {
      return res.data
    }
  } catch {
    throw new Error('Failed to fetch dailly appointments')
  }
}

export const createAppointmentApi = async (newAppointment: {
  clientFirstName: string
  clientLastName: string
  appointmentType: string
  date: string
  startTime: string
  endTime: string
}) => {
  try {
    const res = await axios.post('http://91.99.227.117/api/appointments', newAppointment)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error
    }
    throw new Error('Failed to fetch appointments')
  }
}

export const updateAppointmentApi = async (appointment: Appointment) => {
  try {
    const res = await axios.put('http://91.99.227.117/api/appointments', appointment)
    return res
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error
    }
    throw new Error('Failed to update appointment')
  }
}

export const deleteAppointmentApi = async (appointmentId: string) => {
  try {
    const res = await axios.delete(`http://91.99.227.117/api/appointments/${appointmentId}`)
    return res.status
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error
    }
    throw new Error('Failed to delete appointment')
  }
}
