'use client';
/**
 * 🎯 Algo-Magic Booster
 *
 * 박예준 대표님 + 박 실장 + Claude 공동 설계
 *
 * 사용법:
 *   <AlgoBooster
 *     initialData={{ title: '...', grade: 'B+', retention: 42, ctr: 4.2 }}
 *     optimizedData={{ title: '...', grade: 'A++', retention: 78, ctr: 8.7 }}
 *     onApply={() => { ... 실제 데이터 변경 로직 ... }}
 *     variant="full" | "demo"
 *   />
 *
 * variant:
 *   - "full": 결과 페이지용 (좌측 레버 + 우측 데이터 + 제목 변화)
 *   - "demo": 메인 랜딩 미니 데모 (레버 + 간단한 수치 변화만)
 */

import { useState, useRef, useEffect } from 'react';

export interface BoosterData {
  title: string;
  grade: string;
  retention: number;
  ctr: number;
}

interface AlgoBoosterProps {
  initialData?: BoosterData;
  optimizedData?: BoosterData;
  onApply?: () => void;
  variant?: 'full' | 'demo';
}

const DEFAULT_INITIAL: BoosterData = {
  title: '기초연금 2026년 달라지는 점',
  grade: 'B+',
  retention: 42,
  ctr: 4.2,
};

const DEFAULT_OPTIMIZED: BoosterData = {
  title: '⚠️ 2026 기초연금, 이 3가지 모르면 매달 30만원 손해봅니다',
  grade: 'A++',
  retention: 78,
  ctr: 8.7,
};

const GRADE_STEPS = ['B+', 'B++', 'A-', 'A', 'A+', 'A++'];

const PROGRESS_MESSAGES = [
  { icon: '🔍', text: '2026 알고리즘 분석 중...' },
  { icon: '🎯', text: 'Quality CTR 최적화 중...' },
  { icon: '⚡', text: '후킹 포인트 삽입 중...' },
  { icon: '✨', text: '제목·태그 튜닝 중...' },
];

