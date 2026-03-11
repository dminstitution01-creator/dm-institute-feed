export interface Comment {
  id: string
  post_id: string
  author_id: string
  author_name: string
  text: string
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  author_name: string
  caption: string
  image_url: string
  likes: number
  created_at: string
}
