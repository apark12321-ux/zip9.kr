/**
 * 빌드 후 각 페이지를 정적 HTML로 프리렌더링.
 * - index.html을 템플릿으로 사용해 page별로 메타태그·본문 일부·JSON-LD를 미리 박아넣음
 * - dist/post/{slug}/index.html, dist/about/index.html 등 생성
 * - Vercel rewrite로 사용자가 /post/slug 접속 시 이 파일을 받음
 * - JS는 그대로 로드되어 React가 hydration → 사용자 경험은 동일
 *
 * 목적: 크롤러(애드센스 봇, 네이버 등)가 JS 실행 없이도 본문 텍스트를 볼 수 있도록 함.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const SITE_URL = "https://zip9.kr";
const SITE_NAME = "하우징허브";
const DEFAULT_TITLE = "하우징허브 - 대한민국 최고의 부동산 & 주거 정보 가이드";
const DEFAULT_DESCRIPTION = "청약 정보, 전월세 계약 팁, 담보대출 가이드 등 실용적인 주거 정보를 제공하는 하우징허브입니다.";
const CATEGORIES = ["청약-분양", "전월세", "이사-인테리어", "대출-금융"];

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

function stripHtml(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 본문 콘텐츠에서 렌더링되지 않는 마크다운 잔재를 정리.
 * 글에 실수로 ** 같은 마크다운 패턴이 들어가도 정적 HTML 출력 시
 * 그대로 노출되지 않도록 안전한 HTML로 자동 변환한다.
 * (utils.ts의 sanitizeContent와 동일 로직)
 */
function sanitizeContent(content) {
  if (!content) return "";
  let html = content;
  // **굵게** → <strong>굵게</strong>
  html = html.replace(/\*\*([^\*\n]+?)\*\*/g, "<strong>$1</strong>");
  // __굵게__ → <strong>굵게</strong>
  html = html.replace(/__([^_\n]+?)__/g, "<strong>$1</strong>");
  // *기울임* → <em>기울임</em> (앞뒤가 공백/문장부호일 때만)
  html = html.replace(/(?:^|[\s\(])\*([^\*\n]+?)\*(?=[\s\.,;:\)\!\?]|$)/g, (match, text) => {
    const prefix = match.charAt(0) === "*" ? "" : match.charAt(0);
    return `${prefix}<em>${text}</em>`;
  });
  // _기울임_ → <em>기울임</em>
  html = html.replace(/(?:^|[\s\(])_([^_\n]+?)_(?=[\s\.,;:\)\!\?]|$)/g, (match, text) => {
    const prefix = match.charAt(0) === "_" ? "" : match.charAt(0);
    return `${prefix}<em>${text}</em>`;
  });
  // 짝 안 맞는 잔여 ** 또는 __ 제거 (안전망)
  html = html.replace(/\*\*/g, "");
  html = html.replace(/__/g, "");
  return html;
}

function htmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * src/constants.ts에서 MOCK_POSTS 배열을 정규식으로 파싱.
 * 본 스크립트는 build 후 실행되므로 TS 컴파일 없이 raw 텍스트 처리.
 */
function loadPosts() {
  const file = resolve(ROOT, "src/constants.ts");
  if (!existsSync(file)) return [];
  const src = readFileSync(file, "utf8");
  const posts = [];
  // 각 객체 블록을 큰 단위로 매칭
  const blockRe =
    /\{\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?excerpt:\s*"((?:[^"\\]|\\.)*)"[\s\S]*?content:\s*`([\s\S]*?)`[\s\S]*?category:\s*"([^"]+)"[\s\S]*?author:\s*"([^"]+)"[\s\S]*?date:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"/g;
  let m;
  while ((m = blockRe.exec(src)) !== null) {
    posts.push({
      id: m[1],
      title: m[2].replace(/\\"/g, '"'),
      excerpt: m[3].replace(/\\"/g, '"'),
      content: m[4],
      category: m[5],
      author: m[6],
      date: m[7],
      image: m[8],
    });
  }
  return posts;
}

/**
 * 정적 HTML 한 페이지를 만든다.
 * - template: dist/index.html 원본
 * - meta: { title, description, canonical, ogImage, ogType }
 * - bodyContent: <noscript>안에 들어갈 본문(크롤러용)
 * - jsonLd: 추가 JSON-LD 객체 또는 null
 */
function renderPage(template, meta, bodyContent, jsonLd) {
  let html = template;

  // <title>
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${htmlEscape(meta.title)}</title>`
  );

  // <meta name="description">
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${htmlEscape(meta.description)}" />`
  );

  // <link rel="canonical">
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${htmlEscape(meta.canonical)}" />`
  );

  // OG meta들 (간단 치환)
  html = html.replace(
    /<meta property="og:title" content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${htmlEscape(meta.title)}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${htmlEscape(meta.description)}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${htmlEscape(meta.canonical)}" />`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${htmlEscape(meta.ogType || "website")}" />`
  );

  // og:image 추가 (게시물 페이지에만)
  if (meta.ogImage) {
    if (html.includes('property="og:image"')) {
      html = html.replace(
        /<meta property="og:image" content="[^"]*"\s*\/?>/,
        `<meta property="og:image" content="${htmlEscape(meta.ogImage)}" />`
      );
    } else {
      html = html.replace(
        /<meta property="og:url"[^>]*\/?>/,
        (match) =>
          `${match}\n    <meta property="og:image" content="${htmlEscape(meta.ogImage)}" />`
      );
    }
  }

  // Twitter
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${htmlEscape(meta.title)}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${htmlEscape(meta.description)}" />`
  );

  // JSON-LD 추가 (head 끝에)
  if (jsonLd) {
    const ld = `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`;
    html = html.replace("</head>", `${ld}\n  </head>`);
  }

  // <div id="root"></div>에 정적 본문 prerendered 콘텐츠 주입.
  // React가 hydration할 때 이 내용은 root.innerHTML로 대체되므로 사용자 화면은 동일.
  // 크롤러는 JS 실행 없이 이 내용을 본다.
  if (bodyContent) {
    html = html.replace(
      /<div id="root"><\/div>/,
      `<div id="root"><div id="prerendered-content" style="position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;overflow:hidden;">${bodyContent}</div></div>`
    );
  }

  return html;
}

