import { ActionBoard } from '@/components/actions/action-board'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function ActionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">改善アクションセンター</h2>
          <p className="text-sm text-gray-500 mt-0.5">課題から施策・実行・効果検証まで一元管理</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          <Plus className="h-4 w-4 mr-1.5" />
          新規アクション
        </Button>
      </div>
      <ActionBoard />
    </div>
  )
}
