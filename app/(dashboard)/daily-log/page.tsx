import Link from 'next/link'
import { Plus } from 'lucide-react'
import { LogList } from '@/components/daily-log/log-list'
import { getRecentDailyLogs } from '@/lib/queries/daily-log'

export const dynamic = 'force-dynamic'

export default async function DailyLogPage() {
  const logs = await getRecentDailyLogs()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">日報一覧</h2>
          <p className="text-sm text-gray-500 mt-0.5">過去の店舗運営ログを確認できます</p>
        </div>
        <Link
          href="/daily-log/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新規日報
        </Link>
      </div>
      <LogList logs={logs.length > 0 ? logs : undefined} />
    </div>
  )
}
