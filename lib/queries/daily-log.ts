import { createClient } from '@/lib/supabase/server'
import type { DailyLog } from '@/types'

export async function getRecentDailyLogs(storeId?: string, limit = 20): Promise<DailyLog[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, store_id')
    .eq('id', user.id)
    .single()

  if (!profile) return []

  let query = supabase
    .from('daily_logs')
    .select(`
      id, store_id, date, author_id, handover_note, memo, submitted_at, created_at,
      store:stores(id, name, industry, region, seats, price_range, open_time, close_time, created_at, org_id),
      author:profiles!daily_logs_author_id_fkey(id, name, role, org_id, store_id),
      incidents(id, log_id, type, description),
      sales:sales_data!inner(id, store_id, date, total_sales, customer_count, avg_spend),
      labor:labor_data(id, store_id, date, scheduled_hours, actual_hours, labor_cost, labor_cost_ratio)
    `)
    .order('date', { ascending: false })
    .limit(limit)

  if (storeId) {
    query = query.eq('store_id', storeId)
  } else {
    // Org-wide: filter by stores belonging to this org (RLS handles this)
  }

  const { data, error } = await query
  if (error) {
    console.error('getRecentDailyLogs error:', error.message)
    return []
  }

  return (data ?? []) as unknown as DailyLog[]
}

export async function getTodayLog(storeId: string): Promise<DailyLog | null> {
  const supabase = await createClient()
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('daily_logs')
    .select(`
      id, store_id, date, author_id, handover_note, memo, submitted_at, created_at,
      incidents(id, log_id, type, description),
      sales:sales_data(id, store_id, date, total_sales, customer_count, avg_spend),
      labor:labor_data(id, store_id, date, scheduled_hours, actual_hours, labor_cost, labor_cost_ratio)
    `)
    .eq('store_id', storeId)
    .eq('date', today)
    .maybeSingle()

  if (error) {
    console.error('getTodayLog error:', error.message)
    return null
  }

  return data as unknown as DailyLog | null
}
