import { createClient } from '@/lib/supabase/server'
import type { Handover } from '@/types'

export async function getUnconfirmedHandovers(storeId: string): Promise<Handover[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('handovers')
    .select('*, author:profiles!handovers_author_id_fkey(id, name, role, org_id, store_id)')
    .eq('store_id', storeId)
    .eq('is_confirmed', false)
    .order('date', { ascending: false })
    .limit(10)

  if (error) {
    console.error('getUnconfirmedHandovers error:', error.message)
    return []
  }

  return (data ?? []) as unknown as Handover[]
}
