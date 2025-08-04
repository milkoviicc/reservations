<script setup lang="ts">
import { onMounted, ref } from 'vue'

const container = ref<HTMLDivElement | null>(null)
let isDown = false
let startX = 0,
  startY = 0,
  scrollLeft = 0,
  scrollTop = 0

const startDrag = (e: MouseEvent) => {
  if (!container.value) return
  isDown = true
  startX = e.pageX - container.value.offsetLeft
  startY = e.pageY - container.value.offsetTop
  scrollLeft = container.value.scrollLeft
  scrollTop = container.value.scrollTop
}

const stopDrag = () => {
  isDown = false
}

const onDrag = (e: MouseEvent) => {
  if (!isDown || !container.value) return
  e.preventDefault()
  const x = e.pageX - container.value.offsetLeft
  const y = e.pageY - container.value.offsetTop
  const walkX = (x - startX) * 1.5
  const walkY = (y - startY) * 1.5
  container.value.scrollLeft = scrollLeft - walkX
  container.value.scrollTop = scrollTop - walkY
}
onMounted(() => {
  if (!container.value) return

  container.value.addEventListener(
    'wheel',
    (e) => {
      // Only scroll horizontally if the container can scroll sideways
      if (e.deltaY !== 0 && container.value!.scrollWidth > container.value!.clientWidth) {
        e.preventDefault()
        container.value!.scrollLeft += e.deltaY
      }
    },
    { passive: false },
  )
})
</script>

<template>
  <div
    ref="container"
    class="flex overflow-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
    @mousemove="onDrag"
  >
    <slot />
  </div>
</template>
