<template>
  <div class="flex flex-col items-center justify-center p-6 md:p-8">
    <!-- Timer Circle Container -->
    <div 
      class="relative w-64 h-64 md:w-80 md:h-80 bg-white border-4 border-black rounded-full flex items-center justify-center shadow-neo"
      :class="modeColorClass"
    >
      <!-- Circular Progress SVG -->
      <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
        <!-- Background Track -->
        <circle 
          cx="100" 
          cy="100" 
          r="84" 
          fill="none" 
          stroke="#E5E7EB" 
          stroke-width="10"
        />
        <!-- Active Progress Ring -->
        <circle 
          cx="100" 
          cy="100" 
          r="84" 
          fill="none" 
          :stroke="strokeColor" 
          stroke-width="12"
          stroke-linecap="square"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          class="transition-all duration-300 ease-out border-2 border-black"
        />
        <!-- Inner Black Border for Progress Ring -->
        <circle 
          cx="100" 
          cy="100" 
          r="90" 
          fill="none" 
          stroke="#000000" 
          stroke-width="3"
        />
        <circle 
          cx="100" 
          cy="100" 
          r="78" 
          fill="none" 
          stroke="#000000" 
          stroke-width="3"
        />
      </svg>

      <!-- Center Text -->
      <div class="relative z-10 text-center flex flex-col items-center justify-center select-none">
        <!-- Mode Label -->
        <span 
          class="border-2 border-black px-2 py-0.5 text-xs font-black uppercase tracking-widest mb-2 shadow-neo-sm"
          :class="badgeColorClass"
        >
          {{ modeLabel }}
        </span>
        <!-- Time String -->
        <span class="text-5xl md:text-6xl font-black text-black font-mono leading-none tracking-tight">
          {{ formattedTime }}
        </span>
        <!-- Selected Plan Name -->
        <span class="text-xs md:text-sm font-black text-black mt-3 max-w-48 truncate border-b-2 border-black pb-0.5">
          {{ planName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TimerMode } from '../types/pomodoro'

const props = defineProps<{
  timeLeft: number
  totalDuration: number
  mode: TimerMode
  planName: string
  progress: number
}>()

const r = 84
const circumference = 2 * Math.PI * r // Approx 527.78

// Computes the offset of the progress circle
const strokeDashoffset = computed(() => {
  if (props.totalDuration === 0) return circumference
  // Ensure progress stays between 0 and 100
  const pct = Math.max(0, Math.min(100, props.progress))
  return circumference - (pct / 100) * circumference
})

// Computes stroke color based on mode
const strokeColor = computed(() => {
  if (props.mode === 'work') return '#FF5A5F' // neo-work
  if (props.mode === 'break') return '#00E676' // neo-break
  return '#FFDE47' // neo-accent (idle)
})

// Container classes to give a slight tint matching work/break
const modeColorClass = computed(() => {
  if (props.mode === 'work') return 'hover:bg-red-50/20'
  if (props.mode === 'break') return 'hover:bg-green-50/20'
  return ''
})

const badgeColorClass = computed(() => {
  if (props.mode === 'work') return 'bg-neo-work'
  if (props.mode === 'break') return 'bg-neo-break'
  return 'bg-neo-accent'
})

const modeLabel = computed(() => {
  if (props.mode === 'work') return '专注中 🍅'
  if (props.mode === 'break') return '休息中 ☕'
  return '就绪 ⏱️'
})

const formattedTime = computed(() => {
  const m = Math.floor(props.timeLeft / 60).toString().padStart(2, '0')
  const s = (props.timeLeft % 60).toString().padStart(2, '0')
  return `${m}:${s}`
})
</script>
