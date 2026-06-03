import { NextResponse, type NextRequest } from 'next/server'

// 認証ガードは app/(dashboard)/layout.tsx で行う
// ミドルウェアは Supabase セッションクッキーのリフレッシュのみ担当するが、
// Vercel Edge のタイムアウト制約のためここでは何もしない
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
