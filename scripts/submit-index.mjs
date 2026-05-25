/**
 * IndexNow 자동 색인 제출 스크립트 (zip9.kr 전용)
 *
 * 배포 완료 후 실행: npm run submit-index
 * 새 글/수정 글 URL을 IndexNow 프로토콜로 Bing·Naver·Yandex 등에 즉시 색인 요청한다.
 *
 * ⚠️ 반드시 배포가 끝난 뒤(URL 실제 접속 가능할 때) 실행할 것.
 *    아직 안 올라간 URL을 제출하면 "없는 페이지"로 인식될 수 있다.
 *
 * Google은 일반 블로그용 즉시 색인 API를 공식 지원하지 않으므로(sitemap으로 커버),
 * 즉시 색인은 IndexNow가 지원하는 Bing·Naver로 처리한다. 정책 위반 없는 안전한 방식.
 */
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SITE_HOST = "zip9.kr";              // www 없이 (canonical 정책에 맞춰 조정 가능)
const SITE_URL = "https://zip9.kr";
const INDEXNOW_KEY = "7065c4d36d9ee7471f10e55dd6f4a4bd"; // zip9 전용 키

// 배포된 sitemap에서 URL 목록 추출
function getUrlsFromSitemap() {
  const sitemapPath = resolve(ROOT, "dist/sitemap.xml");
  try {
    const xml = readFileSync(sitemapPath, "utf8");
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
    return locs;
  } catch (e) {
    console.error("❌ dist/sitemap.xml을 찾을 수 없습니다. 먼저 npm run build를 실행하세요.");
    process.exit(1);
  }
}

async function submitIndexNow(urls) {
  const endpoint = "https://api.indexnow.org/indexnow";
  const body = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
    console.log(`IndexNow 제출: ${res.status} ${res.statusText} (${urls.length}개 URL)`);
    if (res.status === 200 || res.status === 202) {
      console.log("  ✅ 색인 요청 접수됨 (Bing, Naver, Yandex 등)");
    } else if (res.status === 403) {
      console.log("  ⚠️ 키 파일 검증 실패. public/" + INDEXNOW_KEY + ".txt가 배포됐는지 확인하세요.");
    } else if (res.status === 422) {
      console.log("  ⚠️ URL 또는 host 불일치. SITE_HOST와 제출 URL의 도메인이 같은지 확인하세요.");
    }
  } catch (e) {
    console.error("  ❌ IndexNow 제출 실패:", e.message);
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
  await submitIndexNow(urls);
  await pingSitemap();
  console.log("=== 완료 ===");
}

main();
