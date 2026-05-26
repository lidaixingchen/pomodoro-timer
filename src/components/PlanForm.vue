<template>
  <div class="neo-card bg-white h-full flex flex-col">
    <!-- Header -->
    <div class="pb-4 mb-6 border-b-3 border-black flex items-center gap-2">
      <h2 class="text-xl md:text-2xl font-black text-black">
        {{ isEdit ? '✏️ 编辑计划' : '✨ 新建计划' }}
      </h2>
    </div>

    <!-- Form Fields -->
    <form @submit.prevent="savePlan" class="flex-grow space-y-6">
      <!-- Plan Name -->
      <div class="flex flex-col gap-2">
        <label for="plan-name" class="font-black text-black text-base flex items-center gap-2">
          计划名称
          <span class="text-red-500">*</span>
        </label>
        <input 
          id="plan-name"
          v-model="name"
          type="text" 
          placeholder="例如：写作、背单词、摸鱼中..."
          class="neo-input w-full"
          required
        />
        <p v-if="errors.name" class="text-red-500 text-xs font-bold mt-1">{{ errors.name }}</p>
      </div>

      <!-- Durations Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Work Duration -->
        <div class="flex flex-col gap-2">
          <label for="work-duration" class="font-black text-black text-base flex items-center gap-2">
            工作时长 (分钟)
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input 
              id="work-duration"
              v-model.number="workDuration"
              type="number" 
              min="1"
              max="180"
              class="neo-input w-full pr-12"
              required
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-neutral-500 text-sm">MIN</span>
          </div>
          <p v-if="errors.workDuration" class="text-red-500 text-xs font-bold mt-1">{{ errors.workDuration }}</p>
        </div>

        <!-- Break Duration -->
        <div class="flex flex-col gap-2">
          <label for="break-duration" class="font-black text-black text-base flex items-center gap-2">
            休息时长 (分钟)
            <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input 
              id="break-duration"
              v-model.number="breakDuration"
              type="number" 
              min="1"
              max="60"
              class="neo-input w-full pr-12"
              required
            />
            <span class="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-neutral-500 text-sm">MIN</span>
          </div>
          <p v-if="errors.breakDuration" class="text-red-500 text-xs font-bold mt-1">{{ errors.breakDuration }}</p>
        </div>
      </div>

      <!-- Action buttons -->
      <div class="flex flex-col md:flex-row gap-4 pt-4 border-t-3 border-black">
        <button 
          type="submit" 
          class="flex-1 neo-btn bg-neo-accent text-lg py-3"
        >
          保存计划
        </button>
        <button 
          type="button" 
          @click="$emit('cancel')"
          class="flex-grow md:flex-none neo-btn-secondary text-lg py-3 px-8"
        >
          取消
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePlanStore } from '../stores/planStore'

const props = defineProps<{
  planId?: string
}>()

const emit = defineEmits<{
  (e: 'saved'): void
  (e: 'cancel'): void
}>()

const planStore = usePlanStore()

const name = ref('')
const workDuration = ref(25)
const breakDuration = ref(5)

const errors = ref({
  name: '',
  workDuration: '',
  breakDuration: ''
})

const isEdit = computed(() => !!props.planId)

onMounted(() => {
  if (props.planId) {
    const plan = planStore.plans.find(p => p.id === props.planId)
    if (plan) {
      name.value = plan.name
      workDuration.value = plan.workDuration
      breakDuration.value = plan.breakDuration
    }
  }
})

function validate(): boolean {
  let valid = true
  errors.value = { name: '', workDuration: '', breakDuration: '' }

  if (!name.value.trim()) {
    errors.value.name = '请输入计划名称'
    valid = false
  }

  if (!workDuration.value || workDuration.value <= 0) {
    errors.value.workDuration = '工作时间必须大于 0 分钟'
    valid = false
  } else if (workDuration.value > 180) {
    errors.value.workDuration = '工作时间不能超过 180 分钟'
    valid = false
  }

  if (!breakDuration.value || breakDuration.value <= 0) {
    errors.value.breakDuration = '休息时间必须大于 0 分钟'
    valid = false
  } else if (breakDuration.value > 60) {
    errors.value.breakDuration = '休息时间不能超过 60 分钟'
    valid = false
  }

  return valid
}

function savePlan() {
  if (!validate()) return

  if (isEdit.value && props.planId) {
    planStore.updatePlan(props.planId, name.value.trim(), workDuration.value, breakDuration.value)
  } else {
    planStore.addPlan(name.value.trim(), workDuration.value, breakDuration.value)
  }

  emit('saved')
}
</script>
