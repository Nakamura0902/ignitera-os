'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, BarChart3, CheckSquare, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/hq', icon: LayoutDashboard, label: 'HQダッシュボード' },
  { href: '/daily-log', icon: ClipboardList, label: '店舗デイリーログ' },
  { href: '/benchmark', icon: BarChart3, label: 'ベンチマーク比較' },
  { href: '/actions', icon: CheckSquare, label: '改善アクション' },
  { href: '/customers', icon: Users, label: '顧客セグメント' },
]

interface SidebarProps {
  userName: string
  userRole: string
}

export function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname()
  const initial = userName.charAt(0) || '?'

  const roleLabel: Record<string, string> = {
    hq: '本部管理者',
    sv: 'スーパーバイザー',
    manager: '店長',
    staff: 'スタッフ',
  }

  return (
    <aside className="flex h-full w-60 flex-col flex-shrink-0" style={{ backgroundColor: '#1e3a6e' }}>
      <div className="flex h-16 items-center px-5 border-b border-white/10">
        <Image
          src="/ignitera-logo.png"
          alt="Ignitera"
          width={120}
          height={36}
          className="h-8 w-auto object-contain"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
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
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-white' : 'text-white/50')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white">{userName || '—'}</p>
            <p className="truncate text-xs text-white/50">{roleLabel[userRole] ?? userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
