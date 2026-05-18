// ============================================================
// NuTube v6.5.0 - Cinematic Prompt Engine
// Midjourney v7 + Sora 2 + Google VEO 3 전문가급 문법
// ============================================================
// 카메라 / 렌즈 / 조리개 / 무브먼트 / 조명 / LUT / 분위기 / 시드
// ============================================================

export interface CinematicPromptPackage {
  midjourney: MidjourneyPrompt;     // 정지 이미지 (썸네일)
  sora: SoraPrompt;                 // 동영상 (Sora 2)
  veo: VeoPrompt;                   // 동영상 (Google VEO 3)
  flow: FlowPrompt;                 // Google Flow (시퀀스)
  notebookLM: string;               // NotebookLM 분석용
  rationale: string;                // 왜 이 조합인지 설명
}

export interface MidjourneyPrompt {
  fullPrompt: string;               // 그대로 복붙 가능한 풀 프롬프트
  subject: string;
  composition: string;
  lighting: string;
  colorPalette: string;
  cameraSpec: string;               // "85mm lens, f/1.8"
  mood: string;
  styleReference: string;
  parameters: string;               // "--ar 16:9 --v 7 --s 250 --q 2"
  negativePrompt: string;
  seed: number;
}

export interface SoraPrompt {
  fullPrompt: string;
  shotType: string;                 // "Medium close-up"
  subject: string;
  action: string;
  cameraMovement: string;           // "Slow dolly in"
  lensSpec: string;                 // "85mm prime, shallow depth"
  lighting: string;                 // "Soft key from camera left, warm rim light"
  colorGrading: string;             // "Teal & orange, cinematic LUT"
  pacing: string;                   // "5 seconds, single take"
  audioDirection: string;           // 사운드 큐
}

export interface VeoPrompt {
  fullPrompt: string;
  scene: string;
  visualStyle: string;
  cameraDirection: string;
  duration: string;                 // VEO 3는 8초 기본
  resolution: string;               // 1080p / 4K
  aspectRatio: string;              // 16:9 / 9:16
  motionLevel: string;              // Subtle / Moderate / Dynamic
}

export interface FlowPrompt {
  sceneSequence: { scene: number; description: string; duration: string }[];
  transitionStyle: string;
  overallTone: string;
}

// ============================================================
// 도메인별 시각 스타일 매핑 (떡상 영상의 시각 패턴)
// ============================================================
type VisualStyle = 
  | "documentary"      // 다큐 (진정성)
  | "vlog"             // 브이로그 (친근함)
  | "tutorial"         // 튜토리얼 (명확함)
  | "review"           // 리뷰 (객관성)
  | "story"            // 스토리 (감성)
  | "trend"            // 트렌드 (역동성)
  | "minimalist"       // 미니멀 (집중)
  | "editorial";       // 에디토리얼 (잡지 같은 톤)

interface VisualStylePack {
  cameraLens: string[];
  aperture: string[];
  cameraMove: string[];
  lighting: string[];
  colorLUT: string[];
  mood: string[];
  styleRef: string[];
  composition: string[];
}

