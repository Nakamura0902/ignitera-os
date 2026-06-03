import { redirect } from 'next/navigation'
import { KpiCards } from '@/components/hq/kpi-cards'
import { SalesTrendChart } from '@/components/hq/sales-trend-chart'
import { StoreComparisonTable } from '@/components/hq/store-comparison-table'
import { AlertList } from '@/components/hq/alert-list'
import { getHqDashboard, getSalesTrend } from '@/lib/queries/hq'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function HQPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile?.org_id) redirect('/onboarding')

  const [data, trend] = await Promise.all([
    getHqDashboard(),
    getSalesTrend(profile.org_id),
  ])

  return (
    <div className="space-y-6">
      <KpiCards data={data?.kpi} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart data={trend} />
        </div>
        <AlertList alerts={data?.alerts} />
      </div>
      <StoreComparisonTable stores={data?.stores} />
    </div>
  )
}
