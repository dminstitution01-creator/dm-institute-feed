'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'

interface ListedUser {
  id: string
  email: string
  name: string
  username: string
  nickname: string
  role: string
}

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [users, setUsers] = useState<ListedUser[]>([])
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [nickname, setNickname] = useState('')
  const [password, setPassword] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchUsers() {
    const res = await fetch('/api/list-users')
    const data = await res.json()
    if (data.users) {
      setUsers(data.users.filter((u: ListedUser) => u.role !== 'admin'))
    }
  }

  useEffect(() => {
    const user = getCurrentUser()
    if (user?.role === 'admin') {
      setIsAdmin(true)
      fetchUsers()
    } else {
      setIsAdmin(false)
    }
  }, [])

  if (isAdmin === null) return null

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-700 font-medium">접근 권한이 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition"
        >
          돌아가기
        </button>
      </div>
    )
  }

  function clearForm() {
    setName('')
    setUsername('')
    setNickname('')
    setPassword('')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSuccessMsg('')
    setErrorMsg('')
    const trimmedName = name.trim()
    const trimmedUsername = username.trim()
    const trimmedNickname = nickname.trim()
    const trimmedPassword = password.trim()
    if (!trimmedName || !trimmedUsername || !trimmedNickname || !trimmedPassword) {
      setErrorMsg('모든 항목을 입력해 주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `${trimmedUsername}@dm.local`,
          password: trimmedPassword,
          name: trimmedName,
          username: trimmedUsername,
          nickname: trimmedNickname,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? '계정 생성에 실패했습니다.')
      } else {
        setSuccessMsg(`${trimmedName} 계정이 생성되었습니다.`)
        clearForm()
        await fetchUsers()
      }
    } catch {
      setErrorMsg('계정 생성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(userId: string) {
    if (!window.confirm('이 학생 계정을 삭제할까요?')) return
    const res = await fetch('/api/delete-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) {
      await fetchUsers()
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-neutral-900">계정 관리</h1>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
        {/* 새 학생 계정 추가 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">새 학생 계정 추가</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => { setName(e.target.value); setSuccessMsg(''); setErrorMsg('') }}
              className="w-full h-11 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setSuccessMsg(''); setErrorMsg('') }}
              className="w-full h-11 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              autoComplete="off"
            />
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => { setNickname(e.target.value); setSuccessMsg(''); setErrorMsg('') }}
              className="w-full h-11 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setSuccessMsg(''); setErrorMsg('') }}
              className="w-full h-11 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              autoComplete="new-password"
            />

            {successMsg && (
              <p className="text-xs text-indigo-600 font-medium">{successMsg}</p>
            )}
            {errorMsg && (
              <p className="text-xs text-red-500">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? '생성 중...' : '계정 생성'}
            </button>
          </form>
        </div>

        {/* 등록된 학생 목록 */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
          <h2 className="text-base font-semibold text-neutral-900 mb-4">등록된 학생 목록</h2>
          {users.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-4">아직 등록된 학생이 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between px-4 py-3 bg-neutral-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{u.name}</p>
                    <p className="text-xs text-neutral-500">아이디: {u.username}</p>
                    <p className="text-xs text-neutral-400">닉네임: {u.nickname}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-medium hover:bg-red-100 transition-colors"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
