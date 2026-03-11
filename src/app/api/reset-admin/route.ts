import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return NextResponse.json({ error: '환경변수 없음', url: !!url, key: !!key })

  const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

  const { data, error } = await admin.auth.admin.updateUserById(
    '41bc4748-a2ac-4466-85f1-3062c3cb8ad1',
    { password: 'admin1234' }
  )

  if (error) return NextResponse.json({ error: error.message, url })
  return NextResponse.json({ ok: true, email: data.user.email })
}
