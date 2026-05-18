import Link from 'next/link'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { DailyLog } from '@/types'
import { MOCK_DAILY_LOGS } from '@/lib/mock-data'

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  complaint: 'クレーム',
  shortage: '欠品',
  delay: '提供遅延',
  equipment: '設備不具合',
  other: 'その他',
}

interface LogListProps {
  logs?: DailyLog[]
}

export function LogList({ logs }: LogListProps) {
  const items = logs ?? (MOCK_DAILY_LOGS as unknown as DailyLog[])

  if (items.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-12">日報がまだありません</p>
  }

  return (
    <div className="space-y-3">
      {items.map((log) => {
        const storeName = log.store?.name ?? '—'
        const authorName = log.author?.name ?? '—'
        const salesVal = log.sales?.total_sales
        const laborRate = log.labor?.labor_cost_ratio
        const incidentCount = log.incidents?.length ?? 0
        const isSubmitted = !!log.submitted_at

        return (
          <Link key={log.id} href={`/daily-log/${log.id}`} className="block">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="font-semibold text-gray-900">{storeName}</span>
                      <span className="text-sm text-gray-400">{log.date}</span>
                      <span className="text-sm text-gray-400">記入: {authorName}</span>
                      {isSubmitted ? (
                        <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 text-xs">提出済み</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50 text-xs">下書き</Badge>
                      )}
                    </div>
                    {log.handover_note && (
                      <p className="text-sm text-gray-600 line-clamp-2">{log.handover_note}</p>
                    )}
                    {incidentCount > 0 && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {log.incidents!.map((inc, i) => (
                          <Badge key={i} variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-xs">
                            {INCIDENT_TYPE_LABELS[inc.type] ?? inc.type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    {salesVal != null ? (
                      <p className="font-semibold text-gray-900">¥{salesVal.toLocaleString('ja-JP')}</p>
                    ) : (
                      <p className="text-sm text-gray-400">売上未入力</p>
                    )}
                    {laborRate != null && (
                      <p className={`text-sm mt-0.5 ${laborRate > 32 ? 'text-red-500' : 'text-gray-500'}`}>
                        人件費 {laborRate}%
                      </p>
                    )}
                    <div className="flex justify-end mt-1.5">
                      {incidentCount > 0 ? (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      ) : isSubmitted ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Clock className="h-4 w-4 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
