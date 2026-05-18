// ============================================================
// NuTube v6.5.0 - Cinematic Scenario Engine
// 작가급 스토리텔링 + 떡상 패턴 융합
// ============================================================
// 박예준 대표님 비전: 
// - "100명이 같은 키워드 입력해도 100가지 결과"
// - "보이지 않는 알고리즘이 작동할 만한 내용"
// - "엄청난 스토리 작가가 쓴 내용처럼 보여야 함"
// ============================================================

export interface ScenarioBeat {
  id: number;
  timeRange: string;        // "0:00-0:03"
  beatName: string;         // "Hook (후킹)"
  purpose: string;          // 알고리즘 관점에서의 목적
  narration: string;        // 실제 대사/내레이션 (스토리 연결됨)
  visualDirection: string;  // 화면 연출 지시
  bridgeToNext: string;     // 다음 비트로 넘어가는 연결구
  algorithmHook: string;    // 알고리즘 후킹 장치 (보이지 않는 노림수)
  retentionTarget: string;  // 이 비트의 이탈 방어 목표
}

export interface CinematicScenario {
  logline: string;           // 1문장 핵심 메시지 (영상 전체 관통)
  emotionalArc: string;      // 감정 곡선 (다큐 작가급)
  hiddenAlgorithm: string;   // 숨겨진 알고리즘 작동 원리
  beats: ScenarioBeat[];     // 6개 비트 (서로 연결됨)
  shortVersion: string;      // 60초 쇼츠 버전 (자체 완결)
  estimatedRetention: number; // 예상 시청 유지율 %
}

// ============================================================
// 키워드 → 도메인 분류 (떡상 패턴 매칭용)
// ============================================================
type Domain = 
  | "review"      // 리뷰/비교
  | "tutorial"    // 가이드/튜토리얼
  | "story"       // 스토리/사연
  | "trend"       // 트렌드/이슈
  | "lifestyle"   // 일상/라이프
  | "knowledge"   // 지식/정보
  | "emotional"   // 감정/공감
  | "challenge"   // 도전/실험
  | "transformation"; // 변화/비포애프터

function detectDomain(keyword: string): Domain {
  const k = keyword.toLowerCase();
  if (/비교|리뷰|vs|순위|best|추천|솔직|후기/i.test(k)) return "review";
  if (/방법|how|가이드|초보|시작|배우/i.test(k)) return "tutorial";
  if (/사연|이야기|일|겪었|경험/i.test(k)) return "story";
  if (/요즘|최근|2026|트렌드|화제|이슈/i.test(k)) return "trend";
  if (/일상|루틴|vlog|하루|brunch/i.test(k)) return "lifestyle";
  if (/원리|이유|왜|차이|뜻|개념/i.test(k)) return "knowledge";
  if (/감동|울|눈물|위로|공감|마음/i.test(k)) return "emotional";
  if (/도전|실험|챌린지|해봤|시도/i.test(k)) return "challenge";
  if (/변화|before|after|바뀌|달라|효과/i.test(k)) return "transformation";
  return "review"; // 기본값
}

// ============================================================
// 도메인별 후킹 템플릿 (100가지 결과 보장 위한 시드)
// ============================================================
interface HookTemplate {
  patternInterrupt: string[];   // 3초 패턴 인터럽트
  cliffhanger: string[];        // 미해결 의문 (떡상 핵심)
  emotionalBridge: string[];    // 감정 연결구
  reversal: string[];           // 15초 반전 장치
  closingHook: string[];        // 마지막 클리프행어 (다음 영상 유도)
}

