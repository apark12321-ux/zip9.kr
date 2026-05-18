'use client';

/**
 * GuideEnhancements - 가이드 페이지 향상 컴포넌트 (v17)
 *
 * 박 대표님 v17 결정:
 *   - 좌측 TOC (목차)
 *   - 따라하기 체크리스트
 *   - 글 끝 미니 테스트
 *
 * 사용법:
 *   <GuideTOC items={[{id, label}, ...]} />
 *   <GuideChecklist items={[{id, label}, ...]} />
 *   <GuideQuiz question="..." options={[...]} answerIdx={1} explanation="..." />
 */

import { useState, useEffect } from 'react';

// ============================================================
// TOC (좌측 목차)
// ============================================================
export interface TOCItem {
  id: string;
  label: string;
}

export function GuideTOC({ items }: { items: TOCItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = items
        .map((item) => {
          const el = document.getElementById(item.id);
          if (!el) return null;
          return { id: item.id, top: el.getBoundingClientRect().top };
        })
        .filter((x): x is { id: string; top: number } => x !== null);

      const current = sections
        .filter((s) => s.top < 200)
        .sort((a, b) => b.top - a.top)[0];

      if (current) setActiveId(current.id);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <aside className="guide-toc">
      <div className="toc-kicker">CONTENTS</div>
      <nav className="toc-nav">
        {items.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`toc-item ${activeId === item.id ? 'active' : ''}`}
          >
            <span className="toc-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="toc-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <style jsx>{`
        .guide-toc {
          position: sticky;
          top: 80px;
          padding: 20px 18px;
          background: #fafafa;
          align-self: start;
        }

        .toc-kicker {
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 10.5px;
          font-weight: 700;
          color: #a3a3a3;
          letter-spacing: 0.14em;
          margin-bottom: 14px;
          text-transform: uppercase;
        }

        .toc-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toc-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 8px 6px;
          font-size: 13px;
          color: #737373;
          text-decoration: none;
          letter-spacing: -0.012em;
          line-height: 1.5;
          border-left: 2px solid transparent;
          padding-left: 10px;
          transition: all 0.15s;
          word-break: keep-all;
        }
        .toc-item:hover {
          color: #0a0a0a;
        }
        .toc-item.active {
          color: #0a0a0a;
          font-weight: 600;
          border-left-color: #c2410c;
          background: #ffffff;
        }

        .toc-num {
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 10.5px;
          font-weight: 700;
          color: #a3a3a3;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .toc-item.active .toc-num {
          color: #c2410c;
        }

        .toc-label {
          flex: 1;
        }
      `}</style>
    </aside>
  );
}

// ============================================================
// 체크리스트 (따라하기)
// ============================================================
export interface ChecklistItem {
  id: string;
  label: string;
}

