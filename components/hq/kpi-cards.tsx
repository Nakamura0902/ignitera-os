import { TrendingUp, TrendingDown, Users, AlertTriangle, DollarSign, ClipboardCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { HqKpi } from '@/lib/queries/hq'
import { MOCK_KPI } from '@/lib/mock-data'

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-green-600' : 'text-red-500'}`}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}

interface KpiCardsProps {
  data?: HqKpi
}

export function KpiCards({ data }: KpiCardsProps) {
  const kpi = data ?? {
    ...MOCK_KPI,
    submitted_count: 2,
    total_stores: 3,
  }

  const salesDiff = kpi.total_sales_yesterday > 0
    ? ((kpi.total_sales_today - kpi.total_sales_yesterday) / kpi.total_sales_yesterday) * 100
    : 0
  const laborDiff = kpi.avg_labor_cost_ratio - kpi.avg_labor_cost_ratio_prev

  const cards = [
    {
      title: '本日の全店売上',
      value: `¥${kpi.total_sales_today.toLocaleString('ja-JP')}`,
      trend: <TrendBadge value={salesDiff} />,
      sub: `前日 ¥${kpi.total_sales_yesterday.toLocaleString('ja-JP')}`,
      icon: <DollarSign className="h-4 w-4 text-orange-500" />,
      accent: 'border-l-orange-500',
    },
    {
      title: '平均人件費率',
      value: `${kpi.avg_labor_cost_ratio}%`,
      trend: <TrendBadge value={-laborDiff} />,
      sub: `前日比 ${laborDiff > 0 ? '+' : ''}${laborDiff.toFixed(1)}pt`,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      accent: 'border-l-blue-500',
    },
    {
      title: '日報提出率',
      value: `${kpi.submitted_count}/${kpi.total_stores}店`,
      trend: null,
      sub: kpi.submitted_count === kpi.total_stores ? '全店提出済み' : `未提出 ${kpi.total_stores - kpi.submitted_count}店`,
      icon: <ClipboardCheck className="h-4 w-4 text-green-500" />,
      accent: kpi.submitted_count === kpi.total_stores ? 'border-l-green-500' : 'border-l-yellow-500',
    },
    {
      title: 'アクティブアラート',
      value: `${kpi.active_alerts}件`,
      trend: null,
      sub: kpi.active_alerts > 0 ? '要対応あり' : '問題なし',
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      accent: kpi.active_alerts > 0 ? 'border-l-red-500' : 'border-l-green-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={`border-l-4 ${card.accent}`}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1.5">{card.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{card.sub}</p>
              {card.trend}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
