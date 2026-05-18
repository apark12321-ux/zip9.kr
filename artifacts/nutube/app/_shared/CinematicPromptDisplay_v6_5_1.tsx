'use client';

// ============================================================
// NuTube v6.5.1 - Cinematic Prompt Display (PROFESSIONAL PANEL)
// 
// 박 대표님 v10.7 메인 페이지 ENGINE PANEL 디자인과 일관성:
// - 패널 상단 바 (브라우저 윈도우 스타일)
// - 명확한 영역 경계 (border + box-shadow)
// - 모노스페이스 (라벨, 코드) + Pretendard (본문)
// - 검정/주황/노랑/초록 4색 시스템
// - LIVE / RUNNING 펄스 인디케이터
//
// 박 대표님 자산 100% 보존:
// - CinematicPromptPackage 인터페이스
// - 모든 함수 (MidjourneyPanel, SoraPanel, VeoPanel, FlowPanel, NotebookPanel)
// - SpecRow, FullPromptBox 시그니처
// - 데이터 흐름 (prompts.midjourney, prompts.rationale 등)
// ============================================================

import React, { useState } from 'react';
import type { CinematicPromptPackage } from './promptEngine_v6_5_0';

interface PromptDisplayProps {
  prompts: CinematicPromptPackage;
}

