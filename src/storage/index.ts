import type { StorageAdapter } from './types'
import { localStorageAdapter } from './localStorage'

/**
 * Active storage backend. Swap to supabaseAdapter when cloud sync is ready.
 */
export const storage: StorageAdapter = localStorageAdapter