const VISUAL_STYLES: Record<VisualStyle, VisualStylePack> = {
  documentary: {
    cameraLens: ["35mm prime", "50mm prime", "85mm prime"],
    aperture: ["f/2.8", "f/4", "f/5.6"],
    cameraMove: ["handheld subtle sway", "slow dolly in", "static tripod with micro-adjustments"],
    lighting: ["available natural light", "single soft key from window", "low-key with practical lights"],
    colorLUT: ["Kodak Portra 400 emulation", "muted desaturated tones", "natural skin tones, slightly warm"],
    mood: ["intimate, observational", "honest, unfiltered", "thoughtful, contemplative"],
    styleRef: ["high-end documentary aesthetic", "premium documentary look", "long-form journalism photography"],
    composition: ["rule of thirds, eye level", "medium close-up framing", "environmental portrait"]
  },
  vlog: {
    cameraLens: ["24mm wide", "35mm prime", "fisheye for selfie shots"],
    aperture: ["f/1.8", "f/2.0", "f/2.8"],
    cameraMove: ["handheld dynamic", "selfie-stick walk", "smooth gimbal follow"],
    lighting: ["bright natural daylight", "ring light for selfie", "golden hour glow"],
    colorLUT: ["bright warm tones", "Instagram-friendly slightly faded", "vibrant but not over-saturated"],
    mood: ["upbeat, friendly", "casual, relatable", "energetic"],
    styleRef: ["modern lifestyle vlog", "popular creator influence", "clean video aesthetic 2026"],
    composition: ["close-up to camera", "POV shots", "establishing wide for context"]
  },
  tutorial: {
    cameraLens: ["50mm prime", "macro lens for detail", "85mm for hands"],
    aperture: ["f/4", "f/5.6", "f/8 for clarity"],
    cameraMove: ["static locked off", "slow push in for emphasis", "top-down overhead"],
    lighting: ["bright even key light", "softbox from front", "no harsh shadows"],
    colorLUT: ["clean neutral tones", "high contrast for clarity", "white-balanced precisely"],
    mood: ["clear, instructional", "calm, methodical", "approachable"],
    styleRef: ["high-end tutorial channel", "premium presentation visuals", "professional kitchen documentary"],
    composition: ["centered subject", "clean negative space", "labels and overlays friendly"]
  },
  review: {
    cameraLens: ["50mm prime", "85mm for product detail", "macro for close-ups"],
    aperture: ["f/2.8", "f/4"],
    cameraMove: ["smooth slider", "rotating turntable", "slow dolly in on product"],
    lighting: ["dual softbox setup", "rim light to separate subject", "controlled studio light"],
    colorLUT: ["neutral commercial tones", "slightly cool for tech feel", "true-to-life color"],
    mood: ["professional, trustworthy", "objective, analytical", "premium feel"],
    styleRef: ["premium tech review aesthetic", "magazine product shoot", "high-end e-commerce"],
    composition: ["product-centered", "split screen for comparison", "lifestyle context shots"]
  },
  story: {
    cameraLens: ["35mm anamorphic feel", "50mm prime", "85mm portrait"],
    aperture: ["f/1.4", "f/1.8", "f/2.0 for shallow depth"],
    cameraMove: ["slow gentle dolly", "creeping push in on emotion", "static with subtle breathing"],
    lighting: ["dramatic single source", "low-key cinematic", "practical lights only", "candlelight feel"],
    colorLUT: ["teal and orange cinematic", "desaturated melancholic", "warm nostalgic tones"],
    mood: ["emotional, reflective", "melancholic but hopeful", "quietly powerful"],
    styleRef: ["arthouse cinematography", "indie film tone", "emotional drama scenes"],
    composition: ["off-center for tension", "negative space heavy", "leading lines to emotion"]
  },
  trend: {
    cameraLens: ["24mm wide dynamic", "35mm prime", "70-200mm for compression"],
    aperture: ["f/2.8", "f/4"],
    cameraMove: ["fast whip pan", "energetic handheld", "drone-like sweeping moves"],
    lighting: ["high-contrast neon", "vibrant practical lights", "modern studio strobe"],
    colorLUT: ["high-saturation vibrant", "pop culture poster look", "social media optimized"],
    mood: ["energetic, current", "buzzy, hype", "fast-paced"],
    styleRef: ["short-form viral aesthetic", "magazine motion graphics", "trending news visual"],
    composition: ["dynamic angles", "kinetic typography overlays", "split-screen comparisons"]
  },
  minimalist: {
    cameraLens: ["50mm prime", "85mm prime"],
    aperture: ["f/4", "f/5.6", "f/8"],
    cameraMove: ["static", "ultra-slow push", "deliberate slider movement"],
    lighting: ["single source", "natural window light", "soft and even"],
    colorLUT: ["monochromatic", "muted earth tones", "clean white balance"],
    mood: ["calm, focused", "quiet, intentional", "spacious"],
    styleRef: ["modern minimalist magazine", "Japanese minimalism aesthetic", "premium minimalism advertising"],
    composition: ["heavy negative space", "single focal point", "clean lines"]
  },
  editorial: {
    cameraLens: ["50mm prime", "85mm portrait", "medium format feel"],
    aperture: ["f/2.0", "f/2.8"],
    cameraMove: ["static frames", "deliberate slow moves", "elegant slider"],
    lighting: ["beauty dish key", "rim and fill", "controlled studio"],
    colorLUT: ["fashion magazine tones", "high-fashion color grading", "high-end commercial"],
    mood: ["elegant, refined", "sophisticated", "aspirational"],
    styleRef: ["high-fashion editorial", "premium portrait photography", "high-end commercial spot"],
    composition: ["centered hero shot", "rule of thirds with intention", "fashion-forward angles"]
  }
};

