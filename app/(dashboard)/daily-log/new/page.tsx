import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogForm } from '@/components/daily-log/log-form'
import { getUnconfirmedHandovers } from '@/lib/queries/handover'
import type { Task } from '@/types'

export default async function NewLogPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('store_id, stores(id, name)')
    .eq('id', user.id)
    .single()

  const store = (profile?.stores as unknown as { id: string; name: string } | null)

  if (!store) {
    return (
      <div className="px-4 py-8">
        <p className="text-sm text-gray-500">担当店舗が設定されていません。管理者にご連絡ください。</p>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  const [handovers, tasksResult] = await Promise.all([
    getUnconfirmedHandovers(store.id),
    supabase
      .from('tasks')
      .select('id, title, status, due_date, store_id, org_id, creator_id, assignee_id, result, created_at')
      .eq('store_id', store.id)
      .neq('status', 'done')
      .order('due_date', { ascending: true })
      .limit(10),
  ])

  const tasks = (tasksResult.data ?? []) as unknown as Task[]

  return (
    <div className="max-w-md mx-auto">
      <LogForm
        storeId={store.id}
        storeName={store.name}
        date={today}
        handovers={handovers}
        tasks={tasks}
      />
    </div>
  )
}
