import { supabase } from './supabase'

export interface AppUser {
  id: string
  name: string
  role: 'admin' | 'student'
  email: string
}

export async function login(email: string, password: string): Promise<AppUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  const user = data.user
  const appUser: AppUser = {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name ?? user.email!,
    role: user.user_metadata?.role ?? 'student',
  }
  localStorage.setItem('dm_current_user', JSON.stringify(appUser))
  localStorage.setItem('dm_logged_in', 'true')
  return appUser
}

export async function logout() {
  await supabase.auth.signOut()
  localStorage.removeItem('dm_current_user')
  localStorage.removeItem('dm_logged_in')
}

export function getCurrentUser(): AppUser | null {
  try {
    const raw = localStorage.getItem('dm_current_user')
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

// Called from API route only (server-side)
export function getSupabaseAdmin() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
