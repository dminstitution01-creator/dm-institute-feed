import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
  const { data, error } = await admin.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const users = data.users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name ?? u.email,
    username: u.user_metadata?.username ?? u.email?.replace('@dm.local', '') ?? '',
    nickname: u.user_metadata?.nickname ?? u.user_metadata?.name ?? '',
    role: u.user_metadata?.role ?? 'student',
  }))
  return NextResponse.json({ users })
}