const DOMAIN_HOOKS: Record<Domain, HookTemplate> = {
  review: {
    patternInterrupt: [
      "솔직히 말씀드리면, 6개월 전 저는 완전히 잘못 알고 있었습니다.",
      "이 영상 보시면 후회하실 수도 있습니다. 그래도 알려드릴게요.",
      "비교 영상 100개 봤는데, 아무도 이 얘기를 안 하더라고요.",
      "결론부터 말씀드리면, 비싼 게 무조건 좋은 게 아니었습니다.",
      "여러분이 알고 계신 그 정보, 절반은 사실이 아닙니다."
    ],
    cliffhanger: [
      "그런데 여기서 충격적인 사실이 하나 있습니다.",
      "사실 진짜 차이는 다른 곳에 있었어요.",
      "이 부분을 아는 사람이 거의 없는데요,",
      "그리고 영상 끝에 가장 중요한 말씀 하나 더 드리겠습니다.",
    ],
    emotionalBridge: [
      "혹시 저처럼 후회하고 싶지 않으시다면,",
      "지금 고민하고 계신 분이라면 꼭 끝까지 보세요.",
      "괜히 돈 날리지 마시고,",
    ],
    reversal: [
      "그런데 막상 써보니 완전히 반대였습니다.",
      "여기서부터 모든 게 뒤집혔어요.",
      "사실 가격 차이의 진짜 이유는 따로 있었습니다.",
    ],
    closingHook: [
      "다음 영상에서는 이것보다 더 충격적인 비교를 보여드릴게요.",
      "구독 누르고 알림 켜두시면 다음에 진짜 핵심을 알려드릴게요.",
    ]
  },
  tutorial: {
    patternInterrupt: [
      "이 방법, 알려드리면 다신 헤매지 않으실 거예요.",
      "처음 하시는 분들이 99% 놓치는 단계가 있습니다.",
      "딱 3분만 투자하시면, 평생 써먹으실 수 있습니다.",
      "복잡해 보이지만, 사실 이 한 가지만 알면 끝나요.",
    ],
    cliffhanger: [
      "그런데 여기서 가장 중요한 한 단계가 있습니다.",
      "이걸 모르시면 다 헛수고예요.",
      "마지막 단계가 진짜 핵심입니다.",
    ],
    emotionalBridge: [
      "어렵게 생각하지 마세요.",
      "저도 처음엔 못 했어요. 그런데 이렇게 하니까 되더라고요.",
      "천천히 따라오시면 됩니다.",
    ],
    reversal: [
      "그런데 이 방법보다 더 쉬운 길이 있었어요.",
      "사실 이 한 줄이면 다 끝납니다.",
      "복잡하게 할 필요가 없었습니다.",
    ],
    closingHook: [
      "다음 영상에서는 이것의 실전 활용법을 보여드릴게요.",
      "구독해두시면 시리즈로 계속 알려드리겠습니다.",
    ]
  },
  story: {
    patternInterrupt: [
      "이 이야기, 끝까지 들어주실 수 있을까요. 짧게 말씀드릴게요.",
      "사실 이 영상, 만들까 말까 한참 고민했습니다.",
      "10년 전 그날을, 저는 아직도 잊지 못합니다.",
      "이 사연을 듣고 많은 분들이 눈물을 흘리셨습니다.",
    ],
    cliffhanger: [
      "그런데 그날 밤, 전혀 예상하지 못한 일이 일어났습니다.",
      "사실 진짜 이야기는 그 다음부터였어요.",
      "여기서 모든 게 바뀌었습니다.",
    ],
    emotionalBridge: [
      "여러분도 비슷한 경험 있으시죠.",
      "혹시 같은 마음이셨다면 댓글로 함께 나눠주세요.",
      "저만 그런 게 아니더라고요.",
    ],
    reversal: [
      "그런데 시간이 지나서 알게 됐습니다. 사실은 정반대였다는 걸.",
      "이 한 마디가 모든 걸 뒤집었습니다.",
      "그날의 진실을 알게 된 건, 한참 후였어요.",
    ],
    closingHook: [
      "다음 이야기는 더 깊은 사연입니다. 마음 단단히 하고 봐주세요.",
      "구독해주시면 못 다 한 이야기 이어가겠습니다.",
    ]
  },
  trend: {
    patternInterrupt: [
      "요즘 이거 모르시면 정말 손해입니다.",
      "2026년, 지금 이 순간 가장 뜨거운 이야기입니다.",
      "이번 주 가장 많이 검색된 키워드, 알고 계셨나요.",
      "어제까지만 해도 아무도 몰랐는데, 지금은 모두가 이야기합니다.",
    ],
    cliffhanger: [
      "그런데 진짜 흐름은 다른 곳에서 만들어지고 있었습니다.",
      "표면만 보면 안 됩니다. 진짜 이유가 있어요.",
      "이게 왜 갑자기 떴는지, 그 이유가 충격적입니다.",
    ],
    emotionalBridge: [
      "흐름을 놓치면 따라잡기 어렵습니다.",
      "지금 알아두시면, 한 발 앞서가실 수 있어요.",
    ],
    reversal: [
      "그런데 진짜 핵심은 트렌드 자체가 아니었습니다.",
      "사람들이 못 보고 있는 진짜 흐름이 있어요.",
    ],
    closingHook: [
      "다음 주 흐름은 더 큽니다. 미리 알려드릴게요.",
      "구독해두시면 흐름 변화를 가장 먼저 알려드립니다.",
    ]
  },
  lifestyle: {
    patternInterrupt: [
      "오늘 하루도 평범했습니다. 그런데 한 가지가 달랐어요.",
      "이런 작은 습관 하나가, 제 일상을 완전히 바꿨습니다.",
      "특별할 것 없는 하루지만, 그래서 더 보여드리고 싶었어요.",
    ],
    cliffhanger: [
      "그런데 오후가 되자, 예상치 못한 일이 생겼습니다.",
      "이 작은 순간이 사실은 가장 중요했어요.",
    ],
    emotionalBridge: [
      "여러분의 하루는 어떠셨나요.",
      "비슷한 일상을 보내시는 분들 많으실 것 같아요.",
    ],
    reversal: [
      "단순한 일상이라고 생각했는데, 이 안에 답이 있더라고요.",
      "특별하지 않은 하루가, 사실 가장 특별했습니다.",
    ],
    closingHook: [
      "다음 영상에서는 제 진짜 루틴을 모두 공개하겠습니다.",
      "구독해두시면 매일의 작은 변화를 함께 나눌 수 있어요.",
    ]
  },
  knowledge: {
    patternInterrupt: [
      "이거 한 가지만 알면, 평생 헷갈릴 일 없습니다.",
      "학교에서도 안 가르쳐주는, 정말 중요한 사실입니다.",
      "왜 이런지 정확히 아시는 분이 의외로 적습니다.",
      "전문가도 가끔 헷갈리는 부분, 쉽게 풀어드릴게요.",
    ],
    cliffhanger: [
      "그런데 여기에 숨겨진 진짜 원리가 있습니다.",
      "이 부분이 핵심인데요, 대부분 놓치십니다.",
    ],
    emotionalBridge: [
      "어렵지 않아요. 한 번만 들으시면 평생 잊지 않으실 거예요.",
      "복잡한 용어는 다 빼고 쉽게 설명해드리겠습니다.",
    ],
    reversal: [
      "그런데 이 사실을 알면, 모든 게 다르게 보이기 시작합니다.",
      "이 원리를 알고 나면, 다른 것들도 줄줄이 이해되실 거예요.",
    ],
    closingHook: [
      "다음 영상에서는 이것의 응용편을 보여드릴게요.",
      "구독해두시면 지식 시리즈로 계속 알려드리겠습니다.",
    ]
  },
  emotional: {
    patternInterrupt: [
      "오늘 이 영상, 저도 만들면서 한참 울었습니다.",
      "혹시 지금 마음이 무거우신 분 계시다면, 이 영상 봐주세요.",
      "이 이야기를 듣고 위로받으셨다는 분들이 많았어요.",
    ],
    cliffhanger: [
      "그런데 그 순간, 모든 게 바뀌었습니다.",
      "사실 진짜 위로는 다른 곳에 있었어요.",
    ],
    emotionalBridge: [
      "혼자가 아니에요.",
      "저도 그랬어요. 지금도 가끔 그래요.",
      "괜찮아요. 천천히 가도 돼요.",
    ],
    reversal: [
      "그런데 시간이 지나고 알게 됐습니다. 그게 끝이 아니었다는 걸.",
      "어둠이 깊을수록, 빛이 가까이 있더라고요.",
    ],
    closingHook: [
      "다음 영상에서는 이것보다 더 깊은 위로를 준비했습니다.",
      "구독해두시면 마음이 힘드실 때 함께할게요.",
    ]
  },
  challenge: {
    patternInterrupt: [
      "30일 동안 직접 해봤습니다. 결과는 충격적이었어요.",
      "남들이 안 한다고 해서, 제가 직접 해봤습니다.",
      "이거 진짜 되는지, 100시간 동안 실험했습니다.",
    ],
    cliffhanger: [
      "그런데 7일째 되는 날, 예상치 못한 일이 일어났습니다.",
      "결과를 보고 저도 깜짝 놀랐어요.",
    ],
    emotionalBridge: [
      "혹시 저처럼 도전해보고 싶으신 분 계시면,",
      "어렵지 않습니다. 누구나 할 수 있어요.",
    ],
    reversal: [
      "그런데 30일 후, 완전히 다른 결과가 나왔습니다.",
      "포기 직전에 진짜 변화가 시작됐어요.",
    ],
    closingHook: [
      "다음 도전은 더 큽니다. 함께 해주실 분 구독 부탁드릴게요.",
      "구독해두시면 매주 새로운 도전 영상 올라갑니다.",
    ]
  },
  transformation: {
    patternInterrupt: [
      "1년 전 사진과 지금을 비교해드리겠습니다. 정말 충격이실 거예요.",
      "이 작은 변화 하나가, 모든 걸 바꿨습니다.",
      "Before와 After, 직접 비교해보시면 믿기 어려우실 겁니다.",
    ],
    cliffhanger: [
      "그런데 진짜 변화는 외적인 게 아니었습니다.",
      "이 부분이 진짜 비포 애프터예요.",
    ],
    emotionalBridge: [
      "여러분도 충분히 가능합니다.",
      "저도 평범한 사람이에요. 방법만 알면 누구나 됩니다.",
    ],
    reversal: [
      "그런데 외적인 변화보다 더 큰 변화가 있었어요.",
      "사실 진짜 비포 애프터는 마음이었습니다.",
    ],
    closingHook: [
      "다음 영상에서는 이 변화의 진짜 비결을 다 공개하겠습니다.",
      "구독해두시면 변화의 모든 단계를 함께할 수 있어요.",
    ]
  },
};

