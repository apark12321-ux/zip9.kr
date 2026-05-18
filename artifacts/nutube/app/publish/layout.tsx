import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '영상 자료 결과 | SNS 메타데이터 자동 생성',
  description: '입력하신 키워드로 AI가 만든 영상 제목·태그·대본·썸네일·SNS 메타데이터. 유튜브, 쇼츠, 틱톡, 릴스 한 번에. 매번 다른 떡상 시나리오.',
  keywords: ['영상 자료', 'SNS 메타데이터', '유튜브 제목', '영상 대본', '썸네일 추천', '떡상 시나리오'],
  authors: [{ name: '알고파트너스', url: 'https://nutube.kr/about' }],
  openGraph: {
    title: '영상 자료 결과 | SNS 메타데이터 자동 생성',
    description: '입력하신 키워드로 AI가 만든 영상 제목·태그·대본·썸네일·SNS 메타데이터. 유튜브, 쇼츠, 틱톡, 릴스 한 번에. 매번 다른 떡상 시나리오.',
    type: 'website',
    siteName: 'NuTube',
    locale: 'ko_KR',
    url: 'https://nutube.kr/publish',
  },
  twitter: {
    card: 'summary_large_image',
    title: '영상 자료 결과 | SNS 메타데이터 자동 생성',
    description: '입력하신 키워드로 AI가 만든 영상 제목·태그·대본·썸네일·SNS 메타데이터. 유튜브, 쇼츠, 틱톡, 릴스 한 번에. 매번 다른 떡상 시나리오.',
  },
  alternates: {
    canonical: '/publish',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
