import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

export function isSupabaseEnabled(): boolean {
  return Boolean(url && anonKey)
}

/** Retry fetch — helps with intermittent supabase.co connectivity (e.g. regional network). */
const fetchWithRetry: typeof fetch = async (input, init) => {
  const attempts = 3
  let lastError: unknown

  for (let i = 0; i < attempts; i++) {
    try {
      return await fetch(input, init)
    } catch (err) {
      lastError = err
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 800 * (i + 1)))
      }
    }
  }

  throw lastError
}

export const supabase: SupabaseClient | null = isSupabaseEnabled()
  ? createClient(url!, anonKey!, {
      global: { fetch: fetchWithRetry },
    })
  : null

export function formatSupabaseError(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message
    if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      return '无法连接 Supabase（网络中断）。可检查网络/VPN，或暂时删除 .env.local 使用本地存储。'
    }
    if (msg.includes('PGRST205') || msg.includes('day_entries')) {
      return '数据库表 day_entries 尚未创建。请在 Supabase SQL Editor 运行 supabase/schema.sql。'
    }
    return msg
  }
  return '加载失败'
}

