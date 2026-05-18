import { KpiCards } from '@/components/hq/kpi-cards'
import { SalesTrendChart } from '@/components/hq/sales-trend-chart'
import { StoreComparisonTable } from '@/components/hq/store-comparison-table'
import { AlertList } from '@/components/hq/alert-list'
import { getHqDashboard } from '@/lib/queries/hq'

export const dynamic = 'force-dynamic'

export default async function HQPage() {
  const data = await getHqDashboard()

  return (
    <div className="space-y-6">
      <KpiCards data={data?.kpi} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <AlertList alerts={data?.alerts} />
      </div>
      <StoreComparisonTable stores={data?.stores} />
    </div>
  )
}
