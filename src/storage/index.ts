import { isSupabaseEnabled } from '../lib/supabaseClient'
import type { StorageAdapter } from './types'
import { localStorageAdapter } from './localStorage'
import { supabaseAdapter } from './supabase'

/** Uses Supabase when VITE_SUPABASE_* env vars are set; otherwise localStorage. */
export const storage: StorageAdapter = isSupabaseEnabled()
  ? supabaseAdapter
  : localStorageAdapter

export { isSupabaseEnabled }
