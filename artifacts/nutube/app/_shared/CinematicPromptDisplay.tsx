'use client';

// ============================================================
// NuTube v8.4 - Cinematic Prompt Display
// Studio Treatment Style:
// - Cinematography Brief 컨셉
// - 모노크롬 (블랙·화이트·앰버)
// - 세리프 + 모노 혼합 타이포그래피
// - 영문 캡션 라벨
// - 이모지 0
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
      <style jsx>{`
        .briefDoc {
          background: #ffffff;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
        }

        /* ============================================ */
        /* HEADER */
        /* ============================================ */
        .docHeader {
          padding: 28px 0 24px;
          border-bottom: 2px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .docHeader { padding: 22px 0 18px; }
        }

        .docKicker {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: #c2410c;
          margin-bottom: 8px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .docKicker { font-size: 10px; } }

        .docTitle {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0;
        }
        @media (max-width: 600px) { .docTitle { font-size: 20px; } }

        /* ============================================ */
        /* RATIONALE BLOCK */
        /* ============================================ */
        .rationaleBlock {
          padding: 24px 0;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          gap: 24px;
        }
        @media (max-width: 600px) {
          .rationaleBlock { padding: 20px 0; gap: 0; flex-direction: column; }
        }

        .rationaleNum {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #0a0a0a;
          flex-shrink: 0;
          width: 36px;
          padding-top: 4px;
        }
        @media (max-width: 600px) {
          .rationaleNum { display: inline-block; width: auto; margin-bottom: 8px; }
        }

        .rationaleMain {
          flex: 1;
          min-width: 0;
        }

        .rationaleLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .rationaleDivider {
          width: 28px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 14px;
        }

        .rationaleContent {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          line-height: 1.85;
          white-space: pre-line;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .rationaleContent { font-size: 13px; line-height: 1.75; }
        }

        .rationaleContent :global(strong) {
          font-weight: 800;
          color: #0a0a0a;
          text-decoration: underline;
          text-decoration-color: #c2410c;
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }

        /* ============================================ */
        /* TAB ROW */
        /* ============================================ */
        .tabSection {
          padding: 24px 0 0;
        }
        .tabSectionLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .tabSectionDivider {
          width: 28px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 16px;
        }

        .tabRow {
          display: flex;
          gap: 0;
          border-top: 1px solid #0a0a0a;
          border-bottom: 1px solid #0a0a0a;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .tabBtn {
          flex: 1;
          min-width: 100px;
          padding: 14px 10px;
          background: transparent;
          border: none;
          border-right: 1px solid #e5e5e5;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #737373;
          cursor: pointer;
          transition: all 0.15s;
          text-transform: uppercase;
          text-align: center;
          line-height: 1.4;
        }
        .tabBtn:last-child {
          border-right: none;
        }
        .tabBtn:hover {
          background: #fafafa;
          color: #0a0a0a;
        }
        .tabBtn.active {
          background: #0a0a0a;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .tabBtn { 
            font-size: 9.5px; 
            padding: 12px 6px;
            min-width: 80px;
            letter-spacing: 0.08em;
          }
        }

        .tabSubtitle {
          display: block;
          font-size: 9px;
          font-weight: 500;
          margin-top: 3px;
          letter-spacing: 0.1em;
          opacity: 0.7;
        }
        @media (max-width: 600px) {
          .tabSubtitle { font-size: 8.5px; }
        }

        .tabBody {
          padding: 24px 0 8px;
        }
        @media (max-width: 600px) {
          .tabBody { padding: 20px 0 8px; }
        }

        /* ============================================ */
        /* FULL PROMPT (다크 박스) */
        /* ============================================ */
        .fullPromptHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #0a0a0a;
          color: #fafafa;
          border-bottom: 1px solid #262626;
        }
        @media (max-width: 600px) {
          .fullPromptHead { padding: 10px 14px; }
        }

        .fullPromptLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: #fbbf24;
          text-transform: uppercase;
        }

        .fullPromptBody {
          background: #0a0a0a;
          color: #fafafa;
          padding: 16px 20px 20px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12.5px;
          line-height: 1.85;
          white-space: pre-wrap;
          word-break: break-word;
          max-height: 280px;
          overflow-y: auto;
        }
        @media (max-width: 600px) {
          .fullPromptBody { padding: 14px 16px 16px; font-size: 11.5px; line-height: 1.75; max-height: 220px; }
        }

        /* ============================================ */
        /* SPECS TABLE (Cinematography Sheet 스타일) */
        /* ============================================ */
        .specsTitle {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          text-transform: uppercase;
          margin: 24px 0 8px;
        }

        .specsDivider {
          width: 28px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 16px;
        }

        .specsTable {
          border-top: 1px solid #0a0a0a;
        }

        .specRow {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 24px;
          padding: 14px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .specRow { 
            grid-template-columns: 100px 1fr; 
            gap: 14px;
            padding: 12px 0;
          }
        }

        .specKey {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          color: #737373;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding-top: 2px;
        }
        @media (max-width: 600px) {
          .specKey { font-size: 9.5px; letter-spacing: 0.08em; }
        }

        .specVal {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          line-height: 1.55;
          font-weight: 600;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .specVal { font-size: 13px; }
        }

        .specVal.mono {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12.5px;
          font-weight: 500;
          color: #c2410c;
        }
        @media (max-width: 600px) {
          .specVal.mono { font-size: 11.5px; }
        }

        /* ============================================ */
        /* META BLOCKS (시드, 네거티브, 사운드, 출력) */
        /* ============================================ */
        .metaBlock {
          margin-top: 18px;
          padding: 16px 18px;
          background: #fafafa;
          border-left: 2px solid #0a0a0a;
        }
        @media (max-width: 600px) {
          .metaBlock { padding: 14px 16px; }
        }

        .metaBlock.warning {
          border-left-color: #c2410c;
          background: #fff7ed;
        }

        .metaBlock.tech {
          border-left-color: #0a0a0a;
          background: #f5f5f5;
        }

        .metaLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #525252;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .metaBlock.warning .metaLabel { color: #c2410c; }

        .metaContent {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13px;
          color: #0a0a0a;
          line-height: 1.7;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .metaContent { font-size: 12.5px; }
        }

        .metaContent.mono {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 11.5px;
          color: #525252;
        }

        .metaInline {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding: 6px 0;
          border-bottom: 1px dashed #d4d4d4;
        }
        .metaInline:last-child { border-bottom: none; }
        .metaInlineKey {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          color: #737373;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .metaInlineVal {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12px;
          color: #0a0a0a;
          font-weight: 600;
        }

        /* ============================================ */
        /* FLOW SEQUENCE */
        /* ============================================ */
        .sequenceList {
          display: flex;
          flex-direction: column;
        }

        .sequenceRow {
          display: grid;
          grid-template-columns: 60px 1fr 80px;
          gap: 20px;
          padding: 16px 0;
          border-bottom: 1px solid #e5e5e5;
          align-items: start;
        }
        @media (max-width: 600px) {
          .sequenceRow { 
            grid-template-columns: 44px 1fr 60px; 
            gap: 12px;
            padding: 14px 0;
          }
        }

        .sequenceNum {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.1em;
          padding-top: 2px;
        }
        @media (max-width: 600px) {
          .sequenceNum { font-size: 10.5px; }
        }

        .sequenceDesc {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          line-height: 1.55;
          font-weight: 600;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .sequenceDesc { font-size: 13px; }
        }

        .sequenceDuration {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          color: #737373;
          letter-spacing: 0.08em;
          text-align: right;
          padding-top: 4px;
        }
        @media (max-width: 600px) {
          .sequenceDuration { font-size: 9.5px; }
        }

        /* ============================================ */
        /* NOTEBOOK GUIDE */
        /* ============================================ */
        .notebookGuide {
          padding: 14px 16px;
          background: #fffbeb;
          border-left: 2px solid #c2410c;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13px;
          color: #78350f;
          line-height: 1.7;
          margin-bottom: 16px;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .notebookGuide { font-size: 12.5px; padding: 12px 14px; }
        }

        .notebookGuide :global(strong) {
          font-weight: 800;
          color: #c2410c;
        }

        /* ============================================ */
        /* COPY BUTTON */
        /* ============================================ */
        .copyBtn {
          background: transparent;
          border: 1px solid #fafafa;
          color: #fafafa;
          padding: 5px 12px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }
        .copyBtn:hover {
          background: #fafafa;
          color: #0a0a0a;
        }
        .copyBtn.copied {
          background: #c2410c;
          border-color: #c2410c;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .copyBtn { font-size: 9.5px; padding: 5px 10px; }
        }
      `}</style>

      {/* DOC HEADER */}
      <div className="docHeader">
        <div className="docKicker">▍ Cinematography Brief</div>
        <h2 className="docTitle">AI Production Spec — Multi Engine</h2>
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
        <div className="tabSectionLabel">Engine Selection</div>
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
// Midjourney 패널
// ============================================================
function MidjourneyPanel({ data }: { data: any }) {
  return (
    <>
      <FullPromptBox label="Midjourney v7 — Full Prompt" content={data.fullPrompt} />
      
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

      <div className="metaBlock tech">
        <div className="metaInline">
          <span className="metaInlineKey">Seed</span>
          <span className="metaInlineVal">{data.seed}</span>
        </div>
      </div>

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
// Sora 패널
// ============================================================
function SoraPanel({ data }: { data: any }) {
  return (
    <>
      <FullPromptBox label="Sora 2 — Full Prompt" content={data.fullPrompt} />

      <div className="specsTitle">Direction Spec</div>
      <div className="specsDivider" />
      <div className="specsTable">
        <SpecRow keyName="Shot Type" value={data.shotType} />
        <SpecRow keyName="Subject" value={data.subject} />
        <SpecRow keyName="Action" value={data.action} />
        <SpecRow keyName="Camera Move" value={data.cameraMovement} />
        <SpecRow keyName="Lens" value={data.lensSpec} />
        <SpecRow keyName="Lighting" value={data.lighting} />
        <SpecRow keyName="Color Grade" value={data.colorGrading} />
        <SpecRow keyName="Pacing" value={data.pacing} />
      </div>

      {data.audioDirection && data.audioDirection.trim() && (
        <div className="metaBlock">
          <div className="metaLabel">Audio Direction</div>
          <div className="metaContent">{data.audioDirection}</div>
        </div>
      )}
    </>
  );
}

// ============================================================
// VEO 패널
// ============================================================
function VeoPanel({ data }: { data: any }) {
  return (
    <>
      <FullPromptBox label="Google VEO 3 — Full Prompt" content={data.fullPrompt} />
      
      <div className="specsTitle">Scene Spec</div>
      <div className="specsDivider" />
      <div className="specsTable">
        <SpecRow keyName="Scene" value={data.scene} />
        <SpecRow keyName="Visual Style" value={data.visualStyle} />
        <SpecRow keyName="Camera" value={data.cameraDirection} />
        <SpecRow keyName="Motion" value={data.motionLevel} />
      </div>

      {(data.duration || data.resolution || data.aspectRatio) && (
        <div className="metaBlock tech">
          <div className="metaLabel">Output Specifications</div>
          {data.duration && data.duration.trim() && (
            <div className="metaInline">
              <span className="metaInlineKey">Duration</span>
              <span className="metaInlineVal">{data.duration}</span>
            </div>
          )}
          {data.resolution && data.resolution.trim() && (
            <div className="metaInline">
              <span className="metaInlineKey">Resolution</span>
              <span className="metaInlineVal">{data.resolution}</span>
            </div>
          )}
          {data.aspectRatio && data.aspectRatio.trim() && (
            <div className="metaInline">
              <span className="metaInlineKey">Aspect Ratio</span>
              <span className="metaInlineVal">{data.aspectRatio}</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ============================================================
// Flow 패널
// ============================================================
function FlowPanel({ data }: { data: any }) {
  return (
    <>
      <div className="specsTitle">5 Scene Sequence</div>
      <div className="specsDivider" />
      <div className="sequenceList">
        {data.sceneSequence.map((scene: any, i: number) => (
          <div key={i} className="sequenceRow">
            <div className="sequenceNum">SC.{String(scene.scene).padStart(2, '0')}</div>
            <div className="sequenceDesc">{scene.description}</div>
            <div className="sequenceDuration">{scene.duration}</div>
          </div>
        ))}
      </div>

      <div className="specsTitle" style={{ marginTop: 28 }}>Sequence Direction</div>
      <div className="specsDivider" />
      <div className="specsTable">
        <SpecRow keyName="Transition" value={data.transitionStyle} />
        <SpecRow keyName="Overall Tone" value={data.overallTone} />
      </div>
    </>
  );
}

// ============================================================
// NotebookLM 패널
// ============================================================
function NotebookPanel({ data }: { data: string }) {
  return (
    <>
      <div className="notebookGuide">
        <strong>Usage:</strong> Paste this prompt into NotebookLM along with your video keyword.
        It will return a structured analysis of trending patterns and differentiation strategies.
      </div>
      <FullPromptBox label="NotebookLM — Analysis Prompt" content={data} />
    </>
  );
}

// ============================================================
// Spec Row (라벨 / 값 한 줄)
// ============================================================
function SpecRow({ keyName, value, mono }: {
  keyName: string;
  value: string;
  mono?: boolean;
}) {
  // 빈 값이면 행 자체 표시 안 함 (애드센스 친화 - 깔끔)
  if (!value || !value.trim()) return null;
  
  return (
    <div className="specRow">
      <div className="specKey">{keyName}</div>
      <div className={`specVal ${mono ? 'mono' : ''}`}>{value}</div>
    </div>
  );
}

// ============================================================
// 풀 프롬프트 박스 (다크 테마)
// ============================================================
function FullPromptBox({ label, content }: { label: string; content: string }) {
  const [copied, setCopied] = useState(false);

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
