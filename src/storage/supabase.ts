import type { DayEntry } from '../types/entry'
import { supabase } from '../lib/supabaseClient'
import type { StorageAdapter } from './types'

interface DayEntryRow {
  id: string
  user_id: string
  date: string
  type: string
  note: string | null
  created_at: string
  updated_at: string
}

function fromRow(row: DayEntryRow): DayEntry {
  return {
    id: row.id,
    userId: row.user_id as DayEntry['userId'],
    date: row.date,
    type: row.type as DayEntry['type'],
    note: row.note ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toRow(entry: DayEntry): DayEntryRow {
  return {
    id: entry.id,
    user_id: entry.userId,
    date: entry.date,
    type: entry.type,
    note: entry.note ?? null,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
  }
}

function getClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured')
  }
  return supabase
}

export const supabaseAdapter: StorageAdapter = {
  async getEntries(): Promise<DayEntry[]> {
    const { data, error } = await getClient()
      .from('day_entries')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error
    return (data as DayEntryRow[]).map(fromRow)
  },

  async upsertEntry(entry: DayEntry): Promise<DayEntry> {
    const { data, error } = await getClient()
      .from('day_entries')
      .upsert(toRow(entry), { onConflict: 'user_id,date' })
      .select()
      .single()

    if (error) throw error
    return fromRow(data as DayEntryRow)
  },

  async deleteEntry(id: string): Promise<void> {
    const { error } = await getClient().from('day_entries').delete().eq('id', id)
    if (error) throw error
  },

  async getEntryByUserAndDate(userId: string, date: string): Promise<DayEntry | null> {
    const { data, error } = await getClient()
      .from('day_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle()

    if (error) throw error
    return data ? fromRow(data as DayEntryRow) : null
  },
}
