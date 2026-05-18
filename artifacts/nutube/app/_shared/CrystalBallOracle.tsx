'use client';
/**
 * CrystalBallOracle - 압도적 신비감의 예측 구슬볼
 *
 * 박예준 확정:
 * ✅ 슬롯/타로 다 빼고 구슬볼 하나로 압축
 * ✅ 압도적 신비감
 * ✅ 사운드 효과 (Mute 가능)
 *
 * 작동 시퀀스 (8초 드라마):
 * 0.0초: 어두운 배경에 별빛 등장
 * 1.5초: 구슬볼 페이드인 (안개와 함께)
 * 3.0초: 안개가 빠르게 휘몰아침
 * 4.5초: 빛이 폭발하며 결과 공개
 * 6.0초: Oracle 예언 타이핑
 * 8.0초: 완료 → 알고리즘 서명
 */

import { useState, useEffect } from 'react';
import { useSoundManager } from './SoundManager';

interface CrystalBallProps {
  category?: string;
  keyword?: string;
  title?: string;
}

const ORACLE_PROPHECIES = [
  '별들이 말합니다... 이 영상은 오후 7시 37분에 업로드될 운명입니다.',
  '고대의 패턴이 감지되었습니다. 제목의 첫 단어가 열쇠입니다.',
  '구슬이 속삭입니다... 20-30대의 반응이 특히 높을 것입니다.',
  '운명의 바람이 당신의 영상을 선택했습니다.',
  '미래의 시청자들이 이미 이 영상을 기다리고 있습니다.',
  'Oracle이 봅니다... 48시간 내 트렌드 상승 징조가 보입니다.',
  '숫자들이 춤을 춥니다. 당신은 황금 비율을 발견했습니다.',
  '비밀의 매트릭스가 열렸습니다. 당신만이 볼 수 있습니다.',
  '안개가 걷히며 길이 보입니다. 당신은 정확한 선택을 했습니다.',
  '천 개의 별이 당신의 영상을 비춥니다.',
];

