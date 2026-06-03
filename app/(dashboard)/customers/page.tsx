import { redirect } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SegmentTable } from '@/components/customers/segment-table'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import type { CustomerTag } from '@/types'

export const dynamic = 'force-dynamic'

export default async function CustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, store_id')
    .eq('id', user.id)
    .single()

  let customers: { id: string; name: string; visit_count: number; last_visit: string; total_spend: number; tags: CustomerTag[] }[] = []

  if (profile?.org_id) {
    const { data: stores } = await supabase
      .from('stores')
      .select('id')
      .eq('org_id', profile.org_id)

    if (stores && stores.length > 0) {
      const { data } = await supabase
        .from('customers')
        .select('id, name, visit_count, last_visit, total_spend, tags')
        .in('store_id', stores.map((s: { id: string }) => s.id))
        .order('total_spend', { ascending: false })

      customers = (data ?? []) as typeof customers
    }
  }

  const vip = customers.filter((c) => c.tags.includes('vip'))
  const regular = customers.filter((c) => c.tags.includes('regular'))
  const newCustomers = customers.filter((c) => c.tags.includes('new'))
  const dormant = customers.filter((c) => c.tags.includes('dormant'))

  const segments = [
    { key: 'vip', label: 'VIP客', count: vip.length, color: 'text-blue-700', bg: 'border-l-4 border-l-blue-700' },
    { key: 'regular', label: '定期客', count: regular.length, color: 'text-blue-600', bg: 'border-l-4 border-l-blue-500' },
    { key: 'new', label: '新規客', count: newCustomers.length, color: 'text-blue-400', bg: 'border-l-4 border-l-blue-300' },
    { key: 'dormant', label: '休眠客', count: dormant.length, color: 'text-gray-600', bg: 'border-l-4 border-l-gray-300' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">顧客セグメント</h2>
        <p className="text-sm text-gray-500 mt-0.5">顧客を分類し、再来店施策に活用する</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {segments.map((seg) => (
          <Card key={seg.key} className={seg.bg}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-1">{seg.label}</p>
              <p className={`text-2xl font-bold ${seg.color}`}>{seg.count}人</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {customers.length === 0 ? (
        <div className="py-12 text-center text-sm text-gray-400 border rounded-lg bg-white">
          顧客データがまだありません
        </div>
      ) : (
        <Tabs defaultValue="vip">
          <TabsList className="bg-white border">
            <TabsTrigger value="vip">VIP客</TabsTrigger>
            <TabsTrigger value="regular">定期客</TabsTrigger>
            <TabsTrigger value="new">新規客</TabsTrigger>
            <TabsTrigger value="dormant">休眠客</TabsTrigger>
          </TabsList>
          <TabsContent value="vip"><SegmentTable customers={vip} /></TabsContent>
          <TabsContent value="regular"><SegmentTable customers={regular} /></TabsContent>
          <TabsContent value="new"><SegmentTable customers={newCustomers} /></TabsContent>
          <TabsContent value="dormant"><SegmentTable customers={dormant} /></TabsContent>
        </Tabs>
      )}
    </div>
  )
}
