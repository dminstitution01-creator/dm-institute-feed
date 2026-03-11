'use client'

import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Send, Trash2 } from 'lucide-react'
import { Post, Comment } from '@/types'
import { AppUser } from '@/lib/auth'
import { fetchComments, createComment, deleteComment } from '@/lib/db'
import Image from 'next/image'
import Avatar from '@/components/Avatar'

interface PostCardProps {
  post: Post
  currentUser: AppUser | null
  onDelete: (postId: string) => void
}

function formatKoreanRelativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return '방금'
  if (diffMin < 60) return `${diffMin}분 전`
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${diffDay}일 전`
}

export default function PostCard({ post, currentUser, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchComments(post.id)
      .then(setComments)
      .catch((err) => console.error('댓글 불러오기 실패:', err))
  }, [post.id])

  const canDelete =
    currentUser?.role === 'admin' || currentUser?.id === post.author_id

  function handleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault()
    const text = commentText.trim()
    if (!text || !currentUser) return

    try {
      const newComment = await createComment({
        post_id: post.id,
        author_id: currentUser.id,
        author_name: currentUser.nickname,
        text,
      })
      setComments((prev) => [...prev, newComment])
      setCommentText('')
    } catch (err) {
      console.error('댓글 작성 실패:', err)
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      await deleteComment(commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error('댓글 삭제 실패:', err)
    }
  }

  function handleDelete() {
    if (window.confirm('게시물을 삭제할까요?')) {
      onDelete(post.id)
    }
  }

  const avatarChar = post.author_name ? post.author_name.charAt(0) : '?'
  const currentUserDisplay = currentUser?.nickname ?? currentUser?.name ?? ''

  return (
    <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      {/* 작성자 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Avatar userId={post.author_id} name={post.author_name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{post.author_name}</p>
          <p className="text-xs text-neutral-400">{formatKoreanRelativeTime(post.created_at)}</p>
        </div>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-red-400 flex-shrink-0"
            aria-label="게시물 삭제"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* 사진 */}
      {post.image_url && (
        <div className="aspect-square w-full overflow-hidden bg-neutral-100 relative">
          <Image
            src={post.image_url}
            alt={`${post.author_name}의 게시물`}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex items-center gap-4 px-4 pt-3 pb-1">
        <button
          onClick={handleLike}
          className="flex items-center gap-1.5 group"
          aria-label="좋아요"
        >
          <Heart
            size={22}
            className={`transition-all duration-150 ${
              liked
                ? 'fill-red-500 stroke-red-500 scale-110'
                : 'stroke-neutral-700 group-hover:stroke-red-400'
            }`}
          />
          <span className={`text-sm font-medium ${liked ? 'text-red-500' : 'text-neutral-600'}`}>
            {likeCount}
          </span>
        </button>
        <button
          onClick={() => inputRef.current?.focus()}
          className="flex items-center gap-1.5 group"
          aria-label="댓글"
        >
          <MessageCircle size={22} className="stroke-neutral-700 group-hover:stroke-indigo-500 transition-colors" />
          <span className="text-sm font-medium text-neutral-600">{comments.length}</span>
        </button>
      </div>

      {/* 본문 */}
      <div className="px-4 pb-3">
        <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
          <span className="font-semibold mr-1.5">{post.author_name}</span>
          {post.caption}
        </p>
      </div>

      {/* 댓글 리스트 */}
      {comments.length > 0 && (
        <div className="px-4 pb-3 space-y-2 border-t border-neutral-100 pt-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar userId={comment.author_id} name={comment.author_name} size="sm" className="mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-800">
                  <span className="font-semibold mr-1.5">{comment.author_name}</span>
                  {comment.text}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{formatKoreanRelativeTime(comment.created_at)}</p>
              </div>
              {canDelete && (
                <button
                  onClick={() => handleDeleteComment(comment.id)}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-300 hover:text-red-400 flex-shrink-0"
                  aria-label="댓글 삭제"
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력창 */}
      <div className="border-t border-neutral-100 px-4 py-3">
        <form onSubmit={handleComment} className="flex items-center gap-2">
          <Avatar userId={currentUser?.id} name={currentUserDisplay || '?'} size="sm" />
          <input
            ref={inputRef}
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="댓글 달기..."
            className="flex-1 text-sm text-neutral-800 placeholder:text-neutral-400 outline-none bg-transparent"
          />
          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`transition-colors ${
              commentText.trim()
                ? 'text-indigo-500 hover:text-indigo-700'
                : 'text-neutral-300 cursor-default'
            }`}
            aria-label="댓글 게시"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </article>
  )
}
