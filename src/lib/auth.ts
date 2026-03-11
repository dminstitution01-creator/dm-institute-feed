export interface AppUser {
  id: string
  name: string
  role: 'admin' | 'student'
}

const ADMIN = { id: 'dmadmin', password: 'dm2014', name: '관리자', role: 'admin' as const }

export function login(id: string, password: string): AppUser {
  // Check hardcoded admin
  if (id === ADMIN.id && password === ADMIN.password) {
    const user = { id: ADMIN.id, name: ADMIN.name, role: ADMIN.role }
    localStorage.setItem('dm_logged_in', 'true')
    localStorage.setItem('dm_current_user', JSON.stringify(user))
    return user
  }
  // Check student accounts
  const users = getUsers()
  const user = users.find(u => u.id === id && u.password === password)
  if (!user) throw new Error('invalid')
  const appUser = { id: user.id, name: user.name, role: user.role }
  localStorage.setItem('dm_logged_in', 'true')
  localStorage.setItem('dm_current_user', JSON.stringify(appUser))
  return appUser
}

export function logout() {
  localStorage.removeItem('dm_logged_in')
  localStorage.removeItem('dm_current_user')
}

export function getCurrentUser(): AppUser | null {
  const raw = localStorage.getItem('dm_current_user')
  if (!raw) return null
  return JSON.parse(raw)
}

interface StoredUser { id: string; password: string; name: string; role: 'admin' | 'student' }

export function getUsers(): StoredUser[] {
  const raw = localStorage.getItem('dm_users')
  return raw ? JSON.parse(raw) : []
}

export function createUser(id: string, password: string, name: string): void {
  const users = getUsers()
  if (users.find(u => u.id === id) || id === 'dmadmin') throw new Error('이미 사용 중인 아이디입니다.')
  users.push({ id, password, name, role: 'student' })
  localStorage.setItem('dm_users', JSON.stringify(users))
}

export function deleteUser(id: string): void {
  const users = getUsers().filter(u => u.id !== id)
  localStorage.setItem('dm_users', JSON.stringify(users))
}
