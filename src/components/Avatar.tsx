'use client'

import { useState } from 'react'

interface AvatarProps {
  userId?: string | null
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function getAvatarUrl(userId: string) {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-images/avatars/${userId}`
}

const sizeMap = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-16 h-16 text-2xl',
}

export default function Avatar({ userId, name, size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false)
  const char = name?.charAt(0) ?? '?'
  const base = `rounded-full flex-shrink-0 ${sizeMap[size]} ${className}`

  if (userId && !imgError) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getAvatarUrl(userId)}
        alt={name}
        onError={() => setImgError(true)}
        className={`${base} object-cover`}
      />
    )
  }

  return (
    <div className={`${base} bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-semibold`}>
      {char}
    </div>
  )
}
