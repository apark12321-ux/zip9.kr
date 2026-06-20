import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, MOCK_POSTS, type Post } from "./constants";

type Page =
  | { type: "home" }
  | { type: "strategy" }
  | { type: "about" }
  | { type: "privacy" }
  | { type: "terms" }
  | { type: "partnership" }
  | { type: "category"; category: string }
  | { type: "post"; slug: string };

const SITE_URL = "https://zip9.kr";
const SITE_NAME = "ZIP9 생활정보";
const DEFAULT_TITLE = "ZIP9 생활정보 - 전월세·청약·대출·생활 계산 가이드";
const DEFAULT_DESCRIPTION = "검색자가 실제로 궁금해하는 전월세, 청약, 대출, 생활비 계산 정보를 표와 체크리스트 중심으로 정리하는 생활정보 미디어입니다.";

function slugify(title: string) {
  return title.trim().toLowerCase().replace(/[\s_]+/g, "-").replace(/[^\w\uAC00-\uD7A3\-]/g, "").replace(/-+/g, "-").replace(/^-+|-+$/g, "").slice(0, 25).replace(/-+$/g, "");
}
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
function pageFromPath(): Page {
  const path = window.location.pathname;
  if (path === "/strategy") return { type: "strategy" };
  if (path === "/about") return { type: "about" };
  if (path === "/privacy") return { type: "privacy" };
  if (path === "/terms") return { type: "terms" };
  if (path === "/partnership") return { type: "partnership" };
  const category = path.match(/^\/category\/(.+)$/);
  if (category) return { type: "category", category: decodeURIComponent(category[1]) };
  const post = path.match(/^\/post\/(.+)$/);
  if (post) return { type: "post", slug: decodeURIComponent(post[1]) };
  return { type: "home" };
}
function pathFromPage(page: Page) {
  if (page.type === "home") return "/";
  if (["strategy", "about", "privacy", "terms", "partnership"].includes(page.type)) return `/${page.type}`;
  if (page.type === "category") return `/category/${encodeURIComponent(page.category)}`;
  return `/post/${encodeURIComponent(page.slug)}`;
}
function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
function setCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = url;
}

