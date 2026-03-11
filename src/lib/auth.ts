import { supabase } from './supabase'

export interface AppUser {
  id: string
  email: string
  name: string
  username: string
  nickname: string
  role: 'admin' | 'student'
}

export async function login(username: string, password: string): Promise<AppUser> {
  // If username contains '@', use as-is (admin with real email)
  // Otherwise convert to {username}@dm.local
  const email = username.includes('@') ? username : `${username}@dm.local`

  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  const user = data.user

  // Determine username and nickname for admin
  const isAdmin = user.user_metadata?.role === 'admin' || user.email === 'dminstitution01@gmail.com'
  const derivedUsername = user.user_metadata?.username ?? (isAdmin ? 'admin' : (user.email?.replace('@dm.local', '') ?? ''))
  const derivedNickname = user.user_metadata?.nickname ?? (isAdmin ? '관리자' : (user.user_metadata?.name ?? derivedUsername))

  const appUser: AppUser = {
    id: user.id,
    email: user.email!,
    name: user.user_metadata?.name ?? user.email!,
    username: derivedUsername,
    nickname: derivedNickname,
    role: isAdmin ? 'admin' : (user.user_metadata?.role ?? 'student'),
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

export async function updateProfile(nickname: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ data: { nickname } })
  if (error) throw new Error(error.message)

  // Update localStorage cache
  const current = getCurrentUser()
  if (current) {
    const updated: AppUser = { ...current, nickname }
    localStorage.setItem('dm_current_user', JSON.stringify(updated))
  }
}

export async function updateAvatar(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `avatars/${userId}.${ext}`
  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, file, { upsert: true })
  if (error) throw new Error(error.message)
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/${path}`
}

export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
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
