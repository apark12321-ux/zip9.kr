'use client';

/**
 * frontend/app/_shared/StepBar.tsx
 * 4단계 진행 인디케이터 + 공통 앱바
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './shared.module.css';

export type StageId = 'plan' | 'script' | 'studio' | 'publish' | 'done';

const STAGES: { id: StageId; label: string; path: string }[] = [
  { id: 'plan', label: '기획', path: '/plan' },
  { id: 'script', label: '대본', path: '/script' },
  { id: 'studio', label: '영상', path: '/studio' },
  { id: 'publish', label: '배포', path: '/publish' },
];

export function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css';
    document.head.appendChild(link);
  }, []);
  return null;
}

export function StepBar({ current }: { current: StageId }) {
  const router = useRouter();
  const currentIdx = STAGES.findIndex((s) => s.id === current);

  return (
    <div className={styles.stepBar}>
      {STAGES.map((s, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const cls = [
          styles.stepItem,
          isDone ? styles.done : '',
          isActive ? styles.active : '',
        ]
          .filter(Boolean)
          .join(' ');

        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className={cls}
              onClick={() => {
                if (isDone) router.push(s.path);
              }}
              disabled={!isDone && !isActive}
              style={{ cursor: isDone ? 'pointer' : 'default' }}
            >
              <span className={styles.stepIdx}>{isDone ? '✓' : i + 1}</span>
              <span>{s.label}</span>
            </button>
            {i < STAGES.length - 1 && <span className={styles.stepArrow}>→</span>}
          </div>
        );
      })}
    </div>
  );
}

export function AppBar({
  current,
  primaryLabel,
  primaryDisabled,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  current: StageId;
  primaryLabel?: string;
  primaryDisabled?: boolean;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <header className={styles.appbar}>
      <div className={styles.brand}>
        <div className={styles.brandMark}>AM</div>
        <div>
          Algo<span className={styles.gold}>Maker</span>
        </div>
      </div>

      <StepBar current={current} />

      <div className={styles.actions}>
        {secondaryLabel && (
          <button className={styles.btn} onClick={onSecondary}>
            {secondaryLabel}
          </button>
        )}
        {primaryLabel && (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={primaryDisabled}
            onClick={onPrimary}
          >
            {primaryLabel}
          </button>
        )}
      </div>
    </header>
  );
}

/* 프로젝트 상태 공유 (간단한 globalThis 기반, 실제 AI 없이도 작동) */
interface ProjectState {
  keyword: string;
  category: string;
  duration: string;
  title: string;
}

const DEFAULT_PROJECT: ProjectState = {
  keyword: '주식 급등 작전',
  category: '경제',
  duration: '8분 30초',
  title: '개미들이 3일 만에 전액을 잃은 이유',
};

export function getProject(): ProjectState {
  if (typeof window === 'undefined') return DEFAULT_PROJECT;
  const w = window as unknown as { __nutubeProject?: ProjectState };
  return w.__nutubeProject || DEFAULT_PROJECT;
}

export function setProject(p: Partial<ProjectState>) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { __nutubeProject?: ProjectState };
  w.__nutubeProject = { ...getProject(), ...p };
}
