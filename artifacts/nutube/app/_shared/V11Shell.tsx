'use client';
/**
 * NuTube V11Shell v11.7 - 프리미엄 LNB 디자인
 *
 * 박 대표님 v11.7 지적:
 *   "LNB 자료만들기, 도구 중복 해결" (v11.6에서 처리됨)
 *   "LNB 좀 있어보이게" → 프리미엄 디자인
 *
 * v11.7 변경 (v11.6 → v11.7):
 *  ✅ LNB 그라데이션 배경 (180deg 미세한 톤)
 *  ✅ CTA 버튼 그림자 + 빛 애니메이션 (hover 시 빛이 가로지름)
 *  ✅ CTA 버튼 둥근 모서리 (12px) + 깊이감
 *  ✅ 메뉴 좌측 활성 인디케이터 (3px 주황 막대)
 *  ✅ 메뉴 아이콘 호버 시 채도 ↑
 *  ✅ 메뉴 호버 시 우측으로 살짝 이동 (transform)
 *  ✅ 활성 메뉴 그라데이션 + 내부 보더
 *  ✅ 메뉴 배지 그라데이션 + 그림자
 *  ✅ FREE 라벨 그라데이션 + 그림자
 *  ✅ 폰트 크기 디테일 조정 (10.5 → 11, 14 → 14.5 등)
 *  ✅ 사이드바 패딩 14 → 16 (여유)
 *  ✅ 정책 메뉴 hover 배경 추가
 *
 * v11.6 보존:
 *  - LNB 도구 메뉴 제거 (CTA와 중복)
 *  - LNB 가이드 배지 [20편]
 *  - 푸터 2섹션 (가이드 + 정보·정책)
 *  - 신규 6편 가이드 노출
 *  - 박 대표님 자산 100% 보존 (메뉴/노출/링크 그대로)
 */

import { ReactNode, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// ============================================================
// Project State (localStorage 기반)
// ============================================================
const PROJECT_KEY = 'nutube_project';

export interface ProjectState {
  category?: string;
  categoryLabel?: string;
  keyword?: string;
  scenarioStyleId?: string;
  templateId?: string;
  step?: number;
}

export function getProject(): ProjectState {
  if (typeof window === 'undefined') return {};
  try {
    const stored = localStorage.getItem(PROJECT_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function setProject(updates: Partial<ProjectState>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getProject();
    const next = { ...current, ...updates };
    localStorage.setItem(PROJECT_KEY, JSON.stringify(next));
  } catch {}
}

export function clearProject() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROJECT_KEY);
  } catch {}
}

// ============================================================
// Logo Component (v11.2: 사이즈 확대 + 클릭 시 홈 이동)
// ============================================================
export function NuTubeLogo({ 
  size = 'md', 
  showSubtitle = true,
  asLink = true,
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  showSubtitle?: boolean;
  asLink?: boolean;
}) {
  // v11.2: 사이즈 약 30% 확대 (sm 14→18, md 18→22, lg 24→28)
  const sizes = { 
    sm: { logo: 18, sub: 10 }, 
    md: { logo: 22, sub: 11 }, 
    lg: { logo: 28, sub: 13 } 
  };
  const s = sizes[size];

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: s.logo, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
        <span style={{ color: '#4f46e5' }}>Nu</span>Tube
      </div>
      {showSubtitle && (
        <div style={{ fontSize: s.sub, color: '#888', fontWeight: 600, letterSpacing: '0.05em' }}>
          유튜브 채널 운영 가이드
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link 
        href="/" 
        style={{ 
          textDecoration: 'none', 
          color: 'inherit',
          display: 'inline-block',
          cursor: 'pointer',
        }}
        aria-label="홈으로 이동"
      >
        {content}
      </Link>
    );
  }
  return content;
}

// ============================================================
// Notice Items (가짜 통계 X, 진짜 정보만)
// ============================================================
const NOTICES = [
  { dot: '💡', text: 'AI 추천 키워드 활용으로 알고리즘 최적화', tag: '팁' },
  { dot: '🎯', text: '퇴직 예정/예정자 (40대~70대)에게 인기있는 분야 12개 제공', tag: '신규' },
  { dot: '✨', text: '키워드 입력 한 번이면 4개 SNS 메타데이터 한 번에', tag: '편리' },
  { dot: '🚀', text: '완전 무료 · 회원가입 불필요 · 신용카드 X', tag: '무료' },
];