export default function AlgoBooster({
  initialData = DEFAULT_INITIAL,
  optimizedData = DEFAULT_OPTIMIZED,
  onApply,
  variant = 'full',
}: AlgoBoosterProps) {
  const [isApplied, setIsApplied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentData, setCurrentData] = useState(initialData);
  const [progressStep, setProgressStep] = useState(0);
  const sparkleContainerRef = useRef<HTMLDivElement>(null);

  // Web Audio API 소리 효과
  const playClickSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const playSuccessSound = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.08 + 0.3);
        osc.start(ctx.currentTime + i * 0.08);
        osc.stop(ctx.currentTime + i * 0.08 + 0.3);
      });
    } catch (e) {}
  };

  const createSparkle = () => {
    if (!sparkleContainerRef.current) return;
    const sparkle = document.createElement('div');
    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;

    sparkle.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      width: 6px; height: 6px;
      background: #d4a545;
      border-radius: 50%;
      box-shadow: 0 0 8px #d4a545;
      pointer-events: none;
    `;
    sparkleContainerRef.current.appendChild(sparkle);

    const animation = sparkle.animate(
      [
        { transform: 'translate(0, 0) scale(0)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) scale(1.5)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${tx * 1.5}px, ${ty * 1.5}px) scale(0)`, opacity: 0 },
      ],
      { duration: 1500, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    );
    animation.onfinish = () => sparkle.remove();
  };

  const activateBooster = () => {
    if (isApplied || isAnimating) return;
    setIsAnimating(true);
    playClickSound();

    // 파티클 생성
    for (let i = 0; i < 12; i++) {
      setTimeout(() => createSparkle(), i * 120);
    }

    // 진행 메시지 순차 표시
    let step = 0;
    const messageInterval = setInterval(() => {
      step++;
      if (step < PROGRESS_MESSAGES.length) {
        setProgressStep(step);
      }
    }, 500);

    // 수치 애니메이션 (1.8초)
    const duration = 1800;
    const startTime = performance.now();
    const fromRet = initialData.retention;
    const toRet = optimizedData.retention;
    const fromCtr = initialData.ctr;
    const toCtr = optimizedData.ctr;

    const updateNumbers = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const gradeIdx = Math.min(
        Math.floor(progress * GRADE_STEPS.length),
        GRADE_STEPS.length - 1
      );
      const currentRet = Math.round(fromRet + (toRet - fromRet) * progress);
      const currentCtr = parseFloat((fromCtr + (toCtr - fromCtr) * progress).toFixed(1));

      setCurrentData({
        title: progress > 0.8 ? optimizedData.title : initialData.title,
        grade: GRADE_STEPS[gradeIdx],
        retention: currentRet,
        ctr: currentCtr,
      });

      if (progress < 1) requestAnimationFrame(updateNumbers);
    };
    requestAnimationFrame(updateNumbers);

    // 완료 처리
    setTimeout(() => {
      clearInterval(messageInterval);
      setCurrentData(optimizedData);
      setIsApplied(true);
      setIsAnimating(false);
      playSuccessSound();
      if (onApply) onApply();
    }, 2000);
  };

  const currentMessage = PROGRESS_MESSAGES[progressStep] || PROGRESS_MESSAGES[0];

  return (
    <div className={`booster-wrap variant-${variant}`}>
      <style jsx>{`
        .booster-wrap {
          font-family: 'Pretendard', -apple-system, sans-serif;
        }

        /* ======== FULL VARIANT ======== */
        .variant-full {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 24px 0;
        }
        .variant-full .dataPanel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* ======== DEMO VARIANT ======== */
        .variant-demo {
          margin: 24px 0;
        }
        .variant-demo .dataPanel { display: none; }

        /* ======== TITLE BOX ======== */
        .titleBox {
          background: #faf8f4;
          border: 1px solid rgba(90, 74, 58, 0.06);
          border-radius: 12px;
          padding: 16px 20px;
          min-height: 60px;
        }
        .titleLabel {
          font-size: 10px;
          font-weight: 800;
          color: #8a7d6a;
          letter-spacing: 0.1em;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .titleText {
          font-size: 15px;
          font-weight: 700;
          color: #2a2419;
          line-height: 1.5;
          transition: all 0.5s ease;
          letter-spacing: -0.02em;
        }
        .titleText.animating {
          transform: scale(1.02);
          color: #4f46e5;
        }

        /* ======== METRICS ======== */
        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .metricCard {
          background: #faf8f4;
          border-radius: 10px;
          padding: 12px 10px;
          text-align: center;
          transition: all 0.3s;
        }
        .metricCard.success {
          background: #eaf2ea;
        }
        .metricLabel {
          font-size: 10px;
          font-weight: 700;
          color: #8a7d6a;
          letter-spacing: 0.03em;
          margin-bottom: 6px;
        }
        .metricValue {
          font-size: 24px;
          font-weight: 800;
          color: #4f46e5;
          letter-spacing: -0.03em;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          transition: all 0.3s;
        }
        .metricCard.success .metricValue {
          color: #5e7e5d;
        }

        /* ======== BOOSTER BODY ======== */
        .booster {
          background: linear-gradient(135deg, #3a332a 0%, #2a2419 100%);
          border: 3px solid #d4a545;
          border-radius: 16px;
          padding: 22px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          transition: all 0.5s;
        }
        .booster.animating {
          box-shadow: 0 0 40px rgba(212, 165, 69, 0.5), 0 8px 24px rgba(0, 0, 0, 0.2);
          border-color: #f5a26b;
        }
        .booster.applied {
          border-color: #7d9b7c;
          box-shadow: 0 0 24px rgba(125, 155, 124, 0.3), 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .booster::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at 30% 30%, rgba(212, 165, 69, 0.15) 0%, transparent 60%);
          pointer-events: none;
        }

        .boosterHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(212, 165, 69, 0.25);
          position: relative;
          z-index: 1;
        }
        .boosterLabel {
          font-size: 10px;
          font-weight: 800;
          color: #d4a545;
          letter-spacing: 0.15em;
          margin-bottom: 4px;
        }
        .boosterTitle {
          font-size: 13px;
          font-weight: 700;
          color: #f5f1ea;
          letter-spacing: -0.015em;
        }

        .statusLight {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #4f46e5;
          box-shadow: 0 0 12px rgba(198, 95, 59, 0.8);
          transition: all 0.3s;
          flex-shrink: 0;
        }
        .statusLight.applied {
          background: #7d9b7c;
          box-shadow: 0 0 16px rgba(125, 155, 124, 1);
        }

        /* ======== LEVER ======== */
        .leverRow {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .leverArea {
          cursor: pointer;
          width: 80px;
          height: 100px;
          position: relative;
          flex-shrink: 0;
        }
        .leverArea.disabled {
          cursor: default;
        }
        .leverBase {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 62px;
          height: 16px;
          background: #1a1612;
          border-radius: 6px;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        .leverStick {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%) rotate(25deg);
          transform-origin: bottom center;
          width: 9px;
          height: 70px;
          background: linear-gradient(
            to right,
            #6b5d4a 0%,
            #8a7d6a 50%,
            #6b5d4a 100%
          );
          border-radius: 3px;
          transition: transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        }
        .leverStick.up {
          transform: translateX(-50%) rotate(-25deg);
        }
        .leverKnob {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 26px;
          height: 26px;
          background: radial-gradient(
            circle at 30% 30%,
            #e07d5a 0%,
            #4f46e5 50%,
            #8a3a1c 100%
          );
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.3);
          transition: background 0.5s;
        }
        .leverKnob.applied {
          background: radial-gradient(
            circle at 30% 30%,
            #9bb59a 0%,
            #7d9b7c 50%,
            #4a6b49 100%
          );
        }

        .sparkles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .leverInfo {
          flex: 1;
          min-width: 0;
        }
        .leverStatus {
          font-size: 13px;
          color: #d4a545;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: 0.01em;
          line-height: 1.4;
        }
        .leverStatus.applied {
          color: #9bb59a;
        }
        .leverSub {
          font-size: 11.5px;
          color: rgba(245, 241, 234, 0.7);
          line-height: 1.55;
        }

        /* ======== PROGRESS ======== */
        .progressBar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(212, 165, 69, 0.25);
          font-size: 12px;
          color: #f5a26b;
          font-weight: 700;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.3s;
        }
        .progressBar.done {
          color: #9bb59a;
        }
        .progressIcon {
          font-size: 14px;
        }
        .progressText {
          flex: 1;
          animation: pulse 1s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ======== MOBILE ======== */
        @media (max-width: 768px) {
          .variant-full {
            grid-template-columns: 1fr;
          }
          .booster {
            padding: 18px;
          }
          .titleText {
            font-size: 14px;
          }
          .metricValue {
            font-size: 20px;
          }
        }
      `}</style>

      {/* 좌측/상단: 레버 */}
      <div className="boosterCol">
        <div
          className={`booster ${isAnimating ? 'animating' : ''} ${
            isApplied ? 'applied' : ''
          }`}
        >
          <div className="boosterHead">
            <div>
              <div className="boosterLabel">ALGO-MAGIC BOOSTER</div>
              <div className="boosterTitle">알고리즘 최적화 장치</div>
            </div>
            <div className={`statusLight ${isApplied ? 'applied' : ''}`} />
          </div>

          <div className="leverRow">
            <div
              className={`leverArea ${isApplied || isAnimating ? 'disabled' : ''}`}
              onClick={activateBooster}
            >
              <div className="leverBase" />
              <div className={`leverStick ${isApplied ? 'up' : ''}`}>
                <div className={`leverKnob ${isApplied ? 'applied' : ''}`} />
              </div>
              <div className="sparkles" ref={sparkleContainerRef} />
            </div>

            <div className="leverInfo">
              {!isAnimating && !isApplied && (
                <>
                  <div className="leverStatus">⚡ 레버를 올려 알고리즘 적용</div>
                  <div className="leverSub">
                    한 번 누르면 2026 최신 알고리즘이<br />
                    자동으로 영상에 적용됩니다
                  </div>
                </>
              )}
              {isApplied && (
                <>
                  <div className="leverStatus applied">✅ 알고리즘 튜닝 완료</div>
                  <div className="leverSub">
                    영상이 최적화되었습니다.<br />
                    조회수 상승을 기대해보세요.
                  </div>
                </>
              )}
            </div>
          </div>

          {isAnimating && (
            <div className="progressBar">
              <span className="progressIcon">{currentMessage.icon}</span>
              <span className="progressText">{currentMessage.text}</span>
            </div>
          )}
          {isApplied && (
            <div className="progressBar done">
              <span className="progressIcon">✅</span>
              <span>알고리즘 튜닝 완료 · 영상 준비됨</span>
            </div>
          )}
        </div>
      </div>

      {/* 우측: 데이터 패널 (full variant 만) */}
      <div className="dataPanel">
        <div className="titleBox">
          <div className="titleLabel">최적화된 제목</div>
          <div className={`titleText ${isAnimating ? 'animating' : ''}`}>
            {currentData.title}
          </div>
        </div>

        <div className="metrics">
          <div className={`metricCard ${isApplied ? 'success' : ''}`}>
            <div className="metricLabel">조회수 등급</div>
            <div className="metricValue">{currentData.grade}</div>
          </div>
          <div className={`metricCard ${isApplied ? 'success' : ''}`}>
            <div className="metricLabel">유지율 예상</div>
            <div className="metricValue">{currentData.retention}%</div>
          </div>
          <div className={`metricCard ${isApplied ? 'success' : ''}`}>
            <div className="metricLabel">CTR 예상</div>
            <div className="metricValue">{currentData.ctr}%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
