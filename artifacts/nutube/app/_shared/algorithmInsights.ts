/**
 * NuTube 알고리즘 인사이트 데이터
 *
 * 박 대표님 업로드 자료 (5장 + 부록)을 백단 데이터로 정리.
 * 출처/타 명의 제거 후 사이트에서 자유롭게 활용 가능한 형태로 변환.
 *
 * 활용처:
 * 1. publish 페이지 결과 화면에 SEO 팁/체크리스트 동적 노출
 * 2. 가이드 페이지에서 데이터 참조
 * 3. v650Adapter 의 sns 데이터에 인사이트 추가 활용
 *
 * 박 대표님이 contentEngine.ts 를 직접 받으면 이 데이터를
 * generateDescription, generateTags 등에서 import 해서
 * 더 풍부한 결과 생성 가능.
 */

// ============================================================
// 1. SEO 키워드 전략 (제목 8:2 법칙)
// ============================================================
export const SEO_TITLE_FORMULA = {
  rule: '제목 앞 80% = 검색 키워드, 뒤 20% = 후킹 문구',
  examples: [
    {
      keyword: '돼지고기 김치찌개 황금레시피',
      hook: '10년 차 주부도 몰랐던 비법',
    },
    {
      keyword: '50대 재취업 면접 질문',
      hook: '인사 담당자가 진짜 보는 답변',
    },
    {
      keyword: '60대 부동산 청약 가이드',
      hook: '이거 모르고 신청하면 후회합니다',
    },
  ],
};

// ============================================================
// 2. 설명란 작성 가이드
// ============================================================
export const DESCRIPTION_TEMPLATE = {
  structure: [
    { line: '첫 1~2줄', content: '제목 핵심 키워드 포함, 영상 요약', importance: 'CRITICAL' },
    { line: '중간', content: '구체적 정보 자연스러운 문장으로', importance: 'HIGH' },
    { line: '하단', content: '관련 영상, 외부 링크, 해시태그 (3~5개)', importance: 'MEDIUM' },
  ],
  keywordRepeat: '핵심 키워드 자연스럽게 3~5회 반복',
  warning: '키워드 나열만 하면 스팸 처리. 반드시 자연스러운 문장 안에.',
};

// ============================================================
// 3. 시청 지속률 핵심 - 챕터 설정
// ============================================================
export const CHAPTER_RULES = {
  mustStartFromZero: '챕터는 반드시 00:00부터 시작',
  benefits: [
    '신뢰도 상승 (시청자가 시간 존중받는 느낌)',
    '구글 검색에서 영상 특정 구간 노출 가능',
    '이탈 방지 (원하는 부분 바로 이동)',
  ],
  template: [
    { time: '00:00', label: '인사 + 영상 소개' },
    { time: '00:35', label: '첫 번째 핵심' },
    { time: '01:50', label: '두 번째 핵심' },
    { time: '03:20', label: '마지막 정리 + CTA' },
  ],
};

// ============================================================
// 4. 최종화면 배치 전략
// ============================================================
export const END_SCREEN_STRATEGY = {
  optimalTiming: '영상 종료 5~20초 전',
  elements: [
    '관련 있는 영상 카드 1개 (논리적 연관성 중요)',
    '구독 버튼 1개',
  ],
  goldenTip: '영상 속 본인이 직접 가리키며 "다음 영상은 이걸 보시면 됩니다" 멘트하면 클릭률 3배 상승',
  example: '"김치찌개 만드는 법" 영상 끝 → "찌개와 어울리는 계란말이" 영상 추천 (관련성 ↑)',
};

// ============================================================
// 5. 해시태그 전략
// ============================================================
export const HASHTAG_STRATEGY = {
  optimalCount: 3,
  maxCount: 5,
  maxBeforeFail: 15,
  warning: '15개 초과 시 모든 해시태그 무효 처리',
  template: [
    { type: '메인 키워드', example: '#김치찌개', count: 1 },
    { type: '세부 키워드', example: '#황금레시피', count: 1 },
    { type: '채널명', example: '#채널이름', count: 1 },
  ],
};

