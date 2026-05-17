import { subDays, format } from 'date-fns'
import type { TaskStatus, AlertSeverity, StoreStatus, CustomerTag, IncidentType } from '@/types'

export const MOCK_STORES = [
  { id: '1', name: '新宿店', industry: '居酒屋', region: '東京・新宿', seats: 50 },
  { id: '2', name: '渋谷店', industry: '居酒屋', region: '東京・渋谷', seats: 40 },
  { id: '3', name: '池袋店', industry: '居酒屋', region: '東京・池袋', seats: 60 },
]

export const MOCK_KPI = {
  total_sales_today: 1_048_000,
  total_sales_yesterday: 987_500,
  avg_labor_cost_ratio: 28.4,
  avg_labor_cost_ratio_prev: 26.1,
  revisit_rate: 42.3,
  revisit_rate_prev: 39.8,
  active_alerts: 3,
}

export function generateSalesTrend() {
  const today = new Date()
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(today, 6 - i)
    return format(date, 'M/d')
  })

  const seed = (n: number, offset: number) =>
    Math.round(n * (0.82 + ((offset * 0.137) % 0.36)))

  return {
    labels: days,
    stores: [
      {
        id: '1',
        name: '新宿店',
        color: '#f97316',
        data: days.map((_, i) => seed(340000, i + 1)),
      },
      {
        id: '2',
        name: '渋谷店',
        color: '#3b82f6',
        data: days.map((_, i) => seed(270000, i + 3)),
      },
      {
        id: '3',
        name: '池袋店',
        color: '#8b5cf6',
        data: days.map((_, i) => seed(440000, i + 5)),
      },
    ],
  }
}

export const MOCK_STORE_COMPARISON: {
  id: string
  name: string
  today_sales: number
  labor_cost_ratio: number
  customer_count: number
  avg_spend: number
  prev_week_diff: number
  incidents: number
  status: StoreStatus
}[] = [
  {
    id: '1',
    name: '新宿店',
    today_sales: 352_000,
    labor_cost_ratio: 29.2,
    customer_count: 98,
    avg_spend: 3592,
    prev_week_diff: 8.3,
    incidents: 1,
    status: 'normal',
  },
  {
    id: '2',
    name: '渋谷店',
    today_sales: 268_000,
    labor_cost_ratio: 34.1,
    customer_count: 75,
    avg_spend: 3573,
    prev_week_diff: -4.2,
    incidents: 2,
    status: 'warning',
  },
  {
    id: '3',
    name: '池袋店',
    today_sales: 428_000,
    labor_cost_ratio: 24.8,
    customer_count: 121,
    avg_spend: 3537,
    prev_week_diff: 12.1,
    incidents: 0,
    status: 'good',
  },
]

export const MOCK_ALERTS: {
  id: string
  store_name: string
  type: string
  message: string
  created_at: string
  severity: AlertSeverity
}[] = [
  {
    id: '1',
    store_name: '渋谷店',
    type: 'labor_cost',
    message: '人件費率が目標(30%)を超過: 34.1%',
    created_at: '2026-05-15T09:30:00',
    severity: 'warning',
  },
  {
    id: '2',
    store_name: '渋谷店',
    type: 'incident',
    message: '昨日2件のインシデント記録あり（クレーム1件・欠品1件）',
    created_at: '2026-05-15T08:00:00',
    severity: 'warning',
  },
  {
    id: '3',
    store_name: '新宿店',
    type: 'sales',
    message: '月曜日の売上が先週比 -12%',
    created_at: '2026-05-15T07:45:00',
    severity: 'info',
  },
]

