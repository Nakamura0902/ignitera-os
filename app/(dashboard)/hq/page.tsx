import { KpiCards } from '@/components/hq/kpi-cards'
import { SalesTrendChart } from '@/components/hq/sales-trend-chart'
import { StoreComparisonTable } from '@/components/hq/store-comparison-table'
import { AlertList } from '@/components/hq/alert-list'

export default function HQPage() {
  return (
    <div className="space-y-6">
      <KpiCards />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SalesTrendChart />
        </div>
        <AlertList />
      </div>
      <StoreComparisonTable />
    </div>
  )
}
