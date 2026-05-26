import type { Plan, Session } from '../types/pomodoro'

const PLANS_KEY = 'pomodoro_plans'
const SESSIONS_KEY = 'pomodoro_sessions'

export function getStoredPlans(): Plan[] {
  try {
    const plansStr = localStorage.getItem(PLANS_KEY)
    return plansStr ? JSON.parse(plansStr) : []
  } catch (e) {
    console.error('Failed to parse stored plans:', e)
    return []
  }
}

export function setStoredPlans(plans: Plan[]): void {
  try {
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans))
  } catch (e) {
    console.error('Failed to write plans to localStorage:', e)
  }
}

export function getStoredSessions(): Session[] {
  try {
    const sessionsStr = localStorage.getItem(SESSIONS_KEY)
    return sessionsStr ? JSON.parse(sessionsStr) : []
  } catch (e) {
    console.error('Failed to parse stored sessions:', e)
    return []
  }
}

export function setStoredSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  } catch (e) {
    console.error('Failed to write sessions to localStorage:', e)
  }
}
