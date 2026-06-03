'use client'

import { useMemo, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SalesTrendData } from '@/lib/queries/hq'

interface SalesTrendChartProps {
  data: SalesTrendData
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  const [selected, setSelected] = useState<string>('__total__')

  const chartData = useMemo(() => {
    return data.labels.map((label, i) => {
      const total = data.stores.reduce((s, st) => s + st.data[i], 0)
      const storeValues = Object.fromEntries(data.stores.map((st) => [st.id, st.data[i]]))
      return { date: label, total, ...storeValues }
    })
  }, [data])

  const activeStore = data.stores.find((s) => s.id === selected)
  const dataKey = selected === '__total__' ? 'total' : selected
  const barColor = selected === '__total__' ? '#3b82f6' : (activeStore?.color ?? '#3b82f6')

  const isEmpty = data.stores.length === 0 || chartData.every((d) => d.total === 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle className="text-base font-semibold">売上推移（過去7日）</CardTitle>
          {data.stores.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => setSelected('__total__')}
                className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                  selected === '__total__'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                全店合計
              </button>
              {data.stores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => setSelected(store.id)}
                  className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                    selected === store.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {store.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-[220px] items-center justify-center">
            <p className="text-sm text-gray-400">売上データがまだありません</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={(v: number) => `${(v / 10000).toFixed(0)}万`}
                width={40}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(v) => [`¥${Number(v).toLocaleString('ja-JP')}`, activeStore?.name ?? '全店合計']}
                labelStyle={{ fontWeight: 600, color: '#111827' }}
                contentStyle={{ border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
              />
              <Bar dataKey={dataKey} fill={barColor} radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
