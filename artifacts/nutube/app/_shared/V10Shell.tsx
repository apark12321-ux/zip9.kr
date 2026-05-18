'use client';

/**
 * v10 공용 사이드바 레이아웃
 * 스크린샷의 좌측 네비게이션을 구현
 */

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './sidebar.module.css';

interface SideNav {
  key: string;
  label: string;
  sub: string;
  icon: string;
  paths: string[];
  minStep: number;
}

const NAVS: SideNav[] = [
  { key: 'curation',  label: '큐레이션', sub: '키워드·뉴스',   icon: '🔍', paths: ['/create', '/keyword'], minStep: 0 },
  { key: 'script',    label: '스크립트', sub: 'AI 대본',       icon: '✍️', paths: ['/configure'],          minStep: 2 },
  { key: 'video',     label: '영상 제작', sub: '합성·렌더링',  icon: '🎬', paths: ['/processing'],         minStep: 3 },
  { key: 'deploy',    label: '검수·배포', sub: '수익화 검증',  icon: '🛡️', paths: ['/done'],               minStep: 4 },
];

export interface SidebarProps {
  /** 현재 진행 단계 (0-5) */
  step?: number;
  /** 상단 페이지 제목 */
  title?: string;
  /** 단계 인디케이터 (4단계 점) */
  showStepDots?: boolean;
}

export function V10Shell({
  children,
  step = 0,
  title = '뉴스 큐레이션',
  showStepDots = true,
}: SidebarProps & { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mode, setMode] = useState<'normal' | 'senior'>('normal');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('v10_mode');
      if (saved === 'senior' || saved === 'normal') setMode(saved);
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      try { localStorage.setItem('v10_mode', mode); } catch {}
    }
  }, [mode, mounted]);

  const activeKey = NAVS.find(n => n.paths.some(p => pathname.startsWith(p)))?.key || 'curation';

  const isDone = (minStep: number) => step > minStep;
  const isActive = (key: string) => key === activeKey;

  return (
    <div className={styles.shell}>
      <FontLoader />

      {/* 좌측 사이드바 */}
      <aside className={styles.sidebar}>
        <Link href="/" className={styles.brand}>
          <div className={styles.brandMark}>NT</div>
          <div>
            <div className={styles.brandName}>
              <span>Nu</span>
              <span className={styles.brandGold}>Tube</span>
            </div>
            <div className={styles.brandSub}>YouTube Guide</div>
          </div>
        </Link>

        <div className={styles.divider} />

        <nav className={styles.nav}>
          {NAVS.map(n => {
            const active = isActive(n.key);
            const done = isDone(n.minStep);
            const accessible = step >= n.minStep;
            return (
              <button
                key={n.key}
                className={`${styles.navItem} ${active ? styles.navActive : ''} ${!accessible ? styles.navDisabled : ''}`}
                onClick={() => accessible && router.push(n.paths[0])}
                disabled={!accessible}
              >
                <span className={styles.navIcon}>
                  {done && !active ? '✓' : n.icon}
                </span>
                <span className={styles.navLabels}>
                  <span className={styles.navLabel}>{n.label}</span>
                  <span className={styles.navSub}>{n.sub}</span>
                </span>
                {active && <span className={styles.navDot} />}
              </button>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.serverStatus}>
            <span className={styles.serverDot} />
            <span>서버 연결됨</span>
          </div>
          <button className={styles.settingsBtn} onClick={() => {}}>
            ⚙ 설정
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <div className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>{title}</h1>
          {showStepDots && (
            <div className={styles.stepDots}>
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className={`${styles.stepDot} ${step >= i ? styles.stepDotActive : ''}`}
                />
              ))}
            </div>
          )}
          <div className={styles.modeToggle}>
            <button
              className={`${styles.modeBtn} ${mode === 'normal' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('normal')}
            >일반</button>
            <button
              className={`${styles.modeBtn} ${mode === 'senior' ? styles.modeBtnActive : ''}`}
              onClick={() => setMode('senior')}
            >시니어</button>
          </div>
        </header>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

function FontLoader() {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.min.css');
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: #0a0a0c; color: #e4e4e8; font-family: 'Pretendard Variable', 'Pretendard', -apple-system, sans-serif; }
    ` }} />
  );
}

// ═══════════════════════════════════════════════
// localStorage project 관리
// ═══════════════════════════════════════════════

export interface V10Project {
  category?: string;
  categoryLabel?: string;
  keyword?: string;
  keywordData?: any;
  tone?: 'formal' | 'friendly' | 'casual' | 'slang';  // 격식/친근/반말/음슴체
  duration?: number;  // 분
  mode?: 'normal' | 'senior';
  customTopic?: string;
  step?: number;
}

const PROJECT_KEY = 'v10_project';

export function getV10Project(): V10Project {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROJECT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setV10Project(updates: Partial<V10Project>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getV10Project();
    const next = { ...current, ...updates };
    localStorage.setItem(PROJECT_KEY, JSON.stringify(next));
    return next;
  } catch {}
}

export function clearV10Project() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROJECT_KEY);
  } catch {}
}
