import axios from 'axios'
import { defineStore } from 'pinia'

interface User {
  id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  token: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    token: null,
  }),

  actions: {
    loadFromLocalStorage(): void {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        try {
          this.user = JSON.parse(user) as User
          this.token = token
          this.isAuthenticated = true
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch {
          this.user = null
          this.token = null
          this.isAuthenticated = false
        }
      } else {
        this.isAuthenticated = false
        this.token = null
        this.user = null
      }
    },

    login(user: User): void {
      this.user = user
      this.token = user.token
      this.isAuthenticated = true
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)

      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    },

    logout(): void {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
  },
})
