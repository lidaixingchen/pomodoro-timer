import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Session } from '../types/pomodoro'
import { getStoredSessions, setStoredSessions } from '../utils/storage'
import { subDays, format, isSameDay, startOfDay } from 'date-fns'

export const useSessionStore = defineStore('session', () => {
  const sessions = ref<Session[]>([])

  function initSessions() {
    sessions.value = getStoredSessions()
  }

  initSessions()

  function addSession(planId: string, planName: string, workDuration: number) {
    const newSession: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      planId,
      planName,
      completedAt: Date.now(),
      workDuration
    }
    sessions.value.push(newSession)
    setStoredSessions(sessions.value)
  }

  // 今天完成的 Session 列表
  const todaySessions = computed(() => {
    const today = startOfDay(new Date())
    return sessions.value.filter(s => new Date(s.completedAt) >= today)
  })

  // 今天完成的番茄钟数量
  const todayCompletedCount = computed(() => {
    return todaySessions.value.length
  })

  // 今天累计的专注时长（分钟）
  const todayTotalDuration = computed(() => {
    return todaySessions.value.reduce((sum, s) => sum + s.workDuration, 0)
  })

  // 各计划类型完成数量（用于饼图）
  const getSessionsGroupedByPlan = computed(() => {
    const groups: Record<string, number> = {}
    sessions.value.forEach(s => {
      groups[s.planName] = (groups[s.planName] || 0) + 1
    })
    return {
      labels: Object.keys(groups),
      data: Object.values(groups)
    }
  })

  // 近 7 天的每日完成数量（用于折线图）
  const getLast7DaysSessions = computed(() => {
    const dates = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))
    const labels = dates.map(d => format(d, 'MM/dd'))
    const data = dates.map(date => {
      return sessions.value.filter(s => isSameDay(new Date(s.completedAt), date)).length
    })
    return {
      labels,
      data
    }
  })

  return {
    sessions,
    addSession,
    todaySessions,
    todayCompletedCount,
    todayTotalDuration,
    getSessionsGroupedByPlan,
    getLast7DaysSessions
  }
})
