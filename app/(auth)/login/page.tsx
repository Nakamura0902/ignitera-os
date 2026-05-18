'use client'

import { useState, useTransition } from 'react'
import { Flame, Loader2 } from 'lucide-react'
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
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm px-4">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2">
            <Flame className="h-8 w-8 text-orange-400" />
            <span className="text-2xl font-bold text-white">Ignitera OS</span>
          </div>
          <p className="text-sm text-gray-400">店舗運営を、データで磨く。</p>
        </div>

        <Card className="border-gray-700 bg-gray-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-white text-lg">ログイン</CardTitle>
            <CardDescription className="text-gray-400">
              メールアドレスとパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300">メールアドレス</Label>
                <Input
                  type="email"
                  placeholder="your@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">パスワード</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'ログイン'}
              </Button>
            </form>
            <p className="mt-4 text-center text-xs text-gray-500">
              パスワードをお忘れの方は管理者にお問い合わせください
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