/**
 * 게시물의 정적 본문 HTML (크롤러용).
 * 사용자에겐 보이지 않지만 크롤러가 읽을 수 있도록 head/main 구조로 작성.
 */
function buildPostBody(post) {
  const plainContent = sanitizeContent(post.content); // 마크다운 잔재 정리 후 사용
  const slug = slugify(post.title) || post.id;

  return `
    <article>
      <header>
        <nav aria-label="breadcrumb">
          <a href="/">홈</a> &gt; <a href="/category/${encodeURIComponent(post.category)}">${htmlEscape(post.category)}</a>
        </nav>
        <h1>${htmlEscape(post.title)}</h1>
        <p class="excerpt">${htmlEscape(post.excerpt)}</p>
        <p class="meta">
          <span>${htmlEscape(post.author)}</span> ·
          <time datetime="${post.date}">${post.date}</time> ·
          <span>${htmlEscape(post.category)}</span>
        </p>
        <img src="${htmlEscape(post.image)}" alt="${htmlEscape(post.title)}" />
      </header>
      <main>${plainContent}</main>
      <footer>
        <p>© 알고파트너스 · 운영: ${SITE_NAME} 편집팀 · 문의: apark12321@gmail.com</p>
      </footer>
    </article>
  `;
}

function buildCategoryBody(category, posts) {
  const list = posts
    .filter((p) => p.category === category)
    .map(
      (p) => `
        <li>
          <a href="/post/${encodeURIComponent(slugify(p.title) || p.id)}">
            <h2>${htmlEscape(p.title)}</h2>
            <p>${htmlEscape(p.excerpt)}</p>
            <time datetime="${p.date}">${p.date}</time>
          </a>
        </li>`
    )
    .join("");
  return `
    <main>
      <h1>${htmlEscape(category)} 정보</h1>
      <p>${htmlEscape(category)} 관련 주거 정보와 가이드를 모았습니다.</p>
      <ul>${list}</ul>
    </main>
  `;
}

function buildHomeBody(posts) {
  const recent = posts.slice(0, 10);
  const list = recent
    .map(
      (p) => `
        <li>
          <a href="/post/${encodeURIComponent(slugify(p.title) || p.id)}">
            <h2>${htmlEscape(p.title)}</h2>
            <p>${htmlEscape(p.excerpt)}</p>
            <span>${htmlEscape(p.category)}</span> · <time>${p.date}</time>
          </a>
        </li>`
    )
    .join("");
  return `
    <main>
      <h1>하우징허브</h1>
      <p>${DEFAULT_DESCRIPTION}</p>
      <h2>최근 게시물</h2>
      <ul>${list}</ul>
      <nav>
        <h2>카테고리</h2>
        <ul>
          ${CATEGORIES.map((c) => `<li><a href="/category/${encodeURIComponent(c)}">${htmlEscape(c)}</a></li>`).join("")}
        </ul>
      </nav>
    </main>
  `;
}

function buildStaticPageBody(title, body) {
  return `<main><h1>${htmlEscape(title)}</h1>${body}</main>`;
}

