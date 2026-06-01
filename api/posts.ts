import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * BlogStudio → zip9.kr 게시물 발행 API (GitHub commit 중계 방식)
 *
 * 흐름:
 *   1. BlogStudio가 POST로 글 전송 (X-API-Key 인증)
 *   2. 본문 내용으로 카테고리 자동 분류
 *   3. 검증 (분량/이미지 prefix 중복/마크다운 잔재/목차 무결성)
 *   4. GitHub Contents API로 src/constants.ts에 Post 객체 추가 commit
 *   5. Vercel이 자동 빌드 → 정적 HTML 생성 → 사이트 반영
 *
 * 필요한 환경변수 (Vercel):
 *   - BLOG_STUDIO_API_KEY : BlogStudio가 보내는 X-API-Key와 대조할 비밀키
 *   - GITHUB_TOKEN        : zip9 저장소 Contents Read/Write 권한 PAT
 *   - GITHUB_OWNER        : GitHub 사용자명
 *   - GITHUB_REPO         : zip9 저장소명
 *   - GITHUB_BRANCH       : 기본 main (없으면 main)
 */

const VALID_CATEGORIES = ["청약-분양", "전월세", "이사-인테리어", "대출-금융"] as const;

// 카테고리 자동 분류용 키워드 사전
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "청약-분양": ["청약", "분양", "가점", "특별공급", "특공", "당첨", "분양가", "입주자", "전매", "공공분양", "민영", "무순위", "예비당첨", "분양권", "모집공고", "생애최초"],
  "전월세": ["전세", "월세", "임대차", "보증금", "임차", "임대인", "전입신고", "확정일자", "묵시적", "갱신", "전세사기", "깡통전세", "임차권", "대항력", "우선변제", "전세보증보험", "반전세", "계약갱신"],
  "이사-인테리어": ["이사", "인테리어", "셀프", "포장이사", "입주청소", "리모델링", "가구", "가전", "폐기물", "관리비", "수납", "도배", "장판", "조명", "플랜테리어", "집들이", "이삿짐"],
  "대출-금융": ["대출", "금리", "ltv", "dsr", "dti", "디딤돌", "보금자리", "신용", "한도", "상환", "원리금", "거치", "중도상환", "대환", "주담대", "보유세", "재산세", "종부세", "양도세", "세금", "절세", "취득세", "공시가격"],
};

function classifyCategory(title: string, body: string): string {
  const text = (title + " " + body).toLowerCase();
  const scores: Record<string, number> = {};
  for (const cat of VALID_CATEGORIES) {
    scores[cat] = 0;
    for (const kw of CATEGORY_KEYWORDS[cat]) {
      const titleHit = title.toLowerCase().includes(kw) ? 3 : 0;
      const re = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      const bodyHits = (text.match(re) || []).length;
      scores[cat] += titleHit + bodyHits;
    }
  }
  let best = "청약-분양";
  let bestScore = -1;
  for (const cat of VALID_CATEGORIES) {
    if (scores[cat] > bestScore) { bestScore = scores[cat]; best = cat; }
  }
  return best;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const ID_PREFIX: Record<string, string> = {
  "청약-분양": "sub", "전월세": "rent", "이사-인테리어": "move", "대출-금융": "finance",
};

function kstToday(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10);
}

function estimateReadTime(plainText: string): string {
  const minutes = Math.max(5, Math.round(plainText.length / 350));
  return `${minutes}분`;
}

function sanitizeContent(html: string): string {
  let out = html.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*\*/g, "").replace(/__/g, "");
  return out;
}

interface GitHubFile { content: string; sha: string; }

async function getConstantsFile(owner: string, repo: string, branch: string, token: string): Promise<GitHubFile> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/src/constants.ts?ref=${branch}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "zip9-blogstudio-relay",
    },
  });
  if (!res.ok) throw new Error(`GitHub read failed: ${res.status} ${await res.text()}`);
  const data: any = await res.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  return { content, sha: data.sha };
}

