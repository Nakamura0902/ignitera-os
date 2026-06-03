'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Industry } from '@/types'

export async function createOrgAndStore(formData: {
  orgName: string
  storeName: string
  industry: Industry
  region: string
  seats: number
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('認証が必要です')

  const { data: org, error: orgError } = await supabase
    .from('orgs')
    .insert({ name: formData.orgName, plan: 'free' })
    .select('id')
    .single()

  if (orgError || !org) throw new Error('組織の作成に失敗しました')

  const { error: storeError } = await supabase
    .from('stores')
    .insert({
      org_id: org.id,
      name: formData.storeName,
      industry: formData.industry,
      region: formData.region,
      seats: formData.seats,
      price_range: '',
      open_time: '11:00',
      close_time: '23:00',
    })

  if (storeError) throw new Error('店舗の作成に失敗しました')

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      org_id: org.id,
      name: user.email ?? '',
      role: 'hq',
      store_id: null,
    })

  if (profileError) throw new Error('プロフィールの設定に失敗しました')

  redirect('/hq')
}
