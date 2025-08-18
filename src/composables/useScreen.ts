import { ref, computed, onMounted, onUnmounted } from 'vue'

const screenWidth = ref<number>(typeof window !== 'undefined' ? window.innerWidth : 0)

function updateWidth() {
  screenWidth.value = window.innerWidth
}

export function useScreen() {
  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })
  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const isMobile = computed(() => screenWidth.value < 640)
  const toastPosition = computed(() => (isMobile.value ? 'top-center' : 'top-right'))

  return {
    screenWidth,
    isMobile,
    toastPosition,
  }
}
