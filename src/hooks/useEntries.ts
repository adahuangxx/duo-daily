import { useCallback, useEffect, useState } from 'react'
import type { DayEntry } from '../types/entry'
import { supabase, formatSupabaseError } from '../lib/supabaseClient'
import { storage, isSupabaseEnabled } from '../storage'

export function useEntries() {
  const [entries, setEntries] = useState<DayEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      setError(null)
      const data = await storage.getEntries()
      setEntries(data)
    } catch (err) {
      setError(formatSupabaseError(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    if (!isSupabaseEnabled() || !supabase) return

    const client = supabase
    const channel = client
      .channel('day_entries_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'day_entries' },
        () => {
          refresh()
        },
      )
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
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
    error,
    cloudSync: isSupabaseEnabled(),
    refresh,
    upsertEntry,
    deleteEntry,
    getEntriesForDate,
  }
}
