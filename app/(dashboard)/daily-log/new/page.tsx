import { LogForm } from '@/components/daily-log/log-form'

export default function NewLogPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">新規日報入力</h2>
        <p className="text-sm text-gray-500 mt-0.5">本日の運営状況を記録してください</p>
      </div>
      <LogForm />
    </div>
  )
}
