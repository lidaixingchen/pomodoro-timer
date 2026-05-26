import { ref, computed, watch } from 'vue'
import type { Plan } from '../types/pomodoro'
import { useSessionStore } from '../stores/sessionStore'

// 使用共享的全局响应式变量以确保单例模式
const currentPlan = ref<Plan | null>(null)
const mode = ref<'idle' | 'work' | 'break'>('idle')
const timeLeft = ref<number>(0)
const totalDuration = ref<number>(0)
const isRunning = ref<boolean>(false)
const showCompletionModal = ref<boolean>(false)
const completionType = ref<'work' | 'break'>('work')

let timerInterval: number | null = null

export function useTimer() {
  const sessionStore = useSessionStore()

  const progress = computed(() => {
    if (totalDuration.value === 0) return 0
    return ((totalDuration.value - timeLeft.value) / totalDuration.value) * 100
  })

  // 请求浏览器通知权限
  function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission()
    }
  }

  // 播放合成音效（使用 Web Audio API，无需音频资源依赖）
  function playSound(type: 'work' | 'break') {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      if (type === 'work') {
        // 双声高音哔哔声 (工作结束)
        osc.frequency.setValueAtTime(880, ctx.currentTime) // A5 键
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        osc.start()
        osc.stop(ctx.currentTime + 0.15)
        
        setTimeout(() => {
          const osc2 = ctx.createOscillator()
          const gain2 = ctx.createGain()
          osc2.connect(gain2)
          gain2.connect(ctx.destination)
          osc2.frequency.setValueAtTime(880, ctx.currentTime)
          gain2.gain.setValueAtTime(0.08, ctx.currentTime)
          osc2.start()
          osc2.stop(ctx.currentTime + 0.15)
        }, 200)
      } else {
        // 旋律和弦钟声 (休息结束)
        osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        osc.start()
        osc.stop(ctx.currentTime + 0.2)
        
        setTimeout(() => {
          const osc2 = ctx.createOscillator()
          const gain2 = ctx.createGain()
          osc2.connect(gain2)
          gain2.connect(ctx.destination)
          osc2.frequency.setValueAtTime(783.99, ctx.currentTime) // G5
          gain2.gain.setValueAtTime(0.08, ctx.currentTime)
          osc2.start()
          osc2.stop(ctx.currentTime + 0.3)
        }, 200)
      }
    } catch (err) {
      console.warn('Web Audio Play failed or was blocked by browser autoplay policy:', err)
    }
  }

  // 触发系统浏览器通知
  function sendNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body })
    }
  }

  function startTimer(plan: Plan) {
    stopTimer()
    currentPlan.value = plan
    mode.value = 'work'
    timeLeft.value = plan.workDuration * 60
    totalDuration.value = plan.workDuration * 60
    isRunning.value = true
    
    requestNotificationPermission()
    runCountdown()
  }

  function pauseTimer() {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
  }

  function resumeTimer() {
    if (!currentPlan.value || isRunning.value) return
    isRunning.value = true
    runCountdown()
  }

  function stopTimer() {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    mode.value = 'idle'
    timeLeft.value = 0
    totalDuration.value = 0
    showCompletionModal.value = false
  }

  function runCountdown() {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = window.setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
      } else {
        handlePhaseEnd()
      }
    }, 1000)
  }

  function handlePhaseEnd() {
    pauseTimer()
    
    if (mode.value === 'work') {
      playSound('work')
      sendNotification('🍅 专注完成！', `您已完成“${currentPlan.value?.name}”的工作阶段，准备休息一下吗？`)
      completionType.value = 'work'
      showCompletionModal.value = true
    } else if (mode.value === 'break') {
      playSound('break')
      sendNotification('☕ 休息结束！', `“${currentPlan.value?.name}”的休息阶段已结束，准备好进入下一轮了吗？`)
      
      // 完整的一个工作+休息周期完成，记录一条数据到 Store
      if (currentPlan.value) {
        sessionStore.addSession(
          currentPlan.value.id,
          currentPlan.value.name,
          currentPlan.value.workDuration
        )
      }
      
      completionType.value = 'break'
      showCompletionModal.value = true
    }
  }

  function startBreak() {
    if (!currentPlan.value) return
    showCompletionModal.value = false
    mode.value = 'break'
    timeLeft.value = currentPlan.value.breakDuration * 60
    totalDuration.value = currentPlan.value.breakDuration * 60
    isRunning.value = true
    runCountdown()
  }

  function nextRound() {
    if (!currentPlan.value) return
    showCompletionModal.value = false
    startTimer(currentPlan.value)
  }

  // 监听状态，动态更新浏览器页面的 Title 属性
  watch(
    [timeLeft, mode, isRunning, currentPlan],
    () => {
      if (mode.value === 'idle' || !currentPlan.value) {
        document.title = '番茄钟 Pomodoro Timer'
        return
      }

      const minutes = Math.floor(timeLeft.value / 60).toString().padStart(2, '0')
      const seconds = (timeLeft.value % 60).toString().padStart(2, '0')
      const stateLabel = mode.value === 'work' ? '专注中' : '休息中'
      const emoji = mode.value === 'work' ? '🍅' : '☕'
      
      document.title = `[${minutes}:${seconds}] ${emoji} ${stateLabel} | ${currentPlan.value.name}`
    },
    { immediate: true }
  )

  return {
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
    nextRound,
    requestNotificationPermission
  }
}
