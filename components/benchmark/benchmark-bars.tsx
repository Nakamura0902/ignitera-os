'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { name: '売上効率', 自店: 72, 同業平均: 65, '上位20%': 85 },
  { name: '再来店率(%)', 自店: 42, 同業平均: 38, '上位20%': 55 },
  { name: '人件費率(%)', 自店: 29, 同業平均: 30, '上位20%': 25 },
  { name: '客単価(百円)', 自店: 36, 同業平均: 34, '上位20%': 42 },
]

export function BenchmarkBars() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">指標別比較</CardTitle>
        <p className="text-xs text-gray-500">人件費率は低いほど良いことに注意</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="自店" fill="#f97316" radius={[3, 3, 0, 0]} />
            <Bar dataKey="同業平均" fill="#94a3b8" radius={[3, 3, 0, 0]} />
            <Bar dataKey="上位20%" fill="#22c55e" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
