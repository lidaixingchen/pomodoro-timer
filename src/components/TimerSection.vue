<template>
  <div class="neo-card bg-white h-full flex flex-col items-center justify-between p-6 md:p-8">
    <!-- Section Header / Mode Banner -->
    <div class="w-full text-center pb-4 border-b-3 border-black">
      <h2 class="text-xl md:text-2xl font-black text-black">
        {{ headerText }}
      </h2>
      <p class="text-xs md:text-sm font-bold text-neutral-500 mt-1">
        {{ currentPlan ? `当前选择：${currentPlan.name}` : '请选择一个专注计划' }}
      </p>
    </div>

    <!-- Main Clock Area -->
    <div class="flex-grow flex items-center justify-center py-6 w-full">
      <div v-if="currentPlan">
        <TimerDisplay
          :timeLeft="timeLeft"
          :totalDuration="totalDuration"
          :mode="mode"
          :planName="currentPlan.name"
          :progress="progress"
        />
      </div>
      <div v-else class="text-center py-12 space-y-4">
        <div class="w-20 h-20 border-3 border-black bg-neo-accent shadow-neo rounded-full flex items-center justify-center mx-auto">
          <Info class="w-10 h-10 text-black" />
        </div>
        <p class="font-black text-lg text-black">左侧没有选中计划，请先选择或新建一个计划</p>
      </div>
    </div>

    <!-- Controls Row -->
    <div class="w-full border-t-3 border-black pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
      <template v-if="currentPlan">
        <!-- Idle State -->
        <button 
          v-if="mode === 'idle'" 
          @click="startTimer(currentPlan)"
          class="neo-btn bg-neo-work text-lg py-3 px-10 flex items-center gap-2 w-full sm:w-auto"
        >
          <Play class="w-5 h-5" />
          开始专注
        </button>

        <!-- Running State -->
        <button 
          v-if="isRunning" 
          @click="pauseTimer"
          class="neo-btn bg-neo-accent text-lg py-3 px-10 flex items-center gap-2 w-full sm:w-auto"
        >
          <Pause class="w-5 h-5" />
          暂停计时
        </button>

        <!-- Paused State -->
        <button 
          v-if="!isRunning && mode !== 'idle'" 
          @click="resumeTimer"
          class="neo-btn bg-neo-break text-lg py-3 px-10 flex items-center gap-2 w-full sm:w-auto"
        >
          <Play class="w-5 h-5" />
          继续专注
        </button>

        <!-- Reset/Stop State (Only when active) -->
        <button 
          v-if="mode !== 'idle'" 
          @click="confirmStop"
          class="neo-btn-danger text-lg py-3 px-6 flex items-center gap-2 w-full sm:w-auto"
        >
          <Square class="w-5 h-5" />
          放弃
        </button>

        <!-- Edit Button (Only when idle) -->
        <button 
          v-if="mode === 'idle'" 
          @click="$emit('edit-plan', currentPlan.id)"
          class="neo-btn-secondary text-lg py-3 px-6 flex items-center gap-2 w-full sm:w-auto"
        >
          <Edit2 class="w-5 h-5" />
          编辑计划
        </button>
      </template>
    </div>

    <!-- Completion Modal -->
    <CompletionModal
      :show="showCompletionModal"
      :type="completionType"
      @start-break="startBreak"
      @next-round="nextRound"
      @close="showCompletionModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useTimer } from '../composables/useTimer'
import { usePlanStore } from '../stores/planStore'
import TimerDisplay from './TimerDisplay.vue'
import CompletionModal from './CompletionModal.vue'
import { Play, Pause, Square, Edit2, Info } from 'lucide-vue-next'

const planStore = usePlanStore()
const {
  currentPlan,
  mode,
  timeLeft,
  totalDuration,
  isRunning,
  showCompletionModal,
  completionType,
  progress,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  startBreak,
  nextRound
} = useTimer()

defineEmits<{
  (e: 'edit-plan', id: string): void
}>()

// 同步左侧选中计划到 timer 的 currentPlan (仅当 timer 处于空闲时)
watch(
  () => planStore.selectedPlan,
  (newPlan) => {
    if (mode.value === 'idle' && newPlan) {
      currentPlan.value = newPlan
      timeLeft.value = newPlan.workDuration * 60
      totalDuration.value = newPlan.workDuration * 60
    }
  },
  { immediate: true }
)

const headerText = computed(() => {
  if (mode.value === 'work') return '🎯 保持专注，不要分心'
  if (mode.value === 'break') return '☕ 闭上眼睛，深呼吸'
  return '🍅 准备开始你的专注时间'
})

function confirmStop() {
  if (confirm('确定要放弃当前的专注阶段吗？这不会被记录在统计中。')) {
    stopTimer()
    // 恢复选中计划的数据
    if (planStore.selectedPlan) {
      currentPlan.value = planStore.selectedPlan
      timeLeft.value = planStore.selectedPlan.workDuration * 60
      totalDuration.value = planStore.selectedPlan.workDuration * 60
    }
  }
}
</script>
