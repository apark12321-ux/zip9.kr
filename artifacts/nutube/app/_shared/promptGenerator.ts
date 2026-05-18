/**
 * 한글+영문 이미지/영상 프롬프트 생성기
 *
 * 박예준 대표 요청사항:
 * - 한글 설명 (기본, 이해하기 쉽게)
 * - 영문 디테일 (AI 툴에 바로 복붙)
 * - 이미지 + 영상 프롬프트 모두 지원
 * - 시나리오 기반 6~8개 씬 자동 생성
 */

export interface PromptScene {
  id: string;
  purpose: string;       // 용도 (예: 오프닝, 문제 제기)
  time: string;          // 시간대 (예: 0-5초)
  koreanDesc: string;    // 한글 씬 설명
  englishPrompt: string; // 영문 AI 프롬프트
  negativePrompt?: string;
  aspectRatio: string;
}

export interface PromptPackage {
  mediaType: 'image' | 'video';
  style: string;
  styleLabel: string;
  styleEmoji: string;
  description: string;
  recommendedTools: ToolInfo[];
  scenes: PromptScene[];
}

export interface ToolInfo {
  name: string;
  url: string;
  emoji: string;
  pricing: string;
}

// ========== AI 이미지 생성 툴 ==========
const IMAGE_TOOLS: { [key: string]: ToolInfo[] } = {
  photorealistic: [
    { name: 'Midjourney v6', url: 'https://www.midjourney.com', emoji: '🎨', pricing: '$10/월~' },
    { name: 'Flux Pro', url: 'https://flux1.ai', emoji: '⚡', pricing: 'Free tier' },
    { name: 'DALL-E 3', url: 'https://chat.openai.com', emoji: '🤖', pricing: 'ChatGPT Plus' },
  ],
  illustration: [
    { name: 'DALL-E 3', url: 'https://chat.openai.com', emoji: '🤖', pricing: 'ChatGPT Plus' },
    { name: 'Midjourney --style raw', url: 'https://www.midjourney.com', emoji: '🎨', pricing: '$10/월~' },
    { name: 'Leonardo AI', url: 'https://leonardo.ai', emoji: '💎', pricing: 'Free tier' },
  ],
  infographic: [
    { name: 'Canva AI', url: 'https://www.canva.com/ai-image-generator/', emoji: '✨', pricing: 'Free tier' },
    { name: 'DALL-E 3', url: 'https://chat.openai.com', emoji: '🤖', pricing: 'ChatGPT Plus' },
  ],
  cinematic: [
    { name: 'Midjourney v6', url: 'https://www.midjourney.com', emoji: '🎨', pricing: '$10/월~' },
    { name: 'Flux Pro', url: 'https://flux1.ai', emoji: '⚡', pricing: 'Free tier' },
  ],
};

// ========== AI 영상 생성 툴 ==========
const VIDEO_TOOLS: { [key: string]: ToolInfo[] } = {
  default: [
    { name: 'Runway Gen-3', url: 'https://runwayml.com', emoji: '🎬', pricing: '$12/월~' },
    { name: 'Kling AI', url: 'https://kling.kuaishou.com', emoji: '🎥', pricing: 'Free tier' },
    { name: 'Luma Dream Machine', url: 'https://lumalabs.ai/dream-machine', emoji: '💫', pricing: 'Free tier' },
    { name: 'Sora (OpenAI)', url: 'https://openai.com/sora', emoji: '🌟', pricing: 'ChatGPT Pro' },
  ],
};

// ========== 스타일 정의 ==========
const STYLE_MODIFIERS = {
  photorealistic: {
    styleLabel: '포토리얼리스틱',
    styleEmoji: '📷',
    description: '실제 사진 같은 사실적 스타일',
    koreanStyle: '실사 사진 스타일',
    englishSuffix: 'photorealistic, 8k uhd, professional photography, natural lighting, sharp focus, high detail',
    negative: 'cartoon, illustration, painting, 3d render, low quality, blurry',
  },
  illustration: {
    styleLabel: '일러스트',
    styleEmoji: '🎨',
    description: '부드럽고 따뜻한 일러스트',
    koreanStyle: '일러스트 스타일 (따뜻한 분위기)',
    englishSuffix: 'flat illustration, vibrant colors, clean lines, minimal design, modern vector art',
    negative: 'photorealistic, 3d render, dark, scary',
  },
  infographic: {
    styleLabel: '인포그래픽',
    styleEmoji: '📊',
    description: '정보 시각화 차트/다이어그램',
    koreanStyle: '인포그래픽 (데이터 시각화)',
    englishSuffix: 'infographic style, clean layout, charts and graphs, data visualization, professional, isometric',
    negative: 'photorealistic, blurry, cluttered, messy',
  },
  cinematic: {
    styleLabel: '시네마틱',
    styleEmoji: '🎬',
    description: '영화 같은 드라마틱한 연출',
    koreanStyle: '시네마틱 (영화 같은 분위기)',
    englishSuffix: 'cinematic lighting, movie still, dramatic atmosphere, shallow depth of field, film grain, 35mm',
    negative: 'bright, flat, amateur, low contrast',
  },
};

