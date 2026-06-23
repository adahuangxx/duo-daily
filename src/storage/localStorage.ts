import type { DayEntry } from '../types/entry'
import type { StorageAdapter } from './types'

const STORAGE_KEY = 'duo-daily:v1:entries'

function readAll(): DayEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(entries: DayEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export const localStorageAdapter: StorageAdapter = {
  async getEntries(): Promise<DayEntry[]> {
    return readAll()
  },

  async upsertEntry(entry: DayEntry): Promise<DayEntry> {
    const entries = readAll()
    const index = entries.findIndex((e) => e.id === entry.id)
    if (index >= 0) {
      entries[index] = entry
    } else {
      const duplicateIndex = entries.findIndex(
        (e) => e.userId === entry.userId && e.date === entry.date,
      )
      if (duplicateIndex >= 0) {
        entries[duplicateIndex] = entry
      } else {
        entries.push(entry)
      }
    }
    writeAll(entries)
    return entry
  },

  async deleteEntry(id: string): Promise<void> {
    const entries = readAll().filter((e) => e.id !== id)
    writeAll(entries)
  },

  async getEntryByUserAndDate(userId: string, date: string): Promise<DayEntry | null> {
    const entries = readAll()
    return entries.find((e) => e.userId === userId && e.date === date) ?? null
  },
}