// ============================================================
// 6. 채널 톤앤매너 (60-30-10 컬러 법칙)
// ============================================================
export const CHANNEL_BRANDING = {
  colorRule: '60-30-10 법칙',
  colorRoles: [
    { percentage: '60%', role: '메인 컬러', purpose: '채널 전반 분위기', examples: ['차분한 네이비', '따뜻한 베이지', '신뢰의 다크그린'] },
    { percentage: '30%', role: '포인트 컬러', purpose: '강조 부분', examples: ['신뢰의 화이트', '깔끔한 그레이'] },
    { percentage: '10%', role: '강조 컬러', purpose: '클릭 유도', examples: ['주목도 높은 옐로우', '강렬한 레드', '힘 있는 오렌지'] },
  ],
  channelArt3Elements: [
    { element: '핵심 가치', question: '이 채널은 무엇을 도와주는가?' },
    { element: '타겟', question: '누구를 위한 채널인가?' },
    { element: '업로드 주기', question: '언제 영상을 볼 수 있는가?' },
  ],
};

// ============================================================
// 7. 워터마크 전략
// ============================================================
export const WATERMARK_STRATEGY = {
  size: '150x150 픽셀',
  position: '영상 우측 하단',
  bestDesign: '"구독" 글자 또는 구독 아이콘 모양',
  effect: '구독 전환율 최소 15% 상승',
  warning: '복잡한 로고는 작아서 안 보임. 심플한 단어 1개가 효과적.',
};

// ============================================================
// 8. 치명적 실수 5가지
// ============================================================
export const CRITICAL_MISTAKES = [
  {
    mistake: '아동용 설정 잘못 체크',
    consequence: '댓글 폐쇄 + 맞춤 광고 금지 + 알림 미전송 + 저장 제한',
    fix: '[설정] → [채널] → [고급] → "아동용 아니요" 채널 단위 일괄 설정',
    severity: 'CRITICAL',
  },
  {
    mistake: '업로드 즉시 공개',
    consequence: 'SD 화질로 노출 → 시청자 이탈 + 광고 적합성 미검토 → 수익 손실',
    fix: '"일부 공개"로 1시간 대기 → HD/4K 처리 + 광고 검토 완료 → 정식 공개',
    severity: 'HIGH',
  },
  {
    mistake: '카테고리 잘못 설정',
    consequence: '알고리즘이 영상 분류 헷갈림 → 노출 감소',
    fix: '영상 내용에 정확히 맞는 카테고리 선택',
    severity: 'MEDIUM',
  },
  {
    mistake: '거주 국가 미설정',
    consequence: '한국 시청자 노출 감소',
    fix: '[설정] → [채널] → [기본 정보] → 거주 국가 "대한민국"',
    severity: 'MEDIUM',
  },
  {
    mistake: '시청 지속 시간 그래프 무시',
    consequence: '같은 실수 반복',
    fix: '유튜브 스튜디오 → 분석 → 시청 지속 시간 매번 확인',
    severity: 'HIGH',
  },
];

// ============================================================
// 9. 멘탈 서바이벌 (성장 마인드셋)
// ============================================================
export const MINDSET_PRINCIPLES = [
  {
    principle: '성과와 자아 분리',
    rule: '조회수 = 나의 가치 X. 알고리즘의 분류일 뿐',
    practice: '모든 영상을 "데이터 실험"으로 접근. 감정 빼고 수치로 분석.',
  },
  {
    principle: 'VIP 댓글 대접',
    rule: '댓글 1개의 가치 = 조회수 100회',
    practice: '초기 댓글 모두 하트 + 정성스러운 답글. 그 한 명이 찐팬이 됨.',
  },
  {
    principle: '복리 성장',
    rule: '오늘의 작은 세팅이 내일의 큰 변화',
    practice: '매일 1가지씩만 개선. 1년 후 360개의 개선 누적.',
  },
  {
    principle: '비교는 독',
    rule: '같은 출발선의 채널과만 비교',
    practice: '대형 채널 대신 비슷한 규모의 떡상 채널 분석',
  },
];

