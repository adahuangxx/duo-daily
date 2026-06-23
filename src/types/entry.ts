export type UserId = 'ada' | 'ya'
export type EntryType = 'study' | 'exercise' | 'rest'

export interface DayEntry {
  id: string
  userId: UserId
  date: string
  type: EntryType
  note?: string
  createdAt: string
  updatedAt: string
}

export const USERS: { id: UserId; label: string }[] = [
  { id: 'ada', label: 'Ada' },
  { id: 'ya', label: 'Ya' },
]

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  study: '学习',
  exercise: '锻炼',
  rest: '放松',
}
