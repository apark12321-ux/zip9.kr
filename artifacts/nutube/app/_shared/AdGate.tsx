'use client';
/**
 * AdGate 컴포넌트 v2 - 광고 시청 후 1회 사용 방식
 *
 * 박예준 확정 요구사항:
 * ✅ 유료 결제 없음
 * ✅ 광고 시청 → 1회 사용
 * ✅ 여러번 선택 가능 (재사용 시 광고 다시 시청)
 * ✅ AdSense 친화적 (광고 노출 극대화)
 */

import { useState, useEffect } from 'react';

// ============================================================
// 기능 타입 정의 (확장 가능)
// ============================================================
export type AdGatedFeature = 
  | 'competitor-analysis'
  | 'trending-research'
  | 'deep-seo-analysis'
  | 'thumbnail-ab-test';

const FEATURE_NAMES: Record<AdGatedFeature, string> = {
  'competitor-analysis': '경쟁 채널 분석',
  'trending-research': '트렌드 심층 조사',
  'deep-seo-analysis': '딥 SEO 분석',
  'thumbnail-ab-test': '썸네일 A/B 테스트',
};

const FEATURE_EMOJI: Record<AdGatedFeature, string> = {
  'competitor-analysis': '📊',
  'trending-research': '🔍',
  'deep-seo-analysis': '🎯',
  'thumbnail-ab-test': '🖼️',
};

// ============================================================
// 세션 통계 (sessionStorage)
// ============================================================
const getStatsKey = () => 'nutube_adgate_stats';

interface AdGateStats {
  totalWatched: number;
  featureUsed: Record<string, number>;
}

function getStats(): AdGateStats {
  if (typeof window === 'undefined') return { totalWatched: 0, featureUsed: {} };
  try {
    const stats = sessionStorage.getItem(getStatsKey());
    if (stats) return JSON.parse(stats);
  } catch {}
  return { totalWatched: 0, featureUsed: {} };
}

function incrementStats(feature: AdGatedFeature) {
  if (typeof window === 'undefined') return;
  try {
    const stats = getStats();
    stats.totalWatched += 1;
    stats.featureUsed[feature] = (stats.featureUsed[feature] || 0) + 1;
    sessionStorage.setItem(getStatsKey(), JSON.stringify(stats));
  } catch {}
}

export function getTotalAdWatched(): number {
  return getStats().totalWatched;
}

export function getFeatureUsageCount(feature: AdGatedFeature): number {
  return getStats().featureUsed[feature] || 0;
}

