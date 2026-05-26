export interface Plan {
  id: string
  name: string
  type: 'preset' | 'custom'
  workDuration: number   // 工作时长（分钟）
  breakDuration: number  // 休息时长（分钟）
  createdAt: number
}

export interface Session {
  id: string
  planId: string
  planName: string
  completedAt: number
  workDuration: number   // 专注时长（分钟）
}

export type TimerMode = 'idle' | 'work' | 'break'
