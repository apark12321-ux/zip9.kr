'use client';
/**
 * AlgorithmReveal - 페이지 전환 시 "알고리즘 작동" 풀스크린
 *
 * 박예준 확정:
 * ✅ 다음 버튼 클릭 시 풀스크린 로딩
 * ✅ 매트릭스 코드 마주 + 베일 걷히기
 * ✅ "말로만"이 아닌 진짜 알고리즘 작동 시각화
 *
 * 사용법:
 *   const [revealing, setRevealing] = useState(false);
 *   
 *   const handleNext = () => {
 *     setRevealing(true);
 *     setTimeout(() => router.push('/next-page'), 2800);
 *   };
 *   
 *   return (
 *     <>
 *       <AlgorithmReveal active={revealing} stage="키워드 해독" />
 *       ...
 *     </>
 *   );
 */

import { useEffect, useState } from 'react';

interface AlgorithmRevealProps {
  active: boolean;
  stage?: string;  // 현재 단계명 (예: "키워드 해독", "시나리오 분석")
  duration?: number;  // 기본 2800ms
}

// 알고리즘 작동 메시지 (랜덤)
const ANALYSIS_MESSAGES = [
  'Decoding signal patterns...',
  'Scanning 3,247 matches...',
  'Cross-referencing trends...',
  'Calculating viral probability...',
  'Optimizing for SNS algorithm...',
  'Analyzing target audience...',
  'Mapping competitive density...',
  'Computing engagement vectors...',
  'Detecting algorithmic patterns...',
  'Verifying neural signals...',
];

