import type { Metadata } from 'next';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: '공지사항',
  description: 'NuTube 공지사항입니다.',
};

const NOTICES = [
  {
    date: '2026-05-18',
    title: '메타데이터 생성기 일시 점검 안내',
    body: '메타데이터 생성기를 더 안정적이고 빠른 환경으로 옮기는 작업을 진행하고 있습니다. 작업이 완료되면 본 페이지에서 다시 안내드리겠습니다. 그동안 가이드 콘텐츠는 정상 이용하실 수 있습니다.',
  },
  {
    date: '2026-05-15',
    title: '시니어 사연 쇼츠 카테고리 가이드 보강',
    body: '시니어 사연 쇼츠 카테고리의 스토리텔링, BGM, 내레이션 관련 실전 가이드 8편을 보강했습니다. 사연을 영상화할 때 지켜야 할 윤리 원칙과 구체적 제작 노하우를 정리한 글들입니다.',
  },
  {
    date: '2026-05-10',
    title: 'AI 도구 카테고리 확대',
    body: 'AI 음성, 이미지 생성, 영상 편집, 리서치까지 유튜버에게 실제로 도움이 되는 AI 도구 비교 가이드 8편을 추가했습니다. 무료부터 유료까지 가격별로 정리했습니다.',
  },
  {
    date: '2026-05-04',
    title: '영상 채널 수익화 가이드 시리즈 시작',
    body: '광고 수익부터 멤버십, 브랜드 협찬, 어필리에이트까지 채널 수익 다각화 전략을 다루는 가이드 시리즈를 시작했습니다.',
  },
  {
    date: '2026-04-28',
    title: 'NuTube 정식 오픈',
    body: '유튜브 채널 운영자를 위한 실전 가이드 미디어 NuTube가 정식 오픈했습니다. 알고리즘, 시니어 사연 쇼츠, AI 도구, 영상 채널 수익화 네 가지 카테고리에서 검증된 데이터와 실전 경험 기반의 가이드를 제공합니다.',
  },
  {
    date: '2026-04-28',
    title: '콘텐츠 운영 원칙 안내',
    body: 'NuTube의 모든 가이드는 공식 출처 우선 확인, 사실 검증, 실전 적용 가능성을 기준으로 작성됩니다. 알고리즘이나 정책이 바뀌면 관련 글을 점검하고 갱신합니다. 자세한 내용은 소개 페이지에서 확인하실 수 있습니다.',
  },
  {
    date: '2026-04-28',
    title: '독자 의견 환영',
    body: '가이드 내용 중 정정이 필요한 부분이나 추가로 다뤄주셨으면 하는 주제가 있다면 ' + SITE.operator.email + ' 로 보내주세요. 의견은 편집팀이 직접 확인하고 신속히 반영하겠습니다.',
  },
];

export default function AnnouncementPage() {
  return (
    <div className="nt-page">
      <h1>공지사항</h1>
      <p className="nt-lead">NuTube 운영과 관련된 안내사항을 시간순으로 정리했습니다.</p>

      <div style={{ marginTop: 32, display: 'grid', gap: 16 }}>
        {NOTICES.map((notice, i) => (
          <article key={i} style={{
            border: '1px solid #e5e7eb', borderRadius: 12,
            padding: 24, background: '#fff',
          }}>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>{notice.date}</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 10px' }}>{notice.title}</h3>
            <p style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.7, margin: 0 }}>{notice.body}</p>
          </article>
        ))}
      </div>

      <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 32 }}>
        최신 공지는 본 페이지 상단에 게시됩니다.
      </p>
    </div>
  );
}
