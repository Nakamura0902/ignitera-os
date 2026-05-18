import { TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import type { HqStoreRow } from '@/lib/queries/hq'
import { MOCK_STORE_COMPARISON } from '@/lib/mock-data'
import type { StoreStatus } from '@/types'

const STATUS_MAP: Record<StoreStatus, { label: string; className: string }> = {
  good: { label: '好調', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  normal: { label: '通常', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
  warning: { label: '要注意', className: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
}

interface StoreComparisonTableProps {
  stores?: HqStoreRow[]
}

export function StoreComparisonTable({ stores }: StoreComparisonTableProps) {
  const rows = stores ?? MOCK_STORE_COMPARISON

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">店舗一覧</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>店舗名</TableHead>
              <TableHead className="text-right">本日売上</TableHead>
              <TableHead className="text-right">人件費率</TableHead>
              <TableHead className="text-right">客数</TableHead>
              <TableHead className="text-right">客単価</TableHead>
              <TableHead className="text-right">前週比</TableHead>
              <TableHead className="text-center">日報</TableHead>
              <TableHead className="text-center">状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((store) => (
              <TableRow key={store.id} className={store.status === 'warning' ? 'border-l-2 border-l-orange-400' : ''}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell className="text-right">
                  ¥{store.today_sales.toLocaleString('ja-JP')}
                </TableCell>
                <TableCell className={`text-right font-medium ${store.labor_cost_ratio > 32 ? 'text-red-500' : 'text-gray-900'}`}>
                  {store.labor_cost_ratio > 0 ? `${store.labor_cost_ratio}%` : '—'}
                </TableCell>
                <TableCell className="text-right">{store.customer_count > 0 ? `${store.customer_count}人` : '—'}</TableCell>
                <TableCell className="text-right">
                  {store.avg_spend > 0 ? `¥${store.avg_spend.toLocaleString('ja-JP')}` : '—'}
                </TableCell>
                <TableCell className="text-right">
                  {store.prev_week_diff !== 0 ? (
                    <span className={`flex items-center justify-end gap-0.5 text-sm font-medium ${store.prev_week_diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {store.prev_week_diff >= 0 ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {store.prev_week_diff > 0 ? '+' : ''}{store.prev_week_diff}%
                    </span>
                  ) : <span className="text-gray-400 text-sm">—</span>}
                </TableCell>
                <TableCell className="text-center">
                  {'log_submitted' in store ? (
                    store.log_submitted
                      ? <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                      : <XCircle className="h-4 w-4 text-gray-300 mx-auto" />
                  ) : null}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className={STATUS_MAP[store.status].className}>
                    {STATUS_MAP[store.status].label}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
