export type Role = 'hq' | 'sv' | 'manager' | 'staff'
export type Industry = 'restaurant' | 'izakaya' | 'yakiniku' | 'cafe' | 'beauty' | 'nail' | 'other'
export type IncidentType = 'complaint' | 'shortage' | 'delay' | 'equipment' | 'other'
export type TaskStatus = 'open' | 'in_progress' | 'done'
export type AlertSeverity = 'warning' | 'info'
export type StoreStatus = 'good' | 'normal' | 'warning'
export type CustomerTag = 'vip' | 'regular' | 'new' | 'dormant'
export type HandoverPriority = 'high' | 'normal'

export interface Organization {
  id: string
  name: string
  plan: string
  created_at: string
}

export interface Store {
  id: string
  org_id: string
  name: string
  industry: Industry
  region: string
  seats: number
  price_range: string
  open_time: string
  close_time: string
  created_at: string
}

export interface Profile {
  id: string
  org_id: string
  store_id: string | null
  name: string
  role: Role
}

export interface Incident {
  id: string
  log_id: string
  type: IncidentType
  description: string
}

export interface DailyLog {
  id: string
  store_id: string
  date: string
  author_id: string
  handover_note: string
  memo: string
  submitted_at: string | null
  created_at: string
  incidents?: Incident[]
  author?: Profile
  store?: Store
  sales?: SalesData
  labor?: LaborData
}

export interface Handover {
  id: string
  org_id: string
  store_id: string
  author_id: string
  content: string
  priority: HandoverPriority
  is_confirmed: boolean
  confirmed_by: string | null
  confirmed_at: string | null
  date: string
  created_at: string
  author?: Profile
}

export interface SalesData {
  id: string
  store_id: string
  date: string
  total_sales: number
  customer_count: number
  avg_spend: number
}

export interface LaborData {
  id: string
  store_id: string
  date: string
  scheduled_hours: number
  actual_hours: number
  labor_cost: number
  labor_cost_ratio: number
}

export interface Task {
  id: string
  store_id: string
  org_id: string
  title: string
  category: string
  assignee_id: string | null
  due_date: string | null
  status: TaskStatus
  result: string | null
  created_at: string
  assignee?: Profile
  store?: Store
}

export interface Customer {
  id: string
  store_id: string
  name: string
  phone_hash: string
  visit_count: number
  last_visit: string
  total_spend: number
  tags: CustomerTag[]
  created_at: string
}
