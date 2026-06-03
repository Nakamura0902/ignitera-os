import { createClient } from '@/lib/supabase/server'
import { format, subDays } from 'date-fns'
import type { AlertSeverity, StoreStatus } from '@/types'

export interface HqStoreRow {
  id: string
  name: string
  today_sales: number
  customer_count: number
  avg_spend: number
  labor_cost_ratio: number
  prev_week_diff: number
  log_submitted: boolean
  status: StoreStatus
}

export interface HqAlert {
  id: string
  store_id: string
  store_name: string
  type: string
  message: string
  severity: AlertSeverity
}

export interface HqKpi {
  total_sales_today: number
  total_sales_yesterday: number
  avg_labor_cost_ratio: number
  avg_labor_cost_ratio_prev: number
  submitted_count: number
  total_stores: number
  active_alerts: number
}

export interface HqDashboardData {
  kpi: HqKpi
  stores: HqStoreRow[]
  alerts: HqAlert[]
  date: string
}

interface StoreRow { id: string; name: string }
interface SalesRow { store_id: string; total_sales: number; customer_count: number; avg_spend: number }
interface LaborRow { store_id: string; labor_cost_ratio: number }
interface LogRow { store_id: string; submitted_at: string | null }
interface TaskRow { store_id: string; due_date: string | null; status: string }

export interface SalesTrendStore {
  id: string
  name: string
  color: string
  data: number[]
}

export interface SalesTrendData {
  labels: string[]
  stores: SalesTrendStore[]
}

const STORE_COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export async function getSalesTrend(orgId: string): Promise<SalesTrendData> {
  const supabase = await createClient()
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i)
    return format(d, 'yyyy-MM-dd')
  })
  const labels = days.map((d) => {
    const [, m, day] = d.split('-')
    return `${parseInt(m)}/${parseInt(day)}`
  })

  const { data: stores } = await supabase
    .from('stores')
    .select('id, name')
    .eq('org_id', orgId)
    .order('name')

  if (!stores || stores.length === 0) return { labels, stores: [] }

  const { data: salesRaw } = await supabase
    .from('sales_data')
    .select('store_id, date, total_sales')
    .in('store_id', stores.map((s: { id: string }) => s.id))
    .gte('date', days[0])
    .lte('date', days[6])

  const salesMap = new Map<string, number>()
  for (const row of (salesRaw ?? []) as { store_id: string; date: string; total_sales: number }[]) {
    salesMap.set(`${row.store_id}__${row.date}`, row.total_sales)
  }

  return {
    labels,
    stores: (stores as { id: string; name: string }[]).map((store, i) => ({
      id: store.id,
      name: store.name,
      color: STORE_COLORS[i % STORE_COLORS.length],
      data: days.map((d) => salesMap.get(`${store.id}__${d}`) ?? 0),
    })),
  }
}

