import { createClient } from '@/lib/supabase/server'
import { LogForm } from '@/components/daily-log/log-form'
import { getUnconfirmedHandovers } from '@/lib/queries/handover'
import type { Task, Handover } from '@/types'

const MOCK_STORE = { id: 'mock', name: '渋谷店' }

const MOCK_HANDOVERS: Handover[] = [
  {
    id: 'h1', org_id: '', store_id: 'mock', author_id: '',
    content: 'ホールのテーブル15番の椅子が1脚ぐらつきあり。',
    priority: 'normal', is_confirmed: false,
    confirmed_by: null, confirmed_at: null,
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
]

const MOCK_TASKS: Task[] = [
  { id: 't1', store_id: 'mock', org_id: '', assignee_id: null, category: '', title: '開店前の清掃を完了する', status: 'open' as const, due_date: null, result: null, created_at: new Date().toISOString() },
  { id: 't2', store_id: 'mock', org_id: '', assignee_id: null, category: '', title: '冷蔵庫の在庫確認をする', status: 'open' as const, due_date: null, result: null, created_at: new Date().toISOString() },
  { id: 't3', store_id: 'mock', org_id: '', assignee_id: null, category: '', title: 'レジの締めチェックをする', status: 'open' as const, due_date: null, result: null, created_at: new Date().toISOString() },
]

export default async function NewLogPage() {
  const today = new Date().toISOString().split('T')[0]

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_id, stores(id, name)')
        .eq('id', user.id)
        .single()

      const store = (profile?.stores as unknown as { id: string; name: string } | null)

      if (store) {
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

        return (
          <div className="max-w-md mx-auto">
            <LogForm
              storeId={store.id}
              storeName={store.name}
              date={today}
              handovers={handovers}
              tasks={(tasksResult.data ?? []) as unknown as Task[]}
            />
          </div>
        )
      }
    }
  } catch {
    // Supabase未設定の場合はモックデータで表示
  }

  return (
    <div className="max-w-md mx-auto">
      <LogForm
        storeId={MOCK_STORE.id}
        storeName={MOCK_STORE.name}
        date={today}
        handovers={MOCK_HANDOVERS}
        tasks={MOCK_TASKS}
      />
    </div>
  )
}
