'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/actions/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        await signIn(email, password)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'ログインに失敗しました')
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm px-4">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/ignitera-logo.png"
            alt="Ignitera"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
          />
          <p className="text-sm text-gray-400">店舗運営を、データで磨く。</p>
        </div>

        <Card className="border-gray-100 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-gray-900 text-lg">ログイン</CardTitle>
            <CardDescription className="text-gray-400">
              メールアドレスとパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-600">メールアドレス</Label>
                <Input
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-600">パスワード</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-gray-200"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ログイン'}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-gray-400">
              パスワードをお忘れの方は管理者にお問い合わせください
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
