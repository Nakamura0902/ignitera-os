'use client'

import { useState, useTransition } from 'react'
import { Plus, X, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { submitDailyLog } from '@/lib/actions/daily-log'
import type { IncidentType } from '@/types'

interface Incident {
  type: IncidentType
  description: string
}

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'complaint', label: 'クレーム' },
  { value: 'shortage', label: '欠品' },
  { value: 'delay', label: '提供遅延' },
  { value: 'equipment', label: '設備不具合' },
  { value: 'other', label: 'その他' },
]

interface LogFormProps {
  storeId: string
  storeName: string
  defaultDate?: string
}

export function LogForm({ storeId, storeName, defaultDate }: LogFormProps) {
  const today = defaultDate ?? new Date().toISOString().split('T')[0]

  const [date, setDate] = useState(today)
  const [totalSales, setTotalSales] = useState('')
  const [customerCount, setCustomerCount] = useState('')
  const [laborCost, setLaborCost] = useState('')
  const [handoverNote, setHandoverNote] = useState('')
  const [memo, setMemo] = useState('')
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [incidentType, setIncidentType] = useState<IncidentType>('complaint')
  const [incidentDesc, setIncidentDesc] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const salesNum = Number(totalSales.replace(/,/g, '')) || 0
  const customerNum = Number(customerCount) || 0
  const laborNum = Number(laborCost.replace(/,/g, '')) || 0
  const avgSpend = customerNum > 0 ? Math.round(salesNum / customerNum) : 0
  const laborRate = salesNum > 0 ? ((laborNum / salesNum) * 100).toFixed(1) : '—'

  const addIncident = () => {
    if (!incidentDesc.trim()) return
    setIncidents((prev) => [...prev, { type: incidentType, description: incidentDesc }])
    setIncidentDesc('')
  }

  const removeIncident = (index: number) => {
    setIncidents((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (!totalSales) {
      setError('売上を入力してください')
      return
    }
    setError(null)
    startTransition(async () => {
      try {
        await submitDailyLog({
          store_id: storeId,
          date,
          total_sales: salesNum,
          customer_count: customerNum,
          labor_cost: laborNum,
          handover_note: handoverNote,
          memo,
          incidents,
        })
        setSubmitted(true)
      } catch (e) {
        setError(e instanceof Error ? e.message : '送信に失敗しました')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <CheckCircle className="h-14 w-14 text-green-500" />
        <p className="text-xl font-semibold text-gray-900">お疲れ様でした！</p>
        <p className="text-sm text-gray-500">{storeName}の日報を提出しました</p>
        <Button variant="outline" onClick={() => setSubmitted(false)}>修正する</Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* ① 売上サマリー */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">① 売上サマリー</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>日付</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>店舗</Label>
              <Input value={storeName} disabled className="bg-gray-50" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>売上 (円)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="350,000"
                value={totalSales}
                onChange={(e) => setTotalSales(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>客数 (人)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="98"
                value={customerCount}
                onChange={(e) => setCustomerCount(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>人件費 (円)</Label>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="100,000"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-gray-400">自動計算</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  客単価 ¥{avgSpend.toLocaleString('ja-JP')}
                </div>
                <div className={`rounded-md border px-3 py-2 text-sm font-medium ${Number(laborRate) > 32 ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                  人件費率 {laborRate}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ② 引き継ぎ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">② 引き継ぎメモ</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={3}
            placeholder="次のシフトへの引き継ぎ事項を入力してください..."
            value={handoverNote}
            onChange={(e) => setHandoverNote(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* ③ 異常記録 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">③ 異常記録</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Select value={incidentType} onValueChange={(v) => setIncidentType(v as IncidentType)}>
              <SelectTrigger className="w-36 flex-shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={incidentDesc}
              onChange={(e) => setIncidentDesc(e.target.value)}
              placeholder="内容を入力..."
              onKeyDown={(e) => e.key === 'Enter' && addIncident()}
            />
            <Button type="button" variant="outline" onClick={addIncident} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {incidents.length > 0 ? (
            <div className="space-y-2">
              {incidents.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg p-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-300 bg-white flex-shrink-0">
                    {INCIDENT_TYPES.find((t) => t.value === inc.type)?.label}
                  </Badge>
                  <span className="text-sm flex-1 text-gray-700">{inc.description}</span>
                  <button type="button" onClick={() => removeIncident(i)}>
                    <X className="h-4 w-4 text-gray-400 hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-2">異常なし</p>
          )}
        </CardContent>
      </Card>

      {/* ④ ひとことコメント */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">④ ひとことコメント <span className="text-xs font-normal text-gray-400">（任意）</span></CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            rows={2}
            placeholder="今日の運営について一言..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}

      <Button
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            送信中...
          </>
        ) : '提出する'}
      </Button>
    </div>
  )
}
