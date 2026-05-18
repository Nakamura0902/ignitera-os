'use client'

import { useState, type ReactNode } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'
import { StoreProvider } from './store-provider'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

export function DashboardShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <StoreProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-64 p-0 border-0">
            <SheetTitle className="sr-only">ナビゲーション</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main area */}
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
