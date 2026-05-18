/**
 * NuTube 시나리오 스타일 정의 + 무한 프롬프트 생성기 (v2.1)
 *
 * v2.1 변경:
 * - 모든 시나리오 tier: 'pro' → 'free' (AdSense 피벗, 전면 무료 개방)
 * - tier 필드는 호환성 위해 유지 (향후 재활용 가능)
 *
 * v2 변경(이전):
 * - 각 시나리오당 hook/opinion/fact 템플릿을 5배 확장 ({kw} 자리표시자 사용)
 * - generateInfiniteHooks/Opinions/CoreFacts(): 시드 기반 무한 변형
 * - 같은 시나리오 + 같은 키워드라도 매번 다른 프롬프트가 백엔드로 전달됨
 */

export type StyleId =
  | 'mystery'
  | 'spoiler'
  | 'origin'
  | 'whatif'
  | 'verify'
  | 'match'
  | 'flip'
  | 'classic'
  | 'threeact'
  | 'solution'
  | 'ranking'
  | 'docu';

export type StyleGroup = '경제·사회' | '정보·분석' | '범용';
export type StyleTier = 'free' | 'pro';

export interface ScenarioStyle {
  id: StyleId;
  emoji: string;
  name: string;
  flow: string;
  desc: string;
  retention: number;
  tier: StyleTier;
  group: StyleGroup;

  // 백엔드 프롬프트 주입용 (UI 표시용 기본값 — 무한 생성기는 별도 templates 사용)
  hook_triggers: string[];
  opinion_seeds: string[];
  core_facts: string[];
  sectionPattern: string[];

  // v2 NEW: 무한 변형용 템플릿
  hookTemplates: string[];
  opinionTemplates: string[];
  factTemplates: string[];
}

// ============================================================
// 공통 변형 풀 (무한 조합용)
// ============================================================
const TIME_PHRASES = [
  '지금', '오늘', '이번 주', '최근', '며칠 전부터',
  '바로 어제', '한 달 안에', '올해 들어', '요즘',
];

const EMPHASIS_WORDS = [
  '진짜', '솔직히', '단언컨대', '확실히', '제 경험상',
  '직접 분석한 결과', '데이터로 보면', '결정적으로',
];

const UNIVERSAL_HOOKS = [
  '{when} {kw} 보면서 깜짝 놀라실 거예요',
  '{kw}, {emph} 이게 맞나 싶었습니다',
  '"{kw}" 이 한 단어가 모든 걸 바꿨습니다',
  '{kw} 관련해서 꼭 짚고 갈 게 있어요',
  '{when} {kw} 흐름이 완전히 달라졌습니다',
  '{kw}, 알고 보면 정말 중요한 이슈입니다',
];

const UNIVERSAL_OPINIONS = [
  '핵심', '본질', '맥락', '의미', '전망', '시사점',
  '교훈', '경고', '기회', '리스크',
];

