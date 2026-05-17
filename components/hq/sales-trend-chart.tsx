'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { generateSalesTrend } from '@/lib/mock-data'

export function SalesTrendChart() {
  const trend = useMemo(() => generateSalesTrend(), [])

  const data = trend.labels.map((label, i) => ({
    date: label,
    ...Object.fromEntries(trend.stores.map((s) => [s.name, s.data[i]])),
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">売上推移（過去7日）</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v: number) => `¥${(v / 10000).toFixed(0)}万`}
              width={56}
            />
            <Tooltip
              formatter={(v) => [`¥${Number(v).toLocaleString('ja-JP')}`, '']}
              labelStyle={{ fontWeight: 600 }}
            />
            <Legend />
            {trend.stores.map((store) => (
              <Line
                key={store.id}
                type="monotone"
                dataKey={store.name}
                stroke={store.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
