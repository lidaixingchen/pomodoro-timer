import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Plan } from '../types/pomodoro'
import { getStoredPlans, setStoredPlans } from '../utils/storage'

const DEFAULT_PRESETS: Omit<Plan, 'id' | 'createdAt'>[] = [
  { name: '深度专注', type: 'preset', workDuration: 25, breakDuration: 5 },
  { name: '长会议', type: 'preset', workDuration: 50, breakDuration: 10 },
  { name: '快速任务', type: 'preset', workDuration: 15, breakDuration: 3 }
]

export const usePlanStore = defineStore('plan', () => {
  const plans = ref<Plan[]>([])
  const selectedPlanId = ref<string>('')

  // 初始化计划列表
  function initPlans() {
    const stored = getStoredPlans()
    if (stored.length === 0) {
      const initialPlans: Plan[] = DEFAULT_PRESETS.map((p, idx) => ({
        ...p,
        id: `preset-${idx + 1}`,
        createdAt: Date.now() + idx
      }))
      plans.value = initialPlans
      setStoredPlans(initialPlans)
    } else {
      plans.value = stored
    }

    // 默认选中第一个计划
    if (plans.value.length > 0) {
      selectedPlanId.value = plans.value[0].id
    }
  }

  initPlans()

  const selectedPlan = computed(() => {
    return plans.value.find(p => p.id === selectedPlanId.value) || null
  })

  function selectPlan(id: string) {
    if (plans.value.some(p => p.id === id)) {
      selectedPlanId.value = id
    }
  }

  function addPlan(name: string, workDuration: number, breakDuration: number) {
    const newPlan: Plan = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name,
      type: 'custom',
      workDuration,
      breakDuration,
      createdAt: Date.now()
    }
    plans.value.push(newPlan)
    setStoredPlans(plans.value)
    selectedPlanId.value = newPlan.id
  }

  function updatePlan(id: string, name: string, workDuration: number, breakDuration: number) {
    const plan = plans.value.find(p => p.id === id)
    if (plan) {
      plan.name = name
      plan.workDuration = workDuration
      plan.breakDuration = breakDuration
      setStoredPlans(plans.value)
    }
  }

  function deletePlan(id: string) {
    const index = plans.value.findIndex(p => p.id === id)
    if (index !== -1) {
      plans.value.splice(index, 1)
      setStoredPlans(plans.value)

      // 如果删除的是当前选中的计划，则重新选择
      if (selectedPlanId.value === id) {
        if (plans.value.length > 0) {
          selectedPlanId.value = plans.value[0].id
        } else {
          selectedPlanId.value = ''
        }
      }
    }
  }

  function resetToDefaults() {
    // 恢复被删除的默认预设模板，同时保留现有的自定义计划
    const currentPresetNames = plans.value
      .filter(p => p.type === 'preset')
      .map(p => p.name)

    const presetsToRestore: Plan[] = []
    DEFAULT_PRESETS.forEach((preset, idx) => {
      if (!currentPresetNames.includes(preset.name)) {
        presetsToRestore.push({
          ...preset,
          id: `preset-${Date.now()}-${idx}`,
          createdAt: Date.now() + idx
        })
      }
    })

    if (presetsToRestore.length > 0) {
      plans.value = [...plans.value, ...presetsToRestore]
      // 排序，保持预设计划排在最前面
      plans.value.sort((a, b) => {
        if (a.type === 'preset' && b.type !== 'preset') return -1
        if (a.type !== 'preset' && b.type === 'preset') return 1
        return a.createdAt - b.createdAt
      })
      setStoredPlans(plans.value)
    }

    if (!selectedPlanId.value && plans.value.length > 0) {
      selectedPlanId.value = plans.value[0].id
    }
  }

  return {
    plans,
    selectedPlanId,
    selectedPlan,
    selectPlan,
    addPlan,
    updatePlan,
    deletePlan,
    resetToDefaults
  }
})