// ============================================================
// AdSlot Component (인라인) - AdSense 승인 전 자동 숨김
// ============================================================
function AdSlot({ slot, variant = 'horizontal' }: { slot: string; variant?: string }) {
  const client = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT) || '';
  const slotEnvKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, '_')}`;
  const slotId = (typeof process !== 'undefined' && (process.env as any)[slotEnvKey]) || '';

  // 🔑 AdSense 승인 전이면 완전히 숨김
  if (!client || !slotId) {
    return null;
  }

  return (
    <div className={`adContainer adContainer-${variant}`}>
      <div className="adLabel">광고</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <style jsx>{`
        .adContainer { width: 100%; padding: 6px 0; }
        .adLabel {
          font-size: 10px; font-weight: 600; color: #999;
          text-align: left; margin-bottom: 3px; letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// V11Shell (사이드바가 있는 메인 레이아웃) - v11.1 컴팩트
// ============================================================
export function V11Shell({ children, currentStep }: { children: ReactNode; currentStep?: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [noticeIdx, setNoticeIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setNoticeIdx((i) => (i + 1) % NOTICES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // 시니어 영상 멘토링 채널 컨셉 (v6.2.0)
  // ============================================================
  // v11.6: LNB 도구 제거 + 가이드 20편 + 푸터 일관성
  // 박 대표님 v11.6 지적:
  //   "자료 만들기와 도구가 같은 카테고리잖아" (도구 제거)
  //   "가이드는 왜 10편 밖에 안 보이지?" (20편 업데이트)
  //   "LNB의 가이드와 푸터의 가이드는 뭐가 다른거야?" (일관성)
  // 
  // D안 (어시스턴트 판단):
  //   LNB와 푸터의 "가이드" 같은 의미로 통일
  //   푸터는 대표 6편 + 전체 보기 링크
  // ============================================================
  
  // 핵심 CTA 버튼 - NuTube는 메타데이터 생성기로
  const ctaAction = {
    label: '메타데이터 생성',
    sub: 'AI가 5초 안에',
    path: '/publish',
    key: 'publish',
  };
  
  // 홈 버튼 (CTA 위)
  const homeMenu = { icon: '🏠', label: '홈', path: '/', key: 'home' };
  
  // 메인 메뉴 (가이드만)
  const mainMenu = [
    { icon: '📚', label: '가이드', path: '/blog', key: 'blog', badge: '58편' },
  ];
  
  // 정보 메뉴
  const infoMenu = [
    { icon: 'ℹ️', label: '서비스 소개', path: '/about', key: 'about' },
    { icon: '✉️', label: '문의하기', path: '/contact', key: 'contact' },
  ];
  
  // 정책 메뉴 (작게)
  const policyMenu = [
    { label: '개인정보 처리방침', path: '/privacy', key: 'privacy' },
    { label: '이용약관', path: '/terms', key: 'terms' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const currentNotice = NOTICES[noticeIdx];

  return (
    <div className="shell">
      <style jsx>{`
        .shell {
          min-height: 100vh;
          background: #fafafa;
          font-family: 'Pretendard Variable', Pretendard, system-ui, sans-serif;
          color: #1a1a1a;
        }
        .layout { display: flex; min-height: 100vh; }
        
        /* 사이드바 - 컴팩트 */
        /* ============================================ */
        /* v11.7: 프리미엄 LNB 디자인 */
        /* 박 대표님 v11.7 요청: "LNB 좀 있어보이게" */
        /* ============================================ */
        .sidebar {
          width: 240px; flex-shrink: 0;
          background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
          border-right: 1px solid #e5e5e5;
          display: flex; flex-direction: column;
          padding: 16px 14px;
          height: 100vh;
          position: sticky; top: 0; overflow-y: auto;
          box-shadow: 1px 0 0 rgba(0, 0, 0, 0.02);
        }
        .sidebarLogo { 
          padding: 4px 6px 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          margin-bottom: 14px;
        }
        .freeLabel {
          display: inline-block; padding: 3px 10px;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #047857;
          border-radius: 100px; font-size: 10.5px; font-weight: 800;
          margin-top: 6px; letter-spacing: 0.06em;
          box-shadow: 0 1px 2px rgba(4, 120, 87, 0.1);
        }
        .menuSection { margin-bottom: 18px; }

        /* CTA 강조 버튼 - 프리미엄 */
        .ctaBtn {
          margin: 0 0 20px;
          padding: 14px 16px;
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 
            0 4px 6px -1px rgba(194, 65, 12, 0.15),
            0 2px 4px -1px rgba(194, 65, 12, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        .ctaBtn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(
            90deg, 
            transparent, 
            rgba(255, 255, 255, 0.15), 
            transparent
          );
          transition: left 0.6s;
        }
        .ctaBtn:hover {
          background: linear-gradient(135deg, #b13a0a 0%, #d44a08 100%);
          transform: translateY(-2px);
          box-shadow: 
            0 8px 12px -2px rgba(194, 65, 12, 0.25),
            0 4px 6px -2px rgba(194, 65, 12, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        .ctaBtn:hover::before {
          left: 100%;
        }
        .ctaBtn:active {
          transform: translateY(0);
        }
        .ctaBtnLabel {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -0.018em;
          margin-bottom: 3px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .ctaBtnSub {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.92);
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        .ctaBtnArrow {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          font-weight: 800;
          color: #fbbf24;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }

        /* 정책 메뉴 (작게) */
        .policySection {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px dashed #d4d4d4;
        }
        .policyItem {
          padding: 7px 10px;
          font-size: 11.5px;
          color: #a3a3a3;
          cursor: pointer;
          transition: all 0.15s;
          letter-spacing: -0.005em;
          border-radius: 6px;
        }
        .policyItem:hover {
          color: #525252;
          background: rgba(0, 0, 0, 0.02);
        }
        
        .menuLabel {
          font-size: 11px; font-weight: 700; color: #a3a3a3;
          padding: 0 10px 8px; letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        
        .menuItem {
          display: flex; align-items: center; gap: 11px;
          padding: 11px 13px; 
          border-radius: 10px; 
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 3px;
          font-size: 14.5px; 
          color: #404040; 
          font-weight: 600;
          min-height: 44px;
          letter-spacing: -0.012em;
          position: relative;
        }
        .menuItem::before {
          content: '';
          position: absolute;
          left: 0; top: 50%;
          transform: translateY(-50%);
          width: 3px; height: 0;
          background: #c2410c;
          border-radius: 0 2px 2px 0;
          transition: height 0.2s;
        }
        .menuItem:hover { 
          background: #f5f5f5; 
          color: #0a0a0a;
          transform: translateX(2px);
        }
        .menuItem.active {
          background: linear-gradient(135deg, #fff7ed 0%, #fef3e7 100%);
          color: #c2410c; 
          font-weight: 700;
          box-shadow: 
            0 1px 2px rgba(194, 65, 12, 0.06),
            inset 0 0 0 1px rgba(194, 65, 12, 0.08);
        }
        .menuItem.active::before {
          height: 60%;
        }
        .menuIcon { 
          font-size: 18px;
          filter: grayscale(0.1);
          transition: filter 0.2s;
        }
        .menuItem:hover .menuIcon,
        .menuItem.active .menuIcon {
          filter: grayscale(0);
        }
        
        /* 메뉴 배지 - 프리미엄 */
        .menuBadge {
          margin-left: auto;
          padding: 3px 8px;
          background: linear-gradient(135deg, #fef3e7 0%, #fde4cb 100%);
          color: #c2410c;
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.03em;
          font-family: 'SF Mono', 'Consolas', monospace;
          border-radius: 5px;
          box-shadow: inset 0 0 0 1px rgba(194, 65, 12, 0.08);
        }
        .menuItem.active .menuBadge {
          background: linear-gradient(135deg, #c2410c 0%, #ea580c 100%);
          color: #ffffff;
          box-shadow: 
            0 1px 2px rgba(194, 65, 12, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        /* 알림 카드 - 컴팩트 */
        .noticeCard {
          background: #fafafa; border: 1px solid #e5e5e5;
          border-radius: 10px; padding: 9px 10px;
          margin-bottom: 10px;
        }
        .noticeRow {
          display: flex; align-items: flex-start; gap: 7px;
        }
        .noticeText {
          font-size: 12px; color: #555; line-height: 1.5;
          flex: 1;
        }
        .noticeTag {
          font-size: 9px; font-weight: 700;
          background: #4f46e5; color: #fff;
          padding: 2px 6px; border-radius: 4px;
          margin-top: 1px;
        }
        
        .spacer { flex: 1; }
        .sidebarAd { padding: 6px 0; }
        
        /* 메인 콘텐츠 */
        .main {
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
        }
        
        /* 모바일 헤더 - 컴팩트 */
        .mobileHeader {
          display: none;
          background: #fff; border-bottom: 1px solid #e5e5e5;
          padding: 9px 16px;
          align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .menuToggle {
          background: none; border: none; cursor: pointer;
          padding: 8px; font-size: 22px; color: #555;
          min-width: 44px; min-height: 44px;
          display: flex; align-items: center; justify-content: center;
        }
        
        /* 콘텐츠 */
        .content { flex: 1; padding: 0; }
        
        /* 푸터 - 컴팩트 (가장 중요) */
        .footer {
          background: #1a1a1a; color: #ccc;
          padding: 32px 24px 18px;
          margin-top: 36px;
        }
        .footerInner {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1.2fr 1.2fr;
          gap: 28px;
          padding-bottom: 22px;
          border-bottom: 1px solid #333;
        }
        .footerCol h4 {
          font-size: 13px; font-weight: 700;
          color: #fff; margin: 0 0 10px;
        }
        .footerCol ul {
          list-style: none; padding: 0; margin: 0;
        }
        .footerCol li { margin-bottom: 6px; }
        .fLink {
          color: #999; font-size: 13px;
          text-decoration: none; transition: color 0.15s;
        }
        .fLink:hover { color: #fff; }
        .fTag {
          font-size: 13px; color: #999;
          line-height: 1.55; margin: 8px 0;
        }
        .fCompany {
          font-size: 11.5px; color: #777;
          line-height: 1.55;
        }
        .fBottom {
          max-width: 1200px; margin: 0 auto;
          padding-top: 16px;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 10px;
          font-size: 11.5px; color: #777;
        }
        
        /* 모바일 - 컴팩트 */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed; left: -280px;
            top: 0; bottom: 0; height: 100vh;
            transition: left 0.25s; z-index: 1000;
            box-shadow: 0 0 24px rgba(0,0,0,0.1);
            width: 280px;
            padding: 16px 14px;
          }
          .sidebar.open { left: 0; }
          .mobileHeader { display: flex; }
          .footerInner {
            grid-template-columns: 1fr 1fr;
            gap: 18px;
          }
          /* 모바일 사이드바 메뉴 살짝 크게 (시니어 친화 유지) */
          .menuItem {
            font-size: 15.5px !important;
            padding: 11px 13px !important;
            min-height: 46px;
          }
          .menuIcon { font-size: 19px !important; }
          .menuLabel { font-size: 11.5px !important; }
          
          .footer {
            padding: 24px 18px 14px;
            margin-top: 28px;
          }
        }
        @media (max-width: 480px) {
          .footerInner { 
            grid-template-columns: 1fr; 
            gap: 16px;
            padding-bottom: 18px;
          }
        }
        
        /* 백드롭 */
        .backdrop {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 999;
        }
        .backdrop.show { display: block; }
      `}</style>

      <div className="layout">
        {/* 사이드바 */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebarLogo">
            <NuTubeLogo size="md" showSubtitle={true} />
            <div className="freeLabel">무료</div>
          </div>

          {/* 홈 (CTA 위) */}
          <div
            className={`menuItem ${isActive(homeMenu.path) ? 'active' : ''}`}
            onClick={() => { router.push(homeMenu.path); setSidebarOpen(false); }}
            style={{ marginBottom: 12 }}
          >
            <span className="menuIcon">{homeMenu.icon}</span>
            <span>{homeMenu.label}</span>
          </div>

          {/* CTA 강조 버튼 (자료 만들기 - 핵심 액션) */}
          <div
            className="ctaBtn"
            onClick={() => { router.push(ctaAction.path); setSidebarOpen(false); }}
          >
            <div className="ctaBtnLabel">✏️ {ctaAction.label}</div>
            <div className="ctaBtnSub">{ctaAction.sub}</div>
            <div className="ctaBtnArrow">→</div>
          </div>

          {/* 메인 메뉴 (가이드/도구 - 카테고리만, 클릭 시 목록 페이지로) */}
          <div className="menuSection">
            {mainMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span>{m.label}</span>
                {(m as any).badge && (
                  <span className="menuBadge">{(m as any).badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* 정보 메뉴 */}
          <div className="menuSection">
            <div className="menuLabel">정보</div>
            {infoMenu.map((m) => (
              <div
                key={m.key}
                className={`menuItem ${isActive(m.path) ? 'active' : ''}`}
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                <span className="menuIcon">{m.icon}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>

          {/* 정책 메뉴 (작게) */}
          <div className="policySection">
            {policyMenu.map((m) => (
              <div
                key={m.key}
                className="policyItem"
                onClick={() => { router.push(m.path); setSidebarOpen(false); }}
              >
                {m.label}
              </div>
            ))}
          </div>

          <div className="noticeCard">
            <div className="noticeRow">
              <span style={{ fontSize: 14 }}>{currentNotice.dot}</span>
              <div className="noticeText">{currentNotice.text}</div>
              <span className="noticeTag">{currentNotice.tag}</span>
            </div>
          </div>

          <div className="spacer" />

          <div className="sidebarAd">
            <AdSlot slot="sidebar" variant="sidebar-card" />
          </div>
        </aside>

        {/* 백드롭 (모바일) */}
        <div 
          className={`backdrop ${sidebarOpen ? 'show' : ''}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* 메인 */}
        <main className="main">
          <div className="mobileHeader">
            <button className="menuToggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <NuTubeLogo size="md" showSubtitle={false} />
            <div style={{ width: 24 }} />
          </div>

          <div className="content">
            {children}
          </div>

          {/* 푸터 */}
          <footer className="footer">
            <div className="footerInner">
              <div>
                <NuTubeLogo size="lg" showSubtitle={false} />
                <div className="fTag">
                  키워드만 입력하면 AI가<br />
                  영상 제목·태그·대본을 추천해드립니다.
                </div>
                <div className="fCompany">
                  무료 · 회원가입 X<br />
                  광고 보고 무제한 사용
                </div>
              </div>
              <div className="footerCol">
                <h4>가이드</h4>
                <ul>
                  <li><Link href="/blog" className="fLink">📚 전체 보기 (20편)</Link></li>
                  <li><Link href="/blog/first-100-subs" className="fLink">🎯 첫 100명 구독자</Link></li>
                  <li><Link href="/blog/viral-patterns" className="fLink">🔥 떡상 채널 패턴</Link></li>
                  <li><Link href="/blog/algorithm-seo" className="fLink">🔍 SEO 검색 최적화</Link></li>
                  <li><Link href="/blog/phone-shooting" className="fLink">📱 핸드폰 영상</Link></li>
                  <li><Link href="/blog/chatgpt-script" className="fLink">🤖 ChatGPT 영상 대본</Link></li>
                  <li><Link href="/blog/revenue-calc" className="fLink">💰 광고 수익 계산</Link></li>
                </ul>
              </div>
              <div className="footerCol">
                <h4>정보 · 정책</h4>
                <ul>
                  <li><Link href="/publish" className="fLink">✏️ 메타데이터 생성</Link></li>
                  <li><Link href="/about" className="fLink">서비스 소개</Link></li>
                  <li><Link href="/contact" className="fLink">문의하기</Link></li>
                  <li><Link href="/privacy" className="fLink">개인정보 처리방침</Link></li>
                  <li><Link href="/terms" className="fLink">이용약관</Link></li>
                </ul>
              </div>
            </div>
            <div className="fBottom">
              <div>© 2026 NuTube · 알고파트너스. 모든 권리 보유.</div>
              <div>
                <Link href="/privacy" className="fLink">개인정보 처리방침</Link>
                {' · '}
                <Link href="/terms" className="fLink">이용약관</Link>
                {' · '}
                <Link href="/contact" className="fLink">Contact</Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

// 별칭 (호환성)
export const DashboardShell = V11Shell;