// ============================================================
// AdGate 모달 컴포넌트
// ============================================================
interface AdGateModalProps {
  feature: AdGatedFeature;
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export default function AdGateModal({
  feature,
  isOpen,
  onClose,
  onUnlock,
}: AdGateModalProps) {
  const [adStage, setAdStage] = useState<'initial' | 'watching' | 'completed'>('initial');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setUsageCount(getFeatureUsageCount(feature));
    }
  }, [isOpen, feature]);

  useEffect(() => {
    if (adStage !== 'watching') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdStage('completed');
          incrementStats(feature);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [adStage, feature]);

  if (!isOpen) return null;

  const handleWatchAd = () => {
    setAdStage('watching');
    setSecondsLeft(30);
  };

  const handleComplete = () => {
    onUnlock();
    onClose();
    setTimeout(() => {
      setAdStage('initial');
      setSecondsLeft(30);
    }, 300);
  };

  const handleCloseEarly = () => {
    if (adStage === 'watching') return;
    onClose();
    setTimeout(() => {
      setAdStage('initial');
      setSecondsLeft(30);
    }, 300);
  };

  return (
    <>
      <style jsx>{`
        .overlay {
          position: fixed;
          inset: 0;
          background: rgba(42, 36, 25, 0.75);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
          padding: 16px;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal {
          background: #faf8f4;
          border-radius: 20px;
          padding: 32px;
          max-width: 480px;
          width: 100%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .emoji {
          font-size: 48px;
          margin-bottom: 8px;
          line-height: 1;
        }
        .title {
          font-size: 20px;
          font-weight: 800;
          color: #2a2419;
          letter-spacing: -0.025em;
          margin-bottom: 6px;
        }
        .subtitle {
          font-size: 13px;
          color: #564a3a;
          line-height: 1.6;
        }
        .subtitle strong {
          color: #4f46e5;
          font-weight: 700;
        }
        .usageBadge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fdf1e7;
          color: #a64a2a;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          margin-top: 8px;
          border: 1px solid rgba(198, 95, 59, 0.15);
        }
        .benefits {
          background: linear-gradient(135deg, #fdf1e7 0%, #fbf3df 100%);
          border: 1px solid rgba(198, 95, 59, 0.15);
          border-radius: 12px;
          padding: 16px 18px;
          margin-bottom: 20px;
        }
        .benefitItem {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: #564a3a;
          line-height: 1.6;
          padding: 4px 0;
        }
        .benefitItem strong {
          color: #a64a2a;
          font-weight: 700;
        }
        .checkIcon {
          color: #5e7e5d;
          font-weight: 800;
          flex-shrink: 0;
          font-size: 14px;
        }
        .adPlayer {
          background: linear-gradient(135deg, #2a2419 0%, #3a3020 100%);
          border-radius: 14px;
          padding: 48px 24px;
          margin-bottom: 16px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .adPlayer::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, rgba(198, 95, 59, 0.15), transparent 60%),
                      radial-gradient(circle at 70% 70%, rgba(245, 162, 107, 0.1), transparent 60%);
        }
        .adLabel {
          font-size: 10px;
          font-weight: 800;
          color: rgba(245, 241, 234, 0.5);
          letter-spacing: 0.2em;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .adTimer {
          font-size: 52px;
          font-weight: 800;
          color: #f5a26b;
          letter-spacing: -0.02em;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
          line-height: 1;
        }
        .adText {
          font-size: 13px;
          color: rgba(245, 241, 234, 0.85);
          position: relative;
          z-index: 1;
        }
        .adProgress {
          margin-top: 20px;
          height: 4px;
          background: rgba(245, 241, 234, 0.15);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .adProgressBar {
          height: 100%;
          background: linear-gradient(to right, #4f46e5, #f5a26b);
          border-radius: 999px;
          transition: width 1s linear;
        }
        .successIcon {
          font-size: 64px;
          margin-bottom: 14px;
          text-align: center;
          line-height: 1;
        }
        .successTitle {
          font-size: 20px;
          font-weight: 800;
          color: #5e7e5d;
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }
        .successSub {
          font-size: 14px;
          color: #564a3a;
          text-align: center;
          line-height: 1.6;
          margin-bottom: 4px;
        }
        .successSub strong {
          color: #4f46e5;
          font-weight: 700;
        }
        .hintNote {
          font-size: 11.5px;
          color: #8a7d6a;
          text-align: center;
          line-height: 1.55;
          margin-top: 4px;
          margin-bottom: 20px;
        }
        .actionRow {
          display: flex;
          gap: 10px;
          margin-top: 12px;
        }
        .primaryBtn {
          flex: 1;
          padding: 15px 20px;
          background: linear-gradient(135deg, #4f46e5 0%, #a64a2a 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          letter-spacing: -0.01em;
          transition: all 0.18s;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.25);
        }
        .primaryBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.35);
        }
        .secondaryBtn {
          padding: 15px 20px;
          background: transparent;
          color: #8a7d6a;
          border: 1px solid rgba(90, 74, 58, 0.15);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.18s;
        }
        .secondaryBtn:hover {
          border-color: rgba(90, 74, 58, 0.3);
          color: #564a3a;
        }
        .legalNote {
          margin-top: 16px;
          font-size: 10.5px;
          color: #8a7d6a;
          text-align: center;
          line-height: 1.6;
        }
      `}</style>

      <div className="overlay" onClick={handleCloseEarly}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {adStage === 'initial' && (
            <>
              <div className="header">
                <div className="emoji">{FEATURE_EMOJI[feature]}</div>
                <div className="title">{FEATURE_NAMES[feature]}</div>
                <div className="subtitle">
                  광고 시청 후 <strong>1회 사용</strong> 가능합니다
                </div>
                {usageCount > 0 && (
                  <div className="usageBadge">
                    🎯 이번 세션에서 {usageCount}회 이용함
                  </div>
                )}
              </div>

              <div className="benefits">
                <div className="benefitItem">
                  <span className="checkIcon">✓</span>
                  <span><strong>30초 광고</strong> 시청</span>
                </div>
                <div className="benefitItem">
                  <span className="checkIcon">✓</span>
                  <span>즉시 <strong>1회 사용</strong> 가능</span>
                </div>
                <div className="benefitItem">
                  <span className="checkIcon">✓</span>
                  <span><strong>무제한 재이용</strong> (광고만 다시 시청)</span>
                </div>
                <div className="benefitItem">
                  <span className="checkIcon">✓</span>
                  <span>결제 불필요 · 로그인 불필요</span>
                </div>
              </div>

              <div className="actionRow">
                <button className="secondaryBtn" onClick={onClose}>
                  나중에
                </button>
                <button className="primaryBtn" onClick={handleWatchAd}>
                  🎬 광고 보고 이용하기
                </button>
              </div>

              <div className="legalNote">
                * 광고는 Google AdSense로 제공됩니다.<br />
                * 광고 시청 완료 시 1회 사용권이 부여됩니다.
              </div>
            </>
          )}

          {adStage === 'watching' && (
            <>
              <div className="header">
                <div className="title">광고 시청 중...</div>
                <div className="subtitle">광고가 끝나면 바로 이용 가능합니다</div>
              </div>

              <div className="adPlayer">
                <div className="adLabel">SPONSORED AD</div>
                <div className="adTimer">{secondsLeft}초</div>
                <div className="adText">
                  {secondsLeft > 20 && '광고가 시작됩니다...'}
                  {secondsLeft <= 20 && secondsLeft > 10 && '조금만 기다려주세요'}
                  {secondsLeft <= 10 && secondsLeft > 0 && '거의 다 되었어요!'}
                </div>
                <div className="adProgress">
                  <div
                    className="adProgressBar"
                    style={{ width: `${((30 - secondsLeft) / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="legalNote">
                * 실제 배포 시 AdSense 광고가 표시됩니다.
              </div>
            </>
          )}

          {adStage === 'completed' && (
            <>
              <div className="successIcon">🎉</div>
              <div className="successTitle">시청 완료!</div>
              <div className="successSub">
                <strong>{FEATURE_NAMES[feature]}</strong> 1회 사용권이<br />
                지급되었습니다
              </div>
              <div className="hintNote">
                💡 다시 이용하려면 광고를 한번 더 시청하면 됩니다
              </div>

              <button
                className="primaryBtn"
                style={{ width: '100%' }}
                onClick={handleComplete}
              >
                ✨ 바로 사용하기
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