function articleJsonLd(post) {
  const slug = slugify(post.title) || post.id;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.image],
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "알고파트너스",
      alternateName: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/post/${slug}` },
    articleSection: post.category,
    inLanguage: "ko-KR",
  };
}

function writeFile(p, content) {
  const dir = dirname(p);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(p, content, "utf8");
}

function main() {
  const indexPath = join(DIST, "index.html");
  if (!existsSync(indexPath)) {
    console.error("[prerender] dist/index.html not found. Run vite build first.");
    process.exit(1);
  }
  const template = readFileSync(indexPath, "utf8");
  const posts = loadPosts();

  let count = 0;

  // 1) 홈
  const homeHtml = renderPage(
    template,
    {
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      canonical: `${SITE_URL}/`,
      ogType: "website",
    },
    buildHomeBody(posts),
    null
  );
  writeFile(indexPath, homeHtml);
  count++;

  // 2) 정적 페이지들
  const staticPages = [
    {
      path: "about/index.html",
      title: `소개 | ${SITE_NAME}`,
      desc: `${SITE_NAME}는 실용적이고 정확한 주거 정보를 전해드리는 미디어입니다.`,
      url: `${SITE_URL}/about`,
      body: buildStaticPageBody(
        `${SITE_NAME} 소개`,
        `<p>${SITE_NAME}는 청약-분양, 전월세, 이사-인테리어, 대출-금융 등 주거 생활 전반의 정보를 다루는 미디어입니다. 운영: 알고파트너스 / 대표: 박예준 / 문의: apark12321@gmail.com</p>`
      ),
    },
    {
      path: "privacy/index.html",
      title: `개인정보 처리방침 | ${SITE_NAME}`,
      desc: `${SITE_NAME}의 개인정보 수집 및 이용에 관한 안내입니다.`,
      url: `${SITE_URL}/privacy`,
      body: buildStaticPageBody(
        "개인정보 처리방침",
        `<p>본 사이트는 이용자의 개인정보를 소중히 다룹니다. 개인정보 보호책임자: 박예준 (apark12321@gmail.com).</p>`
      ),
    },
    {
      path: "terms/index.html",
      title: `이용약관 | ${SITE_NAME}`,
      desc: `${SITE_NAME} 서비스 이용에 관한 약관입니다.`,
      url: `${SITE_URL}/terms`,
      body: buildStaticPageBody(
        "이용약관",
        `<p>본 약관은 알고파트너스(대표 박예준)가 운영하는 ${SITE_NAME}(https://zip9.kr)의 서비스 이용에 관한 사항을 규정합니다.</p>`
      ),
    },
    {
      path: "partnership/index.html",
      title: `제휴 및 비즈니스 문의 | ${SITE_NAME}`,
      desc: `${SITE_NAME}와 광고, 콘텐츠 협업, 파트너십 문의를 위한 안내 페이지입니다.`,
      url: `${SITE_URL}/partnership`,
      body: buildStaticPageBody(
        "제휴 및 비즈니스 문의",
        `<p>제휴, 광고, 콘텐츠 협업 문의는 apark12321@gmail.com으로 보내주시면 영업일 3일 이내 회신드립니다.</p>`
      ),
    },
    {
      path: "announcement/index.html",
      title: `공지사항 | ${SITE_NAME}`,
      desc: `${SITE_NAME}의 서비스 운영 관련 공지사항을 안내합니다.`,
      url: `${SITE_URL}/announcement`,
      body: buildStaticPageBody(
        "공지사항",
        `<p>${SITE_NAME} 운영 관련 공지사항을 안내합니다.</p>`
      ),
    },
  ];

  for (const p of staticPages) {
    const html = renderPage(
      template,
      { title: p.title, description: p.desc, canonical: p.url, ogType: "website" },
      p.body,
      null
    );
    writeFile(join(DIST, p.path), html);
    count++;
  }

  // 3) 카테고리 페이지
  for (const cat of CATEGORIES) {
    const path = `category/${encodeURIComponent(cat)}/index.html`;
    const html = renderPage(
      template,
      {
        title: `${cat} 정보 | ${SITE_NAME}`,
        description: `${cat} 관련 주거 정보와 가이드를 모았습니다.`,
        canonical: `${SITE_URL}/category/${encodeURIComponent(cat)}`,
        ogType: "website",
      },
      buildCategoryBody(cat, posts),
      null
    );
    writeFile(join(DIST, path), html);
    count++;
  }

  // 4) 게시물 페이지 (가장 중요)
  for (const post of posts) {
    const slug = slugify(post.title) || post.id;
    const path = `post/${encodeURIComponent(slug)}/index.html`;
    const html = renderPage(
      template,
      {
        title: `${post.title} | ${SITE_NAME}`,
        description: post.excerpt || stripHtml(sanitizeContent(post.content)).slice(0, 155),
        canonical: `${SITE_URL}/post/${slug}`,
        ogType: "article",
        ogImage: post.image,
      },
      buildPostBody(post),
      articleJsonLd(post)
    );
    writeFile(join(DIST, path), html);
    count++;
  }

  console.log(`[prerender] generated ${count} static HTML files (home + ${staticPages.length} static + ${CATEGORIES.length} categories + ${posts.length} posts)`);
}

main();
