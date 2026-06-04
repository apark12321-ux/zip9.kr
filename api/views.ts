import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * 조회수 카운터 API (전체 방문자 합산)
 *
 * Upstash Redis REST API를 외부 패키지 없이 fetch로 직접 호출.
 *
 * 사용:
 *   GET  /api/views?id=sub-14        → { id, views }            (조회수 읽기, 증가 없음)
 *   GET  /api/views?ids=sub-14,rent-1 → { views: { ... } }       (여러 개 한 번에)
 *   POST /api/views  body: { id: "sub-14" } → { id, views }      (조회수 1 증가 후 반환)
 *
 * 필요한 환경변수 (Vercel):
 *   - UPSTASH_REDIS_REST_URL    : Upstash Redis REST URL
 *   - UPSTASH_REDIS_REST_TOKEN  : Upstash Redis REST 토큰
 *
 * 키 형식: views:{postId}  (예: views:sub-14)
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// Upstash REST 호출: 예) ["INCR","views:sub-14"]
async function redis(command: string[]): Promise<any> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    throw new Error("Upstash 환경변수가 설정되지 않았습니다.");
  }
  const res = await fetch(`${REDIS_URL}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${REDIS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Redis 오류: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.result;
}

// 여러 키를 한 번에 읽기 (MGET)
async function redisMget(keys: string[]): Promise<(string | null)[]> {
  if (keys.length === 0) return [];
  const result = await redis(["MGET", ...keys]);
  return Array.isArray(result) ? result : [];
}

const ID_RE = /^[a-z]+-\d+$/; // sub-14, rent-1 등 허용 형식만

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // 캐시 방지 (항상 최신 조회수)
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!REDIS_URL || !REDIS_TOKEN) {
    return res.status(500).json({ error: "Counter not configured (Upstash env missing)" });
  }

  try {
    // ── POST: 조회수 1 증가 ──
    if (req.method === "POST") {
      const id = (req.body && req.body.id) || "";
      if (!ID_RE.test(id)) {
        return res.status(400).json({ error: "Invalid id" });
      }
      const views = await redis(["INCR", `views:${id}`]);
      return res.status(200).json({ id, views: Number(views) || 0 });
    }

    // ── GET: 조회수 읽기 (증가 없음) ──
    if (req.method === "GET") {
      const { id, ids } = req.query;

      // 여러 개 한 번에
      if (typeof ids === "string" && ids.trim()) {
        const idList = ids.split(",").map(s => s.trim()).filter(s => ID_RE.test(s));
        if (idList.length === 0) return res.status(200).json({ views: {} });
        const keys = idList.map(i => `views:${i}`);
        const vals = await redisMget(keys);
        const views: Record<string, number> = {};
        idList.forEach((i, idx) => { views[i] = Number(vals[idx]) || 0; });
        return res.status(200).json({ views });
      }

      // 단일
      if (typeof id === "string" && ID_RE.test(id)) {
        const v = await redis(["GET", `views:${id}`]);
        return res.status(200).json({ id, views: Number(v) || 0 });
      }

      return res.status(400).json({ error: "Provide id or ids" });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("views API error:", err);
    return res.status(500).json({ error: "Counter failed", detail: String(err?.message || err) });
  }
}