// ============================================================
// 10. 업로드 전 체크리스트 15가지 (전체)
// ============================================================
export const UPLOAD_CHECKLIST_15 = [
  // 기초 브랜딩 (4개)
  { category: '기초 브랜딩', item: '채널 설명(SEO)', detail: '메인 키워드 포함, 채널 정체성 명시' },
  { category: '기초 브랜딩', item: '비즈니스 이메일', detail: '[정보] 탭에 협업용 연락처 등록' },
  { category: '기초 브랜딩', item: '채널 트레일러', detail: '비구독자 대상 30초 채널 소개 영상' },
  { category: '기초 브랜딩', item: '구독 워터마크', detail: '영상 우측 하단 "구독" 아이콘' },
  // 검색 최적화 (4개)
  { category: '검색 최적화', item: '업로드 기본 설정', detail: '설명란 하단 고정 템플릿 (SNS 등)' },
  { category: '검색 최적화', item: '제목 키워드 배치', detail: '검색 키워드(앞) + 후킹 문구(뒤)' },
  { category: '검색 최적화', item: '설명란 첫 3줄', detail: '핵심 내용 문장형 키워드로 요약' },
  { category: '검색 최적화', item: '해시태그 전략', detail: '메인 + 세부 + 채널명 (3~5개)' },
  // 노출 및 유입 (3개)
  { category: '노출 및 유입', item: '썸네일 A/B 테스트', detail: '"테스트 및 비교" 기능으로 클릭률 최적화' },
  { category: '노출 및 유입', item: '카테고리 설정', detail: '채널 성격에 맞는 정확한 카테고리' },
  { category: '노출 및 유입', item: '거주 국가 설정', detail: '대한민국 등 타겟 국가 확인' },
  // 체류 시간 (3개)
  { category: '체류 시간', item: '재생목록 큐레이션', detail: '주제별 폴더화 + 키워드 포함 네이밍' },
  { category: '체류 시간', item: '영상 챕터(00:00)', detail: '타임스탬프 활용, 반드시 00:00 시작' },
  { category: '체류 시간', item: '최종 화면 설정', detail: '영상 종료 5~20초 전 관련 영상' },
  // 운영 및 수익 (1개)
  { category: '운영 및 수익', item: '고정 댓글 마케팅', detail: '질문 또는 링크로 소통 창구 활성화' },
];

// ============================================================
// 11. publish 결과 화면에서 활용할 동적 인사이트 매핑
// ============================================================

/**
 * 키워드별 권장 SEO 팁 자동 매칭
 */
export function getSeoTipForKeyword(keyword: string, categoryId: string): {
  titleTip: string;
  descriptionTip: string;
  hashtagTip: string;
  chapterSuggestion: string;
} {
  const k = keyword.toLowerCase();

  return {
    titleTip: `제목 앞 80%에 "${keyword}" 또는 관련 키워드를 배치하고, 뒤 20%에 호기심 유발 문구 추가`,
    descriptionTip: `설명란 첫 3줄에 "${keyword}" 포함. 자연스러운 문장으로 3~5회 반복`,
    hashtagTip: `해시태그 3~5개 권장: #${keyword.replace(/\s+/g, '')} + 세부 키워드 + 채널명`,
    chapterSuggestion: `챕터 4~5개 추천. 반드시 00:00부터 시작. 시청자가 원하는 부분 바로 이동 가능하게.`,
  };
}

/**
 * 카테고리별 추천 후킹 패턴
 */
