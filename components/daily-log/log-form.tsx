'use client'

import { useState, useTransition } from 'react'
import { Plus, Check, ChevronRight, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { submitDailyLog } from '@/lib/actions/daily-log'
import { confirmHandover } from '@/lib/actions/handover'
import type { IncidentType, Handover, Task } from '@/types'

const INCIDENT_TYPES: { value: IncidentType; label: string }[] = [
  { value: 'complaint', label: 'クレーム' },
  { value: 'shortage', label: '欠品' },
  { value: 'delay', label: '提供遅延' },
  { value: 'equipment', label: '設備不具合' },
  { value: 'other', label: 'その他' },
]

interface IncidentItem {
  type: IncidentType
  description: string
}

interface LogFormProps {
  storeId: string
  storeName: string
  date: string
  handovers: Handover[]
  tasks: Task[]
}

export function LogForm({ storeId, storeName, date, handovers, tasks }: LogFormProps) {
  // 売上サマリー
  const [sales, setSales] = useState('')
  const [customers, setCustomers] = useState('')
  const [laborCost, setLaborCost] = useState('')

  // 引き継ぎ
  const [confirmedHandoverIds, setConfirmedHandoverIds] = useState<Set<string>>(new Set())
  const [newHandover, setNewHandover] = useState('')
  const [showHandoverInput, setShowHandoverInput] = useState(false)

  // 異常記録
  const [incidentOpen, setIncidentOpen] = useState(false)
  const [incidentType, setIncidentType] = useState<IncidentType>('complaint')
  const [incidentDesc, setIncidentDesc] = useState('')
  const [incidents, setIncidents] = useState<IncidentItem[]>([])

  // タスク
  const [checkedTaskIds, setCheckedTaskIds] = useState<Set<string>>(new Set())

  // コメント
  const [comment, setComment] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const salesNum = Number(sales.replace(/,/g, '')) || 0
  const customersNum = Number(customers) || 0
  const laborNum = Number(laborCost.replace(/,/g, '')) || 0
  const laborRate = salesNum > 0 ? Math.round((laborNum / salesNum) * 100) : null

  const handleConfirmHandover = (id: string) => {
    setConfirmedHandoverIds((prev) => new Set([...prev, id]))
    confirmHandover(id).catch(() => {})
  }

  const addIncident = () => {
    if (!incidentDesc.trim()) return
    setIncidents((prev) => [...prev, { type: incidentType, description: incidentDesc }])
    setIncidentDesc('')
    setIncidentOpen(false)
  }

  const toggleTask = (id: string) => {
    setCheckedTaskIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const handleSubmit = () => {
    if (!sales) {
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
          customer_count: customersNum,
          labor_cost: laborNum,
          handover_note: newHandover,
          memo: comment,
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
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <CheckCircle className="h-16 w-16 text-blue-500" />
        <p className="text-xl font-bold text-gray-900">お疲れ様でした！</p>
        <p className="text-sm text-gray-500">{storeName}の日報を提出しました</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-blue-500 underline mt-2"
        >
          修正する
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-lg font-bold text-gray-900">{storeName}</span>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <span>📅</span>
          {new Date(date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
        </span>
      </div>

      <div className="divide-y divide-gray-100">
        {/* ① 売上サマリー */}
        <div className="px-4 py-5">
          <p className="text-xs font-medium text-gray-400 mb-3">売上サマリー</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">売上</p>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  placeholder="0"
                  className="pr-6 text-right font-semibold text-base h-10"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">円</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">客数</p>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={customers}
                  onChange={(e) => setCustomers(e.target.value)}
                  placeholder="0"
                  className="pr-5 text-right font-semibold text-base h-10"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">人</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">人件費率</p>
              <div className="relative">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={laborCost ? (laborRate !== null ? String(laborRate) : '') : ''}
                  readOnly
                  placeholder="—"
                  className="pr-5 text-right font-semibold text-base h-10 bg-gray-50"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">%</span>
              </div>
              <Input
                type="text"
                inputMode="numeric"
                value={laborCost}
                onChange={(e) => setLaborCost(e.target.value)}
                placeholder="人件費(円)"
                className="mt-1 text-xs h-7 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* ② 引き継ぎ */}
        <div className="px-4 py-5">
          <p className="text-xs font-medium text-gray-400 mb-3">引き継ぎ</p>
          <div className="space-y-2">
            {handovers.map((h) => {
              const confirmed = confirmedHandoverIds.has(h.id)
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => !confirmed && handleConfirmHandover(h.id)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                    confirmed ? 'bg-green-50' : 'bg-gray-50 hover:bg-blue-50'
                  }`}
                >
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                    confirmed ? 'bg-green-500' : 'border-2 border-gray-300'
                  }`}>
                    {confirmed && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`flex-1 text-sm ${confirmed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {h.content}
                  </span>
                  {!confirmed && <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />}
                </button>
              )
            })}

            {showHandoverInput ? (
              <div className="space-y-2">
                <Textarea
                  rows={2}
                  autoFocus
                  placeholder="引き継ぎ内容を入力..."
                  value={newHandover}
                  onChange={(e) => setNewHandover(e.target.value)}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHandoverInput(false)}
                    className="flex-1 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHandoverInput(false)}
                    className="flex-1 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg"
                  >
                    追加
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHandoverInput(true)}
                className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-blue-300 rounded-xl text-sm text-blue-500 hover:bg-blue-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                追加
              </button>
            )}
          </div>
        </div>

        {/* ③ 異常記録 */}
        <div className="px-4 py-5">
          <p className="text-xs font-medium text-gray-400 mb-3">異常記録</p>
          <div className="space-y-2">
            {incidents.map((inc, i) => (
              <div key={i} className="flex items-center gap-2 bg-orange-50 rounded-xl px-3 py-2.5">
                <span className="text-xs font-medium text-orange-500 flex-shrink-0">
                  {INCIDENT_TYPES.find((t) => t.value === inc.type)?.label}
                </span>
                <span className="text-sm text-gray-700 flex-1">{inc.description}</span>
                <button type="button" onClick={() => setIncidents((p) => p.filter((_, j) => j !== i))}>
                  <span className="text-gray-300 hover:text-red-400 text-lg leading-none">×</span>
                </button>
              </div>
            ))}

            {incidentOpen ? (
              <div className="space-y-2 border border-gray-200 rounded-xl p-3">
                <Select value={incidentType} onValueChange={(v) => setIncidentType(v as IncidentType)}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  autoFocus
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="内容を入力..."
                  onKeyDown={(e) => e.key === 'Enter' && addIncident()}
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIncidentOpen(false); setIncidentDesc('') }}
                    className="flex-1 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg"
                  >
                    キャンセル
                  </button>
                  <button
                    type="button"
                    onClick={addIncident}
                    className="flex-1 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg"
                  >
                    記録する
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIncidentOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-4 w-4" />
                異常を記録
              </button>
            )}
          </div>
        </div>

        {/* ④ 今日のタスク */}
        {tasks.length > 0 && (
          <div className="px-4 py-5">
            <p className="text-xs font-medium text-gray-400 mb-3">今日のタスク</p>
            <div className="space-y-1">
              {tasks.map((task) => {
                const checked = checkedTaskIds.has(task.id)
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="w-full flex items-center gap-3 py-2.5 px-1 text-left"
                  >
                    <div className={`flex-shrink-0 h-5 w-5 rounded flex items-center justify-center border-2 transition-colors ${
                      checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {checked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm transition-colors ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ⑤ コメント */}
        <div className="px-4 py-5">
          <p className="text-xs font-medium text-gray-400 mb-3">コメント</p>
          <Textarea
            rows={3}
            placeholder="コメントを入力してください（任意）"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-sm resize-none border-gray-200"
          />
        </div>
      </div>

      {/* 提出ボタン */}
      <div className="px-4 py-5">
        {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold rounded-xl py-4"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : '提出する'}
        </Button>
      </div>
    </div>
  )
}
