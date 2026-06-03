/**
 * IndexNow 자동 색인 제출 스크립트 (zip9.kr 전용)
 *
 * 배포 완료 후 실행: npm run submit-index
 * 새 글/수정 글 URL을 IndexNow 프로토콜로 검색엔진에 즉시 색인 요청한다.
 *
 * 제출 경로 (2026 기준):
 *   1) IndexNow 글로벌 엔드포인트 (Bing·Yandex 등으로 전파, 네이버에도 공유됨)
 *   2) 네이버 전용 엔드포인트 (네이버 색인을 더 빠르고 확실하게)
 *
 * ⚠️ 반드시 배포가 끝난 뒤(URL 실제 접속 가능할 때) 실행할 것.
 *
 * Google은 일반 블로그용 즉시 색인 API를 공식 지원하지 않으므로(sitemap으로 커버),
 * 즉시 색인은 IndexNow가 지원하는 Bing·Naver로 처리한다. 정책 위반 없는 안전한 방식.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SITE_HOST = "zip9.kr";
const SITE_URL = "https://zip9.kr";

// IndexNow 글로벌(Bing 계열) 키 — public/{KEY}.txt 로 배포됨
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "7065c4d36d9ee7471f10e55dd6f4a4bd";

// 네이버 서치어드바이저에서 발급받은 전용 키 (환경변수로 주입 권장)
// 네이버 발급 키 파일도 public/{NAVER_KEY}.txt 로 사이트 루트에 배포되어 있어야 함
const NAVER_INDEXNOW_KEY = process.env.NAVER_INDEXNOW_KEY || "";

// 배포된 sitemap에서 URL 목록 추출
function getUrlsFromSitemap() {
  const sitemapPath = resolve(ROOT, "dist/sitemap.xml");
  try {
    const xml = readFileSync(sitemapPath, "utf8");
    return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  } catch (e) {
    console.error("dist/sitemap.xml을 찾을 수 없습니다. 먼저 npm run build를 실행하세요.");
    process.exit(1);
  }
}

// 공통 POST 제출 함수
async function postIndexNow(label, endpoint, key, keyLocation, urls) {
  const body = { host: SITE_HOST, key, keyLocation, urlList: urls };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(`[${label}] ${res.status} ${res.statusText} (${urls.length}개 URL)`);
    if (res.status === 200 || res.status === 202) {
      console.log(`  OK ${label} 색인 요청 접수됨`);
    } else if (res.status === 403) {
      console.log(`  WARN ${label} 키 파일 검증 실패. 사이트 루트에 키 파일이 배포됐는지 확인하세요.`);
    } else if (res.status === 422) {
      console.log(`  WARN ${label} URL/host 불일치. 도메인이 같은지 확인하세요.`);
    } else {
      const text = await res.text().catch(() => "");
      console.log(`  WARN ${label} 예상치 못한 응답: ${text.slice(0, 200)}`);
    }
  } catch (e) {
    console.error(`  ERR ${label} 제출 실패:`, e.message);
  }
}

async function pingSitemap() {
  const sitemapUrl = `${SITE_URL}/sitemap.xml`;
  const bing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const res = await fetch(bing);
    console.log(`sitemap 핑(Bing): ${res.status}`);
  } catch (e) {
    console.error("sitemap 핑 실패:", e.message);
  }
}

async function main() {
  const urls = getUrlsFromSitemap();
  console.log(`=== 검색엔진 색인 제출 시작 (${urls.length}개 URL) ===`);

  // 1) IndexNow 글로벌 엔드포인트
  await postIndexNow(
    "IndexNow 글로벌",
    "https://api.indexnow.org/indexnow",
    INDEXNOW_KEY,
    `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urls
  );

  // 2) 네이버 전용 엔드포인트 (네이버 발급 키가 있을 때만)
  if (NAVER_INDEXNOW_KEY) {
    await postIndexNow(
      "네이버 IndexNow",
      "https://searchadvisor.naver.com/indexnow",
      NAVER_INDEXNOW_KEY,
      `${SITE_URL}/${NAVER_INDEXNOW_KEY}.txt`,
      urls
    );
  } else {
    console.log("[네이버 IndexNow] SKIP NAVER_INDEXNOW_KEY 미설정 — 네이버 전용 제출 건너뜀");
    console.log("   (글로벌 엔드포인트를 통해 네이버에도 공유되지만, 직접 제출하려면");
    console.log("    네이버 서치어드바이저에서 키를 발급받아 NAVER_INDEXNOW_KEY 환경변수로 설정하세요.)");
  }

  await pingSitemap();
  console.log("=== 완료 ===");
}

main();