export const HOOK_PATTERNS_BY_CATEGORY: Record<string, string[]> = {
  realestate: [
    '○년 차 부동산 전문가도 몰랐던',
    '99%가 놓치는 청약 비밀',
    '실거래가 데이터로 본 진짜 흐름',
    '계약 전 반드시 알아야 할',
  ],
  economy: [
    '월 100만원 더 만드는',
    '50대도 늦지 않은',
    '연금만 믿으면 안 되는 이유',
    '국세청도 모르는 절세 방법',
  ],
  health: [
    '5분만 따라하시면 됩니다',
    '70대 어머니가 직접 효과 본',
    '의사도 추천하는',
    '하루 3분이면 충분한',
  ],
  food: [
    '20년 차 주부의 진짜 비법',
    '맛집 주인장도 인정한',
    '실패 없는 황금레시피',
    '재료 단 3가지면 됩니다',
  ],
  travel: [
    '현지인만 아는',
    '비싸지 않게 즐기는',
    '○박 ○일 완벽 코스',
    '시니어 여행 추천',
  ],
  aitech: [
    '60대도 5분만에 따라하는',
    '복잡한 설정 없이 바로',
    '시니어 친화 사용법',
    '꼭 알아야 할 기본기',
  ],
  family: [
    '○○년 만의 진심',
    '가족도 몰랐던 사연',
    '읽으면서 눈물이',
    '평범한 일상의 특별함',
  ],
  language: [
    '50대도 시작 가능한',
    '문법 몰라도 말할 수 있는',
    '하루 5문장이면 충분',
    '실전 회화 즉시 활용',
  ],
  senior: [
    '50대 인생 2막을 위한',
    '60대 ○○ 도전기',
    '70대도 시작할 수 있는',
    '시니어가 직접 검증한',
  ],
  general: [
    '99%가 놓치는',
    '아무도 알려주지 않은',
    '진짜는 따로 있다',
    '○○년만의 진실',
  ],
};

/**
 * 카테고리별 추천 시청자 질문 (댓글 유도)
 */
export const ENGAGEMENT_QUESTIONS_BY_CATEGORY: Record<string, string[]> = {
  realestate: [
    '여러분 동네 시세는 어떤가요? 댓글로 공유해주세요',
    '청약 도전해보신 분 계신가요? 경험담 들려주세요',
  ],
  economy: [
    '여러분의 노후 자금 계획은 어떠신가요?',
    '재테크 첫 걸음, 어떤 것부터 시작하셨나요?',
  ],
  health: [
    '여러분은 몇 시간 운동하시나요?',
    '효과 본 운동법 댓글로 공유해주세요',
  ],
  food: [
    '여러분의 비법 양념 비율 알려주세요',
    '실패 없는 본인만의 레시피 공유 부탁드립니다',
  ],
  travel: [
    '여러분의 인생 여행지는 어디인가요?',
    '추천하실 만한 시니어 친화 여행지 있으신가요?',
  ],
  aitech: [
    '디지털 도구 처음 써보신 분, 어려운 점 있으신가요?',
    '꼭 배우고 싶은 디지털 기능 댓글로 알려주세요',
  ],
  family: [
    '여러분의 비슷한 경험 들려주세요',
    '가족과의 추억 댓글로 공유해주세요',
  ],
  language: [
    '외국어 공부할 때 가장 어려운 점은?',
    '효과 본 학습 방법 알려주세요',
  ],
  senior: [
    '인생 2막, 어떤 도전 하고 계신가요?',
    '5060 분들의 일상 이야기 들려주세요',
  ],
  general: [
    '여러분의 의견 댓글로 알려주세요',
    '비슷한 경험 있으시면 공유 부탁드립니다',
  ],
};

/**
 * NuTube가 결과 페이지에서 활용할 알고리즘 인사이트 종합
 */
export function getAlgorithmInsights(keyword: string, categoryId: string) {
  const seoTip = getSeoTipForKeyword(keyword, categoryId);
  const hooks = HOOK_PATTERNS_BY_CATEGORY[categoryId] || HOOK_PATTERNS_BY_CATEGORY.general;
  const questions = ENGAGEMENT_QUESTIONS_BY_CATEGORY[categoryId] || ENGAGEMENT_QUESTIONS_BY_CATEGORY.general;

  return {
    seo: seoTip,
    hookPatterns: hooks,
    engagementQuestions: questions,
    chapterTemplate: CHAPTER_RULES.template,
    endScreenTip: END_SCREEN_STRATEGY.goldenTip,
    hashtagStrategy: HASHTAG_STRATEGY,
    checklist: UPLOAD_CHECKLIST_15,
    criticalMistakes: CRITICAL_MISTAKES,
    mindsetPrinciples: MINDSET_PRINCIPLES,
  };
}

// ============================================================
// ⚠️ INTERNAL ALGORITHM ONLY - DO NOT EXPOSE TO USERS
// 시니어 타겟 쇼츠 채널 최적화 알고리즘
// (사용자에게는 결과만 보여줌, 알고리즘 자체는 노출 X)
// ============================================================

