import { Post } from '@/types'

export const mockPosts: Post[] = [
  {
    id: '1',
    author: '김지수',
    avatar: '김',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    caption: '오늘 수학 문제 드디어 풀었다!! 😭 선생님 덕분에 이해했어요. 다음 시험엔 꼭 100점 맞겠습니다 🙏',
    likes: 24,
    liked: false,
    comments: [
      { id: 'c1', author: '박민준', avatar: '박', text: '대박 👏👏 나도 알려줘~', createdAt: '10분 전' },
      { id: 'c2', author: '이서연', avatar: '이', text: '진짜 열심히 하는구나 ㅠㅠ 화이팅!!', createdAt: '8분 전' },
      { id: 'c3', author: '최유나', avatar: '최', text: '나도 너무 어려웠는데 부러워', createdAt: '5분 전' },
    ],
    createdAt: '30분 전',
  },
  {
    id: '2',
    author: '박민준',
    avatar: '박',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    caption: '오늘 독서실에서 6시간 공부 💪 이번 주도 열심히 달려보자. 다들 파이팅!',
    likes: 41,
    liked: true,
    comments: [
      { id: 'c4', author: '김지수', avatar: '김', text: '우와 6시간?? 대단해 진짜', createdAt: '20분 전' },
      { id: 'c5', author: '정현우', avatar: '정', text: '나는 2시간도 힘든데 존경스럽다', createdAt: '15분 전' },
    ],
    createdAt: '1시간 전',
  },
  {
    id: '3',
    author: '이서연',
    avatar: '이',
    imageUrl: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=800&q=80',
    caption: '오늘 영어 말하기 연습 드디어 극복 🎉 계속 틀리던 발음이 이제 조금씩 되는 것 같아요. 꾸준함이 답인 것 같습니다.',
    likes: 18,
    liked: false,
    comments: [
      { id: 'c6', author: '최유나', avatar: '최', text: '서연이 진짜 열심히 한다 ㅠ 부러워', createdAt: '45분 전' },
    ],
    createdAt: '2시간 전',
  },
  {
    id: '4',
    author: '정현우',
    avatar: '정',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    caption: '오늘 선생님이 주신 추가 문제집 다 풀었다! 내일 수업 기대돼요 ✏️📖',
    likes: 33,
    liked: false,
    comments: [
      { id: 'c7', author: '박민준', avatar: '박', text: '헉 벌써?? 나 아직 반도 못 풀었는데', createdAt: '1시간 전' },
      { id: 'c8', author: '김지수', avatar: '김', text: '현우 진짜 열공러네 👍', createdAt: '55분 전' },
      { id: 'c9', author: '이서연', avatar: '이', text: '도움 받을 수 있을까요..? 😅', createdAt: '40분 전' },
    ],
    createdAt: '3시간 전',
  },
]
