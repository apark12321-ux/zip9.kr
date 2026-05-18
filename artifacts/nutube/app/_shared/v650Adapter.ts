// ============================================================
// NuTube v6.5.0 - Engine Adapter
// 기존 contentEngine.ts와 v6.5.0 엔진을 연결하는 어댑터
// 박 대표님 자산 100% 보존 + v6.5.0 추가 기능
// ============================================================

import { generateCinematicScenario, type CinematicScenario, type ScenarioBeat } from './scenarioEngine_v6_5_0';
import { generateSNSFormatPackage, type SNSFormatPackage } from './snsFormatGenerator_v6_5_0';
import { generateCinematicPrompts, type CinematicPromptPackage } from './promptEngine_v6_5_0';

// ============================================================
// SeqType: contentEngine.ts의 generateVideoSequences 반환 타입과 호환
// ============================================================
export interface SeqTypeCompatible {
  number: number;
  title: string;
  duration: string;
  purpose: string;
  script: string;
  tip: string;
  imagePromptKr: string;
  imagePromptEn: string;
  videoPromptKr: string;
  videoPromptEn: string;
}

// ============================================================
// v6.5.0 시나리오 → SeqType 호환 형식으로 변환
// 기존 STEP 3 UI에 그대로 들어갈 수 있도록 어댑팅
// ============================================================
export function adaptCinematicToSequences(
  scenario: CinematicScenario,
  prompts: CinematicPromptPackage
): SeqTypeCompatible[] {
  return scenario.beats.map((beat: ScenarioBeat, idx: number) => {
    // 다음 비트로의 브리지를 tip 영역에 추가하여 흐름이 보이게 함
    const tipText = beat.bridgeToNext
      ? `💡 알고리즘 후킹: ${beat.algorithmHook}\n🎯 시청 유지 목표: ${beat.retentionTarget}\n🔗 다음 장으로 이어지는 한 마디: "${beat.bridgeToNext}"`
      : `💡 알고리즘 후킹: ${beat.algorithmHook}\n🎯 시청 유지 목표: ${beat.retentionTarget}`;
    
    return {
      number: beat.id,
      title: beat.beatName,
      duration: beat.timeRange,
      purpose: beat.purpose,
      script: beat.narration,
      tip: tipText,
      // 프롬프트는 v6.5.0 전문가급 사용
      imagePromptKr: extractKrPromptForBeat(beat, prompts),
      imagePromptEn: extractEnPromptForBeat(beat, prompts),
      videoPromptKr: extractVideoKrForBeat(beat, prompts),
      videoPromptEn: extractVideoEnForBeat(beat, prompts),
    };
  });
}

// ============================================================
// 비트별 프롬프트 추출
// ============================================================
function extractKrPromptForBeat(beat: ScenarioBeat, prompts: CinematicPromptPackage): string {
  // 한글 시각 디렉션 (시니어가 읽기 편하게)
  return `[${beat.timeRange}] ${beat.beatName}

장면: ${beat.visualDirection}

촬영 가이드:
• 카메라: ${prompts.midjourney.cameraSpec}
• 조명: ${prompts.midjourney.lighting}
• 색감: ${prompts.midjourney.colorPalette}
• 분위기: ${prompts.midjourney.mood}
• 구도: ${prompts.midjourney.composition}`;
}

function extractEnPromptForBeat(beat: ScenarioBeat, prompts: CinematicPromptPackage): string {
  // Midjourney v7 그대로 복붙 가능한 풀 프롬프트
  return prompts.midjourney.fullPrompt;
}

function extractVideoKrForBeat(beat: ScenarioBeat, prompts: CinematicPromptPackage): string {
  return `[${beat.timeRange}] ${beat.beatName} - 영상 연출

샷 타입: ${prompts.sora.shotType}
카메라 무브: ${prompts.sora.cameraMovement}
렌즈: ${prompts.sora.lensSpec}
조명: ${prompts.sora.lighting}
색감: ${prompts.sora.colorGrading}
페이싱: ${prompts.sora.pacing}
사운드: ${prompts.sora.audioDirection}

장면 묘사: ${beat.visualDirection}`;
}

function extractVideoEnForBeat(beat: ScenarioBeat, prompts: CinematicPromptPackage): string {
  // Sora 2 / VEO 3 둘 다 사용 가능한 시네마틱 프롬프트
  return prompts.sora.fullPrompt + '\n\n---\n[VEO 3 alternative]\n' + prompts.veo.fullPrompt;
}

// ============================================================
// v6.5.0 통합 데이터 패키지 (한 번에 모든 데이터 생성)
// ============================================================
export interface V650DataPackage {
  scenario: CinematicScenario;
  prompts: CinematicPromptPackage;
  sns: SNSFormatPackage;
  adaptedSequences: SeqTypeCompatible[];
}

export function generateV650Data(
  keyword: string,
  selectedTitle: string,
  category?: string
): V650DataPackage {
  // 1. 작가급 시나리오
  const scenario = generateCinematicScenario(keyword, selectedTitle, category);
  
  // 2. 전문가급 프롬프트
  const prompts = generateCinematicPrompts(
    keyword,
    selectedTitle,
    `${selectedTitle} 컨셉의 핵심 비주얼 장면`,
    category
  );
  
  // 3. SNS 4종 포맷
  const sns = generateSNSFormatPackage(
    keyword,
    selectedTitle,
    scenario.logline,
    category
  );
  
  // 4. 기존 STEP 3 UI에 호환되는 SeqType 배열로 어댑팅
  const adaptedSequences = adaptCinematicToSequences(scenario, prompts);
  
  return {
    scenario,
    prompts,
    sns,
    adaptedSequences,
  };
}
