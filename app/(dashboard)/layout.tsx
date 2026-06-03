import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, name, role')
    .eq('id', user.id)
    .single()

  if (!profile?.org_id) redirect('/onboarding')

  const { data: stores } = await supabase
    .from('stores')
    .select('id, name')
    .eq('org_id', profile.org_id)
    .order('name')

  return (
    <DashboardShell
      userName={profile.name || user.email || ''}
      userRole={profile.role}
      stores={stores ?? []}
    >
      {children}
    </DashboardShell>
  )
}
