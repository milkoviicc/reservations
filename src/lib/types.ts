export interface User {
  id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  token: string
}

export interface Appointment {
  appointmentId: string
  clientFirstName: string
  clientLastName: string
  appointmentType: string
  date: string
  startTime: string
  endTime: string
}
