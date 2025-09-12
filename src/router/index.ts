import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AllAppointments from '@/views/AllAppointments.vue'
import UpdateAppointment from '@/views/UpdateAppointment.vue'
import CreateAppointment from '@/views/CreateAppointment.vue'
// import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      /*meta: {
        requiresAuth: true,
      }, */
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      /*meta: {
        requiresAuth: false,
      }, */
    },
    {
      path: '/all-appointments',
      name: 'all appointment',
      component: AllAppointments,
      /*meta: {
        requiresAuth: true,
      }, */
    },
    {
      path: '/create-appointment',
      name: 'create appointment',
      component: CreateAppointment,
      /*meta: {
        requiresAuth: true,
      }, */
    },
    {
      path: '/update-appointment',
      name: 'update appointment',
      component: UpdateAppointment,
      /*meta: {
        requiresAuth: true,
      }, */
    },
  ],
})
/*
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromLocalStorage()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (!to.meta.requiresAuth && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})
*/

export default router