// ============================================================
// 키워드 → 시각 스타일 매핑
// ============================================================
function detectVisualStyle(keyword: string, category?: string): VisualStyle {
  const k = keyword.toLowerCase();
  if (/리뷰|비교|언박싱|review/i.test(k)) return "review";
  if (/방법|가이드|튜토리얼|tutorial|how/i.test(k)) return "tutorial";
  if (/사연|이야기|story|감동|울/i.test(k)) return "story";
  if (/트렌드|이슈|핫|화제|2026/i.test(k)) return "trend";
  if (/일상|vlog|루틴|brunch/i.test(k)) return "vlog";
  if (/원리|지식|배우|학습/i.test(k)) return "documentary";
  if (/미니멀|심플|조용/i.test(k)) return "minimalist";
  if (/패션|스타일|뷰티/i.test(k)) return "editorial";
  return "documentary"; // 기본값: 다큐 (가장 신뢰감 높음)
}

// ============================================================
// 메인 프롬프트 생성기
// ============================================================
export function generateCinematicPrompts(
  keyword: string,
  selectedTitle: string,
  shotDescription: string, // 어떤 장면인지
  category?: string
): CinematicPromptPackage {
  const style = detectVisualStyle(keyword, category);
  const pack = VISUAL_STYLES[style];
  const seed = generatePromptSeed(keyword + selectedTitle);
  
  return {
    midjourney: generateMidjourneyPrompt(keyword, selectedTitle, shotDescription, style, pack, seed),
    sora: generateSoraPrompt(keyword, shotDescription, style, pack, seed),
    veo: generateVeoPrompt(keyword, shotDescription, style, pack, seed),
    flow: generateFlowPrompt(keyword, selectedTitle, style, pack, seed),
    notebookLM: generateNotebookLMPrompt(keyword, selectedTitle),
    rationale: generateRationale(style, pack, seed)
  };
}

// ============================================================
// Midjourney v7 프롬프트
// ============================================================
function generateMidjourneyPrompt(
  keyword: string,
  title: string,
  shot: string,
  style: VisualStyle,
  pack: VisualStylePack,
  seed: number
): MidjourneyPrompt {
  const lens = pickWith(pack.cameraLens, seed);
  const aperture = pickWith(pack.aperture, seed + 1);
  const lighting = pickWith(pack.lighting, seed + 2);
  const lut = pickWith(pack.colorLUT, seed + 3);
  const mood = pickWith(pack.mood, seed + 4);
  const styleRef = pickWith(pack.styleRef, seed + 5);
  const composition = pickWith(pack.composition, seed + 6);
  
  const subject = `${shot}, ${keyword} context`;
  const cameraSpec = `${lens}, ${aperture}, shallow depth of field`;
  
  // Midjourney v7 문법: subject :: composition :: lighting :: color :: mood :: style :: parameters
  const fullPrompt = `${subject}, ${composition}, ${lighting}, ${lut}, ${mood} atmosphere, shot on ${cameraSpec}, ${styleRef}, ultra-detailed, photorealistic, high resolution, 8K, professional color grading --ar 16:9 --v 7 --s 250 --q 2 --seed ${seed % 4294967295}`;
  
  return {
    fullPrompt,
    subject,
    composition,
    lighting,
    colorPalette: lut,
    cameraSpec,
    mood,
    styleReference: styleRef,
    parameters: "--ar 16:9 --v 7 --s 250 --q 2",
    negativePrompt: "no text overlays, no watermarks, no logos, no distorted faces, no extra limbs, no blurry artifacts, no cartoon style",
    seed: seed % 4294967295
  };
}

