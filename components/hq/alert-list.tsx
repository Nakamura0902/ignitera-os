import type { ReactNode } from 'react'
import { AlertTriangle, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HqAlert } from '@/lib/queries/hq'
import { MOCK_ALERTS } from '@/lib/mock-data'
import type { AlertSeverity } from '@/types'

const SEVERITY_ICONS: Record<AlertSeverity, ReactNode> = {
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />,
  info: <Info className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />,
}

const SEVERITY_BG: Record<AlertSeverity, string> = {
  warning: 'bg-amber-50 border border-amber-200',
  info: 'bg-blue-50 border border-blue-200',
}

interface AlertListProps {
  alerts?: HqAlert[]
}

export function AlertList({ alerts }: AlertListProps) {
  const items = alerts ?? MOCK_ALERTS

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">アクティブアラート</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">アラートはありません</p>
        ) : (
          items.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg p-3 ${SEVERITY_BG[alert.severity]}`}
            >
              {SEVERITY_ICONS[alert.severity]}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-700">{alert.store_name}</p>
                <p className="text-sm text-gray-600 mt-0.5">{alert.message}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
