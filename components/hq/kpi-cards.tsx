import { TrendingUp, TrendingDown, Users, AlertTriangle, DollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MOCK_KPI } from '@/lib/mock-data'

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-medium ${
        positive ? 'text-green-600' : 'text-red-500'
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {positive ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  )
}

export function KpiCards() {
  const salesDiff =
    ((MOCK_KPI.total_sales_today - MOCK_KPI.total_sales_yesterday) /
      MOCK_KPI.total_sales_yesterday) *
    100
  const laborDiff = MOCK_KPI.avg_labor_cost_ratio - MOCK_KPI.avg_labor_cost_ratio_prev
  const revisitDiff = MOCK_KPI.revisit_rate - MOCK_KPI.revisit_rate_prev

  const cards = [
    {
      title: '本日の全店売上',
      value: `¥${MOCK_KPI.total_sales_today.toLocaleString('ja-JP')}`,
      trend: <TrendBadge value={salesDiff} />,
      sub: `前日 ¥${MOCK_KPI.total_sales_yesterday.toLocaleString('ja-JP')}`,
      icon: <DollarSign className="h-4 w-4 text-orange-500" />,
      accent: 'border-l-orange-500',
    },
    {
      title: '平均人件費率',
      value: `${MOCK_KPI.avg_labor_cost_ratio}%`,
      trend: <TrendBadge value={-laborDiff} />,
      sub: `先月比 ${laborDiff > 0 ? '+' : ''}${laborDiff.toFixed(1)}pt`,
      icon: <Users className="h-4 w-4 text-blue-500" />,
      accent: 'border-l-blue-500',
    },
    {
      title: '再来店率',
      value: `${MOCK_KPI.revisit_rate}%`,
      trend: <TrendBadge value={revisitDiff} />,
      sub: `先月比 ${revisitDiff > 0 ? '+' : ''}${revisitDiff.toFixed(1)}pt`,
      icon: <Users className="h-4 w-4 text-purple-500" />,
      accent: 'border-l-purple-500',
    },
    {
      title: 'アクティブアラート',
      value: `${MOCK_KPI.active_alerts}件`,
      trend: null,
      sub: '要対応あり',
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      accent: MOCK_KPI.active_alerts > 0 ? 'border-l-red-500' : 'border-l-green-500',
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
