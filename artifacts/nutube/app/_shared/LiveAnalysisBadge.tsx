'use client';
/**
 * LiveAnalysisBadge - 페이지 상단 "지금 작동 중" 표시
 *
 * 박예준 비전:
 * ✅ 모든 페이지에 알고리즘이 진짜 작동하는 것처럼
 * ✅ 살짝 살짝 움직이는 데이터로 "라이브" 느낌
 * ✅ 텍스트가 아닌 시각적으로
 *
 * 사용:
 *   <LiveAnalysisBadge stage="키워드 해독 중" />
 */

import { useState, useEffect } from 'react';

interface LiveAnalysisBadgeProps {
  stage?: string;        // 현재 페이지 단계 (예: "키워드 해독", "시나리오 매칭")
  signals?: number;      // 시작 신호 수
  showDetails?: boolean; // 상세 통계 표시 여부
}

export default function LiveAnalysisBadge({
  stage = "알고리즘 작동 중",
  signals: initialSignals = 3247,
  showDetails = true,
}: LiveAnalysisBadgeProps) {
  const [signals, setSignals] = useState(initialSignals);
  const [matches, setMatches] = useState(15847);
  const [score, setScore] = useState(87);
  const [activity, setActivity] = useState(0);

  // 살짝씩 변동
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev + Math.floor(Math.random() * 5 + 1));
      setMatches(prev => prev + Math.floor(Math.random() * 8 + 2));
      setScore(prev => Math.min(99, prev + (Math.random() > 0.5 ? 1 : -1)));
      setActivity(prev => (prev + 1) % 4);
    }, 2000 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="liveBadge">
      <div className="badgeInner">
        {/* 좌측: 펄스 점 + 스테이지 */}
        <div className="badgeLeft">
          <div className="pulseDot">
            <div className="pulseRing" />
          </div>
          <div className="stageInfo">
            <div className="stageLabel">NEURAL ENGINE</div>
            <div className="stageName">{stage}</div>
          </div>
        </div>

        {/* 우측: 실시간 통계 */}
        {showDetails && (
          <div className="badgeRight">
            <div className="statItem">
              <span className="statLabel">SIGNALS</span>
              <span className="statValue">{signals.toLocaleString()}</span>
            </div>
            <div className="statDivider" />
            <div className="statItem">
              <span className="statLabel">MATCH</span>
              <span className="statValue">{matches.toLocaleString()}</span>
            </div>
            <div className="statDivider" />
            <div className="statItem">
              <span className="statLabel">SCORE</span>
              <span className="statValue accent">{score}%</span>
            </div>
          </div>
        )}
      </div>

      {/* 배경 활동 바 */}
      <div className="activityTrack">
        <div className={`activityBar bar-${activity}`} />
      </div>

      <style jsx>{`
        .liveBadge {
          background: linear-gradient(135deg, 
            rgba(26, 18, 48, 0.92) 0%, 
            rgba(42, 31, 77, 0.92) 50%, 
            rgba(26, 18, 48, 0.92) 100%
          );
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 12px;
          padding: 0;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(8px);
        }

        .badgeInner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 18px;
          gap: 16px;
        }

        .badgeLeft {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .pulseDot {
          position: relative;
          width: 10px;
          height: 10px;
          flex-shrink: 0;
        }
        
        .pulseDot::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #ffd700;
          border-radius: 50%;
          box-shadow: 0 0 12px #ffd700;
          animation: dotPulse 1.5s ease-in-out infinite;
        }

        .pulseRing {
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(255, 215, 0, 0.5);
          border-radius: 50%;
          animation: ringExpand 2s ease-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.7; 
          }
        }

        @keyframes ringExpand {
          0% { 
            transform: scale(0.8); 
            opacity: 1; 
          }
          100% { 
            transform: scale(2); 
            opacity: 0; 
          }
        }

        .stageInfo {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .stageLabel {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.25em;
          color: rgba(255, 215, 0, 0.7);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .stageName {
          font-size: 13px;
          font-weight: 700;
          color: #f5f1ea;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badgeRight {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }

        .statItem {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .statLabel {
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: rgba(255, 215, 0, 0.5);
          font-family: 'SF Mono', Monaco, monospace;
        }

        .statValue {
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 13px;
          font-weight: 700;
          color: #f5f1ea;
          letter-spacing: 0.02em;
        }

        .statValue.accent {
          color: #ffd700;
          text-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
        }

        .statDivider {
          width: 1px;
          height: 20px;
          background: rgba(255, 215, 0, 0.15);
        }

        .activityTrack {
          position: relative;
          height: 2px;
          background: rgba(255, 215, 0, 0.08);
          overflow: hidden;
        }

        .activityBar {
          position: absolute;
          top: 0;
          height: 100%;
          width: 30%;
          background: linear-gradient(90deg, 
            transparent 0%, 
            #ffd700 30%, 
            #ff0080 70%, 
            transparent 100%
          );
          animation: barSlide 3s linear infinite;
        }

        @keyframes barSlide {
          0% { left: -30%; }
          100% { left: 100%; }
        }

        @media (max-width: 720px) {
          .badgeRight {
            display: none;
          }
          .badgeInner {
            padding: 10px 14px;
          }
          .stageName {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