function AdSlot({ label }: { label: string }) {
  return <aside className="ad-slot"><b>{label}</b><p>승인 후 AdSense 광고 코드를 넣는 위치입니다. 광고 클릭 유도 문구는 사용하지 않습니다.</p></aside>;
}
function Header({ go }: { go: (page: Page) => void }) {
  return <header className="site-header"><button className="brand" onClick={() => go({ type: "home" })}><span>Z9</span><strong>{SITE_NAME}<small>Search-intent media</small></strong></button><nav>{CATEGORIES.map((category) => <button key={category} onClick={() => go({ type: "category", category })}>{category}</button>)}<button onClick={() => go({ type: "strategy" })}>운영전략</button><button onClick={() => go({ type: "about" })}>소개</button></nav></header>;
}
function Footer({ go }: { go: (page: Page) => void }) {
  return <footer className="site-footer"><div><b>{SITE_NAME}</b><p>전월세·청약·대출·생활 계산 정보를 검색 의도에 맞춰 정리합니다.</p></div><nav><button onClick={() => go({ type: "about" })}>소개</button><button onClick={() => go({ type: "privacy" })}>개인정보처리방침</button><button onClick={() => go({ type: "terms" })}>이용약관</button><button onClick={() => go({ type: "partnership" })}>제휴문의</button></nav></footer>;
}
function PostCard({ post, go, featured = false }: { post: Post; go: (page: Page) => void; featured?: boolean }) {
  const slug = slugify(post.title) || post.id;
  return <article className={featured ? "post-card featured" : "post-card"}><img src={post.image} alt="" loading="lazy" /><div><span className="pill">{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p><small>{post.date} · {post.readTime}</small><button onClick={() => go({ type: "post", slug })}>자세히 보기 →</button></div></article>;
}
function KeywordScorer() {
  const [scores, setScores] = useState({ demand: 4, intent: 5, cpc: 4, competition: 3, evergreen: 4, safety: 5 });
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  const result = total >= 24 ? "즉시 발행 후보" : total >= 20 ? "보강 후 발행" : "보류 또는 재검토";
  const items = [["demand", "검색 수요"], ["intent", "행동 의도"], ["cpc", "광고 단가"], ["competition", "경쟁 우위"], ["evergreen", "지속성"], ["safety", "정책 안전성"]] as const;
  return <section className="tool-panel"><div><span className="eyebrow">Keyword scoring</span><h2>애드센스 글감 점수 계산기</h2><p>검색 수요, 행동 의도, 광고 단가 가능성, 경쟁 우위, 지속성, 정책 안전성을 기준으로 발행 우선순위를 정합니다.</p></div><div className="score-grid">{items.map(([key, label]) => <label key={key}><span>{label}</span><input type="range" min="1" max="5" value={scores[key]} onChange={(event) => setScores({ ...scores, [key]: Number(event.target.value) })} /><b>{scores[key]}점</b></label>)}<div className="score-result"><strong>{total}점</strong><span>{result}</span></div></div></section>;
}
function Home({ posts, go }: { posts: Post[]; go: (page: Page) => void }) {
  return <main><section className="hero"><div><span className="eyebrow">AdSense-ready information site</span><h1>검색자가 바로 행동하기 직전의 질문만 골라 정리합니다.</h1><p>전월세, 청약, 대출, 퇴직금, 이사비처럼 광고주 수요와 생활 밀착 검색이 만나는 주제를 표·체크리스트 중심으로 제공합니다.</p><div className="hero-actions"><button onClick={() => go({ type: "strategy" })}>운영전략 보기</button><a href="#latest">최신 글 보기</a></div></div><aside><b>오늘의 발행 기준</b><ul><li>검색 수요가 있는가?</li><li>신청·구매·비교 의도가 있는가?</li><li>공식 확인 경로를 제시했는가?</li><li>광고 클릭 유도 없이 읽히는가?</li></ul></aside></section><section className="cluster-strip">{CATEGORIES.map((category) => <button key={category} onClick={() => go({ type: "category", category })}><strong>{category}</strong><span>{MOCK_POSTS.filter((post) => post.category === category).length}개 글</span></button>)}</section><AdSlot label="상단 반응형 광고 영역" /><section id="latest" className="section-block"><span className="eyebrow">Latest guides</span><h2>바로 검색되는 생활형 정보글</h2><div className="cards">{posts.map((post, index) => <PostCard key={post.id} post={post} go={go} featured={index === 0} />)}</div></section><KeywordScorer /><section className="checklist-section"><h2>애드센스 승인용 신뢰 요소</h2><ul><li>카테고리별 실제 글 확보</li><li>개인정보처리방침·이용약관·문의 페이지 제공</li><li>ads.txt, sitemap.xml, robots.txt 준비</li><li>AI 초안 사용 시 사람 검수와 최신 날짜 표시</li><li>광고 클릭 유도 문구 제거</li><li>모바일에서 본문이 광고보다 먼저 읽히도록 구성</li></ul></section></main>;
}
function CategoryPage({ category, go }: { category: string; go: (page: Page) => void }) {
  const posts = MOCK_POSTS.filter((post) => post.category === category);
  return <main className="page-shell"><div className="page-title"><span className="eyebrow">Topic cluster</span><h1>{category} 정보</h1><p>{category} 관련 검색 의도가 높은 글을 묶었습니다. 단일 글보다 주제 클러스터로 쌓아 사이트의 전문 영역을 명확히 합니다.</p></div><div className="cards compact">{posts.map((post) => <PostCard key={post.id} post={post} go={go} />)}</div></main>;
}
function PostPage({ post, go }: { post: Post; go: (page: Page) => void }) {
  const related = MOCK_POSTS.filter((item) => item.id !== post.id && item.category === post.category).slice(0, 3);
  return <main className="article-shell"><article className="article"><button className="back" onClick={() => go({ type: "home" })}>← 홈으로</button><span className="pill">{post.category}</span><h1>{post.title}</h1><p className="lead">{post.excerpt}</p><div className="meta"><span>{post.author}</span><span>{post.date}</span><span>{post.readTime}</span></div><img className="article-image" src={post.image} alt="" /><AdSlot label="본문 상단 광고 영역" /><div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} /><AdSlot label="본문 하단 광고 영역" /><div className="tags">{post.hashtags.map((tag) => <span key={tag}>#{tag}</span>)}</div></article><aside className="related"><h2>같이 보면 좋은 글</h2>{related.map((item) => <button key={item.id} onClick={() => go({ type: "post", slug: slugify(item.title) || item.id })}><span>{item.category}</span><b>{item.title}</b></button>)}</aside></main>;
}
function StrategyPage() {
  return <main className="page-shell"><div className="page-title"><span className="eyebrow">Operating system</span><h1>ZIP9 운영전략</h1><p>이 사이트는 검색 수요 기반 애드센스 운영 원칙을 실제 사이트 구조에 반영한 예시입니다.</p></div><section className="strategy-grid"><article><b>01</b><h2>검색 수요 우선</h2><p>트렌드, 자동완성, 뉴스, 방송 소재에서 사람들이 이미 찾는 질문을 고릅니다.</p></article><article><b>02</b><h2>행동 의도 중심</h2><p>신청 방법, 가격, 조건, 비교, 계산처럼 사용자가 다음 행동을 하려는 키워드를 우선합니다.</p></article><article><b>03</b><h2>사람 검수 필수</h2><p>AI 초안은 사용하되 최신 정보, 공식 확인 경로, 표, 체크리스트를 사람이 보강합니다.</p></article><article><b>04</b><h2>정책 안전성</h2><p>광고 클릭 유도, 과장 수익 표현, 근거 없는 금융·법률 단정 표현을 제거합니다.</p></article></section><KeywordScorer /></main>;
}
function StaticPage({ type }: { type: "about" | "privacy" | "terms" | "partnership" }) {
  const data = {
    about: ["ZIP9 생활정보 소개", "ZIP9 생활정보는 전월세, 청약, 대출, 생활 계산 정보를 검색자 눈높이로 정리하는 정보형 미디어입니다."],
    privacy: ["개인정보처리방침", "본 사이트는 문의 처리 등 필요한 범위에서만 개인정보를 수집합니다. 개인정보 보호책임자: 박예준, 문의: apark12321@gmail.com. 광고 서비스 사용 시 제3자 쿠키가 활용될 수 있습니다."],
    terms: ["이용약관", "본 사이트의 정보는 일반적인 생활정보 제공 목적이며, 금융·법률·세무 판단의 최종 근거가 아닙니다. 중요한 계약과 신청 전에는 공식 기관 또는 전문가에게 확인하시기 바랍니다."],
    partnership: ["제휴 및 비즈니스 문의", "광고, 콘텐츠 제휴, 생활정보 데이터 협업 문의는 apark12321@gmail.com으로 보내주세요."]
  }[type];
  return <main className="page-shell narrow"><div className="page-title"><span className="eyebrow">ZIP9</span><h1>{data[0]}</h1><p>{data[1]}</p></div></main>;
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath());
  const [query, setQuery] = useState("");
  const go = (next: Page) => { window.history.pushState(null, "", pathFromPage(next)); setPage(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  useEffect(() => { const onPop = () => setPage(pageFromPath()); window.addEventListener("popstate", onPop); return () => window.removeEventListener("popstate", onPop); }, []);
  const posts = useMemo(() => {
    const sorted = [...MOCK_POSTS].sort((a, b) => b.date.localeCompare(a.date));
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter((post) => `${post.title} ${post.excerpt} ${post.category} ${post.hashtags.join(" ")}`.toLowerCase().includes(q));
  }, [query]);
  const currentPost = page.type === "post" ? MOCK_POSTS.find((post) => slugify(post.title) === page.slug || post.id === page.slug) || null : null;
  useEffect(() => {
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESCRIPTION;
    let canonical = `${SITE_URL}${pathFromPage(page)}`;
    if (page.type === "post" && currentPost) { title = `${currentPost.title} | ${SITE_NAME}`; description = currentPost.excerpt; canonical = `${SITE_URL}/post/${slugify(currentPost.title) || currentPost.id}`; }
    if (page.type === "category") { title = `${page.category} 정보 | ${SITE_NAME}`; description = `${page.category} 관련 생활정보와 체크리스트를 모았습니다.`; }
    if (page.type === "strategy") { title = `운영전략 | ${SITE_NAME}`; description = "검색 수요 기반 애드센스 정보형 사이트 운영전략입니다."; }
    document.title = title;
    setMeta("description", stripHtml(description).slice(0, 160));
    setMeta("og:title", title, "property");
    setMeta("og:description", stripHtml(description).slice(0, 160), "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:title", title);
    setMeta("twitter:description", stripHtml(description).slice(0, 160));
    setCanonical(canonical);
  }, [page, currentPost]);
  return <div><Header go={go} /><div className="search-bar"><label><span>검색</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: 전세보증보험, 청약통장, 이사비용" /></label></div>{page.type === "home" && <Home posts={posts} go={go} />}{page.type === "category" && <CategoryPage category={page.category} go={go} />}{page.type === "post" && currentPost && <PostPage post={currentPost} go={go} />}{page.type === "post" && !currentPost && <Home posts={posts} go={go} />}{page.type === "strategy" && <StrategyPage />}{["about", "privacy", "terms", "partnership"].includes(page.type) && <StaticPage type={page.type as "about" | "privacy" | "terms" | "partnership"} />}<Footer go={go} /></div>;
}
