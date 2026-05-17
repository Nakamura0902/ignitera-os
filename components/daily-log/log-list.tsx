import Link from 'next/link'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_DAILY_LOGS } from '@/lib/mock-data'

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  complaint: 'クレーム',
  shortage: '欠品',
  delay: '提供遅延',
  equipment: '設備不具合',
  other: 'その他',
}

export function LogList() {
  return (
    <div className="space-y-3">
      {MOCK_DAILY_LOGS.map((log) => (
        <Link key={log.id} href={`/daily-log/${log.id}`} className="block">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{log.store_name}</span>
                    <span className="text-sm text-gray-400">{log.date}</span>
                    <span className="text-sm text-gray-400">記入: {log.author}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{log.handover_note}</p>
                  {log.incidents.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {log.incidents.map((inc, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-orange-600 border-orange-300 bg-orange-50 text-xs"
                        >
                          {INCIDENT_TYPE_LABELS[inc.type] ?? inc.type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-gray-900">
                    ¥{log.today_sales.toLocaleString('ja-JP')}
                  </p>
                  <p
                    className={`text-sm mt-0.5 ${
                      log.labor_cost_ratio > 30 ? 'text-red-500' : 'text-gray-500'
                    }`}
                  >
                    人件費 {log.labor_cost_ratio}%
                  </p>
                  <div className="flex justify-end mt-1.5">
                    {log.incidents.length > 0 ? (
                      <AlertTriangle className="h-4 w-4 text-orange-400" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