async function commitConstantsFile(
  owner: string, repo: string, branch: string, token: string,
  newContent: string, sha: string, message: string
): Promise<void> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/src/constants.ts`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "zip9-blogstudio-relay",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(newContent, "utf-8").toString("base64"),
      sha, branch,
    }),
  });
  if (!res.ok) throw new Error(`GitHub commit failed: ${res.status} ${await res.text()}`);
}

function usedImagePrefixes(src: string): Set<string> {
  const matches = src.match(/photo-(\d{10})/g) || [];
  return new Set(matches.map((m) => m.replace("photo-", "")));
}

function nextId(src: string, category: string): string {
  const prefix = ID_PREFIX[category];
  const re = new RegExp(`id:\\s*"${prefix}-(\\d+)"`, "g");
  let max = 0; let m;
  while ((m = re.exec(src)) !== null) {
    const n = parseInt(m[1], 10);
    if (n > max) max = n;
  }
  return `${prefix}-${max + 1}`;
}

const DISCLAIMER: Record<string, string> = {
  "청약-분양": "※ 본 글은 참고용입니다. 청약 자격·일정은 청약홈 공고를 반드시 다시 확인하세요.",
  "전월세": "※ 본 글은 일반적인 임대차 정보 안내입니다. 본인 케이스는 공인중개사·전문가와 상의하세요.",
  "이사-인테리어": "※ 위 내용은 참고용이에요. 견적·계약 시 표준계약서와 추가 비용 조건을 꼼꼼히 확인하세요.",
  "대출-금융": "※ 본 글은 금융·세제 관련 일반 안내입니다. 정확한 한도·금리는 거래 금융기관에서 확인하세요.",
};

const IMAGE_POOL: Record<string, string[]> = {
  "청약-분양": ["1545324418-cc1a3fa10c00", "1448630360428-65456885c650", "1486325212027-8081e485255e", "1554995207-c18c203602cb", "1502672260266-1c1ef2d93688"],
  "전월세": ["1493809842364-78817add7ffb", "1560448204-e02f11c3d0e2", "1484154218962-a197022b5858", "1505691938895-1758d7feb511", "1522708323590-d24dbb6b0267"],
  "이사-인테리어": ["1556228453-efd6c1ff04f6", "1558997519-83ea9252edf8", "1567016432779-094069958ea5", "1513161455079-7dc1de15ef3e", "1517705008128-361805f42e86"],
  "대출-금융": ["1554224155-8d04cb21cd6c", "1565514020179-026b92b84bb6", "1591033594798-33227a05780d", "1554224154-26032ffc0d07", "1579621970795-87facc2f976d"],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = req.headers["x-api-key"];
  const serverKey = process.env.BLOG_STUDIO_API_KEY;
  if (!serverKey) return res.status(500).json({ error: "Server API key not configured" });
  if (apiKey !== serverKey) return res.status(401).json({ error: "Unauthorized" });

  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) {
    return res.status(500).json({ error: "GitHub config missing (GITHUB_TOKEN/OWNER/REPO)" });
  }

  const { title, body, seoDescription } = req.body || {};
  if (!title || !body) {
    return res.status(400).json({ error: "Missing required fields: title, body" });
  }

  try {
    const { content: src, sha } = await getConstantsFile(owner, repo, branch, token);

    const category = classifyCategory(title, body);
    let content = sanitizeContent(body);
    const plain = stripHtml(content);
    const charCount = plain.length;

    if (/\*\*[^*\n]+\*\*/.test(content)) {
      return res.status(422).json({ error: "Markdown ** residue detected after sanitize" });
    }

    const tocLinks = new Set((content.match(/href="#(section\d+)"/g) || []).map((s) => s.replace(/href="#|"/g, "")));
    const tocSecs = new Set((content.match(/<h3 id="(section\d+)">/g) || []).map((s) => s.replace(/<h3 id="|">/g, "")));
    if (tocLinks.size > 0) {
      const a = [...tocLinks].sort().join(",");
      const b = [...tocSecs].sort().join(",");
      if (a !== b) return res.status(422).json({ error: "TOC anchors mismatch", tocLinks: [...tocLinks], tocSecs: [...tocSecs] });
    }

    const used = usedImagePrefixes(src);
    let chosenImage = "";
    for (const cand of IMAGE_POOL[category]) {
      if (!used.has(cand.slice(0, 10))) {
        chosenImage = `https://images.unsplash.com/photo-${cand}?auto=format&fit=crop&q=80&w=800`;
        break;
      }
    }
    if (!chosenImage) {
      return res.status(409).json({ error: "No unique image available; add more to IMAGE_POOL", category });
    }

    const id = nextId(src, category);
    const today = kstToday();
    const excerpt = (seoDescription || plain.slice(0, 150)).replace(/\\/g, "\\\\").replace(/`/g, "'").replace(/"/g, '\\"');
    const safeTitle = title.replace(/\\/g, "\\\\").replace(/`/g, "'").replace(/"/g, '\\"');

    if (!content.includes("최종 업데이트")) {
      content += `\n      <p class="text-sm text-gray-500 mt-8">${DISCLAIMER[category]}</p>\n      <p class="text-xs text-gray-400 mt-2">최종 업데이트: ${today}</p>`;
    }

    const readTime = estimateReadTime(plain);

    const postObject = `,
  {
    id: "${id}",
    title: "${safeTitle}",
    excerpt: "${excerpt}",
    content: \`${content}\`,
    category: "${category}",
    author: "하우징허브 편집팀",
    date: "${today}",
    image: "${chosenImage}",
    readTime: "${readTime}",
    hashtags: []
  }
];`;

    const newSrc = src.replace(/,?\s*\]\s*;\s*$/, postObject + "\n");
    if (newSrc === src) {
      return res.status(500).json({ error: "Failed to locate array terminator in constants.ts" });
    }

    await commitConstantsFile(owner, repo, branch, token, newSrc, sha, `Add post via BlogStudio: ${safeTitle} (${id})`);

    return res.status(200).json({
      success: true,
      id, category, charCount, image: chosenImage,
      warning: charCount < 3000 ? "본문이 3000자 미만입니다. 품질 보강을 권장합니다." : undefined,
      message: "GitHub commit 완료. Vercel 빌드 후 1~2분 내 사이트 반영됩니다.",
    });
  } catch (err: any) {
    console.error("BlogStudio relay error:", err);
    return res.status(500).json({ error: "Relay failed", detail: String(err?.message || err) });
  }
}
