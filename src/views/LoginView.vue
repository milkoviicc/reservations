<script setup lang="ts">
import type { User } from '@/lib/types'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'
import { ref } from 'vue'

const username = ref('')
const password = ref('')

const authStore = useAuthStore()

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

        window.location.href = '/'
      }
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <form class="flex flex-col gap-2" method="POST" @submit="handleLogin">
    <input
      type="text"
      placeholder="Korisničko ime"
      class="bg-black text-white outline-none rounded-lg px-2"
      v-model="username"
    />
    <input
      type="password"
      placeholder="Lozinka"
      class="bg-black text-white outline-none rounded-lg px-2"
      v-model="password"
    />
    <input
      type="submit"
      value="Prijavi se"
      class="px-2 py-2 bg-black text-white outline-none rounded-full cursor-pointer hover:bg-green-500 transition-all duration-300"
    />
  </form>
</template>
