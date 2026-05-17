'use client'

import { Calendar, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_TASKS } from '@/lib/mock-data'
import type { TaskStatus } from '@/types'

const COLUMNS: { status: TaskStatus; label: string; topColor: string }[] = [
  { status: 'open', label: '未着手', topColor: 'border-t-gray-400' },
  { status: 'in_progress', label: '進行中', topColor: 'border-t-orange-500' },
  { status: 'done', label: '完了', topColor: 'border-t-green-500' },
]

const CATEGORY_COLORS: Record<string, string> = {
  人材育成: 'bg-blue-100 text-blue-700',
  原価管理: 'bg-purple-100 text-purple-700',
  シフト管理: 'bg-green-100 text-green-700',
  メニュー: 'bg-yellow-100 text-yellow-700',
  接客: 'bg-pink-100 text-pink-700',
}

export function ActionBoard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {COLUMNS.map((col) => {
        const tasks = MOCK_TASKS.filter((t) => t.status === col.status)
        return (
          <div key={col.status}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
              <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5 font-medium">
                {tasks.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card
                  key={task.id}
                  className={`border-t-4 ${col.topColor} cursor-pointer hover:shadow-md transition-shadow`}
                >
                  <CardContent className="p-4">
                    <p className="font-medium text-sm text-gray-900 mb-2 leading-snug">
                      {task.title}
                    </p>
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      <Badge
                        className={`text-xs ${CATEGORY_COLORS[task.category] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {task.category}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.store_name}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        {task.assignee}
                      </div>
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="h-3 w-3" />
                          期限: {task.due_date}
                        </div>
                      )}
                    </div>
                    {task.result && (
                      <p className="text-xs text-green-700 bg-green-50 rounded p-2 mt-2 leading-relaxed">
                        {task.result}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
              {tasks.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-xs text-gray-400">タスクなし</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
