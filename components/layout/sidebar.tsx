'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, BarChart3, CheckSquare, Users, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/hq', icon: LayoutDashboard, label: 'HQダッシュボード' },
  { href: '/daily-log', icon: ClipboardList, label: '店舗デイリーログ' },
  { href: '/benchmark', icon: BarChart3, label: 'ベンチマーク比較' },
  { href: '/actions', icon: CheckSquare, label: '改善アクション' },
  { href: '/customers', icon: Users, label: '顧客セグメント' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-full w-64 flex-col bg-gray-900 flex-shrink-0">
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-700/60 px-6">
        <Flame className="h-6 w-6 text-orange-400" />
        <span className="text-lg font-bold tracking-tight text-white">Ignitera OS</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              )}
            >
              <item.icon
                className={cn(
                  'h-4 w-4 flex-shrink-0',
                  isActive ? 'text-orange-400' : 'text-gray-500'
                )}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-700/60 p-4">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white flex-shrink-0">
            田
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-gray-200">田中 太郎</p>
            <p className="truncate text-xs text-gray-500">本部管理者</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
