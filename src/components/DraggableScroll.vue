<script setup lang="ts">
import { ref, defineProps } from 'vue'

const props = defineProps<{
  rezervacije: Array<{ startHour: string; finishingHour: string; color: string }>
}>()

const rezervacije = props.rezervacije

function parseHour(hourStr: string): number {
  const [h, m] = hourStr.split(':').map(Number)
  return h + m / 60
}

const rezItem = (hour: number) => {
  return rezervacije.find((item) => {
    const start = parseHour(item.startHour)
    const end = parseHour(item.finishingHour)
    return hour >= start && hour < end
  })
}

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
</script>
<template>
  <div
    ref="container"
    class="flex py-2 overflow-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
    @mousemove="onDrag"
  >
    <div
      v-for="hour in Array.from({ length: 11 }, (_, i) => i + 9)"
      :key="hour"
      class="min-w-[60px] px-[1px] py-1 bg-gray-100 rounded text-center text-sm font-medium flex flex-col items-center"
    >
      {{ hour.toString().padStart(2, '0') }}:00
      <div
        v-if="rezItem(hour)"
        class="w-full h-8 rounded mt-2 relative group"
        :style="{ backgroundColor: rezItem(hour)?.color }"
      >
        <span
          class="absolute left-1/2 -translate-x-1/2 -top-7 bg-white text-gray-800 px-2 py-1 rounded shadow text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          {{ rezItem(hour)?.startHour }} - {{ rezItem(hour)?.finishingHour }}
        </span>
      </div>

      <div v-else class="w-full h-8 rounded mt-2 bg-gray-300"></div>
    </div>
  </div>
</template>
