'use client';

/**
 * NuTube 자료 만들기 v15.0 - 다중 뷰 통합
 *
 * 박 대표님 v15.0:
 *   "케이스 바이 케이스로 모든 결과물이 보이는 구조"
 *   "클릭 횟수 최적화 (적절한)"
 *   D안 (어시스턴트 판단)
 *
 * v12 거부: 1️⃣2️⃣3️⃣ 단계 번호 → 사용 X
 * v13 거부: 검은 배경 → 밝은 색
 * v14 거부: 진입 메뉴 → 진입 즉시 모든 결과
 *
 * v15 = 진입 즉시 모든 결과 펼침 + 영상 미리보기 시각화 + 시나리오 패턴 빠른 전환
 */

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { V18Shell } from '../_shared/V18Shell';
import {
  generateTitles,
  generateVideoSequences,
  generateDescription,
  generateTags,
} from '../_shared/contentEngine';
import { generateV650Data, type V650DataPackage } from '../_shared/v650Adapter';
import { CinematicPromptDisplay } from '../_shared/CinematicPromptDisplay_v6_5_0';
import { 
  isSeniorTargetKeyword,
  getSeniorOptimizationFlags,
  SENIOR_HOOK_PATTERNS,
  SENIOR_ENGAGEMENT_QUESTIONS,
  SENIOR_POLICY_CHECKLIST,
  ENGAGEMENT_QUESTIONS_BY_CATEGORY,
} from '../_shared/algorithmInsights';

