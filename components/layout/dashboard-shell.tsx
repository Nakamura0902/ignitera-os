'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { StoreProvider } from './store-provider'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import type { StoreItem } from '@/hooks/use-store'

interface DashboardShellProps {
  children: ReactNode
  userName: string
  userRole: string
  stores: StoreItem[]
}

export function DashboardShell({ children, userName, userRole, stores }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <StoreProvider stores={stores}>
      <div className="flex h-screen overflow-hidden">
        <div className="hidden md:flex">
          <Sidebar userName={userName} userRole={userRole} />
        </div>

        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 border-0">
            <SheetTitle className="sr-only">ナビゲーション</SheetTitle>
            <Sidebar userName={userName} userRole={userRole} />
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-white p-6">
            {children}
          </main>
        </div>
      </div>
    </StoreProvider>
  )
}
