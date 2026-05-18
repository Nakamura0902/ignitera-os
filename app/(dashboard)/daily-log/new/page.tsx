import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogForm } from '@/components/daily-log/log-form'

export default async function NewLogPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, stores(id, name)')
    .eq('id', user.id)
    .single()

  // Managers are bound to a single store; HQ staff must pick one
  const store = (profile?.stores as unknown as { id: string; name: string } | null)

  if (!store) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-gray-500">担当店舗が設定されていません。管理者にご連絡ください。</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">新規日報入力</h2>
        <p className="text-sm text-gray-500 mt-0.5">{store.name} — 本日の運営状況を記録してください</p>
      </div>
      <LogForm storeId={store.id} storeName={store.name} />
    </div>
  )
}
