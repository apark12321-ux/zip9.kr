'use client';
/**
 * OracleStatusBar - 전역 Oracle 상태 바
 *
 * 박예준 요청사항:
 * ✅ 모든 페이지에 알고리즘 작동 휘기
 * ✅ 라스베가스 카지노 네온 느낌
 * ✅ 고급스럽게 (너무 과하지 않게)
 */

import { useEffect, useState } from 'react';

export default function OracleStatusBar() {
  const [signals, setSignals] = useState(3247);
  const [pulse, setPulse] = useState(0);
  const [currentMsg, setCurrentMsg] = useState(0);

  // 신호 숫자가 살짝씩 증가 (실시간 느낌)
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) => prev + Math.floor(Math.random() * 3 + 1));
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  // 펄스 카운터
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // 랜덤 Oracle 메시지 (5초마다 교체)
  const messages = [
    'ORACLE ACTIVE',
    'SCANNING TRENDS',
    'NEURAL ENGINE ON',
    'PATTERNS DETECTED',
    'ANALYZING MARKET',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsg((m) => (m + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="oracleBar">
      <div className="oracleBarInner">
        <div className="oracleLeft">
          <div className="oraclePulse" />
          <span className="oracleStatus">◆ {messages[currentMsg]}</span>
        </div>

        <div className="oracleCenter">
          <span className="oracleSignalLabel">SIGNALS</span>
          <span className="oracleSignalNum">{signals.toLocaleString()}</span>
          <span className="oracleDivider">│</span>
          <span className="oracleVersion">v3.2.1</span>
        </div>

        <div className="oracleRight">
          <span className="oracleStars">✦ ✧ ✦</span>
        </div>
      </div>

      <style jsx>{`
        .oracleBar {
          position: relative;
          width: 100%;
          background: linear-gradient(90deg, 
            #1a1625 0%, 
            #2a1f35 50%, 
            #1a1625 100%
          );
          border-bottom: 1px solid rgba(255, 215, 0, 0.15);
          overflow: hidden;
          font-family: 'SF Mono', Monaco, 'Courier New', monospace;
          z-index: 100;
        }

        /* 네온 글로우 효과 - 위쪽 */
        .oracleBar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 215, 0, 0.5) 20%,
            rgba(255, 215, 0, 0.8) 50%,
            rgba(255, 215, 0, 0.5) 80%,
            transparent 100%
          );
          animation: neonShimmer 4s ease-in-out infinite;
        }

        /* 움직이는 스캔라인 */
        .oracleBar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 40%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 215, 0, 0.03),
            transparent
          );
          animation: scanline 6s linear infinite;
        }

        @keyframes neonShimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        @keyframes scanline {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }

        .oracleBarInner {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1400px;
          margin: 0 auto;
          padding: 7px 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          z-index: 1;
        }

        .oracleLeft, .oracleCenter, .oracleRight {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .oraclePulse {
          width: 8px;
          height: 8px;
          background: #ffd700;
          border-radius: 50%;
          box-shadow: 0 0 8px #ffd700, 0 0 16px rgba(255, 215, 0, 0.5);
          animation: oraclePulse 1.5s ease-in-out infinite;
        }

        @keyframes oraclePulse {
          0%, 100% { 
            opacity: 1;
            box-shadow: 0 0 8px #ffd700, 0 0 16px rgba(255, 215, 0, 0.5);
          }
          50% { 
            opacity: 0.6;
            box-shadow: 0 0 12px #ffd700, 0 0 24px rgba(255, 215, 0, 0.8);
          }
        }

        .oracleStatus {
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
          font-size: 10.5px;
        }

        .oracleSignalLabel {
          color: rgba(245, 241, 234, 0.5);
          font-size: 10px;
        }

        .oracleSignalNum {
          color: #f5f1ea;
          font-weight: 800;
          font-size: 12px;
          text-shadow: 0 0 4px rgba(245, 241, 234, 0.3);
        }

        .oracleDivider {
          color: rgba(255, 215, 0, 0.3);
        }

        .oracleVersion {
          color: rgba(245, 241, 234, 0.4);
          font-size: 10px;
        }

        .oracleStars {
          color: #ffd700;
          font-size: 12px;
          letter-spacing: 0.3em;
          opacity: 0.7;
          animation: starsTwinkle 3s ease-in-out infinite;
        }

        @keyframes starsTwinkle {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }

        @media (max-width: 600px) {
          .oracleBarInner {
            padding: 6px 12px;
            font-size: 10px;
          }
          .oracleCenter {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