// ========== 카테고리별 한글 씬 템플릿 ==========
const CATEGORY_SCENES: { [key: string]: Array<{ ko: string; en: string }> } = {
  economy: [
    {
      ko: '사무실에서 경제 지표를 분석하는 30대 비즈니스맨, 노트북에 금융 차트, 서울 도심 배경',
      en: 'Korean businessman in suit analyzing financial charts on laptop, modern office, Seoul skyline background',
    },
    {
      ko: '걱정스러운 표정의 한국인 가족, 식탁에 청구서가 쌓여있음, 따뜻한 조명',
      en: 'worried Korean family at dinner table, stack of bills and documents, warm lighting',
    },
    {
      ko: '상승하는 금리 그래프가 화면에 크게 표시됨, 깔끔한 데이터 시각화',
      en: 'dramatic rising interest rate graph on screen, clean data visualization, red and orange tones',
    },
    {
      ko: '은행에서 상담받는 30대 한국 여성, 서류 작성 중, 전문적인 분위기',
      en: 'Korean woman in her 30s consulting at bank, filling documents, professional atmosphere',
    },
    {
      ko: '성공한 투자자의 모습, 여유로운 표정으로 카페에서 노트북 사용',
      en: 'successful investor relaxing at cafe, confident smile, using laptop, modern Seoul cafe',
    },
    {
      ko: '"구독" 버튼과 채널 로고가 화면에 등장, 밝은 분위기',
      en: 'subscribe button and channel logo animation, bright cheerful atmosphere, YouTube style',
    },
  ],
  health: [
    {
      ko: '아침 햇살 드는 거실에서 요가하는 40대 한국 여성, 평화로운 분위기',
      en: 'morning sunlight in living room, 40-year-old Korean woman doing yoga, peaceful atmosphere',
    },
    {
      ko: '병원 대기실에서 걱정하는 시니어 한국인, 따뜻한 조명',
      en: 'senior Korean person worried in hospital waiting room, warm lighting, documentary style',
    },
    {
      ko: '건강한 한식 식탁, 색깔 있는 반찬들, 위에서 내려다본 앵글',
      en: 'healthy Korean meal spread, colorful banchan side dishes, top-down view, natural lighting',
    },
    {
      ko: '공원에서 걷기 운동하는 시니어 부부, 가을 분위기, 부드러운 조명',
      en: 'senior Korean couple walking in park, autumn atmosphere, soft lighting, golden hour',
    },
    {
      ko: '의사가 환자에게 건강 관리 팁을 설명하는 모습, 전문적이고 친근한 분위기',
      en: 'Korean doctor explaining health tips to patient, professional yet friendly atmosphere',
    },
    {
      ko: '건강한 생활을 즐기는 가족, 웃음이 가득한 거실',
      en: 'Korean family enjoying healthy lifestyle, laughing in living room, bright natural light',
    },
  ],
  it: [
    {
      ko: '어두운 방에서 여러 모니터로 코딩하는 개발자, 사이버펑크 분위기',
      en: 'developer coding with multiple monitors in dark room, cyberpunk atmosphere, RGB lighting',
    },
    {
      ko: 'AI 인터페이스가 떠있는 스마트폰 클로즈업, 미래적 느낌',
      en: 'smartphone close-up showing AI interface, futuristic feel, neon accent lights',
    },
    {
      ko: '서울 강남의 IT 기업 빌딩, 현대적인 건축, 유리벽 반사',
      en: 'modern IT company building in Gangnam Seoul, glass architecture, reflective surfaces',
    },
    {
      ko: '새로운 앱을 사용하며 놀라는 20대 한국인, 밝고 역동적',
      en: 'Korean 20s person amazed using new app, bright and dynamic, smartphone in hand',
    },
    {
      ko: 'AI가 생성한 이미지들이 화면에 펼쳐지는 모습, 창의적인 분위기',
      en: 'AI-generated images spreading across screen, creative atmosphere, colorful',
    },
    {
      ko: '미래형 작업 공간, 홀로그램 디스플레이, 첨단 기술',
      en: 'futuristic workspace, hologram displays, cutting-edge technology, sci-fi aesthetic',
    },
  ],
  education: [
    {
      ko: '책상 가득 쌓인 책들과 노트, 따뜻한 스탠드 조명',
      en: 'desk covered with books and notes, warm desk lamp lighting, cozy study atmosphere',
    },
    {
      ko: '카페에서 집중해서 공부하는 대학생, 노트북과 커피',
      en: 'university student focused studying at cafe, laptop and coffee, natural window light',
    },
    {
      ko: '핸드라이팅 노트 클로즈업, 펜으로 정성스럽게 쓰는 모습',
      en: 'close-up of handwriting in notebook, pen writing carefully, aesthetic study aesthetic',
    },
    {
      ko: '아침 루틴을 실천하는 한국인, 창가에서 책 읽기',
      en: 'Korean person practicing morning routine, reading book by window, soft morning light',
    },
    {
      ko: '성공한 모습의 졸업생, 학사모 쓴 채 환하게 웃음',
      en: 'successful graduate wearing cap, bright smile, celebration atmosphere',
    },
    {
      ko: '도서관의 책장들, 지식의 보고, 영감적인 분위기',
      en: 'library bookshelves, treasury of knowledge, inspirational atmosphere, warm tones',
    },
  ],
  food: [
    {
      ko: '한식 조리 과정, 김이 모락모락 나는 냄비, 따뜻한 부엌',
      en: 'Korean cooking process, steaming pot, warm kitchen, homey feeling',
    },
    {
      ko: '완성된 한식 상차림, 색색의 반찬들, 위에서 촬영',
      en: 'finished Korean meal setup, colorful side dishes, top-down shot, appetizing',
    },
    {
      ko: '요리사의 손 클로즈업, 재료를 정성껏 다듬는 모습',
      en: 'chef hands close-up, carefully preparing ingredients, culinary art',
    },
    {
      ko: '아늑한 카페에서 디저트를 즐기는 커플, 달콤한 분위기',
      en: 'cozy cafe couple enjoying dessert, sweet atmosphere, warm tones',
    },
    {
      ko: '다이어트 도시락, 깔끔하고 건강한 구성, 플랫레이',
      en: 'diet lunchbox, clean and healthy composition, flat lay photography',
    },
    {
      ko: '홈파티 테이블 세팅, 친구들과 함께하는 저녁',
      en: 'home party table setting, dinner with friends, warm atmospheric lighting',
    },
  ],
  social: [
    {
      ko: '한국 뉴스 스튜디오, 전문 아나운서, 프로페셔널한 느낌',
      en: 'Korean news studio, professional anchor, professional atmosphere, broadcast quality',
    },
    {
      ko: '서울 도심 사람들, 바쁘게 움직이는 모습, 다큐멘터리 스타일',
      en: 'busy Seoul city people, documentary style, candid shots, urban life',
    },
    {
      ko: '정부 청사 외관, 깔끔한 건축, 공식적인 분위기',
      en: 'Korean government building exterior, clean architecture, official atmosphere',
    },
    {
      ko: '사회적 이슈 관련 인포그래픽, 깔끔한 데이터 시각화',
      en: 'social issue infographic, clean data visualization, professional',
    },
    {
      ko: '국회의사당과 한국 국기, 상징적인 이미지',
      en: 'Korean National Assembly and Korean flag, symbolic imagery, patriotic',
    },
    {
      ko: '다양한 한국인들의 모습, 포용적이고 다문화적인 분위기',
      en: 'diverse Korean people, inclusive and multicultural atmosphere',
    },
  ],
  realestate: [
    {
      ko: '서울 아파트 단지 전경, 맑은 하늘, 드론 샷',
      en: 'Seoul apartment complex panorama, clear sky, drone shot, aerial view',
    },
    {
      ko: '모던한 아파트 실내, 북유럽 스타일 인테리어, 자연광',
      en: 'modern apartment interior, Scandinavian style, natural lighting, minimal',
    },
    {
      ko: '집 열쇠와 계약서, 새로운 시작을 상징',
      en: 'house keys and contract documents, symbolic new beginning, warm tones',
    },
    {
      ko: '부동산 중개인이 고객에게 설명하는 모습, 전문적',
      en: 'Korean real estate agent explaining to client, professional, friendly',
    },
    {
      ko: '아파트 건축 조감도, 청사진 느낌, 블루프린트',
      en: 'apartment architectural blueprint, technical drawing aesthetic',
    },
    {
      ko: '행복한 가족이 새 집에 입주하는 모습',
      en: 'happy Korean family moving into new home, joyful moment, warm lighting',
    },
  ],
  game: [
    {
      ko: 'RGB 조명이 가득한 게이밍 셋업, 프로 게이머 분위기',
      en: 'gaming setup with RGB lighting, pro gamer atmosphere, cyberpunk vibes',
    },
    {
      ko: '게임에 몰입한 플레이어 클로즈업, 집중하는 표정',
      en: 'player immersed in game close-up, focused expression, dramatic lighting',
    },
    {
      ko: 'e스포츠 경기장, 관중과 무대 조명, 웅장한 분위기',
      en: 'e-sports arena, crowd and stage lights, grand atmosphere, epic scale',
    },
    {
      ko: '게임 컨트롤러 매크로 샷, 메카니컬한 디테일',
      en: 'game controller macro shot, mechanical details, product photography',
    },
    {
      ko: '게임 캐릭터들이 모여있는 모습, 판타지 분위기',
      en: 'game characters gathered together, fantasy atmosphere, epic scene',
    },
    {
      ko: '친구들과 함께 게임하는 즐거운 모습, 캐주얼한 분위기',
      en: 'friends playing games together having fun, casual atmosphere, cozy',
    },
  ],
};

