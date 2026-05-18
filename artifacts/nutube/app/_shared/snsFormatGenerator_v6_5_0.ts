// ============================================================
// NuTube v6.5.0 - SNS Upload Format Generator
// 4개 플랫폼 실제 업로드 페이지 UI 그대로 재현
// YouTube / Shorts / Instagram Reels / TikTok
// ============================================================

export interface SNSFormatPackage {
  youtube: YouTubeFormat;
  shorts: ShortsFormat;
  instagram: InstagramFormat;
  tiktok: TikTokFormat;
}

// ============== YouTube (긴 영상) ==============
export interface YouTubeFormat {
  title: string;              // 100자 이내 (실제 한도)
  titleCharCount: number;
  description: string;        // 5000자 이내
  descriptionCharCount: number;
  tags: string[];             // 500자 이내, 띄어쓰기 유지
  tagsCharCount: number;
  category: string;           // 유튜브 카테고리
  thumbnailGuide: string;     // 썸네일 가이드
  visibility: "공개" | "일부 공개" | "비공개";
  language: string;
  endScreenSuggestion: string; // 최종화면 추천
  cardSuggestion: string;     // 카드 추천 시점
  chapters: { time: string; label: string }[]; // 챕터 마커
}

// ============== Shorts (60초 이하) ==============
export interface ShortsFormat {
  title: string;              // 100자 이내 (#Shorts 자동 포함)
  titleCharCount: number;
  hashtagShorts: boolean;     // #Shorts 필수
  description: string;        // 짧게
  hashtags: string[];         // 트렌드 해시태그
  thumbnailFrame: string;     // 영상 내 특정 프레임
  remixAllow: boolean;        // 리믹스 허용
  soundCredit: string;        // 사운드 출처
}

// ============== Instagram Reels ==============
export interface InstagramFormat {
  caption: string;            // 2200자 이내
  captionCharCount: number;
  hashtags: string[];         // 30개 이내
  hashtagsCount: number;
  coverFrame: string;         // 커버 프레임 가이드
  audioName: string;          // 오디오 (트렌드)
  location: string;           // 위치 태그
  collaborator: string;       // 협업자 (선택)
  productTag: string;         // 제품 태그 (선택)
  shareToFeed: boolean;       // 피드에도 공유
  shareToStory: boolean;      // 스토리에도 공유
}

// ============== TikTok ==============
export interface TikTokFormat {
  caption: string;            // 2200자 이내
  captionCharCount: number;
  hashtags: string[];         // 트렌드 + 니치 조합
  hashtagsCount: number;
  soundChoice: string;        // 사운드 선택
  coverImage: string;         // 커버 이미지 가이드
  whoCanWatch: "전체 공개" | "친구만" | "비공개";
  allowComments: boolean;
  allowDuet: boolean;
  allowStitch: boolean;
  scheduledTime: string;      // 추천 발행 시간
}

// ============================================================
// 플랫폼별 최적 발행 시간 (한국 기준, 시니어 + 일반 통합)
// ============================================================
const OPTIMAL_TIMES = {
  youtube: ["오후 6시-9시 (평일)", "오전 10-11시 (주말)", "오후 8시 (시니어 골든타임)"],
  shorts: ["오후 12-1시 (점심)", "오후 7-9시 (저녁)", "오후 9시 (시니어 시청 피크)"],
  instagram: ["오전 11시", "오후 7-9시", "오후 8시 (Reels 알고리즘 우호 시간)"],
  tiktok: ["오전 7-9시", "오후 7-11시", "오후 9시 (For You 알고리즘 활성)"]
};

// ============================================================
// 도메인별 해시태그 풀
// ============================================================
const HASHTAG_POOL: Record<string, { trend: string[]; niche: string[]; senior: string[] }> = {
  default: {
    trend: ["#일상", "#소통", "#팔로우", "#좋아요", "#daily"],
    niche: ["#리얼후기", "#꿀팁", "#정보공유", "#알고파트너스"],
    senior: ["#시니어", "#5060", "#6070", "#영상제작", "#쉽게배우는"]
  }
};

// ============================================================
// 메인 SNS 포맷 생성기
// ============================================================
export function generateSNSFormatPackage(
  keyword: string,
  selectedTitle: string,
  loglineSummary: string,
  category?: string
): SNSFormatPackage {
  const seed = Math.abs(hashString(keyword + selectedTitle + Date.now().toString()));
  
  // 키워드에서 핵심 명사 추출
  const coreNouns = extractCoreNouns(keyword);
  
  return {
    youtube: generateYouTubeFormat(keyword, selectedTitle, loglineSummary, coreNouns, seed),
    shorts: generateShortsFormat(keyword, selectedTitle, coreNouns, seed),
    instagram: generateInstagramFormat(keyword, selectedTitle, loglineSummary, coreNouns, seed),
    tiktok: generateTikTokFormat(keyword, selectedTitle, coreNouns, seed)
  };
}

