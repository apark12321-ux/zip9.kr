import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://zip9.kr";
const SITE_NAME = "ZIP9 생활정보";
const SITE_DESC = "전월세·청약·대출·생활 계산 정보를 검색자 눈높이로 정리하는 생활정보 미디어입니다.";

function slugify(title) {
  if (!title) return "";
  return title.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w\uAC00-\uD7A3\-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 25).replace(/-+$/g, "");
}
function stripHtml(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}
function xmlEscape(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function loadPosts() {
  const file = resolve(ROOT, "src/constants.ts");
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const posts = [];
  const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?excerpt:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?content:\s*`([\s\S]*?)`[\s\S]*?category:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"/g;
  let match;
  while ((match = blockRe.exec(src)) !== null) {
    posts.push({ id: match[1], title: match[2].replace(/\\"/g, '"'), excerpt: match[3].replace(/\\"/g, '"'), content: match[4], category: match[5], date: match[6] });
  }
  return posts;
}
function buildRss(posts) {
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 30);
  const lastBuildDate = new Date().toUTCString();
  const items = sorted.map((post) => {
    const slug = slugify(post.title) || post.id;
    const link = `${SITE_URL}/post/${encodeURIComponent(slug)}`;
    const desc = post.excerpt || stripHtml(post.content).slice(0, 200);
    const pubDate = new Date(`${post.date}T09:00:00+09:00`).toUTCString();
    return `    <item>\n      <title>${xmlEscape(post.title)}</title>\n      <link>${link}</link>\n      <guid isPermaLink="true">${link}</guid>\n      <description>${xmlEscape(desc)}</description>\n      <category>${xmlEscape(post.category)}</category>\n      <pubDate>${pubDate}</pubDate>\n    </item>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n    <title>${xmlEscape(SITE_NAME)}</title>\n    <link>${SITE_URL}</link>\n    <description>${xmlEscape(SITE_DESC)}</description>\n    <language>ko-KR</language>\n    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />\n${items}\n  </channel>\n</rss>\n`;
}
const posts = loadPosts();
writeFileSync(resolve(DIST, "rss.xml"), buildRss(posts), "utf8");
console.log(`[rss] generated for ${Math.min(posts.length, 30)} of ${posts.length} posts → dist/rss.xml`);
