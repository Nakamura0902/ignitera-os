import { TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MOCK_STORE_COMPARISON } from '@/lib/mock-data'
import type { StoreStatus } from '@/types'

const STATUS_MAP: Record<StoreStatus, { label: string; className: string }> = {
  good: { label: '好調', className: 'bg-green-100 text-green-700 hover:bg-green-100' },
  normal: { label: '通常', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
  warning: { label: '要注意', className: 'bg-orange-100 text-orange-700 hover:bg-orange-100' },
}

export function StoreComparisonTable() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">店舗比較</CardTitle>
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
              <TableHead className="text-center">状態</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_STORE_COMPARISON.map((store) => (
              <TableRow key={store.id}>
                <TableCell className="font-medium">{store.name}</TableCell>
                <TableCell className="text-right">
                  ¥{store.today_sales.toLocaleString('ja-JP')}
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    store.labor_cost_ratio > 30 ? 'text-red-500' : 'text-gray-900'
                  }`}
                >
                  {store.labor_cost_ratio}%
                </TableCell>
                <TableCell className="text-right">{store.customer_count}人</TableCell>
                <TableCell className="text-right">
                  ¥{store.avg_spend.toLocaleString('ja-JP')}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`flex items-center justify-end gap-0.5 text-sm font-medium ${
                      store.prev_week_diff >= 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {store.prev_week_diff >= 0 ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {store.prev_week_diff > 0 ? '+' : ''}
                    {store.prev_week_diff}%
                  </span>
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
