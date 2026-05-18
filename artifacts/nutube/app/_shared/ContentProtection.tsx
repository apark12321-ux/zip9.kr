'use client';
/**
 * ContentProtection 컴포넌트 - 강력한 콘텐츠 보호
 *
 * 박예준 요청사항:
 * ✅ 우클릭 방지
 * ✅ F12/개발자도구 방지
 * ✅ 복사/드래그/선택 방지
 * ✅ 인쇄 방지
 * ✅ 이미지 저장 방지
 * ✅ 콘솔 경고 표시
 *
 * 100% 완벽 방지는 불가능 (브라우저 한계)
 * 하지만 일반 사용자의 99%는 차단 가능
 */

import { useEffect } from 'react';

export default function ContentProtection() {
  useEffect(() => {
    // ============================================================
    // 1. 우클릭 방지
    // ============================================================
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // ============================================================
    // 2. 키보드 단축키 차단
    // F12: 개발자도구
    // Ctrl+Shift+I: 개발자도구
    // Ctrl+Shift+J: 콘솔
    // Ctrl+Shift+C: 요소 검사
    // Ctrl+U: 페이지 소스 보기
    // Ctrl+S: 페이지 저장
    // Ctrl+P: 인쇄
    // Ctrl+A: 전체 선택
    // Ctrl+C: 복사
    // Ctrl+X: 잘라내기
    // ============================================================
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I/J/C (Mac: Cmd+Opt+I/J/C)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
        if (['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
          e.preventDefault();
          return false;
        }
      }
      
      // Ctrl+U (페이지 소스)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (저장)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+P (인쇄)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        return false;
      }
    };

    // ============================================================
    // 3. 드래그 방지
    // ============================================================
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // ============================================================
    // 4. 선택 방지 (selectstart)
    // ============================================================
    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      // INPUT, TEXTAREA에서는 선택 허용 (사용자 입력 필드)
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }
      // 프롬프트 복사 버튼이 있는 영역은 선택 허용
      if (target.closest('.allow-select')) {
        return;
      }
      e.preventDefault();
      return false;
    };

    // ============================================================
    // 5. 복사 이벤트 방지
    // ============================================================
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      // INPUT, TEXTAREA, .allow-select 허용
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('.allow-select') ||
        target.closest('.allow-copy')
      ) {
        return;
      }
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', '⚠️ NuTube 콘텐츠는 보호됩니다.');
      }
      return false;
    };

    // ============================================================
    // 6. 콘솔 경고 메시지 (브랜딩 + 경고)
    // ============================================================
    const showConsoleWarning = () => {
      const styles = [
        'color: #4f46e5',
        'font-size: 24px',
        'font-weight: 800',
        'text-shadow: 2px 2px 0 rgba(0,0,0,0.2)',
        'padding: 10px',
      ].join(';');

      const subStyles = [
        'color: #564a3a',
        'font-size: 14px',
        'font-weight: 600',
        'padding: 5px',
      ].join(';');

      const warnStyles = [
        'color: #4f46e5',
        'font-size: 14px',
        'font-weight: 700',
        'background: #fdf1e7',
        'padding: 10px',
        'border-left: 4px solid #4f46e5',
      ].join(';');

      console.log('%c🔐 NuTube', styles);
      console.log('%cAI가 만드는 영상 자동화 서비스', subStyles);
      console.log(
        '%c⚠️ 경고: 알고메이커의 모든 콘텐츠와 알고리즘은 저작권법으로 보호받고 있습니다. 무단 복제, 재배포, 크롤링, AI 학습 등의 행위는 법적 조치의 대상이 됩니다.',
        warnStyles
      );
    };

    // ============================================================
    // 7. 개발자도구 감지 (비정상 창 크기)
    // ============================================================
    let devtoolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          console.clear();
          showConsoleWarning();
        }
      } else {
        devtoolsOpen = false;
      }
    };

    // ============================================================
    // 이벤트 리스너 등록
    // ============================================================
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);

    // 초기 콘솔 경고
    showConsoleWarning();

    // 개발자도구 감지 (1초마다)
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // ============================================================
    // 이미지에 드래그/복사 방지 속성 자동 추가
    // ============================================================
    const applyImageProtection = () => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        img.setAttribute('draggable', 'false');
        img.setAttribute('oncontextmenu', 'return false;');
        (img.style as any).webkitUserDrag = 'none';
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'auto';
      });
    };

    applyImageProtection();

    // MutationObserver로 새로 추가되는 이미지도 보호
    const observer = new MutationObserver(() => {
      applyImageProtection();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ============================================================
    // Cleanup
    // ============================================================
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
      clearInterval(devToolsInterval);
      observer.disconnect();
    };
  }, []);

  return null;
}