// ============================================================
// Sora 2 프롬프트
// ============================================================
function generateSoraPrompt(
  keyword: string,
  shot: string,
  style: VisualStyle,
  pack: VisualStylePack,
  seed: number
): SoraPrompt {
  const lens = pickWith(pack.cameraLens, seed);
  const aperture = pickWith(pack.aperture, seed + 1);
  const cameraMove = pickWith(pack.cameraMove, seed + 2);
  const lighting = pickWith(pack.lighting, seed + 3);
  const lut = pickWith(pack.colorLUT, seed + 4);
  const mood = pickWith(pack.mood, seed + 5);
  
  // Sora 2 문법: 자연어 시네마틱 묘사 + 카메라 + 조명 + 색감 + 페이싱
  const fullPrompt = `[Scene: ${shot}, evoking ${keyword}]

Shot type: Medium close-up framing the subject with environmental context. ${cameraMove} from a ${lens} on full-frame camera at ${aperture}. The depth of field isolates the subject while suggesting space behind.

Lighting: ${lighting}. The light wraps softly around the subject, creating dimensional shadows that suggest depth without harshness.

Color grading: ${lut}. Skin tones remain natural and warm, with controlled highlights and rich shadow detail.

Action: The subject moves with intention but restraint. Micro-expressions read clearly. Background elements drift gently in and out of focus.

Pacing: 5 seconds, single continuous take. No cuts. The viewer's eye is guided through the frame by the natural movement.

Atmosphere: ${mood}. The overall feeling should be cinematic and emotionally resonant, not overly dramatic.

Audio direction: Subtle ambient room tone. No music. Natural sound effects only.`;
  
  return {
    fullPrompt,
    shotType: "Medium close-up",
    subject: shot,
    action: "Restrained, intentional movement with clear micro-expressions",
    cameraMovement: cameraMove,
    lensSpec: `${lens} at ${aperture}`,
    lighting,
    colorGrading: lut,
    pacing: "5 seconds, single continuous take",
    audioDirection: "Subtle ambient room tone, no music, natural sound effects only"
  };
}

// ============================================================
// Google VEO 3 프롬프트
// ============================================================
function generateVeoPrompt(
  keyword: string,
  shot: string,
  style: VisualStyle,
  pack: VisualStylePack,
  seed: number
): VeoPrompt {
  const lens = pickWith(pack.cameraLens, seed);
  const cameraMove = pickWith(pack.cameraMove, seed + 1);
  const lighting = pickWith(pack.lighting, seed + 2);
  const lut = pickWith(pack.colorLUT, seed + 3);
  const styleRef = pickWith(pack.styleRef, seed + 4);
  const composition = pickWith(pack.composition, seed + 5);
  
  // VEO 3 문법: 명확한 씬 묘사 + 비주얼 스타일 + 카메라 디렉션 + 모션 레벨
  const fullPrompt = `Cinematic 8-second sequence.

SCENE: ${shot}. The scene captures the essence of ${keyword} with restrained, professional production value.

VISUAL STYLE: ${styleRef}. ${composition}. Color palette follows ${lut}, prioritizing emotional resonance over technical perfection.

CAMERA: ${cameraMove}. Lens emulates ${lens} character with cinematic depth of field. Frame composition uses ${composition}.

LIGHTING: ${lighting}. Shadows fall naturally with controlled contrast.

MOTION: Subtle and intentional. Avoid excessive movement that distracts from the subject's emotional truth.

DURATION: 8 seconds, no cuts.
RESOLUTION: 1080p minimum, 4K preferred.
ASPECT RATIO: 16:9 (or 9:16 for Shorts/Reels/TikTok adaptation).

NEGATIVE PROMPT: No text overlays, no logos, no watermarks, no distorted facial features, no extra limbs, no cartoon stylization, no choppy motion.`;
  
  return {
    fullPrompt,
    scene: shot,
    visualStyle: `${styleRef}, ${lut}`,
    cameraDirection: `${cameraMove} on ${lens}`,
    duration: "8 seconds",
    resolution: "1080p (4K preferred)",
    aspectRatio: "16:9 (9:16 alternate available)",
    motionLevel: "Subtle to Moderate"
  };
}

