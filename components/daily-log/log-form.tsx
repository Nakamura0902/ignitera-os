'use client'

import { useState, useTransition } from 'react'
import { Plus, Check, ChevronRight, Loader2, CheckCircle, Pencil } from 'lucide-react'
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

interface IncidentItem { type: IncidentType; description: string }

interface LogFormProps {
  storeId: string
  storeName: string
  date: string
  handovers: Handover[]
  tasks: Task[]
}

// 数値入力フィールド（大きな数字表示＋鉛筆アイコン）
function MetricInput({
  label, value, onChange, unit, placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  unit: string
  placeholder: string
}) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-400">{label}</span>
      {editing ? (
        <div className="flex items-baseline gap-1">
          <input
            autoFocus
            type="text"
            inputMode="numeric"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => setEditing(false)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(false)}
            className="w-full text-2xl font-bold text-gray-900 border-b-2 border-blue-500 outline-none bg-transparent"
            placeholder={placeholder}
          />
          <span className="text-sm text-gray-500 flex-shrink-0">{unit}</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex items-baseline gap-1 group text-left"
        >
          <span className={`text-2xl font-bold ${value ? 'text-gray-900' : 'text-gray-300'}`}>
            {value || placeholder}
          </span>
          <span className="text-sm text-gray-500">{unit}</span>
          <Pencil className="h-3 w-3 text-gray-300 group-hover:text-gray-500 ml-1 mb-0.5 transition-colors" />
        </button>
      )}
    </div>
  )
}