export function CinematicPromptDisplay({ prompts }: PromptDisplayProps) {
  const [activeTab, setActiveTab] = useState<'midjourney' | 'sora' | 'veo' | 'flow' | 'notebookLM'>('midjourney');

  return (
    <div className="briefDoc">
      <style jsx global>{`
        .briefDoc {
          background: #ffffff;
          border: 1px solid #d4d4d4;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          margin: 16px 0;
        }
        @media (max-width: 600px) {
          .briefDoc { margin: 12px 0; }
        }

        /* ============================================ */
        /* PANEL TOP BAR (브라우저 윈도우 스타일) */
        /* ============================================ */
        .panelBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: #f5f5f5;
          border-bottom: 1px solid #d4d4d4;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .panelBar { padding: 7px 12px; }
        }

        .panelBarLeft {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .panelDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .panelDot--red { background: #ef4444; }
        .panelDot--yellow { background: #f59e0b; }
        .panelDot--green { background: #22c55e; }

        .panelBarTitle {
          margin-left: 8px;
          font-size: 11px;
          color: #525252;
          font-weight: 500;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) {
          .panelBarTitle { font-size: 10px; margin-left: 6px; }
        }

        .panelBarRight {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .panelBadge {
          padding: 2px 7px;
          background: #ffffff;
          border: 1px solid #d4d4d4;
          font-size: 9.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .panelBadge { font-size: 9px; padding: 2px 6px; } }

        .panelLive {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 2px 7px;
          background: #ffffff;
          border: 1px solid #16a34a;
          font-size: 9.5px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: 0.12em;
        }
        @media (max-width: 600px) { .panelLive { font-size: 9px; padding: 2px 6px; } }

        .panelLiveDot {
          width: 6px;
          height: 6px;
          background: #16a34a;
          border-radius: 50%;
          animation: panelPulse 1.6s ease-in-out infinite;
          box-shadow: 0 0 6px rgba(22, 163, 74, 0.6);
        }
        @keyframes panelPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.15); }
        }

        /* ============================================ */
        /* PANEL HEADER */
        /* ============================================ */
        .docHeader {
          padding: 22px 24px 18px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .docHeader { padding: 18px 18px 14px; }
        }

        .docKicker {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .docKicker { font-size: 10px; letter-spacing: 0.18em; } }

        .docTitle {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.03em;
          line-height: 1.3;
          margin: 0;
        }
        @media (max-width: 600px) { .docTitle { font-size: 18px; } }

        .docTitleAccent { color: #c2410c; }

        /* ============================================ */
        /* RATIONALE BLOCK */
        /* ============================================ */
        .rationaleBlock {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 14px;
          padding: 22px 24px;
          border-bottom: 1px solid #e5e5e5;
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .rationaleBlock {
            padding: 18px 18px;
            grid-template-columns: 44px 1fr;
            gap: 10px;
          }
        }

        .rationaleNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 28px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        @media (max-width: 600px) { .rationaleNum { font-size: 22px; } }

        .rationaleMain { min-width: 0; }

        .rationaleLabel {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c2410c;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .rationaleLabel { font-size: 9.5px; } }

        .rationaleDivider {
          width: 24px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 10px;
        }

        .rationaleContent {
          font-size: 14px;
          color: #404040;
          line-height: 1.7;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .rationaleContent { font-size: 13px; } }
        .rationaleContent strong {
          color: #0a0a0a;
          font-weight: 700;
        }

        /* ============================================ */
        /* TAB SECTION */
        /* ============================================ */
        .tabSection {
          padding: 22px 24px 24px;
        }
        @media (max-width: 600px) {
          .tabSection { padding: 18px 18px 20px; }
        }

        .tabSectionLabel {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c2410c;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .tabSectionLabel { font-size: 10px; } }

        .tabSectionDivider {
          width: 28px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 14px;
        }

        .tabRow {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 4px;
          background: #fafafa;
          padding: 4px;
          border: 1px solid #e5e5e5;
          margin-bottom: 0;
        }
        @media (max-width: 600px) {
          .tabRow {
            grid-template-columns: repeat(3, 1fr);
            gap: 3px;
            padding: 3px;
          }
        }

        .tabBtn {
          padding: 12px 8px;
          background: transparent;
          border: none;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #737373;
          cursor: pointer;
          transition: all 0.15s;
          text-align: center;
          line-height: 1.4;
          text-transform: uppercase;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .tabBtn {
            font-size: 10px;
            padding: 9px 4px;
            letter-spacing: 0.02em;
            gap: 2px;
          }
        }

        .tabBtn:hover {
          background: #ffffff;
          color: #0a0a0a;
        }

        .tabBtn.active {
          background: #0a0a0a;
          color: #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
        }

        .tabBtn.active .tabSubtitle {
          color: #fbbf24;
        }

        .tabSubtitle {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 8.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #a3a3a3;
        }
        @media (max-width: 600px) {
          .tabSubtitle { font-size: 7.5px; }
        }

        .tabBody {
          padding: 22px 0 0;
        }
        @media (max-width: 600px) {
          .tabBody { padding: 18px 0 0; }
        }

        /* ============================================ */
        /* FULL PROMPT (다크 코드 박스) */
        /* ============================================ */
        .fullPromptHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 14px;
          background: #0a0a0a;
          color: #ffffff;
          font-family: 'SF Mono', 'Consolas', monospace;
        }
        @media (max-width: 600px) {
          .fullPromptHead { padding: 7px 12px; }
        }

        .fullPromptLabel {
          font-size: 10.5px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.12em;
        }
        @media (max-width: 600px) { .fullPromptLabel { font-size: 9.5px; } }

        .copyBtn {
          padding: 4px 10px;
          background: #ffffff;
          color: #0a0a0a;
          border: none;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.15s;
        }
        .copyBtn:hover { background: #fbbf24; }
        .copyBtn.copied {
          background: #16a34a;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .copyBtn { font-size: 9.5px; padding: 4px 9px; }
        }

        .fullPromptBody {
          margin: 0;
          padding: 16px 18px;
          background: #1a1a1a;
          color: #e5e5e5;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          line-height: 1.75;
          white-space: pre-wrap;
          word-break: keep-all;
          overflow-wrap: anywhere;
          border: 1px solid #404040;
          border-top: none;
          max-height: 280px;
          overflow-y: auto;
          overflow-x: hidden;
        }
        @media (max-width: 600px) {
          .fullPromptBody {
            font-size: 10.5px;
            padding: 12px 12px;
            max-height: 260px;
            line-height: 1.7;
          }
        }

        /* ============================================ */
        /* SPECS CARD */
        /* ============================================ */
        .specsTitle {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c2410c;
          margin: 22px 0 6px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .specsTitle { font-size: 10px; } }

        .specsDivider {
          width: 28px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 12px;
        }

        .specsTable {
          background: #fafafa;
          border: 1px solid #e5e5e5;
        }

        .specRow {
          display: grid;
          grid-template-columns: 130px 1fr;
          gap: 18px;
          padding: 12px 14px;
          border-bottom: 1px solid #e5e5e5;
          align-items: start;
        }
        .specRow:last-child {
          border-bottom: none;
        }
        @media (max-width: 600px) {
          .specRow {
            grid-template-columns: 92px 1fr;
            gap: 12px;
            padding: 10px 12px;
          }
        }

        .specKey {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10.5px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding-top: 2px;
        }
        @media (max-width: 600px) {
          .specKey { font-size: 9.5px; letter-spacing: 0.06em; }
        }

        .specVal {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13.5px;
          color: #0a0a0a;
          line-height: 1.55;
          font-weight: 600;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        @media (max-width: 600px) {
          .specVal { font-size: 12.5px; }
        }

        .specVal.mono {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          font-weight: 600;
          color: #c2410c;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        @media (max-width: 600px) {
          .specVal.mono { font-size: 11px; }
        }

        /* ============================================ */
        /* META BLOCKS */
        /* ============================================ */
        .metaBlock {
          margin-top: 14px;
          padding: 12px 14px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          border-left: 3px solid #c2410c;
        }
        @media (max-width: 600px) {
          .metaBlock { padding: 11px 12px; }
        }

        .metaBlock.tech {
          border-left-color: #0a0a0a;
        }

        .metaBlock.warning {
          border-left-color: #dc2626;
        }

        .metaInline {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .metaInlineKey {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #737373;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .metaInlineKey { font-size: 9.5px; } }

        .metaInlineVal {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 13px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.01em;
        }
        @media (max-width: 600px) { .metaInlineVal { font-size: 12px; } }

        .metaLabel {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #737373;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .metaLabel { font-size: 9.5px; } }

        .metaBlock.warning .metaLabel { color: #dc2626; }

        .metaContent {
          font-size: 13px;
          color: #404040;
          line-height: 1.6;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        @media (max-width: 600px) { .metaContent { font-size: 12px; } }

        .metaContent.mono {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11.5px;
          color: #525252;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        @media (max-width: 600px) { .metaContent.mono { font-size: 11px; } }
      `}</style>

      {/* PANEL TOP BAR (브라우저 윈도우 스타일) */}
      <div className="panelBar">
        <div className="panelBarLeft">
          <span className="panelDot panelDot--red" />
          <span className="panelDot panelDot--yellow" />
          <span className="panelDot panelDot--green" />
          <span className="panelBarTitle">cinematography-brief.spec</span>
        </div>
        <div className="panelBarRight">
          <span className="panelBadge">v6.5</span>
          <span className="panelLive">
            <span className="panelLiveDot" />
            READY
          </span>
        </div>
      </div>

      {/* DOC HEADER */}
      <div className="docHeader">
        <div className="docKicker">▍ Cinematography Brief</div>
        <h2 className="docTitle">
          AI Production Spec — <span className="docTitleAccent">Multi Engine</span>
        </h2>
      </div>

      {/* 01 RATIONALE */}
      <div className="rationaleBlock">
        <div className="rationaleNum">01</div>
        <div className="rationaleMain">
          <div className="rationaleLabel">Style Rationale</div>
          <div className="rationaleDivider" />
          <div
            className="rationaleContent"
            dangerouslySetInnerHTML={{
              __html: prompts.rationale.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
            }}
          />
        </div>
      </div>

      {/* 02 ENGINE TABS */}
      <div className="tabSection">
        <div className="tabSectionLabel">02 Engine Selection</div>
        <div className="tabSectionDivider" />
        
        <div className="tabRow">
          <button type="button" className={`tabBtn ${activeTab === 'midjourney' ? 'active' : ''}`} onClick={() => setActiveTab('midjourney')}>
            Midjourney v7
            <span className="tabSubtitle">Stills</span>
          </button>
          <button type="button" className={`tabBtn ${activeTab === 'sora' ? 'active' : ''}`} onClick={() => setActiveTab('sora')}>
            Sora 2
            <span className="tabSubtitle">Video</span>
          </button>
          <button type="button" className={`tabBtn ${activeTab === 'veo' ? 'active' : ''}`} onClick={() => setActiveTab('veo')}>
            VEO 3
            <span className="tabSubtitle">Google</span>
          </button>
          <button type="button" className={`tabBtn ${activeTab === 'flow' ? 'active' : ''}`} onClick={() => setActiveTab('flow')}>
            Flow
            <span className="tabSubtitle">Sequence</span>
          </button>
          <button type="button" className={`tabBtn ${activeTab === 'notebookLM' ? 'active' : ''}`} onClick={() => setActiveTab('notebookLM')}>
            NotebookLM
            <span className="tabSubtitle">Analysis</span>
          </button>
        </div>

        <div className="tabBody">
          {activeTab === 'midjourney' && <MidjourneyPanel data={prompts.midjourney} />}
          {activeTab === 'sora' && <SoraPanel data={prompts.sora} />}
          {activeTab === 'veo' && <VeoPanel data={prompts.veo} />}
          {activeTab === 'flow' && <FlowPanel data={prompts.flow} />}
          {activeTab === 'notebookLM' && <NotebookPanel data={prompts.notebookLM} />}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Midjourney 패널 (박 대표님 자산 100% 보존)
// ============================================================
function MidjourneyPanel({ data }: { data: any }) {
  // 모든 spec 필드가 비어있는지 확인
  const hasAnySpec = !!(
    (data.subject && data.subject.trim()) ||
    (data.composition && data.composition.trim()) ||
    (data.lighting && data.lighting.trim()) ||
    (data.colorPalette && data.colorPalette.trim()) ||
    (data.cameraSpec && data.cameraSpec.trim()) ||
    (data.mood && data.mood.trim()) ||
    (data.styleReference && data.styleReference.trim()) ||
    (data.parameters && data.parameters.trim())
  );

  return (
    <>
      <FullPromptBox label="Midjourney v7 — Full Prompt" content={data.fullPrompt} />
      
      {hasAnySpec && (
        <>
          <div className="specsTitle">Composition Spec</div>
          <div className="specsDivider" />
          <div className="specsTable">
            <SpecRow keyName="Subject" value={data.subject} />
            <SpecRow keyName="Composition" value={data.composition} />
            <SpecRow keyName="Lighting" value={data.lighting} />
            <SpecRow keyName="Color" value={data.colorPalette} />
            <SpecRow keyName="Camera/Lens" value={data.cameraSpec} />
            <SpecRow keyName="Mood" value={data.mood} />
            <SpecRow keyName="Style Ref" value={data.styleReference} />
            <SpecRow keyName="Parameters" value={data.parameters} mono />
          </div>
        </>
      )}

      {data.seed && (
        <div className="metaBlock tech">
          <div className="metaInline">
            <span className="metaInlineKey">Seed</span>
            <span className="metaInlineVal">{data.seed}</span>
          </div>
        </div>
      )}

      {data.negativePrompt && data.negativePrompt.trim() && (
        <div className="metaBlock warning">
          <div className="metaLabel">Negative Prompt</div>
          <div className="metaContent mono">{data.negativePrompt}</div>
        </div>
      )}
    </>
  );
}

// ============================================================
// Sora 패널 (박 대표님 자산 100% 보존)
// ============================================================
function SoraPanel({ data }: { data: any }) {
  const hasAnySpec = !!(
    (data.scene && data.scene.trim()) ||
    (data.subject && data.subject.trim()) ||
    (data.cameraMovement && data.cameraMovement.trim()) ||
    (data.duration && data.duration.trim()) ||
    (data.audio && data.audio.trim()) ||
    (data.atmosphere && data.atmosphere.trim())
  );

  return (
    <>
      <FullPromptBox label="Sora 2 — Full Prompt" content={data.fullPrompt} />

      {hasAnySpec && (
        <>
          <div className="specsTitle">Shot Specification</div>
          <div className="specsDivider" />
          <div className="specsTable">
            <SpecRow keyName="Scene" value={data.scene} />
            <SpecRow keyName="Subject" value={data.subject} />
            <SpecRow keyName="Camera Move" value={data.cameraMovement} />
            <SpecRow keyName="Duration" value={data.duration} mono />
            <SpecRow keyName="Audio" value={data.audio} />
            <SpecRow keyName="Atmosphere" value={data.atmosphere} />
          </div>
        </>
      )}

      {data.negativePrompt && data.negativePrompt.trim() && (
        <div className="metaBlock warning">
          <div className="metaLabel">Negative Prompt</div>
          <div className="metaContent mono">{data.negativePrompt}</div>
        </div>
      )}
    </>
  );
}

// ============================================================
// VEO 패널 (박 대표님 자산 100% 보존)
// ============================================================
function VeoPanel({ data }: { data: any }) {
  const hasAnySpec = !!(
    (data.subject && data.subject.trim()) ||
    (data.action && data.action.trim()) ||
    (data.cameraSpec && data.cameraSpec.trim()) ||
    (data.lighting && data.lighting.trim()) ||
    (data.cinematicStyle && data.cinematicStyle.trim()) ||
    (data.soundDesign && data.soundDesign.trim()) ||
    (data.outputSpec && data.outputSpec.trim())
  );

  return (
    <>
      <FullPromptBox label="VEO 3 — Full Prompt" content={data.fullPrompt} />

      {hasAnySpec && (
        <>
          <div className="specsTitle">Production Spec</div>
          <div className="specsDivider" />
          <div className="specsTable">
            <SpecRow keyName="Subject" value={data.subject} />
            <SpecRow keyName="Action" value={data.action} />
            <SpecRow keyName="Camera" value={data.cameraSpec} />
            <SpecRow keyName="Lighting" value={data.lighting} />
            <SpecRow keyName="Style" value={data.cinematicStyle} />
            <SpecRow keyName="Sound Design" value={data.soundDesign} />
            <SpecRow keyName="Output" value={data.outputSpec} mono />
          </div>
        </>
      )}

      {data.negativePrompt && data.negativePrompt.trim() && (
        <div className="metaBlock warning">
          <div className="metaLabel">Negative Prompt</div>
          <div className="metaContent mono">{data.negativePrompt}</div>
        </div>
      )}
    </>
  );
}

// ============================================================
// Flow 패널 (박 대표님 자산 100% 보존)
// ============================================================
function FlowPanel({ data }: { data: any }) {
  const hasAnySpec = !!(
    (data.hookShot && data.hookShot.trim()) ||
    (data.buildShot && data.buildShot.trim()) ||
    (data.climaxShot && data.climaxShot.trim()) ||
    (data.resolutionShot && data.resolutionShot.trim())
  );

  return (
    <>
      <FullPromptBox label="Flow — Full Sequence" content={data.fullPrompt} />

      {hasAnySpec && (
        <>
          <div className="specsTitle">Sequence Map</div>
          <div className="specsDivider" />
          <div className="specsTable">
            <SpecRow keyName="Hook (0-3s)" value={data.hookShot} />
            <SpecRow keyName="Build (3-15s)" value={data.buildShot} />
            <SpecRow keyName="Climax (15-25s)" value={data.climaxShot} />
            <SpecRow keyName="Resolution (25-30s)" value={data.resolutionShot} />
          </div>
        </>
      )}

      {data.continuityNote && data.continuityNote.trim() && (
        <div className="metaBlock tech">
          <div className="metaLabel">Continuity Note</div>
          <div className="metaContent">{data.continuityNote}</div>
        </div>
      )}
    </>
  );
}

// ============================================================
// NotebookLM 패널 (박 대표님 자산 100% 보존)
// ============================================================
function NotebookPanel({ data }: { data: string }) {
  return (
    <>
      <FullPromptBox label="NotebookLM — Analysis Brief" content={data} />
    </>
  );
}

// ============================================================
// SpecRow (박 대표님 자산 100% 보존)
// ============================================================
function SpecRow({ keyName, value, mono }: {
  keyName: string;
  value: string;
  mono?: boolean;
}) {
  // 빈 값이면 행 자체 표시 안 함 (애드센스 친화)
  if (!value || !value.trim()) return null;

  return (
    <div className="specRow">
      <div className="specKey">{keyName}</div>
      <div className={`specVal ${mono ? 'mono' : ''}`}>{value}</div>
    </div>
  );
}

// ============================================================
// FullPromptBox (박 대표님 자산 100% 보존)
// ============================================================
function FullPromptBox({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);

  // 빈 콘텐츠면 박스 자체 표시 안 함 (애드센스 친화)
  if (!content || !content.trim()) return null;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div>
      <div className="fullPromptHead">
        <span className="fullPromptLabel">▍ {label}</span>
        <button
          type="button"
          onClick={handleCopy}
          className={`copyBtn ${copied ? 'copied' : ''}`}
        >
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="fullPromptBody">{content}</pre>
    </div>
  );
}