/**
 * 시니어 타겟 채널 운영 알고리즘 키 (10단계)
 * 매뉴얼 텍스트는 노출 X, 알고리즘 ID 와 가중치만 코드에 반영
 */
const SENIOR_CHANNEL_ALGORITHM = {
  // 1: 환경 분리 (모바일 데이터 우선)
  network: { strategy: 'mobile_only', weight: 1.0 },
  
  // 2: 계정 시니어 분류 유도 (생년월일 1960~1980)
  account: { ageRange: [1960, 1980], weight: 0.9 },
  
  // 3: 채널 카테고리 (교육 또는 인물·블로그)
  category: { primary: 'education', secondary: 'people_blog', weight: 0.8 },
  
  // 4: 사전 시청 워밍업 (4~5일 시청 패턴)
  warmup: { days: 5, watchCount: 20, weight: 0.95 },
  
  // 5: 사연 분석 기준 (조회수 + 첫 3초 후크)
  reference: { minViews: 1000000, hookSeconds: 3, weight: 1.0 },
  
  // 6: 콘텐츠 소스 (야외 실사 + 육성 + 1분 이하)
  content: { format: 'shorts', maxDurationSec: 60, narration: 'voice', weight: 1.0 },
  
  // 7: 편집 (시니어 가독성 = 큰 자막 필수)
  edit: { fontSize: 'large', subtitleRequired: true, weight: 0.9 },
  
  // 8: 메타데이터 (제목·설명·태그 자동 최적화)
  meta: { generator: 'auto', weight: 1.0 },
  
  // 9: 업로드 (24시간 후 + 5~20분 차이, 비공개→공개)
  upload: { 
    minIntervalHours: 24, 
    randomMinutes: [5, 20],
    flow: 'private_then_public',
    avoidExactHour: true,
    notForKids: true,
    weight: 1.0 
  },
  
  // 10: 정책 (자극적 소재 X, 1일 1영상)
  policy: { 
    avoidSensational: true, 
    dailyLimit: 1,
    deletionForbidden: true,
    targetAvgViews: 2000,
    weight: 1.0 
  },
};

/**
 * 시니어 타겟 시나리오 ID (내부용)
 * URL ?scenario=senior-story 진입 시 활성화
 * 사용자에게는 일반적인 "스토리텔링" 으로 노출
 */
const SENIOR_SCENARIO_ID = 'senior-story';

/**
 * 시니어 타겟 메타데이터 자동 보정 (내부 알고리즘)
 * 시니어 키워드 감지 시 자동으로 적용:
 * - 큰 자막 권장
 * - 1분 이하 쇼츠 권장
 * - 정각 업로드 회피
 * - 비공개 → 공개 플로우
 * - 카테고리 [교육] 또는 [인물/블로그]
 * - 아동용 아님 체크
 */
export function isSeniorTargetKeyword(keyword: string): boolean {
  const k = keyword.toLowerCase();
  // 시니어 사연/인생 이야기 관련 키워드 자동 감지
  return /시니어|어르신|50대|60대|70대|80대|황혼|인생|사연|중년|노년|어머니|아버지|부모|손주|할머니|할아버지|회상|추억|과거|예전|옛날/.test(k);
}

/**
 * 시니어 타겟 메타데이터 보정 (내부)
 * 키워드가 시니어 타겟이면 자동으로 노하우 적용된 메타 반환
 * 매뉴얼 텍스트 노출 X, 보정된 결과만 반환
 */
export function getSeniorOptimizationFlags(keyword: string, categoryId: string) {
  const isSenior = isSeniorTargetKeyword(keyword);
  if (!isSenior) return null;
  
  // 시니어 타겟일 때만 자동으로 적용되는 보정 (내부 알고리즘)
  return {
    // UI에 노출 가능한 일반화된 권장 사항 (매뉴얼 X)
    recommendedFormat: 'shorts',
    recommendedDuration: '1분 이하',
    recommendedSubtitle: '큰 글자 (시니어 가독성)',
    recommendedCategory: '교육 / 인물·블로그',
    recommendedNarration: '육성 녹음',
    
    // 내부 알고리즘 가중치 (사용자 노출 X, 메타 생성에만 활용)
    _internal: {
      ageRangeBoost: SENIOR_CHANNEL_ALGORITHM.account.ageRange,
      uploadFlow: SENIOR_CHANNEL_ALGORITHM.upload.flow,
      avoidExactHour: SENIOR_CHANNEL_ALGORITHM.upload.avoidExactHour,
      avgViewsTarget: SENIOR_CHANNEL_ALGORITHM.policy.targetAvgViews,
    },
  };
}

