'use client'

import { useState, useRef } from 'react'
import { Heart, MessageCircle, Send } from 'lucide-react'
import { Post, Comment } from '@/types'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [comments, setComments] = useState<Comment[]>(post.comments)
  const [commentText, setCommentText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleLike() {
    setLiked((prev) => !prev)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  function handleComment(e: React.FormEvent) {
    e.preventDefault()
    const text = commentText.trim()
    if (!text) return
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      author: '나',
      avatar: '나',
      text,
      createdAt: '방금',
    }
    setComments((prev) => [...prev, newComment])
    setCommentText('')
  }

  return (
    <article className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
      {/* 작성자 */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
          {post.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-neutral-900 truncate">{post.author}</p>
          <p className="text-xs text-neutral-400">{post.createdAt}</p>
        </div>
      </div>

      {/* 사진 */}
      <div className="aspect-square w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imageUrl}
          alt={`${post.author}의 게시물`}
          className="w-full h-full object-cover"
        />
      </div>

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
          <span className="font-semibold mr-1.5">{post.author}</span>
          {post.caption}
        </p>
      </div>

      {/* 댓글 리스트 */}
      {comments.length > 0 && (
        <div className="px-4 pb-3 space-y-2 border-t border-neutral-100 pt-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 mt-0.5">
                {comment.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-800">
                  <span className="font-semibold mr-1.5">{comment.author}</span>
                  {comment.text}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{comment.createdAt}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 댓글 입력창 */}
      <div className="border-t border-neutral-100 px-4 py-3">
        <form onSubmit={handleComment} className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            나
          </div>
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
