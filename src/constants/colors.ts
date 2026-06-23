import type { UserId, EntryType } from '../types/entry'

export const USER_COLORS: Record<
  UserId,
  { label: string; study: string; exercise: string; rest: string }
> = {
  ada: {
    label: '#3b82f6',
    study: '#1d4ed8',
    exercise: '#38bdf8',
    rest: '#93c5fd',
  },
  ya: {
    label: '#a855f7',
    study: '#7e22ce',
    exercise: '#ec4899',
    rest: '#d8b4fe',
  },
}

export function getStickerColor(userId: UserId, type: EntryType): string {
  return USER_COLORS[userId][type]
}