/**
 * 시니어 타겟 후크 패턴 (감동/공감 중심)
 * 박 대표님 자산 5단계 "감동/공감 포인트 파악" 반영
 */
export const SENIOR_HOOK_PATTERNS = [
  '"50년 전 이맘때, 저는…"',
  '"그날 어머니가 마지막으로 하신 말씀은…"',
  '"평생 잊지 못할 그 한 마디"',
  '"부모님 돌아가시기 전 꼭 들어야 했던 말"',
  '"40년 전 그 사람을 다시 만났습니다"',
  '"손주에게 처음 듣게 된 말"',
  '"가족 모두가 울었던 그날의 진실"',
  '"인생 60년, 가장 후회하는 한 가지"',
];

/**
 * 시니어 타겟 댓글 유도 (공감 기반)
 */
export const SENIOR_ENGAGEMENT_QUESTIONS = [
  '여러분도 비슷한 추억이 있으신가요?',
  '부모님께 못다 한 말이 있다면 댓글로 남겨주세요.',
  '인생에서 가장 후회하는 일이 있다면?',
  '가족과 함께한 가장 따뜻한 기억을 들려주세요.',
  '시간이 지나야 깨닫는 진실이 있다면?',
];

/**
 * 시니어 타겟 업로드 시간 추천 (내부 알고리즘)
 * 정각 업로드 회피 + 5~20분 차이
 * 박 대표님 자산 9단계 "전날 대비 최소 24시간 + 5~20분 차이" 반영
 */
export function getSeniorUploadTime(): { hour: number; minute: number; tip: string } {
  const hour = 9 + Math.floor(Math.random() * 4); // 9시~12시 (시니어 시청 시간)
  const minute = 5 + Math.floor(Math.random() * 16); // 5분~20분
  return {
    hour,
    minute,
    tip: '정각 업로드 회피 · 시니어 시청 시간대 (오전)',
  };
}

/**
 * 시니어 타겟 영상 정책 자동 체크 (내부)
 * 박 대표님 자산 10단계 "정책 준수" 반영
 */
export const SENIOR_POLICY_CHECKLIST = [
  { id: 'not_for_kids', label: '"아동용 아님" 체크', critical: true },
  { id: 'no_sensational', label: '자극적 소재 회피 (경찰·폭력·고소 등)', critical: true },
  { id: 'no_false_facts', label: '허위 사실·사칭 금지', critical: true },
  { id: 'one_video_per_day', label: '1일 1영상', critical: false },
  { id: 'no_deletion', label: '업로드 후 삭제·재업로드 금지', critical: true },
  { id: 'avoid_exact_hour', label: '정각 업로드 회피', critical: false },
];

/**
 * 키워드 + 카테고리 기반 시니어 타겟 보정 진단
 * NuTube 결과 페이지에서 시니어 키워드 자동 감지하면
 * 위 알고리즘이 자동 적용되어 사용자에게 보정된 결과 반환
 */
export function applySeniorAlgorithm(
  keyword: string,
  categoryId: string,
  baseMeta: { title?: string; description?: string; tags?: string[] }
) {
  const isSenior = isSeniorTargetKeyword(keyword);
  if (!isSenior) return baseMeta;
  
  // 시니어 타겟이면 자동으로 보정 (사용자에게는 결과만)
  // 매뉴얼 텍스트 노출 X, 알고리즘 결과만 반영
  return {
    ...baseMeta,
    // 메타데이터 자동 보정 (예시 - 실제 구현은 contentEngine 활용)
    _seniorOptimized: true,
    _appliedRules: [
      'shorts_format',
      'large_subtitle',
      'voice_narration',
      'category_education',
      'avoid_sensational',
    ],
  };
}
