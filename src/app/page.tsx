'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PostCard from '@/components/PostCard'
import { getCurrentUser, logout, AppUser } from '@/lib/auth'
import { fetchPosts, deletePost } from '@/lib/db'
import { Post } from '@/types'
import { PenSquare, Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) {
      localStorage.removeItem('dm_logged_in')
      router.replace('/login')
      return
    }
    setCurrentUser(user)
    setReady(true)

    fetchPosts()
      .then((data) => setPosts(data))
      .catch((err) => setFetchError(err?.message ?? String(err)))
      .finally(() => setLoading(false))
  }, [router])

  async function handleDeletePost(postId: string) {
    try {
      await deletePost(postId)
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch (err) {
      console.error('게시물 삭제 실패:', err)
      alert('게시물 삭제에 실패했습니다.')
    }
  }

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  if (!ready) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="DM Institute 로고" width={32} height={32} priority />
            <h1 className="text-lg font-bold tracking-tight text-neutral-900">디엠 학원</h1>
          </div>
          <div className="flex items-center gap-1">
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center gap-1.5 px-3 h-9 rounded-full hover:bg-neutral-100 transition-colors text-neutral-700 text-sm font-medium"
                aria-label="계정 관리"
              >
                <Settings size={16} />
                <span>계정 관리</span>
              </button>
            )}
            <button
              onClick={() => router.push('/write')}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
              aria-label="새 게시물"
            >
              <PenSquare size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
              aria-label="로그아웃"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* 피드 */}
      <main className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onDelete={handleDeletePost}
              />
            ))}

            {fetchError && (
              <p className="text-center text-sm text-red-400 py-4 bg-red-50 rounded-xl px-4">{fetchError}</p>
            )}
            <p className="text-center text-sm text-neutral-400 py-8">
              모든 게시물을 확인했어요 🎉
            </p>
          </>
        )}
      </main>
    </div>
  )
}