// ============================================================
// YouTube 포맷 (긴 영상)
// ============================================================
function generateYouTubeFormat(
  keyword: string,
  title: string,
  logline: string,
  cores: string[],
  seed: number
): YouTubeFormat {
  // 제목: 70자 이내 권장 (모바일 잘림 방지)
  const optimizedTitle = title.length > 70 
    ? title.substring(0, 67) + "..." 
    : title;
  
  // 설명: 첫 2줄이 가장 중요 (모바일 미리보기)
  const description = `${logline}

📌 이 영상에서 다루는 내용
00:00 후킹 - ${keyword}, 왜 이렇게 화제일까요
00:10 진짜 핵심 이야기 시작
00:35 가장 많이 놓치는 한 가지
01:30 실전 적용 방법
03:00 마무리 + 다음 영상 예고

✅ 도움이 되셨다면 좋아요와 구독 부탁드립니다.
✅ 궁금한 점은 댓글로 남겨주세요. 답글 드립니다.

📚 관련 영상도 함께 보세요
(다음 영상 링크가 자동으로 추천됩니다)

📍 알고파트너스
영상 제작이 어려운 분들을 위한 무료 도구
👉 https://nutube.kr

#${cores[0] || keyword}  #영상제작  #콘텐츠제작  #알고파트너스

━━━━━━━━━━━━━━━━━━━━━
이 채널은 시니어와 일반인 모두를 위해 운영됩니다.
영상이 도움이 되셨다면 한 번씩만 응원해주세요. 감사합니다.`;
  
  // 태그: 500자 이내, YouTube는 태그에 띄어쓰기 유지
  const tags = [
    keyword,
    `${keyword} 후기`,
    `${keyword} 비교`,
    `${keyword} 추천`,
    `${keyword} 솔직`,
    cores[0] || keyword,
    "영상 제작",
    "콘텐츠 제작",
    "알고파트너스",
    "NuTube",
    "리뷰",
    "꿀팁",
    "정보",
    "2026"
  ].filter(Boolean);
  
  return {
    title: optimizedTitle,
    titleCharCount: optimizedTitle.length,
    description,
    descriptionCharCount: description.length,
    tags,
    tagsCharCount: tags.join(",").length,
    category: detectYouTubeCategory(keyword),
    thumbnailGuide: `정면 클로즈업 + 큰 자막 1줄 ("${cores[0] || keyword}")`+
      ` + 시선 사로잡는 색상(빨강/노랑) + 표정 변화 명확하게. 1280x720 권장.`,
    visibility: "공개",
    language: "한국어",
    endScreenSuggestion: "최종 5-20초: 다음 영상 카드 1개 + 구독 버튼 1개. 자동 재생률을 높이려면 화면 좌측에 다음 영상 배치.",
    cardSuggestion: "1분 30초 시점에 관련 영상 카드 1개 삽입 (반전 구간 직전이 클릭률 가장 높음)",
    chapters: [
      { time: "0:00", label: "후킹" },
      { time: "0:10", label: "본격 시작" },
      { time: "0:35", label: "갈등 / 시점 변화" },
      { time: "1:30", label: "핵심 비밀 공개" },
      { time: "3:00", label: "결론 + CTA" }
    ]
  };
}

// ============================================================
// Shorts 포맷 (60초 이하)
// ============================================================
function generateShortsFormat(
  keyword: string,
  title: string,
  cores: string[],
  seed: number
): ShortsFormat {
  // Shorts 제목은 짧게, #Shorts 필수
  const shortTitle = title.length > 60 
    ? title.substring(0, 57) + "..."
    : title;
  
  const finalTitle = `${shortTitle} #Shorts`;
  
  return {
    title: finalTitle,
    titleCharCount: finalTitle.length,
    hashtagShorts: true,
    description: `${keyword}, 60초로 핵심만!

📍 풀버전은 채널에서 만나보세요.
👉 알고파트너스`,
    hashtags: [
      "#Shorts",
      "#쇼츠",
      `#${cores[0] || keyword}`,
      `#${keyword.replace(/\s+/g, '')}`,
      "#영상제작",
      "#꿀팁",
      "#1분영상",
      "#알고파트너스"
    ],
    thumbnailFrame: "Shorts는 첫 프레임이 자동 썸네일. 영상 시작 0.5초에 가장 임팩트 있는 컷 배치 권장.",
    remixAllow: true,
    soundCredit: "원본 사운드 (또는 트렌드 BGM 사용 시 출처 명시)"
  };
}

