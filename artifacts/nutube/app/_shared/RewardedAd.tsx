'use client';
/**
 * RewardedAd 컴포넌트 - 가상 광고 시청 모달
 * 
 * AdSense Offerwall 정책 준수:
 * - 사용자에게 명확한 선택권 제공 (광고 시청 vs 진행 안 함)
 * - 받을 보상 명확히 표시
 * - 보상은 사이트 내에서만 사용
 * - 클릭 강요 X (시청만 요구)
 * - 30초 광고 + 5초 후 스킵 가능
 */

import { useState, useEffect } from 'react';

interface RewardedAdProps {
  open: boolean;
  rewardLabel: string;        // 보상 설명 (예: "1회 추가 생성")
  onComplete: () => void;     // 광고 시청 완료 콜백
  onClose: () => void;        // 닫기 콜백
}

export default function RewardedAd({ open, rewardLabel, onComplete, onClose }: RewardedAdProps) {
  const [stage, setStage] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [seconds, setSeconds] = useState(30);
  const [skipAvailable, setSkipAvailable] = useState(false);

  useEffect(() => {
    if (!open) {
      // 닫힐 때 상태 초기화
      setStage('intro');
      setSeconds(30);
      setSkipAvailable(false);
    }
  }, [open]);

  useEffect(() => {
    if (stage !== 'playing') return;

    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(timer);
          setStage('completed');
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    // 5초 후 스킵 가능
    const skipTimer = setTimeout(() => {
      setSkipAvailable(true);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(skipTimer);
    };
  }, [stage]);

  const handleStart = () => {
    setStage('playing');
    setSeconds(30);
    setSkipAvailable(false);
  };

  const handleSkip = () => {
    if (skipAvailable) {
      setStage('completed');
      setSeconds(0);
    }
  };

  const handleComplete = () => {
    onComplete();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="rewardedAdOverlay">
      <div className="rewardedAdModal">
        {/* INTRO 단계 */}
        {stage === 'intro' && (
          <>
            <div className="adIcon">🎬</div>
            <h2 className="adTitle">광고를 보고 무료로 이용하세요</h2>
            <p className="adSub">
              30초 광고를 시청하시면<br />
              <strong>{rewardLabel}</strong>을 받으실 수 있어요!
            </p>
            <div className="adRewardBox">
              <div className="rewardLabel">받을 보상</div>
              <div className="rewardValue">✨ {rewardLabel}</div>
            </div>
            <div className="adButtons">
              <button className="adBtnPrimary" onClick={handleStart}>
                ▶ 광고 시청하고 받기
              </button>
              <button className="adBtnSecondary" onClick={onClose}>
                나중에 할게요
              </button>
            </div>
            <div className="adNotice">
              💡 광고 수익은 서비스를 무료로 유지하는데 사용됩니다
            </div>
          </>
        )}

        {/* PLAYING 단계 - 가상 광고 영상 */}
        {stage === 'playing' && (
          <div className="adVideoContainer">
            <div className="adVideoTop">
              <span className="adLabel">광고</span>
              <div className="adTimer">
                {skipAvailable ? (
                  <button className="skipBtn" onClick={handleSkip}>
                    스킵 ›
                  </button>
                ) : (
                  <span className="adCountdown">남은 시간 {seconds}초</span>
                )}
              </div>
            </div>
            
            {/* 가상 광고 영상 영역 */}
            <div className="adVideo">
              <div className="adVideoContent">
                <div className="adAnimation">
                  <div className="adProductIcon">🛍️</div>
                </div>
                <div className="adBrand">샘플 광고</div>
                <div className="adHeadline">
                  실제 광고가<br />여기에 표시됩니다
                </div>
                <div className="adDesc">
                  AdSense 광고가 연동되면<br />
                  실제 광고주의 영상이 재생됩니다
                </div>
              </div>
              
              {/* 진행 바 */}
              <div className="adProgress">
                <div 
                  className="adProgressFill" 
                  style={{ width: `${((30 - seconds) / 30) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="adVideoBottom">
              <div className="adVideoInfo">
                ⏰ {skipAvailable ? '스킵 가능' : `${5 - Math.min(5, 30 - seconds)}초 후 스킵 가능`}
              </div>
            </div>
          </div>
        )}

        {/* COMPLETED 단계 */}
        {stage === 'completed' && (
          <>
            <div className="adIcon">🎉</div>
            <h2 className="adTitle">광고 시청 완료!</h2>
            <p className="adSub">
              감사합니다!<br />
              <strong>{rewardLabel}</strong>이 적용됩니다.
            </p>
            <div className="adRewardBox completed">
              <div className="rewardLabel">✓ 보상 획득</div>
              <div className="rewardValue">✨ {rewardLabel}</div>
            </div>
            <button className="adBtnPrimary" onClick={handleComplete}>
              계속 진행하기 →
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .rewardedAdOverlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          backdrop-filter: blur(4px);
        }
        .rewardedAdModal {
          background: #fff;
          border-radius: 20px;
          padding: 32px 28px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .adIcon {
          font-size: 56px;
          margin-bottom: 12px;
        }
        .adTitle {
          font-size: 22px;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 10px;
          letter-spacing: -0.025em;
        }
        .adSub {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .adSub strong {
          color: #4f46e5;
        }
        .adRewardBox {
          background: linear-gradient(135deg, #fdf1e7 0%, #fff8f0 100%);
          border: 2px solid #4f46e5;
          border-radius: 14px;
          padding: 18px 20px;
          margin-bottom: 20px;
        }
        .adRewardBox.completed {
          background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f1 100%);
          border-color: #2e7d32;
        }
        .rewardLabel {
          font-size: 11px;
          font-weight: 700;
          color: #888;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .adRewardBox.completed .rewardLabel {
          color: #2e7d32;
        }
        .rewardValue {
          font-size: 18px;
          font-weight: 800;
          color: #4f46e5;
        }
        .adRewardBox.completed .rewardValue {
          color: #2e7d32;
        }
        .adButtons {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }
        .adBtnPrimary {
          padding: 14px 20px;
          background: linear-gradient(135deg, #4f46e5, #d97155);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(198, 95, 59, 0.25);
        }
        .adBtnPrimary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(198, 95, 59, 0.35);
        }
        .adBtnSecondary {
          padding: 12px 20px;
          background: #fff;
          color: #888;
          border: 1px solid #e5e5e5;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }
        .adBtnSecondary:hover {
          background: #fafafa;
          color: #555;
        }
        .adNotice {
          font-size: 11px;
          color: #888;
          line-height: 1.5;
          padding: 10px 12px;
          background: #fafafa;
          border-radius: 8px;
        }

        /* 광고 영상 영역 */
        .adVideoContainer {
          margin: -32px -28px;
          background: #000;
          border-radius: 20px;
          overflow: hidden;
        }
        .adVideoTop {
          padding: 12px 16px;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .adLabel {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .adTimer {
          font-size: 12px;
        }
        .adCountdown {
          color: #fff;
          font-weight: 600;
          opacity: 0.9;
        }
        .skipBtn {
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #fff;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
        }
        .skipBtn:hover {
          background: rgba(255, 255, 255, 0.25);
        }
        .adVideo {
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }
        .adVideoContent {
          padding: 24px;
          text-align: center;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        .adAnimation {
          margin-bottom: 12px;
        }
        .adProductIcon {
          font-size: 64px;
          animation: bounce 1.5s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .adBrand {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 6px;
        }
        .adHeadline {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.3;
          margin-bottom: 10px;
        }
        .adDesc {
          font-size: 12px;
          opacity: 0.85;
          line-height: 1.5;
        }
        .adProgress {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: rgba(255, 255, 255, 0.2);
        }
        .adProgressFill {
          height: 100%;
          background: #fff;
          transition: width 1s linear;
        }
        .adVideoBottom {
          padding: 10px 16px;
          background: #1a1a1a;
          color: #fff;
          font-size: 11px;
          opacity: 0.7;
          text-align: center;
        }
        .adVideoInfo {
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 사용 횟수 추적 유틸리티 (localStorage)
// 박 대표님 결정: 최초 5회 무료 + 이후 모두 광고 시청
// ============================================================

const FREE_TOTAL_LIMIT = 5;  // 최초 5회 (월별 X, 평생 5회)

export function getUsageCount(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem('nutube_total_usage');
    return stored ? parseInt(stored, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementUsage(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const current = getUsageCount();
    const next = current + 1;
    localStorage.setItem('nutube_total_usage', String(next));
    return next;
  } catch {
    return 0;
  }
}

export function getRemainingFree(): number {
  return Math.max(0, FREE_TOTAL_LIMIT - getUsageCount());
}

export function isFreeAvailable(): boolean {
  return getRemainingFree() > 0;
}

// 광고 시청 후 보너스 사용권 추가
export function addBonusCredit(): void {
  if (typeof window === 'undefined') return;
  try {
    const current = parseInt(localStorage.getItem('nutube_bonus_credits') || '0', 10);
    localStorage.setItem('nutube_bonus_credits', String(current + 1));
  } catch {}
}

// 보너스 사용권 사용
export function useBonusCredit(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = parseInt(localStorage.getItem('nutube_bonus_credits') || '0', 10);
    if (current > 0) {
      localStorage.setItem('nutube_bonus_credits', String(current - 1));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function getBonusCredits(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem('nutube_bonus_credits') || '0', 10);
  } catch {
    return 0;
  }
}

// 게이트 통과 확인 + 사용권 차감
export function tryUseCredit(): { allowed: boolean; source: 'free' | 'bonus' | 'none' } {
  if (isFreeAvailable()) {
    incrementUsage();
    return { allowed: true, source: 'free' };
  }
  if (useBonusCredit()) {
    return { allowed: true, source: 'bonus' };
  }
  return { allowed: false, source: 'none' };
}

export const FREE_LIMIT = FREE_TOTAL_LIMIT;
