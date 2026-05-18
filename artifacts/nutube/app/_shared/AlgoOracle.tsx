'use client';
/**
 * AlgoOracle - "라스베가스 카지노" 스타일 알고리즘 UI
 *
 * 박예준 확정:
 * ✅ 슬롯머신 돌리기 (드라마틱한 결과 공개)
 * ✅ 타로카드 뒤집기 (4개의 운명 카드)
 * ✅ 신탁 예언 (근대 신비로운 싱라운)
 * ✅ 라스베가스 네온 + 고급스럽게
 *
 * 작동 흐름:
 * 1. "Oracle is reading your destiny..." (로딩)
 * 2. 슬롯머신 3개 릴 스핀!
 * 3. 숫자 하나씩 멈춤 → JACKPOT!
 * 4. 파티클 쏟아짐
 * 5. 타로카드 4장 뒤집힘
 * 6. Oracle의 예언 메시지 타이핑
 * 7. 알고리즘 서명 표시
 */

import { useState, useEffect, useRef } from 'react';

interface OracleResult {
  boost_percentage: number;
  optimization_score: number;
  target_audience_match: number;
  algorithm_tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  patterns_found: number;
  algorithm_hash: string;
}

interface AlgoOracleProps {
  category?: string;
  keyword?: string;
  title?: string;
}

// 📜 Oracle 예언 메시지 (랜덤)
const ORACLE_PROPHECIES = [
  '별들이 말합니다... 이 영상은 오후 7시 37분에 업로드될 운명입니다.',
  '고대의 패턴이 감지되었습니다. 제목의 첫 단어가 열쇠입니다.',
  '알고리즘이 속삭입니다... 20-30대 여성의 반응이 특히 높을 것입니다.',
  '운명의 바람이 당신의 영상을 선택했습니다.',
  '미래의 시청자들이 이미 이 영상을 기다리고 있습니다.',
  'Oracle이 봅니다... 48시간 내 트렌드 상승 징조가 보입니다.',
  '숫자들이 춤을 춥니다. 당신은 황금 비율을 발견했습니다.',
  '비밀의 매트릭스가 열렸습니다. 당신만이 볼 수 있습니다.',
];