export default function CrystalBallOracle({ category = 'economy', keyword = '키워드', title = '' }: CrystalBallProps) {
  const { playSound } = useSoundManager();

  // 상태 관리
  const [stage, setStage] = useState<'awakening' | 'gathering' | 'swirling' | 'revealing' | 'prophesying' | 'complete'>('awakening');
  const [animatedBoost, setAnimatedBoost] = useState(0);
  const [prophecyText, setProphecyText] = useState('');
  const [selectedProphecy] = useState(ORACLE_PROPHECIES[Math.floor(Math.random() * ORACLE_PROPHECIES.length)]);
  const [hash] = useState(() => 
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('').toUpperCase()
  );

  // 타겟 결과
  const targetBoost = 280;

  // 시퀀스 진행
  useEffect(() => {
    // 0초 - 깨어남 (별빛 등장)
    
    // 1.5초 - 모이기 (구슬볼 페이드인)
    const t1 = setTimeout(() => {
      setStage('gathering');
      playSound('glow');
    }, 1500);

    // 3초 - 휘몰아치기
    const t2 = setTimeout(() => {
      setStage('swirling');
      playSound('whisper');
    }, 3000);

    // 4.5초 - 공개 (빛 폭발 + 숫자 카운트)
    const t3 = setTimeout(() => {
      setStage('revealing');
      playSound('explosion');
      
      // 숫자 카운트 애니메이션
      const duration = 1500;
      const steps = 60;
      const increment = targetBoost / steps;
      let current = 0;
      let stepCount = 0;

      const counter = setInterval(() => {
        current += increment;
        stepCount += 1;
        if (stepCount >= steps) {
          setAnimatedBoost(targetBoost);
          clearInterval(counter);
          playSound('reveal');
        } else {
          setAnimatedBoost(Math.floor(current));
        }
      }, duration / steps);
    }, 4500);

    // 6.5초 - 예언 타이핑
    const t4 = setTimeout(() => {
      setStage('prophesying');
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= selectedProphecy.length) {
          setProphecyText(selectedProphecy.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => {
            setStage('complete');
            playSound('whisper');
          }, 800);
        }
      }, 50);
    }, 6500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [selectedProphecy, playSound]);

  return (
    <div className="oracleRoom">
      {/* ============ 배경 별빛 ============ */}
      <div className="cosmicBg">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* ============ 코너 장식 ============ */}
      <div className="cornerOrnament topLeft">❦</div>
      <div className="cornerOrnament topRight">❦</div>
      <div className="cornerOrnament bottomLeft">❦</div>
      <div className="cornerOrnament bottomRight">❦</div>

      {/* ============ 헤더 ============ */}
      <div className="oracleHeader">
        <div className="headerKicker">⚠️ ALGORITHM ENGAGED ⚠️</div>
        <div className="headerTitle">베일 너머의 알고리즘이 작동합니다</div>
      </div>

      {/* ============ 메인 구슬볼 ============ */}
      <div className={`crystalContainer ${stage}`}>
        {/* 구슬볼 받침대 */}
        <div className="ballStand" />

        {/* 구슬볼 본체 */}
        <div className="crystalBall">
          {/* 외곽 글로우 */}
          <div className="outerGlow" />
          
          {/* 빛 광선 (revealing 단계) */}
          {(stage === 'revealing' || stage === 'prophesying' || stage === 'complete') && (
            <div className="lightRays">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="lightRay"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                />
              ))}
            </div>
          )}

          {/* 안개 효과 */}
          <div className="mistContainer">
            <div className="mist mist1" />
            <div className="mist mist2" />
            <div className="mist mist3" />
          </div>

          {/* 회전하는 별빛들 (gathering 이후) */}
          {(stage === 'gathering' || stage === 'swirling') && (
            <div className="orbitingStars">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="orbitStar"
                  style={{ 
                    transform: `rotate(${i * 45}deg) translateY(-110px)`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* 구슬 안 컨텐츠 */}
          <div className="ballContent">
            {/* awakening 단계 */}
            {stage === 'awakening' && (
              <div className="contentDim">
                <div className="awakenDot" />
              </div>
            )}

            {/* gathering / swirling */}
            {(stage === 'gathering' || stage === 'swirling') && (
              <div className="contentDim">
                <div className="vortex" />
                <div className="gatheringText">
                  {stage === 'gathering' && '안개가 모이고 있습니다...'}
                  {stage === 'swirling' && '운명이 형태를 갖춥니다...'}
                </div>
              </div>
            )}

            {/* revealing 이후 */}
            {(stage === 'revealing' || stage === 'prophesying' || stage === 'complete') && (
              <div className="resultContent">
                <div className="boostLabel">VIRAL BOOST</div>
                <div className="boostValue">+{animatedBoost}<span className="boostPercent">%</span></div>
                <div className="boostSubtext">예상 조회수 부스팅</div>
              </div>
            )}
          </div>

          {/* 구슬 표면 하이라이트 */}
          <div className="ballHighlight" />
          <div className="ballReflection" />
        </div>
      </div>

      {/* ============ 예언 메시지 ============ */}
      {(stage === 'prophesying' || stage === 'complete') && (
        <div className="prophecyBox">
          <div className="prophecyOrnament">❦</div>
          <div className="prophecyContent">
            <div className="prophecyLabel">ORACLE'S WHISPER</div>
            <div className="prophecyText">
              "{prophecyText}
              {stage === 'prophesying' && <span className="cursor">|</span>}"
            </div>
          </div>
          <div className="prophecyOrnament">❦</div>
        </div>
      )}

      {/* ============ 알고리즘 서명 ============ */}
      {stage === 'complete' && (
        <div className="signatureBox">
          <div className="sigDecorationLeft">— ✦ —</div>
          <div className="sigContent">
            <div className="sigLabel">Algorithm Signature</div>
            <div className="sigHash">0x{hash.slice(0, 8)}...{hash.slice(8, 12)}</div>
            <div className="sigMeta">
              <span>PATENT PENDING</span>
              <span className="sigDot">·</span>
              <span>CLASSIFIED</span>
              <span className="sigDot">·</span>
              <span>v3.2.1</span>
            </div>
          </div>
          <div className="sigDecorationRight">— ✦ —</div>
        </div>
      )}

      <style jsx>{`
        /* ============================================================
           ORACLE ROOM
           ============================================================ */
        .oracleRoom {
          position: relative;
          background: 
            radial-gradient(ellipse at center, #2a1f4d 0%, #1a1230 40%, #0a0518 100%);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 24px;
          padding: 48px 32px 40px;
          margin-bottom: 28px;
          overflow: hidden;
          font-family: Pretendard, system-ui, sans-serif;
          color: #f5f1ea;
          min-height: 720px;
          user-select: none;
          box-shadow: 
            0 0 60px rgba(138, 43, 226, 0.15),
            inset 0 0 60px rgba(0, 0, 0, 0.3);
        }

        /* 별빛 배경 */
        .cosmicBg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: #ffd700;
          border-radius: 50%;
          box-shadow: 0 0 4px #ffd700;
          animation: starTwinkle ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }

        /* 코너 장식 */
        .cornerOrnament {
          position: absolute;
          font-size: 24px;
          color: #ffd700;
          opacity: 0.4;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
          pointer-events: none;
          z-index: 2;
        }
        .topLeft { top: 16px; left: 16px; }
        .topRight { top: 16px; right: 16px; }
        .bottomLeft { bottom: 16px; left: 16px; }
        .bottomRight { bottom: 16px; right: 16px; }

        /* ============================================================
           HEADER
           ============================================================ */
        .oracleHeader {
          position: relative;
          text-align: center;
          margin-bottom: 32px;
          z-index: 2;
        }
        .headerKicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.4em;
          color: #ffd700;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeIn 1s ease-out 0.3s forwards;
        }
        .headerTitle {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 22px;
          font-weight: 600;
          font-style: italic;
          letter-spacing: -0.005em;
          color: rgba(245, 241, 234, 0.85);
          opacity: 0;
          animation: fadeIn 1s ease-out 0.6s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        /* ============================================================
           CRYSTAL BALL
           ============================================================ */
        .crystalContainer {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 0 50px;
          z-index: 2;
        }

        .ballStand {
          position: absolute;
          bottom: 30px;
          width: 200px;
          height: 24px;
          background: linear-gradient(180deg, 
            #3d2914 0%, 
            #2a1c0d 50%,
            #1a1208 100%
          );
          border-radius: 50%;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.5),
            inset 0 -2px 4px rgba(255, 215, 0, 0.2),
            inset 0 2px 4px rgba(255, 215, 0, 0.1);
          z-index: 1;
        }
        .ballStand::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 10%;
          right: 10%;
          height: 8px;
          background: linear-gradient(180deg, rgba(255, 215, 0, 0.3), transparent);
          border-radius: 50%;
        }

        .crystalBall {
          position: relative;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          margin-bottom: 30px;
          opacity: 0;
          animation: ballAppear 1.5s ease-out 0.8s forwards;
          background: 
            radial-gradient(circle at 30% 30%, 
              rgba(255, 215, 0, 0.3) 0%,
              rgba(138, 43, 226, 0.4) 30%,
              rgba(75, 0, 130, 0.5) 60%,
              rgba(20, 10, 40, 0.7) 100%
            );
          box-shadow: 
            0 0 80px rgba(255, 215, 0, 0.3),
            0 0 160px rgba(138, 43, 226, 0.2),
            inset 0 0 80px rgba(255, 215, 0, 0.1),
            inset -40px -40px 80px rgba(0, 0, 0, 0.5);
          z-index: 2;
        }
        @keyframes ballAppear {
          0% {
            opacity: 0;
            transform: scale(0.5);
            filter: blur(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }

        /* swirling 단계에서 살짝 떨림 */
        .crystalContainer.swirling .crystalBall {
          animation: ballAppear 1.5s ease-out 0.8s forwards, 
                     ballShake 0.3s ease-in-out infinite;
        }
        @keyframes ballShake {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(-2px) translateY(-1px); }
          50% { transform: translateX(2px) translateY(1px); }
          75% { transform: translateX(-1px) translateY(2px); }
        }

        /* revealing - 빛 폭발 */
        .crystalContainer.revealing .crystalBall {
          animation: ballAppear 1.5s ease-out 0.8s forwards, 
                     ballPulse 1s ease-out;
        }
        @keyframes ballPulse {
          0% { 
            box-shadow: 
              0 0 80px rgba(255, 215, 0, 0.3),
              0 0 160px rgba(138, 43, 226, 0.2),
              inset 0 0 80px rgba(255, 215, 0, 0.1),
              inset -40px -40px 80px rgba(0, 0, 0, 0.5);
          }
          50% {
            box-shadow: 
              0 0 200px rgba(255, 215, 0, 1),
              0 0 400px rgba(255, 215, 0, 0.6),
              inset 0 0 100px rgba(255, 215, 0, 0.5),
              inset -40px -40px 80px rgba(0, 0, 0, 0.5);
          }
          100% {
            box-shadow: 
              0 0 120px rgba(255, 215, 0, 0.5),
              0 0 240px rgba(255, 215, 0, 0.3),
              inset 0 0 80px rgba(255, 215, 0, 0.2),
              inset -40px -40px 80px rgba(0, 0, 0, 0.5);
          }
        }

        /* 외곽 글로우 */
        .outerGlow {
          position: absolute;
          inset: -20px;
          border-radius: 50%;
          background: radial-gradient(circle, 
            rgba(255, 215, 0, 0.15) 0%, 
            transparent 70%
          );
          animation: glowPulse 4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        /* 빛 광선 */
        .lightRays {
          position: absolute;
          inset: -100px;
          pointer-events: none;
          animation: raysSpin 20s linear infinite;
        }
        @keyframes raysSpin {
          to { transform: rotate(360deg); }
        }
        .lightRay {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 2px;
          height: 240px;
          background: linear-gradient(180deg, 
            rgba(255, 215, 0, 0.6) 0%, 
            transparent 100%
          );
          transform-origin: top center;
          margin-left: -1px;
          opacity: 0;
          animation: rayFade 3s ease-out forwards;
        }
        @keyframes rayFade {
          0% { opacity: 0; height: 0; }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; height: 240px; }
        }

        /* 안개 효과 */
        .mistContainer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          pointer-events: none;
        }
        .mist {
          position: absolute;
          width: 200%;
          height: 200%;
          left: -50%;
          top: -50%;
          background: radial-gradient(circle at center, 
            rgba(255, 255, 255, 0.15) 0%, 
            transparent 50%
          );
          animation: mistRotate 20s linear infinite;
          opacity: 0.5;
        }
        .mist1 { animation-duration: 15s; }
        .mist2 { 
          animation-duration: 22s; 
          animation-direction: reverse;
          background: radial-gradient(circle at 70% 30%, 
            rgba(186, 85, 211, 0.3) 0%, 
            transparent 60%
          );
        }
        .mist3 { 
          animation-duration: 30s;
          background: radial-gradient(circle at 30% 70%, 
            rgba(255, 215, 0, 0.2) 0%, 
            transparent 60%
          );
        }
        @keyframes mistRotate {
          to { transform: rotate(360deg); }
        }

        /* swirling 단계 - 안개 빠르게 */
        .crystalContainer.swirling .mist1 { animation-duration: 4s; }
        .crystalContainer.swirling .mist2 { animation-duration: 6s; }
        .crystalContainer.swirling .mist3 { animation-duration: 8s; }

        /* 회전하는 별 */
        .orbitingStars {
          position: absolute;
          inset: 0;
          pointer-events: none;
          animation: orbitSpin 8s linear infinite;
        }
        @keyframes orbitSpin {
          to { transform: rotate(360deg); }
        }
        .orbitStar {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 4px;
          height: 4px;
          background: #ffd700;
          border-radius: 50%;
          box-shadow: 0 0 8px #ffd700;
          animation: orbitTwinkle 1.5s ease-in-out infinite;
        }
        @keyframes orbitTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        /* 구슬 표면 하이라이트 */
        .ballHighlight {
          position: absolute;
          top: 12%;
          left: 18%;
          width: 30%;
          height: 25%;
          background: radial-gradient(ellipse, 
            rgba(255, 255, 255, 0.4) 0%, 
            transparent 60%
          );
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
        }
        .ballReflection {
          position: absolute;
          bottom: 10%;
          right: 15%;
          width: 20%;
          height: 15%;
          background: radial-gradient(ellipse, 
            rgba(186, 85, 211, 0.3) 0%, 
            transparent 70%
          );
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
        }

        /* ============================================================
           BALL CONTENT
           ============================================================ */
        .ballContent {
          position: absolute;
          inset: 20%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 4;
        }

        .contentDim {
          text-align: center;
          color: rgba(245, 241, 234, 0.6);
        }

        .awakenDot {
          width: 8px;
          height: 8px;
          background: #ffd700;
          border-radius: 50%;
          margin: 0 auto;
          box-shadow: 0 0 16px #ffd700;
          animation: awakenPulse 2s ease-in-out infinite;
        }
        @keyframes awakenPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        .vortex {
          width: 60px;
          height: 60px;
          margin: 0 auto 12px;
          border: 2px solid transparent;
          border-top-color: #ffd700;
          border-right-color: #ff0080;
          border-radius: 50%;
          animation: vortexSpin 1.2s linear infinite;
        }
        @keyframes vortexSpin {
          to { transform: rotate(360deg); }
        }

        .gatheringText {
          font-family: 'Georgia', serif;
          font-size: 13px;
          font-style: italic;
          color: rgba(255, 215, 0, 0.7);
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
        }

        .resultContent {
          text-align: center;
          animation: resultAppear 0.6s ease-out;
        }
        @keyframes resultAppear {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }

        .boostLabel {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
          margin-bottom: 6px;
        }

        .boostValue {
          font-family: 'Georgia', serif;
          font-size: 56px;
          font-weight: 800;
          color: #ffd700;
          text-shadow: 
            0 0 20px rgba(255, 215, 0, 0.8),
            0 0 40px rgba(255, 215, 0, 0.4);
          letter-spacing: -0.03em;
          line-height: 1;
        }

        .boostPercent {
          font-size: 36px;
          margin-left: 4px;
        }

        .boostSubtext {
          margin-top: 8px;
          font-size: 11px;
          color: rgba(245, 241, 234, 0.6);
          letter-spacing: 0.15em;
        }

        /* ============================================================
           PROPHECY
           ============================================================ */
        .prophecyBox {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 24px 32px;
          background: 
            linear-gradient(135deg, 
              rgba(255, 215, 0, 0.06) 0%, 
              rgba(186, 85, 211, 0.06) 100%
            );
          border: 1px solid rgba(255, 215, 0, 0.25);
          border-radius: 12px;
          margin: 24px 0;
          z-index: 2;
          backdrop-filter: blur(8px);
          animation: prophecyAppear 0.8s ease-out;
        }
        @keyframes prophecyAppear {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .prophecyOrnament {
          font-size: 22px;
          color: #ffd700;
          opacity: 0.6;
          flex-shrink: 0;
          line-height: 1;
        }
        .prophecyContent {
          flex: 1;
          text-align: center;
        }
        .prophecyLabel {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: #ffd700;
          margin-bottom: 10px;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }
        .prophecyText {
          font-family: 'Georgia', 'Times New Roman', serif;
          font-size: 17px;
          font-style: italic;
          line-height: 1.6;
          color: rgba(245, 241, 234, 0.9);
          min-height: 54px;
        }
        .cursor {
          display: inline-block;
          animation: blink 0.8s ease-in-out infinite;
          color: #ffd700;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        /* ============================================================
           SIGNATURE
           ============================================================ */
        .signatureBox {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 16px 20px;
          z-index: 2;
          animation: sigAppear 1s ease-out;
        }
        @keyframes sigAppear {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sigDecorationLeft, .sigDecorationRight {
          color: rgba(255, 215, 0, 0.4);
          font-size: 14px;
          letter-spacing: 0.1em;
        }
        .sigContent {
          text-align: center;
        }
        .sigLabel {
          font-family: 'Georgia', serif;
          font-size: 11px;
          font-style: italic;
          color: rgba(255, 215, 0, 0.7);
          margin-bottom: 6px;
          letter-spacing: 0.05em;
        }
        .sigHash {
          font-family: 'SF Mono', Monaco, 'Courier New', monospace;
          font-size: 12px;
          color: rgba(245, 241, 234, 0.5);
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .sigMeta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: rgba(245, 241, 234, 0.4);
        }
        .sigDot {
          color: rgba(255, 215, 0, 0.3);
        }

        /* ============================================================
           반응형
           ============================================================ */
        @media (max-width: 720px) {
          .oracleRoom {
            padding: 32px 16px;
            min-height: 600px;
          }
          .headerTitle {
            font-size: 18px;
          }
          .crystalBall {
            width: 220px;
            height: 220px;
          }
          .ballStand {
            width: 160px;
          }
          .boostValue {
            font-size: 44px;
          }
          .boostPercent {
            font-size: 28px;
          }
          .prophecyText {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
