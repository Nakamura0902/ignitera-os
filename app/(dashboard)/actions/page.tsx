import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { ActionBoard } from '@/components/actions/action-board'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function ActionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  const { data: tasksRaw } = profile?.org_id
    ? await supabase
        .from('tasks')
        .select('id, title, category, status, due_date, result, store:stores(name), assignee:profiles!tasks_assignee_id_fkey(name)')
        .eq('org_id', profile.org_id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const tasks = (tasksRaw ?? []).map((t: Record<string, unknown>) => ({
    id: t.id as string,
    title: t.title as string,
    category: t.category as string,
    status: t.status as 'open' | 'in_progress' | 'done',
    due_date: t.due_date as string | null,
    result: t.result as string | null,
    store_name: (t.store as { name: string } | null)?.name,
    assignee: (t.assignee as { name: string } | null)?.name,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">改善アクションセンター</h2>
          <p className="text-sm text-gray-500 mt-0.5">課題から施策・実行・効果検証まで一元管理</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-1.5" />
          新規アクション
        </Button>
      </div>
      <ActionBoard tasks={tasks} />
    </div>
  )
}