export default function AlgoOracle({ category = 'economy', keyword = '키워드', title = '' }: AlgoOracleProps) {
  const [stage, setStage] = useState<'loading' | 'spinning' | 'revealing' | 'cards' | 'prophecy' | 'complete'>('loading');
  const [result, setResult] = useState<OracleResult | null>(null);
  const [slotValues, setSlotValues] = useState([0, 0, 0]);
  const [slotSpinning, setSlotSpinning] = useState([true, true, true]);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false, false]);
  const [prophecyText, setProphecyText] = useState('');
  const [selectedProphecy] = useState(ORACLE_PROPHECIES[Math.floor(Math.random() * ORACLE_PROPHECIES.length)]);
  const [showParticles, setShowParticles] = useState(false);

  // 사운드 재생 (mute 기본)
  const [muted, setMuted] = useState(true);

  // 초기 로딩 → 슬롯머신 시작
  useEffect(() => {
    const timer = setTimeout(() => setStage('spinning'), 1500);
    return () => clearTimeout(timer);
  }, []);

  // 슬롯머신 스핀 → 결과 공개
  useEffect(() => {
    if (stage !== 'spinning') return;

    // 가짜 결과 (실제론 API 호출)
    const finalResult: OracleResult = {
      boost_percentage: 280,
      optimization_score: 87,
      target_audience_match: 85,
      algorithm_tier: 'GOLD',
      patterns_found: 3247,
      algorithm_hash: '0x3A7B9F2C',
    };

    // 슬롯 스핀 애니메이션 (숫자 빠르게 변경)
    const spinInterval = setInterval(() => {
      setSlotValues([
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]);
    }, 80);

    // 1.5초 후 첫번째 릴 멈춤
    const stop1 = setTimeout(() => {
      setSlotSpinning([false, true, true]);
      setSlotValues((prev) => [2, prev[1], prev[2]]);
    }, 1500);

    // 2.2초 후 두번째 릴 멈춤
    const stop2 = setTimeout(() => {
      setSlotSpinning([false, false, true]);
      setSlotValues((prev) => [2, 8, prev[2]]);
    }, 2200);

    // 2.9초 후 세번째 릴 멈춤 → JACKPOT!
    const stop3 = setTimeout(() => {
      setSlotSpinning([false, false, false]);
      setSlotValues([2, 8, 0]);
      clearInterval(spinInterval);
      setResult(finalResult);
      setShowParticles(true);
      setStage('revealing');
    }, 2900);

    // 4.5초 후 타로카드 페이즈
    const toCards = setTimeout(() => {
      setStage('cards');
      // 카드 하나씩 뒤집기
      setTimeout(() => setFlippedCards([true, false, false, false]), 200);
      setTimeout(() => setFlippedCards([true, true, false, false]), 600);
      setTimeout(() => setFlippedCards([true, true, true, false]), 1000);
      setTimeout(() => setFlippedCards([true, true, true, true]), 1400);
    }, 4500);

    // 7초 후 예언 페이즈
    const toProphecy = setTimeout(() => {
      setStage('prophecy');
    }, 6500);

    // 예언 타이핑 효과
    const typeTimer = setTimeout(() => {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= selectedProphecy.length) {
          setProphecyText(selectedProphecy.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setStage('complete'), 500);
        }
      }, 50);
    }, 7000);

    return () => {
      clearInterval(spinInterval);
      clearTimeout(stop1);
      clearTimeout(stop2);
      clearTimeout(stop3);
      clearTimeout(toCards);
      clearTimeout(toProphecy);
      clearTimeout(typeTimer);
    };
  }, [stage, selectedProphecy]);

  const tarotCards = [
    { symbol: '♥', title: 'AUDIENCE', value: result?.target_audience_match || 0, unit: '%', color: '#ff0080' },
    { symbol: '♦', title: 'TIER', value: result?.algorithm_tier || 'GOLD', unit: '', color: '#ffd700' },
    { symbol: '♣', title: 'PATTERNS', value: result?.patterns_found.toLocaleString() || '0', unit: '', color: '#5e7e5d' },
    { symbol: '♠', title: 'VIRAL', value: 'HIGH', unit: '', color: '#4f46e5' },
  ];

  return (
    <div className="oracleRoom">
      {/* 배경 네온 파티클 */}
      <div className="neonBg">
        <div className="neonOrb orb1" />
        <div className="neonOrb orb2" />
        <div className="neonOrb orb3" />
      </div>

      {/* 헤더 */}
      <div className="oracleHeader">
        <div className="oracleBrand">
          <span className="oracleOrnament">❦</span>
          <div className="oracleTitleText">
            <div className="oracleKicker">✦ THE ALGORITHM ORACLE ✦</div>
            <div className="oracleMainTitle">당신의 영상의 운명이 드러납니다</div>
          </div>
          <span className="oracleOrnament">❦</span>
        </div>
      </div>

      {/* LOADING */}
      {stage === 'loading' && (
        <div className="loadingBox">
          <div className="loadingSpinner" />
          <div className="loadingText">Oracle is reading your destiny...</div>
          <div className="loadingSubtext">신탁이 당신의 운명을 읽고 있습니다</div>
        </div>
      )}

      {/* SLOT MACHINE */}
      {(stage === 'spinning' || stage === 'revealing') && (
        <div className="slotMachine">
          <div className="slotFrame">
            <div className="slotTopGlow" />
            <div className="slotLabel">★ PROJECTED BOOST ★</div>
            <div className="slotReels">
              <div className="slotReelWrap">
                <div className={`slotReel ${slotSpinning[0] ? 'spinning' : ''}`}>
                  <span>{slotValues[0]}</span>
                </div>
              </div>
              <div className="slotReelWrap">
                <div className={`slotReel ${slotSpinning[1] ? 'spinning' : ''}`}>
                  <span>{slotValues[1]}</span>
                </div>
              </div>
              <div className="slotReelWrap">
                <div className={`slotReel ${slotSpinning[2] ? 'spinning' : ''}`}>
                  <span>{slotValues[2]}</span>
                </div>
              </div>
              <div className="slotPercent">%</div>
            </div>

            {stage === 'revealing' && (
              <>
                <div className="jackpotText">JACKPOT!</div>
                <div className="jackpotSub">+280% VIRAL POWER</div>
              </>
            )}
          </div>

          {/* 파티클 */}
          {showParticles && (
            <div className="particles">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    left: `${50 + (Math.random() - 0.5) * 100}%`,
                    animationDelay: `${i * 0.05}s`,
                    background: ['#ffd700', '#ff0080', '#4f46e5'][i % 3],
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAROT CARDS */}
      {(stage === 'cards' || stage === 'prophecy' || stage === 'complete') && result && (
        <div className="tarotRow">
          {tarotCards.map((card, i) => (
            <div key={i} className={`tarotCard ${flippedCards[i] ? 'flipped' : ''}`}>
              <div className="tarotBack">
                <span className="tarotBackSymbol">✦</span>
              </div>
              <div className="tarotFront" style={{ borderColor: card.color + '60' }}>
                <div className="tarotSymbol" style={{ color: card.color }}>{card.symbol}</div>
                <div className="tarotTitle">{card.title}</div>
                <div className="tarotValue" style={{ color: card.color }}>
                  {card.value}{card.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PROPHECY MESSAGE */}
      {(stage === 'prophecy' || stage === 'complete') && (
        <div className="prophecyBox">
          <div className="prophecyOrnamentLeft">❦</div>
          <div className="prophecyContent">
            <div className="prophecyLabel">ORACLE'S WHISPER</div>
            <div className="prophecyText">
              "{prophecyText}
              {stage === 'prophecy' && <span className="cursor">|</span>}"
            </div>
          </div>
          <div className="prophecyOrnamentRight">❦</div>
        </div>
      )}

      {/* ALGORITHM SIGNATURE */}
      {stage === 'complete' && result && (
        <div className="signatureBox">
          <div className="signatureLine">
            <span className="sigLabel">✦ Algorithm Signature ✦</span>
          </div>
          <div className="sigValue">{result.algorithm_hash}...{Math.random().toString(36).substring(2, 8).toUpperCase()}</div>
          <div className="sigMeta">
            <span>PATENT PENDING</span>
            <span className="sigDot">·</span>
            <span>CLASSIFIED</span>
            <span className="sigDot">·</span>
            <span>v3.2.1</span>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ============================================================
           ORACLE ROOM (베가스 카지노 분위기)
           ============================================================ */
        .oracleRoom {
          position: relative;
          background: linear-gradient(135deg, #1a1625 0%, #2a1f35 50%, #1a1625 100%);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 20px;
          padding: 40px 32px;
          margin-bottom: 28px;
          overflow: hidden;
          font-family: Pretendard, system-ui, sans-serif;
          color: #f5f1ea;
          min-height: 500px;
          user-select: none;
        }

        /* 네온 배경 오브 */
        .neonBg {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .neonOrb {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
        }
        .orb1 {
          background: #ffd700;
          top: -100px;
          left: -100px;
          animation: floatOrb 12s ease-in-out infinite;
        }
        .orb2 {
          background: #ff0080;
          bottom: -150px;
          right: -100px;
          animation: floatOrb 15s ease-in-out infinite reverse;
        }
        .orb3 {
          background: #4f46e5;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: floatOrb 18s ease-in-out infinite;
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -30px) scale(1.1); }
          66% { transform: translate(-30px, 40px) scale(0.9); }
        }

        /* ============================================================
           HEADER
           ============================================================ */
        .oracleHeader {
          position: relative;
          text-align: center;
          margin-bottom: 32px;
          z-index: 2;
        }
        .oracleBrand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
        }
        .oracleOrnament {
          font-size: 28px;
          color: #ffd700;
          text-shadow: 0 0 12px rgba(255, 215, 0, 0.6);
          opacity: 0.8;
        }
        .oracleTitleText {
          flex: 1;
          max-width: 500px;
        }
        .oracleKicker {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
          margin-bottom: 8px;
        }
        .oracleMainTitle {
          font-family: 'Georgia', 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #f5f1ea;
          font-style: italic;
        }

        /* ============================================================
           LOADING
           ============================================================ */
        .loadingBox {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          z-index: 2;
        }
        .loadingSpinner {
          width: 60px;
          height: 60px;
          border: 3px solid rgba(255, 215, 0, 0.1);
          border-top-color: #ffd700;
          border-right-color: #ff0080;
          border-radius: 50%;
          animation: spin 1.2s linear infinite;
          margin-bottom: 24px;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loadingText {
          font-family: 'Georgia', serif;
          font-size: 18px;
          font-style: italic;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
          margin-bottom: 8px;
        }
        .loadingSubtext {
          font-size: 13px;
          color: rgba(245, 241, 234, 0.5);
          letter-spacing: 0.05em;
        }

        /* ============================================================
           SLOT MACHINE
           ============================================================ */
        .slotMachine {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px 0 40px;
          z-index: 2;
        }
        .slotFrame {
          position: relative;
          background: linear-gradient(145deg, #0f0a1a 0%, #1a1025 100%);
          border: 2px solid #ffd700;
          border-radius: 20px;
          padding: 32px 40px;
          box-shadow: 
            0 0 40px rgba(255, 215, 0, 0.3),
            0 0 80px rgba(255, 0, 128, 0.15),
            inset 0 0 40px rgba(0, 0, 0, 0.5);
        }
        .slotTopGlow {
          position: absolute;
          top: -2px;
          left: 20%;
          right: 20%;
          height: 4px;
          background: linear-gradient(90deg, 
            transparent, 
            #ffd700 50%, 
            transparent
          );
          filter: blur(2px);
          animation: topGlow 2s ease-in-out infinite;
        }
        @keyframes topGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .slotLabel {
          text-align: center;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3em;
          color: #ffd700;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
          margin-bottom: 20px;
        }
        .slotReels {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .slotReelWrap {
          background: #000;
          border: 2px solid rgba(255, 215, 0, 0.4);
          border-radius: 10px;
          padding: 4px;
          box-shadow: 
            inset 0 0 20px rgba(255, 215, 0, 0.2),
            0 0 10px rgba(0, 0, 0, 0.8);
        }
        .slotReel {
          width: 60px;
          height: 80px;
          background: linear-gradient(180deg, #1a1025 0%, #0f0a1a 100%);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Georgia', serif;
          font-size: 48px;
          font-weight: 700;
          color: #ffd700;
          text-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
          overflow: hidden;
        }
        .slotReel.spinning span {
          animation: reelSpin 0.1s linear infinite;
        }
        @keyframes reelSpin {
          0% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0); }
        }
        .slotReel:not(.spinning) {
          animation: reelStop 0.3s ease-out;
        }
        @keyframes reelStop {
          0% { transform: translateY(10px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0); }
        }
        .slotPercent {
          font-family: 'Georgia', serif;
          font-size: 40px;
          font-weight: 700;
          color: #ffd700;
          margin-left: 4px;
          text-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
        }

        .jackpotText {
          margin-top: 20px;
          text-align: center;
          font-family: 'Georgia', serif;
          font-size: 36px;
          font-weight: 800;
          font-style: italic;
          color: #ffd700;
          text-shadow: 
            0 0 20px rgba(255, 215, 0, 0.8),
            0 0 40px rgba(255, 215, 0, 0.4);
          animation: jackpotPop 0.5s ease-out, jackpotGlow 1.5s ease-in-out infinite;
          letter-spacing: 0.1em;
        }
        @keyframes jackpotPop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes jackpotGlow {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.4); }
          50% { text-shadow: 0 0 30px rgba(255, 215, 0, 1), 0 0 60px rgba(255, 215, 0, 0.6); }
        }
        .jackpotSub {
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: rgba(245, 241, 234, 0.7);
          margin-top: 6px;
        }

        /* 파티클 */
        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          top: 50%;
          animation: particleFall 2s ease-out forwards;
          box-shadow: 0 0 8px currentColor;
        }
        @keyframes particleFall {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(300px) scale(0);
            opacity: 0;
          }
        }

        /* ============================================================
           TAROT CARDS
           ============================================================ */
        .tarotRow {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 32px 0;
          position: relative;
          z-index: 2;
        }
        .tarotCard {
          aspect-ratio: 3 / 4;
          position: relative;
          perspective: 1000px;
          cursor: default;
        }
        .tarotBack, .tarotFront {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .tarotBack {
          background: linear-gradient(135deg, #1a1625 0%, #2a1f35 100%);
          border: 2px solid rgba(255, 215, 0, 0.3);
          transform: rotateY(0);
        }
        .tarotBackSymbol {
          font-size: 48px;
          color: #ffd700;
          opacity: 0.6;
          text-shadow: 0 0 16px rgba(255, 215, 0, 0.5);
        }
        .tarotCard.flipped .tarotBack {
          transform: rotateY(180deg);
        }
        .tarotFront {
          background: linear-gradient(135deg, #0f0a1a 0%, #1a1025 100%);
          border: 2px solid rgba(255, 215, 0, 0.4);
          transform: rotateY(-180deg);
          padding: 16px;
          text-align: center;
        }
        .tarotCard.flipped .tarotFront {
          transform: rotateY(0);
        }
        .tarotSymbol {
          font-size: 36px;
          margin-bottom: 10px;
          text-shadow: 0 0 12px currentColor;
        }
        .tarotTitle {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.2em;
          color: rgba(245, 241, 234, 0.6);
          margin-bottom: 10px;
        }
        .tarotValue {
          font-family: 'Georgia', serif;
          font-size: 20px;
          font-weight: 700;
          text-shadow: 0 0 8px currentColor;
        }

        /* ============================================================
           PROPHECY
           ============================================================ */
        .prophecyBox {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 28px 32px;
          background: linear-gradient(135deg, 
            rgba(255, 215, 0, 0.08) 0%, 
            rgba(255, 0, 128, 0.05) 100%
          );
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 14px;
          margin: 24px 0;
          z-index: 2;
        }
        .prophecyOrnamentLeft, .prophecyOrnamentRight {
          font-size: 24px;
          color: #ffd700;
          opacity: 0.6;
          line-height: 1;
          flex-shrink: 0;
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
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
        }
        .prophecyText {
          font-family: 'Georgia', serif;
          font-size: 17px;
          font-style: italic;
          line-height: 1.6;
          color: #f5f1ea;
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
          text-align: center;
          padding: 20px;
          border-top: 1px solid rgba(255, 215, 0, 0.15);
          z-index: 2;
        }
        .signatureLine {
          margin-bottom: 8px;
        }
        .sigLabel {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: rgba(255, 215, 0, 0.7);
        }
        .sigValue {
          font-family: 'SF Mono', Monaco, monospace;
          font-size: 12px;
          color: rgba(245, 241, 234, 0.5);
          margin-bottom: 10px;
          letter-spacing: 0.05em;
        }
        .sigMeta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.25em;
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
            padding: 28px 16px;
          }
          .oracleMainTitle {
            font-size: 20px;
          }
          .slotFrame {
            padding: 24px 20px;
          }
          .slotReel {
            width: 48px;
            height: 64px;
            font-size: 36px;
          }
          .slotPercent {
            font-size: 32px;
          }
          .jackpotText {
            font-size: 28px;
          }
          .tarotRow {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .prophecyText {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
