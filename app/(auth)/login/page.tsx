import { Flame } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">メールアドレス</Label>
              <Input
                type="email"
                placeholder="your@company.com"
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">パスワード</Label>
              <Input
                type="password"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
              ログイン
            </Button>
            <p className="text-center text-xs text-gray-500">
              パスワードをお忘れの方は管理者にお問い合わせください
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
