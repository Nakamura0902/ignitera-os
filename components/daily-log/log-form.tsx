'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

type IncidentType = 'complaint' | 'shortage' | 'delay' | 'equipment' | 'other'

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

export function LogForm() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [incidentType, setIncidentType] = useState<IncidentType>('complaint')
  const [incidentDesc, setIncidentDesc] = useState('')

  const addIncident = () => {
    if (!incidentDesc.trim()) return
    setIncidents((prev) => [...prev, { type: incidentType, description: incidentDesc }])
    setIncidentDesc('')
  }

  const removeIncident = (index: number) => {
    setIncidents((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>日付</Label>
              <Input type="date" defaultValue="2026-05-15" />
            </div>
            <div className="space-y-1.5">
              <Label>担当店舗</Label>
              <Select defaultValue="1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">新宿店</SelectItem>
                  <SelectItem value="2">渋谷店</SelectItem>
                  <SelectItem value="3">池袋店</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>本日売上 (円)</Label>
              <Input type="number" placeholder="350000" />
            </div>
            <div className="space-y-1.5">
              <Label>人件費率 (%)</Label>
              <Input type="number" placeholder="29.5" step="0.1" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>引き継ぎメモ</Label>
            <Textarea
              rows={3}
              placeholder="翌シフトへの引き継ぎ事項を記入してください..."
            />
          </div>

          <div className="space-y-1.5">
            <Label>所感・メモ</Label>
            <Textarea
              rows={3}
              placeholder="今日の運営について気づいたことを記入..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">インシデント記録</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={incidentType}
              onValueChange={(v) => setIncidentType(v as IncidentType)}
            >
              <SelectTrigger className="w-36 flex-shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INCIDENT_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={incidentDesc}
              onChange={(e) => setIncidentDesc(e.target.value)}
              placeholder="内容を入力してEnterまたは追加ボタン"
              onKeyDown={(e) => e.key === 'Enter' && addIncident()}
            />
            <Button type="button" variant="outline" onClick={addIncident} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {incidents.length > 0 && (
            <div className="space-y-2">
              {incidents.map((inc, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                  <Badge
                    variant="outline"
                    className="text-orange-600 border-orange-300 bg-orange-50 flex-shrink-0"
                  >
                    {INCIDENT_TYPES.find((t) => t.value === inc.type)?.label}
                  </Badge>
                  <span className="text-sm flex-1 text-gray-700">{inc.description}</span>
                  <button
                    type="button"
                    onClick={() => removeIncident(i)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-400 transition-colors" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {incidents.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-2">
              インシデントはまだ追加されていません
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline">下書き保存</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          日報を提出する
        </Button>
      </div>
    </div>
  )
}
