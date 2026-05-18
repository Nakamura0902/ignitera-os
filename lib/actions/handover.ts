'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { HandoverPriority } from '@/types'

export async function createHandover(input: {
  store_id: string
  org_id: string
  content: string
  priority: HandoverPriority
  date: string
}) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('未認証です')

  const { error } = await supabase.from('handovers').insert({
    ...input,
    author_id: user.id,
  })

  if (error) throw new Error(error.message)
  revalidatePath('/daily-log')
}

export async function confirmHandover(handoverId: string) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('未認証です')

  const { error } = await supabase
    .from('handovers')
    .update({ is_confirmed: true, confirmed_by: user.id, confirmed_at: new Date().toISOString() })
    .eq('id', handoverId)

  if (error) throw new Error(error.message)
  revalidatePath('/daily-log')
}
