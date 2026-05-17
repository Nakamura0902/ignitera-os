'use client'

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { metric: '売上効率', 自店: 72, 同業平均: 65, '上位20%': 85 },
  { metric: '再来店率', 自店: 60, 同業平均: 54, '上位20%': 79 },
  { metric: '人件費(低◎)', 自店: 73, 同業平均: 75, '上位20%': 88 },
  { metric: 'インシデント(低◎)', 自店: 60, 同業平均: 50, '上位20%': 80 },
  { metric: '客単価', 自店: 72, 同業平均: 68, '上位20%': 84 },
]

export function BenchmarkRadar() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">総合評価レーダー</CardTitle>
        <p className="text-xs text-gray-500">対象: 新宿店 / 居酒屋・東京都内</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <Radar
              name="自店"
              dataKey="自店"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.25}
            />
            <Radar
              name="同業平均"
              dataKey="同業平均"
              stroke="#94a3b8"
              fill="#94a3b8"
              fillOpacity={0.1}
            />
            <Radar
              name="上位20%"
              dataKey="上位20%"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.1}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
