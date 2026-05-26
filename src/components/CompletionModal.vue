<template>
  <div 
    v-if="show" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
  >
    <!-- Modal Card -->
    <div class="neo-card bg-white max-w-md w-full relative overflow-hidden animate-[bounce_0.3s_ease-out]">
      <!-- Accent Top Bar -->
      <div 
        class="h-6 -mx-6 -mt-6 border-b-3 border-black mb-6"
        :class="type === 'work' ? 'bg-neo-work' : 'bg-neo-break'"
      ></div>

      <!-- Icon & Title -->
      <div class="text-center space-y-4">
        <div class="inline-flex p-4 border-3 border-black bg-neo-accent shadow-neo rounded-full">
          <Trophy v-if="type === 'work'" class="w-8 h-8 text-black" />
          <Coffee v-else class="w-8 h-8 text-black" />
        </div>
        
        <h3 class="text-2xl md:text-3xl font-black text-black tracking-tight">
          {{ type === 'work' ? '🎉 专注完成！' : '⚡ 休息结束！' }}
        </h3>
        
        <p class="font-bold text-neutral-600 text-sm md:text-base leading-relaxed">
          {{ 
            type === 'work' 
              ? '工作阶段已结束！您做得很好。现在让大脑放松一下吧？' 
              : '休息时间结束。恢复元气！让我们开启新一轮的高效专注吧。' 
          }}
        </p>
      </div>

      <!-- Action Button -->
      <div class="mt-8 flex flex-col gap-3">
        <button 
          v-if="type === 'work'" 
          @click="$emit('start-break')"
          class="w-full neo-btn bg-neo-break text-lg py-3 flex items-center justify-center gap-2"
        >
          <Coffee class="w-5 h-5" />
          开始休息
        </button>
        <button 
          v-else 
          @click="$emit('next-round')"
          class="w-full neo-btn bg-neo-work text-lg py-3 flex items-center justify-center gap-2"
        >
          <Play class="w-5 h-5" />
          开始下一轮
        </button>
        
        <button 
          @click="$emit('close')" 
          class="w-full neo-btn-secondary py-2 text-sm"
        >
          暂不，先停一下
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy, Coffee, Play } from 'lucide-vue-next'

defineProps<{
  show: boolean
  type: 'work' | 'break'
}>()

defineEmits<{
  (e: 'start-break'): void
  (e: 'next-round'): void
  (e: 'close'): void
}>()
</script>
