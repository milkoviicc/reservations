import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AllAppointments from '@/views/AllAppointments.vue'
import UpdateAppointments from '@/views/UpdateAppointment.vue'
import CreateAppointments from '@/views/CreateAppointment.vue'
// import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      /* meta: {
        requiresAuth: true,
      }, */
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
      path: '/create-appointment',
      name: 'create appointment',
      component: CreateAppointments,
    },
    {
      path: '/update-appointment',
      name: 'update appointment',
      component: UpdateAppointments,
    },
  ],
})

/* router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromLocalStorage()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
}) */

export default router
