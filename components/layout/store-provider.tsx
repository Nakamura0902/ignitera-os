'use client'

import { useState, type ReactNode } from 'react'
import { StoreContext, STORES, type StoreItem } from '@/hooks/use-store'

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null)

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore, stores: STORES }}>
      {children}
    </StoreContext.Provider>
  )
}
