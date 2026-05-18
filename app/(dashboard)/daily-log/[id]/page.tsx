import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_DAILY_LOGS } from '@/lib/mock-data'

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  complaint: 'クレーム',
  shortage: '欠品',
  delay: '提供遅延',
  equipment: '設備不具合',
  other: 'その他',
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function DailyLogDetailPage({ params }: Props) {
  const { id } = await params
  const log = MOCK_DAILY_LOGS.find((l) => l.id === id) ?? MOCK_DAILY_LOGS[0]

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/daily-log"
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        一覧に戻る
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {log.store_name} — {log.date}
          </CardTitle>
          <p className="text-sm text-gray-500">記入者: {log.author}</p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">本日売上</p>
              <p className="text-xl font-bold text-gray-900">
                ¥{log.today_sales.toLocaleString('ja-JP')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">人件費率</p>
              <p
                className={`text-xl font-bold ${log.labor_cost_ratio > 30 ? 'text-red-500' : 'text-gray-900'}`}
              >
                {log.labor_cost_ratio}%
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-2">引き継ぎメモ</p>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">
              {log.handover_note}
            </p>
          </div>

          {log.incidents.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-2">
                インシデント ({log.incidents.length}件)
              </p>
              <div className="space-y-2">
                {log.incidents.map((inc, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Badge
                      variant="outline"
                      className="text-blue-600 border-blue-200 bg-blue-50 mt-0.5 flex-shrink-0"
                    >
                      {INCIDENT_TYPE_LABELS[inc.type] ?? inc.type}
                    </Badge>
                    <p className="text-sm text-gray-700">{inc.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-green-600 bg-green-50 rounded-lg p-3">
              インシデントなし — 問題のない一日でした
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
