'use client';
/**
 * AdSlot - AdSense 광고 슬롯
 * 
 * 동작 방식:
 * - NEXT_PUBLIC_ADSENSE_CLIENT 환경변수 없으면 → 완전히 숨김 (승인 전)
 * - 환경변수 있으면 → 정상적으로 광고 표시 (승인 후)
 * 
 * 즉, 박 대표님이 AdSense 승인 받기 전까지는
 * 사이트 어디에도 회색 광고 박스가 노출되지 않습니다.
 * 승인 후 환경변수만 추가하면 자동으로 광고가 표시됩니다.
 */

import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot: string;
  variant?: 'horizontal' | 'square' | 'sidebar' | 'sidebar-card' | 'in-article';
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export default function AdSlot({ slot, variant = 'horizontal' }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);

  const client =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADSENSE_CLIENT) || '';
  const slotEnvKey = `NEXT_PUBLIC_ADSENSE_SLOT_${slot.toUpperCase().replace(/-/g, '_')}`;
  const slotId =
    (typeof process !== 'undefined' && (process.env as any)[slotEnvKey]) || '';

  useEffect(() => {
    if (!client || !slotId) return;
    try {
      if (typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
      }
    } catch (e) {}
  }, [client, slotId]);

  // 🔑 핵심: AdSense 승인 전이면 완전히 렌더링하지 않음
  // → 회색 placeholder가 노출되지 않아 사용자 경험 깔끔
  // → AdSense 승인 신청 시 깨끗한 사이트로 보여줌
  if (!client || !slotId) {
    return null;
  }

  return (
    <div className={`adContainer adContainer-${variant}`}>
      <div className="adLabel">광고</div>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={client}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />

      <style jsx>{`
        .adContainer {
          width: 100%;
          margin: 24px 0;
          padding: 8px 0;
        }
        .adContainer-horizontal {
          min-height: 100px;
        }
        .adContainer-in-article {
          min-height: 100px;
          margin: 32px 0;
        }
        .adContainer-square {
          max-width: 336px;
          margin: 24px auto;
        }
        .adContainer-sidebar,
        .adContainer-sidebar-card {
          max-width: 300px;
        }
        .adLabel {
          font-size: 10px;
          font-weight: 600;
          color: #999;
          text-align: left;
          margin-bottom: 4px;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  );
}