export function LogForm({ storeId, storeName, date, handovers, tasks }: LogFormProps) {
  const [sales, setSales] = useState('')
  const [customers, setCustomers] = useState('')
  const [laborRate, setLaborRate] = useState('')

  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())
  const [newHandover, setNewHandover] = useState('')
  const [showHandoverInput, setShowHandoverInput] = useState(false)

  const [incidentOpen, setIncidentOpen] = useState(false)
  const [incidentType, setIncidentType] = useState<IncidentType>('complaint')
  const [incidentDesc, setIncidentDesc] = useState('')
  const [incidents, setIncidents] = useState<IncidentItem[]>([])

  const [checkedTaskIds, setCheckedTaskIds] = useState<Set<string>>(new Set())
  const [comment, setComment] = useState('')

  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleConfirm = (id: string) => {
    setConfirmedIds((prev) => new Set([...prev, id]))
    confirmHandover(id).catch(() => {})
  }

  const addIncident = () => {
    if (!incidentDesc.trim()) return
    setIncidents((p) => [...p, { type: incidentType, description: incidentDesc }])
    setIncidentDesc('')
    setIncidentOpen(false)
  }

  const handleSubmit = () => {
    if (!sales) { setError('売上を入力してください'); return }
    setError(null)
    startTransition(async () => {
      try {
        const salesNum = Number(sales.replace(/,/g, '')) || 0
        const laborCost = salesNum * (Number(laborRate) / 100)
        await submitDailyLog({
          store_id: storeId,
          date,
          total_sales: salesNum,
          customer_count: Number(customers) || 0,
          labor_cost: Math.round(laborCost),
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

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-8">
        <CheckCircle className="h-14 w-14 text-blue-500" />
        <p className="text-xl font-bold text-gray-900">お疲れ様でした！</p>
        <p className="text-sm text-gray-400">{storeName}の日報を提出しました</p>
        <button onClick={() => setSubmitted(false)} className="mt-2 text-sm text-blue-500">
          修正する
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen pb-8">

      {/* ヘッダー */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <span className="text-xl font-bold text-gray-900">{storeName}</span>
        <span className="text-xs text-gray-400">📅 {formattedDate}</span>
      </div>

      <div className="divide-y divide-gray-100">

        {/* ① 売上サマリー */}
        <section className="px-5 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">売上サマリー</p>
          <div className="grid grid-cols-3 gap-4">
            <MetricInput label="売上" value={sales} onChange={setSales} unit="円" placeholder="0" />
            <MetricInput label="客数" value={customers} onChange={setCustomers} unit="人" placeholder="0" />
            <MetricInput label="人件費率" value={laborRate} onChange={setLaborRate} unit="%" placeholder="—" />
          </div>
        </section>

        {/* ② 引き継ぎ */}
        <section className="px-5 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">引き継ぎ</p>
          <div className="space-y-2">
            {handovers.map((h) => {
              const done = confirmedIds.has(h.id)
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => !done && handleConfirm(h.id)}
                  className="w-full flex items-center gap-3 py-3 px-3 rounded-xl bg-gray-50 text-left"
                >
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${done ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                    {done && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <span className={`flex-1 text-sm ${done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {h.content}
                  </span>
                  {!done && <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />}
                </button>
              )
            })}

            {showHandoverInput ? (
              <div className="space-y-2 pt-1">
                <Textarea
                  autoFocus
                  rows={2}
                  placeholder="引き継ぎ内容を入力..."
                  value={newHandover}
                  onChange={(e) => setNewHandover(e.target.value)}
                  className="text-sm border-gray-200 resize-none"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => setShowHandoverInput(false)}
                    className="flex-1 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg">
                    キャンセル
                  </button>
                  <button type="button" onClick={() => setShowHandoverInput(false)}
                    className="flex-1 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg font-medium">
                    追加
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowHandoverInput(true)}
                className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
                追加
              </button>
            )}
          </div>
        </section>

        {/* ③ 異常記録 */}
        <section className="px-5 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">異常記録</p>
          <div className="space-y-2">
            {incidents.map((inc, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                  {INCIDENT_TYPES.find((t) => t.value === inc.type)?.label}
                </span>
                <span className="text-sm text-gray-700 flex-1">{inc.description}</span>
                <button type="button" onClick={() => setIncidents((p) => p.filter((_, j) => j !== i))}
                  className="text-gray-300 hover:text-gray-500 text-lg leading-none flex-shrink-0">×</button>
              </div>
            ))}

            {incidentOpen ? (
              <div className="space-y-2 border border-gray-200 rounded-xl p-3">
                <Select value={incidentType} onValueChange={(v) => setIncidentType(v as IncidentType)}>
                  <SelectTrigger className="h-9 text-sm border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INCIDENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  autoFocus
                  type="text"
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="内容を入力..."
                  onKeyDown={(e) => e.key === 'Enter' && addIncident()}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-gray-400"
                />
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setIncidentOpen(false); setIncidentDesc('') }}
                    className="flex-1 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg">
                    キャンセル
                  </button>
                  <button type="button" onClick={addIncident}
                    className="flex-1 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg font-medium">
                    記録する
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIncidentOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-3 border border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
                異常を記録
              </button>
            )}
          </div>
        </section>

        {/* ④ 今日のタスク */}
        {tasks.length > 0 && (
          <section className="px-5 py-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">今日のタスク</p>
            <div className="space-y-0.5">
              {tasks.map((task) => {
                const checked = checkedTaskIds.has(task.id)
                return (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => setCheckedTaskIds((p) => { const n = new Set(p); n.has(task.id) ? n.delete(task.id) : n.add(task.id); return n })}
                    className="w-full flex items-center gap-3 py-3 text-left"
                  >
                    <div className={`flex-shrink-0 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                      {checked && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className={`text-sm ${checked ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ⑤ コメント */}
        <section className="px-5 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">コメント</p>
          <Textarea
            rows={3}
            placeholder="コメントを入力してください（任意）"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="text-sm border-gray-200 resize-none"
          />
        </section>

      </div>

      {/* 提出ボタン */}
      <div className="px-5 pt-4">
        {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full py-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-base font-semibold rounded-2xl transition-colors flex items-center justify-center"
        >
          {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : '提出する'}
        </button>
      </div>

    </div>
  )
}