export const MOCK_DAILY_LOGS: {
  id: string
  store_name: string
  date: string
  author: string
  handover_note: string
  incidents: { type: IncidentType; description: string }[]
  today_sales: number
  labor_cost_ratio: number
}[] = [
  {
    id: '1',
    store_name: '新宿店',
    date: '2026-05-15',
    author: '鈴木 花子',
    handover_note: '夜のピーク時に混雑。テーブル6番のビールジョッキ追加発注済み。',
    incidents: [{ type: 'complaint', description: 'テーブル4番 料理提供遅延のクレーム' }],
    today_sales: 352000,
    labor_cost_ratio: 29.2,
  },
  {
    id: '2',
    store_name: '渋谷店',
    date: '2026-05-15',
    author: '佐藤 健',
    handover_note: 'ランチ来客数少なめ。明日の仕入れ量を調整予定。',
    incidents: [
      { type: 'shortage', description: 'サバの味噌煮 品切れ（14:00〜）' },
      { type: 'complaint', description: 'テーブル2番 スタッフ対応への苦情' },
    ],
    today_sales: 268000,
    labor_cost_ratio: 34.1,
  },
  {
    id: '3',
    store_name: '池袋店',
    date: '2026-05-15',
    author: '中村 悠太',
    handover_note: '全体的に好調。週末に向けた仕込み量を増やす予定。',
    incidents: [],
    today_sales: 428000,
    labor_cost_ratio: 24.8,
  },
]

export const MOCK_TASKS: {
  id: string
  title: string
  category: string
  store_name: string
  assignee: string
  due_date: string
  status: TaskStatus
  result: string | null
}[] = [
  {
    id: '1',
    title: '渋谷店スタッフ接客研修の実施',
    category: '人材育成',
    store_name: '渋谷店',
    assignee: '佐藤 健',
    due_date: '2026-05-20',
    status: 'open',
    result: null,
  },
  {
    id: '2',
    title: '新宿店メニュー原価率の見直し',
    category: '原価管理',
    store_name: '新宿店',
    assignee: '鈴木 花子',
    due_date: '2026-05-25',
    status: 'in_progress',
    result: null,
  },
  {
    id: '3',
    title: '池袋店シフト最適化（土日）',
    category: 'シフト管理',
    store_name: '池袋店',
    assignee: '中村 悠太',
    due_date: '2026-05-18',
    status: 'done',
    result: '土日の人件費率を28%→24%に改善。',
  },
]

export const MOCK_BENCHMARK = {
  my_store: { name: '新宿店', sales_efficiency: 72, labor_cost_ratio: 29, revisit_rate: 42, incident_rate: 12, avg_spend: 3592 },
  industry_avg: { name: '同業平均', sales_efficiency: 65, labor_cost_ratio: 30, revisit_rate: 38, incident_rate: 15, avg_spend: 3400 },
  top_stores: { name: '上位20%', sales_efficiency: 85, labor_cost_ratio: 25, revisit_rate: 55, incident_rate: 6, avg_spend: 4200 },
}

export const MOCK_CUSTOMERS: {
  id: string
  name: string
  visit_count: number
  last_visit: string
  total_spend: number
  tags: CustomerTag[]
}[] = [
  { id: '1', name: '田中 ○○', visit_count: 24, last_visit: '2026-05-14', total_spend: 95200, tags: ['vip'] },
  { id: '2', name: '山田 ○○', visit_count: 18, last_visit: '2026-05-10', total_spend: 71400, tags: ['vip', 'regular'] },
  { id: '3', name: '鈴木 ○○', visit_count: 3, last_visit: '2026-05-15', total_spend: 11800, tags: ['new'] },
  { id: '4', name: '佐藤 ○○', visit_count: 8, last_visit: '2026-03-01', total_spend: 31200, tags: ['dormant'] },
  { id: '5', name: '伊藤 ○○', visit_count: 15, last_visit: '2026-04-20', total_spend: 58500, tags: ['regular'] },
  { id: '6', name: '渡辺 ○○', visit_count: 2, last_visit: '2026-05-12', total_spend: 7800, tags: ['new'] },
  { id: '7', name: '小林 ○○', visit_count: 11, last_visit: '2026-02-15', total_spend: 43200, tags: ['dormant'] },
]
