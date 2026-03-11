'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { createPost, uploadImage } from '@/lib/db'
import { ArrowLeft, ImagePlus, X } from 'lucide-react'
import Image from 'next/image'

export default function WritePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [caption, setCaption] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [authorName, setAuthorName] = useState('')
  const [authorAvatar, setAuthorAvatar] = useState('')
  const [userId, setUserId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user) { router.replace('/login'); return }
    const displayName = user.nickname || user.name
    setAuthorName(displayName)
    setAuthorAvatar(displayName.charAt(0))
    setUserId(user.id)
  }, [router])

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!caption.trim() && !imageFile) return
    if (submitting) return

    try {
      setSubmitting(true)
      let image_url = ''

      if (imageFile) {
        setUploading(true)
        image_url = await uploadImage(imageFile, userId)
        setUploading(false)
      }

      await createPost({
        author_id: userId,
        author_name: authorName,
        caption: caption.trim(),
        image_url,
      })

      router.push('/')
    } catch (err) {
      console.error('게시물 작성 실패:', err)
      alert('게시물 작성에 실패했습니다.')
      setUploading(false)
      setSubmitting(false)
    }
  }

  const isReady = caption.trim() || imageFile

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
            disabled={!isReady || submitting}
            className="text-sm font-semibold text-indigo-600 disabled:text-neutral-300 transition-colors"
          >
            {submitting ? '게시 중...' : '게시'}
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
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {!uploading && (
              <button
                onClick={() => {
                  setImagePreview(null)
                  setImageFile(null)
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>
            )}
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
