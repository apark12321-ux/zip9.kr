/**
 * NuTube 데이터 정의
 * 박예준 대표 컨셉:
 * - 타겟: 퇴직 예정/예정자 (40대~70대) (김 부장)
 * - "키워드만 입력하면 AI가 모두 대신해드립니다"
 * - SEO/AdSense 최적화
 */

// ============================================================
// 플랫폼 (4개) - SNS 업로드 메타데이터 템플릿용
// ============================================================
export interface PlatformMetaField {
  id: string;
  icon: string;
  label: string;
  labelEn: string;
  description: string;
  example: string;
  howItWorks: string;
  autoGenerate: boolean;
  maxLength?: number;
}

export interface Platform {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  durationLabel: string;
  orientation: '가로 16:9' | '세로 9:16' | '정사각 1:1';
  revenue: string;
  audience: string;
  exampleContent: string;
  advantages: string[];
  metaFields: PlatformMetaField[];
  color: string;
}

export const PLATFORMS: Platform[] = [
  {
    id: 'youtube-long',
    name: 'YouTube 롱폼',
    nameEn: 'YouTube Long-form',
    emoji: '📺',
    durationLabel: '8분 이상',
    orientation: '가로 16:9',
    revenue: '광고 수익 가능',
    audience: '전 연령대',
    exampleContent: '"2026 금리 전망 완벽 정리" (10분)',
    advantages: [
      '긴 영상 = 광고 수익 큼',
      '검색 노출 잘 됨',
      '구독자 확보 쉬움',
      '광고 수익 가장 높음',
    ],
    color: '#4f46e5',
    metaFields: [
      {
        id: 'title',
        icon: '📝',
        label: '영상 제목',
        labelEn: 'Title',
        description: '사람들이 영상 목록에서 보는 글자',
        example: '"2026년 금리 인하, 이것만 알면 5천만원 벌어요"',
        howItWorks: 'AI가 조회수 잘 나오는 제목 3가지 추천',
        autoGenerate: true,
        maxLength: 100,
      },
      {
        id: 'description',
        icon: '📄',
        label: '영상 설명',
        labelEn: 'Description',
        description: '영상 아래 더보기 누르면 나오는 글',
        example: '"이번 영상은 2026년 금리 전망을 다룹니다..."',
        howItWorks: '5,000자 이내로 AI가 자동 작성',
        autoGenerate: true,
        maxLength: 5000,
      },
      {
        id: 'tags',
        icon: '🏷️',
        label: '태그',
        labelEn: 'Tags',
        description: '검색 잘 되게 하는 키워드들',
        example: '금리전망, 2026경제, 재테크',
        howItWorks: '검색량 높은 태그 자동 추천',
        autoGenerate: true,
        maxLength: 500,
      },
      {
        id: 'category',
        icon: '📁',
        label: '카테고리',
        labelEn: 'Category',
        description: 'YouTube 카테고리 분류',
        example: '뉴스/정치, 교육',
        howItWorks: '주제에 맞는 최적 카테고리 추천',
        autoGenerate: true,
      },
      {
        id: 'thumbnail',
        icon: '🖼️',
        label: '썸네일 콘셉트',
        labelEn: 'Thumbnail',
        description: '영상 클릭하기 전에 보이는 이미지',
        example: '금리 그래프 + "5천만원!" 강조',
        howItWorks: '클릭률 높은 스타일 3가지 추천',
        autoGenerate: true,
      },
    ],
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    nameEn: 'YouTube Shorts',
    emoji: '📱',
    durationLabel: '60초 이하',
    orientation: '세로 9:16',
    revenue: '제한적 광고',
    audience: '10~30대 모바일',
    exampleContent: '"금리 1분 요약" (45초)',
    advantages: [
      '빠른 구독자 증가',
      '바이럴 확산 잘됨',
      '채널 노출 기회',
      '신규 채널에 유리',
    ],
    color: '#d4a545',
    metaFields: [
      {
        id: 'title',
        icon: '📝',
        label: '쇼츠 제목',
        labelEn: 'Shorts Title',
        description: '짧고 강렬한 제목 (100자 이내)',
        example: '"1분만에 정리하는 2026 금리 전망"',
        howItWorks: '짧고 강렬한 제목 3가지 추천',
        autoGenerate: true,
        maxLength: 100,
      },
      {
        id: 'hashtags',
        icon: '#️⃣',
        label: '해시태그',
        labelEn: 'Hashtags',
        description: '쇼츠 검색·추천에 필수 (#Shorts 포함)',
        example: '#Shorts #금리 #재테크',
        howItWorks: '검색 잘 되는 해시태그 자동 추천',
        autoGenerate: true,
      },
      {
        id: 'description',
        icon: '📄',
        label: '간단 설명',
        labelEn: 'Description',
        description: '쇼츠 설명란 (간결하게)',
        example: '"2026 금리 전망 1분 요약!"',
        howItWorks: 'AI가 자동 생성',
        autoGenerate: true,
        maxLength: 500,
      },
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    nameEn: 'TikTok',
    emoji: '🎵',
    durationLabel: '15-60초',
    orientation: '세로 9:16',
    revenue: '크리에이터 펀드',
    audience: '10~30대',
    exampleContent: '"바이럴 금리 정보" (30초)',
    advantages: [
      '바이럴 확산력 최고',
      '짧고 강렬한 영상',
      '음악 트렌드 활용',
      '글로벌 노출',
    ],
    color: '#00f2ea',
    metaFields: [
      {
        id: 'caption',
        icon: '📝',
        label: '캡션',
        labelEn: 'Caption',
        description: '영상 위에 표시되는 글 (2,200자 이내)',
        example: '"💰 2026 금리 전망 - 이거 모르면 후회"',
        howItWorks: '클릭 유발 캡션 자동 생성',
        autoGenerate: true,
        maxLength: 2200,
      },
      {
        id: 'hashtags',
        icon: '#️⃣',
        label: '해시태그',
        labelEn: 'Hashtags',
        description: 'TikTok 추천 알고리즘 핵심',
        example: '#fyp #금리 #재테크 #2026',
        howItWorks: '#fyp 포함 트렌드 해시태그 추천',
        autoGenerate: true,
      },
    ],
  },
  {
    id: 'instagram-reels',
    name: 'Instagram Reels',
    nameEn: 'Instagram Reels',
    emoji: '📸',
    durationLabel: '90초 이하',
    orientation: '세로 9:16',
    revenue: '브랜드 협업',
    audience: '20~40대',
    exampleContent: '"인스타 감성 금리 정보" (60초)',
    advantages: [
      '브랜드 이미지 좋음',
      '인스타 연동',
      '20-40대 타겟',
      '광고 단가 높음',
    ],
    color: '#e1306c',
    metaFields: [
      {
        id: 'caption',
        icon: '📝',
        label: '캡션',
        labelEn: 'Caption',
        description: '릴스 설명글 (2,200자 이내)',
        example: '"📊 2026 금리 인하, 미리 준비하세요"',
        howItWorks: '인스타 톤에 맞는 캡션 자동 생성',
        autoGenerate: true,
        maxLength: 2200,
      },
      {
        id: 'hashtags',
        icon: '#️⃣',
        label: '해시태그',
        labelEn: 'Hashtags',
        description: '인스타 검색용 (최대 30개)',
        example: '#재테크 #금리 #2026 #경제',
        howItWorks: '인기 해시태그 자동 추천',
        autoGenerate: true,
      },
    ],
  },
];

export function getPlatformById(id: string) {
  return PLATFORMS.find((p) => p.id === id);
}

// ============================================================
// 카테고리 (12개) - 퇴직 예정/예정자 (40대~70대) 타겟
// ============================================================
export const CATEGORIES = [
  {
    id: 'economy',
    name: '경제·재테크',
    emoji: '📊',
    description: '금리, 부동산, 주식, 재테크',
    examples: ['"2026년 금리 전망"', '"퇴직금 굴리는 법"', '"50대 자산 배분"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: true,
    color: '#4f46e5',
  },
  {
    id: 'realestate',
    name: '부동산',
    emoji: '🏠',
    description: '청약, 분양, 부동산 시장',
    examples: ['"2026 부동산 전망"', '"청약 가점 계산법"', '"재개발 유망 지역"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: true,
    color: '#7d9b7c',
  },
  {
    id: 'jobs',
    name: 'N잡·창업',
    emoji: '💼',
    description: '부업, 창업, 사이드 프로젝트',
    examples: ['"40대 N잡 BEST"', '"퇴직 후 창업"', '"재택 부업 100만원"'],
    avgViews: '추천 키워드 10개',
    competition: '낮음',
    hot: true,
    color: '#d4a545',
  },
  {
    id: 'senior',
    name: '시니어 라이프',
    emoji: '🌱',
    description: '50+ 라이프, 노후 준비',
    examples: ['"50대 운동 루틴"', '"은퇴 후 행복"', '"시니어 모임"'],
    avgViews: '추천 키워드 10개',
    competition: '낮음',
    hot: false,
    color: '#5a7a99',
  },
  {
    id: 'health',
    name: '건강·의료',
    emoji: '💊',
    description: '건강 상식, 운동, 식단',
    examples: ['"하루 10분 운동"', '"40대 다이어트"', '"혈압 낮추는 식단"'],
    avgViews: '추천 키워드 10개',
    competition: '낮음',
    hot: false,
    color: '#5e7e5d',
  },
  {
    id: 'travel',
    name: '여행·맛집',
    emoji: '✈️',
    description: '여행지, 맛집, 가성비',
    examples: ['"국내 가성비 여행지"', '"부부 여행 코스"', '"50대 해외 여행"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: false,
    color: '#6b8cae',
  },
  {
    id: 'food',
    name: '요리·음식',
    emoji: '🍳',
    description: '레시피, 홈쿡, 간단 요리',
    examples: ['"간단 점심 메뉴"', '"에어프라이어 요리"', '"1인 가구 레시피"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: false,
    color: '#a67e1e',
  },
  {
    id: 'tech',
    name: 'IT·테크',
    emoji: '💻',
    description: 'AI 도구, 앱 추천, 디지털',
    examples: ['"50대도 쉬운 AI"', '"ChatGPT 활용법"', '"스마트폰 200%"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: true,
    color: '#5a7a99',
  },
  {
    id: 'education',
    name: '교육·자기계발',
    emoji: '📚',
    description: '학습법, 독서, 습관',
    examples: ['"50대 영어 공부"', '"독서 습관"', '"하루 10분 자기계발"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: false,
    color: '#a67e1e',
  },
  {
    id: 'review',
    name: '리뷰·언박싱',
    emoji: '📺',
    description: '제품 리뷰, 생활용품',
    examples: ['"주방용품 BEST"', '"안마기 리뷰"', '"시니어 신발"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: false,
    color: '#4f46e5',
  },
  {
    id: 'social',
    name: '사회·이슈',
    emoji: '🌐',
    description: '시사, 정책, 트렌드',
    examples: ['"2026 정책 변화"', '"연금 개편"', '"의료보험 변경"'],
    avgViews: '추천 키워드 10개',
    competition: '보통',
    hot: false,
    color: '#6b8cae',
  },
  {
    id: 'hobby',
    name: '취미·여가',
    emoji: '🎨',
    description: '취미, 여가, DIY',
    examples: ['"50대 취미"', '"집에서 운동"', '"캠핑 입문"'],
    avgViews: '추천 키워드 10개',
    competition: '낮음',
    hot: false,
    color: '#d4a545',
  },
];

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id);
}

// ============================================================
// 키워드 → 카테고리 자동 감지 (홈에서 입력 시 자동 분류)
// ============================================================
const CATEGORY_KEYWORDS: Record<string, RegExp> = {
  realestate: /부동산|청약|아파트|주택|월세|전세|재개발|상가|경매/,
  economy: /재테크|투자|주식|배당|금리|연금|예금|적금|자산|은퇴|퇴직금/,
  language: /영어|영어회화|영문법|토익|토플|일본어|중국어|회화|외국어|스페인어/,
  health: /다이어트|운동|헬스|체중|체지방|식단|건강|요가|필라테스|스트레칭/,
  selfdev: /자기계발|독서|공부법|시간관리|루틴|습관|성공|마인드|메모/,
  aitech: /AI|인공지능|챗GPT|챗지피티|미드저니|영상편집|AI도구|프롬프트|ChatGPT/i,
  senior: /시니어|중장년|은퇴자|50대|60대|70대|노후|중년/,
  food: /요리|레시피|반찬|음식|밀키트|요리법|식당|맛집/,
  travel: /여행|관광|해외여행|국내여행|패키지|배낭여행|항공권|호텔/,
  jobs: /N잡|부업|창업|재택|프리랜서|취업|이직|커리어/,
  family: /가족|아이|육아|부모|자녀|효도|시어머니|결혼|명절|시댁|친정/,
};

export function detectCategoryFromKeyword(keyword: string): string {
  if (!keyword) return 'realestate';
  for (const [catId, regex] of Object.entries(CATEGORY_KEYWORDS)) {
    if (regex.test(keyword)) return catId;
  }
  return 'realestate'; // 기본값
}

// ============================================================
// 트렌드 키워드 (카테고리별 10개씩)
// ============================================================
export const TRENDING_KEYWORDS: Record<string, string[]> = {
  economy: [
    '2026년 금리 전망', '퇴직금 굴리는 법', '50대 자산 배분',
    '월 300만원 만드는 재테크', '안정적인 배당주', '예금 vs 적금',
    '연금 활용법', '중위험 투자 상품', '인플레이션 대비', '은퇴 준비 체크리스트',
  ],
  realestate: [
    '2026년 부동산 전망', '청약 가점 계산법', '재개발 유망 지역',
    '월세 vs 전세', '소형 아파트 투자', '부동산 세금 정리',
    '경매 입문 가이드', '상가 투자 주의점', '주거용 트렌드', '지방 아파트',
  ],
  jobs: [
    '40대 N잡 추천', '퇴직 후 창업 아이템', '재택 부업 BEST',
    '월 100만원 부업', '초보 블로그 수익화', '스마트스토어 시작',
    '디지털 노마드', '온라인 강의 만들기', '프리랜서 시작', '50대 재취업',
  ],
  senior: [
    '50대 운동 루틴', '시니어 모임 추천', '은퇴 후 행복 조건',
    '50대 패션 스타일', '관절 건강 관리', '시니어 여행 코스',
    '노후 자금 계산', '실버 라이프', '50+ 취미', '시니어 재능 기부',
  ],
  health: [
    '하루 10분 건강 운동', '40대 다이어트', '혈압 낮추는 식단',
    '관절염 예방 운동', '간 건강 관리', '수면의 질 높이기',
    '건강 검진 항목', '비타민 영양제', '저염식 레시피', '건강한 간식',
  ],
  travel: [
    '국내 가성비 여행지', '부부 여행 추천 코스', '50대 해외 여행',
    '서울 근교 당일치기', '제주도 숨은 명소', '한적한 국내',
    '온천 여행지', '맛집 여행 코스', '저렴한 펜션', '계절별 여행지',
  ],
  food: [
    '간단한 점심 메뉴', '에어프라이어 요리', '1인 가구 레시피',
    '저칼로리 다이어트', '건강한 아침 식사', '주말 홈파티',
    '집밥 반찬', '간단한 안주', '계절 별미', '건강 도시락',
  ],
  tech: [
    '50대도 쉬운 AI', 'ChatGPT 활용법', '스마트폰 200% 활용',
    '유튜브 시작', '카카오톡 숨은 기능', '쉬운 동영상 편집',
    '온라인 쇼핑 꿀팁', '디지털 사기 예방', '클라우드 사진', '무료 유용한 앱',
  ],
  education: [
    '50대 영어 공부법', '독서 습관 만들기', '하루 10분 자기계발',
    '책 빨리 읽는 법', '인생 명저', '시간 관리',
    '집중력 높이기', '메모 정리', '자기계발 루틴', '평생 학습',
  ],
  review: [
    '주방용품 BEST', '안마기 비교', '시니어 신발',
    '스마트워치 비교', '가성비 가전', '건강식품 리뷰',
    '여행용품 필수템', '홈트레이닝 도구', '독서대 추천', '실버 친화 제품',
  ],
  social: [
    '2026년 달라지는 정책', '연금 개편 정리', '의료보험 변경',
    '50+ 세금 절약', '복지 제도 활용', '시니어 일자리 정책',
    '노후 보장 제도', '주택 정책 변화', '생활 물가 분석', '사회 트렌드',
  ],
  hobby: [
    '50대 취미 추천', '집에서 하는 운동', '캠핑 입문 가이드',
    '등산 코스 추천', '낚시 시작', '골프 입문',
    '가드닝 시작', '서예·캘리그라피', '사진 찍는 법', '악기 배우기',
  ],
};

export function getTrendingKeywords(categoryId: string): string[] {
  return TRENDING_KEYWORDS[categoryId] || [];
}

// ============================================================
// 시나리오 (6개) - 영상 구조
// ============================================================
export const SCENARIOS = [
  {
    id: 'curiosity',
    name: '호기심 자극형',
    emoji: '🤔',
    description: '시청자의 궁금증을 유발하는 구조',
    structure: '문제 제기 → 단서 제공 → 핵심 공개',
  },
  {
    id: 'tutorial',
    name: '단계별 가이드',
    emoji: '📋',
    description: '따라하기 쉬운 단계별 설명',
    structure: '도입 → 1단계 → 2단계 → 마무리',
  },
  {
    id: 'review',
    name: '리뷰·비교',
    emoji: '⚖️',
    description: '제품·서비스 비교 분석',
    structure: '소개 → 장점 → 단점 → 결론',
  },
  {
    id: 'storytelling',
    name: '스토리텔링',
    emoji: '📖',
    description: '경험담 기반 자연스러운 흐름',
    structure: '시작 → 갈등 → 해결 → 교훈',
  },
  {
    id: 'list',
    name: '리스트형',
    emoji: '🔢',
    description: 'BEST/TOP 형식 모음',
    structure: '인트로 → 1위 → 2위 → 3위 → 정리',
  },
  {
    id: 'qa',
    name: 'Q&A형',
    emoji: '💬',
    description: '질문-답변 형식',
    structure: '질문 → 답변 → 부연 설명',
  },
];

export function getScenarioById(id: string) {
  return SCENARIOS.find((s) => s.id === id);
}
