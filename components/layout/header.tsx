'use client'

import { usePathname } from 'next/navigation'
import { Bell, ChevronDown, Menu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useStore } from '@/hooks/use-store'

const PAGE_TITLES: Record<string, string> = {
  '/hq': 'HQダッシュボード',
  '/daily-log': '店舗デイリーログ',
  '/benchmark': 'ベンチマーク比較',
  '/actions': '改善アクションセンター',
  '/customers': '顧客セグメント',
}

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname()
  const { selectedStore, setSelectedStore, stores } = useStore()

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key))?.[1] ?? ''

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
          aria-label="メニューを開く"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold text-gray-900">{pageTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
            {selectedStore?.name ?? '全店舗'}
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setSelectedStore(null)}>
              全店舗
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {stores.map((store) => (
              <DropdownMenuItem key={store.id} onClick={() => setSelectedStore(store)}>
                {store.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <button className="relative rounded-lg p-1.5 text-gray-500 hover:bg-gray-100" aria-label="通知">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-orange-500" />
        </button>
      </div>
    </header>
  )
}
