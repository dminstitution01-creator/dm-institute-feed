'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { Post } from '@/types'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

export default function WritePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [caption, setCaption] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [authorName, setAuthorName] = useState('')
  const [authorAvatar, setAuthorAvatar] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) { router.replace('/login'); return }
    setAuthorName(user.name)
    setAuthorAvatar(user.name.charAt(0))
  }, [router])

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!caption.trim() && !imagePreview) return

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: authorName,
      avatar: authorAvatar,
      imageUrl: imagePreview ?? '',
      caption: caption.trim(),
      likes: 0,
      liked: false,
      comments: [],
      createdAt: '방금',
    }

    const stored = localStorage.getItem('dm_posts')
    const posts: Post[] = stored ? JSON.parse(stored) : []
    const updated = [newPost, ...posts]
    localStorage.setItem('dm_posts', JSON.stringify(updated))

    router.push('/')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white border-b border-neutral-200">
        <div className="max-w-[600px] mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-neutral-900">새 게시물</span>
          <button
            onClick={handleSubmit}
            disabled={!caption.trim() && !imagePreview}
            className="text-sm font-semibold text-indigo-600 disabled:text-neutral-300 transition-colors"
          >
            게시
          </button>
        </div>
      </header>

      <main className="max-w-[600px] mx-auto px-4 py-6 space-y-5">
        {/* 작성자 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {authorAvatar}
          </div>
          <span className="text-sm font-semibold text-neutral-900">{authorName}</span>
        </div>

        {/* 본문 입력 */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="무슨 생각을 하고 있나요?"
          rows={4}
          className="w-full text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-none leading-relaxed"
          autoFocus
        />

        {/* 이미지 미리보기 */}
        {imagePreview && (
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100">
            <Image src={imagePreview} alt="미리보기" fill className="object-cover" />
            <button
              onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = '' }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* 이미지 추가 버튼 */}
        {!imagePreview && (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-indigo-500 transition-colors"
          >
            <ImagePlus size={20} />
            <span>사진 추가</span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImage}
        />
      </main>
    </div>
  )
}
