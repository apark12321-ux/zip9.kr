/**
 * NuTube 떡상 시나리오 엔진 v3.8
 * 
 * 박예준 대표 비전 100% 반영:
 * - "지금 보신 이 영상 빵원으로 만든 겁니다" 톤
 * - 키워드별 다른 트리거 자동 매칭
 * - AI가 알아서 구체적 수치 추정
 * - 억지스럽지 않은 자연스러운 강도
 * - 시드 기반 다양성 (매번 다른 결과)
 * 
 * 2026.04.26 첨부 PDF 반영:
 * - 1분 쇼츠 모드 + 롱폼 모드 듀얼 지원
 * - 썰 채널 스타일 적용
 */

// ============================================================
// 1. 시드 기반 랜덤 (매번 다른 결과)
// ============================================================

let _callCounter = 0;

function makeSeed(keyword: string, salt: string = ''): number {
  const now = new Date();
  const minuteBucket = Math.floor(now.getTime() / (1000 * 60));

  let userSig = '';
  if (typeof window !== 'undefined') {
    try {
      userSig =
        (navigator.userAgent || '').slice(0, 20) +
        ((screen && screen.width) || 0).toString();
    } catch {}
  }

  const composite =
    keyword + salt + minuteBucket.toString() + userSig + _callCounter.toString();
  const base = composite.split('').reduce((acc, c) => {
    return ((acc << 5) - acc + c.charCodeAt(0)) | 0;
  }, 0);
  return Math.abs(base);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rand: () => number): T {
  return arr[Math.floor(rand() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    const idx = Math.floor(rand() * copy.length);
    result.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return result;
}

export function bumpSeed(): void {
  _callCounter = (_callCounter + 1) % 1000000;
}

// ============================================================
// 2. 한국어 조사 자동 처리
// ============================================================

function hasJongseong(word: string): boolean {
  if (!word || word.length === 0) return false;
  const lastChar = word[word.length - 1];
  const code = lastChar.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    return (code - 0xac00) % 28 !== 0;
  }
  if (/[a-zA-Z]/.test(lastChar)) {
    return /[bcdfghjklmnpqrstvwxyz]$/i.test(lastChar);
  }
  if (/[0-9]/.test(lastChar)) {
    return ['1', '3', '6', '7', '8', '0'].includes(lastChar);
  }
  return false;
}

function jo(word: string, withJong: string, withoutJong: string): string {
  return hasJongseong(word) ? withJong : withoutJong;
}

/** 인라인 조사 처리 헬퍼 - 템플릿 리터럴 안에서 사용 */
function jong(word: string, withJong: string, withoutJong: string): string {
  return hasJongseong(word) ? withJong : withoutJong;
}

function k(keyword: string, particle: 'i' | 'eul' | 'eun' | 'ro' | 'gwa' | 'ya'): string {
  switch (particle) {
    case 'i': return keyword + jo(keyword, '이', '가');
    case 'eul': return keyword + jo(keyword, '을', '를');
    case 'eun': return keyword + jo(keyword, '은', '는');
    case 'ro': return keyword + jo(keyword, '으로', '로');
    case 'gwa': return keyword + jo(keyword, '과', '와');
    case 'ya': return keyword + jo(keyword, '이야', '야');
    default: return keyword;
  }
}

// ============================================================
// 3. 키워드 분석 - 카테고리 자동 감지 + 수치 자동 추정
//    박 대표님 핵심 요구: "AI가 알아서 추정"
// ============================================================

type DomainType = 
  | 'realestate'    // 부동산/재테크
  | 'language'      // 영어/외국어
  | 'fitness'       // 다이어트/건강
  | 'selfdev'       // 자기계발/공부
  | 'aitech'        // AI/디지털 도구
  | 'senior'        // 시니어/은퇴
  | 'food'          // 요리/맛집
  | 'travel'        // 여행/취미
  | 'family'        // 가족 사연/감동 (시어머니/며느리/시댁/친정 등)
  | 'general';      // 일반 (fallback)

interface DomainProfile {
  type: DomainType;
  /** 떡상 트리거 우선순위 (3개 핵심) */
  primaryTriggers: string[];
  /** 카테고리 특화 수치 (AI가 추정한 진짜 같은 숫자들) */
  numbers: {
    primary: string[];      // 핵심 결과 (8천만원, -12kg 등)
    duration: string[];     // 기간 (3개월, 6개월 등)
    daily: string[];        // 일일 투자 (15분, 1시간 등)
    sub: string[];          // 보조 수치 (수익률, 점수 등)
  };
  /** 시청자 거울 표현 */
  mirror: string[];
  /** 핵심 비밀 (의외의 진실) */
  secrets: string[];
  /** 타겟 시청자 */
  audience: string[];
  /** 자연스러운 강조 단어 */
  emphasis: string[];
}

const DOMAIN_PROFILES: Record<DomainType, DomainProfile> = {
  realestate: {
    type: 'realestate',
    primaryTriggers: ['수치', '시간단축', '비밀'],
    numbers: {
      primary: ['8천만원 차익', '1억 2천 차익', '5천만원 수익', '3억대 매물', '2배 수익'],
      duration: ['2년', '1년 6개월', '3년', '6개월'],
      daily: ['주말 2시간', '저녁 1시간', '점심시간 30분'],
      sub: ['수익률 60%', '연 25%', '월 5%', '평당 200만원'],
    },
    mirror: [
      '보통 부동산을 시작하면 매물부터 보시잖아요',
      '집 사려고 알아보다 보면 다 비슷해 보이거든요',
      '보통 부동산 시작하면 인기 지역만 검색하시잖아요',
    ],
    secrets: [
      '사실 비결은 입지가 아니라 타이밍이에요',
      '진짜 중요한 건 매물이 아니라 협상이거든요',
      '핵심은 가격이 아니라 흐름을 읽는 거예요',
    ],
    audience: ['40대 평범한 직장인', '30대 첫 내집 마련', '50대 노후 준비', '맞벌이 부부'],
    emphasis: ['직접 해보니', '실제로', '사실', '진짜'],
  },

  language: {
    type: 'language',
    primaryTriggers: ['경험담', '시간효율', '거울', '진심'],
    numbers: {
      primary: ['토익 850점', '토익 900점', '말이 트인', '외국인과 30분 대화', '6개월 만에 회화', '꾸준히 1년 학습', '하루 30분 투자'],
      duration: ['6개월', '1년', '3개월', '8개월'],
      daily: ['하루 15분', '하루 30분', '아침 20분', '출퇴근 시간'],
      sub: ['하루 1시간 이하', '주 5일', '꾸준히 100일'],
    },
    mirror: [
      '영어 시작하면 단어장부터 사시잖아요',
      '학원 등록부터 하시는 분들 많은데요',
      '회화는 막상 입이 안 떨어지죠',
      '학원만 다니다가 시간만 보내시잖아요',
      '영어 공부, 매번 시작만 하시죠',
    ],
    secrets: [
      '비결은 단어암기가 아니라 패턴이에요',
      '진짜 중요한 건 문법이 아니라 발화량이에요',
      '핵심은 학원이 아니라 매일 5분의 반복이에요',
      '진짜 답은 학원이 아니라 매일의 작은 반복이에요',
      '영어 잘하는 것보다 매일 입을 떼는 게 더 중요해요',
    ],
    audience: ['30대 직장인', '40대 중년 학습자', '대학생', '취준생', '재취업 준비자', '영어 입문자'],
    emphasis: ['직접 해보니', '실제로 1년', '진짜', '솔직히'],
  },

  fitness: {
    type: 'fitness',
    primaryTriggers: ['비포애프터', '즉시효과', '의외성'],
    numbers: {
      primary: ['-12kg', '-8kg', '-15kg', '체지방 -5%', '근육량 +3kg'],
      duration: ['3개월', '4개월', '100일', '6개월'],
      daily: ['하루 15분', '주 3회 30분', '아침 운동 20분'],
      sub: ['체지방률 18%', '허리 -10cm', '체중계 변화'],
    },
    mirror: [
      '다이어트 시작하면 헬스장부터 끊으시잖아요',
      '식단 강박 때문에 스트레스 받으시죠',
      '주말에 한 번 풀면 또 좌절하잖아요',
    ],
    secrets: [
      '비결은 운동이 아니라 식사 시간이에요',
      '진짜 중요한 건 칼로리가 아니라 호르몬이에요',
      '핵심은 의지가 아니라 환경 설계예요',
    ],
    audience: ['40대 직장인', '출산 후 엄마', '30대 워킹맘', '회식 잦은 직장인'],
    emphasis: ['직접 1년', '진짜', '제 경험상', '솔직히'],
  },

  selfdev: {
    type: 'selfdev',
    primaryTriggers: ['시간효율', '평범인변신', '비밀', '꾸준함'],
    numbers: {
      primary: ['하루 30분 투자', '6개월 변화', '독서 100권', '2배 효율', '꾸준한 1년', '작은 반복'],
      duration: ['6개월', '100일', '1년', '3개월'],
      daily: ['하루 30분', '아침 1시간', '퇴근 후 30분'],
      sub: ['주 5권', '연 50권', '꾸준히 365일', '구매 전환 1%'],
    },
    mirror: [
      '자기계발 시작하면 책부터 사시잖아요',
      '강의 결제부터 하시는 분들 많죠',
      '계획만 거창하게 세우게 되거든요',
      '본인 강점이 뭔지 모르고 살아오셨잖아요',
      '시작이 늦었다고 생각하시죠',
    ],
    secrets: [
      '비결은 독서량이 아니라 실행 빈도예요',
      '진짜 중요한 건 강의가 아니라 메모예요',
      '핵심은 거창함이 아니라 작은 반복이에요',
      '진짜 답은 거창함이 아니라 매일의 작은 실행이에요',
      '같은 능력이라도 풀어내는 방식에 따라 가치가 달라집니다',
      '비결은 화려함이 아니라 꾸준함이에요',
    ],
    audience: ['30대 직장인', '40대 자기계발러', '대학생', '직장인 부모', '재취업 준비자', '인생 2막 준비자'],
    emphasis: ['직접 해보니', '1년 동안', '실제로', '솔직히'],
  },

  aitech: {
    type: 'aitech',
    primaryTriggers: ['무료', '무제한', '비싼것대체', '진심', '꾸준함'],
    numbers: {
      primary: ['빵원', '0원', '무제한 사용', '10분 작업', '23분 만에', '꾸준히 1년', '진심 담은 한 편'],
      duration: ['10분', '30분', '1시간 안에', '하루', '6개월', '1년 만에'],
      daily: ['10분', '30분', '한 시간'],
      sub: ['조회수 N만', '결과물 100개', '하루 10편', '구독자 0명부터', '소수 정예 4천명'],
    },
    mirror: [
      '보통 AI로 만들면 얼굴이 계속 변하잖아요',
      'ChatGPT만 쓰시잖아요',
      '유료 도구 결제부터 고민하시죠',
      '영상 만들기, 어렵게만 느끼시잖아요',
      '완벽한 영상을 만들어야 한다고 생각하시죠',
    ],
    secrets: [
      '비결은 도구가 아니라 프롬프트예요',
      '진짜 중요한 건 비싼 툴이 아니라 사용법이에요',
      '핵심은 AI가 아니라 워크플로우예요',
      '진짜 답은 화려함이 아니라 꾸준함이에요',
      '구독자 수보다 진심으로 찾아주는 한 명이 더 중요해요',
      '비결은 빠른 성장이 아니라 진심을 담는 거예요',
    ],
    audience: ['크리에이터 지망생', '자영업자', '디지털 입문자', '40대 IT 활용', '시니어 입문자', '영상 처음 만드는 분'],
    emphasis: ['직접 해보니', '진짜', '솔직히', '제가 1년', '실제 6개월'],
  },

  senior: {
    type: 'senior',
    primaryTriggers: ['연령가능성', '실제증명', '즉시시작'],
    numbers: {
      primary: ['은퇴 후 월 200만원', '60대 시작', '2년 만에', '50대 첫 도전'],
      duration: ['1년 만에', '6개월', '2년'],
      daily: ['하루 1시간', '오전 30분', '저녁 1시간'],
      sub: ['월 N만원 수익', 'N명 수강생', '구독자 N명'],
    },
    mirror: [
      '나이가 들어서 새로 시작하기 부담스러우시죠',
      '디지털이 어려워서 포기하셨잖아요',
      '뭘 시작해야 할지 막막하시죠',
    ],
    secrets: [
      '비결은 새로운 게 아니라 익숙한 거예요',
      '진짜 중요한 건 기술이 아니라 경험이에요',
      '핵심은 빠른 변화가 아니라 꾸준함이에요',
    ],
    audience: ['50대 60대', '은퇴 준비자', '시니어 디지털 입문자', '제2의 직업 준비'],
    emphasis: ['직접', '진짜', '제가 60대', '솔직히 말씀드리면'],
  },

  food: {
    type: 'food',
    primaryTriggers: ['의외성', '검증', '따라하기쉬움'],
    numbers: {
      primary: ['재료 3개로', '5분 컷', '실패 0%', '2분 요리'],
      duration: ['5분', '10분', '15분'],
      daily: ['아침 10분', '저녁 15분'],
      sub: ['단돈 3천원', '한 끼 5천원', '4인분 가능'],
    },
    mirror: [
      '요리책 보면 재료가 너무 많죠',
      '시간 없어서 포기하시잖아요',
      '실패할까 봐 시도 안 하시죠',
    ],
    secrets: [
      '비결은 재료가 아니라 순서예요',
      '진짜 중요한 건 양념이 아니라 불 조절이에요',
    ],
    audience: ['직장인', '자취생', '신혼부부', '바쁜 부모'],
    emphasis: ['직접 해보니', '진짜', '실제로', '5년차'],
  },

  travel: {
    type: 'travel',
    primaryTriggers: ['경험담', '비밀장소', '가성비'],
    numbers: {
      primary: ['3박 4일 50만원', '항공+숙박 100만원', '현지인만 아는'],
      duration: ['3박 4일', '일주일', '4박 5일'],
      daily: [],
      sub: ['하루 5만원', '월 1회', '연 4회 여행'],
    },
    mirror: [
      '여행 가면 관광지만 도시잖아요',
      '비싼 패키지만 알아보시죠',
      '일정 짜는 게 제일 어렵죠',
    ],
    secrets: [
      '비결은 유명한 곳이 아니라 동네예요',
      '진짜 중요한 건 일정이 아니라 여유예요',
    ],
    audience: ['직장인', '커플', '가족 여행자', '혼자 여행자'],
    emphasis: ['직접 가보니', '진짜', '여행 10년차', '실제로'],
  },

  // 🎯 family 도메인 - 가족 사연/감동 (1분 쇼츠 최적, 시니어층 폭발)
  // 8가지 사연 콘텐츠 패턴 분석 반영 - 5가지 톤 변형:
  //   ① 사이다 사연형 (참다가 폭발 → 카타르시스)
  //   ② 친구 톤형 (친근한 대화 → 공감/위로)
  //   ③ 1분 썰형 (짧고 강한 임팩트)
  //   ④ 수면 라디오형 (잠자기 전 차분)
  //   ⑤ 인생 반전형 (노후/황혼 로맨스)
  family: {
    type: 'family',
    primaryTriggers: ['공감', '카타르시스', '의외성'],
    numbers: {
      primary: ['10년 묵은', '20년 만에', '결혼 5년차', '시집 3년 만에', '명절 한 번에', '60대에 만난', '인생 2막', '황혼에 찾아온'],
      duration: ['10년', '20년', '5년', '명절 한 번', '결혼 후', '60대에', '은퇴 후'],
      daily: [],
      sub: ['처음으로', '결국에는', '뜻밖에도', '진심으로', '진짜로'],
    },
    mirror: [
      // 사이다형
      '시댁 갈 때마다 마음이 무거우시잖아요',
      '명절만 되면 스트레스 받으시죠',
      '가족 모임이 부담스러우신 분들 많으실 거예요',
      '며느리/사위 입장에서 말 못 하는 일들 있잖아요',
      '시어머니/장모님께 서운한 일 한두 번 아니죠',
      // 친구톤
      '있잖아요, 우리 한번 솔직하게 얘기해봐요',
      '친구한테도 못 한 이야기, 여기서만 풀어볼게요',
      // 인생반전
      '인생 2막은 늦지 않아요',
      '60대에도 새로운 시작은 있더라고요',
    ],
    secrets: [
      // 사이다형
      '진짜 답은 참는 게 아니라 한 번 솔직하게 말하는 거예요',
      '가족이라고 다 이해해줄 거라는 건 착각이에요',
      '관계는 거리를 두는 게 더 가까워지는 길이에요',
      '진심은 결국 통한다는 게 진짜였어요',
      // 친구톤
      '시간이 약이라는 말, 정말이더라고요',
      // 인생반전
      '인생은 끝까지 가봐야 알아요',
      '예상치 못한 곳에서 답이 나오더라고요',
    ],
    audience: ['결혼 5년차 며느리', '40대 사위', '시어머니 입장', '시집간 딸', '맞벌이 부부', '50대 어머니', '60대 시니어', '은퇴 후 부부'],
    emphasis: ['진짜로', '솔직히', '그날따라', '뜻밖에도', '결국엔', '진심으로'],
  },

  general: {
    type: 'general',
    primaryTriggers: ['수치', '경험담', '거울'],
    numbers: {
      primary: ['1년 만에', '6개월 후', '결과적으로'],
      duration: ['6개월', '1년', '3개월'],
      daily: ['하루 30분', '주 3회'],
      sub: ['꾸준히', '매일'],
    },
    mirror: [
      '시작하기가 제일 어렵죠',
      '뭐부터 해야 할지 막막하시잖아요',
    ],
    secrets: [
      '비결은 거창함이 아니라 꾸준함이에요',
      '진짜 중요한 건 방법이 아니라 시작이에요',
    ],
    audience: ['직장인', '입문자', '관심 있는 분'],
    emphasis: ['직접', '진짜', '솔직히'],
  },
};

/**
 * 키워드를 분석해서 어떤 도메인에 속하는지 자동 감지
 */
function detectDomain(keyword: string, categoryName?: string): DomainProfile {
  const k = keyword.toLowerCase();
  const c = (categoryName || '').toLowerCase();

  // 가족 사연/감동 (1분 쇼츠 떡상 카테고리 - 우선 감지)
  // 5가지 톤 변형 모두 포함: 사이다 / 친구톤 / 1분썰 / 수면 / 인생반전
  if (/시어머니|며느리|사위|장인|장모|시댁|친정|시부모|시아버지|시집|장가|결혼|이혼|가족|사연|감동|사이다|시누이|시동생|동서|올케|친척|명절|제사|차례|황혼|노후 사랑|인생.{0,2}반전|인생 2막|썰풀이|가족 이야기|수면.{0,2}사연|잠자리.{0,2}이야기/.test(k + c)) {
    return DOMAIN_PROFILES.family;
  }
  // 부동산/재테크
  if (/부동산|아파트|주식|투자|재테크|매수|매도|분양|청약|월세|전세|적금|예금|펀드|증권|코인|비트|이더|nft|매물|상가|토지|경매/.test(k + c)) {
    return DOMAIN_PROFILES.realestate;
  }
  // 영어/외국어
  if (/영어|회화|토익|토플|영문|외국어|일본어|중국어|스페인어|언어|발음|단어/.test(k + c)) {
    return DOMAIN_PROFILES.language;
  }
  // 다이어트/건강
  if (/다이어트|살빼기|체중|감량|운동|헬스|요가|필라테스|건강|영양|식단|간헐적|단식|면역|혈압|당뇨|stretching/.test(k + c)) {
    return DOMAIN_PROFILES.fitness;
  }
  // 시니어/은퇴
  if (/시니어|은퇴|노후|50대|60대|70대|중년|퇴직|연금|시니어라이프|재취업/.test(k + c)) {
    return DOMAIN_PROFILES.senior;
  }
  // AI/디지털
  if (/ai|chatgpt|미드저니|midjourney|notebook|노트북lm|gemini|sora|코딩|코드|프로그래밍|앱|툴|소프트웨어|디지털|영상|쇼츠|편집|썸네일|콘텐츠/.test(k + c)) {
    return DOMAIN_PROFILES.aitech;
  }
  // 자기계발/공부
  if (/공부|독서|책|습관|동기|자기계발|성장|시간관리|생산성|루틴|새벽|아침|메모|기록|글쓰기|일기/.test(k + c)) {
    return DOMAIN_PROFILES.selfdev;
  }
  // 요리/맛집
  if (/요리|레시피|음식|맛집|반찬|한식|양식|중식|일식|디저트|베이킹|커피/.test(k + c)) {
    return DOMAIN_PROFILES.food;
  }
  // 여행
  if (/여행|투어|관광|호텔|항공|국내여행|해외여행|배낭|일정|코스/.test(k + c)) {
    return DOMAIN_PROFILES.travel;
  }

  return DOMAIN_PROFILES.general;
}

/**
 * 도메인 프로필 + 시드 → 구체적 디테일 자동 생성
 */
function getDetails(profile: DomainProfile, rand: () => number) {
  return {
    primaryNum: pick(profile.numbers.primary, rand),
    duration: pick(profile.numbers.duration, rand),
    daily: profile.numbers.daily.length > 0 ? pick(profile.numbers.daily, rand) : '',
    subNum: profile.numbers.sub.length > 0 ? pick(profile.numbers.sub, rand) : '',
    mirror: pick(profile.mirror, rand),
    secret: pick(profile.secrets, rand),
    audience: pick(profile.audience, rand),
    emphasis: pick(profile.emphasis, rand),
  };
}

// ============================================================
// 4. 제목 생성 (도메인별 다른 패턴 적용)
// ============================================================

interface TitleResult {
  title: string;
  pattern: string;
  ctr_estimate: string;
  reasoning: string;
}

/**
 * 도메인별 제목 패턴 - 박 대표님 비전 "키워드별 다른 트리거"
 */
function generateTitlesForDomain(
  keyword: string,
  profile: DomainProfile,
  rand: () => number
): TitleResult[] {
  const detail = getDetails(profile, rand);

  // 도메인별 제목 풀
  const pools: Record<DomainType, ((d: typeof detail) => TitleResult)[]> = {
    realestate: [
      (d) => ({
        title: `${keyword}, ${d.duration} ${d.primaryNum} 만든 방법`,
        pattern: '결과 명시형',
        ctr_estimate: '8.5~11%',
        reasoning: `구체적 결과(${d.primaryNum})와 기간(${d.duration})으로 검증 가능한 약속. 부동산 시청자는 숫자를 가장 신뢰합니다.`,
      }),
      (d) => ({
        title: `${d.audience}${jong(d.audience, "이", "가")} 직접 해본 ${keyword}`,
        pattern: '경험담 + 거울',
        ctr_estimate: '7~9.5%',
        reasoning: `타겟 시청자가 본인 모습을 발견(${d.audience}). 부동산은 "비슷한 처지의 사람" 사례를 가장 신뢰합니다.`,
      }),
      (d) => ({
        title: `${keyword} 시작 전 알았으면 좋았을 것들`,
        pattern: '후회/교훈형',
        ctr_estimate: '7~9%',
        reasoning: '경험자의 후회는 입문자에게 가장 강력한 신뢰. 같은 실수 회피 욕구.',
      }),
      (d) => ({
        title: `${keyword}, ${d.subNum} 나오는 진짜 비결`,
        pattern: '수익률 명시형',
        ctr_estimate: '8~10%',
        reasoning: `구체적 수익률(${d.subNum})은 부동산 시청자에게 검증 신호.`,
      }),
      (d) => ({
        title: `${d.audience}도 ${keyword} 가능한 이유`,
        pattern: '진입장벽 제거',
        ctr_estimate: '7.5~9.5%',
        reasoning: '"평범한 사람도 가능"은 부동산처럼 진입장벽 높은 분야에 효과적.',
      }),
      (d) => ({
        title: `${keyword} ${d.duration}, ${d.primaryNum}의 기록`,
        pattern: '기록 공개형',
        ctr_estimate: '7.5~10%',
        reasoning: '"기록"이라는 단어가 진정성 + 데이터 신호. 부동산은 검증 가능한 콘텐츠 선호.',
      }),
    ],
    language: [
      (d) => ({
        title: `${keyword}, 학원 안 가고 ${d.duration} 만에`,
        pattern: '학원 부정형',
        ctr_estimate: '8~10.5%',
        reasoning: '"학원 안 가고"는 비용 + 시간 절약 약속. 영어 시청자가 가장 원하는 것.',
      }),
      (d) => ({
        title: `${d.daily}만 ${keyword} 해도 되는 이유`,
        pattern: '진입장벽 낮춤',
        ctr_estimate: '8~10%',
        reasoning: `"${d.daily}"는 직장인이 가장 끌리는 시간. 부담 제거.`,
      }),
      (d) => ({
        title: `${keyword} 1년 차의 솔직한 후기`,
        pattern: '경험담 정직형',
        ctr_estimate: '7.5~9.5%',
        reasoning: '"솔직한 후기"는 광고성 콘텐츠와의 차별화. 영어는 사기성 광고가 많아 진정성이 중요.',
      }),
      (d) => ({
        title: `${keyword}, 이렇게 하면 ${d.primaryNum}`,
        pattern: '결과 약속형',
        ctr_estimate: '8~10.5%',
        reasoning: `구체적 결과(${d.primaryNum}) 약속. 영어는 측정 가능한 결과를 원하는 시청자가 많음.`,
      }),
      (d) => ({
        title: `${d.audience}의 ${keyword} 도전기`,
        pattern: '도전 스토리형',
        ctr_estimate: '7~9%',
        reasoning: '"도전기"는 영어처럼 장기 학습 분야에 가장 효과적인 스토리텔링 형식.',
      }),
      (d) => ({
        title: `${keyword}, 진짜 효과 본 한 가지`,
        pattern: '단일 솔루션형',
        ctr_estimate: '7.5~10%',
        reasoning: '"한 가지"는 압축된 핵심 약속. 영어 학습법 너무 많아서 단순화 욕구 큼.',
      }),
    ],
    fitness: [
      (d) => ({
        title: `${d.duration} ${d.primaryNum}, ${keyword} 후기`,
        pattern: '비포애프터 정직형',
        ctr_estimate: '9~12%',
        reasoning: `구체적 변화량(${d.primaryNum})은 다이어트 콘텐츠 클릭률 가장 높음.`,
      }),
      (d) => ({
        title: `헬스장 안 가고 ${keyword} 한 방법`,
        pattern: '비용 제거형',
        ctr_estimate: '8~11%',
        reasoning: '"헬스장 안 가고"는 다이어트 진입장벽 제거의 핵심.',
      }),
      (d) => ({
        title: `${keyword}, 식단 강박 없이도 됩니다`,
        pattern: '심리적 부담 제거',
        ctr_estimate: '8~10.5%',
        reasoning: '식단 강박은 다이어트 실패 1위 원인. 이 부담을 제거한다는 약속이 강력.',
      }),
      (d) => ({
        title: `${keyword}, ${d.audience}의 ${d.duration} 변화`,
        pattern: '거울 + 변화',
        ctr_estimate: '8~10%',
        reasoning: `타겟 시청자(${d.audience})에게 본인 가능성 시각화.`,
      }),
      (d) => ({
        title: `${keyword} 진짜 효과 본 한 가지`,
        pattern: '단일 솔루션',
        ctr_estimate: '7.5~10%',
        reasoning: '다이어트 정보 과잉 시대. "한 가지" 단순화가 강력.',
      }),
      (d) => ({
        title: `${keyword} 실패만 5번 한 후 깨달은 것`,
        pattern: '실패 인정형',
        ctr_estimate: '8~10.5%',
        reasoning: '실패 인정은 신뢰도 +30%. 다이어트는 실패 경험자가 많아 공감 폭발.',
      }),
    ],
    selfdev: [
      (d) => ({
        title: `${d.daily}로 ${keyword} 한 ${d.duration} 기록`,
        pattern: '시간 효율 + 기록',
        ctr_estimate: '7.5~10%',
        reasoning: `"${d.daily}"는 직장인의 현실적 시간. 부담 없이 시작 가능.`,
      }),
      (d) => ({
        title: `평범한 직장인이 ${keyword} 한 방법`,
        pattern: '평범인 변신형',
        ctr_estimate: '7~9.5%',
        reasoning: '"평범한"이 자기 효능감 자극. 자기계발 시청자에게 가장 강력.',
      }),
      (d) => ({
        title: `${keyword}, ${d.duration} 후 달라진 것들`,
        pattern: '변화 약속형',
        ctr_estimate: '7.5~9.5%',
        reasoning: '"달라진 것들"은 구체적 변화 약속. 자기계발 시청자가 가장 원하는 것.',
      }),
      (d) => ({
        title: `${keyword} 시작했다가 포기하는 이유`,
        pattern: '실패 분석형',
        ctr_estimate: '8~10%',
        reasoning: '시작했지만 막힌 시청자가 가장 클릭. 자기계발 분야에서 강력.',
      }),
      (d) => ({
        title: `${keyword}, 책 100권 읽고 정리한 핵심`,
        pattern: '권위 + 압축형',
        ctr_estimate: '8~10.5%',
        reasoning: '"100권 → 핵심" 압축은 자기계발 콘텐츠의 가성비 약속.',
      }),
      (d) => ({
        title: `${keyword}, 머리가 아니라 ${d.secret}`,
        pattern: '상식 부정형',
        ctr_estimate: '7.5~10%',
        reasoning: '일반적 통념(머리)을 부정하고 새 답 제시. 호기심 폭발.',
      }),
    ],
    aitech: [
      (d) => ({
        title: `${keyword}, ${d.primaryNum}으로 끝내는 법`,
        pattern: '무료/시간 강조',
        ctr_estimate: '9~12%',
        reasoning: `"${d.primaryNum}"는 AI 도구 시청자의 가장 강력한 클릭 유발 요소.`,
      }),
      (d) => ({
        title: `${keyword}, 유료 도구 없이 됩니다`,
        pattern: '비용 부정형',
        ctr_estimate: '8.5~11%',
        reasoning: '"유료 없이"는 AI/디지털 도구 분야에서 가장 강력한 약속.',
      }),
      (d) => ({
        title: `${keyword} 진짜 사용법 (${d.duration} 정리)`,
        pattern: '진짜 사용법형',
        ctr_estimate: '7.5~10%',
        reasoning: '"진짜 사용법"은 표면적 정보 너머의 깊이 약속.',
      }),
      (d) => ({
        title: `${d.audience}도 ${keyword} 가능한 이유`,
        pattern: '진입장벽 제거',
        ctr_estimate: '7.5~10%',
        reasoning: 'AI는 어렵다는 통념 깨기. 입문자에게 강력.',
      }),
      (d) => ({
        title: `${keyword}, 이거 하나면 됩니다`,
        pattern: '단일 솔루션형',
        ctr_estimate: '8~10.5%',
        reasoning: 'AI 도구 너무 많아서 "하나로 끝" 메시지 강력.',
      }),
      (d) => ({
        title: `${keyword}, 작업 시간 ${d.daily} 컷`,
        pattern: '시간 단축형',
        ctr_estimate: '8~10%',
        reasoning: `"${d.daily}"는 AI 도구 시청자가 가장 원하는 가치.`,
      }),
    ],
    senior: [
      (d) => ({
        title: `${d.audience}가 ${keyword} 시작한 이유`,
        pattern: '시작 동기형',
        ctr_estimate: '7.5~10%',
        reasoning: '시니어 시청자는 "왜 시작했는지" 동기 스토리에 강하게 반응.',
      }),
      (d) => ({
        title: `${keyword}, 60대 시작해도 가능한가요?`,
        pattern: '연령 질문형',
        ctr_estimate: '8~10.5%',
        reasoning: '연령 질문은 시니어 시청자의 가장 큰 고민. 직접 답한다는 약속.',
      }),
      (d) => ({
        title: `은퇴 후 ${keyword}로 ${d.primaryNum}`,
        pattern: '은퇴 + 결과형',
        ctr_estimate: '8~11%',
        reasoning: `구체적 결과(${d.primaryNum}) + 은퇴 후 가능성 = 시니어 핵심 욕구.`,
      }),
      (d) => ({
        title: `${keyword}, ${d.duration} 도전기`,
        pattern: '도전 스토리형',
        ctr_estimate: '7~9%',
        reasoning: '"도전기"는 시니어가 본인 가능성을 발견하는 콘텐츠.',
      }),
      (d) => ({
        title: `${keyword} 시작이 두려우신 분들께`,
        pattern: '두려움 공감형',
        ctr_estimate: '7~9.5%',
        reasoning: '시니어의 시작 두려움을 정면 공감. 공감 = 신뢰.',
      }),
      (d) => ({
        title: `평범한 ${d.audience}${jong(d.audience, "이", "가")} ${keyword} 한 방법`,
        pattern: '평범인 거울형',
        ctr_estimate: '7.5~10%',
        reasoning: '"평범한"이 시니어 시청자에게 자기 가능성 시각화.',
      }),
    ],
    food: [
      (d) => ({
        title: `${keyword}, ${d.primaryNum} 만들 수 있는 법`,
        pattern: '쉬움 강조형',
        ctr_estimate: '7.5~10%',
        reasoning: `"${d.primaryNum}"는 요리 시청자의 진입장벽 제거.`,
      }),
      (d) => ({
        title: `${keyword}, 실패 없이 매번 성공하는 비결`,
        pattern: '안전 약속형',
        ctr_estimate: '8~10%',
        reasoning: '"실패 없이"는 요리 시청자의 가장 큰 두려움 해결.',
      }),
      (d) => ({
        title: `${keyword}, 자취생도 따라하는 방법`,
        pattern: '거울 + 쉬움',
        ctr_estimate: '7~9.5%',
        reasoning: '타겟 명시 + 쉬움 약속.',
      }),
      (d) => ({
        title: `${keyword}, 5년 차가 알려주는 진짜 팁`,
        pattern: '권위 + 진정성',
        ctr_estimate: '7.5~10%',
        reasoning: '"5년 차"는 권위, "진짜"는 깊이.',
      }),
    ],
    travel: [
      (d) => ({
        title: `${keyword}, ${d.primaryNum} 가능한 진짜 일정`,
        pattern: '가성비 + 구체',
        ctr_estimate: '7.5~10%',
        reasoning: '여행은 비용이 핵심 의사결정 요소.',
      }),
      (d) => ({
        title: `${keyword} 10년 차의 솔직 후기`,
        pattern: '경력 + 정직',
        ctr_estimate: '7~9.5%',
        reasoning: '여행 콘텐츠는 경험자의 진짜 후기를 가장 신뢰.',
      }),
      (d) => ({
        title: `현지인만 아는 ${keyword} 코스`,
        pattern: '비밀 정보형',
        ctr_estimate: '8~10.5%',
        reasoning: '"현지인만 아는"은 여행 콘텐츠의 가장 강력한 후크.',
      }),
      (d) => ({
        title: `${keyword}, 처음 가는 분들 필수 정보`,
        pattern: '입문자 타겟형',
        ctr_estimate: '7.5~9.5%',
        reasoning: '여행 첫 방문자가 가장 적극적으로 정보 검색.',
      }),
    ],
    family: [
      (d) => ({
        title: `${keyword}, ${d.duration} 참았다가 한 번에 터졌습니다`,
        pattern: '카타르시스형',
        ctr_estimate: '9~13%',
        reasoning: `"참다가 터진" 구조는 시니어 시청자의 공감 + 카타르시스를 동시에 자극. 사연 콘텐츠의 황금 패턴입니다.`,
      }),
      (d) => ({
        title: `${d.audience}이 ${keyword} 듣고 한 마디로 정리한 이야기`,
        pattern: '사이다 결말형',
        ctr_estimate: '8.5~12%',
        reasoning: `"한 마디로 정리"는 사이다 결말 약속. 시니어 시청자가 가장 좋아하는 카타르시스 트리거.`,
      }),
      (d) => ({
        title: `${keyword}, ${d.audience}의 진짜 이야기`,
        pattern: '실화 사연형',
        ctr_estimate: '8~11%',
        reasoning: `"진짜 이야기"는 사연 콘텐츠의 핵심 약속. 시니어층은 실화/각색 사연에 가장 강하게 반응.`,
      }),
      (d) => ({
        title: `명절에 ${keyword}, 결국엔 이렇게 됐습니다`,
        pattern: '명절 갈등형',
        ctr_estimate: '8.5~12%',
        reasoning: `"명절"은 가족 갈등이 가장 극대화되는 키워드. 보편 공감.`,
      }),
      (d) => ({
        title: `${keyword}, 시집간 후 처음 한 말`,
        pattern: '인내 + 폭발형',
        ctr_estimate: '8~11%',
        reasoning: `오래 참다가 한 번에 표현하는 구조. 시니어 시청자의 보편 공감.`,
      }),
      (d) => ({
        title: `${keyword}, 이게 진짜 가능한가요?`,
        pattern: '의외성 질문형',
        ctr_estimate: '7.5~10%',
        reasoning: `의외의 결말을 시사하는 질문형. 호기심 + 끝까지 보고 싶은 욕구.`,
      }),
    ],
    general: [
      (d) => ({
        title: `${keyword}, ${d.duration} 직접 해본 후기`,
        pattern: '경험담형',
        ctr_estimate: '7~9.5%',
        reasoning: '경험담은 모든 분야에서 안정적인 클릭률.',
      }),
      (d) => ({
        title: `${keyword} 시작 전 알았으면 좋았을 것들`,
        pattern: '후회/교훈형',
        ctr_estimate: '7~9%',
        reasoning: '경험자의 후회는 입문자에게 강력.',
      }),
      (d) => ({
        title: `${keyword}, 진짜 핵심만 정리`,
        pattern: '압축 정리형',
        ctr_estimate: '7~9.5%',
        reasoning: '"진짜 핵심"은 정보 과잉 시대의 가장 큰 약속.',
      }),
    ],
  };

  const pool = pools[profile.type] || pools.general;
  const selectedFns = pickN(pool, 3, rand);
  return selectedFns.map((fn) => fn(detail));
}

export function generateTitles(
  keyword: string,
  scenarioId: string,
  categoryName: string
): TitleResult[] {
  const seed = makeSeed(keyword, scenarioId + '_title');
  const rand = seededRandom(seed);
  const profile = detectDomain(keyword, categoryName);
  return generateTitlesForDomain(keyword, profile, rand);
}

// ============================================================
// 5. 영상 설명 생성 (도메인별 맞춤)
// ============================================================

export function generateDescription(
  keyword: string,
  categoryName: string,
  scenarioId: string
): string {
  const seed = makeSeed(keyword, 'desc');
  const rand = seededRandom(seed);
  const profile = detectDomain(keyword, categoryName);
  const detail = getDetails(profile, rand);

  const openers = [
    '안녕하세요. 영상 봐주셔서 감사합니다.',
    '오랜만에 영상으로 인사드려요.',
    '많은 분들이 댓글로 물어보셔서 만든 영상입니다.',
    '오늘은 진짜 진심으로 만든 영상이에요.',
  ];

  const opener = pick(openers, rand);

  return `${opener}

이번 영상에서는 ${k(keyword, 'eul')} ${detail.duration} 직접 해보면서 알게 된 것들을 정리했습니다.
${detail.primaryNum}이라는 결과까지 가는 동안 ${detail.emphasis} 깨달은 핵심 내용이에요.

📌 영상에서 다루는 내용
✅ ${keyword} 시작 전 꼭 알아야 할 것들
✅ ${detail.audience}도 따라할 수 있는 방법
✅ ${detail.secret}
✅ 시간 낭비 줄이는 효율적 접근법
✅ 실제 적용 가능한 단계별 가이드

특히 ${categoryName} 분야에 처음 발 들이시는 분들, 
또는 시작했지만 막막함을 느끼시는 분들께 도움이 될 거라 생각합니다.

💬 댓글로 본인 경험도 공유해주시면 다음 영상에 반영하겠습니다.
🔔 매주 새 영상이 올라오니 구독해주시면 좋겠습니다.

#${keyword.replace(/\s/g, '')} #${categoryName.replace(/\s/g, '')} #실전노하우

---
※ 이 영상은 개인 경험을 바탕으로 한 정보 공유 목적이며, 결과를 보장하지 않습니다.`;
}

// ============================================================
// 6. 태그 생성
// ============================================================

export function generateTags(
  keyword: string,
  categoryName: string
): { tag: string; volume: string; competition: string }[] {
  const seed = makeSeed(keyword, 'tags');
  const rand = seededRandom(seed);

  const main = [
    { tag: keyword, volume: '월 1만+', competition: '높음' },
    { tag: `${keyword} 추천`, volume: '월 5천+', competition: '중간' },
    { tag: `${keyword} 방법`, volume: '월 8천+', competition: '중간' },
    { tag: `${keyword} 입문`, volume: '월 3천+', competition: '낮음' },
  ];

  const variants = pickN([
    { tag: `${keyword} 후기`, volume: '월 4천+', competition: '낮음' },
    { tag: `${keyword} 시작`, volume: '월 6천+', competition: '중간' },
    { tag: `${keyword} 실전`, volume: '월 2천+', competition: '낮음' },
    { tag: `${keyword} 가이드`, volume: '월 3천+', competition: '낮음' },
    { tag: `${keyword} 노하우`, volume: '월 4천+', competition: '낮음' },
    { tag: `${keyword} 비결`, volume: '월 2천+', competition: '낮음' },
    { tag: `${keyword} 팁`, volume: '월 5천+', competition: '중간' },
    { tag: `${keyword} 정리`, volume: '월 3천+', competition: '낮음' },
  ], 4, rand);

  const longTail = pickN([
    { tag: `40대 ${keyword}`, volume: '월 2천+', competition: '낮음' },
    { tag: `50대 ${keyword}`, volume: '월 1천+', competition: '낮음' },
    { tag: `${keyword} 처음`, volume: '월 3천+', competition: '낮음' },
    { tag: `${keyword} 직장인`, volume: '월 2천+', competition: '낮음' },
    { tag: `2026 ${keyword}`, volume: '월 4천+', competition: '중간' },
    { tag: `${keyword} 무료`, volume: '월 5천+', competition: '중간' },
    { tag: `${keyword} 초보`, volume: '월 3천+', competition: '낮음' },
  ], 3, rand);

  const cat = [
    { tag: categoryName, volume: '월 5만+', competition: '높음' },
    { tag: `${categoryName} 입문`, volume: '월 1만+', competition: '중간' },
  ];

  return [...main, ...variants, ...longTail, ...cat].slice(0, 13);
}

// ============================================================
// 7. 떡상 시퀀스 빌더 - 핵심 (NotebookLM 영상 톤 반영)
// ============================================================

export interface VideoSequence {
  number: number;
  duration: string;
  title: string;
  purpose: string;
  script: string;
  imagePromptKr: string;
  imagePromptEn: string;
  videoPromptKr: string;
  videoPromptEn: string;
  tip: string;
}

/**
 * 1단계 - 강력한 후크 (0:00 ~ 0:15)
 * 박 대표님 영상 톤: "지금 보신 이 영상 빵원으로 만든 겁니다"
 */
function buildHook(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  // 도메인별 후크 패턴 (RESULT-FIRST 트리거)
  const hookByDomain: Record<DomainType, string[]> = {
    realestate: [
      `지금 보여드릴 ${keyword} 매물 하나로 ${detail.duration} ${detail.primaryNum} 만들었습니다. ${detail.audience}이었어요. 학력도 자본도 평범했습니다. 오늘 그 과정 다 풀어드릴게요. 끝까지만 봐주세요.`,
      `${keyword}, ${detail.duration} 만에 ${detail.primaryNum} 났습니다. 운이 좋았던 게 아니에요. ${detail.emphasis} 이 영상에서 알려드리는 한 가지 원칙 때문이었습니다.`,
      `${detail.audience}${jong(detail.audience, "이", "가")} ${keyword}${jong(keyword, "으로", "로")} ${detail.primaryNum} 만든 진짜 이야기입니다. 누구나 따라할 수 있는 방법이에요. ${detail.duration} 시간만 내주시면 됩니다.`,
    ],
    language: [
      `지금 들으시는 이 ${keyword}, 학원 한 번 안 가고 ${detail.duration} 만에 만든 거예요. ${detail.daily}만 투자한 거 전부예요. ${detail.emphasis} 이 방법 하나면 됩니다.`,
      `${keyword}, ${detail.audience}${jong(detail.audience, "이었는데", "였는데")} ${detail.duration} 만에 ${detail.primaryNum} 됐습니다. 비결은 의외로 간단해요. 오늘 다 풀어드립니다.`,
      `${keyword} 시작하셨다가 포기하신 분들 많으시잖아요. 저도 그랬습니다. 그런데 ${detail.daily}만 바꿨더니 ${detail.duration} 만에 달라졌어요.`,
    ],
    fitness: [
      `${detail.duration} ${detail.primaryNum}, ${keyword} 직접 해본 결과입니다. 헬스장 한 번 안 갔어요. 식단 강박도 없었습니다. 오늘 그 방법 다 알려드립니다.`,
      `${keyword}, ${detail.primaryNum} 진짜로 가능합니다. ${detail.audience}${jong(detail.audience, "이", "가")} ${detail.duration} 만에 직접 한 거예요. 비결은 운동량이 아니에요.`,
      `${keyword} 실패만 5번 한 후에 깨달은 게 있어요. ${detail.primaryNum} 빼는 데 ${detail.duration}이면 충분합니다. 오늘 그 한 가지를 풀어드릴게요.`,
    ],
    selfdev: [
      `${detail.daily}로 ${keyword} 한 ${detail.duration} 후의 변화입니다. 평범한 직장인이었어요. ${detail.emphasis} 한 가지를 바꿨더니 결과가 완전히 달라졌습니다.`,
      `${keyword}, 바쁘신 분들도 가능합니다. ${detail.daily}만 투자해서 ${detail.duration} 만에 변화를 느낄 수 있어요. 오늘 그 방법 정리해드릴게요.`,
      `${keyword} 시작했다가 포기하신 분들 많으시죠. 저도 그랬습니다. 그러다가 ${detail.emphasis} 한 가지를 깨달았어요. 오늘 그걸 풀어드립니다.`,
    ],
    aitech: [
      `지금 보신 이 영상, ${detail.primaryNum} 만들었습니다. AI가 다 했어요. 작업 시간 ${detail.daily}이면 끝입니다. 유료 도구 필요 없어요. 오늘 그 방법 다 풀어드릴게요.`,
      `${keyword}, 진짜 ${detail.primaryNum}으로 됩니다. 그것도 무제한이에요. ${detail.audience}${jong(detail.audience, "도", "도")} ${detail.daily}이면 마스터 가능합니다. 끝까지만 봐주세요.`,
      `${keyword} 시작하시려는 분들, 잠깐만요. 유료 도구부터 결제하지 마세요. ${detail.primaryNum}으로 충분히 가능합니다. 제가 ${detail.duration} 직접 써본 결과예요.`,
      // 콘텐츠 가치 만들기 패턴
      `${keyword}, 거창하게 시작하지 마세요. ${detail.audience}${jong(detail.audience, "이라면", "라면")} 누구나 가진 작은 경험들이 진짜 콘텐츠가 됩니다. 오늘 그 시작 방법 풀어드릴게요.`,
      `${keyword}, 같은 키워드라도 100명이 풀어내면 100가지 다른 이야기가 나옵니다. 본인만의 색깔이 곧 차별화예요. ${detail.emphasis} 깨달은 점 정리해드릴게요.`,
      `${keyword}, 한 분야를 꾸준히 다루다 보면 신뢰가 쌓입니다. 화려하지 않아도 좋아요. ${detail.duration} 꾸준함이 곧 전문성입니다.`,
      // AI 도구 활용
      `${keyword}, AI 도구를 활용하면 영상 만드는 시간이 크게 줄어듭니다. 키워드 → 대본 → 이미지 → 영상까지. ${detail.audience}${jong(detail.audience, "도", "도")} 충분히 따라할 수 있어요.`,
      `${keyword}, AI 영상 만들 때 캐릭터가 자꾸 바뀌시죠? 비결은 한 장이 아니라 여러 장을 학습시키는 거예요. 일관성이 영상의 완성도를 결정합니다.`,
      // 팬덤 요소
      `${keyword} 영상이 시청자에게 닿는 진짜 이유, 공감 요소예요. 보편적인 감정과 경험이 시청자 참여를 만듭니다. ${detail.emphasis} 알게 된 핵심 정리해드릴게요.`,
    ],
    senior: [
      `${detail.audience}${jong(detail.audience, "이", "가")} ${keyword} 시작한 후 ${detail.duration}의 이야기입니다. ${detail.primaryNum}까지 나왔어요. 디지털 잘 몰라도 가능합니다. 오늘 그 과정 다 풀어드릴게요.`,
      `${keyword}, 늦지 않았습니다. ${detail.audience}도 ${detail.duration} 만에 충분히 가능해요. 제가 직접 해본 결과를 솔직하게 말씀드릴게요.`,
      `${keyword} 시작이 두려우신 분들께 드리는 영상입니다. ${detail.audience}이었던 제가 직접 ${detail.duration} 해본 진짜 이야기예요.`,
    ],
    food: [
      `${keyword}, ${detail.primaryNum} 진짜로 가능합니다. 요리 못하시는 분들도 따라할 수 있어요. 오늘 그 비결 정리해드립니다.`,
      `${keyword} 매번 실패하셨던 분들, 잠깐만요. 비결은 의외로 간단합니다. ${detail.emphasis} 깨달은 한 가지예요.`,
    ],
    travel: [
      `${keyword}, ${detail.primaryNum} 진짜로 됩니다. 패키지 안 잡고 ${detail.duration} 다녀온 결과예요. 오늘 그 일정 다 풀어드립니다.`,
      `${keyword} 처음 가시는 분들께 드리는 영상입니다. ${detail.emphasis} 정리한 진짜 정보예요.`,
    ],
    family: [
      // ① 사이다형 (참다가 폭발 - 카타르시스)
      `오랫동안 묻어둔 ${keyword} 이야기, ${detail.emphasis} 한 번에 풀어놓겠습니다. ${detail.audience}${jong(detail.audience, "이라면", "라면")} 한 번쯤 겪어보셨을 거예요.`,
      `${keyword}, 결혼하고 한참 만에 처음 입을 떼었습니다. ${detail.audience}${jong(detail.audience, "으로", "로")} 살면서 가장 힘들었던 순간이었어요. 끝까지 들어주세요.`,
      `${keyword}, ${detail.audience}의 진짜 사연입니다. ${detail.duration} 참다가 결국 한 마디 했어요. 그날 이후로 모든 게 달라졌습니다.`,
      // ② 친구 톤형 (친근한 대화 - 공감/위로)
      `있잖아요, ${keyword} 이야기 한번 풀어볼까 해요. 친구한테도 못 한 이야기인데, 오늘은 솔직하게 다 말씀드릴게요.`,
      `${keyword}, 우리끼리만 아는 이야기로 시작해볼게요. ${detail.audience}${jong(detail.audience, "이라면", "라면")} 분명 고개 끄덕이실 거예요.`,
      // ③ 카페톡 형식 (1:1 대화 - 편안한 톤)
      `오늘 커피 한 잔 하시면서 들어보세요. ${keyword} 이야기인데, ${detail.audience}${jong(detail.audience, "이라면", "라면")} 가슴 한쪽이 뜨거워질 거예요.`,
      // ④ 수면 라디오형 (잠자기 전 - 차분/잔잔)
      `오늘 밤 편히 잠드시기 전에 한 가지 이야기 들려드릴게요. ${keyword}에 관한 진짜 사연입니다. 마음이 따뜻해질 거예요.`,
      `잠들기 전에 들으시면 좋을 이야기예요. ${keyword}, ${detail.audience}의 진심이 담긴 사연입니다.`,
      // ⑤ 인생 반전형 (노후/황혼 - 따뜻한 반전)
      `${keyword} 듣고 그날 밤 잠을 못 잤습니다. ${detail.audience}${jong(detail.audience, "이라면", "라면")} 분명 공감하실 거예요. 오늘은 ${detail.emphasis} 그 이야기를 풀어볼게요.`,
      `${keyword}, 60대에 만난 인생 2막의 시작이었어요. 누구도 예상 못 한 반전, 끝까지 들어주세요.`,
      `절대 모르셨을 거예요. ${keyword} 그 사람이, 결국에는 어떻게 됐는지. 끝까지 보시면 진짜 놀라실 겁니다.`,
    ],
    general: [
      `${keyword} 직접 ${detail.duration} 해본 결과를 솔직하게 정리했습니다. 끝까지만 봐주시면 도움 되실 거예요.`,
      `${keyword} 시작하시려는 분들께 진심으로 드리는 영상입니다. ${detail.emphasis} 알게 된 핵심만 풀어드릴게요.`,
    ],
  };

  const pool = hookByDomain[profile.type] || hookByDomain.general;
  const script = pick(pool, rand);

  return {
    number: 1,
    duration: '0:00 ~ 0:15',
    title: '강력한 후크 (Hook)',
    purpose: '첫 15초가 영상의 운명 결정 - 결과 먼저 보여주기',
    script,
    imagePromptKr: `진지한 표정의 한국 중년 남성, 카페 같은 차분한 공간, 자연광, 클로즈업, 따뜻한 색감, 영화같은 색보정, 16:9 비율, 신뢰감 있는 분위기`,
    imagePromptEn: `Korean middle-aged man with serious expression, calm cafe-like space, natural lighting, close-up, warm tones, cinematic color grading, 16:9, trustworthy atmosphere`,
    videoPromptKr: `정면 응시하는 인물, 약한 줌인, 진심 어린 표정, 5초, 16:9, 후크 영상용`,
    videoPromptEn: `Person looking forward, subtle zoom-in, sincere expression, 5 seconds, 16:9, hook style`,
    tip: '⚡ 첫 3초가 결정. 결과/숫자를 먼저 보여주면 이탈률 50% → 15%로 떨어집니다.',
  };
}

/**
 * 2단계 - 추가 혜택 (0:15 ~ 0:35)
 * "그것도 횟수 제한 없이 무제한으로요" 스타일
 */
function buildBonus(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  const bonusByDomain: Record<DomainType, string[]> = {
    realestate: [
      `그것도 ${detail.audience}${jong(detail.audience, "이", "가")} 한 거예요. 자본금 많이 필요한 거 아닙니다. 부자들만 하는 게 아니라는 거죠. 사실 핵심은 종잣돈이 아니라 정보예요. 이 영상 보고 나면 그 차이를 아실 거예요.`,
      `이게 끝이 아닙니다. ${detail.subNum} 같은 수익률은 운이 아니에요. 시스템이에요. 누구나 따라할 수 있습니다. 오늘 그 시스템을 단계별로 풀어드릴게요.`,
    ],
    language: [
      `${detail.daily}만 했어요. 출퇴근 시간이나 점심시간이면 충분합니다. 학원비도 안 들었어요. 그것도 단어장 들고 외우는 그런 방식 아닙니다. 완전히 다른 방법이에요.`,
      `토익 점수 같은 거 의미 없어요. 외국인 앞에서 말이 나와야죠. 그게 진짜잖아요. 오늘은 그 부분에 집중해서 알려드릴게요. ${detail.daily}만 투자하시면 됩니다.`,
    ],
    fitness: [
      `식단 강박 없었습니다. 회식도 갔어요. 야식도 가끔 먹었어요. 다이어트 책 100권 사서 본 결과 진짜 효과 본 건 한 가지뿐이었어요. 그게 오늘 영상의 핵심입니다.`,
      `헬스장 안 가도 됩니다. 비싼 PT도 필요 없어요. 그것도 ${detail.audience}${jong(detail.audience, "이", "가")} 한 거예요. 진짜 중요한 건 운동량이 아니라 ${detail.secret.replace('비결은 ', '').replace('이에요', '')}예요.`,
    ],
    selfdev: [
      `책 100권 사서 본 게 아니에요. 비싼 강의 결제도 안 했어요. ${detail.daily}만 투자한 거 전부예요. 진짜 변화는 의외의 곳에서 왔습니다. 오늘 그 부분 자세히 풀어드릴게요.`,
      `의지가 강해서 한 거 아닙니다. ${detail.audience}이었어요. 핵심은 의지가 아니라 ${detail.secret.replace('비결은 ', '').replace('이에요', '')}이었어요.`,
    ],
    aitech: [
      `그것도 횟수 제한 없이 무제한으로요. ChatGPT, 미드저니 같은 유료 도구 필요 없습니다. 무료 도구 하나면 다 됩니다. 작업 시간도 ${detail.daily} 안 걸려요. 진짜로 가능합니다.`,
      `편집 0, 촬영 0, 대본도 AI가 썼어요. 그런데 결과는 보세요. 댓글도 다 진짜 시청자예요. ${detail.audience}${jong(detail.audience, "도", "도")} ${detail.daily}이면 마스터합니다.`,
    ],
    senior: [
      `${detail.audience}${jong(detail.audience, "이", "가")} 했어요. 디지털 잘 몰라도 가능합니다. 컴퓨터 능숙하지 않아도 돼요. 핵심은 기술이 아니라 꾸준함입니다. ${detail.duration}이면 충분해요.`,
      `늦었다고 생각하셨다면, 절대 늦지 않았습니다. 오히려 인생 경험이 자산이에요. 그게 어떻게 강점이 되는지 오늘 풀어드릴게요.`,
    ],
    food: [
      `재료도 비싼 거 아닙니다. 마트에서 다 살 수 있어요. 시간도 ${detail.daily}이면 됩니다. 실패할 일도 거의 없어요. 비결은 양념이 아니라 순서거든요.`,
    ],
    travel: [
      `${detail.primaryNum} 진짜예요. 패키지보다 자유롭고 비용도 적게 들어요. 핵심은 일정이 아니라 동선이에요. 오늘 그 노하우 풀어드릴게요.`,
    ],
    family: [
      `${detail.audience}${jong(detail.audience, "이라면", "라면")} 다 겪는 일이에요. 저만 그런 줄 알았는데 알고 보니 모두 비슷하더라고요. ${detail.emphasis} 이야기 풀어드릴게요.`,
      `이게 ${detail.audience}만의 문제가 아니에요. 누구나 한 번쯤은 겪는 갈등입니다. 다행히 ${detail.duration} 만에 답을 찾았어요.`,
      `참기만 하는 게 답이 아니더라고요. ${detail.emphasis} 한 번 솔직하게 말한 후로 관계가 오히려 좋아졌습니다. 그 비결 공유해드릴게요.`,
    ],
    general: [
      `누구나 가능한 방법입니다. 특별한 재능이 필요한 게 아니에요. ${detail.daily}만 꾸준히 투자하시면 ${detail.duration} 안에 변화를 느끼실 거예요.`,
    ],
  };

  const pool = bonusByDomain[profile.type] || bonusByDomain.general;
  const script = pick(pool, rand);

  return {
    number: 2,
    duration: '0:15 ~ 0:35',
    title: '추가 혜택 / 진입장벽 제거',
    purpose: '"이건 나도 가능하겠다"는 확신 만들기',
    script,
    imagePromptKr: `따뜻한 분위기의 한국 남성, 손동작 있음, 자연광 실내, 미디엄 샷, 신뢰감 있는 표정, 16:9`,
    imagePromptEn: `Warm Korean man with hand gestures, indoor with natural lighting, medium shot, trustworthy expression, 16:9`,
    videoPromptKr: `손짓하며 설명하는 인물, 자연스러운 움직임, 8초, 16:9`,
    videoPromptEn: `Person explaining with hand gestures, natural movement, 8 seconds, 16:9`,
    tip: '💡 시청자가 "나도 가능하다"는 확신을 가지면 시청 유지율 +20% 상승.',
  };
}

/**
 * 3단계 - 시청자 거울 (0:35 ~ 0:55)
 * "보통 AI로 하면 얼굴 변해서 포기하시잖아요"
 */
function buildMirror(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  const script = `${detail.mirror} 저도 그랬어요. ${k(keyword, 'eul')} 처음 시작할 때 막막하고, 어디서부터 손대야 할지 모르겠고. ${detail.emphasis} 깨달은 게 있어요. 사실 다들 같은 지점에서 막힙니다. 그게 자연스러운 거예요. 핵심은 그 다음이에요.`;

  return {
    number: 3,
    duration: '0:35 ~ 0:55',
    title: '시청자 거울 / 공감',
    purpose: '시청자가 "내 얘기네"라고 강하게 공감',
    script,
    imagePromptKr: `친근한 표정의 한국 남성, 시청자와 대화하는 듯한 자세, 자연광, 미디엄 클로즈업, 16:9`,
    imagePromptEn: `Friendly Korean man, conversational pose with viewer, natural lighting, medium close-up, 16:9`,
    videoPromptKr: `고개 끄덕이며 공감하는 인물, 자연스러운 표정, 6초, 16:9`,
    videoPromptEn: `Person nodding with empathy, natural expression, 6 seconds, 16:9`,
    tip: '🪞 시청자의 머릿속 고민을 그대로 말로 표현하면 신뢰도 폭발.',
  };
}

/**
 * 4단계 - 핵심 비밀 공개 (0:55 ~ 3:00)
 * "비결은 입지가 아니라 타이밍이에요"
 */
function buildSecret(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  const script = `자, 본격적으로 들어갈게요. ${detail.secret} 의외죠? 저도 처음엔 안 믿었어요. 그런데 ${detail.duration} 직접 해보니까 알겠더라고요. ${k(keyword, 'eul')} 잘하는 분들의 공통점이 바로 이거예요. ${detail.emphasis} 이 한 가지를 깨닫고 나서 모든 게 달라졌습니다. 지금부터 그 디테일을 하나씩 풀어드릴게요.`;

  return {
    number: 4,
    duration: '0:55 ~ 3:00',
    title: '핵심 비밀 공개',
    purpose: '시청자에게 "이게 진짜다"라는 통찰 전달',
    script,
    imagePromptKr: `진지하게 설명하는 한국 남성, 손가락으로 강조, 자연광, 미디엄 샷, 16:9`,
    imagePromptEn: `Korean man explaining seriously, finger emphasizing point, natural lighting, medium shot, 16:9`,
    videoPromptKr: `손가락으로 강조하며 설명, 표정 변화, 10초, 16:9`,
    videoPromptEn: `Person explaining with finger emphasis, expression changes, 10 seconds, 16:9`,
    tip: '🔑 일반적 통념을 부정하고 의외의 답 제시 = 호기심 폭발 + 끝까지 봄.',
  };
}

/**
 * 5단계 - 실전 단계 (3:00 ~ 6:00)
 */
function buildPractice(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  const script = `이론은 됐고, 실제로 어떻게 하느냐가 중요하잖아요. 제가 ${detail.duration} 직접 해본 결과 정리한 5단계입니다.

첫째, 작게 시작하세요. ${detail.daily}이면 충분합니다. 욕심내면 무조건 실패해요.
둘째, ${detail.audience}${jong(detail.audience, "이", "가")} 따라할 수 있는 가장 쉬운 방법부터 시작합니다.
셋째, 일주일 단위로 점검하세요. 한 달 계획은 깨지기 쉽습니다.
넷째, 결과를 기록하세요. 안 보이면 동기가 사라집니다.
다섯째, 1개월마다 ${detail.secret.replace('비결은 ', '').replace('이에요', '')} 점검하세요.

이 5단계가 ${detail.duration} 후 ${detail.primaryNum} 만든 진짜 방법입니다.`;

  return {
    number: 5,
    duration: '3:00 ~ 6:00',
    title: '실전 5단계 / 따라하기',
    purpose: '시청자가 바로 행동할 수 있는 구체 가이드',
    script,
    imagePromptKr: `책상 위 노트와 펜, 단계별 메모, 자연광, 위에서 내려다보는 각도, 따뜻한 색감, 16:9`,
    imagePromptEn: `Notebook and pen on desk, step-by-step notes, natural lighting, top-down angle, warm tones, 16:9`,
    videoPromptKr: `손이 노트에 단계 적는 모습, 자연스러운 움직임, 12초, 16:9`,
    videoPromptEn: `Hand writing steps in notebook, natural movement, 12 seconds, 16:9`,
    tip: '✅ 종이에 받아 적을 정도로 명확한 단계 = 시청 완료율 +30%.',
  };
}

/**
 * 6단계 - 권위 + 통찰 (6:00 ~ 8:00)
 */
function buildAuthority(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  const script = `여기까지 봐주신 분들께 진짜 중요한 말씀 드릴게요. ${k(keyword, 'eul')} ${detail.duration} 직접 해보고 ${detail.primaryNum}까지 가본 사람으로서 자신 있게 말씀드립니다. 빨리 가려고 하지 마세요. 천천히 가는 게 가장 빠른 길이에요. 처음엔 저도 안 믿었어요. 근데 진짜였습니다. ${detail.emphasis} 이게 핵심이에요.`;

  return {
    number: 6,
    duration: '6:00 ~ 8:00',
    title: '권위 + 결정적 통찰',
    purpose: '시청자 가슴에 남는 한 마디',
    script,
    imagePromptKr: `진심 어린 표정의 한국 남성, 따뜻한 자연광, 클로즈업, 깊은 감정의 눈빛, 16:9, 영화적 색감`,
    imagePromptEn: `Korean man with sincere expression, warm natural lighting, close-up, deep emotional eyes, 16:9, cinematic`,
    videoPromptKr: `차분한 인물, 천천히 눈 깜빡임, 부드러운 표정 변화, 8초, 16:9`,
    videoPromptEn: `Calm person, slow blinking, soft expression changes, 8 seconds, 16:9`,
    tip: '💎 영상의 가장 깊은 메시지를 이 단계에 배치. 시청자가 기억하는 한 문장이 됩니다.',
  };
}

/**
 * 7단계 - 마무리 + CTA (8:00 ~ 10:00)
 */
function buildCTA(
  keyword: string,
  profile: DomainProfile,
  detail: ReturnType<typeof getDetails>,
  rand: () => number
): VideoSequence {
  const script = `오늘 ${k(keyword, 'eul')} 핵심만 정리해드렸는데요. 도움이 되셨다면 좋아요 한 번만 부탁드립니다. 그게 저한테 큰 힘이 됩니다. 댓글로 본인의 ${keyword} 시작 이야기 들려주세요. 한 분 한 분 다 읽어볼게요. 다음 영상에서는 ${k(keyword, 'eun')} 다음 단계, ${detail.secret.replace('비결은 ', '').replace('이에요', '')}에 대해 자세히 다뤄드릴 예정입니다. 구독 + 알림 설정 해두시면 알려드릴게요. 그럼 다음 영상에서 만나요.`;

  return {
    number: 7,
    duration: '8:00 ~ 10:00',
    title: '마무리 / 행동 유도',
    purpose: '구독·좋아요·댓글 자연스럽게 유도',
    script,
    imagePromptKr: `따뜻한 미소의 한국 남성, 손 흔드는 마무리 인사, 자연광, 친근한 분위기, 16:9`,
    imagePromptEn: `Korean man with warm smile, waving farewell, natural lighting, friendly atmosphere, 16:9`,
    videoPromptKr: `미소 지으며 손 흔드는 인물, 부드러운 마무리, 6초, 16:9`,
    videoPromptEn: `Person waving with smile, soft farewell, 6 seconds, 16:9`,
    tip: '🤝 진심 + 다음 영상 예고 = 구독률 + 재방문 모두 상승.',
  };
}

/**
 * 메인 함수: 7단계 떡상 시퀀스
 * 박 대표님 핵심 비전: 키워드별 다른 트리거 매칭
 */
export function generateVideoSequences(
  keyword: string,
  scenarioId: string
): VideoSequence[] {
  const seed = makeSeed(keyword, scenarioId + '_seq');
  const rand = seededRandom(seed);
  const profile = detectDomain(keyword);
  const detail = getDetails(profile, rand);

  return [
    buildHook(keyword, profile, detail, rand),
    buildBonus(keyword, profile, detail, rand),
    buildMirror(keyword, profile, detail, rand),
    buildSecret(keyword, profile, detail, rand),
    buildPractice(keyword, profile, detail, rand),
    buildAuthority(keyword, profile, detail, rand),
    buildCTA(keyword, profile, detail, rand),
  ];
}

// ============================================================
// 8. 썸네일 콘셉트 (도메인별 최적화)
// ============================================================

export interface ThumbnailConcept {
  type: string;
  background: string;
  mainText: string;
  subText: string;
  expression: string;
  colors: string;
  ctr_estimate: string;
  imagePromptKr: string;
  imagePromptEn: string;
}

export function generateThumbnailConcepts(
  keyword: string,
  categoryName: string
): ThumbnailConcept[] {
  const seed = makeSeed(keyword, 'thumb');
  const rand = seededRandom(seed);
  const profile = detectDomain(keyword, categoryName);
  const detail = getDetails(profile, rand);

  // 도메인별 썸네일 패턴
  const all: ThumbnailConcept[] = [
    {
      type: '결과 강조형 (CTR 최강)',
      background: `${detail.primaryNum} 같은 큰 결과 수치를 시각화한 임팩트 배경`,
      mainText: `"${detail.primaryNum}" - 빨강/골드 큰 글씨`,
      subText: `"${keyword} ${detail.duration}" - 흰색 강조`,
      expression: '확신에 찬 미소 또는 약간 놀란 표정',
      colors: '딥 블루 + 골드 (프리미엄 신뢰)',
      ctr_estimate: 'CTR 예상 8~11%',
      imagePromptKr: `한국 중년 남성, 확신에 찬 표정, 딥 블루 배경에 골드 텍스트 "${detail.primaryNum}" 강조, 신뢰감 있는 분위기, 클로즈업, 16:9 썸네일, 고채도, 클릭률 높은 YouTube 스타일`,
      imagePromptEn: `Korean middle-aged man, confident expression, deep blue background with gold text "${detail.primaryNum}" emphasized, trustworthy atmosphere, close-up, 16:9 thumbnail, high saturation, high CTR style`,
    },
    {
      type: '비포애프터형',
      background: '좌(시작 전 모습) vs 우(결과 후 모습) 분할',
      mainText: `"${keyword} ${detail.duration}"`,
      subText: 'BEFORE / AFTER 라벨 + 화살표',
      expression: '두 가지 표정 (왼쪽 고민, 오른쪽 자신감)',
      colors: '회색(왼) vs 골드(오른) 대비',
      ctr_estimate: 'CTR 예상 7.5~10%',
      imagePromptKr: `좌우 분할, 왼쪽은 한국 남성 어두운 환경에서 고민, 오른쪽은 같은 사람 밝은 환경에서 자신감 미소, BEFORE/AFTER 큰 텍스트, 회색-골드 대비, 16:9 썸네일`,
      imagePromptEn: `Split screen, left side Korean man worried in dark environment, right side same person confidently smiling in bright environment, large BEFORE/AFTER text, gray-gold contrast, 16:9 thumbnail`,
    },
    {
      type: '진심형 (신뢰)',
      background: '따뜻한 자연광이 들어오는 차분한 실내',
      mainText: `"${keyword} 진짜 후기"`,
      subText: `"${detail.duration} 직접 해본"`,
      expression: '진심 어린 표정, 부드러운 미소',
      colors: '베이지 + 따뜻한 갈색',
      ctr_estimate: 'CTR 예상 6.5~9%',
      imagePromptKr: `한국 중년 남성, 진심 어린 표정, 따뜻한 자연광 차분한 실내, 부드러운 미소, "진짜 후기" 큰 한글 텍스트 공간, 베이지-갈색 톤, 16:9 썸네일`,
      imagePromptEn: `Korean middle-aged man, sincere expression, calm indoor with warm natural lighting, soft smile, space for large Korean text "Real Review", beige-brown tones, 16:9 thumbnail`,
    },
    {
      type: '거울형 (공감)',
      background: '시청자 일상이 연상되는 자연스러운 배경',
      mainText: `"${detail.audience}${jong(detail.audience, "이", "가")} ${keyword}"`,
      subText: `"진짜 가능?"`,
      expression: '의문이 살짝 있는 친근한 표정',
      colors: '깔끔한 흰색 + 강조 색상',
      ctr_estimate: 'CTR 예상 7~9.5%',
      imagePromptKr: `한국 중년 남성, 친근한 표정에 약간의 의문, 흰색 배경, "진짜 가능?" 한글 텍스트 공간, 깔끔한 디자인, 16:9 썸네일`,
      imagePromptEn: `Korean middle-aged man, friendly expression with slight curiosity, white background, space for Korean text "Really Possible?", clean design, 16:9 thumbnail`,
    },
    {
      type: '숫자 강조형 (랭킹/스텝)',
      background: '깔끔한 그라데이션 + 큰 숫자',
      mainText: `"${keyword} 5단계"`,
      subText: `"${detail.duration} 후 변화"`,
      expression: '의미심장한 표정',
      colors: '딥 블루 + 골드',
      ctr_estimate: 'CTR 예상 7~9%',
      imagePromptKr: `숫자 5가 크게 강조된 디자인, 한국 중년 남성 의미심장한 표정, 딥블루-골드 색상, 프리미엄 분위기, 16:9 썸네일`,
      imagePromptEn: `Design with prominently emphasized number 5, Korean middle-aged man with meaningful expression, deep blue-gold colors, premium atmosphere, 16:9 thumbnail`,
    },
  ];

  return pickN(all, 3, rand);
}

// ============================================================
// 9. 1분 쇼츠 모드 (PDF 신규 반영) - 썰 채널 스타일
// ============================================================

export interface ShortsScript {
  hook: string;        // 0~3초
  body: string;        // 3~40초
  twist: string;       // 40~50초 (반전)
  cta: string;         // 50~60초
  fullScript: string;  // 전체 합본
  totalDuration: string;
}

/**
 * 1분 쇼츠 대본 생성 (박 대표님 신규 비전)
 * 구조: HOOK(3초) → BODY(35초) → TWIST(10초) → CTA(10초)
 */
export function generateShortsScript(
  keyword: string,
  scenarioId: string
): ShortsScript {
  const seed = makeSeed(keyword, scenarioId + '_shorts');
  const rand = seededRandom(seed);
  const profile = detectDomain(keyword);
  const detail = getDetails(profile, rand);

  // 도메인별 1분 쇼츠 후크
  const hookPool: Record<DomainType, string[]> = {
    realestate: [
      `${detail.duration} 만에 ${detail.primaryNum} 만든 ${keyword} 방법, 1분 안에 알려드릴게요.`,
      `${keyword}으로 ${detail.primaryNum}, ${detail.audience}${jong(detail.audience, "이", "가")} 한 거예요.`,
    ],
    language: [
      `학원 안 가고 ${keyword} ${detail.duration} 만에 한 방법, 60초 압축본입니다.`,
      `${keyword}, ${detail.daily}만 했는데 ${detail.primaryNum} 됐어요.`,
    ],
    fitness: [
      `${detail.duration} ${detail.primaryNum} 빼는 ${keyword} 비결 1분 정리.`,
      `헬스장 안 가고 ${keyword} 한 진짜 방법, 60초 안에.`,
    ],
    selfdev: [
      `${detail.daily}로 ${keyword} 한 ${detail.duration} 변화, 1분에 정리.`,
      `평범한 직장인이 ${keyword} 한 방법 60초 압축.`,
    ],
    aitech: [
      `${keyword} ${detail.primaryNum}으로 끝내는 법, 1분 정리.`,
      `유료 도구 없이 ${keyword} 하는 진짜 방법.`,
    ],
    senior: [
      `${detail.audience}${jong(detail.audience, "이", "가")} ${keyword} 시작한 ${detail.duration} 후 이야기.`,
      `${keyword}, 60대 시작해도 가능한가? 1분에 답해드림.`,
    ],
    food: [
      `${keyword} 실패 없이 만드는 진짜 방법, 60초 안에.`,
      `재료 3개로 ${keyword} 만드는 비결.`,
    ],
    travel: [
      `${keyword} ${detail.primaryNum}으로 가는 진짜 일정 1분 정리.`,
      `현지인만 아는 ${keyword} 코스, 60초 압축.`,
    ],
    family: [
      // ① 사이다형 (1분 임팩트)
      `${detail.duration} 참았던 ${keyword} 이야기, 한 번에 풀었습니다.`,
      `${keyword}, ${detail.audience}의 진짜 사연 1분 압축본.`,
      `명절에 ${keyword}, 그날 그 한 마디로 다 끝났어요.`,
      // ② 1분 썰형 (60초 임팩트)
      `오늘의 썰, ${keyword}. 60초 안에 다 풀어드립니다.`,
      `${keyword} 썰, 끝까지 들으면 소름 돋습니다.`,
      // ③ 친구톤
      `${keyword}, 친구한테도 못 한 이야기. 1분만 들어보세요.`,
      // ④ 수면형
      `오늘 밤 ${keyword} 이야기. 잠들기 전 1분.`,
      // ⑤ 인생 반전
      `${keyword}, 60대에 찾아온 인생 2막. 1분 압축본.`,
    ],
    general: [
      `${keyword} ${detail.duration} 직접 해본 결과, 1분에 정리.`,
    ],
  };

  const hook = pick(hookPool[profile.type] || hookPool.general, rand);

  // 본문 (35초)
  const body = `${detail.mirror} 저도 그랬어요. 그런데 ${detail.emphasis} 한 가지를 알게 됐어요. ${detail.secret} 이 한 가지만 바꿨더니 ${detail.duration} 만에 ${detail.primaryNum} 됐습니다. 핵심은 ${k(keyword, 'eul')} 어떻게 시작하느냐예요.`;

  // 반전 (10초)
  const twistPool = [
    `사실 더 중요한 건 따로 있어요. 다음 편에서 풀어드립니다.`,
    `이게 끝이 아니에요. 진짜 비밀은 다음 편에 있습니다.`,
    `여기까지가 1단계예요. 2단계가 진짜 핵심이에요.`,
  ];
  const twist = pick(twistPool, rand);

  // CTA (10초)
  const cta = `구독 + 알림 설정 부탁드려요. 다음 편에서 만나요.`;

  const fullScript = `[0:00 ~ 0:03] 후크
${hook}

[0:03 ~ 0:40] 본문
${body}

[0:40 ~ 0:50] 반전
${twist}

[0:50 ~ 1:00] 마무리 / CTA
${cta}`;

  return {
    hook,
    body,
    twist,
    cta,
    fullScript,
    totalDuration: '약 60초 (1분 쇼츠)',
  };
}

// ============================================================
// 10. 카테고리별 YouTube 분류
// ============================================================

export function getYouTubeCategory(categoryId: string): string {
  const mapping: Record<string, string> = {
    economy: '뉴스/정치 또는 교육',
    realestate: '뉴스/정치 또는 교육',
    jobs: '교육 또는 인물/블로그',
    senior: '인물/블로그 또는 라이프스타일',
    health: '건강 또는 교육',
    travel: '여행/이벤트',
    food: '노하우/스타일',
    tech: '과학/기술',
    education: '교육',
    review: '노하우/스타일 또는 인물/블로그',
    social: '뉴스/정치',
    hobby: '인물/블로그 또는 엔터테인먼트',
  };
  return mapping[categoryId] || '교육';
}

// ============================================================
// 11. 떡상 영상 사례 데이터베이스 (Phase 1 - 박 대표님 비전)
// ============================================================
//
// 박 대표님 원칙:
// - 채널명/사람이름 X (일반화된 패턴만)
// - 자극적 수익 표현 X
// - "왜 떡상했는가"의 패턴 분석 중심
//

export interface ViralCase {
  pattern: string;           // 패턴 이름 (예: "비포애프터형")
  videoLength: string;        // 영상 길이 (예: "1분 30초")
  hook: string;               // 핵심 후크 (첫 3초)
  why: string;                // 떡상 이유 (패턴 분석)
  example: string;            // 예시 키워드 (사용자가 따라 만들 수 있는)
  keyElement: string;         // 핵심 요소
  emoji: string;
}

const VIRAL_CASES_BY_DOMAIN: Record<string, ViralCase[]> = {
  realestate: [
    {
      pattern: '시간 압축형',
      videoLength: '1분 ~ 1분 30초',
      hook: '"○년 전 이 동네는..."',
      why: '과거 사진과 현재를 빠르게 교차하면서 변화를 시각적으로 보여줌. 시청자가 "내 동네는?"이라는 호기심으로 끝까지 시청',
      example: '○○동 5년 전 vs 지금',
      keyElement: 'Before/After 사진 + 큰 숫자',
      emoji: '🏘️',
    },
    {
      pattern: '실수 회피형',
      videoLength: '5분 ~ 8분',
      hook: '"이거 모르고 계약하면 후회합니다"',
      why: '경험자의 후회담은 입문자에게 가장 강력한 신호. "나도 이 실수 할 뻔" 공감 댓글 폭발',
      example: '청약 신청 전 알았으면 좋았을 5가지',
      keyElement: '구체적 사례 + 체크리스트',
      emoji: '⚠️',
    },
    {
      pattern: '데이터 시각화형',
      videoLength: '8분 이상',
      hook: '"실거래가 데이터로 본 진실"',
      why: '주관적 느낌 X, 데이터 기반 신뢰. 검색 의도 있는 시청자가 끝까지 시청 + 저장',
      example: '2026년 부동산 진짜 흐름 (데이터 분석)',
      keyElement: '그래프 + 출처 명시',
      emoji: '📊',
    },
  ],
  economy: [
    {
      pattern: '평범인 기록형',
      videoLength: '5분 ~ 10분',
      hook: '"평범한 직장인이 ○년 동안..."',
      why: '비슷한 처지의 사람이 만든 변화는 가장 강력한 동기부여. 시청자가 "나도 가능하다" 느낌',
      example: '40대 직장인의 자산 정리 노하우',
      keyElement: '구체적 과정 + 솔직한 실수담',
      emoji: '📈',
    },
    {
      pattern: '단계별 가이드형',
      videoLength: '8분 ~ 12분',
      hook: '"5단계만 따라하면 됩니다"',
      why: '복잡한 정보를 단순한 단계로 정리 → 저장/공유 욕구 폭발',
      example: '월급 외 수익 만드는 5단계',
      keyElement: '명확한 단계 + 실행 가능한 액션',
      emoji: '📋',
    },
    {
      pattern: '실수 공개형',
      videoLength: '7분 ~ 10분',
      hook: '"투자 시작 1년, 솔직한 실수담"',
      why: '성공담보다 실수담이 진심으로 받아들여짐. 댓글에서 비슷한 경험 공유',
      example: '재테크 처음 시작했을 때 큰 실수',
      keyElement: '솔직함 + 교훈',
      emoji: '💭',
    },
  ],
  language: [
    {
      pattern: '시간 한정 챌린지형',
      videoLength: '8분 ~ 15분',
      hook: '"하루 30분, ○개월 만에"',
      why: '시간 제약이 있어야 시청자가 "나도 시작해볼까" 생각. 단기 변화의 매력',
      example: '하루 30분 영어, 6개월 후 변화',
      keyElement: '구체적 일정표 + 방법론',
      emoji: '⏰',
    },
    {
      pattern: '평범인 변화형',
      videoLength: '10분 이상',
      hook: '"영어 0점부터 시작한 직장인"',
      why: '바닥부터 시작한 사람의 진심 어린 기록은 입문자의 두려움 해소',
      example: '40대에 영어 시작해서 알게 된 것들',
      keyElement: '비포애프터 + 솔직한 어려움',
      emoji: '🌱',
    },
    {
      pattern: '도구 추천형',
      videoLength: '5분 ~ 8분',
      hook: '"무료 앱 ○개로 충분합니다"',
      why: '무료 도구 정보는 저장/공유율이 매우 높음. 즉시 실행 가능',
      example: '영어 회화 무료 앱 5개',
      keyElement: '비교표 + 사용법',
      emoji: '🛠️',
    },
  ],
  health: [
    {
      pattern: '비포애프터 시각형',
      videoLength: '1분 ~ 3분',
      hook: '"○개월 변화 기록"',
      why: '시각적 변화는 가장 강력한 후크. 첫 3초에 결과 보여주면 이탈률 최저',
      example: '집에서 운동 3개월 변화',
      keyElement: '동일 각도 사진 + 날짜',
      emoji: '💪',
    },
    {
      pattern: '하루 일과형',
      videoLength: '5분 ~ 10분',
      hook: '"식단 + 운동 하루 루틴"',
      why: 'V-log 형식이라 친근함. 시청자가 일상 따라하기 쉬움',
      example: '체중 감량 중 평일 하루',
      keyElement: '시간대별 정리 + 실제 모습',
      emoji: '🌅',
    },
    {
      pattern: '실수 공개형',
      videoLength: '7분 ~ 12분',
      hook: '"이 운동, 이렇게 하면 안 됩니다"',
      why: '잘못된 정보 정정 콘텐츠는 신뢰 + 저장 동시 유도',
      example: '집 운동 흔한 실수 5가지',
      keyElement: '비교 시연 + 올바른 자세',
      emoji: '🚫',
    },
  ],
  selfdev: [
    {
      pattern: '습관 변화형',
      videoLength: '7분 ~ 12분',
      hook: '"하루 ○분 루틴, ○년 변화"',
      why: '작은 시작 → 큰 변화는 시청자의 부담을 줄여줌. "나도 할 수 있다" 신호',
      example: '아침 5분 루틴 1년 변화',
      keyElement: '구체적 시간 + 변화 기록',
      emoji: '⏱️',
    },
    {
      pattern: '책 추천 큐레이션형',
      videoLength: '10분 이상',
      hook: '"○○를 위한 책 5권"',
      why: '큐레이션 콘텐츠는 저장률 최상. 시청자가 "이건 봐둬야지" 자동 저장',
      example: '40대 직장인이 꼭 읽어야 할 책',
      keyElement: '책 표지 + 핵심 인용구',
      emoji: '📚',
    },
    {
      pattern: '실패 공유형',
      videoLength: '8분 ~ 15분',
      hook: '"자기계발 5년, 깨달은 것"',
      why: '실패 후 깨달음은 가장 진정성 있는 콘텐츠. 댓글 활성화 최고',
      example: '자기계발 시작했다가 포기한 이유',
      keyElement: '솔직한 회고 + 교훈',
      emoji: '🔄',
    },
  ],
  aitech: [
    {
      pattern: '무료 도구 비교형',
      videoLength: '5분 ~ 10분',
      hook: '"유료 안 써도 됩니다"',
      why: '무료 대안 정보는 검색량 최상. 즉시 실행 + 저장 + 공유',
      example: '유료 AI 대신 무료 도구 5가지',
      keyElement: '비교표 + 실제 결과물',
      emoji: '🆓',
    },
    {
      pattern: '결과물 시연형',
      videoLength: '3분 ~ 8분',
      hook: '"이거 AI로 만든 거예요"',
      why: '결과물부터 먼저 보여주면 호기심 폭발. "어떻게 만들었지?" 끝까지 시청',
      example: 'AI로 만든 영상, 30분 만에',
      keyElement: '결과물 먼저 + 과정 공개',
      emoji: '🤖',
    },
    {
      pattern: 'Step-by-step형',
      videoLength: '10분 ~ 15분',
      hook: '"0부터 따라하시면 됩니다"',
      why: '입문자 친화 콘텐츠는 저장/북마크 매우 높음',
      example: 'AI 영상 만들기 처음부터 끝까지',
      keyElement: '화면 캡처 + 큰 글씨',
      emoji: '📝',
    },
  ],
  senior: [
    {
      pattern: '나이 가능성형',
      videoLength: '5분 ~ 10분',
      hook: '"○○세에 시작했습니다"',
      why: '나이 강조 + 시작 이야기는 시니어층의 공감 폭발. 댓글에 비슷한 시작 이야기 모임',
      example: '60대에 디지털 도구 시작',
      keyElement: '나이 명시 + 구체적 시작 계기',
      emoji: '🌳',
    },
    {
      pattern: '인생 2막형',
      videoLength: '8분 이상',
      hook: '"은퇴 후 새로운 도전"',
      why: '비슷한 처지 시청자가 깊이 공감. 정성 들인 영상은 신뢰 + 구독으로 이어짐',
      example: '은퇴 후 시작한 새로운 일',
      keyElement: '진심 + 구체적 일상',
      emoji: '🌅',
    },
    {
      pattern: '디지털 입문형',
      videoLength: '7분 ~ 12분',
      hook: '"핸드폰만 있으면 가능"',
      why: '시니어층 진입 장벽 해소가 핵심. 실제 화면 캡처는 저장 폭발',
      example: '60대도 핸드폰만으로 영상 만들기',
      keyElement: '큰 글씨 + 단계별 캡처',
      emoji: '📱',
    },
  ],
  food: [
    {
      pattern: '간단 레시피형',
      videoLength: '1분 ~ 3분',
      hook: '"3가지 재료로 끝"',
      why: '재료 적음 = 진입 장벽 낮음. 즉시 따라하기 가능 → 저장 폭발',
      example: '냉장고 재료로 만드는 한 끼',
      keyElement: '재료 클로즈업 + 빠른 컷',
      emoji: '🍳',
    },
    {
      pattern: '실패 없는 레시피형',
      videoLength: '5분 ~ 8분',
      hook: '"이대로만 하면 무조건 성공"',
      why: '"실패할까봐" 두려움이 가장 큰 진입 장벽. 보장 멘트는 강력한 후크',
      example: '초보자도 성공하는 김치찌개',
      keyElement: '구체적 분량 + 시간 명시',
      emoji: '✅',
    },
    {
      pattern: '비교 시연형',
      videoLength: '5분 ~ 10분',
      hook: '"○○ vs ○○ 어느 쪽이 맛있을까"',
      why: '비교 콘텐츠는 시청자가 끝까지 결과 보고 싶어함',
      example: '집에서 vs 식당 김치찌개 비교',
      keyElement: '두 가지 동시 시연',
      emoji: '⚖️',
    },
  ],
  travel: [
    {
      pattern: '예산 한정형',
      videoLength: '8분 ~ 15분',
      hook: '"○○만원으로 ○일 여행"',
      why: '예산 명시는 즉시 따라하기 가능. 저장 + 공유 폭발',
      example: '50만원으로 제주 3일',
      keyElement: '예산 항목별 정리 + 영수증',
      emoji: '💰',
    },
    {
      pattern: '숨은 명소형',
      videoLength: '5분 ~ 10분',
      hook: '"현지인만 아는 곳"',
      why: '관광지 X 정보는 차별화. 저장/공유 욕구 자극',
      example: '○○ 숨은 카페 5곳',
      keyElement: '위치 + 가는 법 + 분위기',
      emoji: '🗺️',
    },
    {
      pattern: '시간 한정형',
      videoLength: '3분 ~ 5분',
      hook: '"하루 일정 완벽 정리"',
      why: '한 페이지 정리 = 저장하고 다음에 사용. 활용도 매우 높음',
      example: '○○ 하루 코스 (시간대별)',
      keyElement: '시간표 + 이동 경로',
      emoji: '⏰',
    },
  ],
  family: [
    {
      pattern: '사연 공유형',
      videoLength: '7분 ~ 12분',
      hook: '"우리 가족 이야기인데..."',
      why: '진심 어린 사연은 깊은 공감. 비슷한 경험 댓글로 모임',
      example: '시어머니와 화해하기까지',
      keyElement: '담담한 톤 + 솔직한 감정',
      emoji: '💝',
    },
    {
      pattern: '인생 회고형',
      videoLength: '10분 이상',
      hook: '"○○년이 지나서야 알았습니다"',
      why: '시간이 지나서 깨달음은 가장 진정성 있는 콘텐츠. 시청자도 자기 인생 돌아봄',
      example: '부모님께 못 한 말',
      keyElement: '서두르지 않는 호흡 + 침묵',
      emoji: '🍂',
    },
    {
      pattern: '에피소드형',
      videoLength: '5분 ~ 10분',
      hook: '"○○하다 일어난 일"',
      why: '구체적 사건은 시청자가 빠져듦. 끝까지 시청률 매우 높음',
      example: '명절에 있었던 작은 일',
      keyElement: '시간순 + 디테일',
      emoji: '📖',
    },
  ],
  jobs: [
    {
      pattern: '솔직한 후기형',
      videoLength: '8분 ~ 12분',
      hook: '"○○ 시작 ○개월, 솔직하게"',
      why: '광고 아닌 진짜 후기는 신뢰 형성. 저장 + 구독으로 이어짐',
      example: '재택 부업 6개월, 솔직 후기',
      keyElement: '수치 + 솔직한 어려움',
      emoji: '📊',
    },
    {
      pattern: '실패 공유형',
      videoLength: '10분 이상',
      hook: '"이거 ○○ 했다가 망한 이유"',
      why: '실패담은 동일 실수 회피하고 싶은 시청자에게 강력함',
      example: '창업 1년 만에 그만둔 이유',
      keyElement: '구체적 실수 + 교훈',
      emoji: '⚠️',
    },
    {
      pattern: '비교 분석형',
      videoLength: '7분 ~ 12분',
      hook: '"○○ vs ○○ 비교해봤습니다"',
      why: '결정 도와주는 콘텐츠는 검색량 + 저장률 최상',
      example: 'N잡 5가지 비교 분석',
      keyElement: '표 + 장단점',
      emoji: '⚖️',
    },
  ],
};

/**
 * 키워드/카테고리에 맞는 떡상 사례 3개 매칭
 */
export function getViralCases(categoryId: string, count = 3): ViralCase[] {
  const cases = VIRAL_CASES_BY_DOMAIN[categoryId] || VIRAL_CASES_BY_DOMAIN.realestate;
  return cases.slice(0, count);
}

/**
 * 모든 도메인의 떡상 사례 (메인 페이지 갤러리용)
 */
export function getAllViralCases(): Array<{ categoryId: string; cases: ViralCase[] }> {
  return Object.entries(VIRAL_CASES_BY_DOMAIN).map(([categoryId, cases]) => ({
    categoryId,
    cases,
  }));
}

/**
 * 도메인별 대표 사례 1개씩 (메인 갤러리용 - 9개 카드)
 */
export function getFeaturedViralCases(): Array<ViralCase & { categoryId: string }> {
  return Object.entries(VIRAL_CASES_BY_DOMAIN).map(([categoryId, cases]) => ({
    ...cases[0],
    categoryId,
  }));
}
