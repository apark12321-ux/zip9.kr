import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://zip9.kr";
const SITE_NAME = "ZIP9 생활정보";
const DEFAULT_TITLE = "ZIP9 생활정보 - 전월세·청약·대출·생활 계산 가이드";
const DEFAULT_DESCRIPTION = "전월세, 청약, 대출, 퇴직금, 이사비용처럼 실제 검색 수요가 있는 생활정보를 표와 체크리스트 중심으로 정리합니다.";
const CATEGORIES = ["전월세", "청약-분양", "대출-금융", "생활도구"];

function slugify(title) {
  if (!title) return "";
  return title.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w\uAC00-\uD7A3\-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 25).replace(/-+$/g, "");
}
function stripHtml(html) {
  return html.replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/gi, " ").replace(/\s+/g, " ").trim();
}
function htmlEscape(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function loadPosts() {
  const file = resolve(ROOT, "src/constants.ts");
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const posts = [];
  const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?excerpt:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?content:\s*`([\s\S]*?)`[\s\S]*?category:\s*"([^"]+)"[\s\S]*?author:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g;
  let match;
  while ((match = blockRe.exec(src)) !== null) {
    posts.push({ id: match[1], title: match[2].replace(/\\"/g, '"'), excerpt: match[3].replace(/\\"/g, '"'), content: match[4], category: match[5], author: match[6], date: match[7], image: match[8] });
  }
  return posts;
}
function renderPage(template, meta, bodyContent, jsonLd) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${htmlEscape(meta.title)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${htmlEscape(meta.description)}" />`);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${htmlEscape(meta.canonical)}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${htmlEscape(meta.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${htmlEscape(meta.description)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${htmlEscape(meta.canonical)}" />`);
  html = html.replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${htmlEscape(meta.ogType || "website")}" />`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${htmlEscape(meta.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/, `<meta name="twitter:description" content="${htmlEscape(meta.description)}" />`);
  if (meta.ogImage) html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${htmlEscape(meta.ogImage)}" />`);
  if (jsonLd) html = html.replace("</head>", `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`);
  if (bodyContent) html = html.replace(/<div id="root"><\/div>/, `<div id="root"><div id="prerendered-content" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;">${bodyContent}</div></div>`);
  return html;
}
function buildPostBody(post) {
  return `<article><header><nav><a href="/">홈</a> &gt; <a href="/category/${encodeURIComponent(post.category)}">${htmlEscape(post.category)}</a></nav><h1>${htmlEscape(post.title)}</h1><p>${htmlEscape(post.excerpt)}</p><p>${htmlEscape(post.author)} · <time datetime="${post.date}">${post.date}</time></p><img src="${htmlEscape(post.image)}" alt="${htmlEscape(post.title)}" /></header><main>${post.content}</main><footer><p>© ${SITE_NAME} · 문의: apark12321@gmail.com</p></footer></article>`;
}
function buildCategoryBody(category, posts) {
  const list = posts.filter((post) => post.category === category).map((post) => `<li><a href="/post/${encodeURIComponent(slugify(post.title) || post.id)}"><h2>${htmlEscape(post.title)}</h2><p>${htmlEscape(post.excerpt)}</p><time datetime="${post.date}">${post.date}</time></a></li>`).join("");
  return `<main><h1>${htmlEscape(category)} 정보</h1><p>${htmlEscape(category)} 관련 생활정보와 체크리스트를 모았습니다.</p><ul>${list}</ul></main>`;
}
function buildHomeBody(posts) {
  const list = posts.slice(0, 12).map((post) => `<li><a href="/post/${encodeURIComponent(slugify(post.title) || post.id)}"><h2>${htmlEscape(post.title)}</h2><p>${htmlEscape(post.excerpt)}</p><span>${htmlEscape(post.category)}</span> · <time>${post.date}</time></a></li>`).join("");
  return `<main><h1>${SITE_NAME}</h1><p>${DEFAULT_DESCRIPTION}</p><h2>최근 게시물</h2><ul>${list}</ul><nav><h2>카테고리</h2><ul>${CATEGORIES.map((category) => `<li><a href="/category/${encodeURIComponent(category)}">${htmlEscape(category)}</a></li>`).join("")}</ul></nav></main>`;
}
function buildStaticPageBody(title, body) {
  return `<main><h1>${htmlEscape(title)}</h1>${body}</main>`;
}
function articleJsonLd(post) {
  const slug = slugify(post.title) || post.id;
  return { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, image: [post.image], datePublished: post.date, dateModified: post.date, author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` } }, mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/post/${slug}` }, articleSection: post.category, inLanguage: "ko-KR" };
}
function writePage(path, content) {
  const directory = dirname(path);
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
  writeFileSync(path, content, "utf8");
}

const indexPath = join(DIST, "index.html");
if (!existsSync(indexPath)) {
  console.error("[prerender] dist/index.html not found. Run vite build first.");
  process.exit(1);
}
const template = readFileSync(indexPath, "utf8");
const posts = loadPosts();
let count = 0;
writePage(indexPath, renderPage(template, { title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, canonical: `${SITE_URL}/`, ogType: "website" }, buildHomeBody(posts), null));
count++;
const staticPages = [
  { path: "about/index.html", title: `소개 | ${SITE_NAME}`, desc: `${SITE_NAME} 소개`, url: `${SITE_URL}/about`, body: buildStaticPageBody(`${SITE_NAME} 소개`, `<p>전월세·청약·대출·생활 계산 정보를 검색자 눈높이로 정리하는 정보형 미디어입니다.</p>`) },
  { path: "strategy/index.html", title: `운영전략 | ${SITE_NAME}`, desc: `검색 수요 기반 애드센스 정보형 사이트 운영전략입니다.`, url: `${SITE_URL}/strategy`, body: buildStaticPageBody("운영전략", `<p>검색 수요, 행동 의도, 정책 안전성, 공식 확인 경로를 기준으로 글감을 선별합니다.</p>`) },
  { path: "privacy/index.html", title: `개인정보처리방침 | ${SITE_NAME}`, desc: `${SITE_NAME} 개인정보 처리방침`, url: `${SITE_URL}/privacy`, body: buildStaticPageBody("개인정보처리방침", `<p>개인정보 보호책임자: 박예준, 문의: apark12321@gmail.com.</p>`) },
  { path: "terms/index.html", title: `이용약관 | ${SITE_NAME}`, desc: `${SITE_NAME} 이용약관`, url: `${SITE_URL}/terms`, body: buildStaticPageBody("이용약관", `<p>본 사이트의 정보는 일반 생활정보 제공 목적이며, 중요한 계약 전 공식 기관 또는 전문가 확인이 필요합니다.</p>`) },
  { path: "partnership/index.html", title: `제휴문의 | ${SITE_NAME}`, desc: `${SITE_NAME} 제휴문의`, url: `${SITE_URL}/partnership`, body: buildStaticPageBody("제휴 및 비즈니스 문의", `<p>광고, 콘텐츠 제휴, 협업 문의는 apark12321@gmail.com으로 보내주세요.</p>`) }
];
for (const page of staticPages) {
  writePage(join(DIST, page.path), renderPage(template, { title: page.title, description: page.desc, canonical: page.url, ogType: "website" }, page.body, null));
  count++;
}
for (const category of CATEGORIES) {
  writePage(join(DIST, `category/${encodeURIComponent(category)}/index.html`), renderPage(template, { title: `${category} 정보 | ${SITE_NAME}`, description: `${category} 관련 생활정보와 체크리스트를 모았습니다.`, canonical: `${SITE_URL}/category/${encodeURIComponent(category)}`, ogType: "website" }, buildCategoryBody(category, posts), null));
  count++;
}
for (const post of posts) {
  const slug = slugify(post.title) || post.id;
  writePage(join(DIST, `post/${encodeURIComponent(slug)}/index.html`), renderPage(template, { title: `${post.title} | ${SITE_NAME}`, description: post.excerpt || stripHtml(post.content).slice(0, 155), canonical: `${SITE_URL}/post/${slug}`, ogType: "article", ogImage: post.image }, buildPostBody(post), articleJsonLd(post)));
  count++;
}
console.log(`[prerender] generated ${count} static HTML files`);
