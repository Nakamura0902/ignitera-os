'use client'

import { useState, type ReactNode } from 'react'
import { StoreContext, type StoreItem } from '@/hooks/use-store'

interface StoreProviderProps {
  children: ReactNode
  stores: StoreItem[]
}

export function StoreProvider({ children, stores }: StoreProviderProps) {
  const [selectedStore, setSelectedStore] = useState<StoreItem | null>(null)

  return (
    <StoreContext.Provider value={{ selectedStore, setSelectedStore, stores }}>
      {children}
    </StoreContext.Provider>
  )
}
