'use client';
/**
 * V18Shell - 메타데이터 생성기 전용 컨테이너 (v18 호환)
 *
 * 변경 이력 (2026-05-18):
 *   - 기존: 자체 헤더/푸터 포함된 풀 셸
 *   - 변경: 헤더/푸터 제거 → 사이트 전체 레이아웃의 헤더/푸터를 사용
 *   - 이유: app/layout.tsx의 새 Header/Footer와 중복 방지
 */

import { ReactNode } from 'react';

interface V18ShellProps {
  children: ReactNode;
}

export function V18Shell({ children }: V18ShellProps) {
  return (
    <div className="v18-shell">
      <main className="site-main">{children}</main>

      <style jsx global>{`
        .v18-shell {
          width: 100%;
        }

        .v18-shell .site-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px 80px;
          min-height: 60vh;
        }

        @media (max-width: 768px) {
          .v18-shell .site-main {
            padding: 16px 14px 60px;
          }
        }

        .v18-shell input[type="text"],
        .v18-shell input[type="search"],
        .v18-shell textarea,
        .v18-shell select {
          font-family: inherit;
          font-size: 15px;
          color: #111827;
        }

        .v18-shell h1, .v18-shell h2, .v18-shell h3, .v18-shell h4 {
          color: #111827;
          letter-spacing: -0.02em;
        }

        .v18-shell h1 { font-size: 28px; margin: 0 0 12px; font-weight: 800; }
        .v18-shell h2 { font-size: 22px; margin: 32px 0 12px; font-weight: 800; }
        .v18-shell h3 { font-size: 18px; margin: 24px 0 10px; font-weight: 700; }
        .v18-shell h4 { font-size: 16px; margin: 20px 0 8px; font-weight: 700; }

        @media (max-width: 768px) {
          .v18-shell h1 { font-size: 24px; }
          .v18-shell h2 { font-size: 20px; }
          .v18-shell h3 { font-size: 17px; }
        }

        .v18-shell p {
          font-size: 15px;
          line-height: 1.75;
          color: #374151;
          margin: 0 0 14px;
        }

        .v18-shell .container {
          max-width: 1200px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
