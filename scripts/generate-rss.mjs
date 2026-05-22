/**
 * 빌드 후 dist/rss.xml을 자동 생성.
 * constants.ts의 게시물을 읽어 RSS 2.0 피드를 만든다.
 * 배포된 URL과 동일한 slug 규칙(.slice(0,25))을 사용해 일관성 유지.
 *
 * 사용: package.json build 스크립트 뒤에 `&& node scripts/generate-rss.mjs` 추가.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://zip9.kr";
const SITE_NAME = "하우징허브";
const SITE_DESC = "청약·전월세·이사·대출 등 실생활 주거 정보를 제공하는 하우징허브입니다.";

// 배포 URL과 동일한 slugify (slice 25 포함 — 현재 배포 URL과 일치시킴)
function slugify(title) {
  if (!title) return "";
  return title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\uAC00-\uD7A3\-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 25)
    .replace(/-+$/g, "");
}

// HTML 태그 제거 (description 평문화)
function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// XML 특수문자 이스케이프
function xmlEscape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// constants.ts에서 게시물 추출
function loadPosts() {
  const file = resolve(ROOT, "src/constants.ts");
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const posts = [];
  const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?excerpt:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?content:\s*`([\s\S]*?)`[\s\S]*?category:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    posts.push({
      id: m[1],
      title: m[2].replace(/\\"/g, '"'),
      excerpt: m[3].replace(/\\"/g, '"'),
      content: m[4],
      category: m[5],
      date: m[6],
    });
  }
  return posts;
}

function buildRss(posts) {
  // 최신순 정렬
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const latest = sorted.slice(0, 30); // 최신 30개

  const lastBuildDate = new Date().toUTCString();
  const pubDate = sorted.length
    ? new Date(sorted[0].date + "T09:00:00+09:00").toUTCString()
    : lastBuildDate;

  const items = latest
    .map((p) => {
      const slug = slugify(p.title) || p.id;
      const link = `${SITE_URL}/post/${encodeURIComponent(slug)}`;
      const desc = p.excerpt || stripHtml(p.content).slice(0, 200);
      const itemPubDate = new Date(p.date + "T09:00:00+09:00").toUTCString();
      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${xmlEscape(desc)}</description>
      <category>${xmlEscape(p.category)}</category>
      <pubDate>${itemPubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${xmlEscape(SITE_DESC)}</description>
    <language>ko-KR</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <pubDate>${pubDate}</pubDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

const posts = loadPosts();
const rss = buildRss(posts);
writeFileSync(resolve(DIST, "rss.xml"), rss, "utf8");
console.log(`[rss] generated for ${Math.min(posts.length, 30)} of ${posts.length} posts → dist/rss.xml`);
