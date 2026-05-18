export const SITE = {
  name: 'NuTube',
  fullName: '뉴튜브 (NuTube)',
  description: '유튜브 채널 운영자를 위한 실전 가이드 - 알고리즘, 시니어 사연 쇼츠, AI 도구, 수익화 노하우',
  url: 'https://www.nutube.kr',
  ogImage: '/og-default.jpg',
  adsenseClient: 'ca-pub-9552509372228899',
  launchDate: '2026-04-28', // 사이트 첫 게시물 발행일
  operator: {
    company: '알고파트너스',
    representative: '박예준',
    email: 'apark12321@gmail.com',
    taxId: '450-07-03104',
    foundingDate: '2025-03-01', // 사업 개업일
    address: '인천광역시 서구 청라커낼로 270',
    addressRegion: '인천광역시',
    addressLocality: '서구',
    streetAddress: '청라커낼로 270',
    businessType: '정보통신업, 광고대행업, 미디어콘텐츠창작업',
  },
} as const;

export const CATEGORIES = {
  algorithm: {
    key: 'algorithm',
    label: '유튜브 알고리즘',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #4f46e5 100%)',
    color: '#4f46e5',
    bgLight: '#eef2ff',
    description: '추천 시스템, 노출 알고리즘, CTR과 평균 시청 지속 시간 최적화까지',
  },
  senior: {
    key: 'senior',
    label: '시니어 사연 쇼츠',
    icon: '👴',
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
    color: '#ea580c',
    bgLight: '#fff7ed',
    description: '시니어 타깃 사연·고민·체험담 쇼츠 채널 기획과 운영 노하우',
  },
  aitools: {
    key: 'aitools',
    label: 'AI 도구',
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 50%, #0284c7 100%)',
    color: '#0284c7',
    bgLight: '#f0f9ff',
    description: '대본, 음성, 이미지, 편집까지 - 유튜버를 위한 실전 AI 도구 활용법',
  },
  monetization: {
    key: 'monetization',
    label: '영상 채널 수익화',
    icon: '💰',
    gradient: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
    color: '#ca8a04',
    bgLight: '#fefce8',
    description: '애드센스, 멤버십, 슈퍼챗, 브랜드 협찬까지 채널 수익화 전략',
  },
} as const;

export type CategoryKey = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];