// ============================================================
// 시나리오 정의 — 12개 전부 FREE (AdSense 피벗)
// ============================================================
export const SCENARIOS: ScenarioStyle[] = [
  // ============== 경제·사회 ==============
  {
    id: 'mystery',
    emoji: '🔍',
    name: '미스터리 추적',
    flow: '의문 던지기 → 단서 공개 → 진실 폭로',
    desc: '호기심을 자극하는 질문으로 시작해 증거를 쌓아가며 진실에 도달하는 구조',
    retention: 95,
    tier: 'free',
    group: '경제·사회',
    hook_triggers: [
      '대부분이 모르는 진실이 있습니다',
      '지금부터 그 숨겨진 이야기를 공개합니다',
      '이 영상 끝까지 보셔야 진짜 답이 나옵니다',
    ],
    opinion_seeds: ['의문', '단서', '진실', '폭로', '숨겨진'],
    core_facts: ['의문 제시로 시작', '3~4개 단서 순차 공개', '마지막 반전 또는 진실 공개'],
    sectionPattern: ['의문 제시', '첫 단서', '두번째 단서', '반전', '진실 공개', '결론'],
    hookTemplates: [
      '{kw}에 대해 대부분이 모르는 진실이 있습니다',
      '{when} {kw}를 추적하다 충격적인 단서를 발견했습니다',
      '"{kw}"의 진짜 이야기, {emph} 처음 공개합니다',
      '{kw}, 왜 지금까지 아무도 말하지 않았을까요',
      '{kw} 뒤에 숨겨진 이야기를 끝까지 따라가 보겠습니다',
      '{kw}의 진실에 가까이 갈수록 의문이 늘어났습니다',
      '{when} 드러난 {kw} 관련 단서, {emph} 충격적이었습니다',
      '{kw}, 표면만 봐서는 절대 알 수 없는 이야기입니다',
      '{kw}와 관련된 결정적 단서 3가지를 차례로 공개합니다',
      '{when} {kw}에 어떤 일이 있었는지 정밀 추적해봤습니다',
      '"{kw}"라는 키워드 하나로 모든 게 연결되기 시작했습니다',
      '{kw} 관련해서 풀리지 않는 의문 한 가지가 있습니다',
      '{kw} 이슈의 진짜 발단, {emph} 다들 잘못 알고 있어요',
      '{kw}에 대한 공식 발표 뒤에 숨겨진 진실을 따라가봤습니다',
      '{when} {kw}를 둘러싸고 무슨 일이 벌어진 걸까요',
      '{kw}, 단서 하나하나가 의외의 결론을 가리키고 있었습니다',
      '{kw}의 출발점은 {emph} 우리가 생각한 곳이 아니었습니다',
      '{kw} 관련 자료를 모으다 보니 한 가지 패턴이 보였습니다',
    ],
    opinionTemplates: [
      '{kw}의 진실은 결국 단순한 의문 하나에서 시작됩니다',
      '{kw} 관련 단서들이 모두 한 방향을 가리키고 있다는 점이 결정적입니다',
      '{kw}의 폭로는 정보의 양이 아니라 연결의 문제였습니다',
      '{kw}, 진짜 답은 표면이 아니라 패턴 안에 숨어 있었습니다',
      '{kw} 사건은 의문 → 단서 → 반전의 전형적 흐름이었습니다',
      '{kw}는 끝까지 추적해야만 진짜 의미가 드러나는 주제입니다',
      '{kw}의 핵심은 무엇이 빠져 있는가를 보는 데서 시작됩니다',
      '{kw}, 결국 {emph} 한 줄로 정리됩니다 — "보이는 것이 전부가 아니다"',
    ],
    factTemplates: [
      '{kw}에 대한 의문 한 줄로 영상 시작',
      '{kw} 관련 단서를 시간 순서대로 3~4개 공개',
      '{kw}의 결정적 반전 또는 진실 공개로 클라이맥스',
      '{kw}, 기존 통념과 다른 결론을 명확히 제시',
      '{kw}의 향후 영향 또는 시사점으로 마무리',
    ],
  },
  {
    id: 'spoiler',
    emoji: '📖',
    name: '결론 먼저',
    flow: '충격 결말 먼저 → 되돌아 원인 추적',
    desc: '결론을 먼저 던져 호기심을 끌고, 어떻게 이렇게 됐는지 거꾸로 풀어가는 방식',
    retention: 88,
    tier: 'free',
    group: '경제·사회',
    hook_triggers: [
      '결론부터 말씀드리면',
      '먼저 답을 알려드릴게요',
      '왜 이런 결과가 나왔는지 지금부터 설명드립니다',
    ],
    opinion_seeds: ['결과', '원인', '과정', '되돌아보면'],
    core_facts: ['결론 선제시', '원인 역추적 3단계', '현재 시사점'],
    sectionPattern: ['충격 결말', '원인 역추적 1', '원인 2', '원인 3', '현재 의미', '결론 강조'],
    hookTemplates: [
      '{kw}, 결론부터 말씀드리면 {emph} 예상과 정반대였습니다',
      '먼저 답을 알려드릴게요 — {kw}는 {when} 결판났습니다',
      '{kw}의 결과를 미리 공개합니다, 이유는 영상 안에서 풀어드릴게요',
      '{when} {kw} 결말이 이미 정해졌습니다, 그 이유를 거꾸로 추적해봅시다',
      '{kw}의 결론: {emph} 우리가 알던 시나리오가 아닙니다',
      '결론 하나만 기억하세요 — {kw}는 이미 끝난 게임입니다',
      '{kw}, 핵심 결과를 먼저 보여드린 뒤 원인을 역추적하겠습니다',
      '"{kw}"의 최종 답은 단순합니다, 다만 그 과정이 {emph} 흥미진진합니다',
      '{kw} 결말을 한 문장으로 요약하면: 모두가 틀렸습니다',
      '{kw}의 결과는 이미 나왔습니다, {when} 다들 모르고 있을 뿐',
      '결과부터 말하면 {kw}는 향후 6개월 안에 큰 변화를 만들 겁니다',
      '{kw}, 답은 정해져 있었습니다, 다만 우리가 늦게 알았을 뿐',
      '{when} {kw} 발표가 모든 걸 결정했습니다',
      '{kw}의 종착점부터 보여드리고, 거기까지 어떻게 왔는지 풀어드릴게요',
      '결론: {kw}는 {emph} 더 이상 예전 방식이 통하지 않습니다',
      '{kw}, 미리 답을 알면 행동이 달라집니다',
    ],
    opinionTemplates: [
      '{kw}의 결과는 이미 정해져 있었지만 과정이 더 중요합니다',
      '{kw}, 결론을 먼저 알면 원인 분석이 명확해집니다',
      '{kw}는 결과보다 거기까지의 흐름이 본질입니다',
      '{kw}, 끝을 알고 나면 {emph} 모든 단계가 다르게 보입니다',
      '{kw}의 진짜 메시지는 결말이 아니라 "왜 그랬는가"에 있습니다',
      '{kw}, 같은 결과라도 원인을 알아야 다음을 준비할 수 있습니다',
    ],
    factTemplates: [
      '{kw}의 최종 결론을 영상 1분 안에 공개',
      '{kw}, 결말에 이른 원인 3가지를 역순으로 추적',
      '{kw}의 현재 시사점과 향후 행동 가이드 제시',
      '{kw}, 결론 → 원인 → 의미의 역방향 구조 유지',
    ],
  },
  {
    id: 'origin',
    emoji: '🏛️',
    name: '뿌리 찾기',
    flow: '현재 현상 → 역사 속 원인 → 오늘의 의미',
    desc: '지금 벌어지는 일의 역사적 뿌리를 추적해 깊이 있는 맥락을 제공',
    retention: 85,
    tier: 'free',
    group: '경제·사회',
    hook_triggers: [
      '이 현상의 뿌리는 10년 전으로 거슬러 올라갑니다',
      '처음 시작된 지점을 아는 사람은 많지 않습니다',
      '역사를 알면 미래가 보입니다',
    ],
    opinion_seeds: ['역사', '뿌리', '기원', '맥락', '흐름'],
    core_facts: ['현재 현상 제시', '시대별 추적', '오늘의 교훈'],
    sectionPattern: ['현상 제시', '기원', '전환점', '현재 영향', '미래 전망'],
    hookTemplates: [
      '{kw}의 뿌리는 10년 전으로 거슬러 올라갑니다',
      '{kw}가 처음 시작된 지점을 아는 사람은 많지 않습니다',
      '{kw}, 역사를 알면 {emph} 미래가 보입니다',
      '{kw}의 진짜 기원은 우리가 생각한 시점이 아닙니다',
      '{when} 보이는 {kw}는 사실 수십 년 전부터 준비되고 있었습니다',
      '{kw}가 어떻게 여기까지 왔는지 시대별로 추적해봅시다',
      '{kw}의 시작점에는 {emph} 지금과는 전혀 다른 풍경이 있었습니다',
      '"{kw}"라는 단어가 처음 등장한 순간으로 돌아가 보겠습니다',
      '{kw} 현상의 뿌리를 거슬러 올라가면 흥미로운 패턴이 보입니다',
      '{kw}는 어느 날 갑자기 나타난 게 아니었습니다',
      '{kw}의 역사를 알면 {when} 우리가 어디 서 있는지 보입니다',
      '{kw}, 30년 전 결정 하나가 {emph} 오늘을 만들었습니다',
      '{kw} 흐름을 시대별로 끊어보면 의외의 전환점이 드러납니다',
      '{kw}의 기원을 모르면 같은 실수를 반복할 수밖에 없습니다',
      '{when} 우리가 보는 {kw}는 길고 긴 흐름의 한 장면일 뿐입니다',
    ],
    opinionTemplates: [
      '{kw}의 뿌리를 알면 현재의 의미가 완전히 달라 보입니다',
      '{kw}, 역사 없이는 미래를 예측할 수 없습니다',
      '{kw}의 흐름은 결국 {emph} 반복되는 패턴 안에 있습니다',
      '{kw}, 기원을 알면 다음 사이클이 보입니다',
      '{kw}의 맥락을 놓치면 결과 해석이 모두 어긋납니다',
    ],
    factTemplates: [
      '{kw}의 현재 모습을 먼저 짧게 제시',
      '{kw}의 시대별 발전 과정을 3~4단계로 추적',
      '{kw}, 결정적 전환점 1~2개를 강조',
      '{kw}의 오늘 의미와 향후 5~10년 전망 제시',
    ],
  },
  {
    id: 'whatif',
    emoji: '🔮',
    name: '만약에',
    flow: '"~한다면?" 상상 → 결과 시뮬레이션',
    desc: '가상의 상황을 가정해 구체적 결과를 시뮬레이션하는 몰입형 구조',
    retention: 82,
    tier: 'free',
    group: '경제·사회',
    hook_triggers: [
      '만약 이런 일이 일어난다면',
      '이 상황을 가정해봅시다',
      '상상만 해도 놀라운 결과가 나옵니다',
    ],
    opinion_seeds: ['만약', '가정', '시나리오', '결과', '시뮬레이션'],
    core_facts: ['가정 제시', '시나리오 3종', '최종 결과 분석'],
    sectionPattern: ['가정 설정', '낙관 시나리오', '비관 시나리오', '현실 시나리오', '결론'],
    hookTemplates: [
      '만약 {when} {kw}가 현실이 된다면 어떻게 될까요',
      '{kw}, 이 상황을 가정해봅시다 — 결과는 {emph} 예상 밖입니다',
      '{kw} 시나리오를 3가지로 시뮬레이션해봤습니다',
      '"만약 {kw}라면?" — 이 질문 하나가 모든 걸 바꿉니다',
      '{kw}가 일어난다면 우리 일상은 어떻게 달라질까요',
      '{kw}, 낙관/비관/현실 3가지 시나리오를 비교해보겠습니다',
      '{when}부터 1년 후 {kw}는 어떤 모습일지 그려봅시다',
      '{kw}의 가능한 미래, {emph} 솔직하게 짚어봅니다',
      '{kw}가 최악의 방향으로 흐른다면? 정직한 시뮬레이션입니다',
      '{kw}가 최선의 방향이라면? 그 결과를 따라가봅시다',
      '{kw}, 가정만 바꿔도 결론이 완전히 달라집니다',
      '{when} {kw}의 변수를 하나만 바꾸면 어떤 일이 벌어질까요',
      '{kw}, 시나리오 시뮬레이션으로 미래를 미리 살펴봅니다',
      '{kw} 가설 3가지를 비교해 가장 가능성 높은 미래를 골라봅시다',
    ],
    opinionTemplates: [
      '{kw}, 시나리오를 그려봐야 결정의 무게가 보입니다',
      '{kw}의 미래는 한 가지가 아니라 가능성의 묶음입니다',
      '{kw}, 가정해보면 {emph} 행동의 우선순위가 달라집니다',
      '{kw}의 변수를 안다는 건 미래를 통제할 수 있다는 뜻입니다',
      '{kw}, 시뮬레이션은 단순한 상상이 아니라 전략의 도구입니다',
    ],
    factTemplates: [
      '{kw}에 대한 핵심 가정을 명확히 설정',
      '{kw}의 낙관/비관/현실 3가지 시나리오 비교',
      '{kw}의 가장 가능성 높은 결과와 그 근거 제시',
      '{kw}, 각 시나리오에서의 행동 가이드 제시',
    ],
  },

  // ============== 정보·분석 ==============
  {
    id: 'verify',
    emoji: '🧪',
    name: '직접 확인',
    flow: '주장 제시 → 실제 검증 → 결론',
    desc: '떠도는 주장을 실제 데이터·사례로 검증하는 팩트체크 스타일',
    retention: 70,
    tier: 'free',
    group: '정보·분석',
    hook_triggers: [
      '이 주장, 정말 사실일까요',
      '직접 확인해봤습니다',
      '데이터로 검증한 결과',
    ],
    opinion_seeds: ['검증', '팩트체크', '데이터', '사실', '확인'],
    core_facts: ['주장 소개', '데이터 3종 검증', '사실/거짓 판정'],
    sectionPattern: ['주장 소개', '검증 1', '검증 2', '검증 3', '결론'],
    hookTemplates: [
      '{kw}에 대한 이 주장, {emph} 정말 사실일까요',
      '{kw} 관련 소문, 직접 데이터로 검증해봤습니다',
      '{when} 떠도는 {kw} 이야기, 팩트체크 들어갑니다',
      '"{kw}"라는 주장, 검증 결과가 흥미롭습니다',
      '{kw} 관련 통계 3종을 교차 검증한 결과를 공유합니다',
      '{kw}, 흔히 알려진 내용이 진짜 맞는지 확인해봅시다',
      '{kw} 관련 SNS 주장, 실제 데이터와 얼마나 일치할까요',
      '{kw}, {emph} 데이터로 보면 이야기가 완전히 다릅니다',
      '{kw}의 진위를 가리기 위해 1차 자료까지 추적해봤습니다',
      '{kw}, 권위 있는 소스 3곳의 데이터를 비교해봤습니다',
      '{when} 화제가 된 {kw} 주장, 사실인지 거짓인지 판정합니다',
      '{kw}, 통념이 사실과 얼마나 어긋나는지 확인해봅니다',
      '{kw}에 대한 공식 통계와 일반 인식의 차이를 분석합니다',
      '{kw} 관련 자료 검증 결과, {emph} 의외의 결론에 도달했습니다',
    ],
    opinionTemplates: [
      '{kw}, 데이터 없는 주장은 의견에 불과합니다',
      '{kw} 검증의 핵심은 1차 자료의 신뢰도입니다',
      '{kw}, 같은 통계라도 해석에 따라 결론이 갈립니다',
      '{kw}의 사실 여부는 {emph} 출처를 따라가면 명확해집니다',
      '{kw}, 검증되지 않은 정보는 {emph} 해를 끼칠 수 있습니다',
    ],
    factTemplates: [
      '{kw} 관련 검증할 주장을 명확히 정리',
      '{kw}의 신뢰할 수 있는 데이터 3종 제시',
      '{kw}, 각 데이터로 사실/거짓을 단계별 판정',
      '{kw}, 최종 판정과 그 근거를 정리',
    ],
  },
  {
    id: 'match',
    emoji: '⚖️',
    name: '맞대결',
    flow: 'A vs B 라운드별 항목 비교',
    desc: '두 대상을 여러 기준으로 라운드별로 비교해 승자를 가리는 토너먼트 형식',
    retention: 68,
    tier: 'free',
    group: '정보·분석',
    hook_triggers: [
      '오늘은 두 가지를 직접 비교해보겠습니다',
      '라운드별로 승자를 가려봅시다',
      '결국 어느 쪽이 더 나을까요',
    ],
    opinion_seeds: ['비교', '대결', '승부', '라운드', '승자'],
    core_facts: ['A와 B 소개', '4~5라운드 항목 비교', '종합 승자'],
    sectionPattern: ['대상 소개', '라운드 1', '라운드 2', '라운드 3', '라운드 4', '종합 승자'],
    hookTemplates: [
      '{kw}, {when} 가장 많이 비교되는 두 가지를 끝까지 붙여봤습니다',
      '{kw} 관련 양대 후보, {emph} 라운드별 승자를 가려봅시다',
      '{kw}, A vs B 결국 어느 쪽이 더 나을까요',
      '{kw}, 5라운드 비교 결과 {emph} 의외의 승자가 나왔습니다',
      '{kw}의 대표 두 가지를 6가지 기준으로 정밀 비교했습니다',
      '"{kw}" 선택의 갈림길, 비교표로 한방에 정리해드립니다',
      '{kw}, 두 후보의 장단점을 라운드별로 펼쳐봅니다',
      '{kw} 토너먼트, 우승자는 누구일지 끝까지 보세요',
      '{when} {kw} 양강 구도, 데이터로 승부 가립니다',
      '{kw}, 같은 기준으로 비교하면 답이 명확해집니다',
      '{kw}의 두 후보를 가격/성능/지속성으로 비교합니다',
      '{kw}, {emph} 어느 쪽이 더 합리적인지 라운드별로 판정',
    ],
    opinionTemplates: [
      '{kw}, 비교의 기준이 결국 결론을 결정합니다',
      '{kw}의 승자는 {emph} 사용 목적에 따라 갈립니다',
      '{kw}, 두 후보 모두 장단이 분명해 절대 승자는 없습니다',
      '{kw}의 비교는 점수보다 가중치가 더 중요합니다',
    ],
    factTemplates: [
      '{kw}, 비교할 두 대상 A와 B를 동등하게 소개',
      '{kw}의 핵심 비교 기준을 4~5개 명시',
      '{kw}, 각 라운드의 승자와 그 근거를 짧게 정리',
      '{kw}의 종합 승자를 점수와 함께 발표',
      '{kw}, 사용자별 추천(어느 쪽이 어떤 사람에게 맞는지) 제시',
    ],
  },
  {
    id: 'flip',
    emoji: '🔄',
    name: '상식 깨기',
    flow: '당연한 통념 → 의심 → 반전',
    desc: '누구나 당연하다 믿는 것을 뒤집는 역발상 구조. 강력한 후킹',
    retention: 65,
    tier: 'free',
    group: '정보·분석',
    hook_triggers: [
      '당신이 알고 있던 상식은 틀렸습니다',
      '이건 완전히 반대입니다',
      '진짜는 이렇습니다',
    ],
    opinion_seeds: ['통념', '반전', '역발상', '오해', '진짜'],
    core_facts: ['통념 소개', '의심의 근거', '반전 제시', '재해석'],
    sectionPattern: ['통념 제시', '의심의 시작', '반대 증거', '반전', '새 관점'],
    hookTemplates: [
      '{kw}에 대해 알고 있던 상식, {emph} 사실 틀렸습니다',
      '{kw}는 통념과 정반대입니다, 그 이유를 설명드립니다',
      '"{kw}"에 대한 오해, {when} 명확히 정리합니다',
      '{kw}, 다들 당연하다고 믿는 것이 가장 위험합니다',
      '{kw}의 진짜 모습은 {emph} 우리가 알던 것과 정반대입니다',
      '{kw} 통념이 무너진 결정적 증거 3가지를 공개합니다',
      '{kw}, 상식의 빈틈을 데이터로 짚어봤습니다',
      '"{kw}는 OO다"라는 말, 절반은 틀렸습니다',
      '{kw}, 뒤집어 보면 새로운 기회가 보입니다',
      '{kw}의 역설 — 상식이 가장 큰 함정이었습니다',
      '{kw}, {emph} 한 가지 사실만 알면 모든 게 다르게 보입니다',
      '{kw}의 통념을 깨는 1차 자료를 가져왔습니다',
    ],
    opinionTemplates: [
      '{kw}, 통념을 의심하는 데서 진짜 통찰이 시작됩니다',
      '{kw}의 반전은 결국 데이터가 알려줍니다',
      '{kw}, 모두가 같은 답을 한다면 한 번 더 의심해봐야 합니다',
      '{kw}의 진짜 가치는 {emph} 통념 너머에 있습니다',
    ],
    factTemplates: [
      '{kw}에 대한 일반적 통념을 짧게 정리',
      '{kw}, 통념이 흔들리는 결정적 증거 1~2개 제시',
      '{kw}의 반전된 사실 또는 새로운 해석 공개',
      '{kw}, 새로운 관점에서의 행동 제안',
    ],
  },

  // ============== 범용 ==============
  {
    id: 'classic',
    emoji: '📐',
    name: '정석 구성',
    flow: '질문 → 설명 → 반전 → 정리',
    desc: '안정적인 기승전결 구조. 어떤 주제에도 무난하게 맞는 클래식',
    retention: 60,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '오늘은 이 질문에 답해드립니다',
      '순서대로 알려드릴게요',
      '핵심만 정리해드립니다',
    ],
    opinion_seeds: ['설명', '정리', '핵심', '순서'],
    core_facts: ['질문 제기', '배경 설명', '반전 또는 중요 포인트', '요약 정리'],
    sectionPattern: ['도입 질문', '설명 1', '설명 2', '반전 포인트', '정리'],
    hookTemplates: [
      '{when} {kw}에 대한 가장 많은 질문, 한방에 답해드립니다',
      '{kw}, 핵심만 5분 안에 정리해드릴게요',
      '"{kw}"가 뭔지 처음부터 차근차근 설명드립니다',
      '{kw}, {emph} 알아두면 평생 써먹는 정보입니다',
      '{kw} 관련해서 꼭 알아야 할 4가지를 순서대로 짚어봅니다',
      '{kw}, 한 번에 이해되도록 구성해봤습니다',
      '{kw}의 핵심 포인트를 정석대로 정리해보겠습니다',
      '{kw}에 대한 가장 흔한 질문 3개에 답합니다',
      '{kw}, 처음 접하는 분도 끝까지 따라올 수 있게 풀어드립니다',
      '{kw} 입문자를 위한 정석 가이드입니다',
      '{kw}, 기본부터 응용까지 단계적으로 알려드립니다',
    ],
    opinionTemplates: [
      '{kw}, 기본기를 다져야 응용이 됩니다',
      '{kw}의 핵심은 {emph} 단순함에 있습니다',
      '{kw}, 정석을 알면 변형을 알아볼 수 있습니다',
      '{kw}, 체계적으로 정리하는 사람만이 활용할 수 있습니다',
    ],
    factTemplates: [
      '{kw}에 대한 핵심 질문을 영상 시작에 명시',
      '{kw}의 배경을 2~3단락으로 설명',
      '{kw}, 가장 중요한 포인트나 반전 1가지 제시',
      '{kw}, 핵심 3줄 요약으로 마무리',
    ],
  },
  {
    id: 'threeact',
    emoji: '🎭',
    name: '3단 고조',
    flow: '도입 20% → 심화 60% → 절정 20%',
    desc: '영화 같은 기승전결. 중간 심화를 길게 잡고 절정으로 몰아가는 구성',
    retention: 58,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '이야기를 들려드립니다',
      '지금부터 본격적으로',
      '마지막에 결정적 순간이 옵니다',
    ],
    opinion_seeds: ['도입', '전개', '절정', '해결'],
    core_facts: ['짧은 도입', '긴 심화(3개 블록)', '강한 절정'],
    sectionPattern: ['도입', '심화 1', '심화 2', '심화 3', '절정', '여운'],
    hookTemplates: [
      '{kw}에 얽힌 한 편의 이야기를 들려드립니다',
      '{kw}, {emph} 마지막 1분에 결정적 순간이 옵니다',
      '{when} {kw}를 중심으로 펼쳐진 흐름을 따라가봅시다',
      '{kw}의 도입 - 전개 - 절정, 한 편의 영화처럼 풀어드립니다',
      '"{kw}"라는 주제 하나로 6분짜리 이야기를 만들었습니다',
      '{kw}, 천천히 시작해 마지막에 강하게 끝납니다',
      '{kw}의 핵심 순간은 영상 후반부에 있습니다',
      '{kw}, 이야기의 호흡을 따라 끝까지 와보세요',
    ],
    opinionTemplates: [
      '{kw}, 모든 좋은 이야기는 절정이 강해야 합니다',
      '{kw}의 의미는 결국 {emph} 절정에서 한 줄로 정리됩니다',
      '{kw}, 천천히 빌드업해야 메시지가 살아납니다',
    ],
    factTemplates: [
      '{kw}, 짧고 강한 도입(20%)으로 시작',
      '{kw}의 심화 내용을 3개 블록(60%)으로 깊게 전개',
      '{kw}의 절정(20%)에서 핵심 메시지를 강하게 전달',
      '{kw}, 짧은 여운으로 마무리',
    ],
  },
  {
    id: 'solution',
    emoji: '💡',
    name: '해법 찾기',
    flow: '고민 → 원인 → 해법 → 실천법',
    desc: '실용적 문제 해결. 고민 공감 → 원인 분석 → 구체적 액션 플랜',
    retention: 55,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '이 고민, 해결책이 있습니다',
      '당장 실천할 수 있는 방법입니다',
      '3가지 해법을 알려드릴게요',
    ],
    opinion_seeds: ['고민', '원인', '해법', '실천', '방법'],
    core_facts: ['고민 공감', '원인 3가지', '해법 3가지', '실천 단계'],
    sectionPattern: ['고민 공감', '원인 분석', '해법 1', '해법 2', '해법 3', '실천법'],
    hookTemplates: [
      '{kw} 때문에 고민이신가요? 해결책 3가지를 정리했습니다',
      '{kw}, 당장 {emph} 오늘부터 실천할 수 있는 방법입니다',
      '{kw} 문제, 원인부터 해법까지 한 번에 풀어드립니다',
      '{when} {kw}로 막막하신 분들께 — 구체적 액션 가이드입니다',
      '"{kw}" 이슈, 작은 행동 하나로 해결할 수 있습니다',
      '{kw}, 3단계 해법을 따라하면 변화가 보입니다',
      '{kw} 고민의 근본 원인부터 파헤쳐봅시다',
      '{kw}, {emph} 가장 실용적인 해법만 골라드립니다',
      '{kw}, 1주일 안에 효과 보는 방법을 정리했습니다',
      '{kw} 문제, 비용 안 드는 해법부터 알려드립니다',
      '{kw}, 매일 5분 투자로 해결할 수 있습니다',
    ],
    opinionTemplates: [
      '{kw}, 문제 정의가 명확해야 해법이 보입니다',
      '{kw}의 진짜 해법은 {emph} 단순한 행동의 반복에 있습니다',
      '{kw}, 큰 변화보다 작은 실천이 효과적입니다',
      '{kw}, 원인을 알면 해법은 자연스럽게 따라옵니다',
    ],
    factTemplates: [
      '{kw} 관련 일반적인 고민에 공감 표시',
      '{kw} 문제의 핵심 원인 2~3가지 분석',
      '{kw}의 구체적 해법 3가지 제시',
      '{kw}, 오늘부터 실천할 수 있는 단계별 가이드',
    ],
  },
  {
    id: 'ranking',
    emoji: '📊',
    name: '랭킹 역순',
    flow: '5위부터 1위까지 공개',
    desc: '순위를 낮은 쪽부터 하나씩 공개하며 1위까지 끌고 가는 중독성 강한 구조',
    retention: 50,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '오늘은 TOP 5를 공개합니다',
      '5위부터 시작합니다',
      '1위는 끝까지 보셔야 압니다',
    ],
    opinion_seeds: ['순위', '랭킹', '1위', 'TOP'],
    core_facts: ['주제 소개', '5위 공개', '4위', '3위', '2위', '1위 반전'],
    sectionPattern: ['도입', '5위', '4위', '3위', '2위', '1위'],
    hookTemplates: [
      '{kw} TOP 5를 5위부터 차례로 공개합니다',
      '{kw}, 1위는 {emph} 끝까지 보셔야 알 수 있습니다',
      '{when} 가장 화제인 {kw} TOP 5 발표',
      '{kw} 랭킹, 의외의 1위가 등장합니다',
      '{kw} 베스트 5, 5위부터 1위까지 한 번에 정리',
      '"{kw}" 분야의 핵심 5가지, 순위로 보여드립니다',
      '{kw}, TOP 5 안에 무엇이 들어 있는지 보세요',
      '{kw}, 5위와 1위의 격차가 {emph} 충격적입니다',
      '{kw} 순위표, 데이터 기반으로 만들어봤습니다',
    ],
    opinionTemplates: [
      '{kw}, 순위 자체보다 그 기준이 더 중요합니다',
      '{kw}의 1위가 {emph} 정답은 아닙니다 — 자신에게 맞는 걸 골라야 합니다',
      '{kw}, 랭킹을 알면 선택이 빨라집니다',
    ],
    factTemplates: [
      '{kw}, 랭킹의 기준을 영상 초반에 명시',
      '{kw} TOP 5를 5위 → 1위 순서로 공개',
      '{kw}, 각 순위의 강점과 한계 짧게 설명',
      '{kw}의 1위 발표 시 강한 강조',
    ],
  },
  {
    id: 'docu',
    emoji: '🎬',
    name: '다큐 스타일',
    flow: '내레이션 + 자료 + 인터뷰 인용',
    desc: 'BBC/넷플릭스 스타일의 차분하고 깊이 있는 다큐멘터리 구조',
    retention: 48,
    tier: 'free',
    group: '범용',
    hook_triggers: [
      '그 시작은 이러했습니다',
      '전문가들은 말합니다',
      '진실은 우리가 생각한 것보다 복잡합니다',
    ],
    opinion_seeds: ['다큐', '내레이션', '취재', '전문가', '기록'],
    core_facts: ['차분한 도입', '취재 자료 3개', '전문가 인용', '종합 결론'],
    sectionPattern: ['도입 내레이션', '배경 자료', '심층 사례', '전문가 의견', '종합'],
    hookTemplates: [
      '{kw}, 그 시작은 이러했습니다',
      '{kw}에 대해 전문가들은 이렇게 말합니다',
      '{kw}의 진실은 {emph} 우리가 생각한 것보다 훨씬 복잡합니다',
      '{when} 취재한 {kw}의 현장을 그대로 전해드립니다',
      '{kw}, 차분하게 한 걸음씩 들여다봅시다',
      '{kw}의 깊은 이야기, 짧은 다큐로 풀어봤습니다',
      '"{kw}"라는 주제, BBC식 호흡으로 정리합니다',
      '{kw}, 자료와 인터뷰가 말하는 진짜 이야기입니다',
      '{kw}의 본질을 차분하게 추적해봅시다',
    ],
    opinionTemplates: [
      '{kw}, 깊이 있는 이해는 {emph} 시간을 들여야 가능합니다',
      '{kw}의 진실은 한두 마디로 요약되지 않습니다',
      '{kw}, 다양한 관점이 모여야 그림이 완성됩니다',
    ],
    factTemplates: [
      '{kw}, 차분한 내레이션으로 도입',
      '{kw} 관련 1차 자료 또는 통계 2~3개 제시',
      '{kw}의 심층 사례 또는 전문가 인용 포함',
      '{kw}, 균형 잡힌 종합 결론으로 마무리',
    ],
  },
];

