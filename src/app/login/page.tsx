'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { login } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      await login(username, password)
      router.push('/')
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* 로고 */}
      <div className="mb-12 text-center">
        <Image
          src="/logo.png"
          alt="DM Institute 로고"
          width={96}
          height={96}
          className="mx-auto mb-5"
          priority
        />
        <h1 className="text-xl font-semibold text-neutral-900 tracking-tight">디엠학원</h1>
      </div>

      {/* 폼 */}
      <form onSubmit={handleSubmit} className="w-full max-w-[320px] space-y-3">
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(false) }}
          className="w-full h-12 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 transition"
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false) }}
          className="w-full h-12 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 transition"
          autoComplete="current-password"
        />

        {error && (
          <p className="text-xs text-red-500 text-center pt-1">
            아이디 또는 비밀번호가 올바르지 않습니다.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 active:scale-[0.98] transition-all mt-1 disabled:opacity-60"
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  )
}
