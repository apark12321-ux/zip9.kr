'use client';

// ============================================================
// NuTube v8.4 - Cinematic Scenario Display
// Studio Treatment Style:
// - 모노크롬 (블랙·화이트·앰버 1색)
// - 세리프 타이포그래피
// - 세로줄 제철 주석
// - 영문 캡션 라벨
// - 이모지 0
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
      <style jsx>{`
        .treatmentDoc {
          background: #ffffff;
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          color: #0a0a0a;
        }

        /* ============================================ */
        /* HEADER (Document Title) */
        /* ============================================ */
        .docHeader {
          padding: 28px 0 24px;
          border-bottom: 2px solid #0a0a0a;
          margin-bottom: 0;
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
        @media (max-width: 600px) {
          .docKicker { font-size: 10px; }
        }

        .docTitle {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.025em;
          line-height: 1.3;
          margin: 0;
        }
        @media (max-width: 600px) {
          .docTitle { font-size: 20px; }
        }

        /* ============================================ */
        /* SPEC BAR (Runtime / Retention 메타데이터) */
        /* ============================================ */
        .specBar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 16px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        @media (max-width: 600px) {
          .specBar { grid-template-columns: 1fr 1fr; gap: 12px; padding: 14px 0; }
        }

        .specCell {
          padding: 0 12px;
          border-right: 1px solid #e5e5e5;
        }
        .specCell:last-child {
          border-right: none;
        }
        @media (max-width: 600px) {
          .specCell {
            padding: 0 8px;
            border-right: 1px solid #e5e5e5;
          }
          .specCell:nth-child(2) { border-right: none; }
          .specCell:nth-child(3) { 
            grid-column: 1 / -1; 
            border-right: none;
            border-top: 1px solid #e5e5e5;
            padding-top: 12px;
            margin-top: 4px;
          }
        }

        .specLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #737373;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .specValue {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.015em;
        }
        @media (max-width: 600px) {
          .specValue { font-size: 14px; }
        }

        /* ============================================ */
        /* SECTION (Numbered) */
        /* ============================================ */
        .section {
          padding: 24px 0;
          border-bottom: 1px solid #e5e5e5;
          display: flex;
          gap: 24px;
        }
        @media (max-width: 600px) {
          .section { padding: 20px 0; gap: 0; flex-direction: column; }
        }

        .sectionNum {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #0a0a0a;
          flex-shrink: 0;
          padding-top: 4px;
          width: 36px;
        }
        @media (max-width: 600px) {
          .sectionNum {
            display: inline-block;
            margin-bottom: 8px;
            width: auto;
          }
          .sectionNum::after {
            content: ' ';
          }
        }

        .sectionMain {
          flex: 1;
          min-width: 0;
        }

        .sectionLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #c2410c;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

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
          font-size: 18px;
          font-weight: 600;
          color: #0a0a0a;
          line-height: 1.65;
          letter-spacing: -0.02em;
          padding-left: 14px;
          border-left: 2px solid #c2410c;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .loglineText { font-size: 15px; padding-left: 12px; }
        }

        /* ============================================ */
        /* EMOTIONAL ARC */
        /* ============================================ */
        .arcText {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13.5px;
          color: #404040;
          line-height: 1.8;
          letter-spacing: 0.02em;
          font-weight: 500;
        }
        @media (max-width: 600px) {
          .arcText { font-size: 12px; line-height: 1.75; }
        }

        /* ============================================ */
        /* ALGORITHMIC INTENT (collapsible) */
        /* ============================================ */
        .algoToggle {
          background: transparent;
          border: 1px solid #0a0a0a;
          padding: 12px 16px;
          width: 100%;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: #0a0a0a;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
          transition: all 0.15s;
        }
        .algoToggle:hover {
          background: #0a0a0a;
          color: #ffffff;
        }
        .algoToggle.open {
          background: #0a0a0a;
          color: #ffffff;
        }

        .algoBody {
          background: #fafafa;
          border-left: 2px solid #c2410c;
          padding: 16px 18px;
        }
        @media (max-width: 600px) {
          .algoBody { padding: 14px 16px; }
        }

        .algoText {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          line-height: 1.75;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .algoText { font-size: 13px; line-height: 1.7; }
        }

        /* ============================================ */
        /* RETENTION TARGET (게이지 라인) */
        /* ============================================ */
        .retentionRow {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 14px;
        }
        .retentionNum {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 36px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.04em;
          line-height: 1;
        }
        @media (max-width: 600px) {
          .retentionNum { font-size: 30px; }
        }
        .retentionUnit {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #737373;
          letter-spacing: 0.05em;
        }
        .retentionThreshold {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          color: #c2410c;
          letter-spacing: 0.08em;
          margin-left: auto;
          align-self: center;
        }
        @media (max-width: 600px) {
          .retentionThreshold { font-size: 10px; }
        }

        .retentionLine {
          height: 2px;
          background: #f5f5f5;
          position: relative;
          margin-bottom: 10px;
        }
        .retentionFill {
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          background: #0a0a0a;
          transition: width 0.6s ease-out;
        }
        .retentionMarker {
          position: absolute;
          top: -4px;
          width: 1px;
          height: 10px;
          background: #c2410c;
        }
        .retentionMarker::after {
          content: 'TIPPING POINT';
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 8.5px;
          color: #c2410c;
          letter-spacing: 0.1em;
          white-space: nowrap;
          font-weight: 600;
        }

        .retentionNote {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 12.5px;
          color: #525252;
          line-height: 1.7;
          font-style: italic;
          margin: 18px 0 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .retentionNote { font-size: 12px; }
        }

        /* ============================================ */
        /* BEATS (Shot Sheet 스타일) */
        /* ============================================ */
        .beatsList {
          display: flex;
          flex-direction: column;
        }

        .beat {
          border-top: 1px solid #e5e5e5;
        }
        .beat:first-child {
          border-top: none;
        }

        .beatHead {
          width: 100%;
          background: transparent;
          border: none;
          padding: 16px 0;
          cursor: pointer;
          font-family: inherit;
          text-align: left;
          display: grid;
          grid-template-columns: 56px 1fr auto;
          gap: 16px;
          align-items: start;
          transition: background 0.15s;
        }
        .beatHead:hover {
          background: #fafafa;
        }
        @media (max-width: 600px) {
          .beatHead { 
            padding: 14px 0; 
            grid-template-columns: 40px 1fr auto;
            gap: 12px;
          }
        }

        .beatNum {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 11.5px;
          font-weight: 700;
          color: #c2410c;
          letter-spacing: 0.1em;
          padding-top: 2px;
        }
        @media (max-width: 600px) {
          .beatNum { font-size: 10.5px; }
        }

        .beatHeadInfo {
          min-width: 0;
        }

        .beatTitle {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.02em;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        @media (max-width: 600px) {
          .beatTitle { font-size: 14.5px; }
        }

        .beatPurpose {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 13px;
          color: #525252;
          line-height: 1.55;
          font-style: italic;
          word-break: keep-all;
          margin: 0;
        }
        @media (max-width: 600px) {
          .beatPurpose { font-size: 12px; }
        }

        .beatTime {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          color: #737373;
          letter-spacing: 0.05em;
          padding-top: 4px;
          white-space: nowrap;
        }
        @media (max-width: 600px) {
          .beatTime { font-size: 10px; padding-top: 2px; }
        }

        .beatBody {
          padding: 0 0 24px 56px;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        @media (max-width: 600px) {
          .beatBody { padding: 0 0 20px 0; gap: 16px; }
        }

        /* 비트 안의 섹션 (Narration / Visual / Algorithmic / Bridge) */
        .beatSection {
          padding-left: 14px;
          border-left: 2px solid #e5e5e5;
        }
        .beatSection.narration {
          border-left-color: #0a0a0a;
        }
        .beatSection.algo {
          border-left-color: #c2410c;
        }
        .beatSection.bridge {
          border-left-color: #c2410c;
          background: #fffbeb;
          padding: 12px 14px;
          border-left-width: 2px;
        }

        .beatSectionLabel {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #737373;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .beatSection.narration .beatSectionLabel { color: #0a0a0a; }
        .beatSection.algo .beatSectionLabel { color: #c2410c; }
        .beatSection.bridge .beatSectionLabel { color: #c2410c; }

        .beatSectionContent {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          color: #0a0a0a;
          line-height: 1.75;
          margin: 0;
          word-break: keep-all;
        }
        @media (max-width: 600px) {
          .beatSectionContent { font-size: 13px; line-height: 1.7; }
        }

        .beatSection.narration .beatSectionContent {
          font-style: italic;
          font-weight: 500;
        }

        .beatSection.bridge .beatSectionContent {
          font-style: italic;
          color: #78350f;
          font-size: 13px;
        }
        @media (max-width: 600px) {
          .beatSection.bridge .beatSectionContent { font-size: 12.5px; }
        }

        /* ============================================ */
        /* SHORTS BLOCK */
        /* ============================================ */
        .shortsBlock {
          margin-top: 0;
          padding: 24px 0 8px;
        }

        .shortsContent {
          background: #0a0a0a;
          color: #fafafa;
          padding: 20px 22px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 14px;
          line-height: 1.85;
          white-space: pre-line;
          word-break: keep-all;
          margin-top: 14px;
        }
        @media (max-width: 600px) {
          .shortsContent { padding: 18px; font-size: 13px; line-height: 1.75; }
        }

        /* ============================================ */
        /* COPY BUTTON */
        /* ============================================ */
        .copyBtn {
          background: transparent;
          border: 1px solid #0a0a0a;
          color: #0a0a0a;
          padding: 7px 14px;
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.15s;
        }
        .copyBtn:hover {
          background: #0a0a0a;
          color: #ffffff;
        }
        .copyBtn.copied {
          background: #c2410c;
          border-color: #c2410c;
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .copyBtn { font-size: 10px; padding: 6px 12px; }
        }

        .copyBtnInverse {
          background: transparent;
          border: 1px solid #fafafa;
          color: #fafafa;
        }
        .copyBtnInverse:hover {
          background: #fafafa;
          color: #0a0a0a;
        }

        /* Bridge note */
        .bridgeNote {
          font-family: 'Pretendard', -apple-system, system-ui, sans-serif;
          font-size: 9.5px;
          color: #737373;
          letter-spacing: 0.08em;
          margin-top: 6px;
          text-transform: uppercase;
        }
      `}</style>

      {/* DOCUMENT HEADER */}
      <div className="docHeader">
        <div className="docKicker">▍ Cinematic Treatment</div>
        <h2 className="docTitle">Scenario Breakdown — Algorithm Backed</h2>
      </div>

      {/* SPEC BAR */}
      <div className="specBar">
        <div className="specCell">
          <div className="specLabel">RUNTIME</div>
          <div className="specValue">3:30</div>
        </div>
        <div className="specCell">
          <div className="specLabel">RETENTION</div>
          <div className="specValue">{scenario.estimatedRetention}<span style={{ fontSize: '0.6em', color: '#737373' }}>%</span></div>
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
// 개별 비트 블록
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
// 복사 버튼
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
