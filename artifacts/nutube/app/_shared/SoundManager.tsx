'use client';
/**
 * SoundManager - 전역 사운드 관리
 *
 * 박예준 확정:
 * ✅ 기본값 Mute (조용한 환경에서도 안전)
 * ✅ 유저가 토글 가능
 * ✅ 우상단 토글 버튼
 * ✅ Web Audio API로 효과음 생성 (외부 파일 X)
 */

import { useState, useEffect, createContext, useContext, useCallback } from 'react';

// ============================================================
// Sound Context (전역 상태)
// ============================================================
interface SoundContextType {
  muted: boolean;
  setMuted: (muted: boolean) => void;
  playSound: (type: SoundType) => void;
}

type SoundType = 'reveal' | 'whisper' | 'glow' | 'explosion';

const SoundContext = createContext<SoundContextType>({
  muted: true,
  setMuted: () => {},
  playSound: () => {},
});

export const useSoundManager = () => useContext(SoundContext);

// ============================================================
// Web Audio API로 효과음 생성
// ============================================================
function createAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playOscillator(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume: number = 0.1,
  fadeOut: boolean = true,
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime;
  gainNode.gain.setValueAtTime(volume, now);

  if (fadeOut) {
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  }

  oscillator.start(now);
  oscillator.stop(now + duration);
}

// ============================================================
// SoundProvider 컴포넌트
// ============================================================
export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMuted] = useState(true); // 기본 Mute
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);

  // localStorage에서 mute 설정 불러오기
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('nutube_sound_muted');
    if (saved !== null) {
      setMuted(saved === 'true');
    }
  }, []);

  // mute 변경 시 저장
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nutube_sound_muted', muted.toString());
  }, [muted]);

  // AudioContext는 유저 인터랙션 후에만 생성 가능
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!audioCtx) {
        const ctx = createAudioContext();
        if (ctx) setAudioCtx(ctx);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioCtx]);

  // 사운드 재생
  const playSound = useCallback((type: SoundType) => {
    if (muted || !audioCtx) return;

    try {
      switch (type) {
        case 'reveal':
          // 드라마틱한 공개 사운드 (낮은 → 높은 음)
          playOscillator(audioCtx, 220, 0.3, 'sine', 0.15);
          setTimeout(() => playOscillator(audioCtx, 440, 0.3, 'sine', 0.12), 100);
          setTimeout(() => playOscillator(audioCtx, 880, 0.5, 'sine', 0.1), 250);
          break;

        case 'whisper':
          // Oracle의 속삭임 (부드러운 사운드)
          playOscillator(audioCtx, 660, 0.2, 'triangle', 0.05);
          setTimeout(() => playOscillator(audioCtx, 880, 0.3, 'triangle', 0.04), 100);
          break;

        case 'glow':
          // 빛이 모이는 소리 (반짝)
          playOscillator(audioCtx, 1320, 0.15, 'sine', 0.08);
          break;

        case 'explosion':
          // 빛 폭발 (드라마틱)
          playOscillator(audioCtx, 110, 0.4, 'sawtooth', 0.1);
          setTimeout(() => playOscillator(audioCtx, 1760, 0.6, 'sine', 0.12), 50);
          break;
      }
    } catch {
      // 사운드 재생 실패 시 무시
    }
  }, [muted, audioCtx]);

  return (
    <SoundContext.Provider value={{ muted, setMuted, playSound }}>
      {children}
      <SoundToggleButton muted={muted} setMuted={setMuted} />
    </SoundContext.Provider>
  );
}

// ============================================================
// 사운드 토글 버튼 (우상단 플로팅)
// ============================================================
function SoundToggleButton({ muted, setMuted }: { muted: boolean; setMuted: (m: boolean) => void }) {
  return (
    <button
      className="soundToggle"
      onClick={() => setMuted(!muted)}
      aria-label={muted ? '사운드 켜기' : '사운드 끄기'}
      title={muted ? '🔇 음소거 (클릭하여 켜기)' : '🔊 사운드 ON'}
    >
      {muted ? '🔇' : '🔊'}
      
      <style jsx>{`
        .soundToggle {
          position: fixed;
          top: 60px;
          right: 16px;
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, rgba(26, 22, 37, 0.85), rgba(42, 31, 53, 0.85));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 50%;
          font-size: 16px;
          cursor: pointer;
          z-index: 1000;
          backdrop-filter: blur(8px);
          color: #ffd700;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
        }
        .soundToggle:hover {
          background: linear-gradient(135deg, rgba(26, 22, 37, 0.95), rgba(42, 31, 53, 0.95));
          border-color: rgba(255, 215, 0, 0.6);
          transform: scale(1.05);
          box-shadow: 0 0 16px rgba(255, 215, 0, 0.3);
        }
        .soundToggle:active {
          transform: scale(0.95);
        }
        @media (max-width: 720px) {
          .soundToggle {
            top: 56px;
            right: 12px;
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
        }
      `}</style>
    </button>
  );
}
