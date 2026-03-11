export interface Comment {
  id: string
  author: string
  avatar: string
  text: string
  createdAt: string
}

export interface Post {
  id: string
  author: string
  avatar: string
  imageUrl: string
  caption: string
  likes: number
  liked: boolean
  comments: Comment[]
  createdAt: string
}
