import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { CustomerTag } from '@/types'

const TAG_LABELS: Record<CustomerTag, string> = {
  vip: 'VIP',
  regular: '定期',
  new: '新規',
  dormant: '休眠',
}

const TAG_COLORS: Record<CustomerTag, string> = {
  vip: 'bg-blue-100 text-blue-700',
  regular: 'bg-blue-100 text-blue-700',
  new: 'bg-green-100 text-green-700',
  dormant: 'bg-gray-100 text-gray-600',
}

interface Customer {
  id: string
  name: string
  visit_count: number
  last_visit: string
  total_spend: number
  tags: CustomerTag[]
}

export function SegmentTable({ customers }: { customers: Customer[] }) {
  if (customers.length === 0) {
    return (
      <div className="mt-4 py-10 text-center text-sm text-gray-400 border rounded-lg bg-white">
        該当する顧客はいません
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>顧客名</TableHead>
            <TableHead className="text-right">来店回数</TableHead>
            <TableHead className="text-right">最終来店</TableHead>
            <TableHead className="text-right">累計消費</TableHead>
            <TableHead>タグ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.id} className="cursor-pointer hover:bg-gray-50">
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-right">{c.visit_count}回</TableCell>
              <TableCell className="text-right">{c.last_visit}</TableCell>
              <TableCell className="text-right">
                ¥{c.total_spend.toLocaleString('ja-JP')}
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {c.tags.map((tag) => (
                    <Badge key={tag} className={`text-xs ${TAG_COLORS[tag]}`}>
                      {TAG_LABELS[tag]}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
