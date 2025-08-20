<script setup lang="ts">
import type { User } from '@/lib/types'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useScreen } from '@/composables/useScreen'

const username = ref('')
const password = ref('')

const authStore = useAuthStore()

const { toastPosition } = useScreen()
const toast = useToast()

const handleLogin = async (e: Event) => {
  e.preventDefault()

  if (username.value.length > 0 && password.value.length > 0) {
    try {
      const res = await axios.post('http://91.99.227.117/api/auth/login', {
        userName: username.value,
        password: password.value,
      })

      if (res.status === 200) {
        const user: User = res.data

        authStore.login(user)

        toast.add({
          severity: 'success',
          summary: 'Successful login',
          detail: `Bok ${user.firstName}, dobrodošla.`,
          life: 1500,
        })

        setTimeout(() => {
          window.location.href = '/'
        }, 1500)
      }
    } catch (error) {
      console.log(error)
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: `Pogrešno korisničko ime ili lozinka, molimo pokušajte ponovno.`,
        life: 3000,
      })
    }
  }
}
</script>

<template>
  <main class="w-full h-full flex justify-center items-center bg-white">
    <form
      class="flex flex-col gap-4 justify-center items-center w-full h-full"
      method="POST"
      @submit="handleLogin"
    >
      <input
        type="text"
        placeholder="Korisničko ime"
        class="bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.3)] text-white outline-none rounded-lg px-4 py-3"
        v-model="username"
        required
      />
      <input
        type="password"
        placeholder="Lozinka"
        class="bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.3)] text-white outline-none rounded-lg px-4 py-3"
        v-model="password"
        required
      />
      <input
        type="submit"
        value="Prijavi se"
        class="max-w-[240px] w-full px-2 py-2 bg-green-800 text-white outline-none rounded-full cursor-pointer hover:bg-green-500 transition-all duration-300"
      />
    </form>
  </main>
  <PrimeToast :position="toastPosition" />
</template>
