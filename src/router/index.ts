import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AllAppointments from '@/views/AllAppointments.vue'
import UpdateAppointments from '@/views/UpdateAppointments.vue'
import CreateAppointments from '@/views/CreateAppointments.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/all-appointments',
      name: 'all appointments',
      component: AllAppointments,
    },
    {
      path: '/create-appointments',
      name: 'create appointments',
      component: CreateAppointments,
    },
    {
      path: '/update-appointments',
      name: 'update appointments',
      component: UpdateAppointments,
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromLocalStorage()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
