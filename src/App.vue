<template>
  <div class="min-h-screen bg-neo-bg text-black font-sans pb-12 flex flex-col">
    <!-- Header -->
    <header class="border-b-4 border-black bg-neo-accent p-4 md:p-6 shadow-[0_4px_0_0_#000] mb-6 md:mb-10">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 class="text-2xl md:text-3xl font-black text-black tracking-wider text-center sm:text-left flex items-center gap-2">
          🍅 粗野主义番茄钟 / POMODORO
        </h1>
        <p class="text-xs md:text-sm font-black text-black bg-white border-2 border-black px-3 py-1 shadow-neo-sm">
          💡 专注工作，放松生活
        </p>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="max-w-7xl w-full mx-auto px-4 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      <!-- Left Column: Plan list (Grid: 3 cols) -->
      <div class="lg:col-span-3 h-full">
        <PlanList @create-plan="handleCreatePlan" />
      </div>

      <!-- Middle Column: Timer or Editor Form (Grid: 5 cols) -->
      <div class="lg:col-span-5 h-full">
        <transition name="fade" mode="out-in">
          <div v-if="activeView === 'timer'" class="h-full">
            <TimerSection @edit-plan="handleEditPlan" />
          </div>
          <div v-else class="h-full">
            <PlanForm 
              :planId="editingPlanId" 
              @saved="handleFormSaved" 
              @cancel="handleFormCancel" 
            />
          </div>
        </transition>
      </div>

      <!-- Right Column: Stats panel (Grid: 4 cols) -->
      <div class="lg:col-span-4 h-full">
        <StatsPanel />
      </div>

    </main>

    <!-- Footer -->
    <footer class="max-w-7xl w-full mx-auto px-4 mt-12 text-center">
      <div class="inline-block border-3 border-black bg-white p-3 font-bold text-xs md:text-sm shadow-neo">
        🍅 极简番茄工作法：专注 25 分钟，休息 5 分钟。循环往复，高效专注。
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PlanList from './components/PlanList.vue'
import TimerSection from './components/TimerSection.vue'
import PlanForm from './components/PlanForm.vue'
import StatsPanel from './components/StatsPanel.vue'

const activeView = ref<'timer' | 'create' | 'edit'>('timer')
const editingPlanId = ref<string | undefined>(undefined)

function handleCreatePlan() {
  editingPlanId.value = undefined
  activeView.value = 'create'
}

function handleEditPlan(id: string) {
  editingPlanId.value = id
  activeView.value = 'edit'
}

function handleFormSaved() {
  activeView.value = 'timer'
  editingPlanId.value = undefined
}

function handleFormCancel() {
  activeView.value = 'timer'
  editingPlanId.value = undefined
}
</script>

<style>
/* Transition Fade effects */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
