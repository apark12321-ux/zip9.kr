'use client';

// ============================================================
// NuTube v6.5.1 - Cinematic Scenario Display (PROFESSIONAL PANEL)
//
// 박 대표님 v10.7 메인 페이지 ENGINE PANEL 디자인과 일관성:
// - 패널 상단 바 (브라우저 윈도우 스타일)
// - 명확한 영역 경계
// - 모노스페이스 라벨 + Pretendard 본문
// - 검정/주황/노랑/초록 4색 시스템
//
// 박 대표님 자산 100% 보존:
// - CinematicScenario 인터페이스
// - 모든 함수 (BeatBlock, CopyButton)
// - 데이터 흐름 (scenario.beats, scenario.logline 등)
// - props 시그니처
// ============================================================

import React, { useState } from 'react';
import type { CinematicScenario } from './scenarioEngine_v6_5_0';

interface ScenarioDisplayProps {
  scenario: CinematicScenario;
}

export function CinematicScenarioDisplay({ scenario }: ScenarioDisplayProps) {
  const [expandedBeat, setExpandedBeat] = useState<number | null>(1);
  const [showAlgorithm, setShowAlgorithm] = useState(false);

  return (
    <div className="treatmentDoc">
      <style jsx global>{`
        .treatmentDoc {
          background: #ffffff;
          border: 1px solid #d4d4d4;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
          margin: 16px 0;
        }
        @media (max-width: 600px) {
          .treatmentDoc { margin: 12px 0; }
        }

        /* ============================================ */
        /* PANEL TOP BAR */
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
        @media (max-width: 600px) { .panelBar { padding: 7px 12px; } }

        .panelBarLeft {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .panelDot {
          width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
        }
        .panelDot--red { background: #ef4444; }
        .panelDot--yellow { background: #f59e0b; }
        .panelDot--green { background: #22c55e; }

        .panelBarTitle {
          margin-left: 8px;
          font-size: 11px;
          color: #525252;
          font-weight: 500;
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
          width: 6px; height: 6px;
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
        /* DOC HEADER */
        /* ============================================ */
        .docHeader {
          padding: 22px 24px 18px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) { .docHeader { padding: 18px 18px 14px; } }

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
        /* SPEC BAR (3개 메트릭) */
        /* ============================================ */
        .specBar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          background: #0a0a0a;
        }

        .specCell {
          padding: 18px 20px;
          color: #ffffff;
          border-right: 1px solid #404040;
          text-align: left;
        }
        .specCell:last-child { border-right: none; }
        @media (max-width: 600px) {
          .specCell { padding: 14px 14px; }
        }

        .specLabel {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 9.5px;
          font-weight: 700;
          color: #fbbf24;
          letter-spacing: 0.18em;
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .specLabel { font-size: 8.5px; letter-spacing: 0.12em; } }

        .specValue {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.025em;
          line-height: 1;
        }
        @media (max-width: 600px) { .specValue { font-size: 18px; } }

        /* ============================================ */
        /* SECTIONS */
        /* ============================================ */
        .section {
          display: grid;
          grid-template-columns: 60px 1fr;
          gap: 14px;
          padding: 22px 24px;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .section {
            padding: 18px 18px;
            grid-template-columns: 44px 1fr;
            gap: 10px;
          }
        }

        .sectionNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 28px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          line-height: 1;
        }
        @media (max-width: 600px) { .sectionNum { font-size: 22px; } }

        .sectionMain { min-width: 0; }

        .sectionLabel {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.22em;
          color: #c2410c;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .sectionLabel { font-size: 10px; } }

        .sectionDivider {
          width: 28px;
          height: 1px;
          background: #0a0a0a;
          margin-bottom: 14px;
        }

        /* ============================================ */
        /* LOGLINE */
        /* ============================================ */
        .loglineText {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #0a0a0a;
          line-height: 1.6;
          letter-spacing: -0.02em;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .loglineText { font-size: 15px; } }

        /* ============================================ */
        /* EMOTIONAL ARC */
        /* ============================================ */
        .arcText {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14.5px;
          color: #404040;
          line-height: 1.7;
          font-weight: 500;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .arcText { font-size: 13.5px; } }

        /* ============================================ */
        /* ALGORITHM TOGGLE */
        /* ============================================ */
        .algoToggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 12px 14px;
          background: #fafafa;
          color: #0a0a0a;
          border: 1px solid #e5e5e5;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          cursor: pointer;
          transition: all 0.15s;
          text-transform: uppercase;
        }
        @media (max-width: 600px) {
          .algoToggle { font-size: 9.5px; padding: 10px 12px; letter-spacing: 0.12em; }
        }

        .algoToggle:hover {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }

        .algoToggle.open {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }

        .algoBody {
          margin-top: 10px;
          padding: 14px 16px;
          background: #1a1a1a;
          color: #e5e5e5;
          border: 1px solid #404040;
        }
        @media (max-width: 600px) {
          .algoBody { padding: 12px 14px; }
        }

        .algoText {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12.5px;
          line-height: 1.7;
          margin: 0;
          word-break: keep-all;
          overflow-wrap: anywhere;
        }
        @media (max-width: 600px) { .algoText { font-size: 11.5px; } }

        /* ============================================ */
        /* RETENTION BAR */
        /* ============================================ */
        .retentionRow {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .retentionNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 36px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        @media (max-width: 600px) { .retentionNum { font-size: 28px; } }

        .retentionUnit {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #525252;
          letter-spacing: -0.005em;
        }
        @media (max-width: 600px) { .retentionUnit { font-size: 12px; } }

        .retentionThreshold {
          margin-left: auto;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          color: #dc2626;
          letter-spacing: 0.12em;
        }
        @media (max-width: 600px) {
          .retentionThreshold { font-size: 9.5px; margin-left: 0; }
        }

        .retentionLine {
          position: relative;
          height: 8px;
          background: #fafafa;
          border: 1px solid #e5e5e5;
          margin-bottom: 12px;
          overflow: hidden;
        }

        .retentionFill {
          position: absolute;
          top: 0; left: 0;
          height: 100%;
          background: linear-gradient(90deg, #c2410c 0%, #fbbf24 100%);
          transition: width 1s ease-out;
        }

        .retentionMarker {
          position: absolute;
          top: -3px;
          width: 2px;
          height: 14px;
          background: #dc2626;
        }

        .retentionNote {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12.5px;
          color: #737373;
          line-height: 1.65;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .retentionNote { font-size: 11.5px; } }

        /* ============================================ */
        /* BEATS LIST */
        /* ============================================ */
        .beatsList {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .beat {
          background: #ffffff;
          border: 1px solid #e5e5e5;
        }

        .beatHead {
          display: grid;
          grid-template-columns: 50px 1fr 70px;
          gap: 14px;
          padding: 14px 16px;
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          align-items: center;
          text-align: left;
          transition: background 0.15s;
        }
        @media (max-width: 600px) {
          .beatHead {
            grid-template-columns: 40px 1fr 56px;
            gap: 10px;
            padding: 12px 12px;
          }
        }
        .beatHead:hover {
          background: #fafafa;
        }

        .beatNum {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 13px;
          font-weight: 800;
          color: #c2410c;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .beatNum { font-size: 11.5px; } }

        .beatHeadInfo { min-width: 0; }

        .beatTitle {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          font-weight: 800;
          color: #0a0a0a;
          letter-spacing: -0.015em;
          line-height: 1.4;
          margin-bottom: 3px;
        }
        @media (max-width: 600px) { .beatTitle { font-size: 13px; } }

        .beatPurpose {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 11.5px;
          color: #737373;
          line-height: 1.5;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .beatPurpose { font-size: 11px; } }

        .beatTime {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #525252;
          letter-spacing: 0.05em;
          text-align: right;
        }
        @media (max-width: 600px) { .beatTime { font-size: 10px; } }

        .beatBody {
          padding: 0 16px 16px;
          border-top: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) { .beatBody { padding: 0 12px 12px; } }

        .beatSection {
          padding: 14px 0;
          border-bottom: 1px dashed #e5e5e5;
        }
        .beatSection:last-child { border-bottom: none; }

        .beatSection.narration { background: #fafafa; padding: 14px; margin: 14px -16px 0; }
        .beatSection.algo { background: #fff7ed; padding: 14px; margin: 14px -16px; }
        .beatSection.bridge {
          background: #f0fdf4;
          padding: 14px;
          margin: 14px -16px 0;
          border-left: 3px solid #16a34a;
        }
        @media (max-width: 600px) {
          .beatSection.narration,
          .beatSection.algo,
          .beatSection.bridge { margin: 14px -12px; padding: 12px; }
        }

        .beatSectionLabel {
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 9.5px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.18em;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        @media (max-width: 600px) { .beatSectionLabel { font-size: 9px; letter-spacing: 0.12em; } }

        .beatSection.algo .beatSectionLabel { color: #ea580c; }
        .beatSection.bridge .beatSectionLabel { color: #16a34a; }

        .beatSectionContent {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13.5px;
          color: #0a0a0a;
          line-height: 1.65;
          margin: 0;
          font-weight: 500;
          word-break: keep-all;
        }
        @media (max-width: 600px) { .beatSectionContent { font-size: 12.5px; } }

        .bridgeNote {
          margin-top: 6px;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10.5px;
          font-weight: 700;
          color: #16a34a;
          letter-spacing: 0.05em;
        }
        @media (max-width: 600px) { .bridgeNote { font-size: 9.5px; } }

        /* ============================================ */
        /* SHORTS / CUTDOWN */
        /* ============================================ */
        .shortsContent {
          padding: 16px 18px;
          background: #1a1a1a;
          color: #e5e5e5;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 12px;
          line-height: 1.75;
          border: 1px solid #404040;
          margin-bottom: 10px;
          word-break: keep-all;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }
        @media (max-width: 600px) {
          .shortsContent {
            font-size: 10.5px;
            padding: 12px 12px;
            line-height: 1.7;
          }
        }

        /* ============================================ */
        /* COPY BUTTON */
        /* ============================================ */
        .copyBtn {
          padding: 6px 12px;
          background: #ffffff;
          color: #0a0a0a;
          border: 1px solid #d4d4d4;
          font-family: 'SF Mono', 'Consolas', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.15s;
          margin-top: 8px;
        }
        @media (max-width: 600px) { .copyBtn { font-size: 9.5px; padding: 5px 10px; } }

        .copyBtn:hover {
          background: #0a0a0a;
          color: #ffffff;
          border-color: #0a0a0a;
        }
        .copyBtn.copied {
          background: #16a34a;
          color: #ffffff;
          border-color: #16a34a;
        }

        .copyBtn.copyBtnInverse {
          background: #fbbf24;
          color: #0a0a0a;
          border-color: #fbbf24;
        }
        .copyBtn.copyBtnInverse:hover {
          background: #ffffff;
          border-color: #fbbf24;
        }
      `}</style>

      {/* PANEL TOP BAR */}
      <div className="panelBar">
        <div className="panelBarLeft">
          <span className="panelDot panelDot--red" />
          <span className="panelDot panelDot--yellow" />
          <span className="panelDot panelDot--green" />
          <span className="panelBarTitle">scenario-treatment.spec</span>
        </div>
        <div className="panelBarRight">
          <span className="panelBadge">v6.5</span>
          <span className="panelLive">
            <span className="panelLiveDot" />
            READY
          </span>
        </div>
      </div>

      {/* DOCUMENT HEADER */}
      <div className="docHeader">
        <div className="docKicker">▍ Cinematic Treatment</div>
        <h2 className="docTitle">
          Scenario Breakdown — <span className="docTitleAccent">Algorithm Backed</span>
        </h2>
      </div>

      {/* SPEC BAR */}
      <div className="specBar">
        <div className="specCell">
          <div className="specLabel">RUNTIME</div>
          <div className="specValue">3:30</div>
        </div>
        <div className="specCell">
          <div className="specLabel">RETENTION</div>
          <div className="specValue">{scenario.estimatedRetention}<span style={{ fontSize: '0.6em', color: '#fbbf24' }}>%</span></div>
        </div>
        <div className="specCell">
          <div className="specLabel">STRUCTURE</div>
          <div className="specValue">6 Beats</div>
        </div>
      </div>

      {/* 01 LOGLINE */}
      <div className="section">
        <div className="sectionNum">01</div>
        <div className="sectionMain">
          <div className="sectionLabel">Logline</div>
          <div className="sectionDivider" />
          <p className="loglineText">{scenario.logline}</p>
        </div>
      </div>

      {/* 02 EMOTIONAL ARC */}
      <div className="section">
        <div className="sectionNum">02</div>
        <div className="sectionMain">
          <div className="sectionLabel">Emotional Arc</div>
          <div className="sectionDivider" />
          <div className="arcText">{scenario.emotionalArc}</div>
        </div>
      </div>

      {/* 03 ALGORITHMIC INTENT */}
      <div className="section">
        <div className="sectionNum">03</div>
        <div className="sectionMain">
          <div className="sectionLabel">Algorithmic Intent</div>
          <div className="sectionDivider" />
          <button
            type="button"
            className={`algoToggle ${showAlgorithm ? 'open' : ''}`}
            onClick={() => setShowAlgorithm(!showAlgorithm)}
          >
            <span>{showAlgorithm ? 'HIDE TECHNICAL NOTES' : 'REVEAL TECHNICAL NOTES'}</span>
            <span>{showAlgorithm ? '—' : '+'}</span>
          </button>
          {showAlgorithm && (
            <div className="algoBody">
              <p className="algoText">{scenario.hiddenAlgorithm}</p>
            </div>
          )}
        </div>
      </div>

      {/* 04 RETENTION TARGET */}
      <div className="section">
        <div className="sectionNum">04</div>
        <div className="sectionMain">
          <div className="sectionLabel">Retention Target</div>
          <div className="sectionDivider" />
          <div className="retentionRow">
            <span className="retentionNum">{scenario.estimatedRetention}</span>
            <span className="retentionUnit">% projected</span>
            <span className="retentionThreshold">▍ 40% threshold</span>
          </div>
          <div className="retentionLine">
            <div className="retentionFill" style={{ width: `${scenario.estimatedRetention}%` }} />
            <div className="retentionMarker" style={{ left: '40%' }} />
          </div>
          <p className="retentionNote">
            YouTube's recommendation engine begins surfacing content above the 40% retention threshold.
            This scenario is calibrated to break through that ceiling.
          </p>
        </div>
      </div>

      {/* 05 BEATS */}
      <div className="section">
        <div className="sectionNum">05</div>
        <div className="sectionMain">
          <div className="sectionLabel">Six Beat Structure</div>
          <div className="sectionDivider" />
          <div className="beatsList">
            {scenario.beats.map((beat, idx) => (
              <BeatBlock
                key={beat.id}
                beat={beat}
                isExpanded={expandedBeat === beat.id}
                onToggle={() => setExpandedBeat(expandedBeat === beat.id ? null : beat.id)}
                isLast={idx === scenario.beats.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 06 SHORTS VERSION */}
      <div className="section" style={{ borderBottom: 'none' }}>
        <div className="sectionNum">06</div>
        <div className="sectionMain">
          <div className="sectionLabel">60-Second Cutdown</div>
          <div className="sectionDivider" />
          <div className="shortsContent">{scenario.shortVersion}</div>
          <CopyButton text={scenario.shortVersion} label="Copy Cutdown" inverse />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// BeatBlock (박 대표님 자산 100% 보존)
// ============================================================
function BeatBlock({ beat, isExpanded, onToggle, isLast }: {
  beat: any;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  return (
    <div className="beat">
      <button
        type="button"
        className="beatHead"
        onClick={onToggle}
      >
        <div className="beatNum">B0{beat.id}</div>
        <div className="beatHeadInfo">
          <div className="beatTitle">{beat.beatName}</div>
          <p className="beatPurpose">{beat.purpose}</p>
        </div>
        <div className="beatTime">{beat.timeRange}</div>
      </button>

      {isExpanded && (
        <div className="beatBody">
          <div className="beatSection narration">
            <div className="beatSectionLabel">Narration</div>
            <p className="beatSectionContent">"{beat.narration}"</p>
            <CopyButton text={beat.narration} label="Copy Line" />
          </div>

          <div className="beatSection">
            <div className="beatSectionLabel">Visual Direction</div>
            <p className="beatSectionContent">{beat.visualDirection}</p>
          </div>

          <div className="beatSection algo">
            <div className="beatSectionLabel">Algorithmic Hook</div>
            <p className="beatSectionContent">{beat.algorithmHook}</p>
          </div>

          <div className="beatSection">
            <div className="beatSectionLabel">Retention Target</div>
            <p className="beatSectionContent">{beat.retentionTarget}</p>
          </div>

          {!isLast && (
            <div className="beatSection bridge">
              <div className="beatSectionLabel">▾ Bridge to Next Beat</div>
              <p className="beatSectionContent">"{beat.bridgeToNext}"</p>
              <div className="bridgeNote">→ Connects to B0{beat.id + 1}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CopyButton (박 대표님 자산 100% 보존)
// ============================================================
function CopyButton({ text, label = 'COPY', inverse = false }: {
  text: string;
  label?: string;
  inverse?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copyBtn ${copied ? 'copied' : ''} ${inverse ? 'copyBtnInverse' : ''}`}
    >
      {copied ? '✓ COPIED' : label}
    </button>
  );
}
