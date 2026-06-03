'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Loader2, Building2, Store } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createOrgAndStore } from '@/lib/actions/onboarding'
import type { Industry } from '@/types'

const INDUSTRY_OPTIONS: { value: Industry; label: string }[] = [
  { value: 'izakaya', label: '居酒屋' },
  { value: 'restaurant', label: 'レストラン・食堂' },
  { value: 'yakiniku', label: '焼肉・焼き鳥' },
  { value: 'cafe', label: 'カフェ・喫茶店' },
  { value: 'beauty', label: '美容室' },
  { value: 'nail', label: 'ネイルサロン' },
  { value: 'other', label: 'その他' },
]

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2>(1)
  const [orgName, setOrgName] = useState('')
  const [storeName, setStoreName] = useState('')
  const [industry, setIndustry] = useState<Industry>('izakaya')
  const [region, setRegion] = useState('')
  const [seats, setSeats] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgName.trim()) return
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await createOrgAndStore({
          orgName,
          storeName,
          industry,
          region,
          seats: parseInt(seats) || 0,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : '設定に失敗しました')
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/ignitera-logo.png"
            alt="Ignitera"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
          />
          <p className="text-sm text-gray-400">はじめに組織と店舗を設定してください</p>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
          <div className="h-px flex-1 bg-gray-200" />
          <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
        </div>

        {step === 1 ? (
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-gray-900 text-lg">会社・グループ名</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                複数店舗をまとめる組織の名前を入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStep1} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">組織名</Label>
                  <Input
                    placeholder="例: 株式会社〇〇フードサービス"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className="border-gray-200"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={!orgName.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  次へ
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-gray-100 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-gray-900 text-lg">最初の店舗を登録</CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                あとからいつでも追加・編集できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-600">店舗名</Label>
                  <Input
                    placeholder="例: 新宿店"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    className="border-gray-200"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-600">業種</Label>
                  <Select value={industry} onValueChange={(v) => setIndustry(v as Industry)}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-gray-600">エリア</Label>
                    <Input
                      placeholder="例: 東京・新宿"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-600">席数</Label>
                    <Input
                      type="number"
                      placeholder="例: 40"
                      value={seats}
                      onChange={(e) => setSeats(e.target.value)}
                      className="border-gray-200"
                    />
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-200"
                    onClick={() => setStep(1)}
                    disabled={isPending}
                  >
                    戻る
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !storeName.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : '設定完了'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