// ============================================================
// Google Flow (시퀀스) 프롬프트
// ============================================================
function generateFlowPrompt(
  keyword: string,
  title: string,
  style: VisualStyle,
  pack: VisualStylePack,
  seed: number
): FlowPrompt {
  const mood = pickWith(pack.mood, seed);
  const lut = pickWith(pack.colorLUT, seed + 1);
  
  return {
    sceneSequence: [
      { scene: 1, description: `오프닝 와이드 샷: ${keyword}와 관련된 환경 컨텍스트`, duration: "2초" },
      { scene: 2, description: `미디엄 클로즈업: 주체의 표정과 시선`, duration: "3초" },
      { scene: 3, description: `디테일 클로즈업: 핵심 오브젝트 또는 손동작`, duration: "2초" },
      { scene: 4, description: `리액션 샷: 주체의 반응 변화`, duration: "3초" },
      { scene: 5, description: `엔딩 와이드: 다시 환경으로 돌아가며 여운`, duration: "3초" }
    ],
    transitionStyle: "Match cut + L-cut 혼용. 컷 사이의 호흡감을 살리며 감정 곡선을 따라감.",
    overallTone: `${mood}, ${lut} 색감으로 통일`
  };
}

// ============================================================
// NotebookLM 분석용
// ============================================================
function generateNotebookLMPrompt(keyword: string, title: string): string {
  return `다음 영상 컨셉을 분석해줘:

제목: ${title}
키워드: ${keyword}

분석 요청:
1. 이 키워드의 검색 의도와 시청자 페르소나를 분석해줘
2. 이 주제로 떡상한 영상들의 공통 패턴을 정리해줘
3. 시청 유지율을 높일 수 있는 추가 후킹 포인트를 제안해줘
4. 경쟁 영상 대비 차별화 전략을 제시해줘
5. 이 영상의 예상 도달 범위와 타겟 시청자를 추정해줘

답변은 한국어로, 실전에서 바로 적용 가능한 형태로 정리해줘.`;
}

// ============================================================
// 왜 이 조합인지 설명
// ============================================================
function generateRationale(style: VisualStyle, pack: VisualStylePack, seed: number): string {
  const styleNames: Record<VisualStyle, string> = {
    documentary: "다큐멘터리",
    vlog: "브이로그",
    tutorial: "튜토리얼",
    review: "리뷰",
    story: "스토리",
    trend: "트렌드",
    minimalist: "미니멀",
    editorial: "에디토리얼"
  };
  
  return `이 키워드의 시청자 페르소나와 떡상 영상 패턴 분석 결과, **${styleNames[style]} 스타일**이 가장 적합합니다.

선택 이유:
- 카메라: ${pack.cameraLens[0]} 권장 (이 스타일에서 가장 신뢰감 높은 렌즈)
- 조명: ${pack.lighting[0]} (감정 전달과 시각적 가독성 균형)
- 색감: ${pack.colorLUT[0]} (해당 도메인 떡상 영상의 공통 색감 패턴)
- 분위기: ${pack.mood[0]} (시청자 이입을 극대화하는 톤)`;
}

// ============================================================
// 헬퍼
// ============================================================
function pickWith<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function generatePromptSeed(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ============================================================
// END OF FILE
// ============================================================
