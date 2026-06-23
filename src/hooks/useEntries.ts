import { useCallback, useEffect, useState } from 'react'
import type { DayEntry } from '../types/entry'
import { storage } from '../storage'

export function useEntries() {
  const [entries, setEntries] = useState<DayEntry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await storage.getEntries()
    setEntries(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const upsertEntry = useCallback(
    async (entry: DayEntry) => {
      const saved = await storage.upsertEntry(entry)
      setEntries((prev) => {
        const without = prev.filter(
          (e) => e.id !== saved.id && !(e.userId === saved.userId && e.date === saved.date),
        )
        return [...without, saved]
      })
      return saved
    },
    [],
  )

  const deleteEntry = useCallback(async (id: string) => {
    await storage.deleteEntry(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const getEntriesForDate = useCallback(
    (date: string) => entries.filter((e) => e.date === date),
    [entries],
  )

  return {
    entries,
    loading,
    refresh,
    upsertEntry,
    deleteEntry,
    getEntriesForDate,
  }
}