// ============================================================
// Instagram Reels 포맷
// ============================================================
function generateInstagramFormat(
  keyword: string,
  title: string,
  logline: string,
  cores: string[],
  seed: number
): InstagramFormat {
  // 인스타 캡션: 첫 125자가 잘리지 않음
  const caption = `${logline}

오늘은 ${keyword}에 대한 핵심 이야기입니다.
딱 90초 안에 알아야 할 내용만 담았어요.

▪︎ 영상 보시고 도움 되셨다면 ❤️ 부탁드려요
▪︎ 비슷한 고민 있으시면 댓글로 나눠주세요
▪︎ 더 많은 콘텐츠는 프로필 링크에서 만나보세요

저장해두시면 필요할 때 다시 보실 수 있어요 📌

━━━━━━━━━━━━━━━━━━━━━
영상 제작이 어려우신 분들을 위한 무료 도구
@algopartners`;
  
  // 인스타 해시태그: 30개 이내, 캡션에 포함 또는 첫 댓글
  const hashtags = [
    `#${cores[0] || keyword}`,
    `#${keyword.replace(/\s+/g, '')}`,
    "#릴스",
    "#reels",
    "#일상",
    "#소통",
    "#팔로우",
    "#좋아요반사",
    "#정보공유",
    "#꿀팁",
    "#리얼후기",
    "#영상제작",
    "#콘텐츠제작",
    "#알고파트너스",
    "#daily",
    "#instadaily",
    "#korea",
    "#seoul",
    "#일상스타그램",
    "#정보스타그램"
  ];
  
  return {
    caption,
    captionCharCount: caption.length,
    hashtags,
    hashtagsCount: hashtags.length,
    coverFrame: `1:1 또는 9:16 비율. 영상 내에서 가장 강한 임팩트 프레임 선택. 큰 텍스트 1줄 ("${cores[0] || keyword}") + 인물 시선 정면.`,
    audioName: "트렌드 오디오 사용 시 알고리즘 우호적. 인스타 [오디오 라이브러리]에서 'Trending' 표시된 음원 선택.",
    location: "Seoul, South Korea (또는 영상 내용과 관련된 위치)",
    collaborator: "(필요 시 협업자 계정 태그)",
    productTag: "(제품 리뷰 시 해당 브랜드 공식 계정 태그)",
    shareToFeed: true,
    shareToStory: true
  };
}

// ============================================================
// TikTok 포맷
// ============================================================
function generateTikTokFormat(
  keyword: string,
  title: string,
  cores: string[],
  seed: number
): TikTokFormat {
  // 틱톡 캡션: 짧고 강하게
  const caption = `${title}

${keyword}, 끝까지 보면 진짜 충격 ⚡

#${cores[0] || keyword} #${keyword.replace(/\s+/g, '')} #fyp #foryou #추천 #알고파트너스`;
  
  const hashtags = [
    "#fyp",
    "#foryou",
    "#추천",
    "#포유",
    `#${cores[0] || keyword}`,
    `#${keyword.replace(/\s+/g, '')}`,
    "#영상제작",
    "#꿀팁",
    "#정보",
    "#viral",
    "#trending",
    "#알고파트너스"
  ];
  
  return {
    caption,
    captionCharCount: caption.length,
    hashtags,
    hashtagsCount: hashtags.length,
    soundChoice: "틱톡 [Trending Sounds] 메뉴에서 상승 추세 음원 선택. 인기 사운드 사용 시 For You 노출 확률 ↑",
    coverImage: "9:16 비율. 영상 내 가장 임팩트 있는 0.5초 프레임. 큰 텍스트 + 표정 명확.",
    whoCanWatch: "전체 공개",
    allowComments: true,
    allowDuet: true,
    allowStitch: true,
    scheduledTime: pickFromArray(OPTIMAL_TIMES.tiktok, seed)
  };
}

// ============================================================
// 헬퍼 함수들
// ============================================================
function hashString(s: string): number {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function pickFromArray<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function extractCoreNouns(keyword: string): string[] {
  // 한국어 명사 간단 추출 (2~6자 단어)
  const words = keyword.split(/[\s,]+/).filter(w => w.length >= 2 && w.length <= 8);
  return words.length > 0 ? words : [keyword];
}

function detectYouTubeCategory(keyword: string): string {
  const k = keyword.toLowerCase();
  if (/리뷰|비교|후기|언박싱/i.test(k)) return "노하우 및 스타일 (Howto & Style)";
  if (/방법|how|가이드|튜토리얼/i.test(k)) return "교육 (Education)";
  if (/뉴스|이슈|시사/i.test(k)) return "뉴스/정치 (News & Politics)";
  if (/일상|vlog|루틴/i.test(k)) return "인물/블로그 (People & Blogs)";
  if (/게임|gaming/i.test(k)) return "게임 (Gaming)";
  if (/음악|노래|cover/i.test(k)) return "음악 (Music)";
  if (/요리|레시피|쿠킹/i.test(k)) return "노하우 및 스타일 (Howto & Style)";
  if (/여행|trip|travel/i.test(k)) return "여행 및 이벤트 (Travel & Events)";
  return "엔터테인먼트 (Entertainment)";
}

// ============================================================
// END OF FILE
// ============================================================