// ========== 6개 씬 구조 ==========
const SCENE_STRUCTURE = [
  { id: 's1', purpose: '🎬 오프닝 훅', time: '0-5초' },
  { id: 's2', purpose: '💡 문제 제기', time: '5-30초' },
  { id: 's3', purpose: '📊 핵심 포인트 1', time: '30초-2분' },
  { id: 's4', purpose: '🎯 핵심 포인트 2', time: '2분-5분' },
  { id: 's5', purpose: '✨ 결론/요약', time: '5분-7분' },
  { id: 's6', purpose: '🔔 CTA/구독 유도', time: '엔딩' },
];

/**
 * 전체 프롬프트 패키지 생성 (이미지 4 + 영상 1)
 */
export function generatePromptPackages(
  keyword: string,
  categoryId: string,
  scenarioId: string,
  platformIds: string[]
): {
  images: PromptPackage[];
  videos: PromptPackage[];
} {
  const categoryScenes = CATEGORY_SCENES[categoryId] || CATEGORY_SCENES.economy;

  // 화면비 결정
  const hasVertical = platformIds.some((p) =>
    ['youtube-shorts', 'tiktok', 'instagram-reels'].includes(p)
  );
  const hasHorizontal = platformIds.includes('youtube-long');
  const aspectRatio = hasVertical && !hasHorizontal
    ? '9:16 (세로)'
    : hasHorizontal && !hasVertical
      ? '16:9 (가로)'
      : '16:9 (가로) / 9:16 (세로)';
  const arSuffix = hasVertical && !hasHorizontal
    ? '--ar 9:16'
    : '--ar 16:9';

  // 씬 생성 헬퍼
  const makeScenes = (styleKey: keyof typeof STYLE_MODIFIERS): PromptScene[] => {
    const style = STYLE_MODIFIERS[styleKey];
    return SCENE_STRUCTURE.map((s, idx) => {
      const sceneTemplate = categoryScenes[idx] || categoryScenes[0];
      return {
        id: s.id,
        purpose: s.purpose,
        time: s.time,
        koreanDesc: `[${keyword}] ${sceneTemplate.ko} (${style.koreanStyle})`,
        englishPrompt: `${keyword} topic: ${sceneTemplate.en}, ${style.englishSuffix} ${arSuffix} --v 6`,
        negativePrompt: style.negative,
        aspectRatio,
      };
    });
  };

  // 이미지 패키지 4개 (스타일별)
  const imagePackages: PromptPackage[] = (Object.keys(STYLE_MODIFIERS) as Array<keyof typeof STYLE_MODIFIERS>).map((styleKey) => {
    const style = STYLE_MODIFIERS[styleKey];
    return {
      mediaType: 'image' as const,
      style: styleKey,
      styleLabel: style.styleLabel,
      styleEmoji: style.styleEmoji,
      description: style.description,
      recommendedTools: IMAGE_TOOLS[styleKey] || IMAGE_TOOLS.photorealistic,
      scenes: makeScenes(styleKey),
    };
  });

  // 영상 패키지 (시네마틱 스타일 기반)
  const makeVideoScenes = (): PromptScene[] => {
    return SCENE_STRUCTURE.map((s, idx) => {
      const sceneTemplate = categoryScenes[idx] || categoryScenes[0];
      return {
        id: s.id,
        purpose: s.purpose,
        time: s.time,
        koreanDesc: `[${keyword}] ${sceneTemplate.ko}, 영화 같은 자연스러운 움직임`,
        englishPrompt: `${keyword} scene: ${sceneTemplate.en}, cinematic camera movement, smooth motion, professional cinematography, natural lighting transitions ${arSuffix}`,
        aspectRatio,
      };
    });
  };

  const videoPackages: PromptPackage[] = [
    {
      mediaType: 'video' as const,
      style: 'cinematic-video',
      styleLabel: '시네마틱 영상',
      styleEmoji: '🎬',
      description: '영화처럼 부드러운 AI 영상 생성',
      recommendedTools: VIDEO_TOOLS.default,
      scenes: makeVideoScenes(),
    },
  ];

  return { images: imagePackages, videos: videoPackages };
}

export { STYLE_MODIFIERS, IMAGE_TOOLS, VIDEO_TOOLS };