export async function getHqDashboard(date?: string): Promise<HqDashboardData | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  const today = date ?? format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(today), 1), 'yyyy-MM-dd')
  const prevWeek = format(subDays(new Date(today), 7), 'yyyy-MM-dd')
  const orgId: string = (profile as { org_id: string }).org_id

  const [
    { data: storesRaw },
    { data: todaySalesRaw },
    { data: yesterdaySalesRaw },
    { data: prevWeekSalesRaw },
    { data: laborTodayRaw },
    { data: laborYestRaw },
    { data: logsRaw },
    { data: tasksRaw },
  ] = await Promise.all([
    supabase.from('stores').select('id, name').eq('org_id', orgId).order('name'),
    supabase.from('sales_data').select('store_id, total_sales, customer_count, avg_spend').eq('date', today),
    supabase.from('sales_data').select('store_id, total_sales').eq('date', yesterday),
    supabase.from('sales_data').select('store_id, total_sales').eq('date', prevWeek),
    supabase.from('labor_data').select('store_id, labor_cost_ratio').eq('date', today),
    supabase.from('labor_data').select('store_id, labor_cost_ratio').eq('date', yesterday),
    supabase.from('daily_logs').select('store_id, submitted_at').eq('date', today),
    supabase.from('tasks').select('store_id, due_date, status').eq('org_id', orgId).neq('status', 'done'),
  ])

  if (!storesRaw) return null

  const stores = storesRaw as StoreRow[]
  const todaySales = (todaySalesRaw ?? []) as SalesRow[]
  const yesterdaySales = (yesterdaySalesRaw ?? []) as SalesRow[]
  const prevWeekSales = (prevWeekSalesRaw ?? []) as SalesRow[]
  const laborToday = (laborTodayRaw ?? []) as LaborRow[]
  const laborYest = (laborYestRaw ?? []) as LaborRow[]
  const logs = (logsRaw ?? []) as LogRow[]
  const tasks = (tasksRaw ?? []) as TaskRow[]

  const todaySalesMap = new Map(todaySales.map((r) => [r.store_id, r]))
  const yesterdaySalesMap = new Map(yesterdaySales.map((r) => [r.store_id, r.total_sales]))
  const prevWeekSalesMap = new Map(prevWeekSales.map((r) => [r.store_id, r.total_sales]))
  const laborTodayMap = new Map(laborToday.map((r) => [r.store_id, r.labor_cost_ratio]))
  const logMap = new Map(logs.map((r) => [r.store_id, r]))

  const overdueDate = format(new Date(), 'yyyy-MM-dd')
  const overdueByStore = new Map<string, number>()
  for (const task of tasks) {
    if (task.due_date && task.due_date < overdueDate) {
      overdueByStore.set(task.store_id, (overdueByStore.get(task.store_id) ?? 0) + 1)
    }
  }

  const storeRows: HqStoreRow[] = stores.map((store) => {
    const sales = todaySalesMap.get(store.id)
    const todaySalesVal = sales?.total_sales ?? 0
    const prevWeekVal = prevWeekSalesMap.get(store.id) ?? 0
    const prevWeekDiff = prevWeekVal > 0
      ? Number((((todaySalesVal - prevWeekVal) / prevWeekVal) * 100).toFixed(1))
      : 0
    const laborRate = laborTodayMap.get(store.id) ?? 0
    const submitted = !!logMap.get(store.id)?.submitted_at
    const overdue = overdueByStore.get(store.id) ?? 0

    let status: StoreStatus = 'normal'
    if (laborRate > 32 || overdue > 0) status = 'warning'
    if (laborRate < 28 && todaySalesVal > 0 && overdue === 0) status = 'good'

    return {
      id: store.id,
      name: store.name,
      today_sales: todaySalesVal,
      customer_count: sales?.customer_count ?? 0,
      avg_spend: sales?.avg_spend ?? 0,
      labor_cost_ratio: laborRate,
      prev_week_diff: prevWeekDiff,
      log_submitted: submitted,
      status,
    }
  })

  const alerts: HqAlert[] = []
  for (const row of storeRows) {
    if (!row.log_submitted) {
      alerts.push({ id: `unsubmitted-${row.id}`, store_id: row.id, store_name: row.name, type: 'unsubmitted', message: '日報が未提出です', severity: 'warning' })
    }
    if (row.labor_cost_ratio > 32) {
      alerts.push({ id: `labor-${row.id}`, store_id: row.id, store_name: row.name, type: 'labor_cost', message: `人件費率が高めです: ${row.labor_cost_ratio}%`, severity: 'warning' })
    }
    const overdue = overdueByStore.get(row.id)
    if (overdue) {
      alerts.push({ id: `overdue-${row.id}`, store_id: row.id, store_name: row.name, type: 'overdue_task', message: `期限切れタスクがあります (${overdue}件)`, severity: 'warning' })
    }
  }

  const totalSalesToday = storeRows.reduce((s, r) => s + r.today_sales, 0)
  const totalSalesYesterday = yesterdaySales.reduce((s, r) => s + r.total_sales, 0)
  const avgLaborToday = laborToday.length > 0
    ? Number((laborToday.reduce((s, r) => s + r.labor_cost_ratio, 0) / laborToday.length).toFixed(1))
    : 0
  const avgLaborYest = laborYest.length > 0
    ? Number((laborYest.reduce((s, r) => s + r.labor_cost_ratio, 0) / laborYest.length).toFixed(1))
    : 0
  const submittedCount = storeRows.filter((r) => r.log_submitted).length

  return {
    date: today,
    kpi: {
      total_sales_today: totalSalesToday,
      total_sales_yesterday: totalSalesYesterday,
      avg_labor_cost_ratio: avgLaborToday,
      avg_labor_cost_ratio_prev: avgLaborYest,
      submitted_count: submittedCount,
      total_stores: stores.length,
      active_alerts: alerts.length,
    },
    stores: storeRows,
    alerts,
  }
}
