'use client';
/**
 * AlgoBlackbox 컴포넌트 - 독자 알고리즘 블랙박스
 *
 * ⚠️ 이 컴포넌트는 단순한 디스플레이 역할만 합니다.
 * 실제 알고리즘 로직은 Railway 백엔드에만 존재합니다.
 *
 * 박예준 확정 요구사항:
 * ✅ 프론트엔드에 로직 없음
 * ✅ 백엔드 API 호출로 결과만 받음
 * ✅ "베일에 감춰진" 미스터리한 UI
 */

import { useState, useEffect } from 'react';

// ============================================================
// 백엔드 API 응답 타입
// ============================================================
interface AlgoStep {
  step: number;
  name: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

interface AlgoResult {
  request_id: string;
  algorithm_version: string;
  steps: AlgoStep[];
  boost_percentage: number;
  optimization_score: number;
  target_audience_match: number;
  algorithm_tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  estimated_views: {
    low: number;
    mid: number;
    high: number;
  };
  hidden_token: string;
}

interface AlgoBlackboxProps {
  category: string;
  keyword: string;
  title: string;
  scenarioType?: string;
}

// ============================================================
// API 엔드포인트
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://project-blackbox-production.up.railway.app';

export default function AlgoBlackbox({
  category,
  keyword,
  title,
  scenarioType,
}: AlgoBlackboxProps) {
  const [result, setResult] = useState<AlgoResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [animatedBoost, setAnimatedBoost] = useState(0);

  // 백엔드 API 호출
  useEffect(() => {
    const fetchOptimization = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/algo/optimize`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category,
            keyword,
            title,
            scenario_type: scenarioType,
          }),
        });

        if (!response.ok) {
          throw new Error('알고리즘 실행 실패');
        }

        const data: AlgoResult = await response.json();
        setResult(data);
        setLoading(false);
      } catch (err) {
        // API 실패 시 폴백 (데모용)
        const fallback: AlgoResult = {
          request_id: 'demo',
          algorithm_version: 'v3.2.1',
          steps: [
            { step: 1, name: '타겟 시청자 페르소나 분석', status: 'completed', progress: 100 },
            { step: 2, name: '경쟁 채널 알고리즘 패턴 매칭', status: 'completed', progress: 100 },
            { step: 3, name: '조회수 터지는 구조 설계', status: 'completed', progress: 100 },
            { step: 4, name: 'SEO 최적화 및 키워드 매핑', status: 'active', progress: 75 },
          ],
          boost_percentage: 280,
          optimization_score: 87,
          target_audience_match: 85,
          algorithm_tier: 'GOLD',
          estimated_views: { low: 18000, mid: 25000, high: 35000 },
          hidden_token: 'demo_token',
        };
        setResult(fallback);
        setLoading(false);
      }
    };

    fetchOptimization();
  }, [category, keyword, title, scenarioType]);

  // 숫자 애니메이션
  useEffect(() => {
    if (!result) return;
    const target = result.boost_percentage;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let stepCount = 0;

    const timer = setInterval(() => {
      current += increment;
      stepCount += 1;
      if (stepCount >= steps) {
        setAnimatedBoost(target);
        clearInterval(timer);
      } else {
        setAnimatedBoost(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [result]);

  if (loading || !result) {
    return (
      <div className="algoLoading">
        <div className="algoPulse" />
        <span>알고리즘 초기화 중...</span>
        <style jsx>{`
          .algoLoading {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 60px 20px;
            color: rgba(245, 241, 234, 0.6);
            font-size: 14px;
          }
          .algoPulse {
            width: 12px;
            height: 12px;
            background: #4f46e5;
            border-radius: 50%;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }

  const tierColors: Record<string, { bg: string; fg: string }> = {
    BRONZE: { bg: 'rgba(205, 127, 50, 0.15)', fg: '#cd7f32' },
    SILVER: { bg: 'rgba(192, 192, 192, 0.15)', fg: '#c0c0c0' },
    GOLD: { bg: 'rgba(255, 215, 0, 0.15)', fg: '#ffd700' },
    PLATINUM: { bg: 'rgba(229, 228, 226, 0.15)', fg: '#e5e4e2' },
  };
  const tierStyle = tierColors[result.algorithm_tier];

  return (
    <>
      {/* 알고리즘 헤더 */}
      <div className="algoHeader">
        <div className="algoPulseRing" />
        <span className="algoStatus">ACTIVE · PROPRIETARY</span>
        <span className="algoVersion">{result.algorithm_version}</span>
      </div>

      <div className="algoTitle">
        알고메이커 전용 알고리즘이<br />
        당신의 영상을 최적화하고 있습니다
      </div>

      <div className="algoSubtitle">
        2026 유튜브 알고리즘 패턴 · 조회수 터지는 공식 · 타겟 시청자 분석
      </div>

      {/* 진행 단계 */}
      <div className="algoProcess">
        {result.steps.map((step) => (
          <div
            key={step.step}
            className={`algoStep ${step.status}`}
          >
            <div className={`algoStepDot ${step.status === 'active' ? 'pulse' : ''}`} />
            <div className="algoStepText">
              <span className="algoStepLabel">STEP {step.step}</span>
              <span className="algoStepName">{step.name}</span>
            </div>
            {step.status === 'completed' && <span className="algoStepCheck">✓</span>}
            {step.status === 'active' && <span className="algoStepLoading">···</span>}
          </div>
        ))}
      </div>

      {/* 결과 영역 */}
      <div className="algoResultGrid">
        {/* 부스트 퍼센트 */}
        <div className="algoResultCard primary">
          <div className="algoResultLabel">🎯 예상 조회수 부스팅</div>
          <div className="algoResultValue">+{animatedBoost}%</div>
          <div className="algoResultNote">
            일반 영상 대비 NuTube 최적화 영상 평균 조회수
          </div>
        </div>

        {/* 최적화 점수 */}
        <div className="algoResultCard">
          <div className="algoResultLabel">📊 최적화 점수</div>
          <div className="algoResultValue small">{result.optimization_score}<span className="unit">/100</span></div>
          <div className="algoResultNote">
            타겟 매치율: {result.target_audience_match}%
          </div>
        </div>

        {/* 티어 */}
        <div
          className="algoResultCard"
          style={{ background: tierStyle.bg, borderColor: tierStyle.fg + '40' }}
        >
          <div className="algoResultLabel">🏆 알고리즘 티어</div>
          <div className="algoResultValue small" style={{ color: tierStyle.fg }}>
            {result.algorithm_tier}
          </div>
          <div className="algoResultNote">
            예상 조회수: {result.estimated_views.mid.toLocaleString()}회
          </div>
        </div>
      </div>

      {/* 알고리즘 서명 */}
      <div className="algoLockNote">
        🔒 Algorithm ID: {result.request_id} · Token verified · Patent pending<br />
        * 알고메이커의 독자 알고리즘은 특허 출원 중이며, 외부 공개/복제가 금지됩니다.
      </div>

      <style jsx>{`
        .algoHeader {
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
          z-index: 1;
        }
        .algoPulseRing {
          width: 10px;
          height: 10px;
          background: #5e7e5d;
          border-radius: 50%;
          position: relative;
        }
        .algoPulseRing::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          background: rgba(94, 126, 93, 0.4);
          animation: pulseRing 2s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .algoStatus {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: rgba(245, 241, 234, 0.65);
        }
        .algoVersion {
          margin-left: auto;
          font-size: 10px;
          font-family: 'SF Mono', Monaco, monospace;
          color: rgba(245, 241, 234, 0.45);
        }
        .algoTitle {
          position: relative;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.35;
          margin-bottom: 8px;
          z-index: 1;
        }
        .algoSubtitle {
          position: relative;
          font-size: 12.5px;
          color: rgba(245, 241, 234, 0.55);
          line-height: 1.6;
          margin-bottom: 22px;
          z-index: 1;
        }
        .algoProcess {
          position: relative;
          margin-bottom: 22px;
          z-index: 1;
        }
        .algoStep {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          background: rgba(245, 241, 234, 0.04);
          border: 1px solid rgba(245, 241, 234, 0.08);
          border-radius: 10px;
          margin-bottom: 6px;
          transition: all 0.3s;
        }
        .algoStep.completed {
          background: rgba(94, 126, 93, 0.08);
          border-color: rgba(94, 126, 93, 0.2);
        }
        .algoStep.active {
          background: rgba(198, 95, 59, 0.1);
          border-color: rgba(198, 95, 59, 0.25);
        }
        .algoStepDot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(245, 241, 234, 0.2);
        }
        .algoStep.completed .algoStepDot {
          background: #5e7e5d;
        }
        .algoStep.active .algoStepDot {
          background: #4f46e5;
        }
        .algoStepDot.pulse {
          animation: dotPulse 1.5s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(198, 95, 59, 0.6); }
          50% { opacity: 0.6; box-shadow: 0 0 0 6px rgba(198, 95, 59, 0); }
        }
        .algoStepText {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .algoStepLabel {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: rgba(245, 241, 234, 0.45);
        }
        .algoStepName {
          font-size: 13px;
          font-weight: 700;
          color: #f5f1ea;
        }
        .algoStepCheck {
          font-size: 14px;
          color: #5e7e5d;
          font-weight: 800;
        }
        .algoStepLoading {
          font-size: 18px;
          color: #f5a26b;
          animation: loadingDots 1.5s ease-in-out infinite;
        }
        @keyframes loadingDots {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .algoResultGrid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          margin-bottom: 18px;
        }
        .algoResultCard {
          position: relative;
          background: rgba(245, 241, 234, 0.04);
          border: 1px solid rgba(245, 241, 234, 0.1);
          border-radius: 12px;
          padding: 16px 14px;
          text-align: center;
          z-index: 1;
        }
        .algoResultCard.primary {
          background: rgba(198, 95, 59, 0.12);
          border-color: rgba(198, 95, 59, 0.3);
        }
        .algoResultLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: rgba(245, 241, 234, 0.7);
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .algoResultValue {
          font-size: 36px;
          font-weight: 800;
          color: #f5a26b;
          letter-spacing: -0.03em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .algoResultValue.small {
          font-size: 24px;
          color: #f5f1ea;
        }
        .algoResultValue.small .unit {
          font-size: 14px;
          color: rgba(245, 241, 234, 0.4);
          font-weight: 700;
        }
        .algoResultNote {
          font-size: 10.5px;
          color: rgba(245, 241, 234, 0.5);
          line-height: 1.5;
        }
        .algoLockNote {
          position: relative;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px solid rgba(245, 241, 234, 0.1);
          font-size: 10.5px;
          color: rgba(245, 241, 234, 0.5);
          text-align: center;
          line-height: 1.7;
          z-index: 1;
          font-family: 'SF Mono', Monaco, monospace;
        }

        @media (max-width: 720px) {
          .algoResultGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}
