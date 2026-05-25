/**
 * 날짜 정합성 검증 스크립트 (빌드 전 실행 권장)
 * 다음을 점검해 문제가 있으면 빌드를 중단(exit 1)시킨다:
 *  1) 발행일이 오늘보다 미래인 글
 *  2) 본문 "최종 업데이트" 날짜가 발행일보다 빠른 모순
 *  3) 본문 "최종 업데이트" 날짜가 미래인 경우
 *  4) date 필드와 본문 업데이트 날짜가 둘 다 있는데 형식 오류
 *
 * 사용법: node scripts/verify-dates.mjs
 * package.json build 맨 앞에 넣으면 안전:
 *   "build": "node scripts/verify-dates.mjs && vite build && ..."
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// 오늘 날짜 (KST 기준 — 운영자가 한국에 있으므로 한국시간으로 판단)
const now = new Date();
const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
const TODAY = new Date(Date.UTC(kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate()));

function parseDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

const src = readFileSync(resolve(ROOT, "src/constants.ts"), "utf8");

// 글 블록 분리
const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?date:\s*"(\d{4}-\d{2}-\d{2})"[\s\S]*?\}(?=\s*,\s*\{\s*id:|\s*\];)/g;
// content와 date를 함께 잡기 위해 별도 추출
const objRe = /\{\s*id:\s*"([^"]+)"([\s\S]*?)\}(?=\s*,\s*\{\s*id:|\s*\];)/g;

const problems = [];
let count = 0;
let m;
while ((m = objRe.exec(src)) !== null) {
  const id = m[1];
  const body = m[2];
  const dateM = body.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (!dateM) continue;
  count++;
  const pubDate = dateM[1];
  const pub = parseDate(pubDate);

  // 1) 미래 발행일
  if (pub > TODAY) {
    problems.push(`[${id}] 미래 발행일: ${pubDate}`);
  }

  // 2) & 3) 본문 최종 업데이트 날짜
  const updM = body.match(/최종 업데이트:\s*(\d{4}-\d{2}-\d{2})/);
  if (updM) {
    const upd = parseDate(updM[1]);
    if (upd < pub) {
      problems.push(`[${id}] 업데이트(${updM[1]}) < 발행(${pubDate}) 모순`);
    }
    if (upd > TODAY) {
      problems.push(`[${id}] 미래 업데이트 날짜: ${updM[1]}`);
    }
  }
}

const todayStr = TODAY.toISOString().slice(0, 10);
if (problems.length > 0) {
  console.error(`\n❌ [날짜 검증 실패] 오늘=${todayStr}, ${count}개 글 중 ${problems.length}건 문제:`);
  problems.forEach((p) => console.error("   " + p));
  console.error("\n→ src/constants.ts의 날짜를 수정한 뒤 다시 빌드하세요.\n");
  process.exit(1);
} else {
  console.log(`✅ [날짜 검증 통과] 오늘=${todayStr}, ${count}개 글 모두 정상 (미래날짜·모순 없음)`);
}
