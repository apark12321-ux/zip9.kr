/**
 * 이미지 프롬프트 생성기
 *
 * 사용자가 선택한 카테고리 + 시나리오 + 키워드 기반으로
 * 다양한 AI 이미지 툴용 프롬프트 자동 생성
 */

export interface ImagePromptSet {
  style: string;
  styleLabel: string;
  styleEmoji: string;
  description: string;
  recommendedTool: string;
  prompts: ImagePrompt[];
}

export interface ImagePrompt {
  scene: string;
  purpose: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: string;
}

const STYLE_MODIFIERS = {
  photorealistic: {
    styleLabel: '📷 포토리얼리스틱',
    styleEmoji: '📷',
    description: '실제 사진 같은 사실적 스타일',
    recommendedTool: 'Midjourney v6, Flux Pro, Stable Diffusion XL',
    suffix: 'photorealistic, 8k uhd, professional photography, natural lighting, sharp focus, high detail',
    negative: 'cartoon, illustration, painting, 3d render, low quality, blurry',
  },
  illustration: {
    styleLabel: '🎨 일러스트',
    styleEmoji: '🎨',
    description: '부드럽고 따뜻한 일러스트 스타일',
    recommendedTool: 'DALL-E 3, Midjourney --style raw',
    suffix: 'flat illustration, vibrant colors, clean lines, minimal design, modern vector art',
    negative: 'photorealistic, 3d render, dark, scary',
  },
  infographic: {
    styleLabel: '📊 인포그래픽',
    styleEmoji: '📊',
    description: '정보를 시각화한 차트·다이어그램',
    recommendedTool: 'Canva AI, DALL-E 3',
    suffix: 'infographic style, clean layout, charts and graphs, data visualization, professional',
    negative: 'photorealistic, blurry, cluttered',
  },
  cinematic: {
    styleLabel: '🎬 시네마틱',
    styleEmoji: '🎬',
    description: '영화 같은 드라마틱한 연출',
    recommendedTool: 'Midjourney v6, Runway ML',
    suffix: 'cinematic lighting, movie still, dramatic atmosphere, shallow depth of field, film grain, 35mm',
    negative: 'bright, flat, amateur, low contrast',
  },
};

// 카테고리별 기본 씬 구성
const CATEGORY_SCENES: { [key: string]: string[] } = {
  economy: [
    'financial graphs going up on screen',
    'businessman analyzing data',
    'Korean won currency floating',
    'stock market trading floor',
    'calculator and documents on desk',
  ],
  health: [
    'person exercising in morning sunlight',
    'healthy food on wooden table',
    'doctor in clean medical facility',
    'fitness tracker and water bottle',
    'yoga poses in bright studio',
  ],
  it: [
    'laptop with AI interface on screen',
    'smartphone showing app interface',
    'server room with blue lights',
    'person coding at modern desk',
    'circuit board close-up',
  ],
  education: [
    'books stacked on wooden desk',
    'person reading in cozy library',
    'notebook with handwritten notes',
    'study session at coffee shop',
    'graduation cap on books',
  ],
  food: [
    'delicious dish being prepared',
    'fresh ingredients on kitchen counter',
    'beautifully plated Korean food',
    'cooking in bright modern kitchen',
    'colorful food spread on table',
  ],
  social: [
    'newspaper headline close-up',
    'cityscape with people',
    'news studio setup',
    'protest or gathering',
    'government building exterior',
  ],
  realestate: [
    'modern apartment interior',
    'house keys and documents',
    'cityscape with apartment buildings',
    'real estate agent showing house',
    'architectural blueprint',
  ],
  game: [
    'gaming setup with RGB lights',
    'player focused on screen',
    'game controller close-up',
    'e-sports arena',
    'colorful pixel art scene',
  ],
};

/**
 * 시나리오 기반 6~8개 장면 프롬프트 생성
 */
function generateScenesForScenario(
  keyword: string,
  categoryId: string,
  scenarioId: string
): Array<{ scene: string; purpose: string }> {
  const categoryScenes = CATEGORY_SCENES[categoryId] || CATEGORY_SCENES.economy;

  const sceneStructure = [
    { purpose: '🎬 오프닝 (첫 5초 훅)', base: categoryScenes[0] },
    { purpose: '💡 문제 제기 (10~30초)', base: categoryScenes[1] || categoryScenes[0] },
    { purpose: '📊 핵심 데이터 1 (1분)', base: categoryScenes[2] || categoryScenes[1] },
    { purpose: '🎯 핵심 포인트 (2~3분)', base: categoryScenes[3] || categoryScenes[2] },
    { purpose: '✨ 결론/요약 (5분)', base: categoryScenes[4] || categoryScenes[0] },
    { purpose: '🔔 CTA/구독 유도 (엔딩)', base: categoryScenes[0] },
  ];

  return sceneStructure.map((s) => ({
    purpose: s.purpose,
    scene: `${keyword} related: ${s.base}`,
  }));
}

/**
 * 전체 이미지 프롬프트 세트 생성 (4가지 스타일)
 */
export function generateImagePrompts(
  keyword: string,
  categoryId: string,
  scenarioId: string,
  platformIds: string[]
): ImagePromptSet[] {
  const scenes = generateScenesForScenario(keyword, categoryId, scenarioId);

  // 플랫폼 기반 화면비
  const hasVertical = platformIds.some((p) =>
    ['youtube-shorts', 'tiktok', 'instagram-reels'].includes(p)
  );
  const hasHorizontal = platformIds.includes('youtube-long');

  const aspectRatio = hasVertical && !hasHorizontal
    ? '9:16 (세로)'
    : hasHorizontal && !hasVertical
      ? '16:9 (가로)'
      : '16:9 + 9:16 (둘 다)';

  const stylesToUse: Array<keyof typeof STYLE_MODIFIERS> = [
    'photorealistic',
    'illustration',
    'infographic',
    'cinematic',
  ];

  return stylesToUse.map((styleKey) => {
    const style = STYLE_MODIFIERS[styleKey];
    return {
      style: styleKey,
      styleLabel: style.styleLabel,
      styleEmoji: style.styleEmoji,
      description: style.description,
      recommendedTool: style.recommendedTool,
      prompts: scenes.map((sceneData) => ({
        scene: sceneData.purpose,
        purpose: sceneData.purpose,
        prompt: `${sceneData.scene}, ${style.suffix}`,
        negativePrompt: style.negative,
        aspectRatio,
      })),
    };
  });
}

/**
 * 간단한 단일 프롬프트 생성 (썸네일용)
 */
export function generateThumbnailPrompt(
  keyword: string,
  categoryId: string,
  styleKey: keyof typeof STYLE_MODIFIERS = 'cinematic'
): string {
  const style = STYLE_MODIFIERS[styleKey];
  const categoryScene = CATEGORY_SCENES[categoryId]?.[0] || 'modern scene';
  return `${keyword}, ${categoryScene}, eye-catching thumbnail design, bold text overlay, ${style.suffix}`;
}

export { STYLE_MODIFIERS };
