'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { IncidentType } from '@/types'

export interface SubmitLogInput {
  store_id: string
  date: string
  total_sales: number
  customer_count: number
  labor_cost: number
  handover_note: string
  memo: string
  incidents: { type: IncidentType; description: string }[]
}

export async function submitDailyLog(input: SubmitLogInput) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('未認証です')

  const avg_spend = input.customer_count > 0
    ? Math.round(input.total_sales / input.customer_count)
    : 0
  const labor_cost_ratio = input.total_sales > 0
    ? Number(((input.labor_cost / input.total_sales) * 100).toFixed(1))
    : 0

  // Upsert daily_log (same store+date overwrites)
  const { data: log, error: logError } = await supabase
    .from('daily_logs')
    .upsert(
      {
        store_id: input.store_id,
        date: input.date,
        author_id: user.id,
        handover_note: input.handover_note,
        memo: input.memo,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'store_id,date' }
    )
    .select('id')
    .single()

  if (logError) throw new Error(logError.message)

  // Upsert sales_data
  const { error: salesError } = await supabase
    .from('sales_data')
    .upsert(
      { store_id: input.store_id, date: input.date, total_sales: input.total_sales, customer_count: input.customer_count, avg_spend },
      { onConflict: 'store_id,date' }
    )

  if (salesError) throw new Error(salesError.message)

  // Upsert labor_data
  const { error: laborError } = await supabase
    .from('labor_data')
    .upsert(
      { store_id: input.store_id, date: input.date, labor_cost: input.labor_cost, labor_cost_ratio, scheduled_hours: 0, actual_hours: 0 },
      { onConflict: 'store_id,date' }
    )

  if (laborError) throw new Error(laborError.message)

  // Delete old incidents for this log, then insert fresh
  await supabase.from('incidents').delete().eq('log_id', log.id)

  if (input.incidents.length > 0) {
    const { error: incError } = await supabase.from('incidents').insert(
      input.incidents.map((inc) => ({ log_id: log.id, type: inc.type, description: inc.description }))
    )
    if (incError) throw new Error(incError.message)
  }

  revalidatePath('/daily-log')
  revalidatePath('/hq')
  return { logId: log.id }
}
