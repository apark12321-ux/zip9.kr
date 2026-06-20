import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://zip9.kr";
const CATEGORIES = ["전월세", "청약-분양", "대출-금융", "생활도구"];

function slugify(title) {
  if (!title) return "";
  return title.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w\uAC00-\uD7A3\-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 25).replace(/-+$/g, "");
}

function loadPosts() {
  const file = resolve(ROOT, "src/constants.ts");
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const posts = [];
  const blockRe = /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?date:\s*"([^"]+)"/g;
  let match;
  while ((match = blockRe.exec(src)) !== null) {
    posts.push({ id: match[1], title: match[2].replace(/\\"/g, '"'), date: match[3] });
  }
  return posts;
}

function xmlEscape(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function buildSitemap(posts) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${SITE_URL}/`, lastmod: today, changefreq: "daily", priority: "1.0" },
    { loc: `${SITE_URL}/strategy`, lastmod: today, changefreq: "monthly", priority: "0.7" },
    { loc: `${SITE_URL}/about`, lastmod: today, changefreq: "monthly", priority: "0.6" },
    { loc: `${SITE_URL}/partnership`, lastmod: today, changefreq: "monthly", priority: "0.4" },
    { loc: `${SITE_URL}/terms`, lastmod: today, changefreq: "yearly", priority: "0.3" },
    { loc: `${SITE_URL}/privacy`, lastmod: today, changefreq: "yearly", priority: "0.3" },
    ...CATEGORIES.map((category) => ({ loc: `${SITE_URL}/category/${encodeURIComponent(category)}`, lastmod: today, changefreq: "weekly", priority: "0.8" })),
    ...posts.map((post) => ({ loc: `${SITE_URL}/post/${encodeURIComponent(slugify(post.title) || post.id)}`, lastmod: post.date || today, changefreq: "monthly", priority: "0.7" }))
  ];

  const body = urls.map((url) => `  <url>\n    <loc>${xmlEscape(url.loc)}</loc>\n    <lastmod>${url.lastmod}</lastmod>\n    <changefreq>${url.changefreq}</changefreq>\n    <priority>${url.priority}</priority>\n  </url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function buildRobots() {
  return `# ZIP9 생활정보 robots.txt
# Site: ${SITE_URL}

User-agent: *
Allow: /
Disallow: /api/

User-agent: Mediapartners-Google
Allow: /

User-agent: AdsBot-Google
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Yeti
Allow: /

User-agent: Daum
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/rss.xml
`;
}

if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });
const posts = loadPosts();
writeFileSync(resolve(DIST, "sitemap.xml"), buildSitemap(posts), "utf8");
writeFileSync(resolve(DIST, "robots.txt"), buildRobots(), "utf8");
console.log(`[sitemap] generated for ${posts.length} posts → dist/sitemap.xml, dist/robots.txt`);
