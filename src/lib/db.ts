import { supabase } from './supabase'
import { Post, Comment } from '@/types'

export async function fetchPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createPost(post: {
  author_id: string
  author_name: string
  caption: string
  image_url: string
}): Promise<Post> {
  const { data, error } = await supabase
    .from('posts')
    .insert(post)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) throw error
}

export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createComment(comment: {
  post_id: string
  author_id: string
  author_name: string
  text: string
}): Promise<Comment> {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteComment(id: string): Promise<void> {
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) throw error
}

export async function uploadImage(file: File, userId: string): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${userId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('post-images').upload(path, file)
  if (error) throw error
  const { data } = supabase.storage.from('post-images').getPublicUrl(path)
  return data.publicUrl
}
