import PostCard from '@/components/PostCard'
import { mockPosts } from '@/lib/mock-data'
import { PenSquare } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="DM Institute 로고" width={32} height={32} priority />
            <h1 className="text-lg font-bold tracking-tight text-neutral-900">디엠 학원</h1>
          </div>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
            aria-label="새 게시물"
          >
            <PenSquare size={20} />
          </button>
        </div>
      </header>

      {/* 피드 */}
      <main className="max-w-[600px] mx-auto px-4 py-6 space-y-6">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        <p className="text-center text-sm text-neutral-400 py-8">
          모든 게시물을 확인했어요 🎉
        </p>
      </main>
    </div>
  )
}
