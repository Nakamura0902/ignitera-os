import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { HqKpi } from '@/lib/queries/hq'

function TrendBadge({ value }: { value: number }) {
  const positive = value >= 0
  return (
    <span className={`flex items-center gap-0.5 text-xs font-medium ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
      {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      {positive ? '+' : ''}{value.toFixed(1)}%
    </span>
  )
}

interface KpiCardsProps { data?: HqKpi }

export function KpiCards({ data }: KpiCardsProps) {
  const kpi = data ?? {
    total_sales_today: 0,
    total_sales_yesterday: 0,
    avg_labor_cost_ratio: 0,
    avg_labor_cost_ratio_prev: 0,
    submitted_count: 0,
    total_stores: 0,
    active_alerts: 0,
  }

  const salesDiff = kpi.total_sales_yesterday > 0
    ? ((kpi.total_sales_today - kpi.total_sales_yesterday) / kpi.total_sales_yesterday) * 100
    : 0
  const laborDiff = kpi.avg_labor_cost_ratio - kpi.avg_labor_cost_ratio_prev
  const submitRate = kpi.total_stores > 0
    ? Math.round((kpi.submitted_count / kpi.total_stores) * 100)
    : 0

  const cards = [
    {
      label: '全店売上合計',
      value: `¥${kpi.total_sales_today.toLocaleString('ja-JP')}`,
      sub: kpi.total_sales_yesterday > 0 ? `前日 ¥${kpi.total_sales_yesterday.toLocaleString('ja-JP')}` : '前日データなし',
      badge: kpi.total_sales_yesterday > 0 ? <TrendBadge value={salesDiff} /> : null,
    },
    {
      label: '日報提出率',
      value: kpi.total_stores > 0 ? `${submitRate}%` : '—',
      sub: `${kpi.submitted_count} / ${kpi.total_stores} 店舗`,
      badge: kpi.total_stores > 0 && kpi.submitted_count === kpi.total_stores
        ? <span className="text-xs font-medium text-emerald-600">全店完了</span>
        : kpi.total_stores > 0
          ? <span className="text-xs font-medium text-amber-500">未提出 {kpi.total_stores - kpi.submitted_count}店</span>
          : null,
    },
    {
      label: 'アクティブアラート',
      value: `${kpi.active_alerts}`,
      sub: kpi.active_alerts > 0 ? '要対応あり' : '問題なし',
      badge: null,
    },
    {
      label: '平均人件費率',
      value: kpi.avg_labor_cost_ratio > 0 ? `${kpi.avg_labor_cost_ratio}%` : '—',
      sub: kpi.avg_labor_cost_ratio_prev > 0
        ? `前日比 ${laborDiff > 0 ? '+' : ''}${laborDiff.toFixed(1)}pt`
        : '前日データなし',
      badge: kpi.avg_labor_cost_ratio_prev > 0 ? <TrendBadge value={-laborDiff} /> : null,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="border border-gray-100 shadow-none">
          <CardContent className="p-5">
            <p className="text-xs text-gray-400 mb-2">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 tabular-nums mb-1">{card.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{card.sub}</p>
              {card.badge}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