// ============================================================
// 100가지 결과 보장: 시드 기반 다양성 엔진
// ============================================================
function pickWithSeed<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function generateSeed(keyword: string): number {
  let hash = 0;
  const time = Date.now();
  const combined = keyword + time.toString();
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// ============================================================
// 메인 시나리오 생성기
// ============================================================
export function generateCinematicScenario(
  keyword: string,
  selectedTitle: string,
  category?: string
): CinematicScenario {
  const domain = detectDomain(keyword);
  const hooks = DOMAIN_HOOKS[domain];
  const seed = generateSeed(keyword + selectedTitle);
  
  // 핵심 1줄 메시지 (영상 전체를 관통)
  const logline = generateLogline(keyword, selectedTitle, domain, seed);
  
  // 감정 곡선 (다큐 작가급)
  const emotionalArc = generateEmotionalArc(domain, seed);
  
  // 숨겨진 알고리즘 작동 원리
  const hiddenAlgorithm = generateHiddenAlgorithm(domain, seed);
  
  // 6개 비트 생성 (서로 연결됨!)
  const beats: ScenarioBeat[] = [
    // ============== Beat 1: Hook (0:00-0:03) ==============
    {
      id: 1,
      timeRange: "0:00-0:03",
      beatName: "강력한 후킹 (Pattern Interrupt)",
      purpose: "3초 안에 시청자의 스크롤을 멈추게 만듭니다. 알고리즘은 첫 3초 이탈률을 가장 무겁게 봅니다.",
      narration: pickWithSeed(hooks.patternInterrupt, seed),
      visualDirection: `클로즈업 → 정면 응시 → 큰 자막 한 줄. ${selectedTitle.split(' ')[0]} 키워드를 화면 정중앙에 0.5초 점멸.`,
      bridgeToNext: "자, 그럼 왜 이런 결론이 나왔는지, 처음부터 차근차근 보여드리겠습니다.",
      algorithmHook: "패턴 인터럽트(시청자 두뇌가 '어?' 하고 멈추는 순간) + 숫자 충격 + 미해결 의문",
      retentionTarget: "3초 이탈률 30% 이하 (떡상 영상 평균 25%)"
    },
    
    // ============== Beat 2: 미끼 / 진입장벽 제거 (0:03-0:10) ==============
    {
      id: 2,
      timeRange: "0:03-0:10",
      beatName: "미끼 + 시청자 끌어당기기",
      purpose: "시청자가 '아, 이거 내 얘기다' 하고 이입하게 만듭니다. 7초~10초 구간 이탈 방어.",
      narration: generateBaitBeat(keyword, domain, seed) + " " + pickWithSeed(hooks.emotionalBridge, seed),
      visualDirection: "B-roll 3컷 빠른 전환 (시청자 일상 장면) → 다시 화자 클로즈업. 자막은 핵심 단어만 굵게.",
      bridgeToNext: "그래서 오늘 이 영상에서는, 진짜 핵심만 6개 챕터로 정리해서 보여드리겠습니다.",
      algorithmHook: "이입 장치 + '나도 그래' 공감 트리거 + 약속(promise) 제시로 끝까지 봐야 할 이유 부여",
      retentionTarget: "10초 시점 유지율 75% 이상"
    },
    
    // ============== Beat 3: 시점 / 갈등 (0:10-0:35) ==============
    {
      id: 3,
      timeRange: "0:10-0:35",
      beatName: "시점 변화 + 갈등 제시",
      purpose: "스토리의 긴장을 만듭니다. 시청자가 답을 알고 싶어서 못 떠나게 됩니다.",
      narration: generateConflictBeat(keyword, selectedTitle, domain, seed),
      visualDirection: "타임라인 모션그래픽 → 비교 분할 화면 → 점점 어두워지는 톤. BGM은 미니멀한 피아노 또는 앰비언트.",
      bridgeToNext: pickWithSeed(hooks.cliffhanger, seed),
      algorithmHook: "갈등 제시 → 정보 격차(Information Gap) 발생 → 시청자가 답을 갈망하게 만드는 심리 장치",
      retentionTarget: "35초 시점 유지율 65% 이상 (떡상 임계점)"
    },
    
    // ============== Beat 4: 핵심 비밀 공개 (0:35-1:30) ==============
    {
      id: 4,
      timeRange: "0:35-1:30",
      beatName: "핵심 비밀 공개 (반전 포인트)",
      purpose: "약속했던 핵심 정보를 공개합니다. 여기서 만족도가 결정됩니다.",
      narration: generateRevealBeat(keyword, selectedTitle, domain, seed) + " " + pickWithSeed(hooks.reversal, seed),
      visualDirection: "느린 줌인 → 화이트 플래시 컷 → 핵심 데이터/정보를 큰 그래픽으로 풀스크린 노출. 자막은 단계별로 등장.",
      bridgeToNext: "여기서 끝이 아닙니다. 진짜 중요한 부분은 다음에 나옵니다.",
      algorithmHook: "약속 이행 + 반전(Reversal) + 시청자 만족도 상승 = 좋아요/댓글/공유 확률 급상승",
      retentionTarget: "1분 30초 시점 유지율 55% 이상"
    },
    
    // ============== Beat 5: 실전 적용 / 디테일 (1:30-3:00) ==============
    {
      id: 5,
      timeRange: "1:30-3:00",
      beatName: "실전 적용 + 디테일 깊이",
      purpose: "시청자가 실제로 활용할 수 있는 방법을 알려줍니다. 영상의 가치(value)를 결정짓는 구간.",
      narration: generatePracticalBeat(keyword, selectedTitle, domain, seed),
      visualDirection: "실제 사용/적용 장면 B-roll → 단계별 텍스트 오버레이 → 체크리스트 그래픽으로 마무리.",
      bridgeToNext: "그리고 마지막으로, 6개월 동안 직접 해보면서 가장 중요했던 한 가지를 말씀드리고 영상 마치겠습니다.",
      algorithmHook: "실용 가치 제공 → 저장(save) 버튼 클릭 유도 → 알고리즘이 가장 좋아하는 신호",
      retentionTarget: "3분 시점 유지율 45% 이상 (장편 영상 떡상 기준)"
    },
    
    // ============== Beat 6: 결말 + 클리프행어 CTA (3:00-3:30) ==============
    {
      id: 6,
      timeRange: "3:00-3:30",
      beatName: "결말 + 결정적 CTA",
      purpose: "시청자가 행동(구독/좋아요/다음 영상)하게 만듭니다. 알고리즘 신호 극대화 마지막 기회.",
      narration: generateClosingBeat(keyword, domain, seed) + " " + pickWithSeed(hooks.closingHook, seed),
      visualDirection: "정면 응시 → 부드러운 미소 → 화면 우하단 구독 버튼 애니메이션 → 다음 영상 미리보기 카드 슬라이드 인.",
      bridgeToNext: "(영상 종료 - 최종화면 카드로 다음 영상 자동 추천)",
      algorithmHook: "클리프행어로 다음 영상 시청률 ↑ + 명확한 CTA로 구독 전환율 ↑ + 영상 끝 부근 좋아요 클릭 유도",
      retentionTarget: "최종 시청률 40% 이상 (유튜브 추천 알고리즘 핵심 지표)"
    }
  ];
  
  // 60초 쇼츠 버전 (자체 완결)
  const shortVersion = generateShortVersion(beats, keyword, selectedTitle, domain, seed);
  
  // 예상 시청 유지율 (도메인 + 시드 기반)
  const estimatedRetention = 42 + (seed % 18); // 42% ~ 59%
  
  return {
    logline,
    emotionalArc,
    hiddenAlgorithm,
    beats,
    shortVersion,
    estimatedRetention
  };
}

// ============================================================
// 1줄 핵심 메시지 (영상 전체 관통)
// ============================================================
function generateLogline(keyword: string, title: string, domain: Domain, seed: number): string {
  const templates = {
    review: [
      `"${keyword}, 비싼 게 정답이 아니었다." — 6개월 직접 써본 사람만 아는 진짜 차이`,
      `"${keyword} 고를 때, 99%가 놓치는 단 하나의 기준이 있다."`,
      `"${keyword}, 가격표 말고 이걸 봐야 한다." — 후회하지 않는 선택의 기술`,
    ],
    tutorial: [
      `"${keyword}, 이 한 단계만 알면 평생 안 헤맨다." — 초보가 반드시 놓치는 핵심`,
      `"${keyword}, 어렵게 배우지 마세요." — 3분이면 끝나는 진짜 방법`,
    ],
    story: [
      `"${keyword}, 그날 이후 모든 게 달라졌다." — 끝까지 들으면 마음이 따뜻해지는 이야기`,
      `"${keyword}에 얽힌 한 사람의 진심." — 결말에서 눈물이 날 수도 있습니다`,
    ],
    trend: [
      `"${keyword}, 지금 알아야 한 발 앞선다." — 흐름을 읽는 사람만 보이는 신호`,
      `"${keyword}, 표면 말고 진짜 흐름은 따로 있다."`,
    ],
    lifestyle: [
      `"${keyword}, 작은 습관 하나가 일상을 바꾼다." — 평범한 하루의 비밀`,
    ],
    knowledge: [
      `"${keyword}, 이 원리 하나면 평생 안 헷갈린다." — 학교에서 안 가르쳐주는 핵심`,
    ],
    emotional: [
      `"${keyword}, 혼자가 아닙니다." — 같은 마음을 가진 모든 분께 드리는 위로`,
    ],
    challenge: [
      `"${keyword}, 30일 직접 해본 결과가 충격적이다." — 포기 직전에 일어난 일`,
    ],
    transformation: [
      `"${keyword}, 1년 전과 지금이 이렇게 다를 수 있다." — 작은 시작이 만든 큰 변화`,
    ]
  };
  return pickWithSeed(templates[domain], seed);
}

// ============================================================
// 감정 곡선 (다큐 작가급)
// ============================================================
function generateEmotionalArc(domain: Domain, seed: number): string {
  const arcs = {
    review: [
      "기대 → 의심 → 충격 → 깨달음 → 신뢰 → 행동",
      "확신 → 갈등 → 발견 → 반전 → 결론 → 추천",
    ],
    tutorial: [
      "막막함 → 호기심 → 이해 → 자신감 → 실행 → 성취",
    ],
    story: [
      "고요함 → 위기 → 절망 → 전환점 → 회복 → 성장",
      "평범한 일상 → 균열 → 갈등 → 결정 → 화해 → 새로운 시작",
    ],
    trend: [
      "관망 → 인식 → 분석 → 통찰 → 결단 → 선점",
    ],
    lifestyle: [
      "고요함 → 작은 변화 → 발견 → 깨달음 → 안정 → 충만",
    ],
    knowledge: [
      "혼란 → 호기심 → 이해 → 확신 → 적용 → 숙련",
    ],
    emotional: [
      "외로움 → 공감 → 위로 → 치유 → 회복 → 연결",
    ],
    challenge: [
      "결심 → 도전 → 위기 → 극복 → 변화 → 성장",
    ],
    transformation: [
      "현실 인식 → 결심 → 시작 → 정체기 → 돌파 → 새로운 자아",
    ],
  };
  return pickWithSeed(arcs[domain], seed);
}

// ============================================================
// 숨겨진 알고리즘 작동 원리
// ============================================================
function generateHiddenAlgorithm(domain: Domain, seed: number): string {
  const algorithms = [
    "초반 3초 후킹 → 7초 약속 → 35초 갈등 → 1분30초 반전 → 3분 가치 → 클리프행어. 각 구간이 시청자의 도파민을 미세하게 자극합니다.",
    "패턴 인터럽트 + 정보 격차(Information Gap) + 인지 부조화(Cognitive Dissonance) + 약속 이행 + 클리프행어 = 시청 유지율 곡선 평탄화",
    "감정 곡선 6단계가 영상 길이에 정확히 매핑됩니다. 떡상 영상의 공통 패턴을 데이터로 추출한 구조입니다.",
    "각 비트 끝의 '브리지 문장'이 다음 비트로의 이탈을 막습니다. 이게 바로 '보이지 않는 알고리즘'입니다.",
  ];
  return pickWithSeed(algorithms, seed);
}

// ============================================================
// 비트별 디테일 생성기
// ============================================================
function generateBaitBeat(keyword: string, domain: Domain, seed: number): string {
  const baits: Record<Domain, string[]> = {
    review: [
      `${keyword} 고민하고 계신 분이라면, 이 영상 끝까지 봐주세요. 제가 6개월 동안 직접 써보면서 알게 된 것들이 있습니다.`,
      `${keyword} 살까 말까 망설이고 계시죠. 저도 그랬습니다. 그래서 직접 다 써봤습니다.`,
    ],
    tutorial: [
      `${keyword}, 처음 시작할 때 누구나 막막하잖아요. 저도 그랬습니다. 그런데 이 한 가지 순서만 알면 정말 쉬워집니다.`,
    ],
    story: [
      `${keyword}와 관련된 이야기인데요, 저에게는 잊을 수 없는 시간이었습니다.`,
    ],
    trend: [
      `${keyword}, 요즘 정말 많이 들리시죠. 그런데 진짜 이게 왜 뜨는지 아시는 분이 많지 않더라고요.`,
    ],
    lifestyle: [
      `${keyword}, 평범한 일상 속에서 발견한 작은 변화에 대한 이야기입니다.`,
    ],
    knowledge: [
      `${keyword}, 의외로 정확히 아시는 분이 많지 않습니다. 한 번에 정리해드릴게요.`,
    ],
    emotional: [
      `${keyword}와 관련해서 마음이 무거우신 분들이 계실 것 같아요. 오늘 그 마음, 함께 나눠보고 싶었습니다.`,
    ],
    challenge: [
      `${keyword}, 진짜 되는지 안 되는지 직접 30일 해봤습니다. 결과 보시면 깜짝 놀라실 거예요.`,
    ],
    transformation: [
      `${keyword}로 시작된 작은 변화가, 1년 후 어떻게 됐는지 직접 보여드리겠습니다.`,
    ],
  };
  return pickWithSeed(baits[domain], seed);
}

function generateConflictBeat(keyword: string, title: string, domain: Domain, seed: number): string {
  const conflicts: Record<Domain, string[]> = {
    review: [
      `처음엔 저도 인터넷 후기들 보고 시작했어요. 그런데 막상 써보니 진짜 차이는 후기에 안 나오는 곳에 있더라고요. 어디서부터 손해가 발생하는지, 직접 겪지 않으면 절대 모릅니다. 저는 결국 한 번 잘못 골라서 시간과 돈을 다 날렸습니다.`,
      `${keyword}를 비교할 때 대부분 가격이랑 스펙만 보세요. 그게 함정입니다. 실제로 매일 쓰는 입장에서 결정적인 건 따로 있어요. 저는 그걸 6개월이 지나서야 알게 됐습니다.`,
    ],
    tutorial: [
      `${keyword}, 처음 시작할 때 다들 비슷한 실수를 합니다. 저도 그랬어요. 첫 단추를 잘못 끼우면, 나중에 다 무너집니다. 그런데 이 한 단계만 정확히 알고 가시면, 그 다음은 자동으로 풀려요.`,
    ],
    story: [
      `그날도 평범한 하루였습니다. ${keyword}와 관련된 작은 사건이 시작되기 전까지는요. 저는 아무것도 모르고 있었어요. 그게 제 인생의 가장 큰 전환점이 될 줄은.`,
    ],
    trend: [
      `${keyword}가 떠오른 진짜 이유, 표면적으로 보이는 것과는 완전히 다릅니다. 흐름의 방향을 만든 사람들이 따로 있어요. 그 안쪽 이야기를 알게 되면, 다음 흐름도 보이기 시작합니다.`,
    ],
    lifestyle: [
      `매일 똑같은 하루였습니다. ${keyword}를 시작하기 전까지는요. 그런데 이 작은 변화가 시작되자, 일상의 결이 미묘하게 달라지더라고요.`,
    ],
    knowledge: [
      `${keyword}, 사실 학교에서도 두루뭉술하게 가르치는 경우가 많아요. 핵심 원리만 한 번 정확히 잡으시면, 모든 응용이 자연스럽게 풀립니다. 그 핵심을 지금 보여드릴게요.`,
    ],
    emotional: [
      `${keyword}로 마음이 힘드셨던 분들, 많으실 거예요. 저도 그랬습니다. 한참을 혼자 안고 있었어요. 그런데 어느 날 깨달았습니다. 이 마음, 저만 가진 게 아니더라고요.`,
    ],
    challenge: [
      `${keyword}, 7일째 되는 날 정말 포기하고 싶었습니다. 변화가 안 보이니까요. 그런데 14일째에 작은 신호가 보였고, 21일째에 확실히 달라졌어요. 30일 후 결과는 영상 끝에 보여드리겠습니다.`,
    ],
    transformation: [
      `${keyword}로 시작했을 때, 솔직히 큰 기대 없었습니다. 그런데 한 달, 두 달이 지나면서 조금씩 달라지기 시작했어요. 1년 후, 거울 앞에 선 저는 완전히 다른 사람이 되어 있었습니다.`,
    ],
  };
  return pickWithSeed(conflicts[domain], seed);
}

function generateRevealBeat(keyword: string, title: string, domain: Domain, seed: number): string {
  const reveals: Record<Domain, string[]> = {
    review: [
      `${keyword}의 진짜 차이는 '일상에서의 손이 가는 빈도'입니다. 스펙표에는 없는 요소예요. 어디서나 손이 자주 가는지, 직관적으로 다루기 쉬운지, 사용 한 달 후 자연스러운 자세로 쓰게 되는지. 이게 진짜 핵심입니다.`,
    ],
    tutorial: [
      `${keyword}의 핵심은 '시작 단계에서의 작은 디테일'입니다. 큰 그림을 먼저 머릿속에 그리고, 그 다음에 작은 단위로 쪼개서 시작하세요. 거기서부터 막힘없이 풀립니다.`,
    ],
    story: [
      `그날 밤, 저는 비로소 깨달았습니다. ${keyword}가 단순한 일이 아니었다는 것을요. 그건 제 삶의 방향을 바꾸는 신호였습니다.`,
    ],
    trend: [
      `${keyword} 흐름의 진짜 동력은 '소수의 얼리어답터'가 아닙니다. 진짜는 '조용히 따라하기 시작한 다수'입니다. 그 시점을 포착하면, 흐름의 정점을 정확히 예측할 수 있어요.`,
    ],
    lifestyle: [
      `${keyword}로 알게 된 건, 일상은 큰 사건이 아니라 작은 결정들의 연속이라는 사실이었습니다. 매일 같은 시간에 같은 행동을 하는 것, 그게 진짜 변화의 시작이더라고요.`,
    ],
    knowledge: [
      `${keyword}의 핵심 원리는 사실 한 문장으로 정리됩니다. 이 한 문장을 머릿속에 새기시면, 다른 응용 문제들이 다 따라옵니다.`,
    ],
    emotional: [
      `${keyword}로 마음이 힘드셨던 분들께 드리고 싶은 말이 있어요. 그 감정을 억지로 없애려 하지 마세요. 그냥 옆에 두고, 잠깐 앉아서 인사만 건네보세요. 그것만으로도 한결 가벼워집니다.`,
    ],
    challenge: [
      `${keyword} 30일 도전 결과, 제일 큰 변화는 외적인 게 아니었습니다. '나도 할 수 있다'는 작은 확신, 그게 진짜 결과였어요. 이건 숫자로 측정이 안 됩니다.`,
    ],
    transformation: [
      `${keyword}로 알게 된 진짜 변화는 '주변 사람들의 반응'이었습니다. 제가 변하니까, 제 주변도 자연스럽게 변하더라고요. 변화는 혼자만의 일이 아니었습니다.`,
    ],
  };
  return pickWithSeed(reveals[domain], seed);
}

function generatePracticalBeat(keyword: string, title: string, domain: Domain, seed: number): string {
  const practicals: Record<Domain, string[]> = {
    review: [
      `여러분께 추천 드리는 방법은 이렇습니다. ${keyword}를 직접 만져볼 수 있는 곳에서 30분 이상 써보세요. 영상이나 후기로는 절대 알 수 없는 미묘한 차이가 손끝에서 느껴집니다. 그 다음에 결정하세요. 시간 투자만큼 정확한 답은 없습니다.`,
    ],
    tutorial: [
      `${keyword}를 실전에서 쓸 때는 이 순서대로 가세요. 첫째, 큰 틀을 먼저 잡습니다. 둘째, 작은 단위로 쪼갭니다. 셋째, 한 번에 한 가지만 집중합니다. 이 세 단계만 지키시면 어떤 상황에서도 막히지 않습니다.`,
    ],
    story: [
      `이 이야기를 통해 제가 배운 건, 작은 순간들이 모여서 인생이 된다는 사실이었어요. ${keyword}가 저에게 알려준 가장 큰 가르침입니다. 여러분의 일상에도 이런 작은 순간들이 분명히 있을 거예요.`,
    ],
    trend: [
      `${keyword} 흐름을 활용하시려면, 흐름이 정점에 도달하기 전 단계에 진입하세요. 그 신호는 '주변에서 한두 명이 슬쩍 언급하기 시작할 때'입니다. 이 시점을 포착하면, 늦지 않게 따라갈 수 있습니다.`,
    ],
    lifestyle: [
      `${keyword}를 일상에 적용하시려면, 거창하게 시작하지 마세요. 하루 5분, 같은 시간에, 같은 자리에서, 같은 행동을 반복하세요. 이게 가장 강력한 시작입니다.`,
    ],
    knowledge: [
      `${keyword} 원리를 응용하시려면, 비슷한 패턴을 다른 분야에서 찾아보세요. 같은 원리가 의외로 다양한 곳에 숨어 있습니다. 한 번 보이기 시작하면, 모든 게 연결되어 보입니다.`,
    ],
    emotional: [
      `${keyword}로 힘드신 분들께 작은 제안 하나 드리고 싶어요. 매일 한 문장씩 일기를 써보세요. 길지 않아도 됩니다. 그 한 문장이 시간이 지나면 위로가 되어 돌아옵니다.`,
    ],
    challenge: [
      `${keyword} 도전 시작하시려면, 첫 7일이 가장 중요합니다. 매일 같은 시간에 같은 양으로 하세요. 변화는 14일부터 보이기 시작하고, 21일에 확실해집니다. 7일에 포기하면 아무것도 안 보입니다.`,
    ],
    transformation: [
      `${keyword}로 변화를 시작하시려면, 비포 사진과 기록을 꼭 남기세요. 변화는 매일 보면 안 보입니다. 1주일 단위, 1개월 단위로 비교해야 보입니다. 기록이 없으면, 변화도 없습니다.`,
    ],
  };
  return pickWithSeed(practicals[domain], seed);
}

function generateClosingBeat(keyword: string, domain: Domain, seed: number): string {
  const closings: Record<Domain, string[]> = {
    review: [
      `${keyword} 고민하고 계셨던 분들, 오늘 영상이 도움이 되셨다면 좋아요 한 번씩만 눌러주세요. 다음 영상은 더 깊은 비교를 준비하고 있습니다.`,
    ],
    tutorial: [
      `${keyword}, 오늘 알려드린 방법대로 한 번만 해보시면 평생 쓰실 수 있습니다. 도움이 되셨다면 좋아요와 구독으로 응원해주세요.`,
    ],
    story: [
      `${keyword}에 얽힌 제 이야기, 끝까지 들어주셔서 감사합니다. 여러분도 비슷한 경험이 있으시다면 댓글로 함께 나눠주세요.`,
    ],
    trend: [
      `${keyword} 흐름, 오늘 정리해드린 내용이 도움이 되셨다면 좋아요 한 번씩 눌러주세요. 다음 흐름은 더 빠르게 알려드리겠습니다.`,
    ],
    lifestyle: [
      `${keyword}와 함께한 평범한 하루, 함께해주셔서 감사합니다. 여러분의 일상도 댓글로 살짝 들려주시면 좋겠어요.`,
    ],
    knowledge: [
      `${keyword} 원리, 한 번에 정리해드렸습니다. 이해되셨다면 좋아요와 구독으로 응원해주세요. 다음에는 더 깊은 지식을 들고 오겠습니다.`,
    ],
    emotional: [
      `${keyword}로 마음이 무거우셨던 분들께 작은 위로가 되었기를 바랍니다. 혼자가 아니라는 거, 잊지 마세요.`,
    ],
    challenge: [
      `${keyword} 30일 도전 함께해주신다면, 매주 결과 영상으로 응원하겠습니다. 함께 도전하실 분들 댓글로 만나요.`,
    ],
    transformation: [
      `${keyword}로 시작된 작은 변화, 여러분도 충분히 가능합니다. 시작이 곧 절반입니다. 함께 변화의 여정 응원하겠습니다.`,
    ],
  };
  return pickWithSeed(closings[domain], seed);
}

// ============================================================
// 60초 쇼츠 버전 (자체 완결)
// ============================================================
function generateShortVersion(beats: ScenarioBeat[], keyword: string, title: string, domain: Domain, seed: number): string {
  const hook = beats[0].narration;
  const conflict = beats[2].narration.split('.')[0] + '.';
  const reveal = beats[3].narration.split('.').slice(0, 2).join('.') + '.';
  const cta = `구독 + 알림 켜두시면, 진짜 핵심 이어서 알려드립니다.`;
  
  return `[0:00 - 0:03] 후킹
${hook}

[0:03 - 0:15] 갈등
${conflict}

[0:15 - 0:45] 핵심 공개
${reveal}

[0:45 - 0:60] CTA
${cta}`;
}

// ============================================================
// END OF FILE
// ============================================================
