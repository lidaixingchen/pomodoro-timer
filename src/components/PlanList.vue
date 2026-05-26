<template>
  <div class="flex flex-col h-full bg-white border-3 border-black p-4 md:p-6 shadow-neo">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 pb-4 border-b-3 border-black">
      <h2 class="text-xl md:text-2xl font-black tracking-tight">⏱️ 计划列表</h2>
      <button 
        @click="$emit('create-plan')" 
        class="neo-btn p-2 flex items-center justify-center bg-neo-accent"
        title="新建计划"
      >
        <Plus class="w-5 h-5" />
      </button>
    </div>

    <!-- Plans scrollable list -->
    <div class="flex-grow overflow-y-auto space-y-4 pr-1 max-h-[400px] md:max-h-[600px]">
      <div 
        v-for="plan in planStore.plans" 
        :key="plan.id"
        @click="planStore.selectPlan(plan.id)"
        class="border-3 border-black p-4 cursor-pointer transition-all hover:bg-neutral-50"
        :class="[
          planStore.selectedPlanId === plan.id 
            ? 'bg-neo-accent/10 translate-x-1 translate-y-1 shadow-[2px_2px_0px_0px_#000]' 
            : 'bg-white shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-lg'
        ]"
      >
        <div class="flex justify-between items-start gap-2">
          <!-- Text info -->
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-black text-lg text-black">{{ plan.name }}</span>
              <span 
                v-if="plan.type === 'preset'" 
                class="border-2 border-black bg-neo-accent text-xs font-black px-1.5 py-0.5 uppercase tracking-wide"
              >
                预设
              </span>
              <span 
                v-else 
                class="border-2 border-black bg-neo-custom text-xs font-black px-1.5 py-0.5 uppercase tracking-wide"
              >
                自定义
              </span>
            </div>
            
            <div class="flex items-center gap-4 mt-2 text-sm font-bold text-neutral-600">
              <span class="flex items-center gap-1">
                <Clock class="w-4 h-4 text-black" />
                专注: {{ plan.workDuration }}m
              </span>
              <span class="flex items-center gap-1">
                <Coffee class="w-4 h-4 text-black" />
                休息: {{ plan.breakDuration }}m
              </span>
            </div>
          </div>

          <!-- Actions -->
          <button 
            @click.stop="confirmDelete(plan)"
            class="p-2 border-2 border-black hover:bg-red-400 active:bg-red-500 transition-colors"
            title="删除计划"
          >
            <Trash2 class="w-4 h-4 text-black" />
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div 
        v-if="planStore.plans.length === 0" 
        class="border-3 border-dashed border-black p-8 text-center text-neutral-500 font-bold"
      >
        暂无计划，点击右上角新建一个吧！
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="mt-6 pt-4 border-t-3 border-black">
      <button 
        @click="planStore.resetToDefaults"
        class="w-full neo-btn-secondary py-3 flex items-center justify-center gap-2 text-sm"
      >
        <RotateCcw class="w-4 h-4" />
        恢复默认预设
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlanStore } from '../stores/planStore'
import { Plus, Trash2, Clock, Coffee, RotateCcw } from 'lucide-vue-next'
import type { Plan } from '../types/pomodoro'

const planStore = usePlanStore()

defineEmits<{
  (e: 'create-plan'): void
}>()

function confirmDelete(plan: Plan) {
  if (confirm(`确认要删除计划“${plan.name}”吗？`)) {
    planStore.deletePlan(plan.id)
  }
}
</script>

<style scoped>
/* Custom scrollbar for Neobrutalist design */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #FFFDF6;
  border-left: 3px solid #000;
}
::-webkit-scrollbar-thumb {
  background: #000;
  border: 2px solid #FFFDF6;
}
</style>
