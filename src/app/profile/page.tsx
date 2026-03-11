'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'
import { getCurrentUser, updateProfile, updatePassword, updateAvatar, AppUser } from '@/lib/auth'
import Avatar from '@/components/Avatar'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<AppUser | null>(null)
  const [ready, setReady] = useState(false)
  const [avatarKey, setAvatarKey] = useState(0)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Nickname change state
  const [newNickname, setNewNickname] = useState('')
  const [nicknameLoading, setNicknameLoading] = useState(false)
  const [nicknameSuccess, setNicknameSuccess] = useState('')
  const [nicknameError, setNicknameError] = useState('')

  // Password change state
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.replace('/login')
      return
    }
    setUser(currentUser)
    setNewNickname(currentUser.nickname)
    setReady(true)
  }, [router])

  if (!ready || !user) return null

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return
    setAvatarLoading(true)
    try {
      await updateAvatar(file, user.id)
      setAvatarKey((k) => k + 1)
    } catch (err) {
      alert(err instanceof Error ? err.message : '업로드 실패')
    } finally {
      setAvatarLoading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function handleNicknameChange(e: React.FormEvent) {
    e.preventDefault()
    setNicknameSuccess('')
    setNicknameError('')
    const trimmed = newNickname.trim()
    if (!trimmed) {
      setNicknameError('닉네임을 입력해 주세요.')
      return
    }
    setNicknameLoading(true)
    try {
      await updateProfile(trimmed)
      setUser((prev) => prev ? { ...prev, nickname: trimmed } : prev)
      setNicknameSuccess('닉네임이 변경되었습니다.')
      setTimeout(() => router.push('/'), 800)
    } catch (err: unknown) {
      setNicknameError(err instanceof Error ? err.message : '닉네임 변경에 실패했습니다.')
    } finally {
      setNicknameLoading(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setPasswordSuccess('')
    setPasswordError('')
    if (!newPassword) {
      setPasswordError('새 비밀번호를 입력해 주세요.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setPasswordLoading(true)
    try {
      await updatePassword(newPassword)
      setNewPassword('')
      setConfirmPassword('')
      setPasswordSuccess('비밀번호가 변경되었습니다.')
      setTimeout(() => router.push('/'), 800)
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : '비밀번호 변경에 실패했습니다.')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
            aria-label="뒤로가기"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-bold tracking-tight text-neutral-900">내 프로필</h1>
        </div>
      </header>

      <main className="max-w-[320px] mx-auto px-4 py-8 space-y-8">
        {/* 프로필 사진 + 닉네임 */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Avatar key={avatarKey} userId={user.id} name={user.nickname || user.name} size="lg" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={avatarLoading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow"
              aria-label="프로필 사진 변경"
            >
              {avatarLoading
                ? <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                : <Camera size={14} />
              }
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-neutral-900">{user.nickname}</p>
            <p className="text-sm text-neutral-400">{user.name}</p>
          </div>
        </div>

        {/* 닉네임 변경 (학생 전용) */}
        {user.role === 'student' && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-neutral-700">닉네임 변경</h2>
            <form onSubmit={handleNicknameChange} className="space-y-3">
              <input
                type="text"
                placeholder="새 닉네임"
                value={newNickname}
                onChange={(e) => { setNewNickname(e.target.value); setNicknameSuccess(''); setNicknameError('') }}
                className="w-full h-12 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              {nicknameSuccess && (
                <p className="text-xs text-indigo-600 font-medium">{nicknameSuccess}</p>
              )}
              {nicknameError && (
                <p className="text-xs text-red-500">{nicknameError}</p>
              )}
              <button
                type="submit"
                disabled={nicknameLoading}
                className="w-full h-12 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {nicknameLoading ? '변경 중...' : '변경'}
              </button>
            </form>
          </div>
        )}

        {/* 비밀번호 변경 */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-neutral-700">비밀번호 변경</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <input
              type="password"
              placeholder="새 비밀번호"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPasswordSuccess(''); setPasswordError('') }}
              className="w-full h-12 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setPasswordSuccess(''); setPasswordError('') }}
              className="w-full h-12 rounded-xl bg-neutral-100 px-4 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-indigo-500 transition"
              autoComplete="new-password"
            />
            {passwordSuccess && (
              <p className="text-xs text-indigo-600 font-medium">{passwordSuccess}</p>
            )}
            {passwordError && (
              <p className="text-xs text-red-500">{passwordError}</p>
            )}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full h-12 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {passwordLoading ? '변경 중...' : '변경'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
