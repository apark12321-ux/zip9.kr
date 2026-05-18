'use client';
/**
 * Cookie Consent Banner - AdSense GDPR/CCPA/한국 개인정보보호법 준수
 * 
 * AdSense 정책 필수:
 * - 광고 쿠키 사용 시 사용자 동의 필수
 * - 명확한 거부 옵션 제공
 * - 거부 시에도 기본 사이트 사용 가능
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'nutube_cookie_consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export default function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [mounted, setMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(true);
  const [adAllowed, setAdAllowed] = useState(true);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored === 'accepted' || stored === 'rejected') {
        setStatus(stored);
      }
    } catch {}
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      setStatus('accepted');
      // AdSense 광고 활성화 (실제 광고 표시 시점)
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'granted',
          analytics_storage: 'granted',
        });
      }
    } catch {}
  };

  const handleReject = () => {
    try {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      setStatus('rejected');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: 'denied',
          analytics_storage: 'denied',
        });
      }
    } catch {}
  };

  // "설정" 모달에서 사용자 선택 저장
  const handleSaveSettings = () => {
    try {
      const fullConsent = analyticsAllowed && adAllowed;
      localStorage.setItem(CONSENT_KEY, fullConsent ? 'accepted' : 'rejected');
      setStatus(fullConsent ? 'accepted' : 'rejected');
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          ad_storage: adAllowed ? 'granted' : 'denied',
          analytics_storage: analyticsAllowed ? 'granted' : 'denied',
        });
      }
      setShowSettings(false);
    } catch {}
  };

  // 마운트 안 됐거나 이미 결정한 경우 표시 X
  if (!mounted || status !== 'pending') return null;

  // 설정 모달 표시 중
  if (showSettings) {
    return (
      <div className="cookieModalOverlay" role="dialog" aria-label="쿠키 설정">
        <div className="cookieModal">
          <div className="cookieModalHead">
            <strong>🍪 쿠키 설정</strong>
            <p className="cookieModalSub">
              사용하실 쿠키 종류를 선택해주세요. 필수 쿠키는 사이트 작동에 반드시 필요합니다.
            </p>
          </div>
          <div className="cookieOption">
            <div className="cookieOptionHead">
              <span className="cookieOptionTitle">필수 쿠키</span>
              <span className="cookieOptionRequired">필수</span>
            </div>
            <p className="cookieOptionDesc">
              로그인, 보안, 사이트 기능 작동에 반드시 필요한 쿠키입니다. (항상 활성)
            </p>
          </div>
          <div className="cookieOption">
            <div className="cookieOptionHead">
              <span className="cookieOptionTitle">분석 쿠키</span>
              <label className="cookieToggle">
                <input
                  type="checkbox"
                  checked={analyticsAllowed}
                  onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                />
                <span className="cookieToggleSlider"></span>
              </label>
            </div>
            <p className="cookieOptionDesc">
              사이트 사용 패턴을 분석하여 서비스 개선에 활용합니다.
            </p>
          </div>
          <div className="cookieOption">
            <div className="cookieOptionHead">
              <span className="cookieOptionTitle">광고 쿠키</span>
              <label className="cookieToggle">
                <input
                  type="checkbox"
                  checked={adAllowed}
                  onChange={(e) => setAdAllowed(e.target.checked)}
                />
                <span className="cookieToggleSlider"></span>
              </label>
            </div>
            <p className="cookieOptionDesc">
              관심사에 맞는 맞춤 광고를 보여드리는 데 활용됩니다 (Google AdSense).
            </p>
          </div>
          <div className="cookieModalActions">
            <button onClick={() => setShowSettings(false)} className="btnReject">
              취소
            </button>
            <button onClick={handleSaveSettings} className="btnAccept">
              저장하기
            </button>
          </div>
          <style jsx>{`
            .cookieModalOverlay {
              position: fixed;
              inset: 0;
              background: rgba(0, 0, 0, 0.55);
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 10000;
              padding: 20px;
              animation: fadeIn 0.2s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .cookieModal {
              background: #fff;
              border-radius: 16px;
              padding: 28px 24px;
              max-width: 480px;
              width: 100%;
              max-height: 88vh;
              overflow-y: auto;
              box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
            }
            .cookieModalHead { margin-bottom: 18px; }
            .cookieModalHead strong {
              display: block;
              font-size: 18px;
              color: #1a1a1a;
              margin-bottom: 6px;
              letter-spacing: -0.02em;
            }
            .cookieModalSub {
              font-size: 13px;
              color: #666;
              line-height: 1.6;
              margin: 0;
            }
            .cookieOption {
              padding: 14px 0;
              border-top: 1px solid #f0f0f0;
            }
            .cookieOption:first-of-type { border-top: 1px solid #e5e5e5; }
            .cookieOptionHead {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 6px;
            }
            .cookieOptionTitle {
              font-size: 14.5px;
              font-weight: 700;
              color: #1a1a1a;
            }
            .cookieOptionRequired {
              padding: 3px 9px;
              background: #f5f5f5;
              color: #888;
              border-radius: 100px;
              font-size: 11px;
              font-weight: 700;
            }
            .cookieOptionDesc {
              font-size: 12.5px;
              color: #666;
              line-height: 1.6;
              margin: 0;
            }
            .cookieToggle {
              position: relative;
              display: inline-block;
              width: 42px;
              height: 22px;
              cursor: pointer;
            }
            .cookieToggle input { opacity: 0; width: 0; height: 0; }
            .cookieToggleSlider {
              position: absolute;
              inset: 0;
              background: #d1d5db;
              border-radius: 100px;
              transition: 0.25s;
            }
            .cookieToggleSlider::before {
              content: '';
              position: absolute;
              height: 16px;
              width: 16px;
              left: 3px;
              top: 3px;
              background: #fff;
              border-radius: 50%;
              transition: 0.25s;
            }
            .cookieToggle input:checked + .cookieToggleSlider {
              background: #4f46e5;
            }
            .cookieToggle input:checked + .cookieToggleSlider::before {
              transform: translateX(20px);
            }
            .cookieModalActions {
              display: flex;
              gap: 10px;
              margin-top: 22px;
              padding-top: 18px;
              border-top: 1px solid #e5e5e5;
            }
            .cookieModalActions button { flex: 1; }
            .btnReject {
              padding: 11px 18px;
              background: #fff;
              color: #666;
              border: 1px solid #e5e5e5;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 700;
              cursor: pointer;
              font-family: inherit;
              transition: all 0.15s;
            }
            .btnReject:hover {
              border-color: #4f46e5;
              color: #4f46e5;
            }
            .btnAccept {
              padding: 11px 18px;
              background: #4f46e5;
              color: #fff;
              border: none;
              border-radius: 10px;
              font-size: 14px;
              font-weight: 700;
              cursor: pointer;
              font-family: inherit;
              transition: all 0.15s;
            }
            .btnAccept:hover {
              background: #d97155;
              transform: translateY(-1px);
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="cookieBanner" role="dialog" aria-label="쿠키 동의">
      <div className="cookieContent">
        <div className="cookieText">
          <strong>🍪 쿠키 안내</strong>
          <p>
            서비스 품질 향상을 위해 쿠키를 사용합니다. 광고 맞춤 표시와 사이트 분석에 활용되며,
            세부 설정에서 항목별로 선택하실 수 있습니다.
            <Link href="/privacy" className="cookieLink">자세히 보기</Link>
          </p>
        </div>
        <div className="cookieButtons">
          <button onClick={() => setShowSettings(true)} className="btnReject">
            설정
          </button>
          <button onClick={handleAccept} className="btnAccept">
            모두 허용
          </button>
        </div>
      </div>

      <style jsx>{`
        .cookieBanner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #1a1a1a;
          color: #fff;
          padding: 16px 20px;
          z-index: 9998;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
          animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .cookieContent {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          gap: 20px;
          align-items: center;
          flex-wrap: wrap;
        }
        @media (max-width: 720px) {
          .cookieContent {
            flex-direction: column;
            gap: 14px;
            align-items: stretch;
          }
        }
        .cookieText {
          flex: 1;
          min-width: 0;
        }
        .cookieText strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 4px;
        }
        .cookieText p {
          font-size: 12.5px;
          line-height: 1.6;
          margin: 0;
          color: #d1d5db;
        }
        .cookieLink {
          color: #fcd34d;
          text-decoration: underline;
          margin-left: 4px;
        }
        .cookieLink:hover {
          color: #fde68a;
        }
        .cookieButtons {
          display: flex;
          gap: 8px;
          flex-shrink: 0;
        }
        @media (max-width: 720px) {
          .cookieButtons { width: 100%; }
          .cookieButtons button { flex: 1; }
        }
        .btnReject {
          padding: 10px 18px;
          background: transparent;
          color: #d1d5db;
          border: 1px solid #4b5563;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          min-height: 40px;
        }
        .btnReject:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border-color: #6b7280;
        }
        .btnAccept {
          padding: 10px 22px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: all 0.15s;
          min-height: 40px;
        }
        .btnAccept:hover {
          background: #d97155;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