// ============================================================
// 조회 유틸
// ============================================================
export function getScenarioById(id: string | undefined | null): ScenarioStyle | null {
  if (!id) return null;
  return SCENARIOS.find((s) => s.id === id) || null;
}

export function getScenariosByGroup(group: StyleGroup): ScenarioStyle[] {
  return SCENARIOS.filter((s) => s.group === group);
}

// ============================================================
// 시드 기반 의사 난수 (Mulberry32)
// ============================================================
function makeRng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) | 0;
  return h >>> 0;
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  if (arr.length === 0) return [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function fillTemplate(tpl: string, kw: string, rng: () => number): string {
  const when = TIME_PHRASES[Math.floor(rng() * TIME_PHRASES.length)];
  const emph = EMPHASIS_WORDS[Math.floor(rng() * EMPHASIS_WORDS.length)];
  return tpl
    .replace(/\{kw\}/g, kw)
    .replace(/\{when\}/g, when)
    .replace(/\{emph\}/g, emph);
}

// ============================================================
// 무한 프롬프트 생성기
// ============================================================
export function generateInfiniteHooks(
  style: ScenarioStyle | null | undefined,
  keyword: string,
  count = 8,
  seed?: number,
): string[] {
  const baseSeed = seed ?? (Date.now() ^ hashString(keyword));
  const rng = makeRng(baseSeed);

  const styleTemplates = style?.hookTemplates ?? [];
  const styleCount = Math.max(1, Math.ceil(count * 0.8));
  const universalCount = count - styleCount;

  const fromStyle = pickN(styleTemplates.length > 0 ? styleTemplates : UNIVERSAL_HOOKS, styleCount, rng);
  const fromUniversal = pickN(UNIVERSAL_HOOKS, universalCount, rng);

  const out = [...fromStyle, ...fromUniversal].map((tpl) => fillTemplate(tpl, keyword, rng));
  return Array.from(new Set(out)).slice(0, count);
}

export function generateInfiniteOpinions(
  style: ScenarioStyle | null | undefined,
  keyword: string,
  count = 6,
  seed?: number,
): string[] {
  const baseSeed = (seed ?? Date.now()) ^ hashString(keyword) ^ 0x9E3779B9;
  const rng = makeRng(baseSeed);

  const styleSeedWords = style?.opinion_seeds ?? [];
  const styleTemplates = style?.opinionTemplates ?? [];

  const tplCount = Math.max(1, Math.ceil(count * 0.7));
  const wordCount = count - tplCount;

  const fromTpl = pickN(styleTemplates.length > 0 ? styleTemplates : UNIVERSAL_HOOKS, tplCount, rng)
    .map((t) => fillTemplate(t, keyword, rng));

  const wordPool = [...styleSeedWords, ...UNIVERSAL_OPINIONS];
  const fromWords = pickN(wordPool, wordCount, rng).map((w) => `${keyword}의 ${w}`);

  return Array.from(new Set([...fromTpl, ...fromWords])).slice(0, count);
}

export function generateInfiniteCoreFacts(
  style: ScenarioStyle | null | undefined,
  keyword: string,
  count = 5,
  seed?: number,
): string[] {
  const baseSeed = (seed ?? Date.now()) ^ hashString(keyword) ^ 0x517CC1B7;
  const rng = makeRng(baseSeed);

  const tpls = style?.factTemplates ?? [];
  if (tpls.length === 0) {
    return (style?.core_facts ?? []).slice(0, count).map((f) => `${keyword}: ${f}`);
  }
  const picked = pickN(tpls, count, rng);
  return picked.map((t) => fillTemplate(t, keyword, rng));
}

export function generateScenarioPrompts(
  style: ScenarioStyle | null | undefined,
  keyword: string,
  seed?: number,
) {
  return {
    hook_triggers: generateInfiniteHooks(style, keyword, 8, seed),
    opinion_seeds: generateInfiniteOpinions(style, keyword, 6, seed),
    core_facts: generateInfiniteCoreFacts(style, keyword, 5, seed),
  };
}

export function pickRecommendedScenarios(seed: string = ''): ScenarioStyle[] {
  const seedNum = (seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) + Date.now()) | 0;
  const rng = makeRng(seedNum);
  return pickN(SCENARIOS, 3, rng);
}