export function GuideChecklist({
  title,
  items,
  storageKey,
}: {
  title?: string;
  items: ChecklistItem[];
  storageKey?: string;
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (saved) setChecked(JSON.parse(saved));
    } catch (e) {}
  }, [storageKey]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (storageKey && typeof window !== 'undefined') {
        try {
          window.sessionStorage.setItem(storageKey, JSON.stringify(next));
        } catch (e) {}
      }
      return next;
    });
  };

  const completedCount = items.filter((i) => checked[i.id]).length;
  const progress = Math.round((completedCount / items.length) * 100);

  return (
    <div className="guide-checklist">
      <div className="checklist-head">
        <div className="checklist-kicker">✓ {title || '따라하기 체크리스트'}</div>
        <div className="checklist-progress">
          {completedCount} / {items.length}
        </div>
      </div>

      <div className="checklist-bar">
        <div className="checklist-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="checklist-items">
        {items.map((item) => (
          <label key={item.id} className={`checklist-item ${checked[item.id] ? 'checked' : ''}`}>
            <input
              type="checkbox"
              checked={!!checked[item.id]}
              onChange={() => toggle(item.id)}
              className="checklist-input"
            />
            <span className="checklist-box">
              {checked[item.id] && <span className="checklist-tick">✓</span>}
            </span>
            <span className="checklist-label">{item.label}</span>
          </label>
        ))}
      </div>

      <style jsx>{`
        .guide-checklist {
          padding: 18px 20px 20px;
          background: #fffbeb;
          border-left: 3px solid #f59e0b;
          margin: 24px 0;
        }

        .checklist-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .checklist-kicker {
          font-size: 13px;
          font-weight: 700;
          color: #92400e;
          letter-spacing: -0.012em;
        }

        .checklist-progress {
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #92400e;
          letter-spacing: 0.05em;
        }

        .checklist-bar {
          height: 4px;
          background: rgba(146, 64, 14, 0.15);
          margin-bottom: 16px;
          overflow: hidden;
        }
        .checklist-bar-fill {
          height: 100%;
          background: #f59e0b;
          transition: width 0.3s;
        }

        .checklist-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .checklist-item {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px 0;
          transition: opacity 0.15s;
        }

        .checklist-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checklist-box {
          width: 20px;
          height: 20px;
          border: 1.5px solid #92400e;
          background: #ffffff;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }
        .checklist-item.checked .checklist-box {
          background: #f59e0b;
          border-color: #f59e0b;
        }

        .checklist-tick {
          color: #ffffff;
          font-size: 13px;
          font-weight: 800;
          line-height: 1;
        }

        .checklist-label {
          font-size: 14.5px;
          color: #78350f;
          line-height: 1.5;
          font-weight: 600;
          letter-spacing: -0.012em;
          word-break: keep-all;
        }
        .checklist-item.checked .checklist-label {
          text-decoration: line-through;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 미니 테스트 (퀴즈)
// ============================================================
export interface QuizOption {
  label: string;
  text: string;
}

export function GuideQuiz({
  question,
  options,
  answerIdx,
  explanation,
}: {
  question: string;
  options: QuizOption[];
  answerIdx: number;
  explanation: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setShowResult(true);
  };

  const handleReset = () => {
    setSelected(null);
    setShowResult(false);
  };

  const isCorrect = selected === answerIdx;

  return (
    <div className="guide-quiz">
      <div className="quiz-kicker">📝 미니 테스트</div>
      <div className="quiz-question">{question}</div>

      <div className="quiz-options">
        {options.map((opt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(idx)}
            className={[
              'quiz-option',
              selected === idx ? 'selected' : '',
              showResult && idx === answerIdx ? 'correct' : '',
              showResult && selected === idx && idx !== answerIdx ? 'wrong' : '',
            ].filter(Boolean).join(' ')}
            disabled={showResult}
          >
            <span className="quiz-option-label">{opt.label}</span>
            <span className="quiz-option-text">{opt.text}</span>
          </button>
        ))}
      </div>

      {!showResult && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={selected === null}
          className="quiz-submit"
        >
          정답 확인
        </button>
      )}

      {showResult && (
        <div className={`quiz-result ${isCorrect ? 'correct' : 'wrong'}`}>
          <div className="quiz-result-title">
            {isCorrect ? '✓ 정답입니다!' : '✗ 다시 한 번 생각해보세요'}
          </div>
          <div className="quiz-result-text">{explanation}</div>
          <button type="button" onClick={handleReset} className="quiz-reset">
            다시 풀기
          </button>
        </div>
      )}

      <style jsx>{`
        .guide-quiz {
          padding: 20px 22px 22px;
          background: #f0f9ff;
          border-left: 3px solid #0284c7;
          margin: 32px 0 24px;
        }

        .quiz-kicker {
          font-size: 12px;
          font-weight: 700;
          color: #075985;
          letter-spacing: 0.05em;
          margin-bottom: 10px;
          text-transform: uppercase;
        }

        .quiz-question {
          font-size: 17px;
          font-weight: 700;
          color: #0c4a6e;
          line-height: 1.5;
          margin-bottom: 16px;
          word-break: keep-all;
          letter-spacing: -0.018em;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
        }

        .quiz-option {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 14px;
          font-family: inherit;
          font-size: 14.5px;
          color: #0c4a6e;
          background: #ffffff;
          border: 1.5px solid #bae6fd;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s;
          letter-spacing: -0.012em;
        }
        .quiz-option:hover:not(:disabled) {
          border-color: #0284c7;
          background: #f0f9ff;
        }
        .quiz-option.selected {
          border-color: #0284c7;
          background: #e0f2fe;
        }
        .quiz-option.correct {
          background: #dcfce7;
          border-color: #16a34a;
          color: #14532d;
        }
        .quiz-option.wrong {
          background: #fee2e2;
          border-color: #dc2626;
          color: #7f1d1d;
        }
        .quiz-option:disabled {
          cursor: default;
        }

        .quiz-option-label {
          font-family: 'SF Mono', 'Roboto Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          color: #075985;
          flex-shrink: 0;
          padding-top: 2px;
        }
        .quiz-option.correct .quiz-option-label { color: #14532d; }
        .quiz-option.wrong .quiz-option-label { color: #7f1d1d; }

        .quiz-option-text {
          flex: 1;
          line-height: 1.5;
          font-weight: 600;
          word-break: keep-all;
        }

        .quiz-submit {
          padding: 10px 20px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          background: #0284c7;
          border: 1.5px solid #0284c7;
          cursor: pointer;
          letter-spacing: -0.012em;
          transition: all 0.15s;
        }
        .quiz-submit:hover:not(:disabled) { background: #075985; border-color: #075985; }
        .quiz-submit:disabled {
          background: #bae6fd;
          border-color: #bae6fd;
          cursor: not-allowed;
        }

        .quiz-result {
          padding: 14px 16px;
          margin-top: 12px;
        }
        .quiz-result.correct {
          background: #dcfce7;
          border-left: 3px solid #16a34a;
        }
        .quiz-result.wrong {
          background: #fee2e2;
          border-left: 3px solid #dc2626;
        }

        .quiz-result-title {
          font-size: 14.5px;
          font-weight: 800;
          margin-bottom: 6px;
          letter-spacing: -0.015em;
        }
        .quiz-result.correct .quiz-result-title { color: #14532d; }
        .quiz-result.wrong .quiz-result-title { color: #7f1d1d; }

        .quiz-result-text {
          font-size: 13.5px;
          line-height: 1.65;
          margin-bottom: 10px;
          word-break: keep-all;
          letter-spacing: -0.01em;
        }
        .quiz-result.correct .quiz-result-text { color: #166534; }
        .quiz-result.wrong .quiz-result-text { color: #991b1b; }

        .quiz-reset {
          padding: 6px 14px;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 600;
          color: inherit;
          background: transparent;
          border: 1px solid currentColor;
          cursor: pointer;
          letter-spacing: -0.012em;
        }
      `}</style>
    </div>
  );
}
