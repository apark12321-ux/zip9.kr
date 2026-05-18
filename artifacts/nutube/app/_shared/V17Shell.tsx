'use client';
/**
 * V17Shell - 사이트 전체 통일 헤더 + 푸터 (v17)
 *
 * 박 대표님 v17.0 결정:
 *   "매거진 권위감 + 영상 도구 직관 = 하이브리드"
 *
 * V11Shell (이전) 차이:
 *   - V11Shell: 사이드바 + CTA "자료 만들기" 강조
 *   - V17Shell: 가로 헤더 + 단순 메뉴 (홈/가이드/자료 만들기)
 *
 * 모든 페이지 공통 사용:
 *   - 메인 페이지
 *   - 가이드 목록 / 상세 페이지
 *   - 자료 만들기 도구 페이지
 *
 * 디자인:
 *   - 매거진 톤 (단순한 헤더, 큰 타이포)
 *   - 가로 메뉴 (사이드바 X)
 *   - 모바일: 햄버거 메뉴
 */

import Link from 'next/link';
import { useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface V17ShellProps {
  children: ReactNode;
}

export function V17Shell({ children }: V17ShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <div className="v17-page">
      <header className="v17-header">
        <div className="v17-header-inner">
          <Link href="/" className="v17-logo">
            <span className="v17-logo-mark">▍</span>
            <span className="v17-logo-text">ALGOMAKER</span>
          </Link>

          <nav className="v17-nav-desktop">
            <Link href="/" className={`v17-nav-link ${isActive('/') ? 'active' : ''}`}>
              홈
            </Link>
            <Link href="/blog" className={`v17-nav-link ${isActive('/blog') ? 'active' : ''}`}>
              가이드
            </Link>
            <Link href="/publish" className={`v17-nav-link ${isActive('/publish') ? 'active' : ''}`}>
              자료 만들기
            </Link>
          </nav>

          <button
            className="v17-burger"
            aria-label="메뉴 열기"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`v17-burger-line ${mobileMenuOpen ? 'open-1' : ''}`} />
            <span className={`v17-burger-line ${mobileMenuOpen ? 'open-2' : ''}`} />
            <span className={`v17-burger-line ${mobileMenuOpen ? 'open-3' : ''}`} />
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="v17-nav-mobile">
            <Link href="/" className={`v17-mobile-link ${isActive('/') ? 'active' : ''}`}>
              홈
            </Link>
            <Link href="/blog" className={`v17-mobile-link ${isActive('/blog') ? 'active' : ''}`}>
              가이드
            </Link>
            <Link href="/publish" className={`v17-mobile-link ${isActive('/publish') ? 'active' : ''}`}>
              자료 만들기
            </Link>
          </nav>
        )}
      </header>

      <main className="v17-main">{children}</main>

      <footer className="v17-footer">
        <div className="v17-footer-inner">
          <div className="v17-footer-brand">
            <div className="v17-footer-logo">
              <span className="v17-logo-mark">▍</span>
              <span className="v17-footer-logo-text">ALGOMAKER</span>
            </div>
            <div className="v17-footer-tagline">
              유튜브 채널 운영 노하우 가이드<br />
              따라하면 성공하는 영상 제작 기초
            </div>
          </div>

          <div className="v17-footer-cols">
            <div className="v17-footer-col">
              <div className="v17-footer-col-title">CATEGORIES</div>
              <Link href="/blog?cat=algorithm" className="v17-footer-link">알고리즘 · 노하우</Link>
              <Link href="/blog?cat=senior" className="v17-footer-link">시니어 사연 쇼츠</Link>
              <Link href="/blog?cat=aitools" className="v17-footer-link">AI 도구 활용</Link>
              <Link href="/blog?cat=monetization" className="v17-footer-link">영상 채널 수익화</Link>
            </div>

            <div className="v17-footer-col">
              <div className="v17-footer-col-title">SITE</div>
              <Link href="/about" className="v17-footer-link">서비스 소개</Link>
              <Link href="/contact" className="v17-footer-link">문의하기</Link>
              <Link href="/privacy" className="v17-footer-link">개인정보 처리방침</Link>
              <Link href="/terms" className="v17-footer-link">이용약관</Link>
            </div>
          </div>
        </div>

        <div className="v17-footer-bottom">
          © 2026 알고파트너스 (대표 박예준) · apark12321@gmail.com
        </div>
      </footer>

      <style jsx global>{`
        /* ============================================ */
        /* v17 - 통일 디자인 시스템 (매거진 + 도구) */
        /* ============================================ */

        .v17-page {
          min-height: 100vh;
          background: #ffffff;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          color: #0a0a0a;
          letter-spacing: -0.012em;
        }

        /* ============================================ */
        /* HEADER (sticky 상단) */
        /* ============================================ */
        .v17-header {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-bottom: 0.5px solid #e5e5e5;
        }
        .v17-header-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        @media (max-width: 600px) {
          .v17-header-inner { padding: 12px 16px; }
        }

        .v17-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #0a0a0a;
        }
        .v17-logo-mark {
          color: #0a0a0a;
          font-weight: 800;
          font-size: 16px;
          line-height: 1;
          display: inline-block;
          width: 4px;
          height: 16px;
          background: #0a0a0a;
        }
        .v17-logo-text {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.018em;
        }
        @media (max-width: 600px) {
          .v17-logo-text { font-size: 14.5px; }
        }

        .v17-nav-desktop {
          display: flex;
          gap: 24px;
        }
        @media (max-width: 600px) {
          .v17-nav-desktop { display: none; }
        }

        .v17-nav-link {
          font-size: 14px;
          font-weight: 600;
          color: #737373;
          text-decoration: none;
          letter-spacing: -0.012em;
          padding: 4px 0;
          border-bottom: 2px solid transparent;
          transition: all 0.15s;
        }
        .v17-nav-link:hover { color: #0a0a0a; }
        .v17-nav-link.active {
          color: #0a0a0a;
          font-weight: 700;
          border-bottom-color: #0a0a0a;
        }

        /* 햄버거 (모바일) */
        .v17-burger {
          display: none;
          width: 32px;
          height: 32px;
          background: transparent;
          border: none;
          cursor: pointer;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          padding: 4px;
        }
        @media (max-width: 600px) {
          .v17-burger { display: flex; }
        }
        .v17-burger-line {
          height: 2px;
          width: 22px;
          background: #0a0a0a;
          margin: 0 auto;
          transition: all 0.2s;
        }
        .v17-burger-line.open-1 { transform: rotate(45deg) translateY(10px); }
        .v17-burger-line.open-2 { opacity: 0; }
        .v17-burger-line.open-3 { transform: rotate(-45deg) translateY(-10px); }

        .v17-nav-mobile {
          display: flex;
          flex-direction: column;
          padding: 12px 16px 18px;
          background: #ffffff;
          border-top: 0.5px solid #e5e5e5;
        }
        .v17-mobile-link {
          padding: 12px 8px;
          font-size: 15px;
          font-weight: 600;
          color: #525252;
          text-decoration: none;
          border-bottom: 0.5px solid #f5f5f5;
          letter-spacing: -0.012em;
        }
        .v17-mobile-link:last-child { border-bottom: none; }
        .v17-mobile-link.active {
          color: #0a0a0a;
          font-weight: 700;
        }

        /* ============================================ */
        /* MAIN */
        /* ============================================ */
        .v17-main {
          min-height: calc(100vh - 200px);
        }

        /* ============================================ */
        /* FOOTER */
        /* ============================================ */
        .v17-footer {
          margin-top: 80px;
          padding-top: 40px;
          padding-bottom: 24px;
          border-top: 0.5px solid #e5e5e5;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .v17-footer { margin-top: 56px; padding-top: 28px; }
        }
        .v17-footer-inner {
          max-width: 1080px;
          margin: 0 auto;
          padding: 0 24px;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 36px;
          margin-bottom: 32px;
        }
        @media (max-width: 600px) {
          .v17-footer-inner { grid-template-columns: 1fr; gap: 24px; padding: 0 16px; margin-bottom: 24px; }
        }

        .v17-footer-brand { display: flex; flex-direction: column; gap: 10px; }
        .v17-footer-logo { display: flex; align-items: center; gap: 8px; }
        .v17-footer-logo-text {
          font-size: 14px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.018em;
        }
        .v17-footer-tagline {
          font-size: 12px;
          color: #737373;
          line-height: 1.65;
          letter-spacing: -0.01em;
        }

        .v17-footer-cols {
          display: contents;
        }

        .v17-footer-col {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .v17-footer-col-title {
          font-size: 11px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .v17-footer-link {
          font-size: 12.5px;
          color: #737373;
          text-decoration: none;
          letter-spacing: -0.01em;
          line-height: 1.7;
        }
        .v17-footer-link:hover { color: #0a0a0a; }

        .v17-footer-bottom {
          max-width: 1080px;
          margin: 0 auto;
          padding: 18px 24px 0;
          border-top: 0.5px solid #e5e5e5;
          font-size: 11.5px;
          color: #a3a3a3;
          text-align: center;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) {
          .v17-footer-bottom { padding: 16px 16px 0; font-size: 11px; }
        }
      `}</style>
    </div>
  );
}
