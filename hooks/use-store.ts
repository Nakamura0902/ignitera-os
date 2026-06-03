'use client'

import { createContext, useContext } from 'react'

export interface StoreItem {
  id: string
  name: string
}

export interface StoreContextType {
  selectedStore: StoreItem | null
  setSelectedStore: (store: StoreItem | null) => void
  stores: StoreItem[]
}

export const StoreContext = createContext<StoreContextType | null>(null)

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