const SCENARIO_PATTERNS: Record<string, {
  emoji: string; name: string; desc: string;
  color: string; bgColor: string; flow: string; duration: string;
  beats: Array<{ time: string; label: string; algoTags: string[] }>;
}> = {
  curiosity: {
    emoji: '🤔', name: '호기심 자극형', desc: '시청자가 끝까지 보게 되는 형식',
    color: '#7c3aed', bgColor: '#faf5ff',
    flow: '문제 제기 → 단서 → 핵심 공개', duration: '7~8분',
    beats: [
      { time: '0:00', label: '문제 제기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '0:30', label: '단서 제공', algoTags: ['몰입'] },
      { time: '2:00', label: '추가 단서', algoTags: ['긴장 유지'] },
      { time: '5:00', label: '핵심 공개', algoTags: ['만족도', '댓글유도'] },
      { time: '7:00', label: '마무리·CTA', algoTags: ['최종화면', '재생목록'] },
    ],
  },
  tutorial: {
    emoji: '📋', name: '단계별 가이드', desc: '따라하기 쉬운 형식',
    color: '#0284c7', bgColor: '#f0f9ff',
    flow: '도입 → 1단계 → 2단계 → 마무리', duration: '7~8분',
    beats: [
      { time: '0:00', label: '도입·결과 미리보기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '0:30', label: '1단계: 준비', algoTags: ['시각화'] },
      { time: '2:00', label: '2단계: 실행', algoTags: ['디테일'] },
      { time: '4:30', label: '3단계: 마무리', algoTags: ['검증'] },
      { time: '7:00', label: '요약·CTA', algoTags: ['댓글유도', '최종화면'] },
    ],
  },
  review: {
    emoji: '⚖️', name: '리뷰·비교', desc: '제품·서비스 비교 형식',
    color: '#0d9488', bgColor: '#f0fdfa',
    flow: '소개 → 장점 → 단점 → 결론', duration: '7~8분',
    beats: [
      { time: '0:00', label: '대상 소개', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '장점 분석', algoTags: ['데이터'] },
      { time: '3:30', label: '단점·아쉬움', algoTags: ['솔직함'] },
      { time: '5:30', label: '비교 정리', algoTags: ['시각화'] },
      { time: '7:30', label: '결론·추천', algoTags: ['댓글유도'] },
    ],
  },
  storytelling: {
    emoji: '📖', name: '스토리텔링', desc: '경험담·이야기 형식',
    color: '#be123c', bgColor: '#fff1f2',
    flow: '시작 → 갈등 → 해결 → 교훈', duration: '7~8분',
    beats: [
      { time: '0:00', label: '시작·배경', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '갈등·문제', algoTags: ['공감'] },
      { time: '3:30', label: '시도·실패', algoTags: ['솔직함'] },
      { time: '5:30', label: '해결·전환점', algoTags: ['감동'] },
      { time: '7:00', label: '교훈·CTA', algoTags: ['댓글유도'] },
    ],
  },
  list: {
    emoji: '🔢', name: '리스트형', desc: 'BEST/TOP 형식',
    color: '#ca8a04', bgColor: '#fefce8',
    flow: '인트로 → 1위 → 2위 → 정리', duration: '7~8분',
    beats: [
      { time: '0:00', label: '인트로·미리보기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '0:30', label: '5위 → 4위', algoTags: ['긴장'] },
      { time: '2:30', label: '3위 → 2위', algoTags: ['몰입'] },
      { time: '5:00', label: '1위 공개', algoTags: ['클라이맥스', '저장유도'] },
      { time: '7:00', label: '정리·CTA', algoTags: ['댓글유도'] },
    ],
  },
  qna: {
    emoji: '💬', name: 'Q&A형', desc: '질문-답변 형식',
    color: '#16a34a', bgColor: '#f0fdf4',
    flow: '질문 → 답변 → 부연 설명', duration: '7~8분',
    beats: [
      { time: '0:00', label: '질문 1 + 답변', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:30', label: '질문 2 + 답변', algoTags: ['검색최적화'] },
      { time: '3:30', label: '질문 3 + 답변', algoTags: ['디테일'] },
      { time: '5:30', label: '심화 질문', algoTags: ['전문성'] },
      { time: '7:30', label: '추가 질문 받기·CTA', algoTags: ['댓글유도'] },
    ],
  },
  mistake: {
    emoji: '⚠️', name: '실수·후회형', desc: '경험자 후회담',
    color: '#dc2626', bgColor: '#fef2f2',
    flow: '실수 공개 → 원인 → 해결책 → 교훈', duration: '7~8분',
    beats: [
      { time: '0:00', label: '실수 공개·후회', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '실수의 원인', algoTags: ['공감'] },
      { time: '3:00', label: '잘못된 정보 정정', algoTags: ['신뢰'] },
      { time: '5:00', label: '올바른 방법', algoTags: ['해결책', '저장유도'] },
      { time: '7:00', label: '교훈·CTA', algoTags: ['댓글유도'] },
    ],
  },
  data: {
    emoji: '📊', name: '데이터·분석형', desc: '데이터 기반 신뢰감',
    color: '#1d4ed8', bgColor: '#eff6ff',
    flow: '주제 → 데이터 → 인사이트 → 결론', duration: '7~8분',
    beats: [
      { time: '0:00', label: '주제·문제 제기', algoTags: ['후크', '음성SEO', '챕터'] },
      { time: '1:00', label: '데이터 1', algoTags: ['시각화'] },
      { time: '3:00', label: '데이터 2', algoTags: ['검증'] },
      { time: '5:00', label: '인사이트 도출', algoTags: ['분석'] },
      { time: '7:00', label: '결론·예측·CTA', algoTags: ['댓글유도'] },
    ],
  },
};

const CATEGORY_LABELS: Record<string, { name: string; emoji: string }> = {
  food: { name: '음식·요리', emoji: '🍳' },
  realestate: { name: '부동산', emoji: '🏠' },
  economy: { name: '경제·재테크', emoji: '💰' },
  health: { name: '건강', emoji: '💪' },
  fitness: { name: '운동·다이어트', emoji: '🏃' },
  language: { name: '외국어 학습', emoji: '🌐' },
  selfdev: { name: '자기계발', emoji: '📚' },
  aitech: { name: 'AI·기술', emoji: '🤖' },
  senior: { name: '시니어', emoji: '👔' },
  travel: { name: '여행', emoji: '✈️' },
  family: { name: '가족·관계', emoji: '👨‍👩‍👧' },
  general: { name: '일반', emoji: '📌' },
};

const ALGO_TAG_INFO: Record<string, { color: string; label: string }> = {
  '후크': { color: '#c2410c', label: '첫 30초 후크' },
  '음성SEO': { color: '#0369a1', label: '음성 검색' },
  '챕터': { color: '#15803d', label: '챕터 시작' },
  '댓글유도': { color: '#9f1239', label: '참여 ↑' },
  '저장유도': { color: '#7c3aed', label: '저장 ↑' },
  '최종화면': { color: '#0d9488', label: '최종 화면' },
  '재생목록': { color: '#0891b2', label: '연쇄 시청' },
  '시각화': { color: '#ca8a04', label: '시각화' },
  '몰입': { color: '#7e22ce', label: '몰입 ↑' },
  '긴장 유지': { color: '#a21caf', label: '긴장 유지' },
  '긴장': { color: '#a21caf', label: '긴장' },
  '클라이맥스': { color: '#dc2626', label: '클라이맥스' },
  '만족도': { color: '#16a34a', label: '만족도' },
  '솔직함': { color: '#65a30d', label: '솔직함' },
  '데이터': { color: '#0891b2', label: '데이터' },
  '검증': { color: '#0d9488', label: '검증' },
  '디테일': { color: '#a16207', label: '디테일' },
  '공감': { color: '#be185d', label: '공감' },
  '감동': { color: '#be123c', label: '감동' },
  '검색최적화': { color: '#1d4ed8', label: '검색 ↑' },
  '전문성': { color: '#4338ca', label: '전문성' },
  '신뢰': { color: '#0e7490', label: '신뢰' },
  '해결책': { color: '#15803d', label: '해결책' },
  '분석': { color: '#1d4ed8', label: '분석' },
};

export default function PublishPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PublishWrapper />
    </Suspense>
  );
}

function PublishWrapper() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  
  // 키워드 없으면 입력 폼 보여주기
  if (!keyword.trim()) {
    return <KeywordInputForm />;
  }
  
  return <PublishContent />;
}

function KeywordInputForm() {
  const router = useRouter();
  const [input, setInput] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    router.push(`/publish?keyword=${encodeURIComponent(input.trim())}`);
  };
  
  const examples = ['50대 부업 유튜브', '어머니 추억 사연', '재테크 노하우', '건강 관리 영상'];
  
  return (
    <V18Shell>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 20px 60px' }}>
        <header style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.025em', margin: '0 0 14px', lineHeight: 1.25 }}>
            영상 메타데이터 생성기
          </h1>
          <p style={{ fontSize: 16, color: '#525252', lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>
            영상 키워드를 입력하시면 박 실장 알고리즘 11공식이 자동 적용된
            영상 메타데이터(제목·시나리오·해시태그·SEO 태그)를 5초 안에 만들어드립니다.
          </p>
        </header>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>
            영상 키워드
          </label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="예: 50대 부업 유튜브"
              autoFocus
              style={{
                flex: '1 1 280px',
                padding: '14px 16px',
                fontSize: 16,
                fontFamily: 'inherit',
                color: '#1a1a1a',
                background: '#ffffff',
                border: '1.5px solid #d4d4d4',
                outline: 'none',
                letterSpacing: '-0.012em',
              }}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 700,
                color: '#ffffff',
                background: input.trim() ? '#1a1a1a' : '#a3a3a3',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                letterSpacing: '-0.015em',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              메타데이터 생성 →
            </button>
          </div>
          
          <div style={{ fontSize: 13, color: '#737373', marginBottom: 12 }}>
            예시 키워드:
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {examples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setInput(ex)}
                style={{
                  padding: '8px 14px',
                  fontSize: 13,
                  color: '#525252',
                  background: '#f5f5f5',
                  border: '1px solid #e5e5e5',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </form>

        <div style={{ padding: '24px 24px', background: '#fffbeb', borderLeft: '3px solid #c2410c', marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' }}>
            받게 되시는 메타데이터
          </h2>
          <ul style={{ margin: 0, padding: '0 0 0 22px', fontSize: 15, lineHeight: 1.8, color: '#404040' }}>
            <li><strong>제목 후보 5개</strong> - 8:2 법칙 적용 (CTR 최적화)</li>
            <li><strong>영상 시나리오</strong> - 5비트 구조 (도입/전개/절정/해결/마무리)</li>
            <li><strong>AI 영상 프롬프트</strong> - Sora·VEO 등에서 바로 사용</li>
            <li><strong>SEO 태그</strong> - 유튜브 입력용 50자 이내 쉼표 구분</li>
            <li><strong>해시태그</strong> - 검색용 + 트렌드용 10개</li>
            <li><strong>설명란 초안</strong> - 키워드 자연 반복 적용</li>
          </ul>
        </div>

        <div style={{ padding: '20px 24px', background: '#f8f8f8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
            시니어 키워드 자동 인식
          </h2>
          <p style={{ fontSize: 14, color: '#525252', lineHeight: 1.7, margin: 0, wordBreak: 'keep-all' }}>
            "어머니", "추억", "사연", "50대" 등 시니어 관련 키워드를 입력하시면
            시니어 채널 전용 후크 패턴과 업로드 시간 등이 자동으로 적용됩니다.
          </p>
        </div>
      </div>
    </V18Shell>
  );
}

function LoadingState() {
  return (
    <V18Shell>
      <div style={{ padding: 60, textAlign: 'center', color: '#737373', fontSize: 17 }}>
        영상 자료 만드는 중...
      </div>
    </V18Shell>
  );
}

function PublishContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('category') || 'general';
  const initialScenarioId = searchParams.get('scenario') || 'tutorial';

  const [scenarioId, setScenarioId] = useState<string>(initialScenarioId);
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1000000));
  const [activeBeat, setActiveBeat] = useState<number>(0);
  const [copied, setCopied] = useState<string | null>(null);

  // PublishWrapper에서 이미 keyword 검사 후 분기하므로 여기서 추가 체크 불필요

  const category = CATEGORY_LABELS[categoryId] || CATEGORY_LABELS.general;
  const scenario = SCENARIO_PATTERNS[scenarioId] || SCENARIO_PATTERNS.tutorial;

  const seniorOpt = useMemo(() => {
    return isSeniorTargetKeyword(keyword) 
      ? getSeniorOptimizationFlags(keyword, categoryId) 
      : null;
  }, [keyword, categoryId]);

  const data = useMemo(() => {
    if (!keyword.trim()) return null;
    try {
      const titles = generateTitles(keyword, scenarioId, categoryId);
      const sequences = generateVideoSequences(keyword, scenarioId);
      const description = generateDescription(keyword, categoryId, scenarioId);
      const tagsRaw = generateTags(keyword, categoryId);
      // tagsRaw 가 객체 배열일 수도 문자열 배열일 수도 있음 - 모두 호환
      const tags = Array.isArray(tagsRaw) 
        ? tagsRaw.map((t: any) => typeof t === 'string' ? t : (t?.tag || ''))
        : [];
      return { titles, sequences, description, tags };
    } catch (e) { console.error(e); return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, categoryId, scenarioId, seed]);

  const v650Data: V650DataPackage | null = useMemo(() => {
    if (!keyword.trim()) return null;
    try { return generateV650Data(keyword, scenarioId, categoryId); }
    catch (e) { console.error(e); return null; }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, categoryId, scenarioId, seed]);

  const copy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(key);
        setTimeout(() => setCopied(null), 1500);
      });
    }
  };

  const regenerateAll = () => setSeed(Math.floor(Math.random() * 1000000));

  const switchScenario = (newId: string) => {
    setScenarioId(newId);
    setActiveBeat(0);
    setSeed(Math.floor(Math.random() * 1000000));
    const url = `/publish?keyword=${encodeURIComponent(keyword)}&category=${encodeURIComponent(categoryId)}&scenario=${encodeURIComponent(newId)}`;
    router.replace(url);
    setTimeout(() => {
      document.querySelector('.v15-preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  if (!keyword.trim()) return null;

  const activeBeatInfo = scenario.beats[activeBeat] || scenario.beats[0];
  const activeSequence = data?.sequences?.[activeBeat] || null;

  return (
    <V18Shell>
      <div className="v15-page">
        {/* 헤더 */}
        <header className="v15-header" style={{ borderColor: scenario.color }}>
          <Link href="/" className="v15-home">
            <span>🏠</span><span>홈으로</span>
          </Link>

          <div className="v15-header-main">
            <div className="v15-header-info">
              <div className="v15-header-scenario">
                <span className="v15-scenario-emoji-big">{scenario.emoji}</span>
                <div>
                  <div className="v15-scenario-name-big" style={{ color: scenario.color }}>
                    {scenario.name}
                  </div>
                  <div className="v15-scenario-flow">{scenario.flow}</div>
                </div>
              </div>
              <div className="v15-header-meta">
                <div className="v15-meta-row">
                  <span className="v15-meta-emoji">{category.emoji}</span>
                  <span><strong>{keyword}</strong> · {category.name}</span>
                </div>
                {seniorOpt && (
                  <div className="v15-senior-badge">
                    👔 시니어 자동 보정 적용
                  </div>
                )}
              </div>
            </div>
            <button type="button" className="v15-regen-all" onClick={regenerateAll}>
              ↻ 전체 새로 만들기
            </button>
          </div>
        </header>

        {/* 1. 영상 미리보기 */}
        <section className="v15-preview" style={{ borderColor: scenario.color }}>
          <div className="v15-section-head">
            <span className="v15-section-num">🎬</span>
            <span className="v15-section-title">영상 흐름</span>
            <span className="v15-section-tip">비트를 클릭하면 해당 구간의 멘트와 노하우가 표시됩니다</span>
          </div>

          <div className="v15-video-frame" style={{ background: scenario.bgColor, borderColor: scenario.color }}>
            <div className="v15-video-content">
              <div className="v15-video-emoji">{scenario.emoji}</div>
              <div className="v15-video-info">
                <div className="v15-video-name" style={{ color: scenario.color }}>{scenario.name}</div>
                <div className="v15-video-detail">분량 {scenario.duration} · 5비트 구조</div>
              </div>
              <div className="v15-video-keyword" style={{ color: scenario.color }}>
                "{keyword}"
              </div>
            </div>
          </div>

          <div className="v15-timeline">
            <div className="v15-timeline-bar">
              <div
                className="v15-timeline-fill"
                style={{ width: `${((activeBeat + 1) / scenario.beats.length) * 100}%`, background: scenario.color }}
              />
            </div>

            <div className="v15-beats">
              {scenario.beats.map((beat, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`v15-beat ${activeBeat === idx ? 'active' : ''}`}
                  onClick={() => setActiveBeat(idx)}
                  style={activeBeat === idx ? ({ '--beat-color': scenario.color } as any) : {}}
                >
                  <div className="v15-beat-time">{beat.time}</div>
                  <div className="v15-beat-dot">
                    <div className="v15-beat-dot-inner" />
                  </div>
                  <div className="v15-beat-label">{beat.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="v15-beat-detail" style={{ borderColor: scenario.color }}>
            <div className="v15-beat-detail-head">
              <div className="v15-beat-detail-time" style={{ color: scenario.color }}>
                {activeBeatInfo.time}
              </div>
              <div className="v15-beat-detail-label">{activeBeatInfo.label}</div>
            </div>

            <div className="v15-algo-tags">
              {activeBeatInfo.algoTags.map((tag, i) => {
                const info = ALGO_TAG_INFO[tag] || { color: '#525252', label: tag };
                return (
                  <span
                    key={i}
                    className="v15-algo-tag"
                    style={{ color: info.color, borderColor: info.color }}
                  >
                    ✓ {info.label}
                  </span>
                );
              })}
            </div>

            {activeSequence && (
              <div className="v15-script-box">
                <div className="v15-script-label">📺 영상 멘트 (스크립트)</div>
                <p className="v15-script-text">{activeSequence.script || ''}</p>
                {activeSequence.purpose && (
                  <div className="v15-script-purpose">
                    <strong>이 구간의 목적:</strong> {activeSequence.purpose}
                  </div>
                )}
                <button
                  type="button"
                  className={`v15-copy-btn ${copied === `seq-${activeBeat}` ? 'copied' : ''}`}
                  onClick={() => copy(activeSequence.script || '', `seq-${activeBeat}`)}
                >
                  {copied === `seq-${activeBeat}` ? '✓ 복사 완료' : '📋 이 부분 복사하기'}
                </button>
              </div>
            )}

            {activeBeat === 0 && seniorOpt && (
              <div className="v15-tip">
                <div className="v15-tip-icon">🎯</div>
                <div>
                  <strong>시니어 타겟 추천 후크 (감동·공감 중심):</strong>
                  <ul className="v15-tip-list">
                    {SENIOR_HOOK_PATTERNS.slice(0, 3).map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeBeat === 0 && (
              <div className="v15-tip">
                <div className="v15-tip-icon">💡</div>
                <div>
                  <strong>음성 SEO 적용:</strong>
                  영상 시작 30초 안에 "<strong>{keyword}</strong>" 키워드를 직접 발음하세요.
                  유튜브가 음성을 텍스트로 변환해 검색 데이터로 사용합니다.
                </div>
              </div>
            )}

            {activeBeat === scenario.beats.length - 1 && (
              <div className="v15-tip">
                <div className="v15-tip-icon">💬</div>
                <div>
                  <strong>댓글을 부르는 질문:</strong>
                  <ul className="v15-tip-list">
                    {(seniorOpt 
                      ? SENIOR_ENGAGEMENT_QUESTIONS 
                      : (ENGAGEMENT_QUESTIONS_BY_CATEGORY[categoryId] || ENGAGEMENT_QUESTIONS_BY_CATEGORY.general)
                    ).slice(0, 2).map((q, i) => (
                      <li key={i}>{q}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. 제목 후보 */}
        <section className="v15-section">
          <div className="v15-section-head">
            <span className="v15-section-num">📝</span>
            <span className="v15-section-title">영상 제목 후보 3개</span>
            <span className="v15-section-tip">8:2 법칙 적용 · 검색 80% + 후킹 20%</span>
          </div>

          {data?.titles && data.titles.length > 0 ? (
            <div className="v15-titles">
              {data.titles.slice(0, 3).map((t: any, i: number) => {
                const titleText = typeof t === 'string' ? t : (t?.title || '');
                return (
                  <div key={i} className="v15-title-card">
                    <div className="v15-title-num">제목 {i + 1}</div>
                    <div className="v15-title-text">{titleText}</div>
                    {(t?.ctr_estimate || t?.pattern) && (
                      <div className="v15-title-stats">
                        {t?.ctr_estimate && (
                          <span className="v15-title-stat">📈 예상 CTR <strong>{t.ctr_estimate}</strong></span>
                        )}
                        {t?.pattern && (
                          <span className="v15-title-pattern">{t.pattern}</span>
                        )}
                      </div>
                    )}
                    <button
                      type="button"
                      className={`v15-copy-btn ${copied === `t-${i}` ? 'copied' : ''}`}
                      onClick={() => copy(titleText, `t-${i}`)}
                    >
                      {copied === `t-${i}` ? '✓ 복사 완료' : '📋 복사하기'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="v15-empty">제목 만드는 중...</div>
          )}
        </section>

        {/* 3. AI 영상 프롬프트 */}
        <section className="v15-section">
          <div className="v15-section-head">
            <span className="v15-section-num">🎨</span>
            <span className="v15-section-title">AI 영상 프롬프트</span>
            <span className="v15-section-tip">Midjourney + Sora 2 + VEO 3 + Flow + NotebookLM 5종 통합</span>
          </div>

          {v650Data ? (
            <div className="v15-prompt-box">
              <CinematicPromptDisplay prompts={v650Data.prompts} />
            </div>
          ) : (
            <div className="v15-empty">프롬프트 만드는 중...</div>
          )}
        </section>

        {/* 4. 설명 + 해시태그 */}
        <section className="v15-section">
          <div className="v15-section-head">
            <span className="v15-section-num">#️⃣</span>
            <span className="v15-section-title">설명 + 해시태그</span>
            <span className="v15-section-tip">설명란 키워드 자연 반복 · 해시태그 3~5개</span>
          </div>

          {data?.description && (
            <div className="v15-desc-box">
              <div className="v15-desc-label">📋 영상 설명</div>
              <p className="v15-desc-text">{data.description}</p>
              <button
                type="button"
                className={`v15-copy-btn ${copied === 'desc' ? 'copied' : ''}`}
                onClick={() => copy(data.description, 'desc')}
              >
                {copied === 'desc' ? '✓ 복사 완료' : '📋 설명 복사하기'}
              </button>
            </div>
          )}

          {data?.tags && data.tags.length > 0 && (
            <div className="v15-tags-box">
              <div className="v15-tags-label">🏷 키워드 태그 (3~5개만 사용 권장)</div>
              <div className="v15-tags">
                {data.tags.slice(0, 8).map((tag: string, i: number) => (
                  <span key={i} className="v15-tag">{tag}</span>
                ))}
              </div>
              <button
                type="button"
                className={`v15-copy-btn ${copied === 'tags' ? 'copied' : ''}`}
                onClick={() => copy(data.tags.slice(0, 5).join(', '), 'tags')}
              >
                {copied === 'tags' ? '✓ 복사 완료' : '📋 상위 5개 키워드 복사'}
              </button>
            </div>
          )}
        </section>

        {/* 5. 시니어 정책 */}
        {seniorOpt && (
          <section className="v15-section">
            <div className="v15-section-head">
              <span className="v15-section-num">🛡</span>
              <span className="v15-section-title">업로드 전 정책 체크</span>
              <span className="v15-section-tip">시니어 타겟 영상 자동 보정</span>
            </div>
            <div className="v15-policy-grid">
              {SENIOR_POLICY_CHECKLIST.map((item) => (
                <div key={item.id} className={`v15-policy-item ${item.critical ? 'critical' : ''}`}>
                  <span>{item.critical ? '🔴' : '🟡'}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. 다른 시나리오 */}
        <section className="v15-section v15-other-section">
          <div className="v15-section-head">
            <span className="v15-section-num">💡</span>
            <span className="v15-section-title">같은 키워드 · 다른 형식으로 만들기</span>
            <span className="v15-section-tip">클릭하면 즉시 새 시나리오로 전환</span>
          </div>

          <div className="v15-other-grid">
            {Object.entries(SCENARIO_PATTERNS)
              .filter(([id]) => id !== scenarioId)
              .map(([id, s]) => (
                <button
                  key={id}
                  type="button"
                  className="v15-other-card"
                  onClick={() => switchScenario(id)}
                  style={{ '--card-color': s.color, '--card-bg': s.bgColor } as any}
                >
                  <div className="v15-other-emoji">{s.emoji}</div>
                  <div className="v15-other-name" style={{ color: s.color }}>{s.name}</div>
                  <div className="v15-other-desc">{s.flow}</div>
                </button>
              ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        .v15-page {
          max-width: 980px;
          margin: 0 auto;
          padding: 18px 18px 50px;
        }
        @media (max-width: 600px) { .v15-page { padding: 12px 12px 36px; } }

        .v15-header {
          padding: 18px 20px;
          background: #ffffff;
          border: 2px solid;
          margin-bottom: 16px;
        }
        @media (max-width: 600px) { .v15-header { padding: 14px 14px; margin-bottom: 14px; } }

        .v15-home {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #737373;
          text-decoration: none;
          margin-bottom: 12px;
          letter-spacing: -0.012em;
        }
        .v15-home:hover { color: #0a0a0a; }

        .v15-header-main {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        @media (max-width: 600px) { .v15-header-main { gap: 12px; } }

        .v15-header-info { flex: 1; min-width: 0; }

        .v15-header-scenario {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }

        .v15-scenario-emoji-big { font-size: 44px; line-height: 1; flex-shrink: 0; }
        @media (max-width: 600px) { .v15-scenario-emoji-big { font-size: 36px; } }

        .v15-scenario-name-big {
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin-bottom: 3px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-scenario-name-big { font-size: 19px; } }

        .v15-scenario-flow {
          font-size: 12.5px;
          color: #737373;
          font-weight: 600;
          font-family: 'SF Mono', monospace;
          letter-spacing: -0.005em;
          word-break: keep-all;
        }

        .v15-header-meta {
          padding-top: 12px;
          border-top: 1px dashed #e5e5e5;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .v15-meta-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #525252;
          flex: 1;
          min-width: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-meta-row { font-size: 13px; } }
        .v15-meta-emoji { font-size: 18px; line-height: 1; }
        .v15-meta-row strong { color: #0a0a0a; font-weight: 800; font-size: 16px; }
        @media (max-width: 600px) { .v15-meta-row strong { font-size: 14.5px; } }

        .v15-senior-badge {
          padding: 5px 11px;
          background: #fef3c7;
          color: #92400e;
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: -0.01em;
          border: 1px solid rgba(245, 158, 11, 0.3);
          flex-shrink: 0;
          word-break: keep-all;
        }

        .v15-regen-all {
          padding: 9px 16px;
          background: #ffffff;
          border: 1.5px solid #c2410c;
          color: #c2410c;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: -0.012em;
          cursor: pointer;
          transition: all 0.15s;
          flex-shrink: 0;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .v15-regen-all { width: 100%; padding: 11px 14px; font-size: 13.5px; }
        }
        .v15-regen-all:hover { background: #c2410c; color: #ffffff; }

        .v15-section, .v15-preview {
          padding: 18px 20px;
          background: #ffffff;
          border: 1.5px solid #e5e5e5;
          margin-bottom: 12px;
        }
        @media (max-width: 600px) { .v15-section, .v15-preview { padding: 14px 14px; margin-bottom: 10px; } }
        .v15-preview { border-width: 2px; }

        .v15-section-head {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-wrap: wrap;
          padding-bottom: 12px;
          margin-bottom: 14px;
          border-bottom: 1px solid #f5f5f5;
        }

        .v15-section-num {
          font-size: 22px;
          line-height: 1;
        }
        @media (max-width: 600px) { .v15-section-num { font-size: 18px; } }

        .v15-section-title {
          font-size: 17px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.022em;
          flex: 1;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-section-title { font-size: 15px; } }

        .v15-section-tip {
          font-size: 11.5px;
          color: #737373;
          font-weight: 600;
          word-break: keep-all;
          flex-basis: 100%;
          margin-top: 3px;
        }
        @media (max-width: 600px) { .v15-section-tip { font-size: 10.5px; } }

        .v15-empty {
          padding: 30px 20px;
          text-align: center;
          color: #a3a3a3;
          font-size: 13px;
        }

        .v15-video-frame {
          padding: 22px 22px;
          border: 2px solid;
          margin-bottom: 14px;
        }
        @media (max-width: 600px) { .v15-video-frame { padding: 16px 14px; } }

        .v15-video-content {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 14px;
          align-items: center;
        }
        @media (max-width: 600px) {
          .v15-video-content {
            grid-template-columns: auto 1fr;
            gap: 10px;
          }
        }

        .v15-video-emoji {
          font-size: 48px;
          line-height: 1;
        }
        @media (max-width: 600px) { .v15-video-emoji { font-size: 36px; } }

        .v15-video-info { min-width: 0; }

        .v15-video-name {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.022em;
          line-height: 1.2;
          margin-bottom: 3px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-video-name { font-size: 15px; } }

        .v15-video-detail {
          font-size: 12.5px;
          color: #525252;
          font-weight: 600;
        }

        .v15-video-keyword {
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.018em;
          padding: 7px 14px;
          background: #ffffff;
          border: 1.5px solid currentColor;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .v15-video-keyword {
            grid-column: 1 / -1;
            text-align: center;
            font-size: 14px;
            padding: 6px 12px;
          }
        }

        .v15-timeline { position: relative; margin-bottom: 14px; }
        .v15-timeline-bar {
          position: absolute;
          top: 32px;
          left: 0;
          right: 0;
          height: 2px;
          background: #e5e5e5;
        }
        .v15-timeline-fill {
          height: 100%;
          transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .v15-beats {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          position: relative;
        }

        .v15-beat {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          font-family: inherit;
          color: #a3a3a3;
          transition: color 0.15s;
        }
        .v15-beat:hover, .v15-beat.active { color: #0a0a0a; }

        .v15-beat-time {
          font-family: 'SF Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: -0.01em;
          height: 18px;
        }
        @media (max-width: 600px) { .v15-beat-time { font-size: 10.5px; } }

        .v15-beat-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #d4d4d4;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .v15-beat:hover .v15-beat-dot { border-color: #525252; }
        .v15-beat.active .v15-beat-dot {
          border-color: var(--beat-color);
          background: var(--beat-color);
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.05);
        }
        .v15-beat-dot-inner {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: transparent;
          transition: background 0.2s;
        }
        .v15-beat.active .v15-beat-dot-inner { background: #ffffff; }

        .v15-beat-label {
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-align: center;
          line-height: 1.3;
          word-break: keep-all;
          padding: 0 2px;
        }
        @media (max-width: 600px) { .v15-beat-label { font-size: 9.5px; } }

        .v15-beat-detail {
          padding: 16px 18px;
          background: #fafafa;
          border-left: 4px solid;
        }
        @media (max-width: 600px) { .v15-beat-detail { padding: 14px 14px; } }

        .v15-beat-detail-head {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #d4d4d4;
        }
        .v15-beat-detail-time {
          font-family: 'SF Mono', monospace;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.018em;
        }
        @media (max-width: 600px) { .v15-beat-detail-time { font-size: 14px; } }
        .v15-beat-detail-label {
          font-size: 16px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-beat-detail-label { font-size: 14.5px; } }

        .v15-algo-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 14px;
        }
        .v15-algo-tag {
          padding: 4px 10px;
          background: #ffffff;
          border: 1px solid;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: -0.005em;
          border-radius: 100px;
        }
        @media (max-width: 600px) { .v15-algo-tag { font-size: 10.5px; padding: 3px 8px; } }

        .v15-script-box {
          padding: 14px 14px;
          background: #ffffff;
          border-left: 3px solid #fbbf24;
          margin-bottom: 12px;
        }
        .v15-script-label {
          font-size: 11.5px;
          font-weight: 800;
          color: #92400e;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .v15-script-text {
          font-size: 14.5px;
          color: #0a0a0a;
          line-height: 1.7;
          margin: 0 0 10px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-script-text { font-size: 13.5px; line-height: 1.65; } }
        .v15-script-purpose {
          font-size: 12px;
          color: #525252;
          line-height: 1.55;
          margin-bottom: 10px;
          word-break: keep-all;
        }
        .v15-script-purpose strong { color: #0a0a0a; font-weight: 700; }

        .v15-tip {
          display: flex;
          gap: 10px;
          padding: 12px 12px;
          background: #fef3c7;
          border-left: 3px solid #f59e0b;
          font-size: 12.5px;
          line-height: 1.6;
          color: #78350f;
          align-items: flex-start;
          word-break: keep-all;
          margin-bottom: 8px;
        }
        @media (max-width: 600px) { .v15-tip { font-size: 12px; padding: 10px 10px; gap: 8px; } }
        .v15-tip-icon { font-size: 16px; flex-shrink: 0; line-height: 1; }
        .v15-tip strong { color: #92400e; font-weight: 800; display: block; margin-bottom: 3px; }
        .v15-tip-list {
          margin: 4px 0 0;
          padding-left: 18px;
        }
        .v15-tip-list li {
          margin-bottom: 3px;
          line-height: 1.55;
          word-break: keep-all;
        }

        .v15-copy-btn {
          padding: 9px 14px;
          background: #0a0a0a;
          color: #ffffff;
          border: none;
          font-family: inherit;
          font-size: 12.5px;
          font-weight: 700;
          letter-spacing: -0.012em;
          cursor: pointer;
          transition: all 0.15s;
        }
        .v15-copy-btn:hover { background: #404040; }
        .v15-copy-btn.copied { background: #16a34a; }
        @media (max-width: 600px) { .v15-copy-btn { font-size: 12px; padding: 8px 12px; } }

        .v15-titles {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .v15-title-card {
          padding: 14px 16px;
          background: #fafafa;
          border-left: 3px solid #0284c7;
        }
        @media (max-width: 600px) { .v15-title-card { padding: 12px 14px; } }

        .v15-title-num {
          font-size: 11px;
          font-weight: 800;
          color: #0c4a6e;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .v15-title-text {
          font-size: 17px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1.4;
          margin-bottom: 8px;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-title-text { font-size: 15px; } }

        .v15-title-stats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .v15-title-stat {
          font-size: 11.5px;
          color: #0c4a6e;
          font-weight: 700;
        }
        .v15-title-stat strong { color: #0284c7; }
        .v15-title-pattern {
          padding: 2px 8px;
          background: #ffffff;
          color: #525252;
          font-size: 11px;
          font-weight: 700;
          border: 1px solid #e5e5e5;
        }

        .v15-prompt-box { margin: 0; }

        .v15-desc-box {
          padding: 14px 16px;
          background: #fafafa;
          border-left: 3px solid #16a34a;
          margin-bottom: 12px;
        }
        @media (max-width: 600px) { .v15-desc-box { padding: 12px 14px; } }

        .v15-desc-label {
          font-size: 11.5px;
          font-weight: 800;
          color: #15803d;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .v15-desc-text {
          font-size: 13.5px;
          color: #0a0a0a;
          line-height: 1.65;
          margin: 0 0 10px;
          word-break: keep-all;
          white-space: pre-wrap;
          max-height: 180px;
          overflow-y: auto;
        }
        @media (max-width: 600px) { .v15-desc-text { font-size: 12.5px; max-height: 140px; } }

        .v15-tags-box {
          padding: 14px 16px;
          background: #fafafa;
          border-left: 3px solid #c2410c;
        }
        @media (max-width: 600px) { .v15-tags-box { padding: 12px 14px; } }
        .v15-tags-label {
          font-size: 11.5px;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .v15-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 10px;
        }
        .v15-tag {
          padding: 4px 11px;
          background: #ffffff;
          color: #c2410c;
          font-size: 12px;
          font-weight: 700;
          border: 1px solid rgba(194, 65, 12, 0.2);
          letter-spacing: -0.01em;
        }

        .v15-policy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }
        @media (max-width: 600px) { .v15-policy-grid { grid-template-columns: 1fr; } }
        .v15-policy-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #fafafa;
          font-size: 12.5px;
          color: #404040;
          word-break: keep-all;
        }
        .v15-policy-item.critical {
          background: #fef2f2;
          color: #991b1b;
          font-weight: 700;
        }
        @media (max-width: 600px) { .v15-policy-item { font-size: 11.5px; } }

        .v15-other-section {
          background: #fafafa;
          border-style: dashed;
        }

        .v15-other-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 8px;
        }
        @media (max-width: 600px) {
          .v15-other-grid { grid-template-columns: repeat(2, 1fr); gap: 6px; }
        }

        .v15-other-card {
          padding: 14px 12px;
          background: var(--card-bg);
          border: 1.5px solid var(--card-color);
          cursor: pointer;
          font-family: inherit;
          color: inherit;
          text-align: center;
          transition: all 0.15s;
          display: flex;
          flex-direction: column;
          gap: 5px;
          align-items: center;
        }
        .v15-other-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
        }
        @media (max-width: 600px) { .v15-other-card { padding: 12px 10px; } }

        .v15-other-emoji {
          font-size: 28px;
          line-height: 1;
        }
        @media (max-width: 600px) { .v15-other-emoji { font-size: 24px; } }

        .v15-other-name {
          font-size: 13px;
          font-weight: 800;
          letter-spacing: -0.018em;
          line-height: 1.2;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .v15-other-name { font-size: 12px; } }

        .v15-other-desc {
          font-size: 10.5px;
          color: #525252;
          font-family: 'SF Mono', monospace;
          line-height: 1.4;
          word-break: keep-all;
          font-weight: 600;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) { .v15-other-desc { font-size: 9.5px; } }
      `}</style>
    </V18Shell>
  );
}
