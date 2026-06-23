import type { DayEntry } from '../types/entry'

export interface StorageAdapter {
  getEntries(): Promise<DayEntry[]>
  upsertEntry(entry: DayEntry): Promise<DayEntry>
  deleteEntry(id: string): Promise<void>
  getEntryByUserAndDate(userId: string, date: string): Promise<DayEntry | null>
}
