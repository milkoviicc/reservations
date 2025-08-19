import axios from 'axios'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'

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
      const token = Cookies.get('token')
      const user = Cookies.get('user')

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
      Cookies.set('user', JSON.stringify(user), { expires: 2 })
      Cookies.set('token', user.token, { expires: 2 })

      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`
    },

    logout(): void {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      Cookies.remove('user')
      Cookies.remove('token')
    },
  },
})