export default function AlgorithmReveal({ 
  active, 
  stage = "알고리즘 작동",
  duration = 2800,
}: AlgorithmRevealProps) {
  const [phase, setPhase] = useState<'enter' | 'analyzing' | 'complete' | 'exit'>('enter');
  const [currentMsg, setCurrentMsg] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setPhase('enter');
      setCurrentMsg(0);
      setProgress(0);
      return;
    }

    // 0~300ms: enter (페이드인)
    setPhase('enter');
    
    // 300ms: 분석 시작
    const t1 = setTimeout(() => setPhase('analyzing'), 300);
    
    // 메시지 빠르게 교체
    let msgInterval: NodeJS.Timeout;
    const t2 = setTimeout(() => {
      msgInterval = setInterval(() => {
        setCurrentMsg(prev => (prev + 1) % ANALYSIS_MESSAGES.length);
      }, 250);
    }, 300);
    
    // 진행바 빠르게 채움
    let progressInterval: NodeJS.Timeout;
    const t3 = setTimeout(() => {
      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
    }, 400);
    
    // duration - 600ms: 완료
    const t4 = setTimeout(() => {
      setPhase('complete');
      if (msgInterval) clearInterval(msgInterval);
      if (progressInterval) clearInterval(progressInterval);
      setProgress(100);
    }, duration - 600);
    
    // duration - 200ms: 퇴장
    const t5 = setTimeout(() => {
      setPhase('exit');
    }, duration - 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      if (msgInterval) clearInterval(msgInterval);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [active, duration]);

  if (!active) return null;

  return (
    <>
      <div 
        className={`reveal-overlay ${phase}`}
        aria-hidden="true"
      >
        {/* 매트릭스 코드 비 (배경) */}
        <div className="matrix-rain">
          {Array.from({ length: 25 }).map((_, i) => (
            <div 
              key={i} 
              className="matrix-column"
              style={{ 
                left: `${(i * 4)}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1.5 + Math.random() * 2}s`,
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <span key={j} style={{ animationDelay: `${j * 0.1}s` }}>
                  {Math.random() > 0.5 ? '0' : '1'}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="reveal-center">
          {/* 펄싱 링 */}
          <div className="pulse-rings">
            <div className="pulse-ring r1" />
            <div className="pulse-ring r2" />
            <div className="pulse-ring r3" />
          </div>

          {/* 메인 텍스트 */}
          <div className="reveal-stage">
            <div className="stage-badge">
              <span className="badge-dot" />
              <span>NEURAL ENGINE</span>
            </div>
            
            <div className="stage-title">
              {stage}
            </div>
            
            <div className="stage-subtitle">
              {phase === 'analyzing' && (
                <span className="msg-text">
                  {'> '}{ANALYSIS_MESSAGES[currentMsg]}
                </span>
              )}
              {phase === 'complete' && (
                <span className="complete-text">
                  ✓ ALGORITHM ENGAGED
                </span>
              )}
            </div>

            {/* 진행바 */}
            <div className="progress-track">
              <div 
                className="progress-bar" 
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 통계 */}
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-label">SIGNALS</span>
                <span className="stat-val">{Math.floor(3247 + progress * 12)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">MATCHES</span>
                <span className="stat-val">{Math.floor(progress * 158)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">SCORE</span>
                <span className="stat-val">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .reveal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: 
            radial-gradient(ellipse at center, rgba(42, 31, 77, 0.98) 0%, rgba(10, 5, 24, 1) 70%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          pointer-events: all;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .reveal-overlay.enter {
          opacity: 0;
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .reveal-overlay.analyzing,
        .reveal-overlay.complete {
          opacity: 1;
        }
        
        .reveal-overlay.exit {
          opacity: 0;
          transition: opacity 0.4s ease-in;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* 매트릭스 코드 비 */
        .matrix-rain {
          position: absolute;
          inset: 0;
          overflow: hidden;
          opacity: 0.3;
        }
        
        .matrix-column {
          position: absolute;
          top: -50%;
          font-family: 'SF Mono', Monaco, 'Courier New', monospace;
          font-size: 14px;
          color: #ffd700;
          line-height: 1.4;
          animation: matrixFall linear infinite;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
        }
        
        .matrix-column span {
          display: block;
          opacity: 0;
          animation: matrixGlow ease-in-out infinite;
          animation-duration: 2s;
        }
        
        @keyframes matrixFall {
          to { transform: translateY(150vh); }
        }
        
        @keyframes matrixGlow {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        /* 중앙 콘텐츠 */
        .reveal-center {
          position: relative;
          text-align: center;
          z-index: 2;
          padding: 40px;
        }

        /* 펄싱 링 */
        .pulse-rings {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: 400px;
          pointer-events: none;
        }
        
        .pulse-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 50%;
          animation: pulsate 2.5s ease-out infinite;
        }
        
        .r1 { animation-delay: 0s; }
        .r2 { animation-delay: 0.8s; }
        .r3 { animation-delay: 1.6s; }
        
        @keyframes pulsate {
          0% { 
            transform: scale(0.3); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1.5); 
            opacity: 0; 
          }
        }

        /* 스테이지 */
        .reveal-stage {
          position: relative;
          z-index: 3;
          color: #f5f1ea;
        }

        .stage-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.4);
          border-radius: 100px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: #ffd700;
          margin-bottom: 24px;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }
        
        .badge-dot {
          width: 8px;
          height: 8px;
          background: #ffd700;
          border-radius: 50%;
          box-shadow: 0 0 8px #ffd700;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        
        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .stage-title {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 48px;
          font-weight: 700;
          font-style: italic;
          letter-spacing: -0.025em;
          color: #ffd700;
          text-shadow: 
            0 0 20px rgba(255, 215, 0, 0.6),
            0 0 40px rgba(255, 215, 0, 0.3);
          margin-bottom: 20px;
          line-height: 1;
        }

        .stage-subtitle {
          font-family: 'SF Mono', Monaco, 'Courier New', monospace;
          font-size: 14px;
          color: rgba(245, 241, 234, 0.7);
          margin-bottom: 32px;
          height: 24px;
          letter-spacing: 0.05em;
        }
        
        .msg-text {
          color: #ff0080;
          text-shadow: 0 0 8px rgba(255, 0, 128, 0.5);
        }
        
        .complete-text {
          color: #5e7e5d;
          font-weight: 800;
          letter-spacing: 0.3em;
          text-shadow: 0 0 12px rgba(94, 126, 93, 0.6);
          animation: completeAppear 0.4s ease-out;
        }
        
        @keyframes completeAppear {
          0% { 
            transform: scale(0.8); 
            opacity: 0; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }

        /* 진행바 */
        .progress-track {
          width: 320px;
          max-width: 80vw;
          height: 3px;
          background: rgba(255, 215, 0, 0.1);
          border-radius: 999px;
          overflow: hidden;
          margin: 0 auto 28px;
          position: relative;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, 
            #4f46e5 0%, 
            #ffd700 50%, 
            #ff0080 100%
          );
          border-radius: 999px;
          transition: width 0.1s linear;
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
        }

        /* 통계 그리드 */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          max-width: 320px;
          margin: 0 auto;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .stat-label {
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: rgba(255, 215, 0, 0.5);
        }
        
        .stat-val {
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 20px;
          font-weight: 700;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
        }

        @media (max-width: 720px) {
          .stage-title {
            font-size: 32px;
          }
          .pulse-rings {
            width: 280px;
            height: 280px;
          }
          .stats-grid {
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
          }
          .stat-val {
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}
