import { BenchmarkRadar } from '@/components/benchmark/benchmark-radar'
import { BenchmarkBars } from '@/components/benchmark/benchmark-bars'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BenchmarkPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ベンチマーク比較</h2>
          <p className="text-sm text-gray-500 mt-0.5">同業他店との比較で自店の強みと課題を把握</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="izakaya">
            <SelectTrigger className="w-36 bg-white">
              <SelectValue placeholder="業態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="izakaya">居酒屋</SelectItem>
              <SelectItem value="yakiniku">焼肉</SelectItem>
              <SelectItem value="cafe">カフェ</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="tokyo">
            <SelectTrigger className="w-36 bg-white">
              <SelectValue placeholder="地域" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tokyo">東京都内</SelectItem>
              <SelectItem value="osaka">大阪</SelectItem>
              <SelectItem value="all">全国</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BenchmarkRadar />
        <BenchmarkBars />
      </div>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <p className="text-sm font-medium text-blue-800">分析サマリー</p>
        <p className="mt-1 text-sm text-blue-700">
          新宿店は売上効率・客単価で同業平均を上回っています。一方、再来店率は上位20%と約13pt差があり、
          顧客リピート施策が最大の改善機会です。
        </p>
      </div>
    </div>
  )
}
